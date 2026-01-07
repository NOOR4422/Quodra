import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./visitsList.css";
import { LuTrash2, LuPencil } from "react-icons/lu";
import carIcon from "../../../assets/car.png";
import serviceIcon from "../../../assets/process.png";
import { IoPersonOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import AlertModal from "../../Modals/AlertModal/AlertModal";
import box from "../../../assets/box.png";

import {
  getSessionsForWorkshop,
  deleteSession,
  sessionApi,
} from "../../../api/sessions";

import { clientsApi } from "../../../api/clients";
import { carsApi } from "../../../api/cars";

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

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString("ar-EG");
};

const safeId = (x) => (x == null ? "" : String(x));

const VisitsList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const workshopId = localStorage.getItem("workshopId");
  const lang = "ar";

  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [clients, setClients] = useState([]);
  const [clientsErr, setClientsErr] = useState("");

  const [carsById, setCarsById] = useState(new Map());
  const [carsErr, setCarsErr] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [selectedVisitId, setSelectedVisitId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [page, setPage] = useState(1);

  const clientsById = useMemo(() => {
    const m = new Map();
    (clients || []).forEach((c) => m.set(safeId(c.id), c));
    return m;
  }, [clients]);

  const loadClients = useCallback(async () => {
    try {
      setClientsErr("");
      if (!workshopId) {
        setClients([]);
        return;
      }
      const list = await clientsApi.getUsersForWorkshop({ lang });
      setClients(list || []);
    } catch (e) {
      setClients([]);
      setClientsErr(clientsApi.getErrorMessage(e));
    }
  }, [lang, workshopId]);

  const loadAllCarsForClients = useCallback(async () => {
    try {
      setCarsErr("");
      const map = new Map();

      const ids = (clients || []).map((c) => c?.id).filter(Boolean);
      if (ids.length === 0) {
        setCarsById(new Map());
        return;
      }

      for (const userId of ids) {
        try {
          const list = await carsApi.getAllCarsForUser({ userId, lang });
          (list || []).forEach((car) => {
            map.set(safeId(car.id), car);
          });
        } catch {
          // ignore per-user errors, keep going
        }
      }

      setCarsById(map);
    } catch (e) {
      setCarsById(new Map());
      setCarsErr(carsApi.getErrorMessage(e));
    }
  }, [clients, lang]);

  const loadVisits = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      if (!workshopId) {
        setVisits([]);
        setError("لا يمكن تحميل الزيارات بدون workshopId");
        return;
      }

      const list = await getSessionsForWorkshop({ workshopId, lang });

    const mapped = (list || []).map((x) => {
      const sessionId = x.id ?? x.sessionId ?? x._id;

      const customerId =
        x.userId ??
        x.UserId ??
        x.customerId ??
        x.CustomerId ??
        x.customerID ??
        null;

      const carId = x.carId ?? x.CarId ?? x.carID ?? x.CarID ?? null;

      const client = customerId ? clientsById.get(safeId(customerId)) : null;
      const car = carId ? carsById.get(safeId(carId)) : null;

      return {
        id: sessionId,
        service:
          Array.isArray(x.additionalServices) && x.additionalServices.length > 0
            ? x.additionalServices.join("، ")
            : "زيارة",

        customer: client?.name ?? x.userName ?? x.customerName ?? "—",

        car: car?.carModel ?? x.carModel ?? x.model ?? "—",

        date: formatDate(x.date),
        _dateIso: x.date,
        price:
          typeof x.cost === "number" ? Math.round(x.cost) : Number(x.cost) || 0,
        raw: x,
      };
    });

      mapped.sort((a, b) => {
        const ta = new Date(a._dateIso).getTime();
        const tb = new Date(b._dateIso).getTime();
        const va = Number.isNaN(ta) ? 0 : ta;
        const vb = Number.isNaN(tb) ? 0 : tb;
        return vb - va;
      });

      setVisits(mapped);
      setPage(1);
    } catch (err) {
      setError(sessionApi.getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [workshopId, lang, clientsById, carsById]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  useEffect(() => {
    loadAllCarsForClients();
  }, [loadAllCarsForClients]);

  useEffect(() => {
    loadVisits();
  }, [loadVisits, location.state?.refresh]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(visits.length / PAGE_SIZE)),
    [visits.length]
  );

  const pagedVisits = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return visits.slice(start, start + PAGE_SIZE);
  }, [visits, page]);

  const isEmpty = !loading && !error && visits.length === 0;

  const goToPage = (p) => {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openDeleteModal = (id) => {
    setSelectedVisitId(id);
    setShowAlert(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedVisitId || deleting) return;

    setDeleting(true);
    setError("");

    try {
      await deleteSession({ lang, sessionId: selectedVisitId });

      setVisits((prev) =>
        prev.filter((v) => safeId(v.id) !== safeId(selectedVisitId))
      );

      setShowAlert(false);
      setSelectedVisitId(null);

      setTimeout(() => {
        setPage((prevPage) => {
          const newTotal = Math.max(
            1,
            Math.ceil((visits.length - 1) / PAGE_SIZE)
          );
          return prevPage > newTotal ? newTotal : prevPage;
        });
      }, 0);
    } catch (err) {
      setError(sessionApi.getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const showTopAdd = !isEmpty && !loading;

  return (
    <div className="mainContainer">
      <AlertModal
        show={showAlert}
        title="تحذير"
        alertIcon="⚠️"
        message={
          deleting ? "جاري حذف الزيارة..." : "هل انت متأكد من حذف هذه الزيارة ؟"
        }
        cancelText="إلغاء"
        confirmText={deleting ? "جاري الحذف..." : "حذف"}
        onCancel={() => {
          if (deleting) return;
          setShowAlert(false);
          setSelectedVisitId(null);
        }}
        onConfirm={handleDeleteConfirm}
      />

      {showTopAdd && (
        <div className="addLeft">
          <span
            className="topPlusIcon"
            onClick={() => navigate("/clients/add")}
          >
            +
          </span>
          <button className="addBtn" onClick={() => navigate("/visits/add")}>
            إضافة زيارة جديد
          </button>
        </div>
      )}

      {loading && <p style={{ padding: 12 }}>جاري تحميل الزيارات...</p>}

      {!!clientsErr && (
        <p style={{ padding: 12, color: "crimson" }}>{clientsErr}</p>
      )}
      {!!carsErr && <p style={{ padding: 12, color: "crimson" }}>{carsErr}</p>}

      {!!error && (
        <div style={{ padding: 12 }}>
          <p style={{ color: "red" }}>{error}</p>
          <button
            className="addBtn"
            onClick={() => {
              loadClients();
              loadAllCarsForClients();
              loadVisits();
            }}
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {isEmpty ? (
        <div className="emptyState">
          <img src={box} alt="no data" className="emptyIcon" />
          <p className="emptyText">لا توجد زيارات مسجلة بعد.</p>
          <p className="emptySubText">
            ابدأ بإضافة أول زيارة لتتبع خدمات الورشة بسهولة.
          </p>
          <button
            className="addBtn"
            style={{ backgroundColor: "#DD2912", color: "white" }}
            onClick={() => navigate("/visits/add")}
          >
            إضافة زيارة
          </button>
        </div>
      ) : (
        !loading &&
        !error && (
          <>
            {pagedVisits.map((visit) => (
              <div className="mainCard" key={visit.id}>
                <span>
                  <img src={serviceIcon} className="cardImg" alt="service" />
                </span>

                <div className="cardCol">
                  <div className="cardRow">
                    <p className="cardTitle">{visit.service}</p>
                    <p className="cardTitle">{visit.price} ج.م</p>
                  </div>

                  <div className="cardRow">
                    <div className="cardDetails">
                      <div className="cardBlock">
                        <IoPersonOutline />
                        <span className="subText">{visit.customer}</span>
                      </div>

                      <div className="cardBlock subText">
                        <img src={carIcon} className="carImg" alt="car" />
                        <span>{visit.car}</span>
                      </div>

                      <div className="cardBlick subText">{visit.date}</div>

                      <div
                        className="cardBlock moreDetails"
                        style={{ cursor: "pointer" }}
                      >
                        تفاصيل أكثر
                      </div>
                    </div>

                    <div className="btnRow">
                      <span
                        className="editRow"
                        onClick={() => navigate(`/visits/${visit.id}/edit`)}
                      >
                        تعديل البيانات <LuPencil className="actionIcon" />
                      </span>

                      <span
                        className="deleteRow"
                        onClick={() => openDeleteModal(visit.id)}
                      >
                        حذف الزيارة <LuTrash2 className="actionIcon" />
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

export default VisitsList;
