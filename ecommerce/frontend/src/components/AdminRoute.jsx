import { Navigate } from "react-router";


export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  // not logged in, go to signin
  if (!token || !savedUser) {
    return <Navigate to="/" />;
  }

  let user;
  try {
    user = JSON.parse(savedUser);
  } catch (error) {
    console.log(error);
    return <Navigate to="/" />;
  }

  // logged in but not an admin
  if (user.role !== "admin") {
    return <Navigate to="/home" />;
  }

  return children;
}