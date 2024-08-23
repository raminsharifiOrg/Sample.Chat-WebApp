// import React, { useState, useContext } from 'react';
// import { Row, Col, Container } from 'react-bootstrap';
// import ChatList from '../components/Chat/ChatList';
// import ChatRoom from '../components/Chat/ChatRoom';
// import { UserContext } from '../context/UserContext';

// function ChatPage() {
//   const [selectedUser, setSelectedUser] = useState(null);
//   const { user } = useContext(UserContext);

//   if (!user) {
//     return <h4>Please log in to access the chat</h4>;
//   }

//   return (
//     <Container>
//       <Row>
//         <Col md={4}>
//           <ChatList onSelectUser={setSelectedUser} />
//         </Col>
//         <Col md={8}>
//           {selectedUser ? (
//             <ChatRoom selectedUser={selectedUser} />
//           ) : (
//             <h4>Select a user to start chatting</h4>
//           )}
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default ChatPage;

import React, { useState, useContext, useEffect } from 'react';
import { Row, Col, Container, Spinner } from 'react-bootstrap';
import ChatList from '../components/Chat/ChatList';
import ChatRoom from '../components/Chat/ChatRoom';
import { UserContext } from '../context/UserContext';

function ChatPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);

  if (!user) {
    return <h4>Please log in to access the chat</h4>;
  }

  return (
    <Container>
      <Row>
        <Col md={4}>
          <ChatList onSelectUser={setSelectedUser} />
        </Col>
        <Col md={8}>
          {selectedUser ? (
            <>
              {loading && <Spinner animation="border" />}
              <ChatRoom 
                selectedUser={selectedUser} 
                messages={messages}
              />
              {typing && <div>Typing...</div>}
            </>
          ) : (
            <h4>Select a user to start chatting</h4>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ChatPage;
