import React from "react";
import "./alertModal.css";

const AlertModal = ({
  show,
  title,
  alertIcon,
  message,
  children,
  showMessage = true,
  cancelText,
  confirmText,
  onCancel,
  onConfirm,
  showCancel = true,
  showConfirm = true,
  showClose = false,
  onClose,
}) => {
  if (!show) return null;

  const handleClose = () => {
    if (onClose) return onClose();
    if (onCancel) return onCancel();
  };

  return (
    <div className="alertOverlay">
      <div className="alertCard" dir="rtl">
        {showClose && (
          <button type="button" className="alertCloseBtn" onClick={handleClose}>
            ×
          </button>
        )}

        <div className="alertHeader">
          {title && <h2 className="alertTitle">{title}</h2>}
          {alertIcon && <div className="alertIcon">{alertIcon}</div>}
        </div>

        <div className="alertBody">
          {children
            ? children
            : showMessage && <p className="alertMessage">{message}</p>}
        </div>

        {(showCancel || showConfirm) && (
          <div className="alertButtons">
            {showConfirm && (
              <button className="alertBtn confirm" onClick={onConfirm}>
                {confirmText}
              </button>
            )}

            {showCancel && (
              <button className="alertBtn cancel" onClick={onCancel}>
                {cancelText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertModal;
