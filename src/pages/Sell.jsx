import React, { useState } from "react";
import QRCode from "react-qr-code";

const dummyProducts = [
  { barcode: "1001", name: "Apple", price: 40 },
  { barcode: "1002", name: "Banana", price: 30 },
  { barcode: "1003", name: "Milk", price: 60 },
  { barcode: "1004", name: "Bread", price: 45 },
];

export default function Sell() {
  const [barcode, setBarcode] = useState("");
  const [cart, setCart] = useState([]);

  const scanProduct = () => {
    const product = dummyProducts.find((p) => p.barcode === barcode);

    if (!product) {
      alert("Product not found");
      return;
    }

    const existing = cart.find((item) => item.barcode === product.barcode);

    if (existing) {
      setCart(
        cart.map((item) =>
          item.barcode === product.barcode
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }

    setBarcode("");
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const upiLink = `upi://pay?pa=yourupi@upi&pn=AgroMart&am=${total}&cu=INR`;

  return (
    <div className="bg-gray-100 min-h-screen p-6">

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">

        {/* Scanner Section */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-xl font-semibold mb-4">Scan Product</h2>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
            📷 Dummy Barcode Scanner
          </div>

          <input
            type="text"
            placeholder="Enter Barcode"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="w-full border p-3 rounded mb-4"
          />

          <button
            onClick={scanProduct}
            className="w-full bg-lime-500 text-white py-3 rounded-lg font-semibold"
          >
            Scan Product
          </button>

        </div>

        {/* Cart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">

          <h2 className="text-xl font-semibold mb-4">Billing</h2>

          <table className="w-full text-left">
            <thead className="border-b">
              <tr>
                <th className="py-2">Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {cart.map((item) => (
                <tr key={item.barcode} className="border-b">
                  <td className="py-3">{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>{item.qty}</td>
                  <td>₹{item.qty * item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-6">
            <h3 className="text-lg font-semibold">Total</h3>
            <span className="text-2xl font-bold text-lime-600">
              ₹{total}
            </span>
          </div>

          {/* QR Payment */}
          {total > 0 && (
            <div className="mt-8 text-center">
              <h3 className="font-semibold mb-4">
                Scan QR to Pay
              </h3>

              <div className="flex justify-center">
                <QRCode value={upiLink} size={160} />
              </div>

              <p className="text-sm text-gray-500 mt-3">
                Pay using Google Pay / PhonePe / Paytm
              </p>
            </div>
          )}

          <button className="w-full mt-6 bg-lime-500 text-white py-3 rounded-lg font-semibold">
            Complete Sale
          </button>

        </div>

      </div>

    </div>
  );
}