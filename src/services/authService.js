import api from './api';

/**
 * Register a new customer
 */
export const registerCustomer = async (customerData) => {
  try {
    const response = await api.post('/customer/auth/register', customerData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Signup failed!";
  }
};

/**
 * Login a customer
 * Backend expects 'login' and 'password' keys
 */
export const loginCustomer = async (phone, password) => {
  try {
    const response = await api.post('/customer/auth/login', {
      login: phone,
      password: password
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Login failed!";
  }
};

/**
 * Logout a customer
 */
export const logoutCustomer = async () => {
  try {
    // Hyo endpoint Backend chya Controller sobat match pahije
    await api.post('/customer/auth/logout');
  } catch (error) {
    console.error("Logout API error", error);
    throw error;
  }
};
