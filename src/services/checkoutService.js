import api from './api';

const checkoutService = {
  getSummary: async () => {
    const response = await api.get('/customer/checkout/summary');
    return response.data; 
  },
  applyCoupon: async (couponCode) => {
    const response = await api.post('/customer/checkout/apply-coupon', { couponCode });
    return response.data;
  },
  removeCoupon: async () => {
    const response = await api.delete('/customer/checkout/remove-coupon');
    return response.data;
  },
  selectAddress: async (addressId) => {
    const response = await api.post('/customer/checkout/select-address', { addressId });
    return response.data;
  }
};

export default checkoutService;