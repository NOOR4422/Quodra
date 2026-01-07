import { FaStar } from "react-icons/fa";
import { useForm } from "react-hook-form";
import "./OfferMessage.css";

const OfferMessage = ({
  show,
  cancelText = "إلغاء",
  confirmText = "إرسال",
  onCancel,
  onConfirm,
  showCancel = true,
  showConfirm = true,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "onTouched" });

  if (!show) return null;

  const onSubmit = (data) => {
    if (onConfirm) onConfirm(data.offer);
    reset();
  };

  return (
    <div className="alertOverlay">
      <div className="alertCard offerMessageCard">
        <form className="mainForm2" onSubmit={handleSubmit(onSubmit)}>
          <div className="fieldGroupAlertMessage">
            <label>
              رسالة العرض <FaStar className="req" />
            </label>

            <input
              type="text"
              placeholder="رسالة العرض"
              {...register("offer", {
                required: "هذا الحقل مطلوب",
              })}
              className={errors.offer ? "inputError" : ""}
            />

            {errors.offer && (
              <p className="errorMessage">{errors.offer.message}</p>
            )}
          </div>

          <div className="alertButtons">
            {showConfirm && (
              <button type="submit" className="alertBtn confirm">
                {confirmText}
              </button>
            )}

            {showCancel && (
              <button
                type="button"
                className="alertBtn cancel"
                onClick={() => {
                  reset();
                  onCancel && onCancel();
                }}
              >
                {cancelText}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default OfferMessage;
