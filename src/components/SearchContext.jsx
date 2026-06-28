"use client";

import { createContext, useContext, useState, useMemo } from "react";

const SearchContext = createContext();

export function SearchProvider({ children, products: initialProducts = [] }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSearch = () => {
    setIsSearchOpen((prev) => {
      if (!prev) setSearchQuery("");
      return !prev;
    });
  };

  const products = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return initialProducts;
    return initialProducts.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q),
    );
  }, [searchQuery, initialProducts]);

  return (
    <SearchContext.Provider
      value={{ isSearchOpen, toggleSearch, searchQuery, setSearchQuery, products }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useSearch must be used within a SearchProvider");
  return context;
};
