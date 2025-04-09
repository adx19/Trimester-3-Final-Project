import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { SportsProvider, SearchProvider } from "./context/context";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SportsProvider>
      <SearchProvider>
        <App />
      </SearchProvider>
    </SportsProvider>
  </React.StrictMode>
);
