import React, { useEffect, useState, useRef } from "react";
import resetPassword from "../../../assets/reset-password.png";
import "./resetPasswordCode.css";

import { useNavigate } from "react-router-dom";

const ResetPasswordCode = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [counter, setCounter] = useState(40);
  const intervalRef = useRef(null);
  const inputsRef = useRef([]);

  useEffect(() => {
    startTimer();
    return () => clearInterval(intervalRef.current);
  }, []);

  const startTimer = () => {
    clearInterval(intervalRef.current);
    setCounter(40);

    intervalRef.current = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const navigate = useNavigate();

  const submitCode = (e) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length < 6) {
      alert("الرجاء إدخال رمز مكون من 6 أرقام");
      return;
    }

    alert("تم إرسال الرمز: " + code);
    navigate("/auth/reset/change");
  };

  const resendCode = () => {
    setOtp(["", "", "", "", "", ""]);
    inputsRef.current[0]?.focus();
    startTimer();
  };

  return (
    <div className="loginContainer container-fluid" dir="rtl">
      <div className="mainLoginCard row justify-content-center  m-0">
        <div className="loginCard col-11 col-sm-10 col-md-8 col-lg-5 p-0">
          <div className="headerContainer mt-3">
            <img src={resetPassword} alt="reset" className="tyre" />
          </div>

          <p className="headerText">استعادة كلمة السر</p>
          <p className="para">أدخل الرمز المرسل إلى هاتفك</p>

          <form className="formSection w-100" onSubmit={submitCode}>
            <div className="formSectionContainer mx-auto">
              <div className="otpContainer" dir="ltr">
                {otp.map((num, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    maxLength="1"
                    className="otpInput"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={num}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))}
              </div>

              <p className="timerText">
                {counter > 0
                  ? `يمكنك إعادة إرسال الرمز بعد ${counter} ثانية`
                  : "يمكنك الآن إعادة إرسال الرمز"}
              </p>

              <button type="submit" className="sendBtn">
                إرسال الرمز
              </button>

              <button
                type="button"
                className="resendBtn"
                disabled={counter > 0}
                onClick={resendCode}
              >
                إعادة إرسال الرمز
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordCode;
