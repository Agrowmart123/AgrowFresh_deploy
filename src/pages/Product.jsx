import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Zap, Share2, ChevronLeft } from "lucide-react";
import { getCustomerProductById, getCustomerShopProducts } from "../services/api";
import { addToWishlist, removeFromWishlist, checkWishlist } from "../services/api";
import ProductCard from "../components/ProductCard";

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [openShare, setOpenShare] = useState(false);

  const scrollRef = React.useRef(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await getCustomerProductById(id);
      const data = res?.data?.data || res?.data || null;
      setProduct(data);

      // Set first image as selected
     const firstImage =
  data?.imageUrls?.[0] ||
  data?.images?.[0] ||
  data?.image ||
  data?.productImage ||
  null;
      setSelectedImage(firstImage);

      // Check wishlist status
      if (data?.id) {
        try {
          const wRes = await checkWishlist({ productId: data.id });
          setWishlisted(wRes?.data?.wishlisted || wRes?.data?.inWishlist || false);
        } catch (_) {}
      }

      // Fetch similar products from the same shop
      if (data?.shopId) {
        try {
          const shopRes = await getCustomerShopProducts(data.shopId);
          const shopProducts = shopRes?.data?.data || shopRes?.data || [];
          const similar = shopProducts.filter(
            (p) =>
            (p.category || p.categoryName) === (data.category || data.categoryName)
          );
          setSimilarProducts(similar);
        } catch (_) {}
      }
    } catch (err) {
      console.error("Error fetching product", err);
    } finally {
      setLoading(false);
    }
  };

  const handleWishlist = async () => {
    if (!product) return;
    try {
      if (wishlisted) {
        await removeFromWishlist({ productId: product.id });
        setWishlisted(false);
      } else {
        await addToWishlist({
          productId: product.id,
         productName: product.name || product.productName,
productImage:
  product.image ||
  product.images?.[0] ||
  product.imageUrls?.[0],
category: product.category || product.categoryName, shopName: product.shopName,
          vendorName: product.vendorName,
          minPrice: product.minPrice ?? product.price,
          maxPrice: product.maxPrice ?? product.price,

          type: product.type,
          inStock: product.inStock ?? true,
        });
        setWishlisted(true);
      }
    } catch (err) {
      console.error("Wishlist error", err);
    }
  };

  function handleShareClick() {
    if (navigator.share) {
      navigator
        .share({
          title: product?.name,
          text: `Check out this product: ${product?.name}`,
          url: window.location.href,
        })
        .catch((err) => console.error("Share failed", err));
    } else {
      setOpenShare(true);
    }
  }

  // Normalise images array from API response
