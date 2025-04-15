import { createContext, useContext, useState } from "react";


const StatusContext = createContext();
export const useStatus = () => useContext(StatusContext);

export const SportsProvider = ({ children }) => {
  const [status, setStatus] = useState("live");
  return (
    <StatusContext.Provider value={{ status, setStatus }}>
      {children}
    </StatusContext.Provider>
  );
};

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
