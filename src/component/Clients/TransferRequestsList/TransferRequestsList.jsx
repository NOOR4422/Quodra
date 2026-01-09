import React, { useCallback, useEffect, useMemo, useState } from "react";
import "../ClientsList/clientsList.css";
import "./transferRequestsList.css";
import ClientsTopBar from "../ClientsTopBar/ClientsTopBar";
import AlertModal from "../../Modals/AlertModal/AlertModal";
import { transferRequestsApi } from "../../../api/clients";

const onlyDate = (iso) => (iso ? String(iso).slice(0, 10) : "");

const TransferRequests = () => {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [requests, setRequests] = useState([]);

  const REASON_LIMIT = 40;

  const [modal, setModal] = useState({ type: null, request: null });

  const [reasonModal, setReasonModal] = useState({ show: false, text: "" });

  const [rejectNote, setRejectNote] = useState("");

  const mapStatusFromState = (state) => {
    if (state === 1) return "قيد المراجعة";
    if (state === 2) return "مقبول";
    if (state === 3) return "مرفوض";

    if (state === true) return "مقبول";
    if (state === false) return "مرفوض";

    return "قيد المراجعة";
  };

  const normalizeRequest = (x) => {
    return {
      id: x?.id ?? x?.requestId ?? x?.RequestId ?? "",
      customerName: x?.userName ?? x?.customerName ?? "-",
      phone: x?.phoneNumber ?? x?.phone ?? "-",
      date: x?.date ?? "",
      reason: x?.resion ?? x?.reason ?? "",
      status: mapStatusFromState(x?.state),
      raw: x,
    };
  };

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
    setReasonModal({ show: true, text: reasonText || "-" });
  };

  const closeViewReason = () => {
    setReasonModal({ show: false, text: "" });
  };

  const openAcceptConfirm = (req) => {
    setModal({ type: "acceptConfirm", request: req });
  };

  const openRejectConfirm = (req) => {
    setRejectNote("");
    setModal({ type: "rejectConfirm", request: req });
  };

  const closeModal = () => {
    if (actionLoading) return;
    setModal({ type: null, request: null });
  };

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const list = await transferRequestsApi.getAll({ lang: "ar" });
      const normalized = (list || []).map(normalizeRequest);

      setRequests(normalized);
    } catch (err) {
      setError(transferRequestsApi.getErrorMessage(err));
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let alive = true;

    (async () => {
      if (!alive) return;
      await load();
    })();

    return () => {
      alive = false;
    };
  }, [load]);

  const handleConfirmModal = async () => {
    if (!modal.request?.id) return;

    try {
      setActionLoading(true);
      setError("");

      const RequestId = modal.request.id;

      if (modal.type === "acceptConfirm") {
        const res = await transferRequestsApi.accept({ RequestId, lang: "ar" });

        const ok = res?.success ?? res?.data?.success;
        if (!ok) {
          throw new Error(
            res?.message || res?.data?.message || "فشل قبول الطلب"
          );
        }

        await load();

        setModal({ type: "acceptSuccess", request: modal.request });
        return;
      }

      if (modal.type === "rejectConfirm") {
        const res = await transferRequestsApi.reject({ RequestId, lang: "ar" });

        const ok = res?.success ?? res?.data?.success;
        if (!ok) {
          throw new Error(
            res?.message || res?.data?.message || "فشل رفض الطلب"
          );
        }

        await load();

        setModal({ type: "rejectSuccess", request: modal.request });
        return;
      }
    } catch (err) {
      setError(transferRequestsApi.getErrorMessage(err));
      setModal({ type: null, request: null });
    } finally {
      setActionLoading(false);
    }
  };

  const isConfirmType =
    modal.type === "acceptConfirm" || modal.type === "rejectConfirm";
  const isSuccessType =
    modal.type === "acceptSuccess" || modal.type === "rejectSuccess";

  const content = useMemo(() => {
    if (loading) return null;
    if (error) return null;
    if (!requests.length) return null;

    return (
      <div className="transferListWrapper">
        {requests.map((req) => {
          const isLong = (req.reason || "").length > REASON_LIMIT;
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
                  <span className="cellValue">{onlyDate(req.date)}</span>
                </div>

                <div className="transferBodyCell">
                  <span className="cellKey">السبب</span>
                  <span className="cellValue reasonText">
                    {shortReason || "-"}
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
                        disabled={actionLoading}
                        onClick={() => openAcceptConfirm(req)}
                      >
                        قبول
                      </button>

                      <button
                        className="btnTransferReject"
                        type="button"
                        disabled={actionLoading}
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
    );
  }, [loading, error, requests, actionLoading]);

  return (
    <div className="mainContainer">
      <ClientsTopBar />

      {loading && <p style={{ padding: 12 }}>جاري تحميل الطلبات...</p>}

      {!!error && (
        <div style={{ padding: 12 }}>
          <p style={{ color: "crimson" }}>{error}</p>
          <button className="addBtn" onClick={load} disabled={loading}>
            إعادة المحاولة
          </button>
        </div>
      )}

      {!loading && !error && requests.length === 0 && (
        <p style={{ padding: 12 }}>لا توجد طلبات نقل.</p>
      )}

      {content}

      {modal.type && (
        <AlertModal
          show={true}
          title={isConfirmType ? "تحذير" : isSuccessType ? "تم بنجاح" : ""}
          alertIcon={isConfirmType ? "⚠️" : isSuccessType ? "✅" : ""}
          message=""
          showMessage={false}
          cancelText={isConfirmType ? "لا" : ""}
          confirmText={isConfirmType ? (actionLoading ? "..." : "نعم") : "تم"}
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
                  placeholder="اكتب سبب الرفض (اختياري)"
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                />
              </div>
            </>
          )}

          {modal.type === "acceptSuccess" && (
            <p className="alertMessage">تم قبول الطلب.</p>
          )}

          {modal.type === "rejectSuccess" && (
            <p className="alertMessage">تم رفض الطلب.</p>
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
