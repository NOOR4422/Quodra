import React, { useState } from "react";
import tyre from "../../assets/tyre.png";
import "../styles/loginStyles.css";

import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { LuKeySquare, LuLockKeyhole } from "react-icons/lu";
import { FaStar } from "react-icons/fa";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    try {
      console.log("Form Data:", data);

      await new Promise((resolve) => setTimeout(resolve, 800));

      alert("تم تسجيل الدخول بنجاح!");
      navigate("/");
    } catch (error) {
      console.error("Login Error:", error);
      alert("حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigateToResetPassword = () => navigate("/resetPassword");

  return (
    <div className="loginContainer" dir="rtl">
      <div className="loginCard">
      <div className="headerContainer">
        <img src={tyre} alt="tyre" className="tyre" />
        
      </div>
<p className="headerText">مرحبًا بك في قُدرة</p>
        <p className="para">سجل الدخول لإدارة ورشتك</p>
      <form className="formSection " onSubmit={handleSubmit(onSubmit)}>
                  <div className="formSectionContainer">

          <div className="inputGroup">
            <label className="inputLabel" htmlFor="phoneNumber">
              رقم الهاتف <FaStar className="req" />
            </label>

            <div className="inputWrapper">
              <input
                id="phoneNumber"
                type="text"
                placeholder="رقم الهاتف"
                className="inputField"
                {...register("phoneNumber", {
                  required: "رقم الهاتف مطلوب",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "رقم الهاتف يجب أن يكون 10 أرقام",
                  },
                })}
              />

              {errors.phoneNumber && (
                <p className="errorMessage">{errors.phoneNumber.message}</p>
              )}

              <span className="inputIcon">
                <IoPhonePortraitOutline />
              </span>
            </div>
          </div>

          <div className="inputGroup">
            <label className="inputLabel" htmlFor="workshopCode">
              كود الورشة <FaStar className="req" />
            </label>

            <div className="inputWrapper">
              <input
                id="workshopCode"
                type="text"
                placeholder="كود الورشة"
                className="inputField"
                {...register("workshopCode", {
                  required: "كود الورشة مطلوب",
                  pattern: {
                    value: /^[A-Za-z0-9]{6}$/,
                    message: "كود الورشة يجب أن يكون من 6 حروف أو أرقام",
                  },
                })}
              />

              {errors.workshopCode && (
                <p className="errorMessage">{errors.workshopCode.message}</p>
              )}

              <span className="inputIcon">
                <LuKeySquare />
              </span>
            </div>
          </div>

          <div className="inputGroup">
            <label className="inputLabel" htmlFor="password">
              كلمة السر <FaStar className="req" />
            </label>

            <div className="inputWrapper">
              <input
                id="password"
                placeholder="كلمة السر"
                className="inputField"
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "كلمة السر مطلوبة",
                  minLength: {
                    value: 8,
                    message: "كلمة السر يجب أن تكون 8 أحرف على الأقل",
                  },
                  validate: {
                    upper: (v) =>
                      /[A-Z]/.test(v) || "يجب إضافة حرف كبير واحد على الأقل",
                    number: (v) =>
                      /\d/.test(v) || "يجب إضافة رقم واحد على الأقل",
                    symbol: (v) =>
                      /[^A-Za-z0-9]/.test(v) || "يجب إضافة رمز واحد على الأقل",
                  },
                })}
              />

              {errors.password && (
                <p className="errorMessage">{errors.password.message}</p>
              )}

              <span className="inputIcon">
                <LuLockKeyhole />
              </span>

              <span
                className="passwordToggleIcon"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </span>
            </div>
          </div>

          <p className="forgetPassword" onClick={navigateToResetPassword}>
            هل نسيت كلمة السر؟
          </p>

          <button type="submit" className="loginButton" disabled={isSubmitting}>
            {isSubmitting ? "جاري التحقق..." : "تسجيل الدخول"}
            </button>
            </div>
      </form>
    </div> 
  </div>
  );
};

export default Login;
