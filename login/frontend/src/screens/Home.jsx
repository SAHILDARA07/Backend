import { useEffect, useState } from "react";

export default function Home({ navigate }) {
  const [user] = useState(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [navigate, user]);

  function handleSignout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/signin");
  }

  if (!user) {
    return null;
  }

  return (
    <main className="home-page">
      <header className="home-header">
        <a
          className="home-brand"
          href="/home"
          onClick={(event) => {
            event.preventDefault();
            navigate("/home");
          }}
        >
          <span>User Profile</span>
        </a>
        <button
          className="signout-button"
          type="button"
          onClick={handleSignout}
        >
          Sign out
        </button>
      </header>

      <section className="welcome-section">
        <h1>Hello, {user.name}.</h1>
        <p className="intro">Your account details</p>

        <div className="profile-details">
          <div className="profile-copy">
            <span className="detail-label">Name</span>
            <p>{user.name}</p>
          </div>
          <div className="profile-copy email-copy">
            <span className="detail-label">Email</span>
            <p>{user.email}</p>
          </div>
        </div>
      </section>
    </main>
  );
}