import api from '../services/api';

const shopService = {
  // 1. Get all approved shops (Shops listing page sathi)
  getAllShops: async () => {
    const response = await api.get('/shops/all');
    return response.data; // List of ShopResponse
  },

  // 2. Search/Filter shops (Pincode, City, Keyword nusar)
  searchShops: async (query, city = '', pincode = '', page = 0, size = 20) => {
    const params = { keyword: query, city, pincode, page, size };
    const response = await api.get('/shops/search', { params });
    return response.data; // Page object milto backend kadun
  },

  // 3. Get Single Shop Details
  // Tip: Backend la @GetMapping("/{id}") nase tar Search cha vapar karun filter karu
  getShopDetails: async (shopId) => {
    const response = await api.get(`/shops/search?keyword=${shopId}`);
    return response.data.content.find(s => s.shopId === parseInt(shopId));
  },

  // 4. Create Shop (Vendor Registration sathi)
  createShop: async (shopData) => {
    // shopData ha 'FormData' object asava lagto images sathi
    const response = await api.post('/shops', shopData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // 5. Get Logged-in Vendor's Shop
  getMyShop: async () => {
    const response = await api.get('/shops/my');
    return response.data;
  }
};

export default shopService;