// src/app/init.js

import { watchAuth } from "../firebase/auth.js";
import { getTruvyUser } from "../firebase/firestore.js";
import { setRoute } from "./router.js";
import { renderLogin } from "../modules/login/login.js";
import { renderDashboardClient } from "../modules/dashboard/dashboard_client.js";
import { renderDashboardPro } from "../modules/dashboard/dashboard_pro.js";

function getPageMode() {
  const el = document.querySelector("#app");
  return el?.dataset?.page || "auto";
}

function goLogin(root, error) {
  setRoute("login");
  if (error) renderLogin(root, { error });
  else renderLogin(root);
}

export function initApp() {
  const root = document.querySelector("#app");
  if (!root) throw new Error("#app not found");

  // On écoute l'état d'authentification Firebase
  watchAuth(async (user) => {
    const mode = getPageMode();

    // 🔒 Pas connecté → page login
    if (!user) {
      goLogin(root);
      return;
    }

    // 🔎 Récupération du document Firestore (avec gestion d'erreur)
    let truvyUser = null
try {
  truvyUser = await getTruvyUser(user.uid)
} catch (e) {
  setRoute('login')
  renderLogin(root, {
    error: `Erreur Firestore (${e?.code || "unknown"}). Ouvre la console.`,
  })
  return
}

    if (!truvyUser) {
      goLogin(root, "Profil introuvable (truvy_users).");
      return;
    }

    const role = truvyUser.role;

    if (mode === "client" && role !== "client") {
      goLogin(root, "Accès réservé aux clients.");
      return;
    }

    if (mode === "pro" && role !== "pro") {
      goLogin(root, "Accès réservé aux professionnels.");
      return;
    }

    const compteValide = truvyUser.compte_valide === true;
    if (!compteValide) {
      goLogin(root, "Compte non validé. Contacte TRUVY pour activer ton accès.");
      return;
    }

    // 🧭 Routing selon rôle
    if (role === "pro") {
      setRoute("pro");
      renderDashboardPro(root, { user, truvyUser });
      return;
    }

    if (role === "client") {
      setRoute("client");
      renderDashboardClient(root, { user, truvyUser });
      return;
    }

    // Sécurité fallback
    goLogin(root);
  });
}