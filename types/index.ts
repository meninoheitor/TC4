export type TransactionType = "deposito" | "transferencia" | "";

export interface Transaction {
  id: string;
  userId?: string;
  type: TransactionType;
  value: number;
  createdAt: Date;
  description: string;
  attachment?: string;
}

export interface TransactionInput {
  type: TransactionType;
  amount: number;
  description?: string;
}

export interface Database {
  transaction: Transaction[];
}

export interface NewTransactionProps {
  title: string;
  type: TransactionType;
  value: string;
  description?: string;
  transactionTypeOptions: string[];
  onTypeChange: (value: TransactionType) => void;
  onValueChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  onFileChange?: (file: File | null) => void;
  currentFile?: string | null;
}

export interface DeleteTransactioProps {
  title: string;
  onCancelSubmit: () => void;
  onDeleteSubmit: () => void;
  disabled?: boolean;
}

export interface BoxBalanceProps {
  dateString: string;
  balance?: string;
  defaultIsActive?: boolean;
}

export type SuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  title?: string;
};

export interface HeaderProps {
  title: string;
  onToggleFontSize: () => void;
  onToggleDarkMode: () => void;
}

export interface AccessibilityContextType {
  theme: "light" | "dark";
  fontLevel: 0 | 1 | 2;
  toggleDarkMode: () => void;
  toggleChangeFontSize: () => void;
}

export interface TransactionsListProps {
  transactions: Transaction[];
  title: string;
  onEditClick?: (transaction: Transaction) => void;
  onDeleteClick?: (transation: Transaction) => void;
}

export interface TransactionsListHomeProps {
  transaction: Transaction[];
  title: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export interface MenuItem {
  label: string;
  path: string;
}

export interface TransactionReceipt {
  fileName: string;
  storagePath: string;
  downloadURL: string;
  contentType: string;
}

export interface Transaction {
  id: string;
  userId?: string;
  type: TransactionType;
  value: number;
  createdAt: Date;
  description: string;
  attachment?: string;
  receipt?: TransactionReceipt;
}
