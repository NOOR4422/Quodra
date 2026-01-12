import React, { createContext, useContext, useEffect, useState } from "react";
import searchApi from "../api/search";

const SearchContext = createContext(null);

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [skipNavigateOnce, setSkipNavigateOnce] = useState(false);

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setSearchError("");
    setSkipNavigateOnce(false);
  };

  useEffect(() => {
    let cancelled = false;
    const q = searchTerm.trim();

    if (!q) {
      setSearchResults([]);
      setSearchError("");
      setSearchLoading(false);
      return;
    }

    (async () => {
      try {
        setSearchLoading(true);
        setSearchError("");
        const res = await searchApi.searchClientsByName(q, "ar");
        if (!cancelled) {
          setSearchResults(res);
        }
      } catch (err) {
        if (!cancelled) {
          setSearchError(
            err?.response?.data?.message || err?.message || "فشل البحث"
          );
          setSearchResults([]);
        }
      } finally {
        if (!cancelled) setSearchLoading(false);
      }
    })();

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
        skipNavigateOnce,
        setSkipNavigateOnce,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
