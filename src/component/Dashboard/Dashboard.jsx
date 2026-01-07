import React, { useEffect, useMemo, useState } from "react";
import "./dashboard.css";

import { LuUsers } from "react-icons/lu";
import { TbActivityHeartbeat } from "react-icons/tb";
import { PiClipboardTextThin } from "react-icons/pi";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { IoPersonOutline } from "react-icons/io5";

import box from "../../assets/box.png";
import userImg from "../../assets/user.png";
import sportCar from "../../assets/sportCar.png";
import serviceIcon from "../../assets/process.png";
import carIcon from "../../assets/car.png";

import { useNavigate } from "react-router-dom";

import { getAllUsers } from "../../api/clients";
import { getSessionsForWorkshop, sessionApi } from "../../api/sessions";
import userApi from "../../api/user";

function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("ar-EG");
}

function safeNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

const pickId = (x) => (x == null ? "" : String(x));

const getSessionUserId = (x) =>
  x?.userId ??
  x?.UserId ??
  x?.customerId ??
  x?.CustomerId ??
  x?.customerID ??
  x?.customer?.id ??
  x?.customer?.userId ??
  null;

const getSessionUserName = (x) =>
  x?.userName ??
  x?.UserName ??
  x?.customerName ??
  x?.clientName ??
  x?.name ??
  "—";

const getSessionCarModel = (x) =>
  x?.carModel ?? x?.car ?? x?.carName ?? x?.model ?? "—";

const getSessionAdditionalServices = (x) => {
  const arr =
    x?.additionalServices ??
    x?.AdditionalServices ??
    x?.services ??
    x?.Services ??
    [];
  return Array.isArray(arr) ? arr : [];
};

const getSessionServiceLabel = (x) => {
  const arr = getSessionAdditionalServices(x);
  if (arr.length > 0) return arr.join("، ");
  if (x?.oilChanged) return "تغيير زيت";
  return "زيارة";
};

const getWorkshopNameFromProfile = (ws) =>
  ws?.name ??
  ws?.workshopName ??
  ws?.workShopName ??
  ws?.workshopname ??
  ws?.title ??
  ws?.workshopTitle ??
  "";

