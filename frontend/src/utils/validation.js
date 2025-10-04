/**
 * Client-side validation utilities for form input validation.
 * 
 * Provides validation functions for:
 * - Email format validation
 * - Password strength requirements
 * - Username format and length validation
 * - Amount validation for financial operations
 * - Required field validation
 * - Form validation with custom rules
 */

/**
 * Validates email address format.
 * 
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email format is valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password meets minimum requirements.
 * 
 * @param {string} password - Password to validate
 * @returns {boolean} True if password is at least 6 characters
 */
export const validatePassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Validates username format and length.
 * 
 * @param {string} username - Username to validate
 * @returns {boolean} True if username is valid (3+ chars, alphanumeric + underscore)
 */
export const validateUsername = (username) => {
  return username && username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
};

/**
 * Validates amount is a positive number.
 * 
 * @param {string|number} amount - Amount to validate
 * @returns {boolean} True if amount is a valid positive number
 */
export const validateAmount = (amount) => {
  const numAmount = parseFloat(amount);
  return !isNaN(numAmount) && numAmount > 0;
};

/**
 * Validates field is not empty after trimming.
 * 
 * @param {string} value - Value to validate
 * @returns {boolean} True if value is not empty
 */
export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

/**
 * Validates form data against specified validation rules.
 * 
 * @param {Object} formData - Form data object to validate
 * @param {Object} rules - Validation rules object
 * @returns {Object} Validation result
 * @returns {boolean} returns.isValid - Whether form is valid
 * @returns {Object} returns.errors - Object containing field errors
 */
export const validateForm = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = formData[field];
    const fieldRules = rules[field];
    
    fieldRules.forEach(rule => {
      if (rule.required && !validateRequired(value)) {
        errors[field] = rule.message || `${field} is required`;
        return;
      }
      
      if (value && rule.validator && !rule.validator(value)) {
        errors[field] = rule.message || `${field} is invalid`;
        return;
      }
    });
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Predefined validation rules for common form types.
 * 
 * Contains validation rule sets for:
 * - User login form
 * - User registration form
 * - Money transfer form
 * - Deposit/withdrawal forms
 */
export const validationRules = {
  login: {
    username: [
      { required: true, message: 'Username is required' }
    ],
    password: [
      { required: true, message: 'Password is required' }
    ]
  },
  register: {
    username: [
      { required: true, message: 'Username is required' },
      { validator: validateUsername, message: 'Username must be at least 3 characters and contain only letters, numbers, and underscores' }
    ],
    password: [
      { required: true, message: 'Password is required' },
      { validator: validatePassword, message: 'Password must be at least 6 characters' }
    ],
    first_name: [
      { required: true, message: 'First name is required' }
    ],
    last_name: [
      { required: true, message: 'Last name is required' }
    ],
    email: [
      { required: true, message: 'Email is required' },
      { validator: validateEmail, message: 'Please enter a valid email address' }
    ]
  },
  transfer: {
    recipient_username: [
      { required: true, message: 'Recipient username is required' },
      { validator: validateUsername, message: 'Please enter a valid username' }
    ],
    amount: [
      { required: true, message: 'Amount is required' },
      { validator: validateAmount, message: 'Please enter a valid amount greater than 0' }
    ]
  },
  deposit: {
    amount: [
      { required: true, message: 'Amount is required' },
      { validator: validateAmount, message: 'Please enter a valid amount greater than 0' }
    ]
  },
  withdraw: {
    amount: [
      { required: true, message: 'Amount is required' },
      { validator: validateAmount, message: 'Please enter a valid amount greater than 0' }
    ]
  }
};
