import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("[FORGIA] main.tsx loading...");

try {
  const root = document.getElementById("root");
  if (!root) {
    console.error("[FORGIA] #root element not found!");
  } else {
    console.log("[FORGIA] mounting React to #root");
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("[FORGIA] React mounted");
  }
} catch (err: any) {
  console.error("[FORGIA] CRASH during mount:", err);
  const root = document.getElementById("root");
  if (root) {
    root.innerHTML = `<div style="padding:20px;color:#ff6b6b;font-family:monospace"><h2>Mount Error</h2><pre>${err.stack || err.message}</pre></div>`;
  }
}
