import api from './http';

// --- Wallet & Transaction Functions ---
const getWallet = () => api.get('wallet/');

const getTransactions = (filters = {}, page = 1) => {
    const params = new URLSearchParams({ page });
    if (filters.transaction_type) params.append('transaction_type', filters.transaction_type);
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    return api.get('transactions/', { params });
};

const deposit = (amount) => {
    return api.post('wallet/deposit/', { amount });
};

const withdraw = (amount) => {
    return api.post('wallet/withdraw/', { amount });
};

const transfer = (recipient_username, amount) => {
    return api.post('wallet/transfer/', { recipient_username, amount });
};

// NEW: Add this function for reveal
const revealBalance = () => api.post('wallet/reveal-balance/', {});

const userService = {
    getWallet,
    getTransactions,
    deposit,
    withdraw,
    transfer,
    revealBalance,  // NEW: Add it here to export
};

export default userService;