import { createContext, useContext, useState } from "react";

const context = createContext();

export const useSport = () => useContext(context);

export const SportsProvider = ({children}) => {
  const [sport, setsport] = useState("cricket");

  return(
    <context.Provider value={{sport,setsport}}>
      {children}
    </context.Provider>
  );
};