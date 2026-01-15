import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import "./index.css";
import App from "./App.tsx";

// Domain Protection - Allow game hosting and testing domains
const allowedDomains = [
  'crazygames.com',      // CrazyGames production
  'crazygames.net',      // CrazyGames staging
  '1001juegos.com',      // CrazyGames partner
  '1001games.com',       // CrazyGames partner
  'firebaseapp.com',     // Firebase hosting
  'web.app',             // Firebase web.app hosting
  'localhost',           // Local development
  '127.0.0.1'            // Local development IP
];

const isAllowedDomain = allowedDomains.some(domain =>
  window.location.hostname.includes(domain)
);

if (!isAllowedDomain) {
  document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:Arial;font-size:24px;color:#fff;background:#1a1a2e;">This game is only available on authorized platforms.</div>';
  throw new Error("Unauthorized domain");
}

const firebaseConfig = {
  apiKey: "AIzaSyCPIXT9eN_wrIyFhrA9eODQsbxTxObm0xE",
  authDomain: "nebula-maze.firebaseapp.com",
  projectId: "nebula-maze",
  storageBucket: "nebula-maze.firebasestorage.app",
  messagingSenderId: "489783786014",
  appId: "1:489783786014:web:f77ea2ccc0b9679392cc0f",
  measurementId: "G-8E14M82719"
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);

// CrazyGames: Fix common browser UX issues
// Disable unwanted page scroll
window.addEventListener("wheel", (event) => event.preventDefault(), { passive: false });

// Disable unwanted key events and spacebar scrolling
window.addEventListener("keydown", (event) => {
  if (["ArrowUp", "ArrowDown", " "].includes(event.key)) {
    event.preventDefault();
  }
});

// Disable context menu
document.addEventListener("contextmenu", (event) => event.preventDefault());

// Handle visibility changes (Samsung App fix)
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    console.log("Game paused (hidden)");
  } else if (document.visibilityState === "visible") {
    console.log("Game resumed (visible)");
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
