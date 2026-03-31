import axios from "axios";
import {DUMMY_ORDERS} from "../data/Order"

const ordersApi = axios.create({
  baseURL: "http://localhost:8080/api/orders",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

// CUSTOMER ORDERS
export const fetchMyOrders = async () => {
  const res = await ordersApi.get("/my");
  return res.data;
};

// ORDER STATUS
export const fetchOrderStatus = async (orderId) => {
  const res = await ordersApi.get(`/${orderId}/status`);
  return res.data;
};

export function getOrderById(id) {
  return DUMMY_ORDERS.find((o) => o.id === id) || null;
}

export function getAllOrders() {
  return DUMMY_ORDERS;
}

export default ordersApi;