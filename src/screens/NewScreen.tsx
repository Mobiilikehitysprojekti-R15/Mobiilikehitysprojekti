import React, { useState, useEffect } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useAuth } from "../context/AuthContext";
import ProfileAuth from "../components/ProfileAuth";
import StyledTextInput from "../components/StyledTextInput";
import StyledButton from "../components/StyledButton";
import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { JumpFormData } from "../types/jumpFormData";

const initialFormData: JumpFormData = {
  jumpNumber: "",
  jumpDate: new Date(),
  dropzone: "",
  plane: "",
  altitude: "",
  canopy: "",
  releaseType: "Static line",
  isAccepted: false,
  freefallTime: "",
  notes: "",
};

type Props = {};

const NewScreen = (props: Props) => {
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState<JumpFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchNextJumpNumber = async () => {
      if (!user) return;

      try {
        const jumpsRef = collection(db, "users", user.uid, "jumps");
        const q = query(jumpsRef, orderBy("jumpNumber", "desc"), limit(1));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const highestJump = querySnapshot.docs[0].data();
          const nextNumber = (highestJump.jumpNumber ?? 0) + 1;
          setFormData((prev) => ({ ...prev, jumpNumber: String(nextNumber) }));
        } else {
          setFormData((prev) => ({ ...prev, jumpNumber: "1" }));
        }
      } catch (error) {
        console.error("Error fetching jump number:", error);
        setFormData((prev) => ({ ...prev, jumpNumber: "1" }));
      }
    };

    fetchNextJumpNumber();
  }, [user]);

  const updateField = <K extends keyof JumpFormData>(
    field: K,
    value: JumpFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    if (!formData.dropzone.trim()) {
      Alert.alert("Error", "Please enter a dropzone ICAO code");
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "users", user.uid, "jumps"), {
        ...formData,
        jumpNumber: formData.jumpNumber ? Number(formData.jumpNumber) : null,
        jumpDate: formData.jumpDate.toISOString(),
        altitude: formData.altitude ? Number(formData.altitude) : null,
        freefallTime: formData.freefallTime
          ? Number(formData.freefallTime)
          : null,
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Success", "Jump added successfully");
      setFormData(initialFormData);
    } catch (error) {
      console.error("Error adding jump:", error);
      Alert.alert("Error", "Failed to add jump. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return <ProfileAuth text="Please sign in to add new jump" />;
  }

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      updateField("jumpDate", selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fi-FI", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inputRow}>
        <View style={styles.inputRowItem}>
          <StyledTextInput
            label="Jump Number"
            onChangeText={(value) => updateField("jumpNumber", value)}
            value={formData.jumpNumber}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputRowItemSmall}>
          <StyledTextInput
            label="Dropzone"
            onChangeText={(value) => updateField("dropzone", value.toUpperCase())}
            value={formData.dropzone}
            maxLength={4}
            autoCapitalize="characters"
          />
        </View>
      </View>

      <View style={styles.dateContainer}>
        <Text style={styles.dateLabel}>Jump Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {formatDate(formData.jumpDate)}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={formData.jumpDate}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>

      <StyledTextInput
        label="Plane"
        onChangeText={(value) => updateField("plane", value)}
        value={formData.plane}
      />

      <StyledTextInput
        label="Altitude"
        onChangeText={(value) => updateField("altitude", value)}
        value={formData.altitude}
        keyboardType="numeric"
      />

      <StyledTextInput
        label="Canopy"
        onChangeText={(value) => updateField("canopy", value)}
        value={formData.canopy}
      />

      <View style={styles.checkboxRow}>
        <View style={styles.switchContainer}>
          <Text
            style={[
              styles.switchLabel,
              formData.releaseType === "Static line" &&
              styles.switchLabelActive,
            ]}
          >
            Static line
          </Text>
          <TouchableOpacity
            style={styles.switch}
            onPress={() =>
              updateField(
                "releaseType",
                formData.releaseType === "Static line"
                  ? "Free fall"
                  : "Static line",
              )
            }
          >
            <View
              style={[
                styles.switchThumb,
                formData.releaseType === "Free fall" && styles.switchThumbRight,
              ]}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.switchLabel,
              formData.releaseType === "Free fall" && styles.switchLabelActive,
            ]}
          >
            Free fall
          </Text>
        </View>

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => updateField("isAccepted", !formData.isAccepted)}
        >
          <View
            style={[
              styles.checkbox,
              formData.isAccepted && styles.checkboxChecked,
            ]}
          >
            {formData.isAccepted && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>Accepted</Text>
        </TouchableOpacity>
      </View>

      <StyledTextInput
        label="Freefall Time"
        onChangeText={(value) => updateField("freefallTime", value)}
        value={formData.freefallTime}
        keyboardType="numeric"
      />

      <StyledTextInput
        label="Notes"
        inputStyle={styles.notesInput}
        onChangeText={(value) => updateField("notes", value)}
        value={formData.notes}
        multiline
      />

      <StyledButton
        title="Submit"
        onPress={handleSubmit}
        loading={submitting}
      />
    </ScrollView>
  );
};

export default NewScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
  },
  inputRowItem: {
    flex: 1,
  },
  inputRowItemSmall: {
    flex: 1,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  dateContainer: {
    marginTop: 10,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    fontFamily: "Inter_400Regular",
  },
  dateButton: {
    height: 50,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  dateButtonText: {
    fontSize: 16,
    fontFamily: "Inter_300Light",
    color: "#000",
  },
  checkboxRow: {
    flexDirection: "row",
    marginTop: 20,
    gap: 30,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  checkmark: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  checkboxLabel: {
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  switchLabel: {
    fontSize: 16,
    color: "#999",
  },
  switchLabelActive: {
    color: "#000",
    fontWeight: "600",
  },
  switch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#ccc",
    justifyContent: "center",
    padding: 2,
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  switchThumbRight: {
    alignSelf: "flex-end",
  },
});
