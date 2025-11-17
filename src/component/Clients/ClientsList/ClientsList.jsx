import React, { useState } from "react";
import "./clientsList.css";
import { PiUserFill } from "react-icons/pi";
import { LuTrash2, LuPencil } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import AlertModal from "../../AlertModal/AlertModal";
import box from "../../../assets/box.png";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import user from "../../../assets/user.png";
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
        cancelText={"إلغاء"}
        confirmText={"حذف"}
        onCancel={() => setShowAlert(false)}
        onConfirm={() => {
          setShowAlert(false);
          console.log("Client Deleted");
        }}
      />

      {!isEmpty && (
        <div className="addTopRow">
          <button className="addBtn" onClick={() => navigate("/addClientForm")}>
            إضافة عميل جديد <span className="plusIcon">+</span>
          </button>
        </div>
      )}

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
            onClick={() => navigate("/addClientForm")}
          >
            إضافة عميل
          </button>
        </div>
      ) : (
        <>
          {clients.map((client) => (
            <>
         

              <div
                className="mainCard"
                key={client.id}
                onClick={() => navigate(`/clientDetails/${client.id}`)}
              >
                <span>
                  <img src={user} className="cardImg" />
                </span>
                <div className="cardCol">
                  <div className="cardRow">
                    <div>
                      <p className="cardTitle">أحمد محمد</p>
                    </div>{" "}
                    <div>
                      <div className="btnRow">
                        <button className="btnNotify">إرسال إشعار</button>
                        <button className="btnVisit">زيارة جديدة</button>
                      </div>
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

                      <div className="cardBlick subText">
                        {" "}
                        {client.visits} زيارات
                      </div>
                      <div className="cardBlock subText">رتبته...</div>
                      <div className="cardBlock moreDetails ">تفاصيل أكثر</div>
                    </div>
                    <div className="btnRow">
                      <span
                        className="editRow"
                        onClick={() => navigate(`/editClientForm`)}
                      >
                        <LuPencil className="actionIcon" /> تعديل البيانات
                      </span>{" "}
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
            </>
          ))}
        </>
      )}
    </div>
  );
};

export default ClientsList;
