import axios from "axios";

const BASE_URL = "https://qudrasaas.runasp.net";

const decodeJwtPayload = (token) => {
  try {
    const payloadPart = token.split(".")[1];
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );
    return JSON.parse(atob(padded));
  } catch (e) {
    console.log("decodeJwtPayload failed:", e);
    return null;
  }
};

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const loginWorkshop = async ({ phone, code, password }) => {
  localStorage.removeItem("token");
  localStorage.removeItem("workshopId");

  const res = await api.post("/api/User/LoginWorkshop", {
    phone,
    code,
    password,
  });

  const token = res?.data?.token;
  if (!token) throw new Error("Token missing from login response");

  localStorage.setItem("token", token);

  const payload = decodeJwtPayload(token);

  const workshopId =
    payload?.workshopId ||
    payload?.WorkshopId ||
    payload?.[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ] ||
    null;

  if (!workshopId) throw new Error("workshopId not found in token payload");

  localStorage.setItem("workshopId", String(workshopId));

  return res.data;
};

export const changePassword = async ({
  currentPassword,
  newPassword,
  confirmNewPassword,
}) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await api.patch(
    "/api/Auth/change-password",
    { currentPassword, newPassword, confirmNewPassword },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const resetPassword = async ({
  phone,
  code,
  newPassword,
  confirmNewPassword,
}) => {
  const res = await api.post("/api/Auth/ResetPassword", {
    phone,
    code,
    newPassword,
    confirmNewPassword,
  });

  return res.data;
};
