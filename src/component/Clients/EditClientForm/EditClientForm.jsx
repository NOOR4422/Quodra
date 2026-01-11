import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "./editClientForm.css";
import AlertModal from "../../Modals/AlertModal/AlertModal";
import CarModal from "../../Modals/CarModal/CarModal"; 
import { useNavigate, useParams } from "react-router-dom";
import { getUserById, updateUser } from "../../../api/clients";

const EditClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showCarModal, setShowCarModal] = useState(false); 
  const workshopId = localStorage.getItem("workshopId");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      name: "",
      phone: "",
      whatsapp: "",
      email: "",
    },
  });

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setApiError("");

        const res = await getUserById(id);

        if (!res?.success) {
          setApiError(res?.message || "فشل تحميل بيانات العميل");
          return;
        }

        const user = res?.message;
        if (!user) {
          setApiError("لا توجد بيانات لهذا العميل");
          return;
        }

        if (!mounted) return;

        reset({
          name: user.name || "",
          phone: user.phone || "",
          whatsapp: user.whats || "",
          email: user.email || "",
        });
      } catch (err) {
        setApiError(
          err?.response?.data?.message || err?.message || "Request failed"
        );
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id, reset]);

  const onSubmit = async (form) => {
    if (isSubmitting) return;

    if (!form.name?.trim()) return setApiError("الاسم مطلوب");
    if (!form.phone?.trim()) return setApiError("رقم الهاتف مطلوب");
    if (!form.whatsapp?.trim()) return setApiError("رقم الواتساب مطلوب");

    setIsSubmitting(true);
    setApiError("");

    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        whats: form.whatsapp.trim(),
        email: (form.email || "").trim(),
      };

      const res = await updateUser(id, payload);

      if (!res?.success) {
        setApiError(res?.message || "فشل تعديل بيانات العميل");
        return;
      }

      setShowSuccess(true);
    } catch (err) {
      setApiError(
        err?.response?.data?.message || err?.message || "حدث خطأ أثناء الحفظ"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="formContainer">
      <AlertModal
        show={showSuccess}
        title="تم بنجاح"
        alertIcon="✅"
        confirmText="تم"
        showCancel={false}
        message="تم تعديل بيانات العميل بنجاح"
        onConfirm={() => {
          setShowSuccess(false);
          navigate("/clients", { state: { refresh: Date.now() } });
        }}
      />

      <CarModal
        isOpen={showCarModal}
        onClose={() => setShowCarModal(false)}
        customerId={id}
        workshopId={workshopId} 
        onSave={() => {
          setShowCarModal(false);
        }}
      />

      <h2 className="formTitle">تعديل بيانات العميل</h2>

      {loading && <p style={{ padding: 12 }}>جاري تحميل البيانات...</p>}
      {!!apiError && <p className="errorMessage">{apiError}</p>}

      {!loading && (
        <>
          <form
            id="editForm"
            className="mainForm row"
            onSubmit={handleSubmit(onSubmit)}
            dir="rtl"
          >
            <div className="formCol col-12 col-md-6">
              <div className="inputGroup">
                <label>الاسم</label>
                <input
                  {...register("name", {
                    validate: (v) => v.trim() !== "" || "هذا الحقل مطلوب",
                  })}
                  className={errors.name ? "inputError" : ""}
                />
                <p className="errorMessage">{errors.name?.message}</p>
              </div>

              <div className="inputGroup">
                <label>واتساب</label>
                <input
                  {...register("whatsapp", {
                    validate: (v) => v.trim() !== "" || "هذا الحقل مطلوب",
                  })}
                  className={errors.whatsapp ? "inputError" : ""}
                />
                <p className="errorMessage">{errors.whatsapp?.message}</p>
              </div>
            </div>

            <div className="formCol col-12 col-md-6">
              <div className="inputGroup">
                <label>رقم الهاتف</label>
                <input
                  {...register("phone", {
                    validate: (v) => v.trim() !== "" || "هذا الحقل مطلوب",
                  })}
                  className={errors.phone ? "inputError" : ""}
                />
                <p className="errorMessage">{errors.phone?.message}</p>
              </div>

              <div className="inputGroup">
                <label>البريد الإلكتروني </label>
                <input
                  type="email"
                  {...register("email", {
                    validate: (v) => {
                      if (v?.trim() === "") return true;
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      return (
                        emailRegex.test(v) || "يرجى إدخال بريد إلكتروني صالح"
                      );
                    },
                  })}
                />
                <p className="errorMessage">{errors.email?.message}</p>
              </div>
            </div>

            <button
              type="button"
              className="addCarBtn"
              style={{ marginBottom: 16, maxWidth: 200 }}
              onClick={() => setShowCarModal(true)}
            >
              + إضافة سيارة للعميل
            </button>
          </form>

          <button
            type="submit"
            form="editForm"
            className="submitBtn"
            disabled={isSubmitting}
            style={{ opacity: isSubmitting ? 0.7 : 1 }}
          >
            {isSubmitting ? "جاري الحفظ..." : "حفظ"}
          </button>
        </>
      )}
    </div>
  );
};

export default EditClientForm;
