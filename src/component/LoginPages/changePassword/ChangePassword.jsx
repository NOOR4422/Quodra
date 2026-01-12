import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { LuLockKeyhole } from "react-icons/lu";
import { useNavigate, useLocation } from "react-router-dom";

import tyre from "../../../assets/tyre.png";
import "./changePassword.css";
import AlertModal from "../../Modals/AlertModal/AlertModal";

import { changePassword, resetPassword } from "../../../api/auth";

const ChangePassword = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isResetFlow = location.pathname.includes("/auth/reset/change");
  const mode = isResetFlow ? "reset" : "change";

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const passwordValue = watch("password", "");

  const handleApiError = (err) => {
    console.error(err);

    const msgFromArray = Array.isArray(err?.response?.data)
      ? err.response.data[0]
      : null;

    const msg =
      msgFromArray ||
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      "حدث خطأ ما";

    setApiError(msg);
  };

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setApiError("");

    try {
      if (mode === "change") {
        await changePassword({
          currentPassword: data.currentPassword,
          newPassword: data.password,
          confirmNewPassword: data.confirmPassword,
        });
      } else {
        const { phone, code } = location.state || {};
        await resetPassword({
          phone,
          code,
          newPassword: data.password,
          confirmNewPassword: data.confirmPassword,
        });
      }

      setShowAlert(true);
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="loginContainer container-fluid" dir="rtl">
      <AlertModal
        show={showAlert}
        title="تم بنجاح"
        alertIcon=" ✅"
        message="تم تغيير كلمة السر بنجاح."
        showCancel={false}
        confirmText="تم"
        onCancel={() => setShowAlert(false)}
        onConfirm={() => {
          setShowAlert(false);
          if (mode === "reset") {
            navigate("/auth/login");
          } else {
            navigate("/");
          }
        }}
      />

      <div className="mainLoginCard row justify-content-center m-0">
        <div className="loginCard col-11 col-sm-10 col-md-8 col-lg-5 p-0">
          <div className="headerContainer mt-3">
            <img src={tyre} alt="tyre" className="tyre" />
          </div>

          <p className="headerText">
            {mode === "change" ? "تغيير كلمة السر" : "استعادة كلمة السر"}
          </p>

          {!!apiError && (
            <p className="errorMessage" style={{ padding: "0 18px" }}>
              {apiError}
            </p>
          )}

          <div className="changePasswordContainer">
            <form
              className="formSection w-100"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="formSectionContainer mx-auto">
                {mode === "change" && (
                  <div className="inputGroup">
                    <label className="inputLabel">
                      كلمة السر الحالية{" "}
                      <span style={{ color: "#E53C3C" }}>*</span>
                    </label>
                    <div className="inputWrapper">
                      <input
                        id="currentPassword"
                        placeholder="كلمة السر الحالية"
                        className="inputField"
                        type={showCurrentPassword ? "text" : "password"}
                        {...register("currentPassword", {
                          required: "كلمة السر الحالية مطلوبة",
                        })}
                      />
                      <span className="inputIcon">
                        <LuLockKeyhole />
                      </span>

                      <span
                        className="passwordToggleIcon"
                        onClick={() => setShowCurrentPassword((prev) => !prev)}
                      >
                        {showCurrentPassword ? (
                          <AiOutlineEye />
                        ) : (
                          <AiOutlineEyeInvisible />
                        )}
                      </span>
                    </div>
                    {errors.currentPassword && (
                      <p className="errorMessage">
                        {errors.currentPassword.message}
                      </p>
                    )}
                  </div>
                )}

                <div className="inputGroup">
                  <label className="inputLabel">
                    كلمة السر الجديدة{" "}
                    <span style={{ color: "#E53C3C" }}>*</span>
                  </label>
                  <div className="inputWrapper">
                    <input
                      id="password"
                      placeholder="كلمة السر الجديدة"
                      className="inputField"
                      type={showNewPassword ? "text" : "password"}
                      {...register("password", {
                        required: "كلمة السر مطلوبة",
                        minLength: {
                          value: 8,
                          message: "كلمة السر قصيرة جدًا",
                        },
                        validate: {
                          hasUpper: (value) =>
                            /[A-Z]/.test(value) ||
                            "يجب إضافة حرف كبير واحد على الأقل",
                          hasNumber: (value) =>
                            /\d/.test(value) || "يجب إضافة رقم واحد على الأقل",
                          hasSymbol: (value) =>
                            /[^A-Za-z0-9]/.test(value) ||
                            "يجب إضافة رمز واحد على الأقل",
                        },
                      })}
                    />

                    <span className="inputIcon">
                      <LuLockKeyhole />
                    </span>

                    <span
                      className="passwordToggleIcon"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                    >
                      {showNewPassword ? (
                        <AiOutlineEye />
                      ) : (
                        <AiOutlineEyeInvisible />
                      )}
                    </span>
                  </div>
                  {errors.password && (
                    <p className="errorMessage">{errors.password.message}</p>
                  )}
                </div>

                <div className="inputGroup">
                  <label className="inputLabel">
                    تأكيد كلمة السر <span style={{ color: "#E53C3C" }}>*</span>
                  </label>
                  <div className="inputWrapper">
                    <input
                      id="confirmPassword"
                      placeholder="تأكيد كلمة السر"
                      className="inputField"
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword", {
                        required: "تأكيد كلمة السر مطلوب",
                        validate: (value) =>
                          value === watch("password") ||
                          "كلمة السر غير متطابقة",
                      })}
                    />

                    <span className="inputIcon">
                      <LuLockKeyhole />
                    </span>

                    <span
                      className="passwordToggleIcon"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? (
                        <AiOutlineEye />
                      ) : (
                        <AiOutlineEyeInvisible />
                      )}
                    </span>
                  </div>
                  {errors.confirmPassword && (
                    <p className="errorMessage">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="loginButton"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "جارِ الحفظ..." : "تغيير كلمة السر"}
                </button>
              </div>
            </form>
          </div>

          <div className="formSection2 formSection w-100">
            <div className="formSectionContainer mx-auto">
              <p className="rulesHeader">قواعد كلمة السر</p>

              <div className="checkbox">
                <input
                  type="checkbox"
                  checked={passwordValue.length >= 8}
                  readOnly
                />
                <span className="para">على الأقل 8 أحرف</span>
              </div>

              <div className="checkbox">
                <input
                  type="checkbox"
                  checked={/[A-Z]/.test(passwordValue)}
                  readOnly
                />
                <span className="inputLabel">حرف كبير واحد على الأقل</span>
              </div>

              <div className="checkbox">
                <input
                  type="checkbox"
                  checked={/[^A-Za-z0-9]/.test(passwordValue)}
                  readOnly
                />
                <span className="inputLabel">رمز مميز واحد على الأقل</span>
              </div>

              <div className="checkbox">
                <input
                  type="checkbox"
                  checked={/\d/.test(passwordValue)}
                  readOnly
                />
                <span className="inputLabel">رقم واحد على الأقل</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
