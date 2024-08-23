import React, { createContext, useState, useContext, useEffect } from 'react';
import userService from '../services/UserService.js';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [userInfo, setUserInfo] = useState(() => {
    const savedUser = localStorage.getItem('userInfo');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      userService.getUserInfo().then(response => {
        setUserInfo(response.data.data);
        localStorage.setItem('userInfo', JSON.stringify(response.data.data));
      })
        .catch(ex => {

        });
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const loginUser = (userData) => {
    setUser(userData.data.token.accessToken);
    localStorage.setItem('user', JSON.stringify(userData.data.token.accessToken));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
