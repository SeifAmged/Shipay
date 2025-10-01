import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import { useToast } from '../context/ToastContext';

export default function TransferPage() {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { show } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            await userService.transfer(recipient, amount);
            setMessage('Transfer successful!');
            show('Transfer successful!', 'success');
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            const errMsg = err.response?.data?.error || 'Transfer failed. Please try again.';
            setError(errMsg);
            show(errMsg, 'error');
        }
    };

    return (
        <div className="form-container">
            <h2>Transfer Funds</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Recipient's Username"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    required 
                />
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
                {message && <p style={{color: 'green'}}>{message}</p>}
                <button type="submit">Send Money</button>
            </form>
        </div>
    );
}