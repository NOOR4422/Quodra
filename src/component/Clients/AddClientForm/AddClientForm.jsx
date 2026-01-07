import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import "./addClientForm.css";
import { FaStar } from "react-icons/fa";
import AlertModal from "../../Modals/AlertModal/AlertModal";
import { addClient } from "../../../api/clients";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

import oilTypeApi from "../../../api/oilType";

const selectStyles = {
  container: (base) => ({ ...base, outline: "none" }),
  control: (base, state) => ({
    ...base,
    borderRadius: 12,
    borderColor: state.isFocused ? "#dd2912" : "#eacccc",
    boxShadow: "none",
    outline: "none",
    height: 55,
    paddingInline: 4,
    direction: "rtl",
    "&:hover": { borderColor: state.isFocused ? "#dd2912" : "#eacccc" },
  }),
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

const AddClientForm = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [oilTypes, setOilTypes] = useState([]);
  const [oilLoading, setOilLoading] = useState(true);
  const [oilError, setOilError] = useState("");

  const navigate = useNavigate();
  const workshopId = localStorage.getItem("workshopId");
  const lang = "ar";

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: { oilType: null },
  });

  const oilOptions = useMemo(() => {
    return (oilTypes || []).map((o) => ({
      value: o.id ?? o.oliTypeId ?? o.oilId, 
      label: `${o.oiltybe} - ${o.km} KM`,
      raw: o,
    }));
  }, [oilTypes]);

  useEffect(() => {
    let alive = true;

    const loadOilTypes = async () => {
      setOilLoading(true);
      setOilError("");

      try {
        if (!workshopId) {
          setOilTypes([]);
          setOilError("لا يمكن تحميل الزيوت بدون workshopId");
          return;
        }

        const list = await oilTypeApi.getAllByWorkshop({ workshopId, lang });
        if (!alive) return;

        setOilTypes(list || []);

        const current = watch("oilType");
        if (!current && list && list.length > 0) {
          const first = {
            value: list[0].id ?? list[0].oliTypeId ?? list[0].oilId,
            label: `${list[0].oiltybe} - ${list[0].km} KM`,
            raw: list[0],
          };
          setValue("oilType", first, { shouldDirty: false });
        }
      } catch (err) {
        if (!alive) return;
        setOilTypes([]);
        setOilError(oilTypeApi.getErrorMessage(err));
      } finally {
        if (alive) setOilLoading(false);
      }
    };

    loadOilTypes();

    return () => {
      alive = false;
    };
  }, [workshopId, lang, setValue]);

  const onSubmit = async (data) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setApiError("");

    try {
      const selectedOil = data.oilType?.raw;

      const payload = {
        name: data.name,
        phone: data.phone,
        whats: data.whatsapp,
        email: data.email || "",
        notes: data.notes || "",
        carModel: data.carType,
        make: data.make,
        year: Number(data.year),
        plateNumber: data.plateNumber,
        currentKm: Number(data.currentKm),

        oilType: selectedOil?.oiltybe || "",
      };

      if (!payload.oilType) {
        setApiError("لا يوجد نوع زيت محدد (تأكد أن الورشة لديها زيوت)");
        return;
      }

      const res = await addClient(payload);

      if (res?.success === false) {
        setApiError(res?.message || "فشل إضافة العميل");
        return;
      }

      setShowAlert(true);
      reset({ oilType: null }); 
    } catch (err) {
      setApiError(
        err?.response?.data?.message ||
          err?.message ||
          "حدث خطأ أثناء إضافة العميل"
      );
    } finally {
      setIsSubmitting(false);
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
        message="تم إضافة العميل بنجاح"
        onConfirm={() => {
          setShowAlert(false);
          navigate("/clients");
        }}
      />

      <h2 className="formTitle">إضافة عميل جديد</h2>

      {!!apiError && <p className="errorMessage">{apiError}</p>}

      <form
        id="mainForm"
        className="mainForm row"
        onSubmit={handleSubmit(onSubmit)}
        dir="rtl"
      >
        <div className="formCol col-12 col-md-6">
          <div className="inputGroup">
            <label>
              الاسم{" "}
              <span className="req">
                <FaStar />
              </span>
            </label>
            <input
              type="text"
              placeholder="الاسم"
              {...register("name", { required: "هذا الحقل مطلوب" })}
              className={errors.name ? "inputError" : ""}
            />
            <p className="errorMessage">{errors.name?.message}</p>
          </div>

          <div className="inputGroup">
            <label>
              واتساب{" "}
              <span className="req">
                <FaStar />
              </span>
            </label>
            <input
              type="text"
              placeholder="واتساب"
              {...register("whatsapp", { required: "هذا الحقل مطلوب" })}
              className={errors.whatsapp ? "inputError" : ""}
            />
            <p className="errorMessage">{errors.whatsapp?.message}</p>
          </div>

          <div className="inputGroup">
            <label>
              نوع السيارة{" "}
              <span className="req">
                <FaStar />
              </span>
            </label>
            <input
              type="text"
              placeholder="نوع السيارة"
              {...register("carType", { required: "هذا الحقل مطلوب" })}
              className={errors.carType ? "inputError" : ""}
            />
            <p className="errorMessage">{errors.carType?.message}</p>
          </div>

          <div className="inputGroup">
            <label>
              الماركة{" "}
              <span className="req">
                <FaStar />
              </span>
            </label>
            <input
              type="text"
              placeholder="الماركة"
              {...register("make", { required: "هذا الحقل مطلوب" })}
              className={errors.make ? "inputError" : ""}
            />
            <p className="errorMessage">{errors.make?.message}</p>
          </div>

          <div className="inputGroup">
            <label>
              سنة الصنع{" "}
              <span className="req">
                <FaStar />
              </span>
            </label>
            <input
              type="number"
              placeholder="سنة الصنع"
              {...register("year", { required: "هذا الحقل مطلوب" })}
              className={errors.year ? "inputError" : ""}
            />
            <p className="errorMessage">{errors.year?.message}</p>
          </div>

          <div className="inputGroup">
            <label>ملاحظات</label>
            <input type="text" placeholder="ملاحظات" {...register("notes")} />
          </div>
        </div>

        <div className="formCol col-12 col-md-6">
          <div className="inputGroup">
            <label>
              رقم الهاتف{" "}
              <span className="req">
                <FaStar />
              </span>
            </label>
            <input
              type="text"
              placeholder="رقم الهاتف"
              {...register("phone", { required: "هذا الحقل مطلوب" })}
              className={errors.phone ? "inputError" : ""}
            />
            <p className="errorMessage">{errors.phone?.message}</p>
          </div>

          <div className="inputGroup">
            <label>البريد الإلكتروني</label>
            <input
              type="text"
              placeholder="البريد الإلكتروني"
              {...register("email")}
            />
            <p className="errorMessage">{errors.email?.message || " "}</p>
          </div>

          <div className="inputGroup">
            <label>
              رقم اللوحة{" "}
              <span className="req">
                <FaStar />
              </span>
            </label>
            <input
              type="text"
              placeholder="رقم اللوحة"
              {...register("plateNumber", { required: "هذا الحقل مطلوب" })}
              className={errors.plateNumber ? "inputError" : ""}
            />
            <p className="errorMessage">{errors.plateNumber?.message}</p>
          </div>

          <div className="inputGroup">
            <label>
              العداد الحالي{" "}
              <span className="req">
                <FaStar />
              </span>
            </label>
            <input
              type="number"
              placeholder="العداد الحالي"
              {...register("currentKm", { required: "هذا الحقل مطلوب" })}
              className={errors.currentKm ? "inputError" : ""}
            />
            <p className="errorMessage">{errors.currentKm?.message}</p>
          </div>

          <div className="inputGroup">
            <label>
              نوع الزيت{" "}
              <span className="req">
                <FaStar />
              </span>
            </label>

            {oilLoading && (
              <p style={{ padding: "6px 0" }}>جارِ تحميل الزيوت...</p>
            )}
            {!!oilError && (
              <p style={{ padding: "6px 0", color: "crimson" }}>{oilError}</p>
            )}

            <Controller
              name="oilType"
              control={control}
              rules={{ required: "هذا الحقل مطلوب" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={oilOptions}
                  value={field.value}
                  onChange={(opt) => field.onChange(opt)}
                  isSearchable={false}
                  styles={selectStyles}
                  placeholder={
                    oilLoading ? "جارِ التحميل..." : "تم اختيار الزيت تلقائيا"
                  }
                  isDisabled={false}
                />
              )}
            />
            <p className="errorMessage">{errors.oilType?.message}</p>
          </div>
        </div>
      </form>

      <button
        type="submit"
        form="mainForm"
        className="submitBtn"
        disabled={isSubmitting}
        style={{ opacity: isSubmitting ? 0.7 : 1 }}
      >
        {isSubmitting ? "جاري الإضافة..." : "إضافة"}
      </button>
    </div>
  );
};

export default AddClientForm;
