import { loginWithEmail } from '../../firebase/auth'

export function renderLogin(root, opts = {}) {
  const error = opts.error ? String(opts.error) : ''

  root.innerHTML = `
    <main style="max-width:520px;margin:64px auto;padding:24px;border:1px solid var(--stroke);background:var(--panel);border-radius:18px;">
      <h1 style="margin:0 0 8px;">TRUVY — Dashboard</h1>
      <p style="margin:0 0 18px;color:var(--muted);">Connexion requise</p>

      ${error ? `<div style="margin:0 0 14px;padding:10px 12px;border:1px solid var(--stroke);border-radius:14px;background:rgba(255,255,255,.03);">
        ${escapeHtml(error)}
      </div>` : ''}

      <label style="display:block;margin:0 0 8px;color:var(--muted);font-size:13px;">Email</label>
      <input id="email" type="email" autocomplete="email"
        style="width:100%;padding:12px;border-radius:14px;border:1px solid var(--stroke);background:rgba(255,255,255,.03);color:var(--text);" />

      <label style="display:block;margin:14px 0 8px;color:var(--muted);font-size:13px;">Mot de passe</label>
      <input id="pwd" type="password" autocomplete="current-password"
        style="width:100%;padding:12px;border-radius:14px;border:1px solid var(--stroke);background:rgba(255,255,255,.03);color:var(--text);" />

      <button id="btnLogin"
        style="margin-top:18px;width:100%;padding:14px 16px;border-radius:999px;border:1px solid var(--stroke);background:rgba(94,224,109,.18);color:var(--text);font-weight:800;cursor:pointer;">
        Se connecter
      </button>

      <p style="margin:14px 0 0;color:var(--muted);font-size:13px;">
        (Email / mot de passe Firebase)
      </p>
    </main>
  `

  root.querySelector('#btnLogin')?.addEventListener('click', async () => {
    const email = root.querySelector('#email')?.value?.trim()
    const pwd = root.querySelector('#pwd')?.value

    if (!email || !pwd) {
      renderLogin(root, { error: 'Email et mot de passe requis.' })
      return
    }

    // petit feedback visuel
    root.querySelector('#btnLogin').textContent = 'Connexion…'
    root.querySelector('#btnLogin').disabled = true

    try {
      await loginWithEmail(email, pwd)
      // init.js (watchAuth) prendra la suite automatiquement
    } catch (e) {
      renderLogin(root, { error: e?.message || 'Erreur de connexion.' })
    }
  })
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}