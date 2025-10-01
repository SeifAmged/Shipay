/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext({ show: () => {} });

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const hide = useCallback(() => setToast({ message: '', type: 'success' }), []);

  const show = useCallback((message, type = 'success', autoCloseMs = 3000) => {
    setToast({ message, type });
    if (autoCloseMs) {
      window.clearTimeout(show._t);
      show._t = window.setTimeout(() => hide(), autoCloseMs);
    }
  }, [hide]);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}>
        <Toast message={toast.message} type={toast.type} onClose={hide} />
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);


