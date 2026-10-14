import { Navigate } from "react-router";


export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // not logged in, go to signin
  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
}