/**
 * Toast notification component for displaying user feedback.
 * 
 * Renders animated toast messages with:
 * - Different visual styles based on message type
 * - Icons for success, error, and warning states
 * - Close button for manual dismissal
 * - Smooth animations using Framer Motion
 */

import { AnimatePresence } from "framer-motion";
import "../styles/toast.css";

/**
 * @param {Object} props - Component props
 * @param {string} props.message - Toast message content
 * @param {string} props.type - Toast type ('success', 'error', 'warning')
 * @param {Function} props.onClose - Callback function to close the toast
 */
export default function Toast({ message, type, onClose }) {
  return (
    <AnimatePresence>
      {message && (
        <div className={`toast ${type}`}>
          <div className="toast-content">
            {/* Type-specific icons */}
            {type === "success" && "✅"}
            {type === "error" && "❌"}
            {type === "warning" && "⚠️"}
            <span>{message}</span>
          </div>
          <button className="toast-close" onClick={onClose}>
            ✖
          </button>
        </div>
      )}
    </AnimatePresence>
  );
}