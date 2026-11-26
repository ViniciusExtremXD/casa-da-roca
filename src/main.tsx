import React from "react";
import ReactDOM from "react-dom/client";
// Gloock (títulos) e Schibsted Grotesk (texto), servidas junto com o site.
import "@fontsource/gloock/latin-400.css";
import "@fontsource/gloock/latin-ext-400.css";
import "@fontsource-variable/schibsted-grotesk/wght.css";
import "./styles.css";
import App from "./App";
import { captureAttribution } from "./lib/attribution";

captureAttribution();

const root = document.getElementById("root")!;
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// O HTML de produção vem pré-renderizado (scripts/prerender.mjs); em dev o root começa vazio.
if (root.hasChildNodes()) ReactDOM.hydrateRoot(root, app);
else ReactDOM.createRoot(root).render(app);
