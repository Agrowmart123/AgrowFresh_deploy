import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { LocationProvider } from "./context/LocationContext";
import { ToastProvider } from "./context/ToastContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <LocationProvider>
        <CartProvider>
          <WishlistProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </WishlistProvider>
        </CartProvider>
      </LocationProvider>
    </AuthProvider>
  </React.StrictMode>,
);
