import { useBalance } from "@/hooks/useBalance";
import { uploadReceipt } from "@/services/receipts";
import {
    addTransaction,
    attachReceiptToTransaction,
} from "@/services/transactions";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewTransactionScreen() {
  const [type, setType] = useState<"deposito" | "transferencia">("deposito");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<Blob | null>(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedFileType, setSelectedFileType] = useState("");

  const router = useRouter();
  const { balance } = useBalance();

  function handleValueChange(text: string) {
    // Remove "R$ " e espaços, mantendo apenas dígitos, vírgula e ponto
    const cleaned = text.replace(/^R\$\s*/, "").replace(/[^\d.,]/g, "");
    setValue(cleaned);
  }

  async function handleSave() {
    if (!value || !description) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    const numericValue = parseFloat(value.replace(",", "."));
    if (numericValue <= 0) {
      Alert.alert("Erro", "Insira um valor válido");
      return;
    }
    if (type === "transferencia" && numericValue > balance) {
      Alert.alert("Erro", "Saldo insuficiente para transferência");
      return;
    }
    try {
      // cria transação
      const transactionId = await addTransaction({
        type,
        value: numericValue,
        description,
      });

      // se tiver recibo
      if (selectedFile) {
        const receiptData = await uploadReceipt({
          transactionId,
          file: selectedFile,
          fileName: selectedFileName,
          contentType: selectedFileType,
        });

        // salva no Firestore dentro da transação
        await attachReceiptToTransaction(transactionId, receiptData);
      }
      Alert.alert("Sucesso", "Transação criada!");

      router.back();
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  }

  async function handlePickFile() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets[0];

      setSelectedFileName(asset.name ?? "recibo");
      setSelectedFileType(asset.mimeType ?? "application/octet-stream");

      const response = await fetch(asset.uri);
      const blob = await response.blob();

      setSelectedFile(blob);
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível selecionar o arquivo.");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Nova Transação</Text>

      {/* Tipo */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.typeButton, type === "deposito" && styles.active]}
          onPress={() => setType("deposito")}
        >
          <Text
            style={[
              styles.typeText,
              type === "deposito" && styles.typeTextActive,
            ]}
          >
            Depósito
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.typeButton, type === "transferencia" && styles.active]}
          onPress={() => setType("transferencia")}
        >
          <Text
            style={[
              styles.typeText,
              type === "transferencia" && styles.typeTextActive,
            ]}
          >
            Transferência
          </Text>
        </TouchableOpacity>
      </View>

      {/* Valor */}
      <TextInput
        placeholder="R$ 0,00"
        value={value ? `R$ ${value}` : ""}
        onChangeText={handleValueChange}
        keyboardType="numeric"
        style={styles.input}
      />

      {/* Descrição */}
      <TextInput
        placeholder="Descrição"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      <TouchableOpacity style={styles.fileButton} onPress={handlePickFile}>
        <Text style={styles.fileButtonText}>Anexar recibo</Text>
      </TouchableOpacity>

      {!!selectedFileName && (
        <Text style={styles.fileName}>Arquivo: {selectedFileName}</Text>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Concluir transação</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()}
      >
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 10,
  },

  typeButton: {
    flex: 1,
    padding: 12,
    borderWidth: 0,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#EEF3FF",
  },

  active: {
    backgroundColor: "#1F3C88",
  },

  typeTextActive: {
    color: "#fff",
    fontWeight: "700",
  },

  typeText: {
    color: "#1F3C88",
    fontWeight: "700",
  },

  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },

  saveButton: {
    backgroundColor: "#1F3C88",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  cancelButton: {
    marginTop: 12,
    alignItems: "center",
  },

  cancelButtonText: {
    color: "#666",
    fontSize: 14,
  },
  fileButton: {
    backgroundColor: "#EEF3FF",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },

  fileButtonText: {
    color: "#1F3C88",
    fontWeight: "700",
  },

  fileName: {
    fontSize: 13,
    color: "#555",
    marginBottom: 12,
  },
});
