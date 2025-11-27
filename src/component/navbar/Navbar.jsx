import React from "react";
import { CiSearch } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import gas from "../../assets/gas.png";
import "./navbar.css";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar container-fluid" dir="rtl">
      <div className="navbar-container">
        <div className="navRightSection">
          <button className="menuToggle" onClick={onToggleSidebar}>
            <RxHamburgerMenu />
          </button>

       <IoSettingsOutline
            className="settingsIcon"
            onClick={() => navigate("/settings")}
          />     <div className="searchBar">
            <input type="text" className="searchInput" placeholder="بحث..." />
            <CiSearch className="searchIcon" />
          </div>

        
        </div>

        <div className="profileSection">
          <img src={gas} alt="profile" className="profileImage" />
          <p className="profileName">nouuuuuuuuurورشة اوتو فيكس</p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
