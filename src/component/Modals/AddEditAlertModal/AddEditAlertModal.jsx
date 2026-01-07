import React, { useEffect } from "react";
import "./addEditAlertModal.css";
import { FaStar } from "react-icons/fa";
import { useForm, Controller } from "react-hook-form";

const AddEditAlertModal = ({
  show,
  title = "إضافة",
  alertIcon,
  placeholder = "قم بإدخال الاسم",
  cancelText = "إلغاء",
  confirmText = "حفظ",
  onCancel,
  onConfirm,
  showCancel = true,

  inputValue,
  setInputValue,

  showKm = false,
  kmValue,
  setKmValue,
  kmPlaceholder = "أدخل عدد الكيلومترات",
}) => {
  if (!show) return null;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      name: inputValue || "",
      km: kmValue ?? "",
    },
  });

  useEffect(() => {
    reset({
      name: inputValue || "",
      km: kmValue ?? "",
    });
  }, [inputValue, kmValue, reset, show]);

  const onSubmit = (data) => {
 
    if (showKm) {
      onConfirm?.({
        name: data.name,
        km: data.km,
      });
    } else {
      onConfirm?.(data.name);
    }
  };

  return (
    <div className="alertOverlay">
      <div className="alertCard addServiceModal" dir="rtl">
        <form className="alertBody" onSubmit={handleSubmit(onSubmit)}>
          <label className="sectionTitle">
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {title} <FaStar className="req" />
            </div>
          </label>

          <Controller
            name="name"
            control={control}
            rules={{
              required: "هذا الحقل مطلوب",
              minLength: { value: 2, message: "الحد الأدنى حرفان" },
              validate: (v) =>
                v.trim().length > 0 || "لا يمكن ترك الحقل فارغًا",
            }}
            render={({ field }) => (
              <input
                type="text"
                className="modalInput"
                placeholder={placeholder}
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  setInputValue?.(e.target.value);
                }}
                onBlur={field.onBlur}
              />
            )}
          />
          <p className="errorMessage">{errors.name?.message}</p>

          {showKm && (
            <>
              <Controller
                name="km"
                control={control}
                rules={{
                  required: "عدد الكيلومترات مطلوب",
                  validate: (v) => {
                    const n = Number(v);
                    if (!Number.isFinite(n)) return "ادخل رقم صحيح";
                    if (n <= 0) return "يجب أن يكون أكبر من صفر";
                    return true;
                  },
                }}
                render={({ field }) => (
                  <input
                    type="number"
                    className="modalInput"
                    placeholder={kmPlaceholder}
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setKmValue?.(e.target.value);
                    }}
                    onBlur={field.onBlur}
                    min="1"
                  />
                )}
              />
              <p className="errorMessage">{errors.km?.message}</p>
            </>
          )}

          <div className="alertButtons">
            {showCancel && (
              <button
                type="button"
                className="alertBtn cancel"
                onClick={onCancel}
              >
                {cancelText}
              </button>
            )}

            <button
              type="submit"
              className="alertBtn confirm"
              disabled={isSubmitting}
            >
              {confirmText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditAlertModal;
