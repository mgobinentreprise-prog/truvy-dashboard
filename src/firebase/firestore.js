// src/firebase/firestore.js
import { doc, getDoc } from "firebase/firestore";
import { db } from "./config";

export async function getTruvyUser(uid) {
  if (!uid) throw new Error("getTruvyUser: uid manquant");

  const ref = doc(db, "truvy_users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}