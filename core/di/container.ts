import { LoginUseCase } from "@/core/domain/use-cases/auth/LoginUseCase";
import { LogoutUseCase } from "@/core/domain/use-cases/auth/LogoutUseCase";
import { RegisterUseCase } from "@/core/domain/use-cases/auth/RegisterUseCase";
import { CreateTransactionWithReceiptUseCase } from "@/core/domain/use-cases/transactions/CreateTransactionWithReceiptUseCase";
import { DeleteTransactionUseCase } from "@/core/domain/use-cases/transactions/DeleteTransactionUseCase";
import { GetTransactionByIdUseCase } from "@/core/domain/use-cases/transactions/GetTransactionByIdUseCase";
import { UpdateTransactionUseCase } from "@/core/domain/use-cases/transactions/UpdateTransactionUseCase";
import { TransactionCacheService } from "@/core/infrastructure/cache/TransactionCacheService";
import { FirebaseAuthRepository } from "@/core/infrastructure/repositories/FirebaseAuthRepository";
import { FirebaseReceiptRepository } from "@/core/infrastructure/repositories/FirebaseReceiptRepository";
import { FirebaseTransactionRepository } from "@/core/infrastructure/repositories/FirebaseTransactionRepository";

const authRepository = new FirebaseAuthRepository();
const transactionRepository = new FirebaseTransactionRepository();
const receiptRepository = new FirebaseReceiptRepository();
const transactionCache = new TransactionCacheService();

export const container = {
  repositories: {
    auth: authRepository,
    transactions: transactionRepository,
    receipts: receiptRepository,
  },
  cache: {
    transactions: transactionCache,
  },
  useCases: {
    auth: {
      login: new LoginUseCase(authRepository),
      register: new RegisterUseCase(authRepository),
      logout: new LogoutUseCase(authRepository),
    },
    transactions: {
      createWithReceipt: new CreateTransactionWithReceiptUseCase(
        transactionRepository,
        receiptRepository,
      ),
      update: new UpdateTransactionUseCase(transactionRepository),
      delete: new DeleteTransactionUseCase(
        transactionRepository,
        receiptRepository,
      ),
      getById: new GetTransactionByIdUseCase(transactionRepository),
    },
  },
};
