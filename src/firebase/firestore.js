import { doc, getDoc } from 'firebase/firestore'
import { db } from './config'

export async function getTruvyUser(uid) {
  try {
    if (!uid) throw new Error("getTruvyUser: uid manquant")

    const ref = doc(db, "truvy_users", uid)
    const snap = await getDoc(ref)

    if (!snap.exists()) return null
    return { id: snap.id, ...snap.data() }
  } catch (e) {
    console.error("[getTruvyUser] Firestore error:", {
      code: e?.code,
      message: e?.message,
      name: e?.name,
    })
    throw e
  }
}