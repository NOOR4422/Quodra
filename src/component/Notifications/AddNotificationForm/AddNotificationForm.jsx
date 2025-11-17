import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaStar } from "react-icons/fa";
import AlertModal from "../../AlertModal/AlertModal";
import "./addNotificationForm.css";
import "../../styles/formsStyle.css";


const AddNotificationForm = () => {
  const [showAlert, setShowAlert] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "onTouched" });

  const onSubmit = (data) => {
    console.log("✅ Notification Sent:", data);
    setShowAlert(true);
    reset();
  };

  return (
    <div className="formContainer ">
      <AlertModal
        show={showAlert}
        title="تم بنجاح"
        alertIcon="✅"
        confirmText="تم"
        showCancel={false}
        message="تم إرسال الإشعار بنجاح"
        onConfirm={() => setShowAlert(false)}
      />

      <h2 className="formTitle">إرسال إشعار جديد</h2>

      <form
        id="addNotificationForm"
        className="mainForm"
        onSubmit={handleSubmit(onSubmit)}
        dir="rtl"
      >
        <div className="formCol">
          <div className="inputGroup">
            <label>
              الفئة{" "}
              <span className="req">
                <FaStar />
              </span>
            </label>
            <select
              {...register("category", { required: "يجب اختيار الفئة" })}
              className={errors.category ? "inputError" : ""}
            >
              <option value="">اختر الفئة التي تستقبل الإشعار</option>
              <option value="العملاء">العملاء</option>
              <option value="الفنيين">الفنيين</option>
              <option value="الإدارة">الإدارة</option>
            </select>
            <p className="errorMsg">{errors.category?.message}</p>
          </div>

          <div className="inputGroup">
            <label>التاريخ</label>
                      <input type="date" {...register("date")} placeholder="التاريخ" />
                      
          </div>
        </div>

        <div className="formCol">
          <div className="inputGroup">
            <label>
              نوع الإشعار{" "}
              <span className="req">
                <FaStar />
              </span>
            </label>
            <select
              {...register("notificationType", {
                required: "يجب اختيار نوع الإشعار",
              })}
              className={errors.notificationType ? "inputError" : ""}
            >
              <option value="">اختر نوع الإشعار</option>
              <option value="تنبيه">تنبيه</option>
              <option value="تذكير">تذكير</option>
              <option value="إعلان">إعلان</option>
            </select>
            <p className="errorMsg">{errors.notificationType?.message}</p>
          </div>

          <div className="inputGroup">
            <label>
              نص الإشعار{" "}
              <span className="req">
                <FaStar />
              </span>
            </label>
            <input
              placeholder="اكتب نص الإشعار هنا..."
              {...register("message", { required: "يجب إدخال نص الإشعار" })}
              className={errors.message ? "inputError" : ""}
                      />
                      <p className="errorMsg">{errors.message?.message}</p>
          </div>
        </div>
      </form>

      <button type="submit" form="addNotificationForm" className="submitBtn">
        إرسال
      </button>
    </div>
  );
};

export default AddNotificationForm;
