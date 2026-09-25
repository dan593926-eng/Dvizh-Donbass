import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { applyPerfClass } from "./lib/performance";
import "./styles/globals.css";

applyPerfClass();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
