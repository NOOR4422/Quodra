import React from "react";
import { useForm } from "react-hook-form";
import "./addVisitForm.css";
import { FaStar } from "react-icons/fa";
import AlertModal from "../../Modals/AlertModal/AlertModal";
import { useState } from "react";
const AddVisitForm = () => {
  const [showAlert, setShowAlert] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      service: {
        full: false,
        wash: false,
        fix: false,
        ac: false,
      },
    },
  });

  const onSubmit = (data) => {
    const { services } = data;
    const anySelected = services && services.length > 0;

    if (!anySelected) {
      setError("serviceCheck", {
        type: "manual",
        message: "يجب اختيار خدمة واحدة على الأقل",
      });
      return;
    }

    console.log("✅ Visit Added:", data);
    clearErrors("serviceCheck");
    setShowAlert(true);
  };

  const isOilChanged = watch("oilChanged");

  return (
    <div className="formContainer ">
      <AlertModal
        show={showAlert}
        title="تم بنجاح"
        alertIcon="✅"
        confirmText="تم"
        showCancel={false}
        message="تم إضافة الزيارة  بنجاح"
        onCancel={() => setShowAlert(false)}
        onConfirm={() => {
          setShowAlert(false);
          console.log("Visit added confirmed");
        }}
      />
      <p className="formTitle">إضافة زيارة جديدة</p>

      <form
        id="addVisitForm"
        className="mainForm"
        onSubmit={handleSubmit(onSubmit)}
        dir="rtl"
      >
        <div className="formCol">
          <div className="inputGroup">
            <label>
              اسم العميل{" "}
              <span className="req">
                <FaStar />
              </span>
            </label>
            <input
              type="text"
              placeholder="اسم العميل"
              {...register("clientName", { required: "هذا الحقل مطلوب" })}
              className={errors.clientName ? "inputError" : ""}
            />
            <p className="errorMsg">{errors.clientName?.message}</p>
          </div>

          <div className="inputGroup inputGroupCheckBox">
            <label>
              نوع الخدمة{" "}
              <span className="req">
                <FaStar />
              </span>
            </label>
            <div style={{ display: "flex", gap: "18px", marginTop: "6px" }}>
              <label>
                <input
                  type="checkbox"
                  value="صيانة شاملة"
                  {...register("services")}
                />{" "}
                صيانة شاملة
              </label>
              <label>
                <input
                  type="checkbox"
                  value="غسيل & تلميع"
                  {...register("services")}
                />{" "}
                غسيل & تلميع
              </label>
              <label>
                <input
                  type="checkbox"
                  value="فحص أعطال"
                  {...register("services")}
                />{" "}
                فحص أعطال
              </label>
              <label>
                <input
                  type="checkbox"
                  value="صيانة تكييف"
                  {...register("services")}
                />{" "}
                صيانة تكييف
              </label>
            </div>

            <input
              type="hidden"
              {...register("serviceCheck", {
                validate: (_, formValues) =>
                  (formValues.services && formValues.services.length > 0) ||
                  "يجب اختيار خدمة واحدة على الأقل",
              })}
            />

            {errors.serviceCheck && (
              <p className="errorMsg">{errors.serviceCheck.message}</p>
            )}
          </div>

          <div className="inputGroup">
            <label>السعر</label>
            <input
              type="text"
              placeholder="السعر"
              {...register("price", {
                pattern: { value: /^[0-9]+$/, message: "يسمح فقط بالأرقام" },
              })}
              className={errors.price ? "inputError" : ""}
            />
            <p className="errorMsg">{errors.price?.message}</p>
          </div>

          {isOilChanged === "yes" && (
            <div className="inputGroup">
              <label>
                نوع الزيت{" "}
                <span className="req">
                  <FaStar />
                </span>
              </label>
              <select
                {...register("oilType", { required: "هذا الحقل مطلوب" })}
                className={errors.oilType ? "inputError" : ""}
              >
                <option value="">اختر نوع الزيت</option>
                <option value="5W-30">5W-30</option>
                <option value="10W-40">10W-40</option>
              </select>
              <p className="errorMsg">{errors.oilType?.message}</p>
            </div>
          )}

          {isOilChanged === "yes" && (
            <div className="inputGroup">
              <label>
                عدد الكيلومترات عند التغيير{" "}
                <span className="req">
                  <FaStar />
                </span>
              </label>
              <input
                type="text"
                placeholder="عدد الكيلومترات عند التغيير"
                {...register("kmAtChange", {
                  required: "هذا الحقل مطلوب",
                  pattern: { value: /^[0-9]+$/, message: "يسمح فقط بالأرقام" },
                })}
                className={errors.kmAtChange ? "inputError" : ""}
              />
              <p className="errorMsg">{errors.kmAtChange?.message}</p>
            </div>
          )}
        </div>

        <div className="formCol">
          <div className="inputGroup">
            <label>
              نوع السيارة{" "}
              <span className="req">
                <FaStar />
              </span>
            </label>

            <input
              type="text"
              placeholder=" نوع السيارة"
              {...register("carType", { required: "هذا الحقل مطلوب" })}
              className={errors.carType ? "inputError" : ""}
            />
            <p className="errorMsg">{errors.carType?.message}</p>
          </div>

          <div className="inputGroup">
            <label>
              تاريخ الزيارة{" "}
              <span className="req">
                <FaStar />
              </span>
            </label>
            <input
              type="date"
              placeholder="تاريخ الزيارة"
              {...register("visitDate", { required: "هذا الحقل مطلوب" })}
              className={errors.visitDate ? "inputError" : ""}
            />
            <p className="errorMsg">{errors.visitDate?.message}</p>
          </div>

          <div className="inputGroup" style={{ marginBottom: "0px" }}>
            <label>هل تم تغيير الزيت؟</label>
            <div style={{ display: "flex", gap: "25px", marginTop: "5px" }}>
              <label>
                <input
                  type="radio"
                  value="yes"
                  {...register("oilChanged", { required: "اختر إجابة" })}
                />{" "}
                نعم
              </label>
              <label>
                <input
                  type="radio"
                  value="no"
                  {...register("oilChanged", { required: "اختر إجابة" })}
                />{" "}
                لا
              </label>
            </div>
            <p className="errorMsg">{errors.oilChanged?.message}</p>
          </div>

          {isOilChanged === "yes" && (
            <div className="inputGroup">
              <label>كمية الزيت</label>
              <input
                type="text"
                placeholder="كمية الزيت"
                {...register("oilAmount", {
                  pattern: { value: /^[0-9]+$/, message: "يسمح فقط بالأرقام" },
                })}
                className={errors.oilAmount ? "inputError" : ""}
              />
              <p className="errorMsg">{errors.oilAmount?.message}</p>
            </div>
          )}

          {isOilChanged === "yes" && (
            <div className="inputGroup">
              <label>
                الكيلومترات الموصى بها للتغيير القادم{" "}
                <span className="req">
                  <FaStar />
                </span>
              </label>
              <input
                type="text"
                placeholder="الكيلومترات الموصى بها للتغيير القادم"
                {...register("nextRecommendedKm", {
                  required: "هذا الحقل مطلوب",
                  pattern: { value: /^[0-9]+$/, message: "يسمح فقط بالأرقام" },
                })}
                className={errors.nextRecommendedKm ? "inputError" : ""}
              />
              <p className="errorMsg">{errors.nextRecommendedKm?.message}</p>
            </div>
          )}
        </div>
      </form>

      <button type="submit" form="addVisitForm" className="submitBtn">
        إضافة
      </button>
    </div>
  );
};

export default AddVisitForm;
