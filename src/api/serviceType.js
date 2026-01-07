import api from "./api";

const getErrorMessage = (err) =>
  err?.response?.data?.message ||
  err?.response?.data?.error ||
  err?.message ||
  "حدث خطأ غير متوقع";

const pickArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.result)) return payload.result;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.message)) return payload.message;
  return [];
};

const normalizeList = (payload) => {
  const list = pickArray(payload);

  return list.map((x) => ({
    id: x.serviceTypeId ?? x.id ?? x._id,
    name: x.name ?? x.serviceName ?? x.title ?? "",
    raw: x,
  }));
};

const serviceTypeApi = {
  getErrorMessage,

  async getAllByWorkshopId({ workshopId, lang = "ar" }) {
    const res = await api.get("/api/ServiceType/GetAllByWorkshopId", {
      params: { workshopId, lang },
    });

    const payload = res?.data?.data ?? res?.data;
    return normalizeList(payload);
  },

  async create({ name, workshopId, lang = "ar" }) {
    const res = await api.post(
      "/api/ServiceType/Create",
      { name, ...(workshopId ? { workshopId } : {}) },
      { params: { lang } }
    );

    if (res.data?.success === false) throw new Error(res.data?.message);
    return res.data;
  },

  async update({ id, name, lang = "ar" }) {
    if (!id) throw new Error("serviceTypeId غير موجود");
    const res = await api.put(
      "/api/ServiceType/Update",
      { name },
      { params: { serviceTypeId: id, lang } }
    );

    if (res.data?.success === false) throw new Error(res.data?.message);
    return res.data;
  },

  async remove({ id, lang = "ar" }) {
    if (!id) throw new Error("serviceTypeId غير موجود");
    const res = await api.delete("/api/ServiceType/Delete", {
      params: { serviceTypeId: id, lang },
    });

    if (res.data?.success === false) throw new Error(res.data?.message);
    return res.data;
  },
};

export default serviceTypeApi;
