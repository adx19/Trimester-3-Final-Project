import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import {
  SportsProvider,
  SearchProvider,
  IdProvider,
} from "./context/context";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SportsProvider>
      <SearchProvider>
          <IdProvider>
          <App /> 
          </IdProvider>
      </SearchProvider>
    </SportsProvider>
  </React.StrictMode>
);
