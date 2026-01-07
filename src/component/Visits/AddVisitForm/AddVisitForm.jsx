import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import "./addVisitForm.css";
import { FaStar } from "react-icons/fa";
import AlertModal from "../../Modals/AlertModal/AlertModal";
import Select from "react-select";

import serviceTypeApi from "../../../api/serviceType";
import oilTypeApi from "../../../api/oilType";
import { clientsApi } from "../../../api/clients";
import { carsApi } from "../../../api/cars";
import { createSession, sessionApi } from "../../../api/sessions";

const selectStyles = {
  container: (base) => ({ ...base, outline: "none" }),
  control: (base, state) => ({
    ...base,
    borderRadius: 12,
    minHeight: 55,
    height: 55,
    borderColor: state.isFocused ? "#dd2912" : "#eacccc",
    boxShadow: "none",
    outline: "none",
    paddingInline: 4,
    direction: "rtl",
    "&:hover": {
      borderColor: state.isFocused ? "#dd2912" : "#eacccc",
    },
  }),
  valueContainer: (base) => ({ ...base, height: 55, padding: "0 8px" }),
  input: (base) => ({ ...base, margin: 0, padding: 0 }),
  indicatorsContainer: (base) => ({ ...base, height: 55 }),
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

const AddVisitForm = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const workshopId = localStorage.getItem("workshopId");
  const lang = "ar";

  const [serviceTypes, setServiceTypes] = useState([]);
  const [oilTypes, setOilTypes] = useState([]);
  const [clients, setClients] = useState([]);
  const [cars, setCars] = useState([]);

  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingOils, setLoadingOils] = useState(false);
  const [loadingClients, setLoadingClients] = useState(false);
  const [loadingCars, setLoadingCars] = useState(false);

  const [servicesErr, setServicesErr] = useState("");
  const [oilsErr, setOilsErr] = useState("");
  const [clientsErr, setClientsErr] = useState("");
  const [carsErr, setCarsErr] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const oilChanged = watch("oilChanged");
  const selectedClient = watch("client");

  useEffect(() => {
    let alive = true;

    const loadAll = async () => {
      if (!workshopId) return;

      try {
        setLoadingClients(true);
        setClientsErr("");
        const list = await clientsApi.getUsersForWorkshop({ lang });
        if (!alive) return;
        setClients(list || []);
      } catch (e) {
        if (!alive) return;
        setClients([]);
        setClientsErr(clientsApi.getErrorMessage(e));
      } finally {
        if (alive) setLoadingClients(false);
      }

      try {
        setLoadingServices(true);
        setServicesErr("");
        const list = await serviceTypeApi.getAllByWorkshopId({
          workshopId,
          lang,
        });
        if (!alive) return;
        setServiceTypes(list || []);
      } catch (e) {
        if (!alive) return;
        setServiceTypes([]);
        setServicesErr(serviceTypeApi.getErrorMessage(e));
      } finally {
        if (alive) setLoadingServices(false);
      }

      try {
        setLoadingOils(true);
        setOilsErr("");
        const list = await oilTypeApi.getAllByWorkshop({ workshopId, lang });
        if (!alive) return;
        setOilTypes(list || []);
      } catch (e) {
        if (!alive) return;
        setOilTypes([]);
        setOilsErr(oilTypeApi.getErrorMessage(e));
      } finally {
        if (alive) setLoadingOils(false);
      }
    };

    loadAll();
    return () => {
      alive = false;
    };
  }, [workshopId]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setCarsErr("");
        setCars([]);
        setValue("car", null);

        const userId = selectedClient?.value;
        if (!userId) return;

        setLoadingCars(true);
        const list = await carsApi.getAllCarsForUser({ userId, lang });
        if (!alive) return;
        setCars(list || []);
      } catch (e) {
        if (!alive) return;
        setCars([]);
        setCarsErr(carsApi.getErrorMessage(e));
      } finally {
        if (alive) setLoadingCars(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [selectedClient?.value, setValue]);

  const clientOptions = useMemo(
    () =>
      (clients || []).map((u) => ({
        value: u.id,
        label: `${u.name ?? "بدون اسم"}${u.phone ? ` - ${u.phone}` : ""}`,
        raw: u,
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

  const serviceOptions = useMemo(
    () =>
      (serviceTypes || []).map((s) => ({
        value: s.name,
        label: s.name,
        raw: s,
      })),
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

  const onSubmit = async (data) => {
    setSubmitError("");

    if (!workshopId) return setSubmitError("لا يوجد workshopId");

    const customerId = data.client?.value;
    const carId = Number(data.car?.value || 0);

    if (!customerId) return setSubmitError("اختر العميل");
    if (!carId) return setSubmitError("اختر السيارة");

    const services = (data.services || []).map((x) => x.value);
    if (!services.length) return setSubmitError("اختر خدمة واحدة على الأقل");

    const isOil = data.oilChanged === "yes";
    const oilId = isOil ? Number(data.oilType?.value || 0) : 0;
    if (isOil && !oilId) return setSubmitError("اختر نوع الزيت");

    const payload = {
      kmReading: isOil ? Number(data.kmAtChange || 0) : 0,
      numberOfKilometers: isOil ? Number(data.kmAtChange || 0) : 0,
      filterChanged: false,
      oilChanged: isOil,
      oilId: isOil ? oilId : 0,
      additionalServices: services,
      nextChange: isOil ? Number(data.nextRecommendedKm || 0) : 0,
      description: data.description || "",
      cost: Number(data.price || 0),
      carId,
      customerId,
    };

    try {
      setSubmitting(true);
      await createSession({ lang, payload });
      setShowAlert(true);
      reset();
    } catch (e) {
      setSubmitError(sessionApi.getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="formContainer">
      <AlertModal
        show={showAlert}
        title="تم بنجاح"
        alertIcon="✅"
        confirmText="تم"
        showCancel={false}
        message="تم إضافة الزيارة بنجاح"
        onCancel={() => setShowAlert(false)}
        onConfirm={() => setShowAlert(false)}
      />

      <p className="formTitle">إضافة زيارة جديدة</p>

      {!!submitError && (
        <p style={{ color: "crimson", padding: "0 4px 12px" }}>{submitError}</p>
      )}

      <form
        id="addVisitForm"
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

            {loadingClients && (
              <p style={{ padding: "6px 0" }}>جارِ تحميل العملاء...</p>
            )}
            {!!clientsErr && (
              <p style={{ padding: "6px 0", color: "crimson" }}>{clientsErr}</p>
            )}

            <Controller
              name="client"
              control={control}
              rules={{ required: "اختر العميل" }}
              render={({ field }) => (
                <Select
                  {...field}
                  styles={selectStyles}
                  options={clientOptions}
                  placeholder={
                    clientOptions.length ? "اختر العميل" : "لا يوجد عملاء"
                  }
                  isDisabled={loadingClients || !!clientsErr}
                  onChange={(opt) => field.onChange(opt)}
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

            {loadingServices && (
              <p style={{ padding: "6px 0" }}>جارِ تحميل الخدمات...</p>
            )}
            {!!servicesErr && (
              <p style={{ padding: "6px 0", color: "crimson" }}>
                {servicesErr}
              </p>
            )}

            <Controller
              name="services"
              control={control}
              rules={{
                validate: (v) =>
                  (Array.isArray(v) && v.length > 0) ||
                  "اختر خدمة واحدة على الأقل",
              }}
              render={({ field }) => (
                <Select
                  {...field}
                  styles={selectStyles}
                  options={serviceOptions}
                  isMulti
                  closeMenuOnSelect={false}
                  placeholder={
                    serviceOptions.length ? "اختر الخدمات" : "لا توجد خدمات"
                  }
                  isDisabled={loadingServices || !!servicesErr}
                  onChange={(opts) => field.onChange(opts || [])}
                />
              )}
            />
            <p className="errorMessage">{errors.services?.message}</p>
          </div>

          <div className="inputGroup">
            <label>السعر
              <span className="req">
                <FaStar />
              </span>
            </label>
            <input
              type="number"
              placeholder="السعر"
              {...register("price", {
                required: "هذا الحقل مطلوب",
                pattern: { value: /^[0-9]+$/, message: "يسمح فقط بالأرقام" },
              })}
              className={errors.price ? "inputError" : ""}
            />
            <p className="errorMessage">{errors.price?.message || " "}</p>
          </div>

          {oilChanged === "yes" && (
            <div className="inputGroup">
              <label>
                نوع الزيت{" "}
                <span className="req">
                  <FaStar />
                </span>
              </label>

              {loadingOils && (
                <p style={{ padding: "6px 0" }}>جارِ تحميل الزيوت...</p>
              )}
              {!!oilsErr && (
                <p style={{ padding: "6px 0", color: "crimson" }}>{oilsErr}</p>
              )}

              <Controller
                name="oilType"
                control={control}
                rules={{
                  validate: (v) =>
                    watch("oilChanged") !== "yes" || !!v || "اختر نوع الزيت",
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    styles={selectStyles}
                    options={oilOptions}
                    placeholder={
                      oilOptions.length ? "اختر نوع الزيت" : "لا توجد زيوت"
                    }
                    isDisabled={loadingOils || !!oilsErr}
                    onChange={(opt) => field.onChange(opt)}
                  />
                )}
              />
              <p className="errorMessage">{errors.oilType?.message}</p>
            </div>
          )}
          {oilChanged === "yes" && (

            <div className="inputGroup">
              <label>
                الكيلومترات الموصى بها للتغيير القادم{" "}
                <span className="req">
                  <FaStar />
                </span>
              </label>
              <input
                type="number"
                {...register("nextRecommendedKm", {
                  required: "هذا الحقل مطلوب",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "يسمح فقط بالأرقام",
                  },
                })}
                className={errors.nextRecommendedKm ? "inputError" : ""}
              />
              <p className="errorMessage">{errors.nextRecommendedKm?.message}</p>
            </div>

          )}

        </div>

        <div className="formCol col-12 col-md-6">
          <div className="inputGroup">
            <label>
              نوع السيارة{" "}
              <span className="req">
                <FaStar />
              </span>
            </label>

            {loadingCars && (
              <p style={{ padding: "6px 0" }}>جارِ تحميل السيارات...</p>
            )}
            {!!carsErr && (
              <p style={{ padding: "6px 0", color: "crimson" }}>{carsErr}</p>
            )}

            <Controller
              name="car"
              control={control}
              rules={{ required: "اختر السيارة" }}
              render={({ field }) => (
                <Select
                  {...field}
                  styles={selectStyles}
                  options={carOptions}
                  isDisabled={
                    !selectedClient?.value || loadingCars || !!carsErr
                  }
                  placeholder={
                    !selectedClient?.value
                      ? "اختر العميل أولاً"
                      : carOptions.length
                      ? "اختر السيارة"
                      : "لا توجد سيارات لهذا العميل"
                  }
                  onChange={(opt) => field.onChange(opt)}
                />
              )}
            />
            <p className="errorMessage">{errors.car?.message}</p>
          </div>
          <div className="inputGroup">
            <label>
              تاريخ الزيارة{" "}
              <span className="req">
                <FaStar />
              </span>
            </label>
            <input
              type="date"
              {...register("visitDate", { required: "هذا الحقل مطلوب" })}
              className={errors.visitDate ? "inputError" : ""}
            />
            <p className="errorMessage">{errors.visitDate?.message}</p>
          </div>
          <div className="inputGroup">
            <label>هل تم تغيير الزيت؟</label>
            <div className="radioOptions">
              <div className="radioItem">
                <input
                  type="radio"
                  value="yes"
                  {...register("oilChanged", { required: "اختر إجابة" })}
                />
                <p>نعم</p>
              </div>
              <div className="radioItem">
                <input
                  type="radio"
                  value="no"
                  {...register("oilChanged", { required: "اختر إجابة" })}
                />
                <p>لا</p>
              </div>
            </div>
            <p className="errorMessage">{errors.oilChanged?.message || ""}</p>
          </div>

          {oilChanged === "yes" && (
            <>
              <div className="inputGroup">
                <label>
                  عدد الكيلومترات عند التغيير{" "}
                  <span className="req">
                    <FaStar />
                  </span>
                </label>
                <input
                  type="number"
                  {...register("kmAtChange", {
                    required: "هذا الحقل مطلوب",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "يسمح فقط بالأرقام",
                    },
                  })}
                  className={errors.kmAtChange ? "inputError" : ""}
                />
                <p className="errorMessage">{errors.kmAtChange?.message}</p>
              </div>
              <div className="inputGroup">
                <label>ملاحظات</label>
                <input
                  type="text"
                  placeholder="ملاحظات"
                  {...register("description")}
                />
              </div>
            </>
          )}

        </div>
      </form>

      <button
        type="submit"
        form="addVisitForm"
        className="submitBtn"
        disabled={submitting}
      >
        {submitting ? "جارٍ الإضافة..." : "إضافة"}
      </button>
    </div>
  );
};

export default AddVisitForm;
