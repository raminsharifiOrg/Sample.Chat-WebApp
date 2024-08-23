import * as signalR from '@microsoft/signalr';
import BaseService from './BaseService';

class ChatService extends BaseService {
    constructor() {
        super();
        this.connection = null;
        this.chatHub = null;
    }

    initializeChatHub() {
        if (this.chatHub) return this.chatHub;

        var Authorization = "";
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            Authorization = `${user}`;
        }


        this.chatHub = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:44361/hubs/chat', {
                transport: signalR.HttpTransportType.WebSockets,
                accessTokenFactory: () => Authorization
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

            this.chatHub.start().catch(err => console.error('Error starting connection: ', err));

        return this.chatHub;
    };

    sendMessageToServer(user, conversationId, message) {
        if (this.chatHub) {
            this.chatHub.invoke('SendMessage', message, conversationId, user)
                .catch(err => console.error('Error sending message: ', err));
        }
    };

    sendTypingNotification(user) {
        if (this.chatHub) {
            this.chatHub.invoke('SendTypingNotification', user)
                .catch(err => console.error('Error sending typing notification: ', err));
        }
    };

    onReceiveMessage(callback) {
        if (this.chatHub) {
            this.chatHub.on('PrivateReceiveMessage', (conversationId, messageSent,messageDate) => {
                callback(conversationId, messageSent,messageDate);
            });
        }
    };

    onReceiveOldMessage(conersationId, callback) {
        if (this.chatHub) {
            this.chatHub.invoke('GetPrivateConversationMessages', conersationId)
                .catch(err => console.error('Error sending typing notification: ', err));

            this.chatHub.on('ReceiveOldMessages', (messages) => {
                callback(messages);
            });
        }
    };

    onTypingNotification(callback) {
        if (this.chatHub) {
            this.chatHub.on('ReceiveTypingNotification', (user) => {
                callback(user);
            });
        }
    };

    startConnection() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:44361/hubs/chat', {
                transport: signalR.HttpTransportType.WebSockets
            }) // Replace with your SignalR hub URL
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        return this.connection.start()
            .then(() => console.log('Connected to the SignalR hub'))
            .catch((error) => console.error('Error connecting to the SignalR hub:', error));
    }

    sendMessage(message) {
        if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
            return this.connection.invoke('SendMessage', message);
        }
    }

    receiveMessage(callback) {
        if (this.connection) {
            this.connection.on('ReceiveMessage', (conversationId, messageSent) => {
                callback(conversationId, messageSent);
            });
        }
    }
}

export default new ChatService();


