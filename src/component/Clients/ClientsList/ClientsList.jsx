import React, { useState } from "react";
import "./clientsList.css";
import { LuTrash2, LuPencil } from "react-icons/lu";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import AlertModal from "../../Modals/AlertModal/AlertModal";
import box from "../../../assets/box.png";
import user from "../../../assets/user.png";
import ClientsTopBar from "../ClientsTopBar/ClientsTopBar";

const ClientsList = () => {
  const navigate = useNavigate();

  const [clients, setClients] = useState([
    { id: 1, name: "احمد محمد", phone: "0665454345", visits: 4 },
    { id: 2, name: "خالد يوسف", phone: "0654332211", visits: 2 },
    { id: 3, name: "سارة علي", phone: "0661122334", visits: 7 },
    { id: 4, name: "محمد مراد", phone: "0679988776", visits: 1 },
    { id: 5, name: "ليلى سمير", phone: "0655544332", visits: 3 },
    { id: 6, name: "علي حسن", phone: "0666677889", visits: 5 },
  ]);

  const [showAlert, setShowAlert] = useState(false);

  const isEmpty = clients.length === 0;

  return (
    <div className="mainContainer">
      <AlertModal
        show={showAlert}
        title="تحذير"
        alertIcon="⚠️"
        message="هل انت متأكد من حذف هذا العميل ؟"
        cancelText="إلغاء"
        confirmText="حذف"
        onCancel={() => setShowAlert(false)}
        onConfirm={() => {
          setShowAlert(false);
          console.log("Client Deleted");
        }}
      />

      <ClientsTopBar />

      {isEmpty ? (
        <div className="emptyState">
          <img src={box} alt="no data" className="emptyIcon" />
          <p className="emptyText">لا يوجد عملاء مسجلين حالياً.</p>
          <p className="emptySubText">
            ابدأ بإضافة أول عميل علشان تتابع زياراته وخدماته بسهولة.
          </p>
          <button
            className="addBtn"
            style={{ backgroundColor: "#DD2912", color: "white" }}
            onClick={() => navigate("/clients/add")}
          >
            إضافة عميل
          </button>
        </div>
      ) : (
        <>
          {clients.map((client) => (
            <div className="mainCard" key={client.id}>
              <span>
                <img src={user} className="cardImg" alt={client.name} />
              </span>

              <div className="cardCol">
                <div className="cardRow">
                  <div>
                    <p className="cardTitle">{client.name}</p>
                  </div>

                  <div className="btnRow">
                    <button
                      className="btnNotify"
                      onClick={() => navigate("/notifications/add")}
                    >
                      إرسال إشعار
                    </button>

                    <button
                      className="btnVisit"
                      onClick={() => navigate("/visits/add")}
                    >
                      زيارة جديدة
                    </button>
                  </div>
                </div>

                <div className="cardRow">
                  <div className="cardDetails">
                    <div className="cardBlock">
                      <span className="copyIcon">
                        <MdOutlinePhoneAndroid />
                      </span>
                      <p className="subText">{client.phone}</p>
                    </div>

                    <div className="cardBlock subText">
                      {client.visits} زيارات
                    </div>

                    <div className="cardBlock subText">رتبته...</div>

                    <div
                      className="cardBlock moreDetails"
                      onClick={() => navigate(`/clients/${client.id}`)}
                    >
                      تفاصيل أكثر
                    </div>
                  </div>

                  <div className="btnRow">
                    <span
                      className="editRow"
                      onClick={() => navigate(`/clients/${client.id}/edit`)}
                    >
                      <LuPencil className="actionIcon" /> تعديل البيانات
                    </span>

                    <span
                      className="deleteRow"
                      onClick={() => setShowAlert(true)}
                    >
                      <LuTrash2 className="actionIcon" /> حذف العميل
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default ClientsList;
