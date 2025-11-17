import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import Navbar from "../navbar/Navbar";
import "./layout.css";

const Layout = () => {
  return (
    <div className="layout">
      <Sidebar />

      <div className="right-side">
        <Navbar />
        <div className="content-area">
          <Outlet /> 
        </div>
      </div>
    </div>
  );
};

export default Layout;
