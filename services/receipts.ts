import { auth, storage } from "@/services/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

type UploadReceiptInput = {
    transactionId: string;
    file: Blob;
    fileName: string;
    contentType?: string;
};

export async function uploadReceipt({
    transactionId,
    file,
    fileName,
    contentType,
}: UploadReceiptInput) {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("Usuário não autenticado.");
    }

    const storagePath = `receipts/${user.uid}/${transactionId}/${fileName}`;
    const storageRef = ref(storage, storagePath);

    await uploadBytes(storageRef, file, {
        contentType: contentType ?? "application/octet-stream",
    });

    const downloadURL = await getDownloadURL(storageRef);

    return {
        storagePath,
        downloadURL,
        fileName,
        contentType: contentType ?? "application/octet-stream",
    };
}