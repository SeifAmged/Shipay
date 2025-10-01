// Client-side validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateUsername = (username) => {
  return username && username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
};

export const validateAmount = (amount) => {
  const numAmount = parseFloat(amount);
  return !isNaN(numAmount) && numAmount > 0;
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

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

// Common validation rules
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