const productImages = product
  ? product.imageUrls?.length
    ? product.imageUrls
    : product.images?.length
    ? product.images
    : product.image
    ? [product.image]
    : []
  : [];

  const discountPercent =
    product?.mrp && product?.price && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 text-lg animate-pulse">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">Product not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="text-[#68911a] font-semibold underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-2">
      {openShare && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpenShare(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Share</h2>
              <button
                onClick={() => setOpenShare(false)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-500 break-all">{window.location.href}</p>
          </div>
        </div>
      )}

      <main className="max-w-md md:max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left — Image */}
          <div className="relative md:sticky md:top-24 h-fit">
            <button
              onClick={handleShareClick}
              className="absolute top-4 right-14 bg-white p-2 rounded-full shadow hover:bg-gray-100"
            >
              <Share2 size={20} />
            </button>

            <button
              onClick={handleWishlist}
              className="absolute top-4 right-4 bg-white p-2 rounded-full shadow"
            >
              <Heart
                size={20}
                className={`transition ${
                  wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
                }`}
              />
            </button>

            <div className="mb-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-[#68911a] font-semibold hover:opacity-80"
              >
                <ChevronLeft size={20} />
                Back
              </button>
            </div>

            <img
              src={selectedImage}
              alt={product.name || product.productName}
              className="w-full h-80 md:h-[420px] object-cover rounded-2xl"
            />

            {productImages.length > 1 && (
              <div className="flex gap-3 mt-4 justify-center pb-4">
                {productImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    onClick={() => setSelectedImage(img)}
                    alt={`${product.name} ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                      selectedImage === img
                        ? "border-[#efad23]"
                        : "border-transparent"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right — Details */}
          <div className="space-y-4 md:max-h-[80vh] md:overflow-y-auto pr-2">
            <div className="bg-white p-4 rounded-xl shadow">
             <h1 className="text-xl font-semibold">
  {product.name || product.productName}
</h1>             
{(product.unit || product.details?.unit || product.stockQuantity || product.details?.quantity) && (
  <div className="text-sm text-gray-500 mt-1">
    {(product.unit || product.details?.unit) &&
      `Unit: ${product.unit || product.details?.unit}`}

    {(product.unit || product.details?.unit) &&
    (product.stockQuantity || product.details?.quantity)
      ? " • "
      : ""}

    {(product.stockQuantity || product.details?.quantity) != null
      ? `Stock: ${product.stockQuantity || product.details?.quantity}`
      : ""}
  </div>
)}
            <div className="flex items-center gap-2 mt-3">
  <span className="text-2xl font-bold">
  ₹{product.details?.minPrice || 0}
</span>
  {product.mrp &&
    product.mrp >
      (product.price || product.minPrice || product.details?.price) && (
      <span className="line-through text-gray-400 text-sm">
        ₹{product.mrp}
      </span>
  )}


                {discountPercent && (
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>

         {(product.description || product.shortDescription) && (
  <div className="bg-white p-4 rounded-xl shadow">
    <h3 className="font-semibold mb-2">Description</h3>
    <p className="text-gray-600 text-sm">
      {product.description || product.shortDescription}
    </p>
  </div>
)}
            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-semibold mb-2">Product Information</h3>
              <div className="text-sm text-gray-600 space-y-1">
              {(product.shopName || product.shop?.shopName) && (
  <div>Seller Name: {product.shopName || product.shop?.shopName}</div>
)}
                {product.vendorName && <div>Vendor: {product.vendorName}</div>}
               {(product.category || product.categoryName) && (
  <div>Category: {product.category || product.categoryName}</div>
)}
                {product.countryOfOrigin && (
                  <div>Country of Origin: {product.countryOfOrigin}</div>
                )}
                {product.shelfLife && <div>Shelf Life: {product.shelfLife}</div>}
                {product.sellerAddress && (
                  <div>Seller Address: {product.sellerAddress}</div>
                )}
                {product.licenseNo && (
                  <div>Seller License No: {product.licenseNo}</div>
                )}
              </div>
            </div>

            <div className="p-4 flex gap-3">
              <button className="flex-1 border border-[#68911a] text-[#68911a] py-3 rounded-lg font-semibold hover:bg-[#68911a] hover:text-white transition flex items-center justify-center gap-2">
                <ShoppingCart size={18} />
                Add to Cart
              </button>

              <button className="flex-1 bg-[#68911a] text-white py-3 rounded-lg font-semibold hover:bg-[#68911b] transition flex items-center justify-center gap-2">
                <Zap size={18} />
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <section className="mb-12 mt-12 w-full">
            <h2 className="text-2xl font-bold mb-6">Similar Products</h2>

            <div className="relative">
              <button
                onClick={() =>
                  scrollRef.current?.scrollBy({ left: -320, behavior: "smooth" })
                }
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow hidden md:block"
              >
                ‹
              </button>

              <button
                onClick={() =>
                  scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" })
                }
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow hidden md:block"
              >
                ›
              </button>

              <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-4 scroll-smooth w-full no-scrollbar"
              >
                {similarProducts.map((p) => (
                  <div key={p.id} className="flex-shrink-0 w-64">
                    <ProductCard
                      product={{ ...p, mrp: p.mrp ?? p.originalPrice ?? p.maxPrice }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
