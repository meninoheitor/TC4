import type { Query } from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";
import { Observable } from "rxjs";

/**
 * Adapta o listener do Firestore para um Observable (programação reativa).
 */
export function createFirestoreObservable<T>(
  queryRef: Query,
  mapper: (snapshot: import("firebase/firestore").QuerySnapshot) => T,
): Observable<T> {
  return new Observable<T>((subscriber) => {
    const unsubscribe = onSnapshot(
      queryRef,
      (snapshot) => {
        subscriber.next(mapper(snapshot));
      },
      (error) => {
        subscriber.error(error);
      },
    );

    return () => unsubscribe();
  });
}
