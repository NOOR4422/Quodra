import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../ClientsList/clientsList.css";

const ClientsTopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  let activeTab = "all";
  if (location.pathname.startsWith("/clients/transfer")) {
    activeTab = "transfer";
  } else if (location.pathname.startsWith("/clients/current")) {
    activeTab = "current";
  }

  const handleTabClick = (tab) => {
    if (tab === "all") navigate("/clients");
    if (tab === "current") navigate("/clients/current");
    if (tab === "transfer") navigate("/clients/transfer");
  };

  return (
    <div className="addTopRow stickyTopBar">
      <div className="tabsWrapper">
        <button
          className={`tabBtn ${activeTab === "all" ? "active" : ""}`}
          onClick={() => handleTabClick("all")}
        >
          الكل
        </button>

        <button
          className={`tabBtn ${activeTab === "current" ? "active" : ""}`}
          onClick={() => handleTabClick("current")}
        >
          العملاء الحاليين
        </button>

        <button
          className={`tabBtn ${activeTab === "transfer" ? "active" : ""}`}
          onClick={() => handleTabClick("transfer")}
        >
          طلبات النقل
        </button>
      </div>

      <div className="addLeft">
        <span className="topPlusIcon" onClick={() => navigate("/clients/add")}>
          +
        </span>
        <button className="addBtn" onClick={() => navigate("/clients/add")}>
          إضافة عميل جديد
        </button>
      </div>
    </div>
  );
};

export default ClientsTopBar;
