import { Image, StyleSheet, View } from "react-native";

export default function Header() {
    return (
        <View style={styles.container}>
            <Image
                source={require("../assets/logo.png")}
                style={styles.logo}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 90,
        backgroundColor: "#0A1F44", // cor estilo banco
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 30, // status bar
    },
    logo: {
        height: 40,
        width: 150,
    },
});