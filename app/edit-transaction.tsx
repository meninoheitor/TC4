import { useBalance } from "@/hooks/useBalance";
import { getTransactionById, updateTransaction } from "@/services/transactions";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Linking,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditTransactionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const { balance } = useBalance();

  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<"deposito" | "transferencia">("deposito");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [receiptName, setReceiptName] = useState("");

  function handleValueChange(text: string) {
    // Remove "R$ " e espaços, mantendo apenas dígitos, vírgula e ponto
    const cleaned = text.replace(/^R\$\s*/, "").replace(/[^\d.,]/g, "");
    setValue(cleaned);
  }

  useEffect(() => {
    async function loadTransaction() {
      if (!params.id) return;

      try {
        const transaction = await getTransactionById(String(params.id));

        setType(transaction.type);
        setValue(String(transaction.value));
        setDescription(transaction.description);
        setReceiptUrl(transaction.receipt?.downloadURL ?? "");
        setReceiptName(transaction.receipt?.fileName ?? "");
      } catch (error: any) {
        Alert.alert("Erro", error.message ?? "Não foi possível carregar.");
      } finally {
        setLoading(false);
      }
    }

    loadTransaction();
  }, [params.id]);

  async function handleSave() {
    if (!params.id || !value || !description) {
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
      await updateTransaction(String(params.id), {
        type,
        value: numericValue,
        description,
      });

      Alert.alert("Sucesso", "Transação atualizada!");
      router.back();
    } catch (error: any) {
      Alert.alert("Erro", error.message ?? "Não foi possível atualizar.");
    }
  }

  async function handleOpenReceipt() {
    if (!receiptUrl) return;

    try {
      if (Platform.OS === "web") {
        window.open(receiptUrl, "_blank");
        return;
      }

      await Linking.openURL(receiptUrl);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível abrir o recibo.");
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando transação...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Editar Transação</Text>

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

      <TextInput
        placeholder="R$ 0,00"
        value={value ? `R$ ${value}` : ""}
        onChangeText={handleValueChange}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Descrição"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      {!!receiptUrl && (
        <View style={styles.receiptCard}>
          <Text style={styles.receiptLabel}>Recibo anexado</Text>

          {!!receiptName && (
            <Text style={styles.receiptName}>{receiptName}</Text>
          )}

          <TouchableOpacity
            style={styles.receiptButton}
            onPress={handleOpenReceipt}
          >
            <Text style={styles.receiptButtonText}>Ver recibo</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Salvar alterações</Text>
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
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },

  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  receiptCard: {
    backgroundColor: "#F7F9FC",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  receiptLabel: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
  },
  receiptName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginBottom: 10,
  },
  receiptButton: {
    alignSelf: "flex-start",
    backgroundColor: "#EEF3FF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  receiptButtonText: {
    color: "#1F3C88",
    fontWeight: "700",
    fontSize: 13,
  },
  cancelButton: {
    marginTop: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 14,
  },
});
