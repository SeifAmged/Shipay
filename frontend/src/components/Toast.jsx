import { AnimatePresence } from "framer-motion";
import "../styles/toast.css";
export default function Toast({ message, type, onClose }) {
  return (
    <AnimatePresence>
      {message && (
        <div
          className={`toast ${type}`}
        >
          <div className="toast-content">
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