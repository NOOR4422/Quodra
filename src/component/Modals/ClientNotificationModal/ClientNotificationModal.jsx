import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FaStar } from "react-icons/fa";
import Select from "react-select";
import AlertModal from "../../Modals/AlertModal/AlertModal";
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

const typeOptions = [
  { value: 0, label: "عروض" },
  { value: 1, label: "نصائح" },
  { value: 2, label: "تنبيهات" },
];

const ClientNotificationModal = ({ show, client, onClose }) => {
  const workshopId = localStorage.getItem("workshopId");
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      type: null,
      message: "",
      date: "",
    },
  });

  useEffect(() => {
    if (show && client) {
      reset({ type: null, message: "", date: "" });
      setApiError("");
    }
  }, [show, client, reset]);

  const onSubmit = async (data) => {
    if (!client) return;

    setApiError("");
    if (!workshopId) {
      setApiError("لا يمكن إرسال إشعار بدون workshopId");
      return;
    }

    const type = data.type?.value;
    if (type === undefined || type === null) {
      setApiError("اختر نوع الإشعار");
      return;
    }

    try {
      setSubmitting(true);

      await createNotificationAndRefresh({
        message: data.message,
        type: Number(type),
        userId: client.id, // specific client
        date: data.date || null,
        workshopId,
        lang: "ar",
      });

      onClose();
    } catch (err) {
      setApiError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (!show || !client) return null;

  return (
    <AlertModal
      show={show}
      title={`إرسال إشعار جديد للعميل: ${client.name}`}
      alertIcon="🔔"
      showCancel={false}
      showConfirm={false}
      showClose={true}
      onClose={onClose}
    >
      <div className="">
        {!!apiError && <p className="errorMessage">{apiError}</p>}

        <form
          className="mainForm row"
          onSubmit={handleSubmit(onSubmit)}
          dir="rtl"
        >

          <div className="formCol col-12 col-md-6">
            <div className="inputGroup">
              <label>
                نص الإشعار{" "}
                <span className="req">
                  <FaStar />
                </span>
              </label>

              <input
                placeholder="نص الإشعار"
                {...register("message", {
                  required: "يجب إدخال نص الإشعار",
                })}
                className={errors.message ? "inputError" : ""}
              />
              <p className="errorMessage">{errors.message?.message}</p>
            </div>
          </div>

          <div className="formCol col-12 col-md-6">
            {/* نوع الإشعار */}
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
          </div>

          {/* التاريخ بعرض الصف كامل */}
          <div className="formCol col-12">
            <div className="inputGroup">
              <label>التاريخ</label>
              <input type="date" {...register("date")} />
            </div>
          </div>

          <button
            type="submit"
            className="submitBtn"
            disabled={submitting}
            style={{ opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? "جاري الإرسال..." : "إرسال"}
          </button>
        </form>
      </div>
    </AlertModal>
  );
};

export default ClientNotificationModal;
