// Input validation utilities for enhanced security

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateUsername = (username: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (username.length < 3 || username.length > 30) {
    errors.push('Username must be between 3 and 30 characters');
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, and underscores');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateCharacterName = (name: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (name.length < 1 || name.length > 100) {
    errors.push('Character name must be between 1 and 100 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateCharacterDescription = (description: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (description.length > 1000) {
    errors.push('Character description must not exceed 1000 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateChatMessage = (message: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (message.trim().length < 1) {
    errors.push('Message cannot be empty');
  }
  
  if (message.length > 2000) {
    errors.push('Message must not exceed 2000 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};