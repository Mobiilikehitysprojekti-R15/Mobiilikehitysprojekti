import { useEffect, useState, useMemo, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { db } from "../config/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { JumpData } from "../types/jumpDataFirebase";

export const MONTH_NAMES = [
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

export type JumpType = "Static line" | "Free fall" | "Free fall >2km";

export interface BarDataItem {
  value: number;
  label: string;
  frontColor: string;
  onPress?: () => void;
}

export interface PieDataItem {
  value: number;
  color: string;
  text?: string;
  label?: string;
  onPress?: () => void;
}

export interface LineDataItem {
  value: number;
  label: string;
  dataPointText: string;
}

export const useJumpStats = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [jumps, setJumps] = useState<JumpData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedJumpType, setSelectedJumpType] = useState<JumpType | null>(null);
  const [selectedAcceptedStatus, setSelectedAcceptedStatus] = useState<boolean | null>(null);
  const [selectedDropzone, setSelectedDropzone] = useState<string | null>(null);

  // Fetch jumps from Firebase
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

  // Calculate available years from jumps
  const availableYears = useMemo(() => {
    return [...new Set(jumps.map((j) => new Date(j.jumpDate).getFullYear()))].sort(
      (a, b) => b - a
    );
  }, [jumps]);

  // Auto-select the most recent year when data loads
  useEffect(() => {
    if (availableYears.length > 0 && selectedYear === null) {
      setSelectedYear(String(availableYears[0]));
    }
  }, [availableYears, selectedYear]);

  // Filter jumps by selected year
  const yearFilteredJumps = useMemo(() => {
    return jumps.filter((j) => {
      const date = new Date(j.jumpDate);
      return selectedYear === null || date.getFullYear() === parseInt(selectedYear);
    });
  }, [jumps, selectedYear]);

  // Calculate available months from year-filtered jumps
  const availableMonths = useMemo(() => {
    return [...new Set(yearFilteredJumps.map((j) => new Date(j.jumpDate).getMonth()))].sort(
      (a, b) => a - b
    );
  }, [yearFilteredJumps]);

  // Helper to check if a jump matches the selected jump type
  const matchesJumpType = useCallback(
    (j: JumpData) => {
      if (selectedJumpType === null) return true;
      if (selectedJumpType === "Static line") return j.releaseType === "Static line";
      if (selectedJumpType === "Free fall") {
        return j.releaseType === "Free fall" && (j.altitude === null || j.altitude <= 2000);
      }
      if (selectedJumpType === "Free fall >2km") {
        return j.releaseType === "Free fall" && j.altitude !== null && j.altitude > 2000;
      }
      return true;
    },
    [selectedJumpType]
  );

  // Jumps filtered by all criteria except jump type (for Jump Types chart)
  const jumpsForJumpTypeChart = useMemo(() => {
    return yearFilteredJumps.filter((j) => {
      const date = new Date(j.jumpDate);
      const monthMatch = selectedMonth === null || date.getMonth() === selectedMonth;
      const acceptedMatch = selectedAcceptedStatus === null || j.isAccepted === selectedAcceptedStatus;
      const dropzoneMatch = selectedDropzone === null || j.dropzone === selectedDropzone;
      return monthMatch && acceptedMatch && dropzoneMatch;
    });
  }, [yearFilteredJumps, selectedMonth, selectedAcceptedStatus, selectedDropzone]);

  // Jumps filtered by all criteria except accepted status (for Accepted Status chart)
  const jumpsForAcceptedChart = useMemo(() => {
    return yearFilteredJumps.filter((j) => {
      const date = new Date(j.jumpDate);
      const monthMatch = selectedMonth === null || date.getMonth() === selectedMonth;
      const jumpTypeMatch = matchesJumpType(j);
      const dropzoneMatch = selectedDropzone === null || j.dropzone === selectedDropzone;
      return monthMatch && jumpTypeMatch && dropzoneMatch;
    });
  }, [yearFilteredJumps, selectedMonth, matchesJumpType, selectedDropzone]);

  // Apply all filters (for jump list and summary stats)
  const filteredJumps = useMemo(() => {
    return yearFilteredJumps.filter((j) => {
      const date = new Date(j.jumpDate);
      const monthMatch = selectedMonth === null || date.getMonth() === selectedMonth;
      const jumpTypeMatch = matchesJumpType(j);
      const acceptedMatch = selectedAcceptedStatus === null || j.isAccepted === selectedAcceptedStatus;
      const dropzoneMatch = selectedDropzone === null || j.dropzone === selectedDropzone;
      return monthMatch && jumpTypeMatch && acceptedMatch && dropzoneMatch;
    });
  }, [yearFilteredJumps, selectedMonth, matchesJumpType, selectedAcceptedStatus, selectedDropzone]);

  // Generate active filters text for subheader
  const activeFiltersText = useMemo(() => {
    const filters: string[] = [];
    if (selectedMonth !== null) filters.push(MONTH_NAMES[selectedMonth]);
    if (selectedJumpType) filters.push(selectedJumpType);
    if (selectedAcceptedStatus !== null)
      filters.push(selectedAcceptedStatus ? "Accepted" : "Pending");
    if (selectedDropzone) filters.push(selectedDropzone);
    return filters.length > 0 ? `Filtering by: ${filters.join(", ")}` : null;
  }, [selectedMonth, selectedJumpType, selectedAcceptedStatus, selectedDropzone]);

  // Calculate total freefall time
  const totalFreefallTime = useMemo(() => {
    return filteredJumps.reduce((acc, jump) => acc + (jump.freefallTime || 0), 0);
  }, [filteredJumps]);

  // Chart data: Jumps per month
  const jumpsPerMonthData = useMemo((): BarDataItem[] => {
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
        frontColor: isSelected ? theme.colors.primary : theme.colors.primary + "60",
        onPress: () => {
          setSelectedMonth(isSelected ? null : monthIndex);
        },
      };
    });
  }, [yearFilteredJumps, selectedMonth, theme.colors.primary]);

  // Chart data: Release type distribution
  const releaseTypeData = useMemo((): PieDataItem[] => {
    const staticLine = jumpsForJumpTypeChart.filter(
      (j) => j.releaseType === "Static line"
    ).length;
    const freeFallLow = jumpsForJumpTypeChart.filter(
      (j) =>
        j.releaseType === "Free fall" && (j.altitude === null || j.altitude <= 2000)
    ).length;
    const freeFallHigh = jumpsForJumpTypeChart.filter(
      (j) =>
        j.releaseType === "Free fall" && j.altitude !== null && j.altitude > 2000
    ).length;

    if (staticLine === 0 && freeFallLow === 0 && freeFallHigh === 0) {
      return [{ value: 1, color: theme.colors.border, text: "No data" }];
    }

    const isStaticSelected = selectedJumpType === "Static line";
    const isFreefallSelected = selectedJumpType === "Free fall";
    const isFreefallHighSelected = selectedJumpType === "Free fall >2km";
    const hasSelection = selectedJumpType !== null;

    return [
      {
        value: staticLine,
        color: hasSelection && !isStaticSelected ? "#4ECDC460" : "#4ECDC4",
        text: `${staticLine}`,
        label: "Static",
        onPress: () => setSelectedJumpType(isStaticSelected ? null : "Static line"),
      },
      {
        value: freeFallLow,
        color: hasSelection && !isFreefallSelected ? "#FF6B6B60" : "#FF6B6B",
        text: `${freeFallLow}`,
        label: "Freefall",
        onPress: () => setSelectedJumpType(isFreefallSelected ? null : "Free fall"),
      },
      {
        value: freeFallHigh,
        color: hasSelection && !isFreefallHighSelected ? "#9B59B660" : "#9B59B6",
        text: `${freeFallHigh}`,
        label: ">2km",
        onPress: () => setSelectedJumpType(isFreefallHighSelected ? null : "Free fall >2km"),
      },
    ].filter((d) => d.value > 0);
  }, [jumpsForJumpTypeChart, selectedJumpType, theme.colors.border]);

  // Chart data: Accepted status distribution
  const acceptedData = useMemo((): PieDataItem[] => {
    const accepted = jumpsForAcceptedChart.filter((j) => j.isAccepted).length;
    const pending = jumpsForAcceptedChart.filter((j) => !j.isAccepted).length;

    if (accepted === 0 && pending === 0) {
      return [{ value: 1, color: theme.colors.border }];
    }

    const isAcceptedSelected = selectedAcceptedStatus === true;
    const isPendingSelected = selectedAcceptedStatus === false;
    const hasSelection = selectedAcceptedStatus !== null;

    return [
      {
        value: accepted,
        color: hasSelection && !isAcceptedSelected ? "#2ECC7160" : "#2ECC71",
        text: `${accepted}`,
        onPress: () => setSelectedAcceptedStatus(isAcceptedSelected ? null : true),
      },
      {
        value: pending,
        color: hasSelection && !isPendingSelected ? "#E74C3C60" : "#E74C3C",
        text: `${pending}`,
        onPress: () => setSelectedAcceptedStatus(isPendingSelected ? null : false),
      },
    ].filter((d) => d.value > 0);
  }, [jumpsForAcceptedChart, selectedAcceptedStatus, theme.colors.border]);

  // Chart data: Top dropzones
  const topDropzonesData = useMemo((): BarDataItem[] => {
    const dropzoneCounts: { [key: string]: number } = {};

    yearFilteredJumps.forEach((jump) => {
      if (jump.dropzone) {
        dropzoneCounts[jump.dropzone] = (dropzoneCounts[jump.dropzone] || 0) + 1;
      }
    });

    const sorted = Object.entries(dropzoneCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return sorted.map(([dz, count]) => {
      const isSelected = selectedDropzone === dz;
      const hasSelection = selectedDropzone !== null;
      return {
        value: count,
        label: dz,
        frontColor:
          hasSelection && !isSelected
            ? theme.colors.primary + "60"
            : theme.colors.primary,
        onPress: () => setSelectedDropzone(isSelected ? null : dz),
      };
    });
  }, [yearFilteredJumps, selectedDropzone, theme.colors.primary]);

  // Chart data: Altitude progression
  const altitudeProgressionData = useMemo((): LineDataItem[] => {
    const filteredJumpsWithAltitude = filteredJumps.filter(
      (j) => j.altitude !== null && j.altitude > 0
    );

    return filteredJumpsWithAltitude.map((jump, index) => ({
      value: jump.altitude || 0,
      label:
        index % Math.ceil(filteredJumpsWithAltitude.length / 5) === 0
          ? `#${jump.jumpNumber}`
          : "",
      dataPointText: "",
    }));
  }, [filteredJumps]);

  // Total count for accepted chart center label
  const acceptedChartTotal = jumpsForAcceptedChart.length;

  // Reset month when year changes
  const handleYearChange = useCallback((year: string | null) => {
    setSelectedYear(year);
    setSelectedMonth(null);
  }, []);

  return {
    // Loading state
    loading,
    jumps,

    // Filter state
    selectedYear,
    setSelectedYear: handleYearChange,
    selectedMonth,
    setSelectedMonth,
    selectedJumpType,
    setSelectedJumpType,
    selectedAcceptedStatus,
    setSelectedAcceptedStatus,
    selectedDropzone,
    setSelectedDropzone,

    // Derived data
    availableYears,
    availableMonths,
    filteredJumps,
    activeFiltersText,
    totalFreefallTime,
    acceptedChartTotal,

    // Chart data
    jumpsPerMonthData,
    releaseTypeData,
    acceptedData,
    topDropzonesData,
    altitudeProgressionData,
  };
};
