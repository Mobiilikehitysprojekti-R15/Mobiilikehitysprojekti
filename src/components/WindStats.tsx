import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDropzone } from "../context/DropzoneContext";
import useWeather from "../hooks/useWeather";

const WindStats = () => {
    const navigation = useNavigation();
    const { dropzone, loading: dropzoneLoading } = useDropzone();
    const { metarData } = useWeather({ icaoCode: dropzone });

    const handleSeeMore = () => {
        navigation.navigate("Weather" as never);
    };

    if (dropzoneLoading) {
        return (
            <View style={styles.container}>
                <View style={styles.headerRow}>
                    <Ionicons name="information-circle" size={24} color="#333" style={styles.icon} />
                    <Text style={styles.header}>Wind</Text>
                </View>
                <Text style={styles.metarText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Ionicons name="information-circle" size={24} color="#333" style={styles.icon} />
                <Text style={styles.header}>Wind</Text>
            </View>
            <Text style={styles.metarText}>
                {metarData || "No METAR data available"}
            </Text>
            <Pressable style={styles.seeMoreButton} onPress={handleSeeMore}>
                <Text style={styles.seeMoreButtonText}>See more</Text>
            </Pressable>
        </View>
    );
};

export default WindStats;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f8f8f8",
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
        color: "#333",
        marginBottom: 12,
    },
    seeMoreButton: {
        backgroundColor: "#000",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignSelf: "flex-start",
    },
    seeMoreButtonText: {
        color: "#fff",
        fontSize: 14,
        fontFamily: "Inter_500Medium",
    },
});
