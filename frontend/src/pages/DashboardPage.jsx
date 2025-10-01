import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import userService from '../services/userService';
import { Link } from 'react-router-dom';
import { FaPaperPlane, FaHistory, FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { formatTransactionAmount, getTransactionTypeDisplay } from '../utils/transactionDisplay';

export default function DashboardPage() {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [wallet, setWallet] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [revealedBalance, setRevealedBalance] = useState(null); 
    const [isRevealed, setIsRevealed] = useState(false); 
    const [popupMessage, setPopupMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const walletRes = await userService.getWallet();
                setWallet(walletRes.data);
                const transactionsRes = await userService.getTransactions();
                setTransactions(transactionsRes.data.results.slice(0, 5));
            } catch {
                setError('Failed to fetch data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleToggleReveal = async () => {
        if (!isRevealed) {
            // Only send request when revealing (from hidden to visible)
            try {
                const response = await userService.revealBalance();
                setRevealedBalance(response.data.balance);
                if (response.data.fee_deducted) {
                    setPopupMessage('10 EGP deducted for balance reveal.');
                } else {
                    const left = response.data.free_reveals_left;
                    setPopupMessage(t('freeRevealsLeft').replace('{count}', left));
                }
                setTimeout(() => setPopupMessage(''), 3000);
            } catch (err) {
                console.error('Reveal error details:', err.response ? err.response : err);
                const errorMessage = err.response?.data?.error || 'Failed to reveal balance.';
                
                if (errorMessage.includes('insufficient') || errorMessage.includes('balance')) {
                    setPopupMessage(t('insufficientBalance'));
                    setTimeout(() => setPopupMessage(''), 3000);
                } else {
                    setError(errorMessage);
                }
                return;  // If error, don't change the state
            }
        }
        // Always toggle the state (reveal or hide)
        setIsRevealed(!isRevealed);
    };

    if (loading) return <p>{t('loading')}...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="dashboard-container">
            {user && <h2>{t('welcome')}, {user.username}!</h2>}
            
            {wallet && (
                <div className="balance-card">
                    <h4>{t('yourBalance')}</h4>
                    <p>{isRevealed ? `${revealedBalance} ${wallet.currency}` : '*****'}</p>
                    <motion.button 
                        onClick={handleToggleReveal}
                        className="reveal-button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}
                    >
                        {isRevealed ? <FaEye /> : <FaEyeSlash />}  {/* Starts with FaEyeSlash (hidden) */}
                    </motion.button>
                    <p style={{ fontSize: '1rem', fontWeight: 'bold', color: '#333', marginTop: '0.5rem', textAlign: 'center' }}>
                        {t('firstRevealsFree')}
                    </p>
                </div>
            )}

            {/* Popup: optimized, top-right, with slide-in + fade motion */}
            {popupMessage && (
                <div 
                    className={`popup-toast ${popupMessage.includes('deducted') ? 'danger' : 'info'}`}
                >
                    {popupMessage}
                </div>
            )}

            <div className="quick-actions">
                <Link to="/transfer" className="button">
                    <FaPaperPlane /> {t('sendMoney')}
                </Link>
                <Link to="/transactions" className="button secondary">
                    <FaHistory /> {t('viewHistory')}
                </Link>
            </div>

            <div className="recent-activity">
                <h3>{t('recentActivity')}</h3>
                <table>
                    <thead>
                        <tr><th>{t('date')}</th><th>{t('type')}</th><th>{t('amount')}</th></tr>
                    </thead>
                    <tbody>
                        {transactions.length > 0 ? transactions.map((tx) => {
                            const amountDisplay = formatTransactionAmount(tx, user.username, wallet?.currency);
                            const typeDisplay = getTransactionTypeDisplay(tx, user.username);
                            
                            return (
                                <tr key={tx.id}>
                                    <td>{new Date(tx.created_at).toLocaleDateString()}</td>
                                    <td>{typeDisplay}</td>
                                    <td className={amountDisplay.cssClass}>
                                        {amountDisplay.formattedText}
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr><td colSpan="3">{t('noTransactions')}</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
