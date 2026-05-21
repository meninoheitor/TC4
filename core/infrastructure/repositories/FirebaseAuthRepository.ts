import type { AuthRepository } from "@/core/domain/repositories/AuthRepository";
import type { AuthUser } from "@/core/domain/entities/User";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth } from "../firebase/FirebaseClient";

function mapUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  };
}

export class FirebaseAuthRepository implements AuthRepository {
  async register(name: string, email: string, password: string): Promise<AuthUser> {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    return mapUser(credential.user);
  }

  async login(email: string, password: string): Promise<AuthUser> {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return mapUser(credential.user);
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }

  observeAuthState(callback: (user: AuthUser | null) => void): () => void {
    return onAuthStateChanged(auth, (firebaseUser) => {
      callback(firebaseUser ? mapUser(firebaseUser) : null);
    });
  }

  getCurrentUser(): AuthUser | null {
    const user = auth.currentUser;
    return user ? mapUser(user) : null;
  }
}
