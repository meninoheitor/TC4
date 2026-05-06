import {
    calculateBalance,
    FirestoreTransaction,
    subscribeToUserTransactions,
} from "@/services/transactions";
import { useEffect, useState } from "react";

export function useBalance() {
    const [transactions, setTransactions] = useState<FirestoreTransaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeToUserTransactions((items) => {
            setTransactions(items);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const balance = calculateBalance(transactions);

    return {
        balance,
        transactions,
        loading,
    };
}