import api from "./api";

const getErrorMessage = (err) =>
  err?.response?.data?.message ||
  err?.response?.data?.error ||
  err?.message ||
  "حدث خطأ غير متوقع";

const normalizeCars = (payload) => {
  const list = payload?.data ?? payload?.message ?? payload?.result ?? payload;
  if (!Array.isArray(list)) return [];

  return list.map((c) => ({
    id: c.id ?? c.carId ?? c.CarId ?? c._id,
    carModel: c.carModel ?? c.model ?? "",
    make: c.make ?? "",
    year: c.year ?? "",
    plateNumber: c.plateNumber ?? c.plate ?? "",
    currentKm: c.currentKm ?? c.kmReading ?? c.km ?? "",
    oilType: c.oilType ?? "",
    nextChange: c.nextChange ?? c.nextchange ?? "",
    lastChange: c.lastChange ?? "",
    customerId:
      c.customerId ??
      c.customerID ??
      c.userId ??
      c.UserId ??
      c.customerId ??
      null,
    raw: c,
  }));
};
export const carsApi = {
  getErrorMessage,

  async getAllCarsForUser({ userId, lang = "ar" }) {
    if (!userId) return [];
    const res = await api.get("/api/Car/GetAllCarsForUser", {
      params: { UserId: userId, lang, _t: Date.now() },
      headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
    });
    return normalizeCars(res.data);
  },

  // here
  async createCar(payload, { lang = "ar" } = {}) {
    const res = await api.post("/api/Car/CrateCar", payload, {
      params: { lang },
    });
    return res.data;
  },
};
