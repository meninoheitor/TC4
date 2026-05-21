import type { Transaction } from "@/core/domain/entities/Transaction";
import { EncryptedCache } from "./EncryptedCache";

const CACHE_KEY = "transactions_snapshot";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

type CachedPayload = {
  data: Transaction[];
  cachedAt: number;
};

export class TransactionCacheService {
  private readonly cache = new EncryptedCache("transactions");

  async save(transactions: Transaction[]): Promise<void> {
    const payload: CachedPayload = {
      data: transactions.map((t) => ({
        ...t,
        createdAt: t.createdAt,
      })),
      cachedAt: Date.now(),
    };

    await this.cache.set(CACHE_KEY, payload);
  }

  async load(): Promise<Transaction[] | null> {
    const payload = await this.cache.get<CachedPayload>(CACHE_KEY);

    if (!payload) {
      return null;
    }

    if (Date.now() - payload.cachedAt > CACHE_TTL_MS) {
      await this.cache.remove(CACHE_KEY);
      return null;
    }

    return payload.data.map((t) => ({
      ...t,
      createdAt: new Date(t.createdAt),
    }));
  }

  async clear(): Promise<void> {
    await this.cache.remove(CACHE_KEY);
  }
}
