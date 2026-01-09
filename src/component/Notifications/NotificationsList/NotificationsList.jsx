import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./notificationsList.css";
import NotificationsIcon from "../../../assets/Notifications.png";
import box from "../../../assets/box.png";
import { IoPersonOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getAllNotifications,
  getErrorMessage,
} from "../../../api/notifications";
import { getAllUsers } from "../../../api/clients";

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

const formatDate = (v) => {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleDateString("ar-EG");
};

const typeLabel = (t) => {
  const x = Number(t);
  if (x === 0) return "عروض";
  if (x === 1) return "نصائح";
  if (x === 2) return "تنبيهات";
  return "";
};

const rankLabel = (r) => {
  const x = Number(r);
  if (x === 0) return "العادي";
  if (x === 1) return "البرونزي";
  if (x === 2) return "الفضي";
  if (x === 3) return "الذهبي";
  if (x === 4) return "البلاتيني";
  return "";
};

const targetLabel = (raw, usersMap) => {
  const rank = raw.rank ?? raw.userRank ?? null;

  const customerId =
    raw.customerId ?? raw.CustomerId ?? raw.clientId ?? raw.ClientId ?? null;

  const isAll = raw.toAll || raw.isAll || rank === -1;

  if (isAll) return "موجه إلى كل العملاء";

  if (customerId != null) {
    const key = String(customerId);
    const user = usersMap[key];

    if (user && user.name) {
      return `موجه إلى العميل: ${user.name}`;
    }
    return `موجه إلى العميل رقم ${customerId}`;
  }

  if (rank !== null && rank !== undefined) {
    return `موجه إلى عملاء المستوى ${rankLabel(rank)}`;
  }

  return "المستلم غير محدد";
};

const NotificationsList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const workshopId = localStorage.getItem("workshopId");

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      if (!workshopId) {
        setNotifications([]);
        setError("لا يمكن تحميل الإشعارات بدون workshopId");
        return;
      }

      const [notesRes, usersRes] = await Promise.all([
        getAllNotifications({ workshopId, lang: "ar" }),
        getAllUsers().catch(() => null),
      ]);

      let usersMap = {};
      if (usersRes) {
        const usersList = Array.isArray(usersRes)
          ? usersRes
          : usersRes?.message || usersRes?.data || [];

        usersMap = (usersList || []).reduce((acc, u) => {
          const id = u.id ?? u.userId ?? u._id;
          if (!id) return acc;
          acc[String(id)] = {
            name: u.name ?? "بدون اسم",
            phone: u.phone ?? u.phoneNumber ?? "-",
          };
          return acc;
        }, {});
      }

      const list = notesRes || [];

      const mapped = list.map((raw, idx) => {
        const createdAt =
          raw.date ||
          raw.createdAt ||
          raw.createdDate ||
          raw.time ||
          raw.timestamp ||
          null;

        return {
          id: raw.id ?? raw.notificationId ?? `${idx}-${createdAt ?? ""}`,
          title: raw.message ?? "",
          type: typeLabel(raw.type),
          target: targetLabel(raw, usersMap),
          date: formatDate(createdAt),
          raw,
        };
      });

      setNotifications(mapped.slice().reverse());
      setPage(1);
    } catch (err) {
      setNotifications([]);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [workshopId]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications, location.state?.refresh]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(notifications.length / PAGE_SIZE)),
    [notifications.length]
  );

  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return notifications.slice(start, start + PAGE_SIZE);
  }, [notifications, page]);

  const isEmpty = !loading && !error && notifications.length === 0;

  const goToPage = (p) => {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mainContainer">
      {!isEmpty && !loading && (
        <div className="addLeft">
          <span
            className="topPlusIcon"
            onClick={() => navigate("/clients/add")}
          >
            +
          </span>
          <button
            className="addBtn"
            onClick={() => navigate("/notifications/add")}
          >
            إرسال إشعار جديد
          </button>
        </div>
      )}

      {loading && <p style={{ padding: 12 }}>جاري تحميل الإشعارات...</p>}

      {!!error && (
        <div style={{ padding: 12 }}>
          <p style={{ color: "red" }}>{error}</p>
          <button className="addBtn" onClick={loadNotifications}>
            إعادة المحاولة
          </button>
        </div>
      )}

      {isEmpty ? (
        <div className="emptyState">
          <img src={box} alt="no notifications" className="emptyIcon" />
          <p className="emptyText">لا توجد إشعارات بعد.</p>
          <p className="emptySubText">
            ابدأ بإنشاء أول إشعار لإرسال عروض وتنبيهات لعملائك.
          </p>
          <button
            className="addBtn"
            style={{ backgroundColor: "#DD2912", color: "white" }}
            onClick={() => navigate("/notifications/add")}
          >
            إنشاء إشعار جديد
          </button>
        </div>
      ) : (
        !loading &&
        !error && (
          <>
            {paged.map((note) => (
              <div className="mainCard" key={note.id}>
                <span>
                  <img
                    src={NotificationsIcon}
                    className="cardImg"
                    alt="notification"
                  />
                </span>

                <div className="cardCol">
                  <div className="cardRow">
                    <p className="cardTitle">{note.title}</p>
                    <p className="cardTitle">{note.type}</p>
                  </div>

                  <div className="cardRow">
                    <div className="cardBlock">
                      <IoPersonOutline />
                      <span className="subText">{note.target}</span>
                    </div>

                    <div className="cardBlock">
                      <span className="subText">{note.date}</span>
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

export default NotificationsList;
