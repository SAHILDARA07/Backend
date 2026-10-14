import { useState } from "react";
import { Link } from "react-router";
import Navbar from "../components/Navbar.jsx";
import { getCart, saveCart } from "../utils/cart.js";

export default function Cart() {
  // useState(() => getCart()) reads the saved cart one time when the page opens
  const [cart, setCart] = useState(() => getCart());

  const changeQuantity = (productId, newQuantity) => {
    // the quantity can not be less than 1 or more than the stock
    if (newQuantity < 1) {
      return;
    }

    const item = cart.find((cartItem) => cartItem.productId === productId);
    if (newQuantity > item.stock) {
      return;
    }

    const newCart = cart.map((cartItem) => {
      if (cartItem.productId === productId) {
        return { ...cartItem, quantity: newQuantity };
      }
      return cartItem;
    });

    setCart(newCart);
    saveCart(newCart);
  };

  const removeItem = (productId) => {
    const newCart = cart.filter((item) => item.productId !== productId);
    setCart(newCart);
    saveCart(newCart);
  };

  // total price
  let total = 0;
  for (const item of cart) {
    total = total + item.price * item.quantity;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

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
          <div>
            <div className="bg-white rounded-lg shadow divide-y">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="p-4 flex flex-wrap items-center gap-4"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded bg-gray-200"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-20 h-20 rounded bg-gray-200" />
                  )}

                  <div className="flex-1 min-w-40">
                    <Link
                      to={`/product/${item.productId}`}
                      className="font-bold hover:text-blue-600"
                    >
                      {item.title}
                    </Link>
                    <p className="text-gray-500">
                      ₹{Number(item.price).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        changeQuantity(item.productId, item.quantity - 1)
                      }
                      className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded font-bold"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() =>
                        changeQuantity(item.productId, item.quantity + 1)
                      }
                      className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded font-bold"
                    >
                      +
                    </button>
                  </div>

                  <p className="w-28 text-right font-bold">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow p-4 mt-4 flex justify-between items-center">
              <p className="text-xl font-bold">Total: ₹{total.toFixed(2)}</p>
              <Link
                to="/checkout"
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}