import React, { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FaStar } from "react-icons/fa";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import AlertModal from "../../Modals/AlertModal/AlertModal";
import "./addNotificationForm.css";
import {
  createNotificationAndRefresh,
  getErrorMessage,
} from "../../../api/notifications";

const selectStyles = {
  container: (base) => ({ ...base, outline: "none" }),
  control: (base, state) => ({
    ...base,
    borderRadius: 12,
    borderColor: state.isFocused ? "#dd2912" : "#eacccc",
    boxShadow: "none",
    outline: "none",
    height: 55,
    paddingInline: 4,
    direction: "rtl",
    "&:hover": { borderColor: state.isFocused ? "#dd2912" : "#eacccc" },
  }),
  menu: (base) => ({ ...base, borderRadius: 12, zIndex: 9999, marginTop: 2 }),
  option: (base, state) => ({
    ...base,
    textAlign: "right",
    borderRadius: 12,
    fontFamily: "Cairo, sans-serif",
    backgroundColor: state.isSelected ? "#dd2912" : "#fff",
    color: state.isSelected ? "#fff" : "#333",
  }),
  indicatorSeparator: () => ({ display: "none" }),
};

const rankOptions = [
  { value: 0, label: "عادي" },
  { value: 1, label: "برونزي" },
  { value: 2, label: "فضي" },
  { value: 3, label: "ذهبي" },
  { value: 4, label: "البلاتيني" },
];

const typeOptions = [
  { value: 0, label: "عروض" },
  { value: 1, label: "نصائح" },
  { value: 2, label: "تنبيهات" },
];

const AddNotificationForm = () => {
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submittingRef = useRef(false);

  const workshopId = localStorage.getItem("workshopId");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: { rank: null, type: null, message: "" },
  });

  const onSubmit = async (data) => {
    if (submittingRef.current) return;
    submittingRef.current = true;

    setIsSubmitting(true);
    setApiError("");

    try {
      const rank = data.rank?.value;
      const type = data.type?.value;

      if (rank === undefined || rank === null) {
        setApiError("اختر الرتبة");
        return;
      }

      if (type === undefined || type === null) {
        setApiError("اختر نوع الإشعار");
        return;
      }

      if (!workshopId) {
        setApiError("لا يمكن إرسال إشعار بدون workshopId");
        return;
      }

      await createNotificationAndRefresh({
        message: data.message,
        type: Number(type),
        rank: Number(rank),
        workshopId,
        lang: "ar",
      });

      setShowAlert(true);
      reset({ rank: null, type: null, message: "" });
    } catch (err) {
      setApiError(getErrorMessage(err));
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div className="formContainer">
      <AlertModal
        show={showAlert}
        title="تم بنجاح"
        alertIcon="✅"
        confirmText="تم"
        showCancel={false}
        message="تم إرسال الإشعار بنجاح"
        onConfirm={() => {
          setShowAlert(false);
          navigate("/notifications", { state: { refresh: Date.now() } });
        }}
      />

      <h2 className="formTitle">إرسال إشعار جديد</h2>

      {!!apiError && <p className="errorMessage">{apiError}</p>}

      <form
        className="mainForm row"
        onSubmit={handleSubmit(onSubmit)}
        dir="rtl"
      >
        <div className="formCol col-12 col-md-6">
          <div className="inputGroup">
            <label>
              الرتبة المستهدفة{" "}
              <span className="req">
                <FaStar />
              </span>
            </label>

            <Controller
              name="rank"
              control={control}
              rules={{ required: "اختر الرتبة" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={rankOptions}
                  isSearchable={false}
                  styles={selectStyles}
                  placeholder="اختر الرتبة"
                />
              )}
            />
            <p className="errorMessage">{errors.rank?.message}</p>
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
              name="type"
              control={control}
              rules={{ required: "اختر نوع الإشعار" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={typeOptions}
                  isSearchable={false}
                  styles={selectStyles}
                  placeholder="اختر النوع"
                />
              )}
            />
            <p className="errorMessage">{errors.type?.message}</p>
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

        <button
          type="submit"
          className="submitBtn"
          disabled={isSubmitting}
          style={{ opacity: isSubmitting ? 0.7 : 1 }}
        >
          {isSubmitting ? "جاري الإرسال..." : "إرسال"}
        </button>
      </form>
    </div>
  );
};

export default AddNotificationForm;
