import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Navbar({ onLogout }) {
  const { user } = useAuth();
  return (
    <header className="app-header">
      <nav>
        <div className="nav-logo">
          <Link to={user ? "/dashboard" : "/"}>Shipay</Link>
        </div>
        <div className="nav-links">
          {user ? (
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