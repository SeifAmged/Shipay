import React, { useState } from 'react';
import userService from '../services/userService';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';

// A reusable form component for deposit and withdraw
const FundActionForm = ({ action, title }) => {
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { show } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const response = await action(amount);
            const successMsg = `Success! Your new balance is ${response.data.balance} EGP.`;
            setMessage(successMsg);
            show(successMsg, 'success');
            setAmount('');
        } catch (err) {
            const errMsg = err.response?.data?.error || `Failed to perform ${title.toLowerCase()}.`;
            setError(errMsg);
            show(errMsg, 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>{title}</h3>
            <input
                type="number"
                placeholder="Amount (EGP)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0.01"
                step="0.01"
            />
            {error && <p className="error-message">{error}</p>}
            {message && <p style={{ color: 'green', fontSize: '0.9rem' }}>{message}</p>}
            <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                {title}
            </motion.button>
        </form>
    );
};

export default function FundsPage() {
    return (
        <motion.div
            className="form-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <h2>Manage Funds</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <FundActionForm action={userService.deposit} title="Deposit" />
                <FundActionForm action={userService.withdraw} title="Withdraw" />
            </div>
        </motion.div>
    );
}