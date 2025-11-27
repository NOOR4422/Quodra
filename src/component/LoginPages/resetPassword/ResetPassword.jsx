import React from "react";
import resetPassword from "../../../assets/reset-password.png";

import { IoPhonePortraitOutline } from "react-icons/io5";
import { LuKeySquare } from "react-icons/lu";
import { FaStar } from "react-icons/fa";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";


const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    alert("تم إرسال رمز التحقق بنجاح!");
    navigate("/auth/reset/code");
  };

  return (
    <div className="loginContainer container-fluid" dir="rtl">
      <div className="mainLoginCard row justify-content-center m-0">
        <div className="loginCard col-11 col-sm-10 col-md-8 col-lg-5 p-0">
          <div className="headerContainer mt-3">
            <img src={resetPassword} alt="reset password" className="tyre" />
          </div>

          <p className="headerText">استعادة كلمة السر</p>
          <p className="para">ادخل البيانات لإرسال رمز التحقق</p>

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
                      pattern: /^[0-9]{10}$/,
                    })}
                  />

                  <span className="inputIcon">
                    <IoPhonePortraitOutline />
                  </span>
                </div>{" "}
                {errors.phoneNumber?.type === "required" && (
                  <p className="errorMessage"> رقم الهاتف مطلوب</p>
                )}
                {errors.phoneNumber?.type === "pattern" && (
                  <p className="errorMessage">
                    رقم الهاتف يجب أن يكون 10 أرقام
                  </p>
                )}
              </div>

              <div className="inputGroup">
                <label className="inputLabel" htmlFor="workshopCode">
                  كود الورشة
                  <FaStar className="req" color="#E53C3C" />
                </label>
                <div className="inputWrapper">
                  <input
                    id="workshopCode"
                    type="text"
                    placeholder="كود الورشة"
                    className="inputField"
                    {...register("workshopCode", {
                      required: true,
                      pattern: /^[A-Za-z0-9]{6}$/,
                    })}
                  />

                  <span className="inputIcon">
                    <LuKeySquare />
                  </span>
                </div>{" "}
                {errors.workshopCode?.type === "required" && (
                  <p className="errorMessage">كود الورشة مطلوب</p>
                )}
                {errors.workshopCode?.type === "pattern" && (
                  <p className="errorMessage">
                    كود الورشة يجب أن يكون من 6 حروف أو أرقام
                  </p>
                )}
              </div>

              <button type="submit" className="loginButton">
                إرسال الرمز
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
