import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { SearchProvider, IdProvider } from "./context/context";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <SearchProvider>
      <IdProvider>
        <App />
      </IdProvider>
    </SearchProvider>
  </BrowserRouter>
);
