// Transaction display utility for consistent formatting across all pages

/**
 * Determines if a transaction is outgoing (negative) or incoming (positive)
 * @param {Object} transaction - Transaction object
 * @param {string} currentUsername - Current user's username
 * @returns {Object} - { isOutgoing: boolean, displayAmount: number, displaySign: string }
 */
export const getTransactionDisplayInfo = (transaction, currentUsername) => {
    const { transaction_type, amount, counterparty } = transaction;
    
    let isOutgoing = false;
    let displayAmount = Math.abs(amount);
    let displaySign = '+';
    
    switch (transaction_type) {
        case 'deposit':
            // Deposits are always incoming (positive)
            isOutgoing = false;
            displaySign = '+';
            break;
            
        case 'withdraw':
            // Withdrawals are always outgoing (negative)
            isOutgoing = true;
            displaySign = '-';
            break;
            
        case 'transfer':
            // For transfers, determine if we're the sender or recipient based on amount sign
            // Backend logic: sender gets negative amount, recipient gets positive amount
            if (amount < 0) {
                // We sent money to someone else (outgoing)
                isOutgoing = true;
                displaySign = '-';
            } else {
                // Someone sent money to us (incoming)
                isOutgoing = false;
                displaySign = '+';
            }
            break;
            
        default:
            // Default to positive for unknown types
            isOutgoing = false;
            displaySign = '+';
    }
    
    return {
        isOutgoing,
        displayAmount,
        displaySign,
        formattedAmount: `${displaySign}${displayAmount.toFixed(2)}`,
        cssClass: isOutgoing ? 'amount-negative' : 'amount-positive'
    };
};

/**
 * Formats transaction amount for display
 * @param {Object} transaction - Transaction object
 * @param {string} currentUsername - Current user's username
 * @param {string} currency - Currency symbol (default: 'EGP')
 * @returns {Object} - { formattedText: string, cssClass: string }
 */
export const formatTransactionAmount = (transaction, currentUsername, currency = 'EGP') => {
    const { formattedAmount, cssClass } = getTransactionDisplayInfo(transaction, currentUsername);
    
    return {
        formattedText: `${formattedAmount} ${currency}`,
        cssClass
    };
};

/**
 * Gets transaction type display name
 * @param {Object} transaction - Transaction object
 * @param {string} currentUsername - Current user's username
 * @returns {string} - Display name for transaction type
 */
export const getTransactionTypeDisplay = (transaction, currentUsername) => {
    const { transaction_type, counterparty, amount } = transaction;
    
    switch (transaction_type) {
        case 'deposit':
            return 'Deposit';
        case 'withdraw':
            return 'Withdrawal';
        case 'transfer':
            // For transfers, determine direction based on amount sign
            if (amount < 0) {
                // We sent money to someone else (outgoing)
                return `Transfer to ${counterparty}`;
            } else {
                // Someone sent money to us (incoming)
                return `Transfer from ${counterparty}`;
            }
        default:
            return transaction_type;
    }
};
