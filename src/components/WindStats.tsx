import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDropzone } from "../context/DropzoneContext";
import { useTheme } from "../context/ThemeContext";
import useWeather from "../hooks/useWeather";

const WindStats = () => {
    const navigation = useNavigation();
    const { dropzone, loading: dropzoneLoading } = useDropzone();
    const { theme } = useTheme();
    const { metarData } = useWeather({ icaoCode: dropzone });

    const handleSeeMore = () => {
        navigation.navigate("Weather" as never);
    };

    if (dropzoneLoading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.headerRow}>
                    <Ionicons name="information-circle" size={24} color={theme.colors.text} style={styles.icon} />
                    <Text style={[styles.header, { color: theme.colors.text }]}>Wind</Text>
                </View>
                <Text style={[styles.metarText, { color: theme.colors.textSecondary }]}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.headerRow}>
                <Ionicons name="information-circle" size={24} color={theme.colors.text} style={styles.icon} />
                <Text style={[styles.header, { color: theme.colors.text }]}>Wind</Text>
            </View>
            <Text style={[styles.metarText, { color: theme.colors.text }]}>
                {metarData || "No METAR data available"}
            </Text>
            <Pressable
                style={[styles.seeMoreButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleSeeMore}
            >
                <Text style={[styles.seeMoreButtonText, { color: theme.colors.background }]}>See more</Text>
            </Pressable>
        </View>
    );
};

export default WindStats;

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    icon: {
        marginRight: 8,
    },
    header: {
        fontSize: 18,
        fontFamily: "Inter_700Bold",
    },
    metarText: {
        fontSize: 16,
        fontFamily: "Inter_400Regular",
        marginBottom: 12,
    },
    seeMoreButton: {
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignSelf: "flex-start",
    },
    seeMoreButtonText: {
        fontSize: 14,
        fontFamily: "Inter_500Medium",
    },
});

