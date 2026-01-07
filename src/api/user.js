import api from "./api";

const userApi = {
  async getWorkshop({ lang = "ar" } = {}) {
    const res = await api.get("/api/User/WorkshopPorfile", {
      params: { lang },
    });
    if (res?.data?.success) return res.data.message;
    return res?.data?.data ?? null;
  },

  getErrorMessage(err) {
    return (
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "حدث خطأ غير متوقع"
    );
  },
};

export default userApi;
