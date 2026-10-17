import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { NarrationProvider } from "./hooks/useNarration";
import "./styles/birthday.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NarrationProvider>
      <App />
    </NarrationProvider>
  </StrictMode>,
);
