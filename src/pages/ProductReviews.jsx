import React, { useState } from "react";
import { Star, User, Package } from "lucide-react";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function ProductReviews() {
  const [rating, setRating] = useState(0);
  const [recommend, setRecommend] = useState(true);
  const [image, setImage] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const [sellerRatings, setSellerRatings] = useState({
    delivery: 0,
    packaging: 0,
    communication: 0,
  });

  const tags = [
    "Fast Delivery",
    "Eco-friendly Packaging",
    "Product Quality",
    "Value for Money",
    "Seller Support",
    "Detailed Instructions",
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  const handleSubmitReview = () => {
  toast.success("Review submitted successfully!");
};

  const handleSellerRating = (type, value) => {
    setSellerRatings({ ...sellerRatings, [type]: value });
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold mb-4">Order Summary</h2>

        <img
  src="veg.png"
  alt="product"
  className="rounded-lg mb-4 cursor-pointer"
  onClick={() => navigate("/product/1")}
/>

          <p className="text-xs text-gray-500">PRODUCT</p>

          <h3 className="font-semibold mb-3">
            Premium Organic Fertilizer - 50kg Heavy Duty Pack
          </h3>

          <div className="text-sm text-gray-600 space-y-2">
            <p>
              <b>Delivered On</b> Oct 24, 2023
            </p>

            <p>
              <b>Order ID</b> AGROR-5891
            </p>

            <p>
              <b>Sold By</b> GreenEarth Bio-Supplies
            </p>
          </div>
          {showDetails && (
  <div className="mt-4 bg-gray-50 rounded-lg p-4">

    <h3 className="font-semibold text-lg mb-2">Description</h3>
    <p className="text-sm text-gray-600 mb-4">
      Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua.
    </p>

    <h3 className="font-semibold text-lg mb-2">Product Information</h3>

    <div className="text-sm text-gray-600 space-y-1">
      <p>Customer Care: support@gromobuy.com</p>
      <p>Seller Name: Hindustan Vegetables</p>
      <p>Seller Address: 123 Baner Street, Pune</p>
      <p>Seller License No: 123456789</p>
      <p>Country of Origin: India</p>
      <p>Shelf Life: 4 days</p>
    </div>

  </div>
)}
<button
  onClick={() => setShowDetails(!showDetails)}
  className="mt-4 w-full border rounded-lg py-2 text-green-600 hover:bg-green-50"
>
  View Product Details
</button>

        </div>
        

        {/* Rating Section */}
        <div className="md:col-span-2 bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-1">Rate Your Purchase</h2>

          <p className="text-sm text-gray-500 mb-6">
            Your feedback helps thousands of farmers make better choices.
          </p>

          {/* Product Rating */}
          <h3 className="font-semibold mb-2 flex items-center gap-2 text-gray-800">
  <Package className="text-green-600" size={18} />
  Rate the Product
</h3>

          <div className="flex gap-2 mb-4">
            {[1,2,3,4,5].map((star) => (
              <Star
                key={star}
                onClick={() => setRating(star)}
                className={`cursor-pointer ${
                  star <= rating
                    ? "text-green-500 fill-green-500"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Review */}
          <textarea
            placeholder="How was the quality? Did it meet your expectations?"
            className="w-full border rounded-lg p-3 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Upload */}
        <h3 className="font-semibold mb-2">Add Photos or Videos</h3>

<div className="flex gap-4 mb-6 items-center">

  <label className="w-24 h-24 border-2 border-dashed border-green-400 rounded-xl flex flex-col items-center justify-center text-green-600 cursor-pointer hover:bg-green-50 transition">

    <Camera size={22} />

    <span className="text-xs mt-1 font-semibold">UPLOAD</span>

    <input
      type="file"
      className="hidden"
      onChange={handleImageUpload}
    />

  </label>

  {image && (
    <img
      src={image}
      alt="preview"
      className="w-24 h-24 rounded-xl object-cover"
    />
  )}

</div>
          {/* Seller Rating */}
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-800">
  <User className="text-green-600" size={18} />
  Rate the Seller
</h3>

          <div className="grid md:grid-cols-3 gap-4 mb-6">

            {[
              { key: "delivery", label: "Delivery Speed" },
              { key: "packaging", label: "Packaging Quality" },
              { key: "communication", label: "Communication" },
            ].map((item) => (
              <div
                key={item.key}
                className="bg-gray-100 rounded-lg p-3 text-center"
              >
               <p className="text-xs text-green-700">{item.label}</p>

                <div className="flex justify-center gap-1 mt-1">
                  {[1,2,3,4,5].map((star) => (
                    <Star
                      key={star}
                      onClick={() =>
                        handleSellerRating(item.key, star)
                      }
                      className={`w-4 h-4 cursor-pointer ${
                        star <= sellerRatings[item.key]
                          ? "text-green-500 fill-green-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}

          </div>

          {/* Tags */}
          <h3 className="font-semibold mb-2">What did you like most?</h3>

          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 text-sm rounded-full ${
                  selectedTags.includes(tag)
                    ? "bg-green-600 text-white"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Recommendation */}
        <div className="flex justify-between items-center mb-6">
  <div>
    <p className="font-semibold">
      Would you recommend this to others?
    </p>

    <p className="text-sm text-gray-500">
      This helps show a "Recommended" badge on the product.
    </p>
  </div>

  {/* Toggle + Text */}
  <div className="flex items-center gap-3">

    <button
      onClick={() => setRecommend(!recommend)}
      className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
        recommend ? "bg-green-600" : "bg-gray-300"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
          recommend ? "translate-x-6" : ""
        }`}
      />
    </button>

    <span
      className={`font-medium ${
        recommend ? "text-green-600" : "text-gray-500"
      }`}
    >
      {recommend ? "Yes, I recommend" : "No"}
    </span>

  </div>
</div>

          {/* Buttons */}
<div className="flex justify-end gap-4">
  <button
    onClick={() => window.history.back()}
    className="text-gray-500"
  >
    Cancel
  </button>

  <button
    onClick={handleSubmitReview}
    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
  >
    Submit My Review
  </button>
</div>
        </div>
      </div>
      
    </div>
  );
}