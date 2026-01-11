import React, { useEffect, useMemo, useState } from "react";
import "./clientDetails.css";
import {
  PiUserThin,
  PiPhoneLight,
  PiClipboardTextLight,
  PiEnvelopeSimpleLight,
} from "react-icons/pi";
import { LuTrash2, LuPencil } from "react-icons/lu";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";
import AlertModal from "../../Modals/AlertModal/AlertModal";
import { useNavigate, useParams } from "react-router-dom";

import { getAllUsers, deleteUser } from "../../../api/clients";
import { getCarsCached } from "../../../store/carsStore";
import ClientNotificationModal from "../../Notifications/ClientNotificationModal/ClientNotificationModal";

const formatKm = (km) => {
  if (km === null || km === undefined || km === "") return "—";
  return `${km} كم`;
};

const safeDate = (s) => {
  if (!s) return null;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  if (s.startsWith("0001-01-01")) return null;
  return d;
};

const ClientDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [client, setClient] = useState(null);
  const [cars, setCars] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const [showNotifyModal, setShowNotifyModal] = useState(false);

  const toggleCar = (index) => {
    setCars((prev) =>
      prev.map((c, i) => (i === index ? { ...c, open: !c.open } : c))
    );
  };

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const users = await getAllUsers();
        const list = Array.isArray(users)
          ? users
          : users?.message || users?.data || [];

        const found = (list || []).find((u) => String(u.id) === String(id));
        console.log("ALL USERS:", list);

        const normalizedClient = {
          id: found?.id ?? id,
          name: found?.name ?? "بدون اسم",
          phone: found?.phone ?? found?.phoneNumber ?? "-",
          whatsapp: found?.whats ?? found?.whatsapp ?? "-",
          email: found?.raw.email ?? found?.mail ?? "-",
        };
        console.log("FOUND CLIENT:", normalizedClient);

        const userCars = await getCarsCached(id, "ar");

        const sortedCars = [...(userCars || [])].sort((a, b) => {
          const da = safeDate(a.lastChange);
          const db = safeDate(b.lastChange);
          if (db && da) return db - da;
          if (db && !da) return 1;
          if (!db && da) return -1;
          return 0;
        });

        const mappedCars = (sortedCars || []).map((c, idx) => ({
          open: idx === 0,
          type: `${c.make || ""} ${c.carModel || ""}`.trim() || "—",
          plate: c.plateNumber || "—",
          mileage: formatKm(c.currentKm),
          oil: c.oilType || "—",
          raw: c,
        }));

        if (!mounted) return;

        setClient(normalizedClient);
        setCars(mappedCars);
      } catch (e) {
        if (!mounted) return;
        setError(e?.response?.data?.message || e?.message || "Network Error");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  const isEmptyCars = useMemo(
    () => !loading && !error && cars.length === 0,
    [loading, error, cars.length]
  );

  const handleDeleteConfirm = async () => {
    if (!id || deleting) return;

    setDeleting(true);
    setError("");

    try {
      const res = await deleteUser(id, "ar");
      if (!res?.success) {
        setError(res?.message || "فشل حذف العميل");
        return;
      }

      setShowAlert(false);
      navigate("/clients", { state: { refresh: true } });
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="mainContainer " dir="rtl">
        <AlertModal
          show={showAlert}
          title="تحذير"
          alertIcon="⚠️"
          message={
            deleting
              ? "جاري حذف العميل..."
              : "هل أنت متأكد من حذف هذا العميل؟ سيتم حذف جميع بياناته المرتبطة وجميع الزيارات الخاصة به."
          }
          cancelText="إلغاء"
          confirmText={deleting ? "جاري الحذف..." : "حذف"}
          onCancel={() => {
            if (deleting) return;
            setShowAlert(false);
          }}
          onConfirm={handleDeleteConfirm}
        />

        {loading && <p style={{ padding: 12 }}>جاري تحميل بيانات العميل...</p>}

        {!!error && (
          <div style={{ padding: 12 }}>
            <p style={{ color: "red" }}>{error}</p>
            <button className="addBtn" onClick={() => window.location.reload()}>
              إعادة المحاولة
            </button>
          </div>
        )}

        {!loading && !error && client && (
          <>
            <div className="detailsHeader">
              <div className="topButtons">
                <button
                  className="btnNotify"
                  onClick={() => setShowNotifyModal(true)}
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

              <div className="editDeleteRowPage">
                <span
                  className="editClient"
                  onClick={() => navigate(`/clients/${id}/edit`)}
                >
                  تعديل البيانات <LuPencil className="iconSm" />
                </span>

                <span
                  className="deleteClient"
                  onClick={() => setShowAlert(true)}
                >
                  حذف العميل <LuTrash2 className="iconSm" />
                </span>
              </div>
            </div>

            <div className="roundedSection">
              <p className="cardTitle">المعلومات الشخصية</p>

              <div className="personalInfo">
                <div className="infoGrid">
                  <div className="infoRow">
                    <PiUserThin className="iconLg" />
                    <span>{client?.name || "—"}</span>
                  </div>

                  <div className="infoRow">
                    <PiPhoneLight className="iconLg" />
                    <span>{client?.phone || "—"}</span>
                  </div>

                  <div className="infoRow">
                    <PiClipboardTextLight className="iconLg" />
                    <span>{client?.whatsapp || "—"}</span>
                  </div>

                  <div className="infoRow">
                    <PiEnvelopeSimpleLight className="iconLg" />
                    <span>{client?.email || "—"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="roundedSection">
              <p className="cardTitle mb-2">السيارات</p>

              {isEmptyCars ? (
                <p style={{ padding: 12 }}>لا توجد سيارات مسجلة لهذا العميل.</p>
              ) : (
                cars.map((car, index) => (
                  <div key={index}>
                    <div className="carHeader" onClick={() => toggleCar(index)}>
                      <span className="subTitle">السيارة {index + 1}</span>
                      {car.open ? (
                        <IoChevronUpOutline />
                      ) : (
                        <IoChevronDownOutline />
                      )}
                    </div>

                    {car.open && (
                      <div className="mainForm row">
                        <div className="formCol col-12 col-md-6">
                          <div className="inputGroup">
                            <label>نوع السيارة</label>
                            <input type="text" value={car.type} readOnly />
                          </div>

                          <div className="inputGroup">
                            <label>رقم اللوحة</label>
                            <input type="text" value={car.plate} readOnly />
                          </div>
                        </div>

                        <div className="formCol col-12 col-md-6">
                          <div className="inputGroup">
                            <label>قراءة العداد الحالية</label>
                            <input type="text" value={car.mileage} readOnly />
                          </div>

                          <div className="inputGroup">
                            <label>نوع الزيت الحالي</label>
                            <input type="text" value={car.oil} readOnly />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* per-client notification modal */}
      <ClientNotificationModal
        show={showNotifyModal}
        client={client}
        onClose={() => setShowNotifyModal(false)}
      />
    </>
  );
};

export default ClientDetails;
