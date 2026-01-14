import api from "./api";

export const sessionApi = {
  getErrorMessage: (err) =>
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    "حدث خطأ غير متوقع",
};

const normalizeSessions = (payload) => {
  const list =
    payload?.message ??
    payload?.data ??
    payload?.result ??
    payload?.items ??
    payload;

  return Array.isArray(list) ? list : [];
};

export const getSessionsForWorkshop = async ({ workshopId, lang = "ar" }) => {
  const res = await api.get("/api/Session/GetSessionsforWorkshop", {
    params: { WorkshopId: workshopId, lang, _t: Date.now() },
    headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
  });
  return normalizeSessions(res.data);
};

export const createSession = async ({ lang = "ar", payload }) => {
  const res = await api.post("/api/Session/CreateSession", payload, {
    params: { lang },
  });
  return res.data;
};

export const updateSession = async ({ lang = "ar", sessionId, payload }) => {
  const res = await api.patch("/api/Session/updateSession", payload, {
    params: { SessionId: sessionId, sessionId, lang },
  });
  return res.data;
};

export const deleteSession = async ({ lang = "ar", sessionId }) => {
  if (!sessionId) throw new Error("sessionId غير موجود");

  const res = await api.delete("/api/Session/DeleteSession", {
    params: { lang, SessionId: sessionId },
  });

  if (res.data?.success === false) {
    throw new Error(res.data?.message || "فشل حذف الزيارة");
  }

  return res.data;
};
