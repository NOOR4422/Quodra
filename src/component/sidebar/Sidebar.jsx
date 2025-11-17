import React from "react";
import { NavLink } from "react-router-dom";
import "./sidebar.css";

import { FaUsers } from "react-icons/fa6";
import { LuBell } from "react-icons/lu";
import { TbActivity } from "react-icons/tb";
import { HiMiniHome } from "react-icons/hi2";
import { PiLightningBold } from "react-icons/pi";
import { IoLogOutOutline } from "react-icons/io5";

import tyre from "../../assets/tyre.png";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sideLogo">
        <img src={tyre} className="logoImg" alt="" />
        <p className="logoText">قُدْرَة</p>
      </div>

      <NavLink to="/" className="sideBtn">
        <HiMiniHome className="btnIcon" />
        <span className="btnText">الرئيسية</span>
      </NavLink>

      <NavLink to="/clients" className="sideBtn">
        <FaUsers className="btnIcon" />
        <span className="btnText">العملاء</span>
      </NavLink>

      <NavLink to="/visits" className="sideBtn">
        <TbActivity className="btnIcon" />
        <span className="btnText">الزيارات</span>
      </NavLink>

      <NavLink to="/notifications" className="sideBtn">
        <LuBell className="btnIcon" />
        <span className="btnText">الإشعارات</span>
      </NavLink>

      <NavLink to="/ranks" className="sideBtn">
        <PiLightningBold className="btnIcon" />
        <span className="btnText">المستويات</span>
      </NavLink>

      <NavLink to="/auth/login" className="sideBtn">
        <IoLogOutOutline className="btnIcon" />
        <span className="btnText">تسجيل الخروج</span>
      </NavLink>
    </div>
  );
};

export default Sidebar;
