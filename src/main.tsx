import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { applyPerfClass } from "./lib/performance";
import "./styles/globals.css";

/**
 * Каждое открытие и обновление страницы — «как в первый раз»:
 * 1. браузер не восстанавливает прежнюю позицию прокрутки;
 * 2. якорь в адресе (#gallery и т.п.) убирается, чтобы старт был с первого экрана;
 * 3. при возврате кнопкой «Назад» страница не берётся из кеша браузера (bfcache),
 *    а загружается заново — с интро и анимациями.
 */
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
if (location.hash) history.replaceState(null, "", location.pathname + location.search);
window.scrollTo({ top: 0, left: 0, behavior: "instant" });
window.addEventListener("pageshow", (event) => {
  if (event.persisted) location.reload();
});

applyPerfClass();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
