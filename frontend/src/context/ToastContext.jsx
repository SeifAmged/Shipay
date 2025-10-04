/**
 * Toast notification context for managing global toast messages.
 * 
 * Provides toast notification functionality with:
 * - Global toast state management
 * - Auto-dismissal with configurable timeout
 * - Multiple toast types (success, error, warning)
 * - Programmatic show/hide controls
 */

/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext({ show: () => {} });

/**
 * Toast provider component.
 * 
 * Manages global toast notification state and provides
 * toast control methods to child components.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ message: '', type: 'success' });

  /**
   * Hides the current toast notification.
   */
  const hide = useCallback(() => setToast({ message: '', type: 'success' }), []);

  /**
   * Shows a toast notification with optional auto-dismissal.
   * 
   * @param {string} message - Toast message content
   * @param {string} type - Toast type ('success', 'error', 'warning')
   * @param {number} autoCloseMs - Auto-dismiss timeout in milliseconds (0 to disable)
   */
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
      {/* Fixed position toast container */}
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}>
        <Toast message={toast.message} type={toast.type} onClose={hide} />
      </div>
    </ToastContext.Provider>
  );
};

/**
 * Hook to access toast context.
 * 
 * @returns {Object} Toast context value with show function
 */
export const useToast = () => useContext(ToastContext);


