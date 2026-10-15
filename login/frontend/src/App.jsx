import { useEffect, useState } from "react";
import Home from "./screens/Home.jsx";
import Signin from "./screens/Signin.jsx";
import Signup from "./screens/Signup.jsx";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState(window.location.pathname);

  useEffect(() => {
    const handleBack = () => setCurrentPage(window.location.pathname);
    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, []);

  function navigate(path) {
    window.history.pushState({}, "", path);
    setCurrentPage(path);
  }

  if (currentPage === "/signup") {
    return <Signup navigate={navigate} />;
  }

  if (currentPage === "/home") {
    return <Home navigate={navigate} />;
  }

  return <Signin navigate={navigate} />;
}

export default App;