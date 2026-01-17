import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import "./carModal.css";
import { FaStar } from "react-icons/fa";
import Select from "react-select";
import { carsApi } from "../../../api/cars";
import oilTypeApi from "../../../api/oilType";

const CarModal = ({ isOpen, onClose, onSave, customerId, workshopId }) => {
  if (!isOpen) return null;

  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [oilOptions, setOilOptions] = useState([]);
  const [oilLoading, setOilLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      carModel: "",
      make: "",
      year: "",
      plateNumber: "",
      currentKm: "",
      oilType: null,
    },
  });

  useEffect(() => {
    if (!isOpen || !workshopId) return;

    let mounted = true;

    (async () => {
      try {
        setOilLoading(true);
        setApiError("");

        const list = await oilTypeApi.getAllByWorkshop({ workshopId });

        if (!mounted) return;

        const options =
          (list || []).map((o) => ({
            value: o.oiltybe ?? o.name ?? o.id,
            label: o.oiltybe ?? o.name ?? "",
            raw: o,
          })) || [];

        setOilOptions(options);
      } catch (err) {
        if (mounted) {
          setApiError(oilTypeApi.getErrorMessage(err));
        }
      } finally {
        if (mounted) setOilLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isOpen, workshopId]);

  const onSubmit = async (data) => {
    if (!customerId) {
      setApiError("لا يمكن إضافة سيارة بدون عميل");
      return;
    }

    setApiError("");
    setIsSubmitting(true);

    try {
      const payload = {
        carModel: data.carModel.trim(),
        make: data.make.trim(),
        year: data.year ? Number(data.year) : null,
        plateNumber: data.plateNumber.trim(),
        currentKm: data.currentKm ? Number(data.currentKm) : 0,
        oilType: data.oilType?.value || "",
        customerId,
      };

      const res = await carsApi.createCar(payload);

      if (!res?.success) {
        setApiError(res?.message || "فشل حفظ بيانات السيارة");
        return;
      }

      if (onSave) onSave(res);

      reset();
      onClose();
    } catch (err) {
      setApiError(carsApi.getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modalOverlay">
      <div className="carModalContainer" dir="rtl">
        <form className="mainForm row" onSubmit={handleSubmit(onSubmit)}>
          <div className="closeIcon" onClick={onClose}>
            &times;
          </div>

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
                  {...register("carModel", { required: "هذا الحقل مطلوب" })}
                  className={errors.carModel ? "inputError" : ""}
                />
                <p className="errorMessage">{errors.carModel?.message}</p>
              </div>

              <div className="inputGroup">
                <label>
                  الماركة{" "}
                  <span className="req">
                    <FaStar />
                  </span>
                </label>
                <input
                  type="text"
                  placeholder=" الماركة"
                  {...register("make", { required: "هذا الحقل مطلوب" })}
                  className={errors.make ? "inputError" : ""}
                />
                <p className="errorMessage">{errors.make?.message}</p>
              </div>

              <div className="inputGroup">
                <label>
                  قراءة العداد الحالية
                  <span className="req">
                    <FaStar />
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="قراءة العداد الحالية"
                  {...register("currentKm", {
                    required: "هذا الحقل مطلوب",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "يسمح فقط بالأرقام",
                    },
                  })}
                  className={errors.currentKm ? "inputError" : ""}
                />
                <p className="errorMessage">{errors.currentKm?.message}</p>
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
                  سنة الصنع{" "}
                  <span className="req">
                    <FaStar />
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="سنة الصنع"
                  {...register("year", {
                    required: "هذا الحقل مطلوب",
                    pattern: {
                      value: /^[0-9]{4}$/,
                      message: "يرجى إدخال سنة صحيحة (4 أرقام)",
                    },
                  })}
                  className={errors.year ? "inputError" : ""}
                />
                <p className="errorMessage">{errors.year?.message}</p>
              </div>

              <div className="inputGroup">
                <label>
                  نوع الزيت{" "}
                  <span className="req">
                    <FaStar />
                  </span>
                </label>
                <Controller
                  name="oilType"
                  control={control}
                  rules={{ required: "هذا الحقل مطلوب" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={oilOptions}
                      classNamePrefix="oilSelect"
                      isSearchable={false}
                      isLoading={oilLoading}
                      isDisabled={oilLoading || oilOptions.length === 0}
                      placeholder={
                        oilLoading
                          ? "جارٍ تحميل أنواع الزيوت..."
                          : "اختر نوع الزيت"
                      }
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

          {!!apiError && (
            <p className="errorMessage" style={{ textAlign: "center" }}>
              {apiError}
            </p>
          )}

          <div>
            <button
              type="submit"
              className="submitBtn"
              disabled={isSubmitting}
              style={{ opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? "جاري الحفظ..." : "حفظ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarModal;
