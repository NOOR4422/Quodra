import React, { useState } from "react";
import "./dashboard.css";
import { LuUsers } from "react-icons/lu";
import { TbActivityHeartbeat } from "react-icons/tb";
import { PiClipboardTextThin } from "react-icons/pi";
import box from "../../assets/box.png";
import { useNavigate } from "react-router-dom";
import user from "../../assets/user.png";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import sportCar from "../../assets/sportCar.png";

const Dashboard = () => {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);

  const isEmpty = clients.length === 2;

  const handleAddClient = () => navigate("/clients/add");

  const handleAddVisit = () => navigate("/visits/add");

  const handleViewClients = () => navigate("/clients");

  const handleViewClientDetails = (id = 1) => {
    navigate(`/clients/${id}`);
  };

  return (
    <div className="mainContainer">
      <div className="dashboard-header">
        <div className="welcome">
          <h2>مرحباً بك , ورشة اوتو فيكس</h2>
        </div>

        {!isEmpty && (
          <div className="action-buttons">
            <button
              className="addBtn"
              style={{ backgroundColor: "#DD2912", color: "white" }}
              onClick={handleAddClient}
            >
              إضافة عميل
            </button>
            <button className="addBtn" onClick={handleAddVisit}>
              إضافة زيارة
            </button>
          </div>
        )}
      </div>

      {isEmpty ? (
        <div className="emptyState">
          <img src={box} alt="no data" className="emptyIcon" />
          <p className="emptyText">لا يوجد بيانات حالياً.</p>
          <p className="emptySubText">
            ابدأ بإضافة أول عميل و سجل أول زيارة لورشتك.
          </p>
          <button
            className="addBtn"
            style={{ backgroundColor: "#DD2912", color: "white" }}
            onClick={handleAddClient}
          >
            إضافة عميل
          </button>
        </div>
      ) : (
        <>
          <div className="stats">
            <div className="statCard">
              <div className="statTop">
                <div className="statIconBox">
                  <LuUsers />
                </div>
                <p className="statTitle">عدد العملاء</p>
              </div>
              <p className="statNumber">{clients.length} عميل</p>
            </div>

            <div className="statCard">
              <div className="statTop">
                <div className="statIconBox">
                  <TbActivityHeartbeat />
                </div>
                <p className="statTitle">عدد الزيارات</p>
              </div>
              <p className="statNumber">50 زيارة</p>
            </div>

            <div className="statCard">
              <div className="statTop">
                <div className="statIconBox">
                  <PiClipboardTextThin />
                </div>
                <p className="statTitle">عدد الخدمات المنفذة</p>
              </div>
              <p className="statNumber">35 خدمة</p>
            </div>
          </div>

          <div className="mainContainer roundedSection">
            <div className="sectionTitle">
              <p className="recentTitle">العملاء الأحدث</p>
              <p className="viewAll" onClick={handleViewClients}>
                عرض الكل
              </p>
            </div>

            <div
              className="mainCard"
              onClick={() => handleViewClientDetails(1)}
            >
              <span>
                <img src={user} className="cardImg" />
              </span>
              <div className="cardCol">
                <div className="cardRow">
                  <div>
                    <p className="cardTitle">أحمد محمد</p>
                  </div>
                  <div>
                    <p className="cardTitle">آخر زيارة</p>
                  </div>
                </div>

                <div className="cardRow">
                  <div className="cardDetails">
                    <div className="cardBlock">
                      <span className="copyIcon">
                        <MdOutlinePhoneAndroid />
                      </span>
                      <p className="subText">0665454345</p>
                    </div>

                    <div className="cardBlock">
                      <img className="carImg" src={sportCar} />
                    </div>

                    <div className="cardBlock">
                      <p className="moreDetails">تفاصيل أكثر ......</p>
                    </div>
                  </div>
                  <div>
                    <p className="subText">25/10/2025</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="mainCard"
              onClick={() => handleViewClientDetails(2)}
            >
              <span>
                <img src={user} className="cardImg" />
              </span>
              <div className="cardCol">
                <div className="cardRow">
                  <div>
                    <p className="cardTitle">أحمد محمد</p>
                  </div>
                  <div>
                    <p className="cardTitle">آخر زيارة</p>
                  </div>
                </div>

                <div className="cardRow">
                  <div className="cardDetails">
                    <div className="cardBlock">
                      <span className="copyIcon">
                        <MdOutlinePhoneAndroid />
                      </span>
                      <p className="subText">0665454345</p>
                    </div>

                    <div className="cardBlock">
                      <img className="carImg" src={sportCar} />
                    </div>

                    <div className="cardBlock">
                      <p className="moreDetails">تفاصيل أكثر ......</p>
                    </div>
                  </div>
                  <div>
                    <p className="subText">25/10/2025</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
