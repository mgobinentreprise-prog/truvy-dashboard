import { db } from './config'
import { doc, getDoc } from 'firebase/firestore'

export async function getTruvyUser(uid) {
  const ref = doc(db, 'truvy_users', uid)
  const snapshot = await getDoc(ref)

  if (!snapshot.exists()) {
    return null
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  }
}