import { watchAuth } from '../firebase/auth'
import { getTruvyUser } from '../firebase/firestore'
import { setRoute } from './router'
import { renderLogin } from '../modules/login/login'
import { renderDashboardClient } from '../modules/dashboard/dashboard_client'
import { renderDashboardPro } from '../modules/dashboard/dashboard_pro'

function getPageMode() {
  const el = document.querySelector('#app')
  return el?.dataset?.page || 'auto'
}

export function initApp() {
  const root = document.querySelector('#app')
  if (!root) throw new Error('#app not found')

  // On écoute l'état d'authentification Firebase
  watchAuth(async (user) => {
    const mode = getPageMode()

    // 🔒 Pas connecté → page login
    if (!user) {
      setRoute('login')
      renderLogin(root)
      return
    }

    // 🔎 Récupération du document Firestore
    const truvyUser = await getTruvyUser(user.uid)

    if (!truvyUser) {
      setRoute('login')
      renderLogin(root)
      return
    }

    const role = truvyUser.role

    if (mode === 'client' && role !== 'client') {
      setRoute('login')
      renderLogin(root, { error: "Accès réservé aux clients." })
      return
    }

    if (mode === 'pro' && role !== 'pro') {
      setRoute('login')
      renderLogin(root, { error: "Accès réservé aux professionnels." })
      return
    }

    const compteValide = truvyUser.compte_valide === true

    if (!compteValide) {
      setRoute('login')
      renderLogin(root, { error: "Compte non validé. Contacte TRUVY pour activer ton accès." })
      return
    }

    // 🧭 Routing selon rôle
    if (role === 'pro') {
      setRoute('pro')
      renderDashboardPro(root, { user, truvyUser })
      return
    }

    if (role === 'client') {
      setRoute('client')
      renderDashboardClient(root, { user, truvyUser })
      return
    }

    // Sécurité fallback
    setRoute('login')
    renderLogin(root)
  })
}