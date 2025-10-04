/**
 * Transaction display utilities for consistent formatting across the application.
 * 
 * Provides functions for:
 * - Determining transaction direction (incoming/outgoing)
 * - Formatting transaction amounts with proper signs
 * - Generating display text and CSS classes
 * - Creating user-friendly transaction type descriptions
 */

/**
 * Determines transaction direction and formatting information.
 * 
 * Analyzes transaction data to determine if it represents money coming in
 * or going out from the user's perspective, with appropriate formatting.
 * 
 * @param {Object} transaction - Transaction object from API
 * @param {string} currentUsername - Current user's username for context
 * @returns {Object} Display information object
 * @returns {boolean} returns.isOutgoing - Whether transaction represents outgoing money
 * @returns {number} returns.displayAmount - Absolute amount for display
 * @returns {string} returns.displaySign - Sign to display ('+' or '-')
 * @returns {string} returns.formattedAmount - Formatted amount string
 * @returns {string} returns.cssClass - CSS class for styling
 */
export const getTransactionDisplayInfo = (transaction, currentUsername) => {
    const { transaction_type, amount, counterparty } = transaction;
    
    let isOutgoing = false;
    let displayAmount = Math.abs(amount);
    let displaySign = '+';
    
    switch (transaction_type) {
        case 'deposit':
            // Deposits always represent money coming in
            isOutgoing = false;
            displaySign = '+';
            break;
            
        case 'withdraw':
            // Withdrawals always represent money going out
            isOutgoing = true;
            displaySign = '-';
            break;
            
        case 'transfer':
            // Transfer direction determined by amount sign
            // Backend: sender gets negative amount, recipient gets positive
            if (amount < 0) {
                // User sent money to someone else
                isOutgoing = true;
                displaySign = '-';
            } else {
                // Someone sent money to user
                isOutgoing = false;
                displaySign = '+';
            }
            break;
            
        default:
            // Default to positive for unknown transaction types
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
 * Formats transaction amount with currency for display.
 * 
 * @param {Object} transaction - Transaction object from API
 * @param {string} currentUsername - Current user's username for context
 * @param {string} currency - Currency symbol (default: 'EGP')
 * @returns {Object} Formatted amount information
 * @returns {string} returns.formattedText - Formatted amount with currency
 * @returns {string} returns.cssClass - CSS class for styling
 */
export const formatTransactionAmount = (transaction, currentUsername, currency = 'EGP') => {
    const { formattedAmount, cssClass } = getTransactionDisplayInfo(transaction, currentUsername);
    
    return {
        formattedText: `${formattedAmount} ${currency}`,
        cssClass
    };
};

/**
 * Generates user-friendly transaction type display text.
 * 
 * Creates descriptive text that clearly indicates the transaction
 * direction and counterparty for better user understanding.
 * 
 * @param {Object} transaction - Transaction object from API
 * @param {string} currentUsername - Current user's username for context
 * @returns {string} Human-readable transaction type description
 */
export const getTransactionTypeDisplay = (transaction, currentUsername) => {
    const { transaction_type, counterparty, amount } = transaction;
    
    switch (transaction_type) {
        case 'deposit':
            return 'Deposit';
        case 'withdraw':
            return 'Withdrawal';
        case 'transfer':
            // Determine transfer direction based on amount sign
            if (amount < 0) {
                // User sent money to someone else
                return `Transfer to ${counterparty}`;
            } else {
                // Someone sent money to user
                return `Transfer from ${counterparty}`;
            }
        default:
            return transaction_type;
    }
};
