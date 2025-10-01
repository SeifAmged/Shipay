import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaPaperPlane, FaHistory, FaMoneyBillWave, FaEnvelope, FaPhone } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="brand-row">
            <span className="brand-logo">Shipay</span>
            <FaShieldAlt className="brand-icon" />
          </div>
          <p className="brand-tagline">Shipay
          Your secure and simple digital wallet. Manage your funds with ease and confidence — because your money deserves technology that moves as fast as you do.</p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <nav className="links-grid">
            <Link to="/dashboard" className="footer-link">
              <FaShieldAlt />
              <span>Dashboard</span>
            </Link>
            <Link to="/transfer" className="footer-link">
              <FaPaperPlane />
              <span>Transfer</span>
            </Link>
            <Link to="/transactions" className="footer-link">
              <FaHistory />
              <span>Transactions</span>
            </Link>
            <Link to="/funds" className="footer-link">
              <FaMoneyBillWave />
              <span>Deposit & Withdraw</span>
            </Link>
          </nav>
        </div>

        <div className="footer-contact">
          <h4>Contact Us</h4>
          <div className="contact-list">
            <a href="mailto:contact@shipay.test" className="contact-row">
              <FaEnvelope />
              <span>contact@shipay.test</span>
            </a>
            <a href="tel:+201234567890" className="contact-row">
              <FaPhone style={{ transform: 'rotate(0deg)' }} />
              <span>+20 123 456 7890</span>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2025 Shipay | Designed for Trust. Built for Speed.</span>
      </div>
    </footer>
  );
}