import React, { createContext, useState, useContext, useEffect } from 'react';

const RunningContext = createContext();

export const RunningProvider = ({ children }) => {
  const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState();
  const [isAdmin, setIsAdmin] = useState(false);

  const handleError = (task, error) => {
    if (error == 'Invalid Token') {
      localStorage.removeItem('token');
      setToken(null);
    }
    console.log(`Error in task ${task} : ${error}`);
  };

  useEffect(() => {
    if (token) {
      var payload = JSON.parse(window.atob(token.split('.')[1]));
      setCurrentUser(payload.id);
      setIsAdmin(payload.isLead);
    } else {
      setCurrentUser();
      setIsAdmin(false);
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
        handleError,
      }}
    >
      {children}
    </RunningContext.Provider>
  );
};

export const useRunningContext = () => useContext(RunningContext);
