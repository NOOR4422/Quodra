import React, { useState } from "react";
import "../ClientsList/clientsList.css";
import "./transferRequestsList.css";
import ClientsTopBar from "../ClientsTopBar/ClientsTopBar";
import AlertModal from "../../Modals/AlertModal/AlertModal";

const TransferRequests = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      customerName: "احمد محمد",
      phone: "01234566787",
      date: "27/10/2025",
      reason:
        "واجهت صعوبة في الوصول للفرع الحالي بسبب بعد المسافة وزحمة الطريق بشكل يومي.",
      status: "قيد المراجعة",
    },
    {
      id: 2,
      customerName: "احمد محمد",
      phone: "01234566787",
      date: "27/10/2025",
      reason:
        "أرغب في النقل إلى فرع أقرب لمقر العمل لتسهيل مواعيد الصيانة والمتابعة الدورية.",
      status: "قيد المراجعة",
    },
    {
      id: 3,
      customerName: "احمد محمد",
      phone: "01234566787",
      date: "27/10/2025",
      reason: "واجهت صعوبة في الوصول للفرع الحالي بسبب بعد المسافة.",
      status: "مقبول",
    },
    {
      id: 4,
      customerName: "احمد محمد",
      phone: "01234566787",
      date: "27/10/2025",
      reason:
        "أرغب في النقل إلى فرع أقرب لمقر العمل لتسهيل مواعيد الصيانة والمتابعة الدورية.",
      status: "مرفوض",

    },
    {
      id: 5,
      customerName: "احمد محمد",
      phone: "01234566787",
      date: "27/10/2025",
      reason: "واجهت صعوبة في الوصول للفرع الحالي بسبب بعد المسافة.",
      status: "قيد المراجعة",

    },
    {
      id: 6,
      customerName: "احمد محمد",
      phone: "01234566787",
      date: "27/10/2025",
      reason:
        "أرغب في النقل إلى فرع أقرب لمقر العمل لتسهيل مواعيد الصيانة والمتابعة الدورية.",
      status: "مرفوض",

    },
    {
      id: 7,
      customerName: "احمد محمد",
      phone: "01234566787",
      date: "27/10/2025",
      reason: "واجهت صعوبة في الوصول للفرع الحالي بسبب بعد المسافة.",
      status: "مقبول",
    },
    {
      id: 8,
      customerName: "احمد محمد",
      phone: "01234566787",
      date: "27/10/2025",
      reason:

        "أرغب في النقل إلى فرع أقرب لمقر العمل لتسهيل مواعيد الصيانة والمتابعة الدورية.",
      
      status: "قيد المراجعة",
    }
  ]);

  const REASON_LIMIT = 40;

  const [modal, setModal] = useState({
    type: null,
    request: null,
  });

  const [reasonModal, setReasonModal] = useState({
    show: false,
    text: "",
  });

  const [rejectNote, setRejectNote] = useState("");

  const getStatusCardClass = (status) => {
    if (status === "مقبول") return "transferCard-accepted";
    if (status === "مرفوض") return "transferCard-rejected";
    return "transferCard-pending";
  };

  const getStatusBadgeClass = (status) => {
    if (status === "مقبول") return "statusBadge statusBadge-accepted";
    if (status === "مرفوض") return "statusBadge statusBadge-rejected";
    return "statusBadge statusBadge-pending";
  };


  const openViewReason = (reasonText) => {
    setReasonModal({
      show: true,
      text: reasonText,
    });
  };

  const closeViewReason = () => {
    setReasonModal({
      show: false,
      text: "",
    });
  };

  const openAcceptConfirm = (req) => {
    setModal({ type: "acceptConfirm", request: req });
  };

  const openRejectConfirm = (req) => {
    setRejectNote("");
    setModal({ type: "rejectConfirm", request: req });
  };

  const closeModal = () => {
    setModal({ type: null, request: null });
  };


  const handleConfirmModal = () => {
    if (!modal.request) return;

    if (modal.type === "acceptConfirm") {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === modal.request.id ? { ...r, status: "مقبول" } : r
        )
      );
      setModal({ type: "acceptSuccess", request: modal.request });
      return;
    }

    if (modal.type === "rejectConfirm") {

      setRequests((prev) =>
        prev.map((r) =>
          r.id === modal.request.id ? { ...r, status: "مرفوض" } : r
        )
      );
      setModal({ type: "rejectSuccess", request: modal.request });
      return;
    }
  };

  const isConfirmType =
    modal.type === "acceptConfirm" || modal.type === "rejectConfirm";
  const isSuccessType =
    modal.type === "acceptSuccess" || modal.type === "rejectSuccess";

  return (
    <div className="mainContainer">
      <ClientsTopBar />

      <div className="transferListWrapper">
        {requests.map((req) => {
          const isLong = req.reason.length > REASON_LIMIT;
          const shortReason = isLong
            ? `${req.reason.slice(0, REASON_LIMIT)}...`
            : req.reason;

          const showActions = req.status === "قيد المراجعة";

          return (
            <div
              key={req.id}
              className={`transferCard ${getStatusCardClass(req.status)}`}
            >
              <div
                className={`transferBodyRow ${showActions ? "hasActions" : ""}`}
              >
                <div className="transferBodyCell">
                  <span className="cellKey">العميل</span>
                  <span className="cellValue">{req.customerName}</span>
                </div>

                <div className="transferBodyCell">
                  <span className="cellKey">رقم الهاتف</span>
                  <span className="cellValue">{req.phone}</span>
                </div>

                <div className="transferBodyCell">
                  <span className="cellKey">تاريخ الطلب</span>
                  <span className="cellValue">{req.date}</span>
                </div>

                <div className="transferBodyCell">
                  <span className="cellKey">السبب</span>
                  <span className="cellValue reasonText">
                    {shortReason}
                    {isLong && (
                      <button
                        type="button"
                        className="linkMore"
                        onClick={() => openViewReason(req.reason)}
                      >
                        المزيد
                      </button>
                    )}
                  </span>
                </div>

                <div className="transferBodyCell">
                  <span className="cellKey">حالة الطلب</span>
                  <span
                    className={`cellValue ${getStatusBadgeClass(req.status)}`}
                  >
                    {req.status}
                  </span>
                </div>

                {showActions && (
                  <div className="transferBodyCell">
                    <span className="cellKey">الإجراءات</span>
                    <span className="cellValue">
                      <button
                        className="btnTransferAccept"
                        type="button"
                        onClick={() => openAcceptConfirm(req)}
                      >
                        قبول
                      </button>
                      <button
                        className="btnTransferReject"
                        type="button"
                        onClick={() => openRejectConfirm(req)}
                      >
                        رفض
                      </button>
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {modal.type && (
        <AlertModal
          show={true}
          title={isConfirmType ? "تحذير" : isSuccessType ? "تم بنجاح" : ""}
          alertIcon={isConfirmType ? "⚠️" : isSuccessType ? "✅" : ""}
          message=""
          showMessage={false}
          cancelText={isConfirmType ? "لا" : ""}
          confirmText={isConfirmType ? "نعم" : "تم"}
          showCancel={isConfirmType}
          showConfirm={isConfirmType || isSuccessType}
          onCancel={closeModal}
          onConfirm={isConfirmType ? handleConfirmModal : closeModal}
        >
          {modal.type === "acceptConfirm" && (
            <p className="alertMessage">
              هل انت متأكد من قبول نقل هذا العميل ؟
            </p>
          )}

          {modal.type === "rejectConfirm" && (
            <>
              <p className="alertMessage">
                هل انت متأكد من رفض نقل هذا العميل ؟
              </p>
              <div className="alertFieldGroup">
                <label className="alertFieldLabel">سبب الرفض</label>
                <textarea
                  className="alertTextarea"
                  placeholder="اكتب سبب الرفض (اختياري لتحسين التواصل مع العميل)"
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                />
              </div>
            </>
          )}

          {modal.type === "acceptSuccess" && (
            <p className="alertMessage">
              سيتم نقل بيانات العميل إلى الورشة الجديدة.
            </p>
          )}

          {modal.type === "rejectSuccess" && (
            <p className="alertMessage">تم رفض طلب النقل وإخطار العميل.</p>
          )}
        </AlertModal>
      )}

      <AlertModal
        show={reasonModal.show}
        title=""
        alertIcon=""
        message={reasonModal.text}
        showMessage={true}
        cancelText="تم"
        confirmText=""
        showCancel={true}
        showConfirm={false}
        onCancel={closeViewReason}
        onConfirm={closeViewReason}
      />
    </div>
  );
};

export default TransferRequests;
