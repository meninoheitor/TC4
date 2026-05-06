import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/services/auth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type BankHeaderProps = {
    balance: number;
    showBalance: boolean;
    onToggleBalance: () => void;
};

function formatBRL(value: number) {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}


export default function BankHeader({
    balance,
    showBalance,
    onToggleBalance,

}: BankHeaderProps) {

    const { user } = useAuth();

    const userName = user?.displayName || "Usuário";

    const initials =
        user?.displayName
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase() || "U";

    const router = useRouter();

    async function handleLogout() {

        try {
            await logout();
        } catch (error) {
            console.log("Erro ao sair:", error);
        }

        /* Alert.alert("Sair", "Deseja realmente sair?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Sair",
                onPress: async () => {
                    await logout();
                },
            },
        ]); */
    }


    return (
        <View style={styles.wrapper}>
            <View style={styles.topBar}>
                <View style={styles.leftContent}>

                    <View style={styles.logoCircle}>
                        <Ionicons name="person-circle-outline" size={36} color="#ff5031" />
                    </View>

                    <View>
                        <Text style={styles.greeting}>Olá,</Text>
                        <Text style={styles.userName}>{userName}</Text>
                    </View>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={onToggleBalance}
                    >
                        <Ionicons
                            name={showBalance ? "eye-outline" : "eye-off-outline"}
                            size={20}
                            color="#ff5031"
                        />
                    </TouchableOpacity>

                    {/*                     <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="notifications-outline" size={20} color="#ff5031" />
                    </TouchableOpacity> */}

                    <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={20} color="#ff5031" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.balanceCard}>
                <Text style={styles.balanceLabel}>Saldo em conta</Text>
                <Text style={showBalance ? styles.balanceValue : styles.HideBalanceValue}>
                    {showBalance ? formatBRL(balance) : "••••••"}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: "#0c6779",
        paddingTop: 52,
        paddingHorizontal: 16,
        paddingBottom: 20,
        height: 190,
        marginBottom: 20,
    },
    topBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    leftContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    logoCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "rgba(255,255,255,0.15)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    logo: {
        width: 128,
        height: 128,
    },
    greeting: {
        color: "rgba(255,255,255,0.8)",
        fontSize: 13,
    },
    userName: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
    },
    actions: {
        flexDirection: "row",
        gap: 8,
    },
    iconButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "rgba(255,255,255,0.15)",
        justifyContent: "center",
        alignItems: "center",
    },
    balanceCard: {
        backgroundColor: "#fff",
        marginTop: 18,
        borderRadius: 18,
        padding: 16,
    },
    balanceLabel: {
        fontSize: 14,
        color: "#666",
    },
    balanceValue: {
        fontSize: 28,
        fontWeight: "700",
        color: "#111",
        marginTop: 8,
    },
    HideBalanceValue: {
        fontSize: 28,
        fontWeight: "700",
        color: "#ff5031",
        marginTop: 8,
    },
});