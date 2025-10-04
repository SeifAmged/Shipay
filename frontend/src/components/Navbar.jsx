/**
 * Navigation bar component for the Shipay application.
 * 
 * Renders authentication-aware navigation with:
 * - Brand logo that links to appropriate landing page
 * - Conditional menu items based on authentication state
 * - Logout functionality for authenticated users
 * - Login/register links for unauthenticated users
 */

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * @param {Object} props - Component props
 * @param {Function} props.onLogout - Callback function to handle user logout
 */
export default function Navbar({ onLogout }) {
  const { user } = useAuth();
  
  return (
    <header className="app-header">
      <nav>
        {/* Brand logo with conditional routing */}
        <div className="nav-logo">
          <Link to={user ? "/dashboard" : "/"}>Shipay</Link>
        </div>
        
        {/* Navigation links based on authentication state */}
        <div className="nav-links">
          {user ? (
            // Authenticated user navigation
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/transfer">Transfer</Link>
              <Link to="/funds">Funds</Link>
              <Link to="/transactions">Transactions</Link>
              <button
                onClick={onLogout}
                className="logout-button"
              >
                Logout
              </button>
            </>
          ) : (
            // Unauthenticated user navigation
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}