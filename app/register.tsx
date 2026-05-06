import { register } from "@/services/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Button,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function RegisterScreen() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    async function handleRegister() {

        if (!name || !email || !password) {
            Alert.alert("Erro", "Preencha todos os campos");
            return;
        }

        try {
            await register(name.trim(), email.trim(), password);

            Alert.alert("Sucesso", "Usuário criado!", [
                {
                    text: "OK",
                    onPress: () => router.replace("/(tabs)"),
                },
            ]);
        } catch (error: any) {
            let message = "Erro ao cadastrar";

            if (error.code === "auth/email-already-in-use") {
                message = "Email já está em uso";
            }

            if (error.code === "auth/invalid-email") {
                message = "Email inválido";
            }

            if (error.code === "auth/weak-password") {
                message = "Senha deve ter pelo menos 6 caracteres";
            }

            Alert.alert("Erro", message);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cadastro</Text>

            <TextInput
                placeholder="Nome"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />

            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />

            <TextInput
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />

            <Button title="Cadastrar" onPress={handleRegister} />

            <Text
                style={styles.link}
                onPress={() => router.replace("/login")}
            >
                Já tem conta? Entrar
            </Text>
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
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
    },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        marginBottom: 12,
        borderRadius: 8,
    },
    link: {
        marginTop: 16,
        textAlign: "center",
        color: "#1F3C88",
        fontWeight: "600",
    },
});