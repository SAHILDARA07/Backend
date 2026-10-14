import { useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../api/axios.js";
import Navbar from "../components/Navbar.jsx";
import { clearCart, getCart } from "../utils/cart.js";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart] = useState(() => getCart());
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [msg, setMsg] = useState("");
  const [placing, setPlacing] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // total price (the backend calculates the real total again)
  let total = 0;
  for (const item of cart) {
    total = total + item.price * item.quantity;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setPlacing(true);
      setMsg("");

      // we only send productId and quantity, the backend checks price and stock
      const items = cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      await api.post("/orders", { items, shippingAddress: form });

      clearCart();
      alert("Order placed successfully !");
      navigate("/orders");
    } catch (err) {
      console.log("Order not placed due to an error !", err);

      // token is expired or wrong, login again
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("Your login has expired, please sign in again !");
        navigate("/");
        return;
      }

      setMsg(err.response?.data?.message || "an error occured !");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>

        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500 mb-4">Your cart is empty.</p>
            <Link
              to="/home"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4">
            {/* shipping address */}
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg shadow p-4 md:w-3/5 space-y-4"
            >
              <h3 className="text-lg font-bold">Shipping Address</h3>

              {msg && (
                <p className="px-4 py-3 rounded-lg text-sm font-medium bg-red-50 border border-red-200 text-red-600">
                  {msg}{" "}
                  <Link to="/cart" className="underline">
                    Go to cart
                  </Link>
                </p>
              )}

              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone (10 digits)"
                value={form.phone}
                onChange={handleChange}
                required
                maxLength="10"
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
              <textarea
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="pincode"
                placeholder="Pincode (6 digits)"
                value={form.pincode}
                onChange={handleChange}
                required
                maxLength="6"
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />

              <p className="text-sm text-gray-500">
                Payment method: Cash on Delivery
              </p>

              <button
                type="submit"
                disabled={placing}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                {placing ? "Placing order..." : "Place Order"}
              </button>
            </form>

            {/* order summary */}
            <div className="bg-white rounded-lg shadow p-4 md:w-2/5 h-fit">
              <h3 className="text-lg font-bold mb-3">Order Summary</h3>
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between text-sm py-1"
                >
                  <span>
                    {item.title} x {item.quantity}
                  </span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <p className="border-t mt-3 pt-3 font-bold text-lg">
                Total: ₹{total.toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}