import { Link, useNavigate } from "react-router";
import { clearCart, getCartCount } from "../utils/cart.js";

export default function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    console.log(error);
  }

  const isLoggedIn = token && user;
  const cartCount = getCartCount();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    clearCart();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <Link to="/home" className="text-xl font-bold text-red-600">
          meeesho
        </Link>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <Link to="/home" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>

          <Link to="/cart" className="text-gray-700 hover:text-blue-600">
            Cart ({cartCount})
          </Link>

          {isLoggedIn && (
            <Link to="/orders" className="text-gray-700 hover:text-blue-600">
              My Orders
            </Link>
          )}

          {isLoggedIn && user.role === "admin" && (
            <>
              <Link
                to="/admin/products"
                className="text-gray-700 hover:text-blue-600"
              >
                Manage Products
              </Link>
              <Link
                to="/admin/orders"
                className="text-gray-700 hover:text-blue-600"
              >
                Manage Orders
              </Link>
            </>
          )}

          {isLoggedIn ? (
            <>
              <span className="text-gray-500">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded"
              >
                Sign In
              </Link>
              <Link to="/signup" className="text-gray-700 hover:text-blue-600">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}