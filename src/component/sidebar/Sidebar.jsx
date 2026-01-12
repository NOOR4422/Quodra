import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./sidebar.css";

import { FaUsers } from "react-icons/fa6";
import { LuBell } from "react-icons/lu";
import { TbActivity } from "react-icons/tb";
import { HiMiniHome } from "react-icons/hi2";
import { PiLightningBold } from "react-icons/pi";
import { IoLogOutOutline } from "react-icons/io5";

import tyre from "../../assets/tyre.png";
import AlertModal from "../Modals/AlertModal/AlertModal";
import { useSearch } from "../../Context/SearchContext";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  const { clearSearch } = useSearch();

  const autoClose = () => {
    if (window.innerWidth <= 768 && onClose) {
      onClose();
    }
  };

  const handleNavClick = () => {
    clearSearch();
    autoClose();
  };

  const doLogout = () => {
    clearSearch();

    localStorage.removeItem("token");
    localStorage.removeItem("workshopId");

    setShowLogout(false);
    autoClose();
    navigate("/auth/login", { replace: true });
  };

  return (
    <div className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
      <AlertModal
        show={showLogout}
        title="تأكيد تسجيل الخروج"
        alertIcon="⚠️"
        message="هل أنت متأكد أنك تريد تسجيل الخروج؟"
        cancelText="إلغاء"
        confirmText="تسجيل الخروج"
        onCancel={() => setShowLogout(false)}
        onConfirm={doLogout}
        showCancel={true}
        showConfirm={true}
      />

      <div className="sideLogo">
        <img src={tyre} className="logoImg" alt="" />
        <p className="logoText">قُدْرَة</p>
      </div>

      <NavLink to="/" className="sideBtn" onClick={handleNavClick}>
        <HiMiniHome className="btnIcon" />
        <span className="btnText">الرئيسية</span>
      </NavLink>

      <NavLink to="/clients" className="sideBtn" onClick={handleNavClick}>
        <FaUsers className="btnIcon" />
        <span className="btnText">العملاء</span>
      </NavLink>

      <NavLink to="/visits" className="sideBtn" onClick={handleNavClick}>
        <TbActivity className="btnIcon" />
        <span className="btnText">الزيارات</span>
      </NavLink>

      <NavLink to="/notifications" className="sideBtn" onClick={handleNavClick}>
        <LuBell className="btnIcon" />
        <span className="btnText">الإشعارات</span>
      </NavLink>

      <NavLink to="/ranks" className="sideBtn" onClick={handleNavClick}>
        <PiLightningBold className="btnIcon" />
        <span className="btnText">المستويات</span>
      </NavLink>

      <button
        type="button"
        className="sideBtn"
        onClick={() => setShowLogout(true)}
      >
        <IoLogOutOutline className="btnIcon" />
        <span className="btnText">تسجيل الخروج</span>
      </button>
    </div>
  );
};

export default Sidebar;
