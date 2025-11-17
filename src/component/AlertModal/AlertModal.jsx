import React from "react";
// import "./alertModal.css";

const AlertModal = ({
  show,
  title,
  alertIcon,
  message,
  showMessage=true,
  cancelText ,
  confirmText ,
  onCancel,
  onConfirm,
  showCancel = true, 
  showConfirm=true
}) => {
  if (!show) return null;

  return (
    <div className="alertOverlay">
      <div className="alertCard">
        <div className="alertHeader">
          <h2 className="alertTitle">{title}</h2>
          <div className="alertIcon">{alertIcon}</div>
        </div>
        {showMessage && (
          <p className="alertMessage">{message}</p>
        
)}

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
      </div>
    </div>
  );
};

export default AlertModal;
