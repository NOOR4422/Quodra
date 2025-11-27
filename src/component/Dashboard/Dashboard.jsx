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
import serviceIcon from "../../assets/process.png";
import { IoPersonOutline } from "react-icons/io5";
import { LuTrash2, LuPencil } from "react-icons/lu";
import carIcon from "../../assets/car.png";
const Dashboard = () => {
  const navigate = useNavigate();

  const [clients, setClients] = useState([
    {
      id: 1,
      name: "أحمد محمد",
      phone: "0665454345",
      car: "تويوتا كامري 2020",
      lastVisitDate: "25/10/2025",
    },
    {
      id: 2,
      name: "خالد يوسف",
      phone: "056778899",
      car: "هوندا سيفيك 2019",
      lastVisitDate: "23/10/2025",
    },
  ]);


  const isEmpty = clients.length===0; ; 

  const handleAddClient = () => navigate("/clients/add");
  const handleAddVisit = () => navigate("/visits/add");
  const handleViewClients = () => navigate("/clients");
  const handleViewClientDetails = (id = 1) => {
    navigate(`/clients/${id}`);
  };

  const [visits, setVisits] = useState([
    {
      id: 1,
      service: "غسيل السيارة",
      customer: "احمد محمد",
      car: "تويوتا كامري 2020",
      date: "5/10/2025",
      price: 300,
    },
    {
      id: 2,
      service: "تغيير زيت",
      customer: "خالد يوسف",
      car: "هوندا سيفيك 2019",
      date: "6/10/2025",
      price: 450,
    },
   
  ]);
const handleViewVisits = () => navigate("/visits");

  return (
    <div className="dashboard mainContainer container-fluid">
      <div className="dashboard-header ">
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
        <div className="row">
          <div className="col-12">
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
          </div>
        </div>
      ) : (
        <>
          <div className="stats row g-3 g-md-4">
            <div className="col-12 col-md-4">
              <div className="statCard">
                <div className="statTop">
                  <p className="statTitle">عدد العملاء</p>
                  <div className="statIconBox">
                    <LuUsers />
                  </div>
                </div>
                <p className="statNumber">{clients.length} عميل</p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="statCard">
                <div className="statTop">
                  <p className="statTitle">عدد الزيارات</p>
                  <div className="statIconBox">
                    <TbActivityHeartbeat />
                  </div>
                </div>
                <p className="statNumber">50 زيارة</p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="statCard">
                <div className="statTop">
                  <p className="statTitle">عدد الخدمات المنفذة</p>
                  <div className="statIconBox">
                    <PiClipboardTextThin />
                  </div>
                </div>
                <p className="statNumber">35 خدمة</p>
              </div>
            </div>
          </div>

          <div className="mainContainer roundedSection">
            <div className="sectionTitle ">
              <p className="recentTitle">العملاء الأحدث</p>
              <p className="viewAll" onClick={handleViewClients}>
                عرض الكل
              </p>
            </div>
            <div className="row g-3">
              {clients.map((client) => (
                <div className="col-12" key={client.id}>
                  <div
                    className="mainCard"
                    onClick={() => handleViewClientDetails(client.id)}
                  >
                    <span>
                      <img src={user} className="cardImg" alt="client" />
                    </span>

                    <div className="cardCol">
                      <div className="cardRow">
                        <p className="cardTitle">{client.name}</p>
                        <p className="cardTitle">آخر زيارة</p>
                      </div>

                      <div className="cardRow">
                        <div className="cardDetails">
                          <div className="cardBlock">
                            <span className="copyIcon">
                              <MdOutlinePhoneAndroid />
                            </span>
                            <p className="subText">{client.phone}</p>
                          </div>

                          <div className="cardBlock">
                            <img className="carImg" src={sportCar} alt="car" />
                          </div>

                          <div className="cardBlock">
                            <p className="moreDetails">تفاصيل أكثر ......</p>
                          </div>
                        </div>

                        <div>
                          <p className="subText">{client.lastVisitDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
          </div>

          <div className="mainContainer roundedSection">
            <div className="sectionTitle ">
              <p className="recentTitle"> أحدث الزيارات</p>
              <p className="viewAll" onClick={handleViewVisits}>
                عرض الكل
              </p>
            </div>

            <div className="row g-3">
              <div className="mainContainer col-12">
                {visits.map((visit) => (
                  <div className="mainCard" key={visit.id}>
                    <span>
                      <img src={serviceIcon} className="cardImg" />
                    </span>

                    <div className="cardCol">
                      <div className="cardRow">
                        <p className="cardTitle">{visit.service}</p>
                        <p className="cardTitle">{visit.price} ج.م</p>
                      </div>

                      <div className="cardRow">
                        <div className="cardDetails">
                          <div className="cardBlock">
                            <IoPersonOutline />
                            <span className="subText">{visit.customer}</span>
                          </div>

                          <div className="cardBlock subText">
                            <img src={carIcon} className="carImg" />
                            <span>{visit.car}</span>
                          </div>

                          <div className="cardBlick subText">{visit.date}</div>

                          <div className="cardBlock moreDetails">
                            تفاصيل أكثر
                          </div>
                        </div>

                        {/* <div className="btnRow">
                          <span
                            className="editRow"
                            onClick={() => navigate(`/visits/${visit.id}/edit`)}
                          >
                            تعديل البيانات <LuPencil className="actionIcon" />
                          </span>

                         <span
                            className="deleteRow"
                            onClick={() => setShowAlert(true)}
                          >
                            حذف الزيارة <LuTrash2 className="actionIcon" />
                          </span> 
                        </div> */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
