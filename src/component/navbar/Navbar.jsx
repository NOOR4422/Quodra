import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import gas from "../../assets/gas.png";
import "./navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import userApi from "../../api/user";
import { useSearch } from "../../context/SearchContext";

const Navbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const lang = "ar";

  const [workshopName, setWorkshopName] = useState("ورشة");
  const [loading, setLoading] = useState(true);

  const { searchTerm, setSearchTerm } = useSearch();

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);

        const data = await userApi.getWorkshop({ lang });
        if (!alive) return;

        const name =
          data?.name ||
          data?.workshopName ||
          data?.workShopName ||
          data?.workshop?.name;

        if (name) {
          setWorkshopName(name);
        }
      } catch (err) {
        console.error("GET WORKSHOP ERROR:", err);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // 🚩 IMPORTANT PART:
  // whenever the user types something (from first letter) in ANY tab,
  // go to /clients so they can see the results there
  useEffect(() => {
    const q = searchTerm.trim();
    if (q && location.pathname !== "/clients") {
      navigate("/clients");
    }
  }, [searchTerm, navigate, location.pathname]);

  return (
    <nav className="navbar" dir="rtl">
      <div className="navbar-container">
        <div className="navRightSection">
          <button className="menuToggle" onClick={onToggleSidebar}>
            <RxHamburgerMenu />
          </button>

          <IoSettingsOutline
            className="settingsIcon"
            onClick={() => navigate("/settings")}
          />

          <div className="searchBar">
            <input
              type="text"
              className="searchInput"
              placeholder="بحث عن عميل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <CiSearch className="searchIcon" />
          </div>
        </div>

        <div className="profileSection">
          <img src={gas} alt="profile" className="profileImage" />
          <p className="profileName">
            {loading ? "جارٍ التحميل..." : workshopName}
          </p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
