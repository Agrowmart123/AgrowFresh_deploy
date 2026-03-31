import api from './api';

const productService = {
  // Shop ID nusar products fetch karel
  getProductsByShop: async (shopId) => {
    const response = await api.get(`/public/shop/${shopId}/products`);
    return response.data; // Response: { success, shop, products: [{type, data}, ...] }
  },

  // Agri products listing
  getAgriProducts: async () => {
    const response = await api.get('/v1/agri/products');
    return response.data;
  },

  // Single product detail
  getProductById: async (id) => {
    const response = await api.get(`/public/product/${id}`);
    return response.data;
  }
};

export default productService;