import { Link } from "react-router-dom";
import "../../style/component/header/navbar.scss";

function Navbar() {
  return (
    <div className="navbar">
      <h1> DonjonDex</h1>
      <div className="right-navbar">
        <Link to="/" className="btn-navbar">
          Home
        </Link>
        <Link to="/profil" className="btn-navbar">
          Profil
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
