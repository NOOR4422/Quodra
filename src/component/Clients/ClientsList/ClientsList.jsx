import React, { useEffect, useMemo, useState, useCallback } from "react";
import "./clientsList.css";
import { LuTrash2, LuPencil } from "react-icons/lu";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import AlertModal from "../../Modals/AlertModal/AlertModal";
import box from "../../../assets/box.png";
import user from "../../../assets/user.png";
import ClientsTopBar from "../ClientsTopBar/ClientsTopBar";

import { getAllUsers, deleteUser } from "../../../api/clients";
import { getSessionsForWorkshop, sessionApi } from "../../../api/sessions";

const PAGE_SIZE = 10;

function getPages(current, total) {
  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current, current - 1, current + 1]);
  const arr = [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    out.push(arr[i]);
    if (i < arr.length - 1 && arr[i + 1] - arr[i] > 1) out.push("...");
  }
  return out;
}

function getSessionUserId(x) {
  return (
    x?.customerId ??
    x?.CustomerId ??
    x?.userId ??
    x?.UserId ??
    x?.clientId ??
    x?.ClientId ??
    x?.user?.id ??
    x?.customer?.id ??
    null
  );
}

const ClientsList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [usersError, setUsersError] = useState("");
  const [sessionsError, setSessionsError] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);

  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(false);

  const lang = "ar";
  const workshopId = localStorage.getItem("workshopId");

  const loadClients = useCallback(async () => {
    try {
      setLoading(true);
      setUsersError("");
      setSessionsError("");

      const [usersRes, sessionsRes] = await Promise.allSettled([
        getAllUsers(),
        workshopId
          ? getSessionsForWorkshop({ workshopId, lang })
          : Promise.resolve([]),
      ]);

      if (usersRes.status !== "fulfilled") {
        setUsersError(
          usersRes.reason?.response?.data?.message ||
            usersRes.reason?.message ||
            "فشل تحميل العملاء"
        );
        setClients([]);
        setPage(1);
        return;
      }

      const usersRaw = usersRes.value;
      const users = Array.isArray(usersRaw)
        ? usersRaw
        : usersRaw?.message || usersRaw?.data || [];

      let sessionsList = [];
      if (!workshopId) {
        sessionsList = [];
        setSessionsError("لا يمكن تحميل الزيارات بدون workshopId");
      } else if (sessionsRes.status === "fulfilled") {
        const s = sessionsRes.value;
        sessionsList = Array.isArray(s) ? s : s?.message || s?.data || [];
      } else {
        sessionsList = [];
        setSessionsError(sessionApi.getErrorMessage(sessionsRes.reason));
      }

      const visitsCountMap = new Map();
      let sessionsHaveUserId = false;

      for (const x of sessionsList) {
        const uid = getSessionUserId(x);
        if (!uid) continue;
        sessionsHaveUserId = true;

        const key = String(uid);
        visitsCountMap.set(key, (visitsCountMap.get(key) || 0) + 1);
      }

      if (workshopId && sessionsList.length && !sessionsHaveUserId) {
        setSessionsError(
          "الـ Sessions لا تحتوي على customerId/userId، لذلك لا يمكن حساب عدد الزيارات. لازم الـ backend يرجّع customerId داخل GetSessionsForWorkshop."
        );
      }

      const mapped = (users || []).map((u) => {
        const userId = u.id ?? u.userId ?? u._id;
        const key = String(userId);

        return {
          id: userId,
          name: u.name ?? "بدون اسم",
          phone: u.phone ?? u.phoneNumber ?? "-",
          whatsapp: u.whats ?? u.whatsapp ?? "-",
          visits: visitsCountMap.get(key) || 0,
        };
      });

      setClients(mapped);
      setPage(1);

  
      if (sessionsList.length) {
        console.log("Sample session keys:", sessionsList[0]);
        console.log(
          "Sample session userId extracted:",
          getSessionUserId(sessionsList[0])
        );
      }
    } catch (err) {
      setUsersError(
        err?.response?.data?.message || err?.message || "Network Error"
      );
      setClients([]);
      setPage(1);
    } finally {
      setLoading(false);
    }
  }, [workshopId]);

  useEffect(() => {
    loadClients();
  }, [loadClients, location.state?.refresh]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(clients.length / PAGE_SIZE)),
    [clients.length]
  );

  const pagedClients = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return clients.slice(start, start + PAGE_SIZE);
  }, [clients, page]);

  const isEmpty = !loading && !usersError && clients.length === 0;

  const goToPage = (p) => {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openDeleteModal = (id) => {
    setSelectedClientId(id);
    setShowAlert(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedClientId || deleting) return;

    setDeleting(true);
    setUsersError("");

    try {
      const res = await deleteUser(selectedClientId, "ar");

      if (!res?.success) {
        setUsersError(res?.message || "فشل حذف العميل");
        return;
      }

      setClients((prev) => {
        const next = prev.filter((c) => c.id !== selectedClientId);
        const nextTotalPages = Math.max(1, Math.ceil(next.length / PAGE_SIZE));
        setPage((p) => Math.min(p, nextTotalPages));
        return next;
      });

      setShowAlert(false);
      setSelectedClientId(null);
    } catch (err) {
      setUsersError(
        err?.response?.data?.message || err?.message || "Delete failed"
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mainContainer">
      <AlertModal
        show={showAlert}
        title="تحذير"
        alertIcon="⚠️"
        message={
          deleting ? "جاري حذف العميل..." : "هل انت متأكد من حذف هذا العميل ؟"
        }
        cancelText="إلغاء"
        confirmText={deleting ? "جاري الحذف..." : "حذف"}
        onCancel={() => {
          if (deleting) return;
          setShowAlert(false);
          setSelectedClientId(null);
        }}
        onConfirm={handleDeleteConfirm}
      />

      <ClientsTopBar />

      {loading && <p style={{ padding: 12 }}>جاري تحميل العملاء...</p>}

      {!!usersError && (
        <div style={{ padding: 12 }}>
          <p style={{ color: "red" }}>{usersError}</p>
          <button className="addBtn" onClick={loadClients}>
            إعادة المحاولة
          </button>
        </div>
      )}

      {!usersError && !!sessionsError && (
        <div style={{ padding: 12 }}>
          <p style={{ color: "crimson" }}>{sessionsError}</p>
        </div>
      )}

      {isEmpty ? (
        <div className="emptyState">
          <img src={box} alt="no data" className="emptyIcon" />
          <p className="emptyText">لا يوجد عملاء مسجلين حالياً.</p>
          <button
            className="addBtn"
            style={{ backgroundColor: "#DD2912", color: "white" }}
            onClick={() => navigate("/clients/add")}
          >
            إضافة عميل
          </button>
        </div>
      ) : (
        !loading &&
        !usersError && (
          <>
            {pagedClients.map((client) => (
              <div className="mainCard" key={client.id}>
                <div>
                  <img src={user} className="cardImg" alt={client.name} />
                </div>

                <div className="cardCol">
                  <div className="cardRow">
                    <div>
                      <p className="cardTitle">{client.name}</p>
                    </div>

                    <div className="btnRow">
                      <button
                        className="btnNotify"
                        onClick={() => navigate("/notifications/add")}
                      >
                        إرسال إشعار
                      </button>
                      <button
                        className="btnVisit"
                        onClick={() =>
                          navigate("/visits/add", {
                            state: { clientId: client.id },
                          })
                        }
                      >
                        زيارة جديدة
                      </button>
                    </div>
                  </div>

                  <div className="cardRow">
                    <div className="cardDetails">
                      <div className="cardBlock">
                        <span className="copyIcon">
                          <MdOutlinePhoneAndroid />
                        </span>
                        <p className="subText">{client.phone}</p>
                      </div>

                      <div className="cardBlock subText">
                        {client.visits} زيارات
                      </div>

                      <div
                        className="cardBlock moreDetails"
                        onClick={() => navigate(`/clients/${client.id}`)}
                      >
                        تفاصيل أكثر
                      </div>
                    </div>

                    <div className="btnRow">
                      <span
                        className="editRow"
                        onClick={() => navigate(`/clients/${client.id}/edit`)}
                      >
                        <LuPencil className="actionIcon" /> تعديل البيانات
                      </span>

                      <span
                        className="deleteRow"
                        onClick={() => openDeleteModal(client.id)}
                      >
                        <LuTrash2 className="actionIcon" /> حذف العميل
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {totalPages > 1 && (
              <div className="pager">
                <button
                  className="pagerArrow"
                  disabled={page === 1}
                  onClick={() => goToPage(page - 1)}
                >
                  ‹
                </button>

                <div className="pagerNums">
                  {getPages(page, totalPages).map((p, idx) =>
                    p === "..." ? (
                      <span key={`dots-${idx}`} className="pagerDots">
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        className={`pagerNum ${page === p ? "active" : ""}`}
                        onClick={() => goToPage(p)}
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>

                <button
                  className="pagerArrow"
                  disabled={page === totalPages}
                  onClick={() => goToPage(page + 1)}
                >
                  ›
                </button>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
};

export default ClientsList;
