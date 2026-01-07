import api from "./api";

const getErrorMessage = (err) =>
  err?.response?.data?.message ||
  err?.response?.data?.error ||
  err?.message ||
  "حدث خطأ غير متوقع";

export async function createOffer({ message, rank }) {
  const res = await api.post("/api/Offers/CreateOffer", { message, rank });

  if (res.data?.success === false) {
    throw new Error(res.data?.message || "فشل إنشاء العرض");
  }

  return res.data;
}


export async function getOffersForWorkshop({ workshopId } = {}) {
  if (!workshopId) throw new Error("لا يمكن تحميل العروض بدون workshopId");

  const res = await api.get("/api/Offers/GetOffesForWorkshop", {
    params: { workshopId },
  });

  if (res.data?.success === false) {
    throw new Error(res.data?.message || "فشل تحميل العروض");
  }

  const list = Array.isArray(res.data?.message) ? res.data.message : [];
  return list;
}

export const offersApi = { getErrorMessage };
