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

const MatchIdContext = createContext();

export const getMatchId = () => useContext(MatchIdContext);

export const IdProvider = ({children}) => {
  const [id, setId] = useState(null);

  const getId = (newId) => {
    setId(newId);
  };

  return (
    <MatchIdContext.Provider value={{ id, getId }}>
      {children}
    </MatchIdContext.Provider>
  );
}