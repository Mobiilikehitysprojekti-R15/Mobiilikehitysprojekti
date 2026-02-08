import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useJumpStats, MONTH_NAMES } from "../hooks/useJumpStats";
import PickerModal from "../components/PickerModal";
import {
  JumpsPerMonthChart,
  JumpTypesChart,
  AcceptedStatusChart,
  TopDropzonesChart,
  AltitudeProgressionChart,
} from "../components/charts";
import JumpsListScrollView from "../components/JumpsListScrollView";

const StatsScreen = () => {
  const { theme } = useTheme();
  const [showYearPicker, setShowYearPicker] = useState(false);

  const {
    loading,
    jumps,
    selectedYear,
    setSelectedYear,
    availableYears,
    filteredJumps,
    activeFiltersText,
    totalFreefallTime,
    acceptedChartTotal,
    jumpsPerMonthData,
    releaseTypeData,
    acceptedData,
    topDropzonesData,
    altitudeProgressionData,
  } = useJumpStats();

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          styles.center,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text
          style={[styles.loadingText, { color: theme.colors.textSecondary }]}
        >
          Loading statistics...
        </Text>
      </View>
    );
  }

  if (jumps.length === 0) {
    return (
      <View
        style={[
          styles.container,
          styles.center,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text style={[styles.noDataText, { color: theme.colors.text }]}>
          No jumps logged yet
        </Text>
        <Text
          style={[styles.noDataSubtext, { color: theme.colors.textSecondary }]}
        >
          Add jumps in the "New" tab to see your statistics
        </Text>
      </View>
    );
  }

  const yearOptions = availableYears.map((year) => ({
    value: String(year),
    label: String(year),
  }));

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.header, { color: theme.colors.text }]}>Stats</Text>
      <Text style={[styles.subheader, { color: theme.colors.textSecondary }]}>
        Total jumps this season: {filteredJumps.length}
      </Text>
      <Text style={[styles.subheader, { color: theme.colors.textSecondary }]}>
        Total freefall time this season: {totalFreefallTime} seconds
      </Text>
      {activeFiltersText && (
        <Text style={[styles.filterText, { color: theme.colors.primary }]}>
          {activeFiltersText}
        </Text>
      )}

      {/* Year Selector */}
      <View style={styles.yearContainer}>
        <Text style={[styles.yearLabel, { color: theme.colors.text }]}>
          Year
        </Text>
        <TouchableOpacity
          style={[
            styles.yearButton,
            {
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.background,
            },
          ]}
          onPress={() => setShowYearPicker(true)}
        >
          <Text style={[styles.yearButtonText, { color: theme.colors.text }]}>
            {selectedYear || "Select Year"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Year Picker Modal */}
      <PickerModal
        visible={showYearPicker}
        onClose={() => setShowYearPicker(false)}
        title="Select Year"
        options={yearOptions}
        selectedValue={selectedYear}
        onSelect={(value) => setSelectedYear(value)}
      />

      {/* Jumps Per Month Chart */}
      <JumpsPerMonthChart data={jumpsPerMonthData} selectedYear={selectedYear} />

      {/* Pie Charts Row */}
      <View style={styles.pieRow}>
        <JumpTypesChart data={releaseTypeData} />
        <AcceptedStatusChart data={acceptedData} totalCount={acceptedChartTotal} />
      </View>

      {/* Top Dropzones Chart */}
      <TopDropzonesChart data={topDropzonesData} />

      {/* Altitude Progression Chart */}
      <AltitudeProgressionChart data={altitudeProgressionData} />

      {/* Jump Cards List */}
      <JumpsListScrollView jumps={filteredJumps} />

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

export default StatsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  subheader: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    marginBottom: 8,
  },
  filterText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    marginBottom: 12,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  noDataText: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  noDataSubtext: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  pieRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  bottomSpacer: {
    height: 40,
  },
  yearContainer: {
    marginBottom: 16,
  },
  yearLabel: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 5,
  },
  yearButton: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  yearButtonText: {
    fontSize: 16,
    fontFamily: "Inter_300Light",
  },
});
