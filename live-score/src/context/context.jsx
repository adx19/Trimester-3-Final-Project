import { createContext, useContext, useState } from "react";

const Context = createContext();

export const useStatus = () => useContext(Context);

export const SportsProvider = ({ children }) => {
  const [status, setStatus] = useState("live");

  return (
    <Context.Provider value={{ status, setStatus }}>
      {children}
    </Context.Provider>
  );
};
