import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import api from "../api/axios.js";
import Navbar from "../components/Navbar.jsx";
import { addToCart } from "../utils/cart.js";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");

  const getProduct = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.log("Product not loaded due to an error !", err);
      setMsg(err.response?.data?.message || "an error occured !");
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, [id]);

  const handleAddToCart = () => {
    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty < 1) {
      setMsg("Please enter a quantity of 1 or more !");
      setMsgType("error");
      return;
    }

    if (qty > product.stock) {
      setMsg(`Only ${product.stock} available !`);
      setMsgType("error");
      return;
    }

    const quantityInCart = addToCart(product, qty);
    setMsg(`Added to cart ! You now have ${quantityInCart} in your cart.`);
    setMsgType("success");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto p-4">
        <Link to="/home" className="text-blue-500 hover:text-blue-700">
          &larr; Back to products
        </Link>

        {msg && (
          <p
            className={`mt-4 px-4 py-3 rounded-lg text-sm font-medium ${
              msgType === "success"
                ? "bg-green-50 border border-green-200 text-green-600"
                : "bg-red-50 border border-red-200 text-red-600"
            }`}
          >
            {msg}
          </p>
        )}

        {loading && (
          <p className="text-center text-gray-500 py-10">Loading product...</p>
        )}

        {product && (
          <div className="bg-white rounded-lg shadow mt-4 p-4 flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full rounded bg-gray-200 object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="h-64 w-full bg-gray-200 rounded flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>

            <div className="md:w-1/2">
              <h2 className="text-2xl font-bold">{product.title}</h2>
              <p className="text-gray-500 mb-2">{product.category}</p>
              <p className="text-2xl font-bold text-blue-600 mb-2">
                ₹{Number(product.price).toFixed(2)}
              </p>
              <p className="text-gray-700 mb-4">{product.description}</p>

              {product.stock === 0 ? (
                <p className="font-bold text-red-500">Out of stock</p>
              ) : (
                <div>
                  <p className="text-green-600 mb-3">
                    {product.stock} in stock
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded"
                    />
                    <button
                      onClick={handleAddToCart}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Add to Cart
                    </button>
                    <Link
                      to="/cart"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Go to cart
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}