import React, { useState } from "react";
import "./notificationsList.css";
import NotificationsIcon from "../../../assets/Notifications.png";
import box from "../../../assets/box.png";
import { IoPersonOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const NotificationsList = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "لا تؤجل الصيانة الدورية، الوقاية دائماً أوفر من الإصلاح.",
      target: "موجه إلى الكل",
      type: "نصيحة",
      date: "5/10/2025",
    },
    {
      id: 2,
      title: "احصل على خصم 20% على خدمات تغيير الزيت هذا الشهر فقط!",
      target: "موجه إلى الكل",
      type: "عرض خاص",
      date: "6/10/2025",
    },
    {
      id: 3,
      title: "تذكير: موعد صيانة سيارتك قادم في غضون أسبوع.",
      target: "احمد محمد",
      type: "تذكير",
      date: "7/10/2025",
    },
    {
      id: 4,
      title: "جديد في ورشتنا: خدمة فحص الأنظمة الإلكترونية للسيارات.",
      target: "موجه إلى الكل",
      type: "إعلان",
      date: "8/10/2025",
    },
    {
      id: 5,
      title: "تأكد من فحص ضغط الإطارات بانتظام لتحسين أداء القيادة.",
      target: "موجه إلى الكل",
      type: "نصيحة",
      date: "9/10/2025",
    },
    {
      id: 6,
      title: "عرض خاص: خصم 15% على خدمات توازن العجلات هذا الأسبوع فقط!",
      target: "موجه إلى الكل",
      type: "عرض خاص",
      date: "10/10/2025",
    },
  ]);

  const isEmpty = notifications.length === 0;

  return (
    <div className="mainContainer">
      {!isEmpty && (
        // <div className="addTopRow">
        //   <button
        //     className="addBtn"
        //     onClick={() => navigate("/notifications/add")}
        //   >
        //     إرسال إشعار جديد <span className="plusIcon">+</span>
        //   </button>
        // </div>

        <div className="addLeft">
          <span
            className="topPlusIcon"
            onClick={() => navigate("/clients/add")}
          >
            +
          </span>
          <button
            className="addBtn"
            onClick={() => navigate("/notifications/add")}
          >
            إرسال إشعار جديد
          </button>
        </div>
      )}

      {isEmpty ? (
        <div className="emptyState">
          <img src={box} alt="no notifications" className="emptyIcon" />
          <p className="emptyText">لا توجد إشعارات بعد.</p>
          <p className="emptySubText">
            ابدأ بإنشاء أول إشعار لإرسال عروض وتنبيهات لعملائك.
          </p>

          <button
            className="addBtn"
            style={{ backgroundColor: "#DD2912", color: "white" }}
            onClick={() => navigate("/notifications/add")}
          >
            إنشاء إشعار جديد
          </button>
        </div>
      ) : (
        <>
          {notifications.map((note) => (
            <div className="mainCard" key={note.id}>
              <span>
                <img src={NotificationsIcon} className="cardImg" />
              </span>

              <div className="cardCol">
                <div className="cardRow">
                  <p className="cardTitle">{note.title}</p>
                  <p className="cardTitle">{note.type}</p>
                </div>

                <div className="cardRow">
                  <div className="cardBlock">
                    <IoPersonOutline />
                    <span className="subText">{note.target}</span>
                  </div>

                  <div className="cardBlock">
                    <span className="subText">{note.date}</span>
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

export default NotificationsList;
