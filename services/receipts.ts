/**
 * @deprecated Prefira container.repositories.receipts
 */
import { container } from "@/core/di/container";

export async function uploadReceipt(
  input: Parameters<typeof container.repositories.receipts.upload>[0],
) {
  return container.repositories.receipts.upload(input);
}
