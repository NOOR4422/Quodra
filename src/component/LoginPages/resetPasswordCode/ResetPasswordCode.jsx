import React, { useEffect, useState, useRef } from "react";
import resetPasswordImg from "../../../assets/reset-password.png";
import "./resetPasswordCode.css";

import { useNavigate, useLocation } from "react-router-dom";
import { verifyOtp, sendOtp } from "../../../api/auth";

const ResetPasswordCode = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [counter, setCounter] = useState(40);
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const intervalRef = useRef(null);
  const inputsRef = useRef([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { phone } = location.state || {};

  useEffect(() => {
    if (!phone) {
      navigate("/auth/reset");
      return;
    }

    startTimer();
    return () => clearInterval(intervalRef.current);
  }, [phone]);

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

  const submitCode = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const code = otp.join("");

    if (code.length < 6) {
      setApiError("الرجاء إدخال رمز مكون من 6 أرقام");
      return;
    }

    setIsSubmitting(true);
    setApiError("");

    try {
      await verifyOtp({ phone, otp: code });

      navigate("/auth/reset/change", {
        state: {
          phone,
        },
      });
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendCode = async () => {
    if (!phone || counter > 0) return;

    setApiError("");

    try {
      await sendOtp({ phone });
      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
      startTimer();
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <div className="loginContainer container-fluid" dir="rtl">
      <div className="mainLoginCard row justify-content-center  m-0">
        <div className="loginCard col-11 col-sm-10 col-md-8 col-lg-5 p-0">
          <div className="headerContainer mt-3">
            <img src={resetPasswordImg} alt="reset" className="tyre" />
          </div>

          <p className="headerText">استعادة كلمة السر</p>
          <p className="para">أدخل الرمز المرسل إلى هاتفك</p>

          {!!apiError && (
            <p className="errorMessage" style={{ padding: "0 18px" }}>
              {apiError}
            </p>
          )}

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

              <button type="submit" className="sendBtn" disabled={isSubmitting}>
                {isSubmitting ? "جارِ التحقق..." : "إرسال الرمز"}
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
