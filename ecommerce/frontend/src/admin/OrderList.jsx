import { useEffect, useState } from "react";
import api from "../api/axios.js";
import Navbar from "../components/Navbar.jsx";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders");
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

  const changeStatus = async (id, status) => {
    try {
      await api.put(`/orders/status/${id}`, { status });
      loadOrders();
    } catch (err) {
      console.log("Status not updated due to an error !", err);
      alert(err.response?.data?.message || "Status not updated !");
      loadOrders();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">All Orders</h2>

        {msg && (
          <p className="mb-4 px-4 py-3 rounded-lg text-sm font-medium bg-red-50 border border-red-200 text-red-600">
            {msg}
          </p>
        )}

        {loading && orders.length === 0 ? (
          <p className="text-center text-gray-500 py-10">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 text-sm">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Order</th>
                  <th className="py-2 px-4 border-b text-left">Customer</th>
                  <th className="py-2 px-4 border-b text-left">Items</th>
                  <th className="py-2 px-4 border-b text-left">Deliver to</th>
                  <th className="py-2 px-4 border-b text-left">Total</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="align-top">
                    <td className="py-2 px-4 border-b">
                      #{order._id.slice(-6).toUpperCase()}
                      <br />
                      <span className="text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      {order.user ? order.user.name : "Deleted user"}
                      <br />
                      <span className="text-gray-500">
                        {order.user ? order.user.email : ""}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      {order.items.map((item) => (
                        <p key={item._id}>
                          {item.title} x {item.quantity}
                        </p>
                      ))}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {order.shippingAddress.fullName}
                      <br />
                      {order.shippingAddress.address},{" "}
                      {order.shippingAddress.city} -{" "}
                      {order.shippingAddress.pincode}
                      <br />
                      {order.shippingAddress.phone}
                    </td>
                    <td className="py-2 px-4 border-b font-bold">
                      ₹{Number(order.totalPrice).toFixed(2)}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <select
                        value={order.status}
                        onChange={(e) => changeStatus(order._id, e.target.value)}
                        disabled={
                          order.status === "Delivered" ||
                          order.status === "Cancelled"
                        }
                        className="px-2 py-1 border border-gray-300 rounded bg-white disabled:bg-gray-100"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}