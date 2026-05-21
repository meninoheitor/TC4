import type {
  ReceiptRepository,
  ReceiptUploadResult,
  UploadReceiptInput,
} from "@/core/domain/repositories/ReceiptRepository";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, storage } from "../firebase/FirebaseClient";

export class FirebaseReceiptRepository implements ReceiptRepository {
  async upload(input: UploadReceiptInput): Promise<ReceiptUploadResult> {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("Usuário não autenticado.");
    }

    const storagePath = `receipts/${user.uid}/${input.transactionId}/${input.fileName}`;
    const storageRef = ref(storage, storagePath);

    await uploadBytes(storageRef, input.file, {
      contentType: input.contentType ?? "application/octet-stream",
    });

    const downloadURL = await getDownloadURL(storageRef);

    return {
      storagePath,
      downloadURL,
      fileName: input.fileName,
      contentType: input.contentType ?? "application/octet-stream",
    };
  }

  async deleteByPath(storagePath: string): Promise<void> {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
  }
}
