import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import "../AddVisitForm/addVisitForm.css";
import AlertModal from "../../Modals/AlertModal/AlertModal";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";

import serviceTypeApi from "../../../api/serviceType";
import oilTypeApi from "../../../api/oilType";
import {
  getSessionsForWorkshop,
  sessionApi,
  updateSession,
} from "../../../api/sessions";
import { clientsApi } from "../../../api/clients";
import { carsApi } from "../../../api/cars";

const toISODateInput = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

const selectStyles = {
  container: (base) => ({ ...base, outline: "none" }),
  control: (base, state) => ({
    ...base,
    borderRadius: 12,
    borderColor: state.isFocused ? "#dd2912" : "#eacccc",
    boxShadow: "none",
    outline: "none",
    minHeight: 55,
    paddingInline: 4,
    direction: "rtl",
    "&:hover": { borderColor: state.isFocused ? "#dd2912" : "#eacccc" },
  }),
  valueContainer: (base) => ({ ...base, padding: "0 8px" }),
  menu: (base) => ({ ...base, borderRadius: 12, zIndex: 9999, marginTop: 2 }),
  option: (base, state) => ({
    ...base,
    textAlign: "right",
    borderRadius: 12,
    fontFamily: "Cairo, sans-serif",
    backgroundColor: state.isSelected ? "#dd2912" : "#fff",
    color: state.isSelected ? "#fff" : "#333",
  }),
  indicatorSeparator: () => ({ display: "none" }),
};

const safeStr = (v) => (v == null ? "" : String(v));
const normalizeArabic = (s) =>
  safeStr(s).trim().replace(/\s+/g, " ").toLowerCase();

