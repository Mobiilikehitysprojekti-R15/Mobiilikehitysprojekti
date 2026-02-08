import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { db } from "../config/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { BarChart, LineChart, PieChart } from "react-native-gifted-charts";
import { JumpData } from "../types/jumpDataFirebase";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const StatsScreen = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [jumps, setJumps] = useState<JumpData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  useEffect(() => {
    const fetchJumps = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const jumpsRef = collection(db, "users", user.uid, "jumps");
        const q = query(jumpsRef, orderBy("jumpDate", "asc"));
        const snapshot = await getDocs(q);

        const jumpData: JumpData[] = snapshot.docs.map((doc) => ({
          ...doc.data(),
        })) as JumpData[];

        setJumps(jumpData);
      } catch (error) {
        console.error("Error fetching jumps:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJumps();
  }, [user]);

  const availableYears = [
    ...new Set(jumps.map((j) => new Date(j.jumpDate).getFullYear())),
  ].sort((a, b) => b - a);

  useEffect(() => {
    if (availableYears.length > 0 && selectedYear === null) {
      setSelectedYear(String(availableYears[0]));
    }
  }, [availableYears, selectedYear]);

  const yearFilteredJumps = jumps.filter((j) => {
    const date = new Date(j.jumpDate);
    return (
      selectedYear === null || date.getFullYear() === parseInt(selectedYear)
    );
  });

  const availableMonths = [
    ...new Set(yearFilteredJumps.map((j) => new Date(j.jumpDate).getMonth())),
  ].sort((a, b) => a - b);

  const filteredJumps = yearFilteredJumps.filter((j) => {
    const date = new Date(j.jumpDate);
    return selectedMonth === null || date.getMonth() === selectedMonth;
  });

  const getJumpsPerMonth = () => {
    const monthCounts: { [key: string]: number } = {};

    yearFilteredJumps.forEach((jump) => {
      const date = new Date(jump.jumpDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
    });

    const sortedMonths = Object.keys(monthCounts).sort();
    const lastSixMonths = sortedMonths.slice(-6);

    return lastSixMonths.map((month) => {
      const monthIndex = parseInt(month.slice(5), 10) - 1;
      const isSelected = selectedMonth === monthIndex;
      return {
        value: monthCounts[month],
        label: MONTH_NAMES[monthIndex],
        frontColor: isSelected
          ? theme.colors.primary
          : theme.colors.primary + "60",
        onPress: () => {
          setSelectedMonth(isSelected ? null : monthIndex);
        },
      };
    });
  };

  const getReleaseTypeData = () => {
    const staticLine = filteredJumps.filter(
      (j) => j.releaseType === "Static line",
    ).length;
    const freeFallLow = filteredJumps.filter(
      (j) =>
        j.releaseType === "Free fall" &&
        (j.altitude === null || j.altitude <= 2000),
    ).length;
    const freeFallHigh = filteredJumps.filter(
      (j) =>
        j.releaseType === "Free fall" &&
        j.altitude !== null &&
        j.altitude > 2000,
    ).length;

    if (staticLine === 0 && freeFallLow === 0 && freeFallHigh === 0) {
      return [{ value: 1, color: theme.colors.border, text: "No data" }];
    }

    return [
      {
        value: staticLine,
        color: "#4ECDC4",
        text: `${staticLine}`,
        label: "Static",
      },
      {
        value: freeFallLow,
        color: "#FF6B6B",
        text: `${freeFallLow}`,
        label: "Freefall",
      },
      {
        value: freeFallHigh,
        color: "#9B59B6",
        text: `${freeFallHigh}`,
        label: ">2km",
      },
    ].filter((d) => d.value > 0);
  };

  const getAcceptedData = () => {
    const accepted = filteredJumps.filter((j) => j.isAccepted).length;
    const pending = filteredJumps.filter((j) => !j.isAccepted).length;

    if (accepted === 0 && pending === 0) {
      return [{ value: 1, color: theme.colors.border }];
    }

    return [
      { value: accepted, color: "#2ECC71", text: `${accepted}` },
      { value: pending, color: "#E74C3C", text: `${pending}` },
    ].filter((d) => d.value > 0);
  };

  const getTopDropzones = () => {
    const dropzoneCounts: { [key: string]: number } = {};

    filteredJumps.forEach((jump) => {
      if (jump.dropzone) {
        dropzoneCounts[jump.dropzone] =
          (dropzoneCounts[jump.dropzone] || 0) + 1;
      }
    });

    const sorted = Object.entries(dropzoneCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return sorted.map(([dz, count]) => ({
      value: count,
      label: dz,
      frontColor: theme.colors.primary,
    }));
  };

  const getAltitudeProgression = () => {
    const filteredJumpsWithAltitude = filteredJumps.filter(
      (j) => j.altitude !== null && j.altitude > 0,
    );

    return filteredJumpsWithAltitude.map((jump, index) => ({
      value: jump.altitude || 0,
      label:
        index % Math.ceil(filteredJumpsWithAltitude.length / 5) === 0
          ? `#${jump.jumpNumber}`
          : "",
      dataPointText: "",
    }));
  };

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

  const jumpsPerMonth = getJumpsPerMonth();

  const releaseTypeData = getReleaseTypeData();
  const acceptedData = getAcceptedData();
  const topDropzones = getTopDropzones();
  const altitudeData = getAltitudeProgression();

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
        Total freefall time this season:{" "}
        {filteredJumps.reduce((acc, jump) => acc + (jump.freefallTime || 0), 0)}{" "}
        seconds
      </Text>

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
      <Modal
        visible={showYearPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowYearPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowYearPicker(false)}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Select Year
            </Text>
            <FlatList
              data={availableYears}
              keyExtractor={(item) => String(item)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.yearOption,
                    selectedYear === String(item) && {
                      backgroundColor: theme.colors.primary + "20",
                    },
                  ]}
                  onPress={() => {
                    setSelectedYear(String(item));
                    setSelectedMonth(null);
                    setShowYearPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.yearOptionText,
                      { color: theme.colors.text },
                      selectedYear === String(item) && {
                        color: theme.colors.primary,
                        fontWeight: "600",
                      },
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Jumps in season */}
      {jumpsPerMonth.length > 0 && (
        <View
          style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}
        >
          <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
            Jumps in season {selectedYear}
          </Text>
          <BarChart
            data={jumpsPerMonth}
            barWidth={32}
            spacing={20}
            roundedTop
            xAxisThickness={1}
            yAxisThickness={1}
            xAxisColor={theme.colors.border}
            yAxisColor={theme.colors.border}
            yAxisTextStyle={{ color: theme.colors.textSecondary }}
            xAxisLabelTextStyle={{ color: theme.colors.textSecondary }}
            noOfSections={4}
            maxValue={Math.max(...jumpsPerMonth.map((d) => d.value)) + 2}
          />
        </View>
      )}

      {/* Month Picker Modal */}
      <Modal
        visible={showMonthPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMonthPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMonthPicker(false)}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Select Month
            </Text>
            <FlatList
              data={[null, ...availableMonths]}
              keyExtractor={(item) => (item === null ? "all" : String(item))}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.monthOption,
                    selectedMonth === item && {
                      backgroundColor: theme.colors.primary + "20",
                    },
                  ]}
                  onPress={() => {
                    setSelectedMonth(item);
                    setShowMonthPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.monthOptionText,
                      { color: theme.colors.text },
                      selectedMonth === item && {
                        color: theme.colors.primary,
                        fontWeight: "600",
                      },
                    ]}
                  >
                    {item === null ? "All Months" : MONTH_NAMES[item]}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Pie Charts Row */}
      <View style={styles.pieRow}>
        {/* Release Type Distribution */}
        <View
          style={[styles.pieCard, { backgroundColor: theme.colors.surface }]}
        >
          <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
            Jump Types
          </Text>
          <View style={styles.pieContainer}>
            <PieChart
              data={releaseTypeData}
              radius={60}
              textColor={theme.colors.text}
              textSize={12}
              showText
              focusOnPress
            />
          </View>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#4ECDC4" }]}
              />
              <Text
                style={[
                  styles.legendText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Static Line
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#FF6B6B" }]}
              />
              <Text
                style={[
                  styles.legendText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Free Fall
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#9B59B6" }]}
              />
              <Text
                style={[
                  styles.legendText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                FF {">"}2km
              </Text>
            </View>
          </View>
        </View>

        {/* Accepted vs Pending */}
        <View
          style={[styles.pieCard, { backgroundColor: theme.colors.surface }]}
        >
          <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
            Accepted Status
          </Text>
          <View style={styles.pieContainer}>
            <PieChart
              data={acceptedData}
              radius={60}
              innerRadius={35}
              textColor={theme.colors.text}
              textSize={12}
              showText
              focusOnPress
              centerLabelComponent={() => (
                <Text
                  style={[styles.donutCenter, { color: theme.colors.text }]}
                >
                  {jumps.length}
                </Text>
              )}
            />
          </View>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#2ECC71" }]}
              />
              <Text
                style={[
                  styles.legendText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Accepted
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#E74C3C" }]}
              />
              <Text
                style={[
                  styles.legendText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Pending
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Top Dropzones */}
      {topDropzones.length > 0 && (
        <View
          style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}
        >
          <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
            Top Dropzones
          </Text>
          <BarChart
            data={topDropzones}
            barWidth={40}
            spacing={24}
            roundedTop
            xAxisThickness={1}
            yAxisThickness={1}
            xAxisColor={theme.colors.border}
            yAxisColor={theme.colors.border}
            yAxisTextStyle={{ color: theme.colors.textSecondary }}
            xAxisLabelTextStyle={{
              color: theme.colors.textSecondary,
              fontSize: 10,
            }}
            noOfSections={4}
            maxValue={Math.max(...topDropzones.map((d) => d.value)) + 2}
          />
        </View>
      )}

      {/* Altitude Progression */}
      {altitudeData.length > 1 && (
        <View
          style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}
        >
          <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
            Altitude Progression
          </Text>
          <Text
            style={[
              styles.chartSubtitle,
              { color: theme.colors.textSecondary },
            ]}
          >
            Exit altitude over time (meters)
          </Text>
          <LineChart
            data={altitudeData}
            color="#9B59B6"
            thickness={2}
            curved
            hideDataPoints={altitudeData.length > 20}
            dataPointsColor="#9B59B6"
            xAxisThickness={1}
            yAxisThickness={1}
            xAxisColor={theme.colors.border}
            yAxisColor={theme.colors.border}
            yAxisTextStyle={{ color: theme.colors.textSecondary }}
            xAxisLabelTextStyle={{ color: theme.colors.textSecondary }}
            noOfSections={4}
          />
        </View>
      )}

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
  chartCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  chartTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 12,
  },
  chartSubtitle: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginBottom: 8,
    marginTop: -8,
  },
  pieRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  pieCard: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
  },
  pieContainer: {
    marginVertical: 8,
  },
  legend: {
    marginTop: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  donutCenter: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    maxHeight: 300,
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 12,
    textAlign: "center",
  },
  yearOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  yearOptionText: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  monthContainer: {
    marginBottom: 16,
  },
  monthLabel: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 5,
  },
  monthButton: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  monthButtonText: {
    fontSize: 16,
    fontFamily: "Inter_300Light",
  },
  monthOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  monthOptionText: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
