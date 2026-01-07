import api from "./api";

const oilTypeApi = {
  async getAllByWorkshop({ workshopId, lang = "ar" }) {
    const res = await api.get("/api/OliType/GetallbyWorkshop", {
      params: { workshopId, lang },
    });

    if (res?.data?.success) return res.data.data || [];
    return res?.data?.data || [];
  },

  async create({ oiltybe, km, workshopId, lang = "ar" }) {
    const body = { oiltybe, km, workshopId };
    const res = await api.post("/api/OliType/Create", body, {
      params: { lang },
    });
    return res.data;
  },

  async remove({ id, lang = "ar" }) {
    const res = await api.delete("/api/OliType/Delete", {
      params: { id, lang },
    });
    return res.data;
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

export default oilTypeApi;
