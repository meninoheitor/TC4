import { login } from "@/services/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Button,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    async function handleLogin() {
        try {
            await login(email.trim(), password);
            router.replace("/(tabs)");
        } catch (error: any) {
            const code = error?.code ?? "";

            if (code === "auth/user-not-found") {
                Alert.alert(
                    "Conta não encontrada",
                    "Esse usuário não está cadastrado.",
                    [
                        { text: "Cancelar", style: "cancel" },
                        { text: "Cadastrar", onPress: () => router.push("/register") },
                    ]
                );
                return;
            }

            Alert.alert("Erro", error?.message ?? "Não foi possível entrar.");
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
            />

            <TextInput
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
            />

            <Button title="Entrar" onPress={handleLogin} />

            <Pressable onPress={() => router.push("/register")} style={styles.linkBox}>
                <Text style={styles.linkText}>Ainda não tem conta? Cadastre-se</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    linkBox: {
        marginTop: 16,
        alignItems: "center",
    },
    linkText: {
        color: "#1F3C88",
        fontWeight: "600",
    },
});