import React from "react";
import { useForm } from "react-hook-form";
import "./addClientForm.css";
import { FaStar } from "react-icons/fa";

const AddClientForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const onSubmit = (data) => {
    console.log("✅ Form Submitted:", data);
    reset();
  };

  return (
    <div className="formContainer container-fluid">
      <h2 className="formTitle">إضافة عميل جديد</h2>

      <form
        id="mainForm"
        className="mainForm row"
        onSubmit={handleSubmit(onSubmit)}
        dir="rtl"
      >
        <div className="formCol col-12 col-md-6">
          <div className="inputGroup">
            <label>
              الاسم{" "}
              <span className="req">
                <FaStar />
              </span>
            </label>
            <input
              type="text"
              placeholder="الاسم"
              {...register("name", {
                required: "هذا الحقل مطلوب",
              })}
              className={errors.name ? "inputError" : ""}
            />
            <p className="errorMessage">{errors.name?.message}</p>
          </div>

          <div className="inputGroup">
            <label>
              واتساب{" "}
              <span className="req">
                <FaStar />
              </span>
            </label>
            <input
              type="text"
              placeholder="واتساب"
              {...register("whatsapp", {
                required: "هذا الحقل مطلوب",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "يسمح فقط بالأرقام",
                },
                minLength: {
                  value: 9,
                  message: "رقم غير صالح",
                },
                maxLength: {
                  value: 15,
                  message: "رقم طويل جداً",
                },
              })}
              className={errors.whatsapp ? "inputError" : ""}
            />
            <p className="errorMessage">{errors.whatsapp?.message}</p>
          </div>

          <div className="inputGroup">
            <label>
              نوع السيارة{" "}
              <span className="req">
                <FaStar />
              </span>
            </label>
            <input
              type="text"
              placeholder="نوع السيارة"
              {...register("carType", {
                required: "هذا الحقل مطلوب",
              })}
              className={errors.carType ? "inputError" : ""}
            />
            <p className="errorMessage">{errors.carType?.message}</p>
          </div>

          <div className="inputGroup">
            <label>
              تاريخ أول زيارة{" "}
              <span className="req">
                <FaStar />
              </span>
            </label>
            <input
              type="date"
              {...register("firstVisit", {
                required: "هذا الحقل مطلوب",
              })}
              className={errors.firstVisit ? "inputError" : ""}
            />
            <p className="errorMessage">{errors.firstVisit?.message}</p>
          </div>
        </div>

        <div className="formCol col-12 col-md-6">
          <div className="inputGroup">
            <label>
              رقم الهاتف{" "}
              <span className="req">
                <FaStar />
              </span>
            </label>
            <input
              type="text"
              placeholder="رقم الهاتف"
              {...register("phone", {
                required: "هذا الحقل مطلوب",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "يسمح فقط بالأرقام",
                },
                minLength: {
                  value: 9,
                  message: "رقم غير صالح",
                },
                maxLength: {
                  value: 15,
                  message: "رقم طويل جداً",
                },
              })}
              className={errors.phone ? "inputError" : ""}
            />
            <p className="errorMessage">{errors.phone?.message}</p>
          </div>

          <div className="inputGroup">
            <label>البريد الإلكتروني</label>
            <input
              type="text"
              placeholder="البريد الإلكتروني"
              {...register("email", {
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ ]+$/,
                  message: "البريد الإلكتروني غير صالح",
                },
              })}
              className={errors.email ? "inputError" : ""}
            />
            <p className="errorMessage">{errors.email?.message || " "}</p>
          </div>

          <div className="inputGroup">
            <label>
              رقم اللوحة{" "}
              <span className="req">
                <FaStar />
              </span>
            </label>
            <input
              type="text"
              placeholder="رقم اللوحة"
              {...register("plateNumber", {
                required: "هذا الحقل مطلوب",
                pattern: {
                  value: /^[A-Za-z0-9أ-ي ]+$/,
                  message: "صيغة رقم اللوحة غير صحيحة",
                },
              })}
              className={errors.plateNumber ? "inputError" : ""}
            />
            <p className="errorMessage">{errors.plateNumber?.message}</p>
          </div>

          <div className="inputGroup">
            <label>ملاحظات</label>
            <input type="text" placeholder="ملاحظات" {...register("notes")} />
          </div>
        </div>
      </form>

      <button type="submit" form="mainForm" className="submitBtn">
        إضافة
      </button>
    </div>
  );
};

export default AddClientForm;
