import axios from "axios";

// ─── BASE CONFIG ─────────────────────────────────────────────────────────────
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.agrowmartindia.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach Bearer token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global 401 → redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export const registerCustomer = (data) =>
  api.post("/customer/auth/register", data);

export const loginCustomer = (data) =>
  api.post("/customer/auth/login", data);

/**
 * GET /customer/auth/me
 * Returns: CustomerProfileResponse {
 *   id, fullName, email, phone, gender, profileImage,
 *   phoneVerified, dateOfBirth, kycCompleted
 * }
 */
export const getCustomerProfile = () =>
  api.get("/customer/auth/me");

/**
 * PATCH /customer/auth/update-profile
 * consumes: multipart/form-data
 *
 * Backend @RequestPart names (from CustomerAuthController.java line 170-177):
 *   "fullName"      → String
 *   "email"         → String
 *   "gender"        → String
 *   "profileImage"  → MultipartFile  (optional — include only if uploading image here)
 *   "phone"         → String         ⚠️ NOTE: backend variable is newPhone but @RequestPart key is "phone"
 *                                       HOWEVER: backend returns 400 if phone is non-empty (line 186-188)
 *                                       → DO NOT send phone in this call; use upload-photo for photos
 *   "dateOfBirth"   → String         ISO yyyy-MM-dd format (LocalDate.parse)
 *   "agreeTerms"    → Boolean
 *
 * ⚠️  KNOWN BACKEND BUG (line 186-188 in controller):
 *      if (newPhone != null && !newPhone.trim().isEmpty()) return 400
 *      This means phone CANNOT be updated via this endpoint right now.
 *      Omit phone from this call entirely until backend is fixed.
 *
 * @param {{
 *   fullName?: string,
 *   email?: string,
 *   gender?: string,
 *   dateOfBirth?: string,   ← ISO yyyy-MM-dd
 *   agreeTerms?: boolean,
 *   profileImageFile?: File ← pass raw File only if you want to update photo here
 * }} fields
 */
export const updateCustomerProfile = (fields) => {
  const form = new FormData();

  // Only append defined, non-empty values to avoid Spring @RequestPart binding errors
  const appendStr = (key, val) => {
    if (val != null && String(val).trim() !== "")
      form.append(key, String(val).trim());
  };

  // Exact @RequestPart keys from CustomerAuthController.java
  appendStr("fullName",    fields.fullName);
  appendStr("email",       fields.email);
  appendStr("gender",      fields.gender);
  appendStr("dateOfBirth", fields.dateOfBirth); // LocalDate.parse() on backend
  if (fields.agreeTerms !== undefined) {
  form.append("agreeTerms", fields.agreeTerms);
} else {
  form.append("agreeTerms", true); // fallback
}

  // ⚠️ "phone" intentionally omitted — backend returns 400 if phone is sent
  // ⚠️ No Content-Type header — browser auto-sets multipart/form-data + boundary

  return api.patch("/customer/auth/update-profile", form);
};

/**
 * POST /customer/auth/upload-photo
 * consumes: multipart/form-data
 * @RequestParam("photo") MultipartFile  ← exact key from controller line 141
 * Returns: plain string URL
 *
 * @param {File} file
 */
export const uploadProfilePhoto = (file) => {
  const form = new FormData();
  form.append("photo", file); // must be "photo" — @RequestParam("photo")
  // ⚠️ No manual Content-Type — browser auto-sets multipart/form-data with correct boundary
  return api.post("/customer/auth/upload-photo", form);
};

export const forgotPassword = ({ email }) =>
  api.post("/customer/auth/forgot-password", { email });

export const resetPassword = (data) =>
  api.post("/customer/auth/reset-password", data);

export const deleteCustomerAccount = () =>
  api.delete("/customer/auth/delete");

// ─── ADDRESS ─────────────────────────────────────────────────────────────────

export const addAddress = (data) =>
  api.post("/customer/addresses", data);

// ─── BANK DETAILS ─────────────────────────────────────────────────────────────

