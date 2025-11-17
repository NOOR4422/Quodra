import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { LuLockKeyhole } from "react-icons/lu";
import tyre from "../../assets/tyre.png";
import "./changePassword.css";
import { useNavigate } from "react-router-dom";
import "../styles/loginStyles.css";

const ChangePassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const passwordValue = watch("password", "");

  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    alert("تم تغيير كلمة السر بنجاح!");
    navigate("/");
  };

  return (
    <div className="loginContainer" dir="rtl">
      <div className="loginCard">
        <div className="headerContainer">
          <img src={tyre} alt="tyre" className="tyre" />
        </div>
          <p className="headerText">استعادة كلمة السر</p>

        <div className="changePasswordContainer">
          <form className="formSection" onSubmit={handleSubmit(onSubmit)}>
            <div className="formSectionContainer">
              {" "}
              <div className="inputGroup">
                <label className="inputLabel">
                  كلمة السر الجديدة <span style={{ color: "#E53C3C" }}>*</span>
                </label>

                <div className="inputWrapper">
                  <input
                    id="password"
                    placeholder="كلمة السر الجديدة"
                    className="inputField"
                    type={showPassword ? "text" : "password"}
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
                    {showPassword ? (
                      <AiOutlineEye />
                    ) : (
                      <AiOutlineEyeInvisible />
                    )}
                  </span>
                </div>
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
                        value === watch("password") || "كلمة السر غير متطابقة",
                    })}
                  />

                  {errors.confirmPassword && (
                    <p className="errorMessage">
                      {errors.confirmPassword.message}
                    </p>
                  )}

                  <span className="inputIcon">
                    <LuLockKeyhole />
                  </span>

                  <span
                    className="passwordToggleIcon"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? (
                      <AiOutlineEye />
                    ) : (
                      <AiOutlineEyeInvisible />
                    )}
                  </span>
                </div>
              </div>
              <button type="submit" className="loginButton">
                تغيير كلمة السر
              </button>
            </div>
          </form>
        </div>
        <div className="formSection2 formSection ">
          <div className="formSectionContainer">
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
  );
};

export default ChangePassword;
