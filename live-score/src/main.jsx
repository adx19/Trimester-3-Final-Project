import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { SportsProvider } from "./context/context"; // update path as needed

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SportsProvider>
      <App />
    </SportsProvider>
  </React.StrictMode>
);
