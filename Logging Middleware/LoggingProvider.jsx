import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getLogs, saveLogs } from '../utils/storage';

const LoggingContext = createContext(null);

export const LoggingProvider = ({ children }) => {
  const [logs, setLogs] = useState(getLogs());

  useEffect(() => {
    saveLogs(logs);
  }, [logs]);

  // THE ONLY allowed logger in the app
  const log = (level, message, meta = {}) => {
    const entry = {
      id: uuidv4(),
      level, // 'info' | 'error' | 'event'
      message,
      meta,
      ts: Date.now()
    };
    setLogs(prev => [entry, ...prev]);
    // do not call console.log anywhere
  };

  const clearLogs = () => setLogs([]);

  return (
    <LoggingContext.Provider value={{ logs, log, clearLogs }}>
      {children}
    </LoggingContext.Provider>
  );
};

export const useLogging = () => {
  const ctx = useContext(LoggingContext);
  if (!ctx) {
    throw new Error('useLogging must be used inside LoggingProvider');
  }
  return ctx;
};