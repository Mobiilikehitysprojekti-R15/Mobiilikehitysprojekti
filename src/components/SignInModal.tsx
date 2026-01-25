import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { SignInModalProps } from "../types/signInModal";
import React, { useState } from "react";
import { auth, db } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import StyledTextInput from "./StyledTextInput";
import StyledButton from "./StyledButton";

const LICENSE_TYPES = ["Student", "A", "B", "C", "D"] as const;
type LicenseType = (typeof LICENSE_TYPES)[number];

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const MONTHS = [
  { value: 0, label: "January" },
  { value: 1, label: "February" },
  { value: 2, label: "March" },
  { value: 3, label: "April" },
  { value: 4, label: "May" },
  { value: 5, label: "June" },
  { value: 6, label: "July" },
  { value: 7, label: "August" },
  { value: 8, label: "September" },
  { value: 9, label: "October" },
  { value: 10, label: "November" },
  { value: 11, label: "December" },
];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => currentYear - i);

const SignInModal = ({ visible, onClose }: SignInModalProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [licenseType, setLicenseType] = useState<LicenseType>("Student");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDay, setBirthDay] = useState<number | null>(null);
  const [birthMonth, setBirthMonth] = useState<number | null>(null);
  const [birthYear, setBirthYear] = useState<number | null>(null);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setName("");
    setLicenseType("Student");
    setAddress("");
    setPhoneNumber("");
    setBirthDay(null);
    setBirthMonth(null);
    setBirthYear(null);
  };

  const handleToggleMode = () => {
    resetForm();
    setIsSignUp(!isSignUp);
  };

  const handleClose = () => {
    resetForm();
    setIsSignUp(false);
    onClose();
  };

  const getDateOfBirth = (): Date | null => {
    if (birthDay && birthMonth !== null && birthYear) {
      return new Date(birthYear, birthMonth, birthDay);
    }
    return null;
  };

  const handleSubmit = async () => {
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (isSignUp) {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      if (!name.trim()) {
        setError("Please enter your name");
        return;
      }

      if (!address.trim()) {
        setError("Please enter your address");
        return;
      }

      if (!phoneNumber.trim()) {
        setError("Please enter your phone number");
        return;
      }

      if (birthDay === null || birthMonth === null || birthYear === null) {
        setError("Please select your date of birth");
        return;
      }
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );

        const dateOfBirth = getDateOfBirth();
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: name.trim(),
          email: email.toLowerCase(),
          licenseType,
          address: address.trim(),
          phoneNumber: phoneNumber.trim(),
          dateOfBirth: dateOfBirth?.toISOString(),
          createdAt: new Date().toISOString(),
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      handleClose();
    } catch (err: any) {
      const errorCode = err.code;
      switch (errorCode) {
        case "auth/email-already-in-use":
          setError("Email is already in use");
          break;
        case "auth/invalid-email":
          setError("Invalid email address");
          break;
        case "auth/weak-password":
          setError("Password is too weak");
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setError("Invalid email or password");
          break;
        default:
          setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent={true} onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {isSignUp ? "Sign Up" : "Sign In"}
          </Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
          >
            <StyledTextInput
              label="Email"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />
            <StyledTextInput
              label="Password"
              style={styles.input}
              secureTextEntry={true}
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />
            {isSignUp && (
              <>
                <StyledTextInput
                  label="Confirm Password"
                  style={styles.input}
                  secureTextEntry={true}
                  autoCapitalize="none"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  editable={!loading}
                />
                <StyledTextInput
                  label="Full Name"
                  style={styles.input}
                  autoCapitalize="words"
                  value={name}
                  onChangeText={setName}
                  editable={!loading}
                />

                <Text style={styles.sectionLabel}>License Type</Text>
                <View style={styles.licenseContainer}>
                  {LICENSE_TYPES.map((type) => (
                    <StyledButton
                      key={type}
                      title={type}
                      variant={licenseType === type ? "filled" : "outline"}
                      onPress={() => setLicenseType(type)}
                      disabled={loading}
                      style={styles.licenseButton}
                    />
                  ))}
                </View>

                <StyledTextInput
                  label="Address"
                  style={styles.input}
                  autoCapitalize="words"
                  value={address}
                  onChangeText={setAddress}
                  editable={!loading}
                />
                <StyledTextInput
                  label="Phone Number"
                  style={styles.input}
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  editable={!loading}
                />

                <Text style={styles.sectionLabel}>Date of Birth</Text>
                <View style={styles.dobContainer}>
                  <View style={styles.pickerWrapper}>
                    <Picker<number | null>
                      selectedValue={birthDay}
                      onValueChange={(value: number | null) =>
                        setBirthDay(value)
                      }
                      enabled={!loading}
                      style={styles.picker}
                    >
                      <Picker.Item label="Day" value={null} />
                      {DAYS.map((day) => (
                        <Picker.Item
                          key={day}
                          label={String(day)}
                          value={day}
                        />
                      ))}
                    </Picker>
                  </View>

                  <View style={styles.pickerWrapper}>
                    <Picker<number | null>
                      selectedValue={birthMonth}
                      onValueChange={(value: number | null) =>
                        setBirthMonth(value)
                      }
                      enabled={!loading}
                      style={styles.picker}
                    >
                      <Picker.Item label="Month" value={null} />
                      {MONTHS.map((month) => (
                        <Picker.Item
                          key={month.value}
                          label={month.label}
                          value={month.value}
                        />
                      ))}
                    </Picker>
                  </View>

                  <View style={styles.pickerWrapper}>
                    <Picker<number | null>
                      selectedValue={birthYear}
                      onValueChange={(value: number | null) =>
                        setBirthYear(value)
                      }
                      enabled={!loading}
                      style={styles.picker}
                    >
                      <Picker.Item label="Year" value={null} />
                      {YEARS.map((year) => (
                        <Picker.Item
                          key={year}
                          label={String(year)}
                          value={year}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
              </>
            )}
          </ScrollView>

          <StyledButton
            title={isSignUp ? "Sign Up" : "Sign In"}
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>
              {isSignUp
                ? "Already have an account? "
                : "Don't have an account? "}
            </Text>
            <Pressable onPress={handleToggleMode} disabled={loading}>
              <Text style={styles.toggleLink}>
                {isSignUp ? "Sign In" : "Sign Up"}
              </Text>
            </Pressable>
          </View>
          <StyledButton
            title="Close"
            onPress={handleClose}
            disabled={loading}
            style={styles.closeButton}
          />
        </View>
      </View>
    </Modal>
  );
};

export default SignInModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    gap: 10,
    width: "90%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollView: {
    width: "100%",
    maxHeight: 400,
  },
  scrollViewContent: {
    gap: 10,
    paddingBottom: 10,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  licenseContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    width: "100%",
  },
  licenseButton: {
    marginTop: 0,
  },
  dobContainer: {
    flexDirection: "column",
    gap: 10,
    width: "100%",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  picker: {
    height: 50,
  },
  errorText: {
    color: "red",
    fontSize: 14,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggleText: {
    fontSize: 15,
  },
  toggleLink: {
    color: "#007AFF",
    fontWeight: "500",
    fontSize: 15,
  },
  submitButton: {
    width: "100%",
    marginTop: 10,
  },
  closeButton: {
    width: "100%",
    marginTop: 0,
  },
});
