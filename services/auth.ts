import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from "./firebase";

export async function register(name: string, email: string, password: string) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);

    const user = credential.user;

    await updateProfile(user, { displayName: name });
    return credential;
}

export async function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
    return signOut(auth);
}