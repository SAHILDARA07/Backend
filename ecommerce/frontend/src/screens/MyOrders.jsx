import { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../api/axios.js";
import Navbar from "../components/Navbar.jsx";

// colour of the status label
const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders/my");
      setOrders(res.data);
    } catch (err) {
      console.log("Orders not loaded due to an error !", err);
      setMsg(err.response?.data?.message || "an error occured !");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const cancelOrder = async (id) => {
    if (!window.confirm("Do you want to cancel this order ?")) {
      return;
    }

    try {
      await api.put(`/orders/cancel/${id}`);
      alert("Order cancelled successfully !");
      loadOrders();
    } catch (err) {
      console.log("Order not cancelled due to an error !", err);
      alert(err.response?.data?.message || "Order not cancelled !");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">My Orders</h2>

        {msg && (
          <p className="mb-4 px-4 py-3 rounded-lg text-sm font-medium bg-red-50 border border-red-200 text-red-600">
            {msg}
          </p>
        )}

        {loading && orders.length === 0 ? (
          <p className="text-center text-gray-500 py-10">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500 mb-4">You have no orders yet.</p>
            <Link
              to="/home"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow p-4">
                <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>

                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between text-sm py-1"
                  >
                    <span>
                      {item.title} x {item.quantity}
                    </span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}

                <div className="border-t mt-3 pt-3 flex flex-wrap justify-between items-center gap-2">
                  <div className="text-sm text-gray-500">
                    <p>
                      Deliver to: {order.shippingAddress.fullName},{" "}
                      {order.shippingAddress.address},{" "}
                      {order.shippingAddress.city} -{" "}
                      {order.shippingAddress.pincode}
                    </p>
                    <p>Phone: {order.shippingAddress.phone}</p>
                    <p>Payment: {order.paymentMethod}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      Total: ₹{Number(order.totalPrice).toFixed(2)}
                    </p>
                    {order.status === "Pending" && (
                      <button
                        onClick={() => cancelOrder(order._id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}