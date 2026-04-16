import React from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import Lottie from "lottie-react";
import emptyCart from "../data/EmptyCart.json";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Context madhun direct gheto
  const {
    cartItems,
    subtotal,
    totalPayable,
    removeFromCart,
    updateQuantity
  } = useCart();
  console.log("CART ITEMS:", cartItems);

const handleDecrement = (item) => {
  const itemId = item.id || item.productId;
  const currentQty = item.quantity || 1;

  if (currentQty <= 1) {
    removeFromCart(itemId);
  } else {
    updateQuantity(itemId, currentQty - 1);
  }
};

  // const handleDecrement = (item) => {
  //   const itemId = item.id || item.productId;
  //   if ((item.quantity || 1) <= 1) {
  //     removeFromCart(itemId);
  //   } else {
  //     updateQuantity(itemId, (item.quantity || 1) - 1);
  //   }
  // };

  const handleConfirmOrder = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) return;

    // Checkout la selected items pathavto
    const selectedIds = cartItems.map((item) => item.id || item.productId);

    navigate("/checkout", {
      state: { selectedIds }
    });
  };

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">

        <div className="col-span-3 flex items-center justify-center">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
              <div style={{ width: 200 }}>
                <Lottie animationData={emptyCart} loop={true} />
              </div>
              <p className="text-lg font-semibold">Your cart is empty</p>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-2.5 rounded-full bg-[#68911a] text-white font-bold text-sm"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">

              {/* ITEMS */}
              <div className="lg:col-span-2 flex flex-col gap-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id || item.productId}
                    className="bg-white p-4 rounded-xl shadow flex gap-4"
                  >
                    <img
                      src={item.imageUrls?.[0] || item.image || ""}
                      alt={item.product?.name || item.name}
                      className="w-24 h-24 object-cover rounded"
                    />

                    <div className="flex-1">
                      <h2 className="font-semibold">
                     {item.productName || item.name || "Item"}
                      </h2>
                      <span className="font-medium">
                        ₹{Number(item.price || item.product?.price || 0)}
                      </span>

                      <div className="flex items-center gap-4 mt-4">
                        <button onClick={() => handleDecrement(item)}>
                          <Minus size={14} />
                        </button>


                        <span className="font-semibold">{item.quantity}</span>
<button
  onClick={() => updateQuantity(item.id || item.productId, (item.quantity || 1) + 1)}
>
  <Plus size={14} />
</button>
                        
                        <button
                          onClick={() => removeFromCart(item.id || item.productId)}
                          className="text-red-500 ml-auto"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* PRICE DETAILS */}
              <div className="bg-white p-5 rounded-xl shadow h-fit">
                <h2 className="font-semibold border-b pb-3">PRICE DETAILS</h2>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Price ({cartItems.length} items)</span>
                    <span>₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between text-[#68911a]">
                    <span>Discount</span>
                    <span>- ₹25.00</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span className="text-[#68911a]">FREE</span>
                  </div>

                  <hr />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount</span>
                    <span>₹{totalPayable || subtotal || 0}</span>
                  </div>
                </div>

                {/* FIXED PLACE ORDER BUTTON */}
                <button
                  onClick={handleConfirmOrder}
                  disabled={cartItems.length === 0}
                  className="w-full bg-[#68911a] text-white mt-5 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Place Order
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}