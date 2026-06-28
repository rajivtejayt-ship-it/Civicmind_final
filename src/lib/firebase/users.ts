import { db, auth, handleFirestoreError, OperationType } from "./client";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { CivicUser } from "../../types/civic";

/**
 * Fetch the CivicUser document for the currently authenticated user.
 * If the document doesn't exist yet (new user), it creates a starter
 * document with New Neighbor defaults and returns it.
 *
 * Returns null when no user is signed in.
 */
export async function getCurrentCivicUser(): Promise<CivicUser | null> {
  try {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return null;

    const docRef = doc(db, "users", firebaseUser.uid);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return snap.data() as CivicUser;
    }

    // New user — create starter document
    const starter: CivicUser = {
      uid: firebaseUser.uid,
      displayName: firebaseUser.displayName ?? "Citizen",
      email: firebaseUser.email ?? "",
      photoURL: firebaseUser.photoURL ?? undefined,
      civicCred: 25,
      badge: "New Neighbor",
      role: "citizen",
      reportsFiled: 0,
      reportsConfirmed: 0,
      reportsRejected: 0,
      isGuardian: false,
      joinedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };

    await setDoc(docRef, starter);
    return starter;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, "users/current");
    return null;
  }
}
