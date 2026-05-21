export interface UploadReceiptInput {
  transactionId: string;
  file: Blob;
  fileName: string;
  contentType?: string;
}

export interface ReceiptUploadResult {
  storagePath: string;
  downloadURL: string;
  fileName: string;
  contentType: string;
}

export interface ReceiptRepository {
  upload(input: UploadReceiptInput): Promise<ReceiptUploadResult>;
  deleteByPath(storagePath: string): Promise<void>;
}
