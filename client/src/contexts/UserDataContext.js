import React, { createContext, useState, useEffect } from 'react';

export const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  // Directly initialize userData from localStorage
  const [userData, setUserData] = useState(() => {
    const loadedUserData = localStorage.getItem('UserData');
    return loadedUserData ? JSON.parse(loadedUserData) : { fullName: '', email: '', stamps: [] };
  });

  // Effect to save user data to local storage on changes
  useEffect(() => {
    localStorage.setItem('UserData', JSON.stringify(userData));
  }, [userData]);

  return (
    <UserDataContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserDataContext.Provider>
  );
};
