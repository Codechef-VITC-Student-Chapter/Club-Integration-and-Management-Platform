import React, { createContext, useState, useContext, useEffect } from 'react';

const RunningContext = createContext();

export const RunningProvider = ({ children }) => {
  const baseURL = 'http://localhost:3000';
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (token) {
      var payload = JSON.parse(window.atob(token.split('.')[1]));
      setCurrentUser(payload.user_id);
      // setIsAdmin(payload.is_admin);
    } else {
      setCurrentUser();
      // setIsAdmin(false);
    }
  }, [token]);

  return (
    <RunningContext.Provider
      value={{
        baseURL,
        currentUser,
        setCurrentUser,
        isAdmin,
        setIsAdmin,
        token,
        setToken,
      }}
    >
      {children}
    </RunningContext.Provider>
  );
};

export const useRunningContext = () => useContext(RunningContext);
