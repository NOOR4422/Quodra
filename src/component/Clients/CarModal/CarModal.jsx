import React from "react";
import { useForm } from "react-hook-form";
import "./carModal.css";
import { FaStar } from "react-icons/fa";

const CarModal = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "onTouched" });

  const saveToLocalStorage = (carData) => {
    const existingCars = JSON.parse(localStorage.getItem("cars")) || [];
    const updatedCars = [...existingCars, carData];

    localStorage.setItem("cars", JSON.stringify(updatedCars));

    if (onSave) onSave(updatedCars);
  };

  const onSubmit = (data) => {
    saveToLocalStorage(data);
    reset();
    onClose();
  };

  return (
    <div className="modalOverlay">
      <div className="carModalContainer" dir="rtl">
      

        <form className="carForm" onSubmit={handleSubmit(onSubmit)}>
         <div className="closeIcon" onClick={onClose}>
          &times;
        </div>   <div className="formRow">
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
                  placeholder="نوع السيارة"
                  {...register("carType", { required: "هذا الحقل مطلوب" })}
                  className={errors.carType ? "inputError" : ""}
                />
                <p className="errorMsg">{errors.carType?.message}</p>
              </div>

              <div className="inputGroup">
                <label>قراءة العداد الحالية</label>
                <input
                  type="text"
                  placeholder="قراءة العداد الحالية"
                  {...register("mileage", {
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "يسمح فقط بالأرقام",
                    },
                  })}
                  className={errors.mileage ? "inputError" : ""}
                />
                <p className="errorMsg">{errors.mileage?.message}</p>
              </div>
            </div>

            <div className="formCol">
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
                  })}
                  className={errors.plateNumber ? "inputError" : ""}
                />
                <p className="errorMsg">{errors.plateNumber?.message}</p>
              </div>

              <div className="inputGroup">
                <label>
                  نوع الزيت الحالي{" "}
                  <span className="req">
                    <FaStar />
                  </span>
                </label>
                <select
                  {...register("oilType", { required: "هذا الحقل مطلوب" })}
                  className={errors.oilType ? "inputError" : ""}
                >
                  <option value="">اختر نوع الزيت</option>
                  <option value="5W-30 Synthetic">5W-30 Synthetic</option>
                  <option value="10W-40">10W-40</option>
                </select>
                <p className="errorMsg">{errors.oilType?.message}</p>
              </div>
            </div>
          </div>

          <button type="submit" className="saveBtn">
            حفظ
          </button>
        </form>
      </div>
    </div>
  );
};

export default CarModal;
