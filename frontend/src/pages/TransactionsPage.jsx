import React, { useState, useEffect, useCallback } from 'react';
import userService from '../services/userService';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { formatTransactionAmount, getTransactionTypeDisplay } from '../utils/transactionDisplay';

export default function TransactionsPage() {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [data, setData] = useState({ results: [], count: 0, next: null, previous: null });
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({ transaction_type: '', start_date: '', end_date: '' });
    const [activeFilters, setActiveFilters] = useState(filters);
    const [loading, setLoading] = useState(true);

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const response = await userService.getTransactions(activeFilters, page);
            setData(response.data);
        } catch (error) {
            console.error("Failed to fetch transactions", error);
        } finally {
            setLoading(false);
        }
    }, [activeFilters, page]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleApplyFilters = () => {
        setPage(1);
        setActiveFilters(filters);
    };

    return (
        <motion.div 
            className="transactions-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h2>{t('transactionHistory')}</h2>
            <div className="filter-bar">
                <div className="filter-group">
                    <label>{t('type')}</label>
                    <select name="transaction_type" value={filters.transaction_type} onChange={handleFilterChange}>
                        <option value="">{t('allTypes')}</option>
                        <option value="deposit">{t('deposit')}</option>
                        <option value="withdraw">{t('withdraw')}</option>
                        <option value="transfer">{t('transfer')}</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label>{t('from')}</label>
                    <input type="date" name="start_date" value={filters.start_date} onChange={handleFilterChange} />
                </div>
                <div className="filter-group">
                    <label>{t('to')}</label>
                    <input type="date" name="end_date" value={filters.end_date} onChange={handleFilterChange} />
                </div>
                <button onClick={handleApplyFilters}>{t('apply')}</button>
            </div>

            {loading ? <p>{t('loading')}...</p> : (
                <>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>{t('date')}</th>
                                    <th>{t('time')}</th>
                                    <th>{t('type')}</th>
                                    <th>{t('amount')} (EGP)</th>
                                    <th>{t('counterparty')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.results.map(tx => {
                                    const amountDisplay = formatTransactionAmount(tx, user.username, 'EGP');
                                    const typeDisplay = getTransactionTypeDisplay(tx, user.username);
                                    
                                    return (
                                        <tr key={tx.id}>
                                            <td>{new Date(tx.created_at).toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: '2-digit', 
                                                day: '2-digit' 
                                            })}</td>
                                            <td>{new Date(tx.created_at).toLocaleTimeString('en-US', { 
                                                hour: '2-digit', 
                                                minute: '2-digit',
                                                hour12: true 
                                            })}</td>
                                            <td>{typeDisplay}</td>
                                            <td className={amountDisplay.cssClass}>
                                                {amountDisplay.formattedText}
                                            </td>
                                            <td>{tx.counterparty || '—'}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="pagination">
                        <button onClick={() => setPage(page - 1)} disabled={!data.previous}>
                            {t('previous')}
                        </button>
                        <span>{t('page')} {page} {t('of')} {Math.ceil(data.count / 10)}</span>
                        <button onClick={() => setPage(page + 1)} disabled={!data.next}>
                            {t('next')}
                        </button>
                    </div>
                </>
            )}
        </motion.div>
    );
}