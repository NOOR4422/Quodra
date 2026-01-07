import React, { useState } from "react";
import tyre from "../../../assets/tyre.png";
import "./login.css";

import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { LuKeySquare, LuLockKeyhole } from "react-icons/lu";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { loginWorkshop } from "../../../api/auth";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setApiError("");

    try {
      await loginWorkshop({
        phone: data.phoneNumber,
        code: data.workshopCode,
        password: data.password,
      });

      navigate("/");
    } catch (e) {
      setApiError("البيانات غير صحيحة");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="loginContainer container-fluid" dir="rtl">
      <div className="mainLoginCard row justify-content-center m-0">
        <div className="loginCard col-11 col-sm-10 col-md-8 col-lg-5 p-0">
          <div className="headerContainer mt-3">
            <img src={tyre} alt="tyre" className="tyre" />
          </div>

          <p className="headerText">مرحبًا بك في قُدرة</p>
          <p className="para">سجل الدخول لإدارة ورشتك</p>

          {!!apiError && (
            <p className="errorMessage" style={{ padding: "0 18px" }}>
              {apiError}
            </p>
          )}

          <form className="formSection w-100" onSubmit={handleSubmit(onSubmit)}>
            <div className="formSectionContainer mx-auto">
              <div className="inputGroup">
                <label className="inputLabel">رقم الهاتف</label>

                <div className="inputWrapper">
                  <input
                    type="text"
                    placeholder="رقم الهاتف"
                    className="inputField"
                    {...register("phoneNumber", {
                      required: "هذا الحقل مطلوب",
                    })}
                  />
                  <span className="inputIcon">
                    <IoPhonePortraitOutline />
                  </span>
                </div>

                {errors.phoneNumber && (
                  <p className="errorMessage">{errors.phoneNumber.message}</p>
                )}
              </div>

              <div className="inputGroup">
                <label className="inputLabel">كود الورشة</label>

                <div className="inputWrapper">
                  <input
                    type="text"
                    placeholder="كود الورشة"
                    className="inputField"
                    {...register("workshopCode", {
                      required: "هذا الحقل مطلوب",
                    })}
                  />
                  <span className="inputIcon">
                    <LuKeySquare />
                  </span>
                </div>

                {errors.workshopCode && (
                  <p className="errorMessage">{errors.workshopCode.message}</p>
                )}
              </div>

              <div className="inputGroup">
                <label className="inputLabel">كلمة السر</label>

                <div className="inputWrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="كلمة السر"
                    className="inputField"
                    {...register("password", {
                      required: "هذا الحقل مطلوب",
                    })}
                  />

                  <span className="inputIcon">
                    <LuLockKeyhole />
                  </span>

                  <span
                    className="passwordToggleIcon"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
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

              <button
                type="submit"
                className="loginButton"
                disabled={isSubmitting}
              >
                {isSubmitting ? "جاري التحقق..." : "تسجيل الدخول"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
