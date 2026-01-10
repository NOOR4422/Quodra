import api from "./api";

export const getErrorMessage = (err) =>
  err?.response?.data?.message ||
  err?.response?.data?.error ||
  err?.message ||
  "حدث خطأ غير متوقع";

const normalizeList = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;

  const x =
    payload?.data ??
    payload?.result ??
    payload?.items ??
    payload?.notifications ??
    payload;

  if (Array.isArray(x)) return x;

  const nested = x?.items ?? x?.data ?? x?.result ?? x?.notifications;
  return Array.isArray(nested) ? nested : [];
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const createNotification = async ({
  message,
  type,
  rank,
  customerId,
  lang = "ar",
}) => {
  const body = {
    message,
    type,
  };

  if (rank !== undefined && rank !== null) {
    body.rank = rank;
    body.rankId = rank;
  }

  if (customerId) {
    body.customerId = customerId;
  }

  const res = await api.post("/api/Notification/CreateNotification", body, {
    params: { lang },
  });

  if (res?.data?.success === false) {
    throw new Error(res?.data?.message || "فشل إنشاء الإشعار");
  }

  return res.data;
};


export const getAllNotifications = async ({ workshopId, lang = "ar" }) => {
  if (!workshopId) return [];

  const res = await api.get("/api/Notification/GetAllNotificationsByWorkshop", {
    params: {
      customerId: workshopId,
      lang,
      _t: Date.now(), 
    },
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });

  if (res?.data?.success === true) {
    return normalizeList(res.data.data ?? res.data);
  }
  return normalizeList(res.data);
};


export const createNotificationAndRefresh = async ({
  message,
  type,
  rank,
  customerId,
  workshopId,
  lang = "ar",
}) => {
  await createNotification({ message, type, rank, customerId, lang });

  if (!workshopId) return [];

  for (let i = 0; i < 8; i++) {
    const list = await getAllNotifications({ workshopId, lang });
    const found = list.some((x) => (x.message ?? "") === message);
    if (found) return list;
    await sleep(250);
  }

  return await getAllNotifications({ workshopId, lang });
};
