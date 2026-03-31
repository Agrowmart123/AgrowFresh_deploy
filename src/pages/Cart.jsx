import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Minus, Plus, Trash2 } from "lucide-react";
import Lottie from "lottie-react";
import emptyCart from "../data/EmptyCart.json";
import { useAuth } from "../context/AuthContext";

export default function Cart() {
  // const { cartItems, removeFromCart, updateQuantity, placeOrder } = useCart();
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const { user } = useAuth();

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const totalOld = cartItems.reduce(
    (acc, item) => acc + (item.oldPrice ?? item.price) * item.quantity,
    0,
  );

  const discount = totalOld - totalPrice;

  function handleDecrement(item) {
    if (item.quantity <= 1) {
      removeFromCart(item.id);
    } else {
      updateQuantity(item.id, item.quantity - 1);
    }
  }

 function handleConfirmOrder() {

  if (!user) {
    navigate("/login");
    return;
  }

  const selectedIds = cartItems.map((item) => item.id); 

  setShowPopup(false);

  navigate("/checkout", { state: { selectedIds } });
}
  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">

        {/* CART ITEMS */}
        <div className="col-span-3 flex items-center justify-center">
          {cartItems.length === 0 ? (
            // <div className="bg-white p-6 rounded-xl shadow text-center">
            //   <p className="text-gray-500">Your cart is empty</p>
            // </div>
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
              <div style={{ width: 200 }}>
              <Lottie animationData={emptyCart} loop={true} />
            </div>
            <p className="text-lg font-semibold text-muted-foreground">Your cart is empty</p>
            <button onClick={() => navigate("/")} className="px-6 py-2.5 rounded-full bg-[#68911a] text-primary-foreground text-white font-bold text-sm hover:opacity-90 transition-opacity">
              Continue Shopping
            </button>
          </div>
          ):(
            <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-3">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-xl shadow flex flex-col sm:flex-row gap-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />

              <div className="flex-1">
                <h2 className="font-semibold text-gray-800">{item.name}</h2>

                <div className="flex items-center gap-3 mt-2">
                  <span className="font-bold text-[#68911a]">₹{item.price}</span>
                  {item.oldPrice && item.oldPrice !== item.price && (
                    <span className="line-through text-gray-400">₹{item.oldPrice}</span>
                  )}
                  {item.discount > 0 && (
                    <span className="text-[#68911a] text-sm">{item.discount}% off</span>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-4 flex-wrap">
                  {/* Quantity stepper */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDecrement(item)}
                      className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5 text-gray-700" />
                    </button>
                    <span className="text-sm font-extrabold text-gray-800 w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full bg-[#68911a] text-white flex items-center justify-center hover:bg-lime-600 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button className="text-[#68911a] text-sm">Save for later</button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 text-sm"
                  >
                    <Trash2 className="w-5 h-5"/>
                  </button>
                  {/* <button className="text-gray-600 text-sm">Buy this now</button> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PRICE DETAILS */}
        <div className="bg-white p-5 rounded-xl shadow h-fit">
          <h2 className="font-semibold text-gray-700 border-b pb-3">PRICE DETAILS</h2>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Price ({cartItems.length} items)</span>
              <span>₹{totalOld.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#68911a]">
              <span>Discount</span>
              <span>- ₹{discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="text-[#68911a]">FREE</span>
            </div>
            <hr />
            <div className="flex justify-between font-bold text-lg">
              <span>Total Amount</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <p className="text-[#68911a] text-sm">
                You will save ₹{discount.toFixed(2)} on this order
              </p>
            )}
          </div>

          <button
            onClick={() => cartItems.length > 0 && setShowPopup(true)}
            disabled={cartItems.length === 0}
            className="w-full bg-[#68911a] hover:bg-lime-600 disabled:opacity-50 disabled:cursor-not-allowed text-white mt-5 py-3 font-semibold rounded-lg"
          >
            Place Order
          </button>
        </div>
        </div>
          )}
        </div>
        
      </div>

      {/* ORDER CONFIRMATION POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[600px] max-h-[80vh] rounded-xl shadow-lg flex flex-col">
            <div className="p-4 border-b font-semibold bg-[#68911a] text-white rounded-t-xl">
              Review your order ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded object-cover flex-shrink-0 bg-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-[#68911a] flex-shrink-0">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              <div className="border-t pt-3 flex justify-between font-semibold text-sm">
                <span>Total</span>
                <span className="text-[#68911a]">₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex border-t">
              <button
                onClick={() => setShowPopup(false)}
                className="flex-1 py-3 hover:bg-gray-100 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmOrder}
                className="flex-1 py-3 border-l text-[#68911a] hover:bg-gray-100 font-semibold text-sm"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}