export const addBankDetails    = (data)      => api.post("/customer/auth/bank-details", data);
export const getBankDetails    = ()          => api.get("/customer/auth/bank-details");
export const updateBankDetail  = (id, data)  => api.put(`/customer/auth/bank-details/${id}`, data);
export const deleteBankDetail  = (id)        => api.delete(`/customer/auth/bank-details/${id}`);

// ─── WISHLIST ─────────────────────────────────────────────────────────────────

export const addToWishlist      = (data)    => api.post("/customer/wishlist/add", data);
export const removeFromWishlist = (data)    => api.delete("/customer/wishlist/remove", { data });
export const checkWishlist      = (params)  => api.get("/customer/wishlist/check", { params });

// ─── SHOPS ───────────────────────────────────────────────────────────────────

export const searchShops              = (params) => api.get("/shops/search", { params });
export const getAllShops               = ()       => api.get("/shops/all");
export const getPopularShops          = ()       => api.get("/shops/popular");
export const getNearbyShops           = ()       => api.get("/shops/near-me");
export const getPopularShopsPaginated = (params) => api.get("/shops/popular/paginated", { params });

// ─── PUBLIC ──────────────────────────────────────────────────────────────────

export const getHomeData             = ()       => api.get("/public/home");
export const getPublicProducts       = ()       => api.get("/public/products");
export const getPublicPopularShops   = ()       => api.get("/public/popular-shops");
export const getTop10PopularShops    = ()       => api.get("/public/top10-popular-shops");
export const getRecentlyAdded        = ()       => api.get("/public/recently-added");
export const getFilteredProducts     = (params) => api.get("/public/filtered-products", { params });
export const getCategories           = ()       => api.get("/public/categories");
export const getProductById          = (id)     => api.get(`/public/product/${id}`);
export const getShopProducts         = (shopId) => api.get(`/public/shop/${shopId}/products`);

// ─── FARMER PRODUCTS ─────────────────────────────────────────────────────────

export const getAllFarmerProducts      = ()         => api.get("/farmer/products");
export const getFarmerProductById     = (id)        => api.get(`/farmer/products/${id}`);
export const getProductsByFarmer      = (farmerId)  => api.get(`/farmer/products/farmer/${farmerId}`);
export const getRecentFarmerProducts  = ()          => api.get("/farmer/products/recent");
export const getPopularFarmerProducts = ()          => api.get("/farmer/products/popular");
export const searchFarmerProducts     = (params)    => api.get("/farmer/products/search", { params });

// ─── CUSTOMER PRODUCTS ───────────────────────────────────────────────────────

export const getCustomerShopProducts  = (shopId)    => api.get(`/products/shop/${shopId}`);
export const getCustomerProductById   = (id)        => api.get(`/products/product/${id}`);
export const searchProducts           = (params)    => api.get("/products/search", { params });
export const getPopularProducts       = (limit = 10)=> api.get("/products/popular", { params: { limit } });

// ─── CART ────────────────────────────────────────────────────────────────────

export const addToCart      = (data)   => api.post("/customer/cart/add", data);
export const updateCartItem = (data)   => api.patch("/customer/cart/update", data);
export const removeCartItem = (itemId) => api.delete(`/customer/cart/remove/${itemId}`);
export const getCart        = ()       => api.get("/customer/cart");
export const clearCart      = ()       => api.delete("/customer/cart/clear");

// ─── ORDERS ──────────────────────────────────────────────────────────────────

export const placeOrder         = (data)          => api.post("/orders/create", data);
export const placeOrderFromCart = (data)          => api.post("/orders/create-from-cart", data);
export const getMyOrders        = ()              => api.get("/orders/my");
export const cancelOrder        = (orderId, data) => api.post(`/orders/cancel/${orderId}`, data);
export const getOrderStatus     = (orderId)       => api.get(`/orders/${orderId}/status`);
export const refreshDeliveryQR  = (orderId)       => api.post(`/orders/${orderId}/customer/refresh-delivery-qr`);

export default api;