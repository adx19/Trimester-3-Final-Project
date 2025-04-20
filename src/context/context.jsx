import { createContext, useContext, useState } from "react";

// Search Context
const SearchContext = createContext();
export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const [search, setSearch] = useState("");

  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

// MatchId Context
const MatchIdContext = createContext();

export const getMatchId = () => useContext(MatchIdContext);

export const IdProvider = ({ children }) => {
  const [id, setId] = useState(null);

  const getId = (newId) => {
    setId(newId);
  };

  return (
    <MatchIdContext.Provider value={{ id, getId }}>
      {children}
    </MatchIdContext.Provider>
  );
};
