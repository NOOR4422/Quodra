import React, { useState } from "react";
import resetPasswordImg from "../../../assets/reset-password.png";

import { IoPhonePortraitOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { sendOtp } from "../../../api/auth";

const ResetPassword = () => {
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

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
      await sendOtp({ phone: data.phoneNumber });

      navigate("/auth/reset/code", {
        state: {
          phone: data.phoneNumber,
        },
      });
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="loginContainer container-fluid" dir="rtl">
      <div className="mainLoginCard row justify-content-center m-0">
        <div className="loginCard col-11 col-sm-10 col-md-8 col-lg-5 p-0">
          <div className="headerContainer mt-3">
            <img src={resetPasswordImg} alt="reset password" className="tyre" />
          </div>

          <p className="headerText">استعادة كلمة السر</p>
          <p className="para">ادخل رقم هاتفك لإرسال رمز التحقق</p>

          {!!apiError && (
            <p className="errorMessage" style={{ padding: "0 18px" }}>
              {apiError}
            </p>
          )}

          <form className="formSection w-100" onSubmit={handleSubmit(onSubmit)}>
            <div className="formSectionContainer mx-auto">
              <div className="inputGroup">
                <label className="inputLabel" htmlFor="phoneNumber">
                  رقم الهاتف
                  <FaStar className="req" color="#E53C3C" />
                </label>
                <div className="inputWrapper">
                  <input
                    id="phoneNumber"
                    type="text"
                    placeholder="رقم الهاتف"
                    className="inputField"
                    {...register("phoneNumber", {
                      required: true,
                    })}
                  />
                  <span className="inputIcon">
                    <IoPhonePortraitOutline />
                  </span>
                </div>
                {errors.phoneNumber?.type === "required" && (
                  <p className="errorMessage"> رقم الهاتف مطلوب</p>
                )}
              </div>

              <button
                type="submit"
                className="loginButton"
                disabled={isSubmitting}
              >
                {isSubmitting ? "جارِ الإرسال..." : "إرسال الرمز"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
