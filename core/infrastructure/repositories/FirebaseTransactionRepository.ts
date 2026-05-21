import type {
  CreateTransactionInput,
  ReceiptMetadata,
  Transaction,
  UpdateTransactionInput,
} from "@/core/domain/entities/Transaction";
import type { TransactionRepository } from "@/core/domain/repositories/TransactionRepository";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { EMPTY, type Observable } from "rxjs";
import { auth, db } from "../firebase/FirebaseClient";
import { createFirestoreObservable } from "../reactive/firestoreObservable";

function mapDocument(
  id: string,
  data: Record<string, unknown>,
): Transaction {
  return {
    id,
    userId: String(data.userId),
    type: data.type as Transaction["type"],
    value: Number(data.value),
    description: String(data.description ?? ""),
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate()
        : new Date(),
    receipt: data.receipt as Transaction["receipt"],
  };
}

export class FirebaseTransactionRepository implements TransactionRepository {
  async create(input: CreateTransactionInput): Promise<string> {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("Usuário não autenticado.");
    }

    const docRef = await addDoc(collection(db, "transactions"), {
      userId: user.uid,
      type: input.type,
      value: input.value,
      description: input.description,
      createdAt: Timestamp.now(),
    });

    return docRef.id;
  }

  async update(id: string, input: UpdateTransactionInput): Promise<void> {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("Usuário não autenticado.");
    }

    await updateDoc(doc(db, "transactions", id), {
      type: input.type,
      value: input.value,
      description: input.description,
    });
  }

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(db, "transactions", id));
  }

  async getById(id: string): Promise<Transaction> {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("Usuário não autenticado.");
    }

    const snapshot = await getDoc(doc(db, "transactions", id));

    if (!snapshot.exists()) {
      throw new Error("Transação não encontrada.");
    }

    const data = snapshot.data();

    if (data.userId !== user.uid) {
      throw new Error("Acesso negado.");
    }

    return mapDocument(snapshot.id, data);
  }

  async attachReceipt(id: string, receipt: ReceiptMetadata): Promise<void> {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("Usuário não autenticado.");
    }

    await updateDoc(doc(db, "transactions", id), {
      receipt: {
        ...receipt,
        uploadedAt: serverTimestamp(),
      },
    });
  }

  observeUserTransactions(): Observable<Transaction[]> {
    const user = auth.currentUser;

    if (!user) {
      return EMPTY;
    }

    const q = query(
      collection(db, "transactions"),
      where("userId", "==", user.uid),
    );

    return createFirestoreObservable(q, (snapshot) =>
      snapshot.docs
        .map((item) => mapDocument(item.id, item.data()))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    );
  }
}
