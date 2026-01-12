import React, { createContext, useContext, useEffect, useState } from "react";
import searchApi from "../api/search";

const SearchContext = createContext(null);

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const q = searchTerm.trim();
      if (!q) {
        setSearchResults([]);
        setSearchError("");
        setSearchLoading(false);
        return;
      }

      try {
        setSearchLoading(true);
        setSearchError("");

        const data = await searchApi.searchClientsByName(q, "ar");
        if (cancelled) return;
        setSearchResults(data);
      } catch (err) {
        if (cancelled) return;
        console.error("SEARCH ERROR:", err);
        setSearchError(
          err?.response?.data?.message || err?.message || "فشل البحث"
        );
        setSearchResults([]);
      } finally {
        if (!cancelled) setSearchLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [searchTerm]);

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        searchResults,
        searchLoading,
        searchError,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
