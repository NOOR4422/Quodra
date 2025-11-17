import React, { useState } from "react";
import "./visitsList.css";
import { LuTrash2, LuPencil } from "react-icons/lu";
import carIcon from "../../../assets/car.png";
import serviceIcon from "../../../assets/process.png";
import { IoPersonOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import AlertModal from "../../AlertModal/AlertModal";
import box from "../../../assets/box.png";
import user from "../../../assets/user.png";
import sportCar from "../../../assets/sportCar.png";
import { MdOutlinePhoneAndroid } from "react-icons/md";

const VisitsList = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

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
    {
      id: 3,
      service: "فحص شامل",
      customer: "سارة علي",
      car: "نيسان سنترا 2021",
      date: "7/10/2025",
      price: 600,
    },
    {
      id: 4,
      service: "تصليح فرامل",
      customer: "محمد مراد",
      car: "هيونداي إلنترا 2018",
      date: "8/10/2025",
      price: 800,
    },
  ]);

  const isEmpty = visits.length === 0;

  return (
    <div className="mainContainer">
      <AlertModal
        show={showAlert}
        title="تحذير"
        alertIcon="⚠️"
        message="هل انت متأكد من حذف هذه الزيارة ؟"
        onCancel={() => setShowAlert(false)}
        onConfirm={() => {
          setShowAlert(false);
          console.log("Visit Deleted");
        }}
        cancelText="إلغاء"
        confirmText={"حذف"}
      />

      {!isEmpty && (
        <div className="addTopRow">
          <button className="addBtn" onClick={() => navigate("/addVisitForm")}>
            إضافة زيارة جديدة <span className="plusIcon">+</span>
          </button>
        </div>
      )}

      {isEmpty ? (
        <div className="emptyState">
          <img src={box} alt="no data" className="emptyIcon" />
          <p className="emptyText">لا توجد زيارات مسجلة بعد.</p>
          <p className="emptySubText">
            ابدأ بإضافة أول زيارة لتتبع خدمات الورشة بسهولة.
          </p>
          <button
            className="addBtn"
            style={{ backgroundColor: "#DD2912", color: "white" }}
            onClick={() => navigate("/addVisitForm")}
          >
            إضافة زيارة
          </button>
        </div>
      ) : (
        <>
          {visits.map((visit) => (
            <>
              <div className="mainCard">
                <span>
                  <img src={serviceIcon} className="cardImg" />
                </span>
                <div className="cardCol">
                  <div className="cardRow">
                    <div>
                      <p className="cardTitle"> {visit.service}</p>
                    </div>{" "}
                    <div>
                      <div className="">
                        <p className="cardTitle"> {visit.price} ج.م</p>
                      </div>
                    </div>
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
                      </div>{" "}
                      <div className="cardBlick subText"> {visit.date}</div>
                      <div className="cardBlock moreDetails ">تفاصيل أكثر</div>
                    </div>
                    <div className="btnRow">
                      <span
                        className="editRow"
                        onClick={() => navigate(`/editVisitForm`)}
                      >
                        تعديل البيانات <LuPencil className="actionIcon" />
                      </span>{" "}
                      <span
                        className="deleteRow"
                        onClick={() => setShowAlert(true)}
                      >
                        حذف العميل <LuTrash2 className="actionIcon" />
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

export default VisitsList;
