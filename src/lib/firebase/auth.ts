import { auth, db } from "./client";

import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    User
} from "firebase/auth";

import {
    doc,
    getDoc,
    setDoc
} from "firebase/firestore";

import {
    CivicUser,
    Badge
} from "../../types/civic";

const provider = new GoogleAuthProvider();

function getInitialBadge(): Badge{
    return "New Neighbor";
}

export async function signInWithGoogle() {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    await createUserIfMissing(user);
    return user;
}

export async function signOutUser() {
    await signOut(auth);
}

export async function createUserIfMissing(user : User) {
    const userRef=doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);
    
    if(snapshot.exists()) return;

    const civicUser: CivicUser = {
        uid: user.uid,

        displayName: user.displayName || "Anonymous Citizen",

        email: user.email || "",

        photoURL: user.photoURL || undefined,

        civicCred: 25,

        badge: getInitialBadge(),

        role: "citizen",

        reportsFiled: 0,

        reportsConfirmed: 0,

        reportsRejected: 0,

        isGuardian: false,

        joinedAt: new Date().toISOString(),

        lastActiveAt: new Date().toISOString()
    };
    await setDoc(userRef,civicUser);
}