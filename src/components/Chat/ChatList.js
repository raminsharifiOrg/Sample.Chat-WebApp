import React, { useEffect, useState } from 'react';
import { ListGroup, Container } from 'react-bootstrap';
import userService from '../../services/UserService.js';
import { toast } from 'react-toastify';

function ChatList({ onSelectUser }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {

    if (users.length <= 0)
      userService.contracts().then(response => {
        setUsers(response.data.data);
      }).catch(e => {
        toast.error('Load Contracts failed. Please try again.');
      });

  }, [users]);

  return (
    <Container>
      <h4>Users</h4>
      {
        users.length > 0 ? <ListGroup>
          {users.map((user, index) => (
            <ListGroup.Item key={index} onClick={() => onSelectUser(user)}>
              {user.title}
            </ListGroup.Item>
          ))}
        </ListGroup> : <div>No Contract Found</div>
      }

    </Container>
  );
}

export default ChatList;
