import api from "./api";

export const getErrorMessage = (err) => {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    "حدث خطأ غير متوقع"
  );
};

const pickArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.message)) return payload.message;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.result)) return payload.result;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

const normalizeUsers = (payload) => {
  const list = pickArray(payload);

  return list.map((u) => ({
    id: u.id ?? u.userId ?? u.UserId ?? u.userID ?? u.UserID ?? u._id ?? null,
    name: u.name ?? u.userName ?? u.userNameAr ?? u.fullName ?? "",
    phone: u.phone ?? u.phoneNumber ?? "",
    whats: u.whats ?? u.whatsapp ?? "",
    raw: u,
  }));
};

const normalizeTransferRequests = (payload) => {
  const list = pickArray(payload);

  return list.map((x) => ({
    id: x.id ?? x.requestId ?? x.RequestId ?? x._id,
    userName: x.userName ?? x.customerName ?? "",
    phoneNumber: x.phoneNumber ?? x.phone ?? "",
    date: x.date ?? "",
    reason: x.resion ?? x.reason ?? "",
    state: x.state,
    userId: x.userId ?? x.customerId ?? null,
    raw: x,
  }));
};

export async function getAllUsers({ lang = "ar" } = {}) {
  const res = await api.get("/api/User/GetUsersForWorkshop", {
    params: { lang },
  });

  if (res?.data?.success) return normalizeUsers(res.data);
  return normalizeUsers(res?.data);
}

export async function getUsersForWorkshop({ lang = "ar" } = {}) {
  return getAllUsers({ lang });
}

export async function addClient(payload, { lang = "ar" } = {}) {
  const res = await api.post("/api/User/AddUser", payload, {
    params: { lang },
  });
  return res.data;
}

export async function getUserById(userId, { lang = "ar" } = {}) {
  const res = await api.get("/api/User/GetUserById", {
    params: { UserId: userId, lang },
  });
  return res.data;
}

export async function updateUser(userId, payload, { lang = "ar" } = {}) {
  const res = await api.patch("/api/User/UpdateUser", payload, {
    params: { UserId: userId, lang },
  });
  return res.data;
}

export async function deleteUser(userId, lang = "ar") {
  const res = await api.delete("/api/User/DeleteUser", {
    params: { lang, UserId: userId },
  });
  return res.data;
}

export const clientsApi = {
  getAllUsers,
  getUsersForWorkshop, 
  addClient,
  getUserById,
  updateUser,
  deleteUser,
  getErrorMessage,
};


export const transferRequestsApi = {
  getErrorMessage: (err) => {
    return (
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "حدث خطأ غير متوقع"
    );
  },

  async getAll({ lang = "ar" } = {}) {
 
    try {
      const res = await api.get("/api/TransferRequest/GetAllRequuest", {
        params: { lang, _t: Date.now() },
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      });

      const list = Array.isArray(res?.data?.data) ? res.data.data : [];
      return list;
    } catch (e) {
      const res = await api.get("/api/TransferRequest/GetAllRequest", {
        params: { lang, _t: Date.now() },
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      });

      const list = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data?.message)
        ? res.data.message
        : Array.isArray(res?.data)
        ? res.data
        : [];

      return list;
    }
  },

  async setState({ RequestId, state, lang = "ar" }) {
    if (RequestId == null || RequestId === "") {
      throw new Error("RequestId is missing");
    }

    const res = await api.post(
      "/api/TransferRequest/TransferRequestState",
      {},
      {
        params: {
          lang,
          RequestId: Number(RequestId),
          state: state === true,
          _t: Date.now(),
        },
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      }
    );

    return res.data;
  },

  async accept({ RequestId, lang = "ar" }) {
    return this.setState({ RequestId, state: true, lang });
  },

  async reject({ RequestId, lang = "ar" }) {
    return this.setState({ RequestId, state: false, lang });
  },
};


export default clientsApi;
