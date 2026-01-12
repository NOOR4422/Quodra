// src/api/search.js
import api from "./api";

// Call /api/User/SearchBar and normalize result
export async function searchClientsByName(name, lang = "ar") {
  const res = await api.get("/api/User/SearchBar", {
    params: { name },
  });

  const raw = res.data;
  const list = Array.isArray(raw) ? raw : raw?.data || raw?.message || [];

  return (list || []).map((u) => ({
    id: u.id || u.userId || u._id,
    name: u.name || "بدون اسم",
    phone: u.phone || u.phoneNumber || "-",
    whatsapp: u.whats || u.whatsapp || "-",
    visits: u.numberOfVisits ?? u.visits ?? 0,
    rank: u.rank ?? 0,
  }));
}

const searchApi = { searchClientsByName };
export default searchApi;
