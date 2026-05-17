import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import "./global-styles/tokens.css";
import "./global-styles/base.css";
import "./global-styles/utils.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
