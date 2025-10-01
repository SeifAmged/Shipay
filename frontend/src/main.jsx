import React from 'react'
import ReactDOM from 'react-dom/client'
/* eslint-disable react-refresh/only-export-components */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.jsx'
import './index.css' 
import FundsPage from './pages/FundsPage';
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { LanguageProvider } from './context/LanguageContext'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import TransferPage from './pages/TransferPage'
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
            <Route path="transfer" element={<ProtectedRoute><TransferPage /></ProtectedRoute>} />
            <Route path="funds" element={<ProtectedRoute><FundsPage /></ProtectedRoute>} />
            </Route>
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
)