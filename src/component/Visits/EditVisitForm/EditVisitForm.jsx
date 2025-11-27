import React from "react";
import { useForm } from "react-hook-form";
import "../AddVisitForm/addVisitForm.css";
import { FaStar } from "react-icons/fa";
import AlertModal from "../../Modals/AlertModal/AlertModal";
import Select from "react-select";
import {  Controller } from "react-hook-form";

import { useState } from "react";
const EditVisitForm = ({ visitData }) => {
  const {
    register,
    handleSubmit,
    control,
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
      oilType: "5W-30 Synthetic", 

      oilAmount: "4",
      kmAtChange: "15000",
      nextRecommendedKm: "20000",
    },
  });

  const oilOptions = [
  { value: "5W-30 Synthetic", label: "5W-30 Synthetic" },
  { value: "10W-40", label: "10W-40" },
];

  const [showAlert, setShowAlert] = useState(false);

  const isOilChanged = watch("oilChanged");

  const onSubmit = (data) => {
    console.log("✅ Visit Updated:", data);
    setShowAlert(true);
  };

  return (
    <div className="formContainer container-fluid">
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
        className="mainForm row"
        onSubmit={handleSubmit(onSubmit)}
        dir="rtl"
      >
        <div className="formCol col-12 col-md-6">
          <div className="inputGroup">
            <label>اسم العميل</label>
            <input
              type="text"
              placeholder="اسم العميل"
              {...register("clientName")}
              className={errors.clientName ? "inputError" : ""}
            />
            <p className="errorMessage">{errors.clientName?.message}</p>
          </div>

          <div className="inputGroup">
            <label>نوع الخدمة</label>
            <input
              type="text"
              placeholder="نوع الخدمة"
              {...register("services")}
              className={errors.services ? "inputError" : ""}
            />
            <p className="errorMessage">{errors.services?.message}</p>
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
            <p className="errorMessage">{errors.price?.message}</p>
          </div>

          {isOilChanged === "yes" && (
            <div className="inputGroup">
              <label>نوع الزيت</label>
              <Controller
                name="oilType"
                control={control}
                render={({ field }) => {
                  const selectedOption =
                    oilOptions.find((opt) => opt.value === field.value) || null;

                  return (
                    <Select
                      {...field}
                      value={selectedOption}
                      onChange={(opt) => field.onChange(opt ? opt.value : "")}
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
                          textAlign: "right",
                          borderRadius: 12,
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
                  );
                }}
              />
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
              <p className="errorMessage">{errors.kmAtChange?.message}</p>
            </div>
          )}
        </div>{" "}
        <div className="formCol col-12 col-md-6">
          <div className="inputGroup">
            <label>نوع السيارة</label>
            <input
              type="text"
              placeholder="نوع السيارة"
              {...register("carType")}
              className={errors.carType ? "inputError" : ""}
            />
            <p className="errorMessage">{errors.carType?.message}</p>
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
            <p className="errorMessage">{errors.visitDate?.message}</p>
          </div>
          <div className="inputGroup ">
            <label>هل تم تغيير الزيت؟</label>

            <div className="radioOptions">
              <div className="radioItem">
                <input
                  type="radio"
                  value="yes"
                  {...register("oilChanged", { required: "اختر إجابة" })}
                  className="m-0"
                />{" "}
                <p>نعم</p>
              </div>
              <div className="radioItem">
                <input
                  type="radio"
                  value="no"
                  {...register("oilChanged", { required: "اختر إجابة" })}
                />{" "}
                <p>لا </p>
              </div>
            </div>

            <p className="errorMessage">{errors.oilChanged?.message || ""}</p>
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
              <p className="errorMessage">{errors.oilAmount?.message}</p>
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
              <p className="errorMessage">
                {errors.nextRecommendedKm?.message}
              </p>
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
