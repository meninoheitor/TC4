import { auth, db } from "@/services/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

export type FirestoreTransaction = {
  id: string;
  userId: string;
  type: "deposito" | "transferencia";
  value: number;
  description: string;
  createdAt: Date;
  receipt?: {
    fileName: string;
    storagePath: string;
    downloadURL: string;
    contentType: string;
  };
};

type CreateTransactionInput = {
  type: "deposito" | "transferencia";
  value: number;
  description: string;
};

type UpdateTransactionInput = {
  type: "deposito" | "transferencia";
  value: number;
  description: string;
};

type ReceiptMetadata = {
  storagePath: string;
  downloadURL: string;
  fileName: string;
  contentType: string;
};

export async function addTransaction(input: CreateTransactionInput) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  /* await addDoc(collection(db, "transactions"), {
        userId: user.uid,
        type: input.type,
        value: input.value,
        description: input.description,
        createdAt: Timestamp.now(),
    }); */
  const docRef = await addDoc(collection(db, "transactions"), {
    userId: user.uid,
    type: input.type,
    value: input.value,
    description: input.description,
    createdAt: Timestamp.now(),
  });

  return docRef.id;
}

export function subscribeToUserTransactions(
  callback: (transactions: FirestoreTransaction[]) => void,
) {
  const user = auth.currentUser;

  console.log("uid logado:", user?.uid);

  if (!user) {
    callback([]);
    return () => {};
  }

  const q = query(
    collection(db, "transactions"),
    where("userId", "==", user.uid),
    //orderBy("createdAt", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      console.log("docs encontrados:", snapshot.size);

      const transactions: FirestoreTransaction[] = snapshot.docs.map((item) => {
        const data = item.data();

        console.log("doc:", item.id, data);

        return {
          id: item.id,
          userId: data.userId,
          type: data.type,
          value: Number(data.value),
          description: data.description ?? "",
          createdAt: data.createdAt?.toDate?.() ?? new Date(),
          receipt: data.receipt ?? undefined,
        };
      });

      callback(transactions);
    },
    (error) => {
      console.log("erro ao buscar transações:", error);
      callback([]);
    },
  );
}

export async function removeTransaction(transactionId: string) {
  await deleteDoc(doc(db, "transactions", transactionId));
}

export async function updateTransaction(
  transactionId: string,
  input: UpdateTransactionInput,
) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const ref = doc(db, "transactions", transactionId);

  await updateDoc(ref, {
    type: input.type,
    value: input.value,
    description: input.description,
  });
}

export function calculateBalance(transactions: FirestoreTransaction[]) {
  return transactions.reduce((total, transaction) => {
    if (transaction.type === "deposito") {
      return total + transaction.value;
    }

    return total - transaction.value;
  }, 0);
}

export async function attachReceiptToTransaction(
  transactionId: string,
  receipt: ReceiptMetadata,
) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const transactionRef = doc(db, "transactions", transactionId);

  await updateDoc(transactionRef, {
    receipt: {
      ...receipt,
      uploadedAt: serverTimestamp(),
    },
  });
}

export async function getTransactionById(transactionId: string) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const ref = doc(db, "transactions", transactionId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error("Transação não encontrada.");
  }

  const data = snapshot.data();

  if (data.userId !== user.uid) {
    throw new Error("Acesso negado.");
  }

  return {
    id: snapshot.id,
    userId: data.userId,
    type: data.type,
    value: Number(data.value),
    description: data.description ?? "",
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    receipt: data.receipt ?? undefined,
  } as FirestoreTransaction;
}
