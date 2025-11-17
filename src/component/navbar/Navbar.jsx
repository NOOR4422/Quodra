import React from "react";
import { CiSearch } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import gas from "../../assets/gas.png";
import "./navbar.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate=useNavigate()
  return (
    <nav className="navbar">
      <div className="navbar-container">
      

        <div className="navRightSection">
                 <IoSettingsOutline className="settingsIcon" onClick={()=>navigate("/settings")} />
   <div className="searchBar">
            <input type="text" className="searchInput" placeholder="بحث..." />
            <CiSearch className="searchIcon" />
          </div>

        </div>  <div className="profileSection">
          <img src={gas} alt="profile" className="profileImage" />
          <p className="profileName">ورشة اوتو فيكس</p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
