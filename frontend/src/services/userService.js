/**
 * User service for wallet and transaction operations.
 * 
 * Provides API methods for:
 * - Wallet information retrieval
 * - Transaction history with filtering and pagination
 * - Financial operations (deposit, withdraw, transfer)
 * - Balance reveal functionality with usage limits
 */

import api from './http';

/**
 * Retrieves the current user's wallet information.
 * 
 * @returns {Promise<Object>} Wallet data including balance and currency
 */
const getWallet = () => api.get('wallet/');

/**
 * Retrieves paginated transaction history with optional filtering.
 * 
 * @param {Object} filters - Filter options
 * @param {string} filters.transaction_type - Filter by transaction type
 * @param {string} filters.start_date - Filter from date (YYYY-MM-DD)
 * @param {string} filters.end_date - Filter to date (YYYY-MM-DD)
 * @param {number} page - Page number for pagination
 * @returns {Promise<Object>} Paginated transaction data
 */
const getTransactions = (filters = {}, page = 1) => {
    const params = new URLSearchParams({ page });
    if (filters.transaction_type) params.append('transaction_type', filters.transaction_type);
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    return api.get('transactions/', { params });
};

/**
 * Deposits funds into the user's wallet.
 * 
 * @param {number} amount - Amount to deposit
 * @returns {Promise<Object>} Updated wallet data
 */
const deposit = (amount) => {
    return api.post('wallet/deposit/', { amount });
};

/**
 * Withdraws funds from the user's wallet.
 * 
 * @param {number} amount - Amount to withdraw
 * @returns {Promise<Object>} Updated wallet data
 */
const withdraw = (amount) => {
    return api.post('wallet/withdraw/', { amount });
};

/**
 * Transfers funds to another user.
 * 
 * @param {string} recipient_username - Username of the recipient
 * @param {number} amount - Amount to transfer
 * @returns {Promise<Object>} Transfer confirmation
 */
const transfer = (recipient_username, amount) => {
    return api.post('wallet/transfer/', { recipient_username, amount });
};

/**
 * Reveals wallet balance with usage limits and fees.
 * 
 * First 3 reveals per day are free, additional reveals cost 10 EGP.
 * 
 * @returns {Promise<Object>} Balance reveal response with usage info
 */
const revealBalance = () => api.post('wallet/reveal-balance/', {});

const userService = {
    getWallet,
    getTransactions,
    deposit,
    withdraw,
    transfer,
    revealBalance,
};

export default userService;