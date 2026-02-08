import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { db } from "../config/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

interface LatestJump {
    jumpNumber: number;
    jumpDate: string;
    dropzone: string;
    altitude: number | null;
    releaseType: "Static line" | "Free fall";
    isAccepted: boolean;
}

const LatestSkydive = () => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const { theme } = useTheme();
    const [latestJump, setLatestJump] = useState<LatestJump | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestJump = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const jumpsRef = collection(db, "users", user.uid, "jumps");
                const q = query(jumpsRef, orderBy("jumpNumber", "desc"), limit(1));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0].data();
                    setLatestJump({
                        jumpNumber: doc.jumpNumber,
                        jumpDate: doc.jumpDate,
                        dropzone: doc.dropzone || "N/A",
                        altitude: doc.altitude,
                        releaseType: doc.releaseType || "Static line",
                        isAccepted: doc.isAccepted ?? false,
                    });
                }
            } catch (error) {
                console.error("Error fetching latest jump:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestJump();
    }, [user]);

    const handleLogbook = () => {
        navigation.navigate("Logbook" as never);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("fi-FI", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.headerRow}>
                    <Ionicons name="arrow-forward" size={24} color={theme.colors.text} style={[styles.icon, styles.headerIcon]} />
                    <Text style={[styles.header, { color: theme.colors.text }]}>Latest skydive</Text>
                </View>
                <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>Loading...</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.headerRow}>
                    <Ionicons name="arrow-forward" size={24} color={theme.colors.text} style={[styles.icon, styles.headerIcon]} />
                    <Text style={[styles.header, { color: theme.colors.text }]}>Latest skydive</Text>
                </View>
                <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>Sign in to see your latest jump</Text>
            </View>
        );
    }

    if (!latestJump) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.headerRow}>
                    <Ionicons name="arrow-forward" size={24} color={theme.colors.text} style={[styles.icon, styles.headerIcon]} />
                    <Text style={[styles.header, { color: theme.colors.text }]}>Latest skydive</Text>
                </View>
                <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>No jumps logged yet</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.headerRow}>
                <Ionicons name="arrow-forward" size={24} color={theme.colors.text} style={[styles.icon, styles.headerIcon]} />
                <Text style={[styles.header, { color: theme.colors.text }]}>Latest skydive</Text>
            </View>
            
            <View style={styles.dataContainer}>
                <View style={styles.dataRow}>
                    <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Date:</Text>
                    <Text style={[styles.value, { color: theme.colors.text }]}>{formatDate(latestJump.jumpDate)}</Text>
                </View>
                <View style={styles.dataRow}>
                    <Text style={[styles.label, { color: theme.colors.textSecondary }]}>At:</Text>
                    <Text style={[styles.value, { color: theme.colors.text }]}>{latestJump.dropzone}</Text>
                </View>
                <View style={styles.dataRow}>
                    <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Alt:</Text>
                    <Text style={[styles.value, { color: theme.colors.text }]}>{latestJump.altitude ?? "N/A"} m</Text>
                </View>
                <View style={styles.dataRow}>
                    <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Type:</Text>
                    <Text style={[styles.value, { color: theme.colors.text }]}>
                        {latestJump.releaseType === "Static line" ? "Staticline" : "Freefall"}
                    </Text>
                </View>
                <View style={styles.dataRow}>
                    <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Status:</Text>
                    <Text style={[styles.value, { color: latestJump.isAccepted ? theme.colors.primary : theme.colors.textSecondary }]}>
                        {latestJump.isAccepted ? "Accepted" : "Pending"}
                    </Text>
                </View>
            </View>

            <Pressable
                style={[styles.logbookButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleLogbook}
            >
                <Text style={[styles.logbookButtonText, { color: theme.colors.background }]}>Logbook</Text>
            </Pressable>
        </View>
    );
};

export default LatestSkydive;

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    icon: {
        marginRight: 8,
    },
    headerIcon: {
        transform: [{ rotate: "45deg" }],
    },
    header: {
        fontSize: 18,
        fontFamily: "Inter_700Bold",
    },
    infoText: {
        fontSize: 16,
        fontFamily: "Inter_400Regular",
    },
    dataContainer: {
        marginBottom: 12,
    },
    dataRow: {
        flexDirection: "row",
        marginBottom: 4,
    },
    label: {
        fontSize: 15,
        fontFamily: "Inter_400Regular",
        width: 50,
    },
    value: {
        fontSize: 15,
        fontFamily: "Inter_500Medium",
        flex: 1,
    },
    logbookButton: {
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
    },
    logbookButtonText: {
        fontSize: 14,
        fontFamily: "Inter_500Medium",
    },
    buttonIcon: {
        marginLeft: 6,
        transform: [{ rotate: "45deg" }],
    },
});
