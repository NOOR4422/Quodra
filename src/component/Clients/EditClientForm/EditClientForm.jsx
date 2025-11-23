import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "./editClientForm.css";
import { FaStar } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";
import CarModal from "../CarModal/CarModal";

const EditClientForm = () => {
  const [carModalOpen, setCarModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      name: "كريم محمد علي",
      whatsapp: "01012345678",
      phone: "01012345678",
      email: "kareem.m.ali@example.com",
      plateNumber: "3456 ب س",
      carType: "تويوتا كورولا 2020",
      mileage: "85300",
      oilType: "5W-30 Synthetic",
    },
  });

  const onSubmit = (data) => {
    console.log("✅ Client Updated:", data);
  };

  return (
    <>
      <div className="formContainer container-fluid">
        <h2 className="formTitle">تعديل بيانات العميل</h2>

        <form
          id="editForm"
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
                {...register("name", { required: "هذا الحقل مطلوب" })}
                className={errors.name ? "inputError" : ""}
              />
              <p className="errorMsg">{errors.name?.message}</p>
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
                {...register("whatsapp", {
                  required: "هذا الحقل مطلوب",
                  pattern: { value: /^[0-9]+$/, message: "يسمح فقط بالأرقام" },
                  minLength: { value: 9, message: "رقم غير صالح" },
                  maxLength: { value: 15, message: "رقم طويل جداً" },
                })}
                className={errors.whatsapp ? "inputError" : ""}
              />
              <p className="errorMsg">{errors.whatsapp?.message}</p>
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
                {...register("carType", {
                  required: "هذا الحقل مطلوب",
                })}
                className={errors.carType ? "inputError" : ""}
              />
              <p className="errorMsg">{errors.carType?.message}</p>

              <button
                type="button"
                className="addCarBtn"
                onClick={() => setCarModalOpen(true)}
              >
                <IoAddCircleOutline />
                إضافة سيارة
              </button>
            </div>

            <div className="inputGroup">
              <label>قراءة العداد الحالية</label>
              <input
                type="text"
                {...register("mileage", {
                  pattern: { value: /^[0-9]+$/, message: "يسمح فقط بالأرقام" },
                })}
                className={errors.mileage ? "inputError" : ""}
              />
              <p className="errorMsg">{errors.mileage?.message}</p>
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
                {...register("phone", {
                  required: "هذا الحقل مطلوب",
                  pattern: { value: /^[0-9]+$/, message: "يسمح فقط بالأرقام" },
                  minLength: { value: 9, message: "رقم غير صالح" },
                  maxLength: { value: 15, message: "رقم طويل جداً" },
                })}
                className={errors.phone ? "inputError" : ""}
              />
              <p className="errorMsg">{errors.phone?.message}</p>
            </div>

            <div className="inputGroup">
              <label>البريد الإلكتروني</label>
              <input
                type="text"
                {...register("email", {
                  pattern: {
                    value: /^[^@ ]+@[^@ ]+\.[^@ ]+$/,
                    message: "البريد الإلكتروني غير صالح",
                  },
                })}
                className={errors.email ? "inputError" : ""}
              />
              <p className="errorMsg">{errors.email?.message}</p>
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
                {...register("plateNumber", {
                  required: "هذا الحقل مطلوب",
                  pattern: {
                    value: /^[A-Za-z0-9أ-ي ]+$/,
                    message: "صيغة رقم اللوحة غير صحيحة",
                  },
                })}
                className={errors.plateNumber ? "inputError" : ""}
              />
              <p className="errorMsg">{errors.plateNumber?.message}</p>
            </div>

            <div className="inputGroup" style={{ marginTop: "28px" }}>
              <label>نوع الزيت الحالي</label>
              <select {...register("oilType")}>
                <option value="5W-30 Synthetic">5W-30 Synthetic</option>
                <option value="10W-40">10W-40</option>
              </select>
            </div>
          </div>
        </form>

        <button type="submit" form="editForm" className="submitBtn">
          حفظ
        </button>
      </div>

      <CarModal
        isOpen={carModalOpen}
        onClose={() => setCarModalOpen(false)}
        onSave={(carData) => console.log("🚗 Car Added:", carData)}
      />
    </>
  );
};

export default EditClientForm;
