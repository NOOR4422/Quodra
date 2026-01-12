import React, { useEffect, useMemo, useState, useCallback } from "react";
import { FaPlus, FaRegEdit } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

import AddEditAlertModal from "../Modals/AddEditAlertModal/AddEditAlertModal";
import AlertModal from "../Modals/AlertModal/AlertModal";
import "./settings.css";

import serviceTypeApi from "../../api/serviceType";
import oilTypeApi from "../../api/oilType";
import userApi from "../../api/user";

const Settings = () => {
  const [currentLang, setCurrentLang] = useState("العربية");
  const lang = useMemo(
    () => (currentLang === "العربية" ? "ar" : "en"),
    [currentLang]
  );

  const navigate = useNavigate();
  const workshopId = localStorage.getItem("workshopId");

  const [workshopInfo, setWorkshopInfo] = useState(null);
  const [workshopLoading, setWorkshopLoading] = useState(false);
  const [workshopErrorMsg, setWorkshopErrorMsg] = useState("");

  const fetchWorkshop = useCallback(async () => {
    setWorkshopLoading(true);
    setWorkshopErrorMsg("");
    try {
      const data = await userApi.getWorkshop({ lang });
      setWorkshopInfo(data);
    } catch (err) {
      setWorkshopErrorMsg(userApi.getErrorMessage(err));
    } finally {
      setWorkshopLoading(false);
    }
  }, [lang]);

  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesErrorMsg, setServicesErrorMsg] = useState("");

  const fetchServices = useCallback(async () => {
    setServicesLoading(true);
    setServicesErrorMsg("");
    try {
      if (!workshopId) {
        setServices([]);
        setServicesErrorMsg("لا يمكن تحميل الخدمات بدون workshopId");
        return;
      }
      const list = await serviceTypeApi.getAllByWorkshopId({
        workshopId,
        lang,
      });
      setServices(list || []);
    } catch (err) {
      setServicesErrorMsg(serviceTypeApi.getErrorMessage(err));
    } finally {
      setServicesLoading(false);
    }
  }, [workshopId, lang]);

  const [oilTypes, setOilTypes] = useState([]);
  const [oilLoading, setOilLoading] = useState(false);
  const [oilErrorMsg, setOilErrorMsg] = useState("");

  const fetchOilTypes = useCallback(async () => {
    setOilLoading(true);
    setOilErrorMsg("");
    try {
      if (!workshopId) {
        setOilTypes([]);
        setOilErrorMsg("لا يمكن تحميل الزيوت بدون workshopId");
        return;
      }
      const list = await oilTypeApi.getAllByWorkshop({ workshopId, lang });
      setOilTypes(list || []);
    } catch (err) {
      setOilErrorMsg(oilTypeApi.getErrorMessage(err));
    } finally {
      setOilLoading(false);
    }
  }, [workshopId, lang]);

  useEffect(() => {
    fetchWorkshop();
    fetchServices();
    fetchOilTypes();
  }, [fetchWorkshop, fetchServices, fetchOilTypes]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showAddOilModal, setShowAddOilModal] = useState(false);
  const [showDeleteOilModal, setShowDeleteOilModal] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successTitle, setSuccessTitle] = useState("");

  const [selectedService, setSelectedService] = useState(null);
  const [selectedOil, setSelectedOil] = useState(null);

  const [modalMode, setModalMode] = useState(""); 
  const [modalValue, setModalValue] = useState("");
  const [oilKmValue, setOilKmValue] = useState("");

  const openAddService = () => {
    setModalMode("add");
    setModalValue("");
    setSelectedService(null);
    setShowAddModal(true);
  };

  const openEditService = (service) => {
    setSelectedService(service);
    setModalMode("edit");
    setModalValue(service?.name || "");
    setShowEditModal(true);
  };

  const openDeleteService = (service) => {
    setSelectedService(service);
    setModalMode("delete");
    setShowDeleteModal(true);
  };

  const handleAddEditServiceConfirm = async (serviceName) => {
    try {
      const name = (serviceName || "").trim();
      if (!name) throw new Error("اسم الخدمة مطلوب");

      if (modalMode === "add") {
        await serviceTypeApi.create({ name, workshopId, lang });
        setShowAddModal(false);
        setSuccessTitle("تم إضافة الخدمة بنجاح ✅");
      } else if (modalMode === "edit") {
        await serviceTypeApi.update({ id: selectedService?.id, name, lang });
        setShowEditModal(false);
        setSuccessTitle("تم تعديل الخدمة بنجاح ✅");
      }

      setShowSuccessModal(true);
      await fetchServices();
    } catch (err) {
      setSuccessTitle(serviceTypeApi.getErrorMessage(err));
      setShowSuccessModal(true);
    }
  };

  const handleDeleteServiceConfirm = async () => {
    try {
      await serviceTypeApi.remove({ id: selectedService?.id, lang });
      setShowDeleteModal(false);
      setSuccessTitle("تم حذف الخدمة بنجاح ✅");
      setShowSuccessModal(true);
      await fetchServices();
    } catch (err) {
      setShowDeleteModal(false);
      setSuccessTitle(serviceTypeApi.getErrorMessage(err));
      setShowSuccessModal(true);
    }
  };

  const openAddOil = () => {
    setModalMode("addOil");
    setModalValue("");
    setOilKmValue("");
    setSelectedOil(null);
    setShowAddOilModal(true);
  };

  const openDeleteOil = (oil) => {
    setModalMode("deleteOil");
    setSelectedOil(oil);
    setShowDeleteOilModal(true);
  };

  const handleAddOilConfirm = async (payload) => {
    try {
      const oiltybe = (payload?.name || "").trim();
      const kmNumber = Number(payload?.km);

      if (!oiltybe) throw new Error("اسم الزيت مطلوب");
      if (!Number.isFinite(kmNumber) || kmNumber <= 0) {
        throw new Error("KM غير صحيح");
      }

      await oilTypeApi.create({ oiltybe, km: kmNumber, workshopId, lang });

      setShowAddOilModal(false);
      setSuccessTitle("تم إضافة نوع الزيت بنجاح ✅");
      setShowSuccessModal(true);
      await fetchOilTypes();
    } catch (err) {
      setSuccessTitle(oilTypeApi.getErrorMessage(err));
      setShowSuccessModal(true);
    }
  };

  const handleDeleteOilConfirm = async () => {
    try {
      await oilTypeApi.remove({ id: selectedOil?.id, lang });
      setShowDeleteOilModal(false);
      setSuccessTitle("تم حذف نوع الزيت بنجاح ✅");
      setShowSuccessModal(true);
      await fetchOilTypes();
    } catch (err) {
      setShowDeleteOilModal(false);
      setSuccessTitle(oilTypeApi.getErrorMessage(err));
      setShowSuccessModal(true);
    }
  };

  return (
    <div className="mainContainer" dir="rtl">
      <div className="innerContainer mainContainer">
        <div className="languageRow">
          <p className="languageLabel">معلومات الورشة</p>
        </div>

        {workshopLoading && (
          <p style={{ padding: 12 }}>جارِ تحميل بيانات الورشة...</p>
        )}
        {!!workshopErrorMsg && (
          <p style={{ padding: 12, color: "crimson" }}>{workshopErrorMsg}</p>
        )}

        {!workshopLoading && !workshopErrorMsg && (
          <form className="mainForm row" dir="rtl">
            <div className="formCol col-12 col-md-6">
              <div className="inputGroup">
                <label>اسم الورشة</label>
                <input type="text" value={workshopInfo?.name || ""} readOnly />
              </div>

              <div className="inputGroup">
                <label>رقم الهاتف</label>
                <input
                  type="text"
                  value={workshopInfo?.phone || workshopInfo?.phoneNumber || ""}
                  readOnly
                />
              </div>
            </div>

            <div className="formCol col-12 col-md-6">
              <div className="inputGroup">
                <label>عنوان الورشة</label>
                <input
                  type="text"
                  value={workshopInfo?.address || ""}
                  readOnly
                />
              </div>

              <div className="inputGroup">
                <label>ساعات العمل</label>
                <input
                  type="text"
                  value={workshopInfo?.workingHours || ""}
                  readOnly
                />
              </div>
            </div>
          </form>
        )}
      </div>

      <div className="innerContainer mainContainer">
        <div className="languageRow">
          <p className="cardTitle">خدمات الورشة</p>

          <button
            className="addServiceBtn"
            type="button"
            onClick={openAddService}
          >
            <FaPlus /> إضافة خدمة
          </button>
        </div>

        {servicesLoading && (
          <p style={{ padding: 12 }}>جارِ تحميل الخدمات...</p>
        )}
        {!!servicesErrorMsg && (
          <p style={{ padding: 12, color: "crimson" }}>{servicesErrorMsg}</p>
        )}

        <ul className="servicesList">
          {services.map((service) => (
            <li key={service.id ?? service.name}>
              <span>{service.name}</span>

              <div className="actions">
                <button
                  className="editBtn"
                  type="button"
                  onClick={() => openEditService(service)}
                >
                  <FaRegEdit />
                  تعديل الخدمة
                </button>

                <button
                  className="deleteBtn"
                  type="button"
                  onClick={() => openDeleteService(service)}
                >
                  <RiDeleteBin6Line />
                  حذف الخدمة
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="innerContainer mainContainer">
        <div className="languageRow">
          <p className="cardTitle">زيوت تغيير الزيت</p>

          <button className="addServiceBtn" type="button" onClick={openAddOil}>
            <FaPlus /> إضافة زيت
          </button>
        </div>

        {oilLoading && <p style={{ padding: 12 }}>جارِ تحميل الزيوت...</p>}
        {!!oilErrorMsg && (
          <p style={{ padding: 12, color: "crimson" }}>{oilErrorMsg}</p>
        )}

        <ul className="servicesList">
          {oilTypes.map((oil) => (
            <li key={oil.id ?? `${oil.oiltybe}-${oil.km}`}>
              <span>
                {oil.oiltybe} - {oil.km} KM
              </span>

              <div className="actions">
                <button
                  className="deleteBtn"
                  type="button"
                  onClick={() => openDeleteOil(oil)}
                >
                  <RiDeleteBin6Line />
                  حذف
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
              type="button"
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
            type="button"
            onClick={() => navigate("/settings/change-password")}
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
          inputValue={modalValue}
          setInputValue={setModalValue}
          onCancel={() => {
            setShowAddModal(false);
            setShowEditModal(false);
          }}
          onConfirm={handleAddEditServiceConfirm}
        />
      )}

      {showDeleteModal && (
        <AlertModal
          show={true}
          title="تحذير ⚠️"
          message={`هل أنت متأكد من حذف خدمة ${selectedService?.name} ؟`}
          confirmText="نعم"
          cancelText="لا"
          showCancel={true}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteServiceConfirm}
        />
      )}

      {showAddOilModal && (
        <AddEditAlertModal
          show={true}
          title="إضافة زيت"
          confirmText="إضافة"
          cancelText="إلغاء"
          showCancel={true}
          placeholder="اكتب اسم الزيت (مثال: Mobil)"
          kmPlaceholder="أدخل KM (مثال: 10000)"
          showKm={true}
          inputValue={modalValue}
          setInputValue={setModalValue}
          kmValue={oilKmValue}
          setKmValue={setOilKmValue}
          onCancel={() => setShowAddOilModal(false)}
          onConfirm={handleAddOilConfirm}
        />
      )}

      {showDeleteOilModal && (
        <AlertModal
          show={true}
          title="تحذير ⚠️"
          message={`هل أنت متأكد من حذف زيت ${selectedOil?.oiltybe} ؟`}
          confirmText="نعم"
          cancelText="لا"
          showCancel={true}
          onCancel={() => setShowDeleteOilModal(false)}
          onConfirm={handleDeleteOilConfirm}
        />
      )}

      {showSuccessModal && (
        <AlertModal
          show={true}
          title={successTitle}
          confirmText="تم"
          showCancel={false}
          onConfirm={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  );
};

export default Settings;
