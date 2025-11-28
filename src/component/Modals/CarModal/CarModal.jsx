import React from "react";
import { useForm } from "react-hook-form";
import "./carModal.css";
import { FaStar } from "react-icons/fa";
import Select from "react-select";
import {  Controller } from "react-hook-form";

const CarModal = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({ mode: "onTouched" });
const oilOptions = [
  { value: "5W-30 Synthetic", label: "5W-30 Synthetic" },
  { value: "10W-40", label: "10W-40" },
];

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
        <form className="mainForm row" onSubmit={handleSubmit(onSubmit)}>
          <div className="closeIcon" onClick={onClose}>
            &times;
          </div>{" "}
          <div className="formRow">
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
                <p className="errorMessage">{errors.carType?.message}</p>
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
                <p className="errorMessage">{errors.mileage?.message}</p>
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
                <p className="errorMessage">{errors.plateNumber?.message}</p>
              </div>

              <div className="inputGroup">
                <label>
                  نوع الزيت الحالي{" "}
                  <span className="req">
                    <FaStar />
                  </span>
                </label>
                <Controller
                  name="oilType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={oilOptions}
                      classNamePrefix="oilSelect"
                      isSearchable={false}
                      styles={{
                        container: (base) => ({
                          ...base,
                          outline: "none",
                        }),
                        control: (base, state) => ({
                          ...base,
                          borderRadius: 12,
                          borderColor: state.isFocused ? "#dd2912" : "#eacccc",
                          boxShadow: "none",
                          outline: "none",
                          height: 55,
                          paddingInline: 4,
                          direction: "rtl",
                          "&:hover": {
                            borderColor: state.isFocused
                              ? "#dd2912"
                              : "#eacccc",
                          },
                        }),
                        menu: (base) => ({
                          ...base,
                          borderRadius: 12,
                          zIndex: 9999,
                          marginTop: 2,
                        }),
                        option: (base, state) => ({
                          ...base,
                          borderRadius: 12,

                          textAlign: "right",
                          fontFamily: "Cairo, sans-serif",
                          backgroundColor: state.isSelected
                            ? "#dd2912"
                            : state.isFocused
                            ? "#fff"
                            : "#fff",
                          color: state.isSelected ? "#fff" : "#333",
                        }),
                        indicatorSeparator: () => ({ display: "none" }),
                      }}
                    />
                  )}
                />
                <p className="errorMessage">{errors.oilType?.message}</p>
              </div>
            </div>
          </div>
          <div>
            <button type="submit" className="submitBtn">
              حفظ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarModal;