const Dashboard = () => {
  const navigate = useNavigate();
  const lang = "ar";
  const workshopId = localStorage.getItem("workshopId");

  const [workshopName, setWorkshopName] = useState(
    localStorage.getItem("workshopName") || "ورشة"
  );
  const [workshopErr, setWorkshopErr] = useState("");

  const [allClients, setAllClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [clientsError, setClientsError] = useState("");

  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [sessionsError, setSessionsError] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setWorkshopErr("");
        const ws = await userApi.getWorkshop({ lang });
        if (!alive) return;

        const name = getWorkshopNameFromProfile(ws);
        if (name) {
          setWorkshopName(name);
          localStorage.setItem("workshopName", name);
        }
      } catch (e) {
        if (!alive) return;
        setWorkshopErr(userApi.getErrorMessage(e));
      }
    })();

    return () => {
      alive = false;
    };
  }, [lang]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoadingClients(true);
        setClientsError("");

        const list = await getAllUsers({ lang }); 
        if (!alive) return;

        const mapped = (list || []).map((u) => ({
          id: u.id ?? null,
          name: u.name ?? "بدون اسم",
          phone: u.phone ?? "-",
          whats: u.whats ?? "",
          raw: u.raw ?? u,
        }));

        setAllClients(mapped.filter((x) => x.id != null));
      } catch (err) {
        if (!alive) return;
        setClientsError(
          err?.response?.data?.message || err?.message || "Network Error"
        );
        setAllClients([]);
      } finally {
        if (alive) setLoadingClients(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [lang]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoadingSessions(true);
        setSessionsError("");

        if (!workshopId) {
          setSessions([]);
          setSessionsError("لا يمكن تحميل الزيارات بدون workshopId");
          return;
        }

        const list = await getSessionsForWorkshop({ workshopId, lang });
        if (!alive) return;

        const mapped = (list || []).map((x) => {
          const dateISO = x?.date ?? x?.Date ?? x?.createdAt ?? null;
          const t = new Date(dateISO || 0).getTime();

          const additionalServices = getSessionAdditionalServices(x);

          return {
            id: x?.id ?? x?.sessionId ?? x?._id,
            userId: getSessionUserId(x),
            userName: getSessionUserName(x),
            carModel: getSessionCarModel(x),
            additionalServices,
            serviceLabel: getSessionServiceLabel(x),
            dateISO,
            time: Number.isNaN(t) ? 0 : t,
            date: formatDate(dateISO),
            price: safeNumber(x?.cost),
            raw: x,
          };
        });

        setSessions(mapped.filter((s) => s.id != null));
      } catch (err) {
        if (!alive) return;
        setSessionsError(sessionApi.getErrorMessage(err));
        setSessions([]);
      } finally {
        if (alive) setLoadingSessions(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [workshopId, lang]);

  const totalClients = allClients.length;
  const totalVisits = sessions.length;

  const totalServicesDone = useMemo(() => {
    return (sessions || []).reduce((sum, s) => {
      const n = Array.isArray(s.additionalServices)
        ? s.additionalServices.length
        : 0;
      return sum + n;
    }, 0);
  }, [sessions]);

  const statsByClientId = useMemo(() => {
    const map = new Map();

    for (const s of sessions) {
      const key = s.userId != null ? pickId(s.userId) : "";
      if (!key) continue;

      const prev = map.get(key) || {
        count: 0,
        lastTime: 0,
        lastDate: "-",
        lastCar: "—",
      };

      const next = { ...prev, count: prev.count + 1 };

      if ((s.time || 0) > (prev.lastTime || 0)) {
        next.lastTime = s.time || 0;
        next.lastDate = s.date;
        next.lastCar = s.carModel || "—";
      }

      map.set(key, next);
    }

    return map;
  }, [sessions]);

  const topClientsByVisits = useMemo(() => {
    if (!allClients.length) return [];

    const merged = allClients
      .map((c) => {
        const st = statsByClientId.get(pickId(c.id)) || {
          count: 0,
          lastTime: 0,
          lastDate: "-",
          lastCar: "—",
        };

        return {
          ...c,
          _visitCount: st.count,
          _lastTime: st.lastTime,
          _lastDate: st.lastDate,
          _lastCar: st.lastCar,
        };
      })
      .sort((a, b) => {
        if (b._visitCount !== a._visitCount)
          return b._visitCount - a._visitCount;
        if (b._lastTime !== a._lastTime) return b._lastTime - a._lastTime;
        return String(a.name).localeCompare(String(b.name), "ar");
      });

    return merged.slice(0, 3);
  }, [allClients, statsByClientId]);

  const latestSessions = useMemo(() => {
    if (!sessions.length) return [];
    return [...sessions]
      .sort((a, b) => (b.time || 0) - (a.time || 0))
      .slice(0, 3);
  }, [sessions]);

  const isEmpty = !loadingClients && !clientsError && totalClients === 0;

  const handleAddClient = () => navigate("/clients/add");
  const handleAddVisit = () => navigate("/visits/add");
  const handleViewClients = () => navigate("/clients");
  const handleViewClientDetails = (id) => navigate(`/clients/${id}`);
  const handleViewVisits = () => navigate("/visits");

  const showMainContent =
    !loadingClients &&
    !clientsError &&
    !loadingSessions &&
    !sessionsError &&
    !isEmpty;

  return (
    <div className="dashboard mainContainer">
      <div className="dashboard-header">
        <div className="welcome">
          <h2>مرحباً بك , {workshopName}</h2>
          {!!workshopErr && (
            <p style={{ color: "crimson", marginTop: 6 }}>{workshopErr}</p>
          )}
        </div>

        {!isEmpty && !loadingClients && !clientsError && (
          <div className="action-buttons">
            <button
              className="addBtn"
              style={{ backgroundColor: "#DD2912", color: "white" }}
              onClick={handleAddClient}
            >
              إضافة عميل
            </button>
            <button className="addBtn" onClick={handleAddVisit}>
              إضافة زيارة
            </button>
          </div>
        )}
      </div>

      {loadingClients && (
        <div style={{ padding: 12 }}>
          <p>جاري تحميل العملاء...</p>
        </div>
      )}

      {!!clientsError && (
        <div style={{ padding: 12 }}>
          <p style={{ color: "red" }}>{clientsError}</p>
          <button className="addBtn" onClick={() => window.location.reload()}>
            إعادة المحاولة
          </button>
        </div>
      )}

      {isEmpty ? (
        <div className="row">
          <div className="col-12">
            <div className="emptyState">
              <img src={box} alt="no data" className="emptyIcon" />
              <p className="emptyText">لا يوجد بيانات حالياً.</p>
              <p className="emptySubText">
                ابدأ بإضافة أول عميل و سجل أول زيارة لورشتك.
              </p>
              <button
                className="addBtn"
                style={{ backgroundColor: "#DD2912", color: "white" }}
                onClick={handleAddClient}
              >
                إضافة عميل
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {loadingSessions && (
            <div style={{ padding: 12 }}>
              <p>جاري تحميل الزيارات...</p>
            </div>
          )}

          {!!sessionsError && (
            <div style={{ padding: 12 }}>
              <p style={{ color: "red" }}>{sessionsError}</p>
            </div>
          )}

          {showMainContent && (
            <>
              <div className="stats row g-3 g-md-4">
                <div className="col-12 col-md-4">
                  <div className="statCard">
                    <div className="statTop">
                      <p className="statTitle">عدد العملاء</p>
                      <div className="statIconBox">
                        <LuUsers />
                      </div>
                    </div>
                    <p className="statNumber">{totalClients} عميل</p>
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="statCard">
                    <div className="statTop">
                      <p className="statTitle">عدد الزيارات</p>
                      <div className="statIconBox">
                        <TbActivityHeartbeat />
                      </div>
                    </div>
                    <p className="statNumber">{totalVisits} زيارة</p>
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="statCard">
                    <div className="statTop">
                      <p className="statTitle">عدد الخدمات المنفذة</p>
                      <div className="statIconBox">
                        <PiClipboardTextThin />
                      </div>
                    </div>
                    <p className="statNumber">{totalServicesDone} خدمة</p>
                  </div>
                </div>
              </div>

              <div className="mainContainer roundedSection">
                <div className="sectionTitle">
                  <p className="recentTitle">أكثر العملاء زيارة</p>
                  <p className="viewAll" onClick={handleViewClients}>
                    عرض الكل
                  </p>
                </div>

                <div className="row g-3">
                  {topClientsByVisits.map((client) => (
                    <div className="col-12" key={client.id}>
                      <div
                        className="mainCard"
                        onClick={() => handleViewClientDetails(client.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <span>
                          <img src={userImg} className="cardImg" alt="client" />
                        </span>

                        <div className="cardCol">
                          <div className="cardRow">
                            <p className="cardTitle">{client.name}</p>

                            <p className="cardTitle">
                              {client._visitCount > 0 ? (
                                <>
                                  عدد الزيارات:
                                  <span>{client._visitCount}</span>
                                </>
                              ) : (
                                "لا توجد زيارات"
                              )}
                            </p>
                          </div>

                          <div className="cardRow">
                            <div className="cardDetails">
                              <div className="cardBlock">
                                <span className="copyIcon">
                                  <MdOutlinePhoneAndroid />
                                </span>
                                <p className="subText">{client.phone || "-"}</p>
                              </div>

                              <div className="cardBlock subText">
                                <img
                                  className="carImg"
                                  src={sportCar}
                                  alt="car"
                                />
                                <span>{client._lastCar || "—"}</span>
                              </div>

                              <div className="cardBlock subText">
                                {client._visitCount > 0
                                  ? `آخر زيارة: ${client._lastDate}`
                                  : "—"}
                              </div>

                              <div className="cardBlock">
                                <p className="moreDetails">تفاصيل أكثر</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {topClientsByVisits.length === 0 && (
                    <p style={{ padding: 12 }}>لا يوجد عملاء لعرضهم.</p>
                  )}
                </div>
              </div>

              <div className="mainContainer roundedSection">
                <div className="sectionTitle">
                  <p className="recentTitle"> أحدث الزيارات</p>
                  <p className="viewAll" onClick={handleViewVisits}>
                    عرض الكل
                  </p>
                </div>

                <div className="row g-3">
                  <div className="mainContainer col-12">
                    {latestSessions.map((visit) => (
                      <div className="mainCard" key={visit.id}>
                        <span>
                          <img
                            src={serviceIcon}
                            className="cardImg"
                            alt="service"
                          />
                        </span>

                        <div className="cardCol">
                          <div className="cardRow">
                            <p className="cardTitle">{visit.serviceLabel}</p>
                            <p className="cardTitle">
                              {Math.round(visit.price)} ج.م
                            </p>
                          </div>

                          <div className="cardRow">
                            <div className="cardDetails">
                              <div className="cardBlock">
                                <IoPersonOutline />
                                <span className="subText">
                                  {visit.userName}
                                </span>
                              </div>

                              <div className="cardBlock subText">
                                <img
                                  src={carIcon}
                                  className="carImg"
                                  alt="car"
                                />
                                <span>{visit.carModel}</span>
                              </div>

                              <div className="cardBlick subText">
                                {visit.date}
                              </div>

                              <div className="cardBlock moreDetails">
                                تفاصيل أكثر
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {!loadingSessions && latestSessions.length === 0 && (
                      <p style={{ padding: 12 }}>لا توجد زيارات حالياً.</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
