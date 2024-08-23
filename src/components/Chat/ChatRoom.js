import React, { useState, useEffect, useContext } from 'react';
import * as signalR from '@microsoft/signalr';
import { Form, Button, Container } from 'react-bootstrap';
import { toast } from 'react-toastify';
import chatService from '../../services/ChatService.js';
import { UserContext } from '../../context/UserContext';

function ChatRoom({ selectedUser }) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [connection, setConnection] = useState(null);
    const { userInfo } = useContext(UserContext);

    useEffect(() => {
        const connectToHub = async () => {
            const connection = await chatService.initializeChatHub();

            const uTitle = selectedUser.title;

            chatService.onReceiveMessage((conversationId, messageSent, messageDate) => {
                if (messageSent && (conversationId && conversationId == selectedUser.conversationId))
                    setMessages((prevMessages) => [...prevMessages, { user: uTitle, message: messageSent, messageDate: messageDate }]);
            });

            setConnection(connection);
        };

        connectToHub();

        return () => {
            if (connection) {
                connection.stop();
            }
        };
    }, []);

    useEffect(() => {
        setTimeout(() => {
            if (connection && connection.state === signalR.HubConnectionState.Connected) {
                chatService.onReceiveOldMessage(selectedUser.conversationId, (rMessages) => {
                    setMessages(sortMessagesByDate(rMessages));
                })
            }
        }, 2000)
    }, [connection]);

    const sortMessagesByDate = (messages) => {
        return messages.slice().sort((a, b) => new Date(a.messageDate) - new Date(b.messageDate)).map(item => {

            return {
                user: item.userDisplayName,
                message: item.text,
                messageDate: item.messageDate
            }
        });
    };

    const sendMessage = async () => {
        if (connection && connection) {
            chatService.sendMessageToServer(selectedUser.userId, selectedUser.conversationId, message);
            receiveMessage("Me" , message, (new Date().toISOString()));
            setMessage('');
        }
    };

    const receiveMessage = (user, message, messageDate) => {
        setMessages((prevMessages) => [...prevMessages, { user, message, messageDate }]);
    };

    const getUniqueObjects = (arr) => {
        const uniqueMap = new Map();

        arr.forEach(item => {
            const key = `${item.user}|${item.message}|${item.messageDate}`;
            if (!uniqueMap.has(key)) {
                uniqueMap.set(key, item);
            }
        });

        return Array.from(uniqueMap.values());
    };

    const uniqueArray = getUniqueObjects(messages);

    return (
        <Container>
            <h4>Chat with {selectedUser.title}</h4>
            <div>
                {uniqueArray.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.user}:</strong> {msg.message}
                    </div>
                ))}
            </div>
            <Form onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
                <Form.Group>
                    <Form.Control
                        type="text"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Send
                </Button>
            </Form>
        </Container>
    );
}

export default ChatRoom;
