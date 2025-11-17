import React from "react";
import "./addEditAlertModal.css";
import { FaStar } from "react-icons/fa";

const AddEditAlertModal = ({
  show,
  title = "إضافة خدمة",
  alertIcon,
  placeholder = "قم بإدخال اسم الخدمة",
  cancelText = "إلغاء",
  confirmText = "إضافة",
  onCancel,
  onConfirm,
  showCancel = true,
  inputValue,
  setInputValue,
}) => {
  if (!show) return null;

  return (
    <div className="alertOverlay">
      <div className="alertCard addServiceModal" dir="rtl">
        <div className="alertBody">
          <label className="sectionTitle ">
            <div style={{ display: "flex", alignItems: "center" ,gap:"4px"}}>
             الخدمة{" "}
              <FaStar className="req"/>
            </div>   
          </label>

          <input
            type="text"
            className="modalInput"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          <div className="alertButtons">
            {showCancel && (
              <button className="alertBtn cancel" onClick={onCancel}>
                {cancelText}
              </button>
            )}
            <button className="alertBtn confirm" onClick={onConfirm}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditAlertModal;
