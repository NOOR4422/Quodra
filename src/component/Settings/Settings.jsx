import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaPlus, FaTrashAlt, FaEdit } from "react-icons/fa";
import AddEditAlertModal from "../Modals/AddEditAlertModal/AddEditAlertModal";
import AlertModal from "../Modals/AlertModal/AlertModal";
import "./settings.css";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

const Settings = () => {
  const [workshopInfo] = useState({
    name: "ورشة أوتو فيكس للخدمات",
    phone: "01235795767",
    address: "مدينة نصر - القاهرة",
    hours: "السبت - الخميس: 8:00 ص - 10:00 م",
  });

  const [services, setServices] = useState([
    "فحص أعطال",
    "غسيل وتلميع",
    "صيانة تكييف",
    "صيانة شاملة",
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [modalMode, setModalMode] = useState("");

  const [currentLang, setCurrentLang] = useState("العربية");

  const { register, handleSubmit, reset, setValue } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    if (modalMode === "add") {
      setServices([...services, data.serviceName]);
      setShowAddModal(false);
      setShowSuccessModal("تم إضافة الخدمة بنجاح");
    } else if (modalMode === "edit") {
      const updated = services.map((s) =>
        s === selectedService ? data.serviceName : s
      );
      setServices(updated);
      setShowEditModal(false);
      setShowSuccessModal("تم تعديل الخدمة بنجاح");
    }
    reset();
  };

  const handleDelete = () => {
    setServices(services.filter((s) => s !== selectedService));
    setShowDeleteModal(false);
    setShowSuccessModal("تم حذف الخدمة بنجاح");
  };

  return (
    <div className="mainContainer" dir="rtl">
      <div className="innerContainer mainContainer container-fluid">
        {" "}
        <div className="languageRow">
          <p className=" languageLabel">معلومات الورشة</p>
        </div>
        <form className="mainForm row" dir="rtl">
          <div className="formCol col-12 col-md-6">
            <div className="inputGroup">
              <label>
                اسم الورشة <span className="req"></span>
              </label>
              <input type="text" value={workshopInfo.name} readOnly />
            </div>

            <div className="inputGroup">
              <label>
                رقم الهاتف <span className="req"></span>
              </label>
              <input type="text" value={workshopInfo.phone} readOnly />
            </div>
          </div>

          <div className="formCol col-12 col-md-6">
            <div className="inputGroup">
              <label>
                عنوان الورشة <span className="req"></span>
              </label>
              <input type="text" value={workshopInfo.address} readOnly />
            </div>{" "}
            <div className="inputGroup">
              <label>
                ساعات العمل <span className="req"></span>
              </label>
              <input type="text" value={workshopInfo.hours} readOnly />
            </div>
          </div>
        </form>
      </div>
      <div className="innerContainer mainContainer">
        <div className="languageRow">
          <div>
            <p className="cardTitle">خدمات الورشة</p>
          </div>

          <div>
            <button
              className="addServiceBtn"
              onClick={() => {
                setModalMode("add");
                setShowAddModal(true);
                reset();
              }}
            >
              <FaPlus /> إضافة خدمة
            </button>
          </div>
        </div>

        <ul className="servicesList">
          {services.map((service) => (
            <li key={service}>
              <span>{service}</span>
              <div className="actions">
                <button
                  className="editBtn"
                  onClick={() => {
                    setSelectedService(service);
                    setValue("serviceName", service);
                    setModalMode("edit");
                    setShowEditModal(true);
                  }}
                >
                  <FaRegEdit />
                  تعديل الخدمة
                </button>
                <button
                  className="deleteBtn"
                  onClick={() => {
                    setSelectedService(service);
                    setModalMode("delete");
                    setShowDeleteModal(true);
                  }}
                >
                  <RiDeleteBin6Line />
                  حذف الخدمة
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="innerContainer mainContainer"
        style={{ border: "1px solid #ebebebff" }}
      >
        <div className="languageRow">
          <label className="languageLabel">اللغة</label>

          <div className="languageToggle">
            <button
              className="langBtn"
              onClick={() =>
                setCurrentLang(
                  currentLang === "العربية" ? "English" : "العربية"
                )
              }
            >
              {currentLang}
            </button>
          </div>
        </div>

        <div className="passwordRow">
          <button
            className="changePasswordBtn"
            onClick={() => navigate("/changePassword")}
          >
            تغيير كلمة السر
          </button>
          <IoIosArrowBack className="arrowIcon" />
        </div>
      </div>

      {(showAddModal || showEditModal) && (
        <AddEditAlertModal
          show={true}
          title={modalMode === "add" ? "إضافة خدمة" : "تعديل الخدمة"}
          confirmText={modalMode === "add" ? "إضافة" : "تعديل"}
          cancelText="إلغاء"
          showCancel={true}
          onCancel={() => {
            setShowAddModal(false);
            setShowEditModal(false);
          }}
          onConfirm={handleSubmit(onSubmit)}
          inputValue={register("serviceName").value}
          setInputValue={(val) => setValue("serviceName", val)}
        />
      )}

      {showDeleteModal && (
        <AlertModal
          show={true}
          title="تحذير ⚠️"
          message={`هل أنت متأكد من حذف خدمة ${selectedService} ؟`}
          confirmText="نعم"
          cancelText="لا"
          showCancel={true}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      )}

      {showSuccessModal && (
        <AlertModal
          show={true}
          title={
            modalMode === "add"
              ? "تم إضافة الخدمة  بنجاح ✅"
              : "تم تعديل الخدمة  بنجاح ✅"
          }
          confirmText="تم"
          showCancel={false}
          onConfirm={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  );
};

export default Settings;
