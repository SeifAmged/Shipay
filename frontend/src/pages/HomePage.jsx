/**
 * Homepage component for the Shipay application.
 * 
 * Displays the landing page with:
 * - Welcome message and branding
 * - Promotional content for new users
 * - Call-to-action buttons for registration and login
 * - Welcome bonus information
 */

import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="homepage-container">
      <div className="homepage-content">
        <h1>
          Welcome to Shipay — your wallet of the future.
        </h1>
        <p className="promo-text">
          💸 Start your digital journey with a gift!
          <br/>
          New users get an instant <strong>1000 EGP</strong> welcome bonus — but only for a limited time!
        </p>
        <div className="homepage-actions">
          <Link to="/register" className="button primary-action">🚀 Claim My Bonus</Link>
          <Link to="/login" className="button secondary-action">I Already Have an Account</Link>
        </div>
      </div>
    </div>
  );
}