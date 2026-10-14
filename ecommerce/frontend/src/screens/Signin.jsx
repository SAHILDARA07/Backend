import { useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../api/axios.js";

export default function Signin() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/signin", form);

      // save the data to localstorage
      localStorage.setItem("token", res.data.token);
      // we also save the user (name, email, role) to know who is logged in
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setMsg("Sign In Successfully ");
      setMsgType("success");

      // redirect: admin goes to the product list, normal user goes to home
      setTimeout(() => {
        if (res.data.user.role === "admin") {
          navigate("/admin/products");
        } else {
          navigate("/home");
        }
      }, 1000);
    } catch (err) {
      setMsg(err.response?.data?.message || "an error occured !");
      setMsgType("error");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-gray-100 text-gray-800">
        <h1 className="text-2xl font-bold text-center">Sign In</h1>
        {msg && (
          <p
            className={`text-center mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
              msgType === "success"
                ? "bg-green-50 border border-green-200 text-green-600"
                : "bg-red-50 border border-red-200 text-red-600"
            }`}
          >
            {msg}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign In
          </button>
         
        </form>
        <p className="text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:text-blue-700">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}