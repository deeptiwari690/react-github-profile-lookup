import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { App } from "./App";
import "./global-styles/tokens.css";
import "./global-styles/base.css";
import "./global-styles/utils.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
