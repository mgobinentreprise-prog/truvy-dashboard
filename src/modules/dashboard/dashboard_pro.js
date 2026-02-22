import { logout } from '../../firebase/auth'

export function renderDashboardPro(root, { user, truvyUser } = {}) {
  root.innerHTML = `
    <main style="max-width:980px;margin:48px auto;padding:24px;">
      <h1 style="margin:0 0 8px;">Dashboard Pro</h1>
      <p style="margin:0;color:var(--muted);">Connecté : ${escapeHtml(user?.email || '')}</p>

      <div style="margin-top:18px;padding:16px;border:1px solid var(--stroke);background:var(--panel);border-radius:16px;">
        <div style="color:var(--muted);font-size:13px;margin-bottom:8px;">Firestore truvy_users</div>
        <pre style="margin:0;white-space:pre-wrap;word-break:break-word;">${escapeHtml(JSON.stringify(truvyUser || {}, null, 2))}</pre>
      </div>

      <div style="margin-top:18px;padding:16px;border:1px solid var(--stroke);background:rgba(94,224,109,.08);border-radius:16px;">
        <strong style="display:block;margin-bottom:6px;">Zone Pro</strong>
        <span style="color:var(--muted);">Ici on branchera les KPIs, devis, demandes assignées, etc.</span>
      </div>

      <button id="btnLogout"
        style="margin-top:18px;padding:12px 16px;border-radius:999px;border:1px solid var(--stroke);background:rgba(255,255,255,.04);color:var(--text);cursor:pointer;">
        Se déconnecter
      </button>
    </main>
  `

  root.querySelector('#btnLogout')?.addEventListener('click', async () => {
    await logout()
  })
}

function escapeHtml(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}