const EditVisitForm = () => {
  const { id: visitId } = useParams();
  const navigate = useNavigate();

  const workshopId = localStorage.getItem("workshopId");
  const lang = "ar";

  const [showAlert, setShowAlert] = useState(false);
  const [saving, setSaving] = useState(false);

  const [visitLoading, setVisitLoading] = useState(true);
  const [visitError, setVisitError] = useState("");

  const [serviceTypes, setServiceTypes] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState("");

  const [oilTypes, setOilTypes] = useState([]);
  const [oilLoading, setOilLoading] = useState(false);
  const [oilError, setOilError] = useState("");

  const [clients, setClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [clientsError, setClientsError] = useState("");

  const [cars, setCars] = useState([]);
  const [carsLoading, setCarsLoading] = useState(false);
  const [carsError, setCarsError] = useState("");

  const [rawSession, setRawSession] = useState(null);

  const [didPrefillClient, setDidPrefillClient] = useState(false);
  const [didPrefillCar, setDidPrefillCar] = useState(false);
  const [clientTouched, setClientTouched] = useState(false);
  const [carTouched, setCarTouched] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      client: null,
      car: null,
      visitDate: "",
      servicesSelect: [],
      price: "",
      oilChanged: "no",
      oilType: null,
      kmAtChange: "",
      nextRecommendedKm: "",
      notes: "",
    },
  });

  const oilChanged = watch("oilChanged");
  const selectedClient = watch("client");

  const serviceOptions = useMemo(
    () => (serviceTypes || []).map((s) => ({ value: s.name, label: s.name })),
    [serviceTypes]
  );

  const oilOptions = useMemo(
    () =>
      (oilTypes || []).map((o) => ({
        value: o.id,
        label: `${o.oiltybe} - ${o.km} KM`,
        raw: o,
      })),
    [oilTypes]
  );

  const clientOptions = useMemo(
    () =>
      (clients || []).map((c) => ({
        value: c.id,
        label: `${c.name}${c.phone && c.phone !== "-" ? ` - ${c.phone}` : ""}`,
        raw: c,
      })),
    [clients]
  );

  const carOptions = useMemo(
    () =>
      (cars || []).map((c) => ({
        value: c.id,
        label: `${c.carModel}${c.plateNumber ? ` - ${c.plateNumber}` : ""}`,
        raw: c,
      })),
    [cars]
  );

  const fetchServiceTypes = useCallback(async () => {
    setServicesError("");
    if (!workshopId) {
      setServiceTypes([]);
      setServicesError("لا يمكن تحميل الخدمات بدون workshopId");
      return;
    }
    try {
      setServicesLoading(true);
      const list = await serviceTypeApi.getAllByWorkshopId({
        workshopId,
        lang,
      });
      setServiceTypes(list || []);
    } catch (err) {
      setServiceTypes([]);
      setServicesError(serviceTypeApi.getErrorMessage(err));
    } finally {
      setServicesLoading(false);
    }
  }, [workshopId, lang]);

  const fetchOilTypes = useCallback(async () => {
    setOilError("");
    if (!workshopId) {
      setOilTypes([]);
      setOilError("لا يمكن تحميل الزيوت بدون workshopId");
      return;
    }
    try {
      setOilLoading(true);
      const list = await oilTypeApi.getAllByWorkshop({ workshopId, lang });
      setOilTypes(list || []);
    } catch (err) {
      setOilTypes([]);
      setOilError(oilTypeApi.getErrorMessage(err));
    } finally {
      setOilLoading(false);
    }
  }, [workshopId, lang]);

  const fetchClients = useCallback(async () => {
    setClientsError("");
    try {
      setClientsLoading(true);
      const list = await clientsApi.getUsersForWorkshop({ lang });
      setClients(list || []);
    } catch (err) {
      setClients([]);
      setClientsError(clientsApi.getErrorMessage(err));
    } finally {
      setClientsLoading(false);
    }
  }, [lang]);

  const loadVisit = useCallback(async () => {
    try {
      setVisitLoading(true);
      setVisitError("");

      if (!workshopId) {
        setVisitError("لا يمكن تحميل الزيارة بدون workshopId");
        return;
      }

      const list = await getSessionsForWorkshop({ workshopId, lang });
      const found = (list || []).find(
        (x) => String(x.id ?? x.sessionId ?? x._id) === String(visitId)
      );

      if (!found) {
        setVisitError("Session not found");
        return;
      }

      setRawSession(found);

      setDidPrefillClient(false);
      setDidPrefillCar(false);
      setClientTouched(false);
      setCarTouched(false);

      const selectedServicesOptions = Array.isArray(found.additionalServices)
        ? found.additionalServices.map((name) => ({ value: name, label: name }))
        : [];

      reset({
        client: null,
        car: null,
        visitDate: toISODateInput(found.date),
        servicesSelect: selectedServicesOptions,
        price: found.cost != null ? String(Math.round(Number(found.cost))) : "",
        oilChanged: found.oilChanged ? "yes" : "no",
        oilType: null,
        kmAtChange: found.kmReading != null ? String(found.kmReading) : "",
        nextRecommendedKm:
          found.nextChange != null ? String(found.nextChange) : "",
        notes: found.description ?? "",
      });

      if (found.oilChanged && found.oilId != null) {
        setValue(
          "oilType",
          { value: found.oilId, label: String(found.oilId) },
          { shouldDirty: false }
        );
      }
    } catch (err) {
      setVisitError(sessionApi.getErrorMessage(err));
    } finally {
      setVisitLoading(false);
    }
  }, [workshopId, lang, visitId, reset, setValue]);

  useEffect(() => {
    fetchServiceTypes();
    fetchOilTypes();
    fetchClients();
    loadVisit();
  }, [fetchServiceTypes, fetchOilTypes, fetchClients, loadVisit]);

  useEffect(() => {
    if (!rawSession) return;
    if (!clients.length) return;
    if (didPrefillClient) return;
    if (clientTouched) return;

    const customerId =
      rawSession.userId ??
      rawSession.UserId ??
      rawSession.customerId ??
      rawSession.CustomerId ??
      rawSession.customerID ??
      null;

    let match = null;

    if (customerId) {
      match = clientOptions.find((c) => String(c.value) === String(customerId));
    }

    if (!match) {
      const sessionUserName = normalizeArabic(rawSession.userName);
      if (sessionUserName) {
        match = clientOptions.find(
          (c) => normalizeArabic(c.raw?.name) === sessionUserName
        );
      }
    }

    if (match) {
      setValue("client", match, { shouldDirty: false });
      setDidPrefillClient(true);
    }
  }, [
    rawSession,
    clients.length,
    clientOptions,
    setValue,
    didPrefillClient,
    clientTouched,
  ]);

  useEffect(() => {
    let alive = true;

    const loadCars = async () => {
      setCarsError("");
      setCars([]);

      const userId = selectedClient?.value;
      if (!userId) return;

      try {
        setCarsLoading(true);
        const list = await carsApi.getAllCarsForUser({ userId, lang });
        if (!alive) return;
        setCars(list || []);
      } catch (err) {
        if (!alive) return;
        setCars([]);
        setCarsError(carsApi.getErrorMessage(err));
      } finally {
        if (alive) setCarsLoading(false);
      }
    };

    loadCars();
    return () => {
      alive = false;
    };
  }, [selectedClient?.value, lang]);

  useEffect(() => {
    if (!rawSession) return;
    if (!cars.length) return;
    if (didPrefillCar) return;
    if (carTouched) return;

    const carId =
      rawSession.carId ??
      rawSession.CarId ??
      rawSession.carID ??
      rawSession.CarID ??
      rawSession.carid ??
      null;

    let match = null;

    if (carId != null) {
      match = carOptions.find((c) => String(c.value) === String(carId));
    }

    if (!match) {
      const sessionCarModel = normalizeArabic(rawSession.carModel);
      if (sessionCarModel) {
        match = carOptions.find(
          (c) => normalizeArabic(c.raw?.carModel) === sessionCarModel
        );
      }
    }

    if (match) {
      setValue("car", match, { shouldDirty: false });
      setDidPrefillCar(true);
    }
  }, [
    rawSession,
    cars.length,
    carOptions,
    setValue,
    didPrefillCar,
    carTouched,
  ]);

  useEffect(() => {
    const cur = watch("oilType");
    if (!cur?.value) return;
    if (!oilOptions.length) return;

    const match = oilOptions.find((o) => String(o.value) === String(cur.value));
    if (match) setValue("oilType", match, { shouldDirty: false });
  }, [oilOptions.length, setValue, watch]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      setVisitError("");

      const isOilChanged = data.oilChanged === "yes";

      const additionalServices = Array.isArray(data.servicesSelect)
        ? data.servicesSelect.map((x) => x.value).filter(Boolean)
        : [];

      if (additionalServices.length === 0)
        return setVisitError("اختر خدمة واحدة على الأقل");
      if (!data.client?.value) return setVisitError("اختر العميل");
      if (!data.car?.value) return setVisitError("اختر السيارة");

      const carIdNum = Number(data.car.value);
      if (Number.isNaN(carIdNum)) return setVisitError("carId غير صالح");

      const payload = {
        kmReading: isOilChanged ? Number(data.kmAtChange || 0) : 0,
        numberOfKilometers: isOilChanged ? Number(data.kmAtChange || 0) : 0,
        filterChanged: false,

        oilChanged: isOilChanged,
        oilId: isOilChanged ? Number(data.oilType?.value || 0) : 0,

        additionalServices,
        nextChange: isOilChanged ? Number(data.nextRecommendedKm || 0) : 0,

        description: data.notes || "",
        cost: Number(data.price || 0),

        userId: data.client.value,
        carId: carIdNum,
      };

      const res = await updateSession({ lang, sessionId: visitId, payload });

      const ok = res?.data?.success ?? res?.success;
      if (ok !== true) {
        throw new Error(
          res?.data?.message || res?.message || "فشل تعديل الزيارة"
        );
      }

      setShowAlert(true);
    } catch (err) {
      setVisitError(sessionApi.getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const loadingAny =
    visitLoading || servicesLoading || oilLoading || clientsLoading;

  return (
    <div className="formContainer">
      <AlertModal
        show={showAlert}
        title="تم بنجاح"
        alertIcon="✅"
        confirmText="تم"
        showCancel={false}
        message="تم تعديل الزيارة بنجاح"
        onCancel={() => setShowAlert(false)}
        onConfirm={() => {
          setShowAlert(false);
          navigate("/visits", { state: { refresh: Date.now() } });
        }}
      />

      <h2 className="formTitle">تعديل الزيارة</h2>

      {loadingAny && <p style={{ padding: 12 }}>جاري تحميل البيانات...</p>}

      {!!visitError && (
        <div style={{ padding: 12 }}>
          <p style={{ color: "red" }}>{visitError}</p>
          <button className="addBtn" type="button" onClick={loadVisit}>
            إعادة المحاولة
          </button>
        </div>
      )}

      {!visitLoading && !visitError && (
        <form
          id="editVisitForm"
          className="mainForm row"
          onSubmit={handleSubmit(onSubmit)}
          dir="rtl"
        >
          <div className="formCol col-12 col-md-6">
            <div className="inputGroup">
              <label>
                اسم العميل{" "}
                <span className="req">
                  <FaStar />
                </span>
              </label>

              {!!clientsError && (
                <p style={{ color: "crimson", padding: "6px 0" }}>
                  {clientsError}
                </p>
              )}

              <Controller
                name="client"
                control={control}
                rules={{ required: "اختر العميل" }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(opt) => {
                      setClientTouched(true);

                      setValue("car", null, { shouldDirty: false });
                      setCarTouched(false);
                      setDidPrefillCar(false);

                      field.onChange(opt);
                    }}
                    options={clientOptions}
                    isSearchable={false}
                    isDisabled={clientsLoading || !!clientsError}
                    placeholder={
                      clientsLoading ? "جارِ التحميل..." : "اختر العميل"
                    }
                    styles={selectStyles}
                  />
                )}
              />
              <p className="errorMessage">{errors.client?.message}</p>
            </div>

            <div className="inputGroup">
              <label>
                نوع الخدمة{" "}
                <span className="req">
                  <FaStar />
                </span>
              </label>

              {!!servicesError && (
                <p style={{ color: "crimson", padding: "6px 0" }}>
                  {servicesError}
                </p>
              )}

              <Controller
                name="servicesSelect"
                control={control}
                rules={{
                  validate: (v) =>
                    (Array.isArray(v) && v.length > 0) ||
                    "اختر خدمة واحدة على الأقل",
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    isMulti
                    options={serviceOptions}
                    isSearchable={false}
                    isDisabled={servicesLoading || !!servicesError}
                    placeholder={
                      servicesLoading
                        ? "جارِ التحميل..."
                        : serviceOptions.length === 0
                        ? "لا توجد خدمات"
                        : "اختر الخدمات"
                    }
                    styles={selectStyles}
                  />
                )}
              />
              <p className="errorMessage">{errors.servicesSelect?.message}</p>
            </div>
          </div>

          <div className="formCol col-12 col-md-6">
            <div className="inputGroup">
              <label>
                نوع السيارة{" "}
                <span className="req">
                  <FaStar />
                </span>
              </label>

              {!!carsError && (
                <p style={{ color: "crimson", padding: "6px 0" }}>
                  {carsError}
                </p>
              )}

              <Controller
                name="car"
                control={control}
                rules={{ required: "اختر السيارة" }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(opt) => {
                      setCarTouched(true);
                      field.onChange(opt);
                    }}
                    options={carOptions}
                    isSearchable={false}
                    isDisabled={
                      !selectedClient?.value || carsLoading || !!carsError
                    }
                    placeholder={
                      !selectedClient?.value
                        ? "اختر العميل أولاً"
                        : carsLoading
                        ? "جارِ التحميل..."
                        : carOptions.length === 0
                        ? "لا توجد سيارات لهذا العميل"
                        : "اختر السيارة"
                    }
                    styles={selectStyles}
                  />
                )}
              />
              <p className="errorMessage">{errors.car?.message}</p>
            </div>

            <div className="inputGroup">
              <label>تاريخ الزيارة</label>
              <input type="date" {...register("visitDate")} />
            </div>
          </div>

          <div className="col-12">
            <div className="row">
              <div className="col-12 col-md-6 order-md-2">
                <div className="inputGroup">
                  <label>هل تم تغيير الزيت؟</label>
                  <div className="radioOptions">
                    <div className="radioItem">
                      <input
                        type="radio"
                        value="yes"
                        {...register("oilChanged")}
                      />
                      <p>نعم</p>
                    </div>
                    <div className="radioItem">
                      <input
                        type="radio"
                        value="no"
                        {...register("oilChanged")}
                      />
                      <p>لا</p>
                    </div>
                  </div>
                </div>

                {oilChanged === "yes" && (
                  <>
                    <div className="inputGroup">
                      <label>عدد الكيلومترات عند التغيير</label>
                      <input
                        type="text"
                        {...register("kmAtChange", {
                          validate: (v) =>
                            !v || /^\d+$/.test(v) || "يسمح فقط بالأرقام",
                        })}
                        className={errors.kmAtChange ? "inputError" : ""}
                      />
                      <p className="errorMessage">
                        {errors.kmAtChange?.message}
                      </p>
                    </div>

                    <div className="inputGroup">
                      <label>الكيلومترات الموصى بها للتغيير القادم</label>
                      <input
                        type="text"
                        {...register("nextRecommendedKm", {
                          validate: (v) =>
                            !v || /^\d+$/.test(v) || "يسمح فقط بالأرقام",
                        })}
                        className={errors.nextRecommendedKm ? "inputError" : ""}
                      />
                      <p className="errorMessage">
                        {errors.nextRecommendedKm?.message}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="col-12 col-md-6 order-md-1">
                <div className="inputGroup">
                  <label>السعر</label>
                  <input
                    type="text"
                    {...register("price", {
                      validate: (v) =>
                        !v || /^\d+$/.test(v) ? true : "يسمح فقط بالأرقام",
                    })}
                    className={errors.price ? "inputError" : ""}
                  />
                  <p className="errorMessage">{errors.price?.message}</p>
                </div>

                {oilChanged === "yes" && (
                  <div className="inputGroup">
                    <label>
                      نوع الزيت{" "}
                      <span className="req">
                        <FaStar />
                      </span>
                    </label>

                    {!!oilError && (
                      <p style={{ color: "crimson", padding: "6px 0" }}>
                        {oilError}
                      </p>
                    )}

                    <Controller
                      name="oilType"
                      control={control}
                      rules={{
                        validate: (v) =>
                          watch("oilChanged") !== "yes" ||
                          !!v ||
                          "اختر نوع الزيت",
                      }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={oilOptions}
                          isSearchable={false}
                          isDisabled={oilLoading || !!oilError}
                          placeholder={
                            oilLoading
                              ? "جارِ التحميل..."
                              : oilOptions.length === 0
                              ? "لا توجد زيوت"
                              : "اختر نوع الزيت"
                          }
                          styles={selectStyles}
                        />
                      )}
                    />
                    <p className="errorMessage">{errors.oilType?.message}</p>
                  </div>
                )}

                <div className="inputGroup">
                  <label>ملاحظات</label>
                  <input
                    type="text"
                    placeholder="ملاحظات"
                    {...register("notes")}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {!visitLoading && !visitError && (
        <button
          type="submit"
          form="editVisitForm"
          className="submitBtn"
          disabled={saving}
        >
          {saving ? "جاري الحفظ..." : "حفظ"}
        </button>
      )}
    </div>
  );
};

export default EditVisitForm;
