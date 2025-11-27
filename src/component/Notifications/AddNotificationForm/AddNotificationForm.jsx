import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FaStar } from "react-icons/fa";
import AlertModal from "../../Modals/AlertModal/AlertModal";
import Select from "react-select";
import "./addNotificationForm.css";

// 🔹 shared dropdown styles (same as in your other forms)
const selectStyles = {
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
      borderColor: state.isFocused ? "#dd2912" : "#eacccc",
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
};

const categoryOptions = [
  { value: "العملاء", label: "العملاء" },
  { value: "الفنيين", label: "الفنيين" },
  { value: "الإدارة", label: "الإدارة" },
];

const notificationTypeOptions = [
  { value: "تنبيه", label: "تنبيه" },
  { value: "تذكير", label: "تذكير" },
  { value: "إعلان", label: "إعلان" },
];

const AddNotificationForm = () => {
  const [showAlert, setShowAlert] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      category: "",
      notificationType: "",
      date: "",
      message: "",
    },
  });

  const onSubmit = (data) => {
    console.log("✅ Notification Sent:", data);
    setShowAlert(true);
    reset();
  };

  return (
    <div className="formContainer container-fluid ">
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
        className="mainForm row"
        onSubmit={handleSubmit(onSubmit)}
        dir="rtl"
      >
        <div className="formCol col-12 col-md-6">
          <div className="inputGroup">
            <label>
              الفئة{" "}
              <span className="req">
                <FaStar />
              </span>
            </label>

            <Controller
              name="category"
              control={control}
              rules={{ required: "يجب اختيار الفئة" }}
              render={({ field, fieldState }) => {
                const selectedOption =
                  categoryOptions.find((o) => o.value === field.value) || null;

                return (
                  <>
                    <Select
                      {...field}
                      value={selectedOption}
                      onChange={(opt) => field.onChange(opt ? opt.value : "")}
                      options={categoryOptions}
                      classNamePrefix="categorySelect"
                      isSearchable={false}
                      styles={{
                        ...selectStyles,
                        control: (base, state) => ({
                          ...selectStyles.control(base, state),
                          borderColor: fieldState.invalid
                            ? "#dd2912"
                            : state.isFocused
                            ? "#dd2912"
                            : "#eacccc",
                        }),
                      }}
                    />
                    <p className="errorMessage">{fieldState.error?.message}</p>
                  </>
                );
              }}
            />
          </div>

          <div className="inputGroup">
            <label>التاريخ</label>
            <input type="date" {...register("date")} placeholder="التاريخ" />
          </div>
        </div>

        <div className="formCol col-12 col-md-6">
          <div className="inputGroup">
            <label>
              نوع الإشعار{" "}
              <span className="req">
                <FaStar />
              </span>
            </label>

            <Controller
              name="notificationType"
              control={control}
              rules={{ required: "يجب اختيار نوع الإشعار" }}
              render={({ field, fieldState }) => {
                const selectedOption =
                  notificationTypeOptions.find(
                    (o) => o.value === field.value
                  ) || null;

                return (
                  <>
                    <Select
                      {...field}
                      value={selectedOption}
                      onChange={(opt) => field.onChange(opt ? opt.value : "")}
                      options={notificationTypeOptions}
                      classNamePrefix="notifTypeSelect"
                      isSearchable={false}
                      styles={{
                        ...selectStyles,
                        control: (base, state) => ({
                          ...selectStyles.control(base, state),
                          borderColor: fieldState.invalid
                            ? "#dd2912"
                            : state.isFocused
                            ? "#dd2912"
                            : "#eacccc",
                        }),
                      }}
                    />
                    <p className="errorMessage">{fieldState.error?.message}</p>
                  </>
                );
              }}
            />
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
            <p className="errorMessage">{errors.message?.message}</p>
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
