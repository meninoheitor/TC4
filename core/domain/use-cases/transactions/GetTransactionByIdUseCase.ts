import type { Transaction } from "../../entities/Transaction";
import type { TransactionRepository } from "../../repositories/TransactionRepository";

export class GetTransactionByIdUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  execute(id: string): Promise<Transaction> {
    return this.transactionRepository.getById(id);
  }
}
