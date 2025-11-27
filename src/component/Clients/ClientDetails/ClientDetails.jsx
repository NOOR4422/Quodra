import React, { useState } from "react";
import "./clientDetails.css";
import {
  PiUserThin,
  PiPhoneLight,
  PiClipboardTextLight,
  PiEnvelopeSimpleLight,
} from "react-icons/pi";
import { LuTrash2, LuPencil } from "react-icons/lu";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";
import AlertModal from "../../Modals/AlertModal/AlertModal";
import { useNavigate, useParams } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";

const ClientDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [client, setClient] = useState({
    name: "محمد احمد",
    phone: "012132324435",
    id: "012132324435",
    email: "Example@gmail.com",
  });

  const [showAlert, setShowAlert] = useState(false);

  const [cars, setCars] = useState([
    {
      type: "تويوتا كورولا 2020",
      plate: "3456 ب س",
      mileage: "85,300 كم",
      oil: "5W-30 Synthetic",
      open: true,
    },
    {
      type: "تويوتا كورولا 2020",
      plate: "3456 ب س",
      mileage: "85,300 كم",
      oil: "5W-30 Synthetic",
      open: false,
    },
  ]);

  const toggleCar = (index) => {
    setCars((prev) =>
      prev.map((c, i) => (i === index ? { ...c, open: !c.open } : c))
    );
  };

  return (
    <>
      <div className="mainContainer container-fluid" dir="rtl">
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

        <div className="detailsHeader">
          <div className="topButtons">
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

          <div className="editDeleteRowPage">
            <span
              className="editClient"
              onClick={() => navigate(`/clients/${id}/edit`)}
            >
              تعديل البيانات <LuPencil className="iconSm" />
            </span>

            <span className="deleteClient" onClick={() => setShowAlert(true)}>
              حذف العميل <LuTrash2 className="iconSm" />
            </span>
          </div>
        </div>

        <div className="roundedSection">
          <p className="cardTitle">المعلومات الشخصية</p>

          <div className="personalInfo">
            <div className="infoGrid">
              <div className="infoRow">
                <PiUserThin className="iconLg" />
                <span>{client.name}</span>
                {/* <span className="arrow">
                  <IoIosArrowForward />
                </span> */}
              </div>

              <div className="infoRow">
                <PiPhoneLight className="iconLg" />
                <span>{client.phone}</span>
                {/* <span className="arrow">
                  <IoIosArrowForward />
                </span> */}
              </div>

              <div className="infoRow">
                <PiClipboardTextLight className="iconLg" />
                <span>{client.id}</span>
                {/* <span className="arrow">
                  <IoIosArrowForward />
                </span> */}
              </div>

              <div className="infoRow">
                <PiEnvelopeSimpleLight className="iconLg" />
                <span>{client.email}</span>
                {/* <span className="arrow">
                  <IoIosArrowForward />
                </span> */}
              </div>
            </div>
          </div>
        </div>

        <div className="roundedSection">
          <p className="cardTitle mb-2">السيارات</p>

          {cars.map((car, index) => (
            <div key={index}>
              <div className="carHeader" onClick={() => toggleCar(index)}>
                <span className="subTitle">السيارة {index + 1}</span>
                {car.open ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
              </div>

              {car.open && (
                <div className="mainForm row">
                  <div className="formCol col-12 col-md-6">
                    <div className="inputGroup">
                      <label>نوع السيارة</label>
                      <input type="text" defaultValue={car.type} readOnly />
                    </div>

                    <div className="inputGroup">
                      <label>رقم اللوحة</label>
                      <input type="text" defaultValue={car.plate} readOnly />
                    </div>
                  </div>

                  <div className="formCol col-12 col-md-6">
                    <div className="inputGroup">
                      <label>قراءة العداد الحالية</label>
                      <input type="text" defaultValue={car.mileage} readOnly />
                    </div>

                    <div className="inputGroup">
                      <label>نوع الزيت الحالي</label>
                      <input type="text" defaultValue={car.oil} readOnly />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ClientDetails;
