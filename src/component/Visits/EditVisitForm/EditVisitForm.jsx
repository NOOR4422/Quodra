import React from "react";
import { useForm } from "react-hook-form";
import "../AddVisitForm/addVisitForm.css";
import { FaStar } from "react-icons/fa";
import AlertModal from "../../Modals/AlertModal/AlertModal";

import { useState } from "react";
const EditVisitForm = ({ visitData }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      clientName: "محمد أحمد",
      carType: "تويوتا كورولا 2020",
      visitDate: "2025-10-25",
      services: "غسيل و تلميع",
      price: "300",
      oilChanged: "no",
      oilType: "5W-30",
      oilAmount: "4",
      kmAtChange: "15000",
      nextRecommendedKm: "20000",
    },
  });
  const [showAlert, setShowAlert] = useState(false);

  const isOilChanged = watch("oilChanged");

  const onSubmit = (data) => {
    console.log("✅ Visit Updated:", data);
    setShowAlert(true);
  };

  return (
    <div className="formContainer">
      <AlertModal
        show={showAlert}
        title="تم بنجاح"
        alertIcon="✅"
        confirmText="تم"
        showCancel={false}
        message="تم تعديل الزيارة  بنجاح"
        onCancel={() => setShowAlert(false)}
        onConfirm={() => {
          setShowAlert(false);
          console.log("Visit edited confirmed");
        }}
      />
      <h2 className="formTitle">تعديل الزيارة</h2>

      <form
        id="editVisitForm"
        className="mainForm"
        onSubmit={handleSubmit(onSubmit)}
        dir="rtl"
      >
        <div className="formCol">
          <div className="inputGroup">
            <label>اسم العميل</label>
            <input
              type="text"
              placeholder="اسم العميل"
              {...register("clientName")}
              className={errors.clientName ? "inputError" : ""}
            />
            <p className="errorMsg">{errors.clientName?.message}</p>
          </div>

          <div className="inputGroup">
            <label>نوع الخدمة</label>
            <input
              type="text"
              placeholder="نوع الخدمة"
              {...register("services")}
              className={errors.services ? "inputError" : ""}
            />
            <p className="errorMsg">{errors.services?.message}</p>
          </div>

          <div className="inputGroup">
            <label>السعر</label>
            <input
              type="text"
              placeholder="السعر"
              {...register("price", {
                validate: (v) =>
                  !v || /^[0-9]+$/.test(v) || "يسمح فقط بالأرقام",
              })}
              className={errors.price ? "inputError" : ""}
            />
            <p className="errorMsg">{errors.price?.message}</p>
          </div>

          {isOilChanged === "yes" && (
            <div className="inputGroup">
              <label>نوع الزيت</label>
              <select {...register("oilType")}>
                <option value="">اختر نوع الزيت</option>
                <option value="5W-30">5W-30</option>
                <option value="10W-40">10W-40</option>
              </select>
            </div>
          )}

          {isOilChanged === "yes" && (
            <div className="inputGroup">
              <label>عدد الكيلومترات عند التغيير</label>
              <input
                type="text"
                placeholder="عدد الكيلومترات عند التغيير"
                {...register("kmAtChange", {
                  validate: (v) =>
                    !v || /^[0-9]+$/.test(v) || "يسمح فقط بالأرقام",
                })}
                className={errors.kmAtChange ? "inputError" : ""}
              />
              <p className="errorMsg">{errors.kmAtChange?.message}</p>
            </div>
          )}
        </div>{" "}
        <div className="formCol">
          <div className="inputGroup">
            <label>نوع السيارة</label>
            <input
              type="text"
              placeholder="نوع السيارة"
              {...register("carType")}
              className={errors.carType ? "inputError" : ""}
            />
            <p className="errorMsg">{errors.carType?.message}</p>
          </div>

          <div className="inputGroup">
            <label>تاريخ الزيارة</label>
            <input
              type="date"
              placeholder="تاريخ الزيارة"
              {...register("visitDate", {
                validate: (v) =>
                  !v || /^\d{4}-\d{2}-\d{2}$/.test(v) || "تاريخ غير صالح",
              })}
              className={errors.visitDate ? "inputError" : ""}
            />
            <p className="errorMsg">{errors.visitDate?.message}</p>
          </div>

          <div className="inputGroup" style={{ marginTop: "25px" }}>
            <label>هل تم تغيير الزيت؟</label>
            <div style={{ display: "flex", gap: "25px", marginTop: "5px" }}>
              <label>
                <input
                  type="radio"
                  value="yes"
                  {...register("oilChanged")}
                  defaultChecked={visitData?.oilChanged === "yes"}
                />{" "}
                نعم
              </label>
              <label>
                <input
                  type="radio"
                  value="no"
                  {...register("oilChanged")}
                  defaultChecked={visitData?.oilChanged === "no"}
                />{" "}
                لا
              </label>
            </div>
          </div>

          {isOilChanged === "yes" && (
            <div className="inputGroup">
              <label>كمية الزيت</label>
              <input
                type="text"
                placeholder="كمية الزيت"
                {...register("oilAmount", {
                  validate: (v) =>
                    !v || /^[0-9]+$/.test(v) || "يسمح فقط بالأرقام",
                })}
                className={errors.oilAmount ? "inputError" : ""}
              />
              <p className="errorMsg">{errors.oilAmount?.message}</p>
            </div>
          )}

          {isOilChanged === "yes" && (
            <div className="inputGroup">
              <label>الكيلومترات الموصى بها للتغيير القادم</label>
              <input
                type="text"
                placeholder="الكيلومترات الموصى بها للتغيير القادم"
                {...register("nextRecommendedKm", {
                  validate: (v) =>
                    !v || /^[0-9]+$/.test(v) || "يسمح فقط بالأرقام",
                })}
                className={errors.nextRecommendedKm ? "inputError" : ""}
              />
              <p className="errorMsg">{errors.nextRecommendedKm?.message}</p>
            </div>
          )}
        </div>
      </form>

      <button type="submit" form="editVisitForm" className="submitBtn">
        حفظ
      </button>
    </div>
  );
};

export default EditVisitForm;
