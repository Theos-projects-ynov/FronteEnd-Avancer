import { Link } from "react-router-dom";
import "../../style/component/header/navbar.scss";
import { useEffect, useState } from "react";

function Navbar() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("token", token, " : ", token !== null);

    if (token !== null) {
      console.log("QUOI token", token, " : ", token !== null);
      setIsLoggedIn(true);
    }

  }, []);

  return (
    <div className="navbar">
      <h1> DonjonDex</h1>
      <div className="right-navbar">
        <Link to="/" className="btn-navbar">
          Home
        </Link>
        <Link to="/dungeon" className="btn-navbar">
          Donjon
        </Link>
        {isLoggedIn ? (
          <>
            <Link to="/profil" className="btn-navbar">
              Profil
            </Link>
            <Link to="/logout" className="btn-navbar">
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-navbar">
              Login
            </Link>
            <Link to="/register" className="btn-navbar">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
