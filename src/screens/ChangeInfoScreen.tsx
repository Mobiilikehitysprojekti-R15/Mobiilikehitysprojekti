import {StyleSheet, Text, View, ScrollView, Alert, TouchableOpacity, SafeAreaView,} from "react-native";
import { useEffect, useState } from "react";
import StyledButton from "../components/StyledButton";
import { useAuth } from "../context/AuthContext";
import { db } from "../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";
import StyledTextInput from "../components/StyledTextInput";
import { useTheme } from "../context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAvoidingView, Platform } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

const LICENSE_TYPES = ["Student", "A", "B", "C", "D"] as const;

type RootStackParamList = {
  ChangeInfo: { onSave?: (updatedProfile: any) => void };
};

type ChangeInfoScreenRouteProp = RouteProp<RootStackParamList, "ChangeInfo">;

const ChangeInfoScreen = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const route = useRoute<any>();
  const navigation = useNavigation();
  const [showALicensePicker, setShowALicensePicker] = useState(false);
  const [showApprovedEquipPicker, setShowApprovedEquipPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showReserveExpiresPicker, setShowReserveExpiresPicker] = useState(false);
  const [showExitExpiresPicker, setShowExitExpiresPicker] = useState(false);
  const [showLandingExpiresPicker, setShowLandingExpiresPicker] = useState(false);
  const [showHealthGuaranteeExpiresPicker, setShowHealthGuaranteeExpiresPicker] = useState(false);
  const { onSave } = route.params || {};

  const [form, setForm] = useState({
    // personal info
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",

    // basic info
    licenseType: "",
    club: "",
    beginnersCourse: "",
    harnessContainerSystem: "",
    trainingSystem: "",
    altimeter: "",
    aircraft: "",

    studentQualification: "",
    useOfHDPilotChute: "",
    basicTraining: "",
    advancedTraining: "",

    aLicenseVerified: "",
    approvedPersonalEquipment: "",

    mainCanopy: "",
    harness: "",

    restrictions: "",
    iceContacts: "",

    healthGuaranteeExpires: new Date(),

    //these are different kind of exams that expire if license is a student
    reserveExpires: new Date(),
    exitExpires: new Date(),
    landingExpires: new Date(),

  });

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user) return;

        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          setForm({
            name: snap.data().name ?? "",
            email: snap.data().email ?? "",
            phoneNumber: snap.data().phoneNumber ?? "",
            address: snap.data().address ?? "",
            dateOfBirth: snap.data().dateOfBirth ??  "",
            licenseType: snap.data().licenseType ?? "",
            club: snap.data().club ?? "",
            beginnersCourse: snap.data().beginnersCourse ?? "",
            harnessContainerSystem: snap.data().harnessContainerSystem ?? "",
            trainingSystem: snap.data().trainingSystem ?? "",
            altimeter: snap.data().altimeter ?? "",
            aircraft: snap.data().aircraft ?? "",

            studentQualification: snap.data().studentQualification ?? "",
            useOfHDPilotChute: snap.data().useOfHDPilotChute ?? "",
            basicTraining: snap.data().basicTraining ?? "",
            advancedTraining: snap.data().advancedTraining ?? "",

            aLicenseVerified: snap.data().aLicenseVerified ?? "",
            approvedPersonalEquipment: snap.data().approvedPersonalEquipment ?? "",
            mainCanopy: snap.data().mainCanopy ?? "",
            harness: snap.data().harness ?? "",

            restrictions: snap.data().restrictions ?? "",
            iceContacts: snap.data().iceContacts ?? "",

            healthGuaranteeExpires: snap.data().healthGuaranteeExpires ?? new Date(),
            reserveExpires: snap.data().reserveExpires ?? new Date(),
            exitExpires: snap.data().exitExpires ?? new Date(),
            landingExpires: snap.data().landingExpires ?? new Date(),
          });
        }
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    try {
      if (!user) return;

      await updateDoc(doc(db, "users", user.uid), form);
      Alert.alert("Saved", "Information updated successfully");

      route.params?.onSave?.();

      navigation.goBack(); // navigoi takaisin automaattisesti
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save changes");
    }
  } ;

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safe,{ backgroundColor: theme.colors.background },]}>
      <KeyboardAvoidingView style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20} // tarvittaessa säädä
      >
        <ScrollView contentContainerStyle={[styles.container,
          { backgroundColor: theme.colors.background, paddingBottom: 32 + insets.bottom, }, ]}>
          {/* Basic info */}
          <StyledTextInput
            label="Name"
            value={form.name}
            onChangeText={(v) => handleChange("name", v)}
          />
          <StyledTextInput
            label="Email"
            value={form.email}
            onChangeText={(v) => handleChange("email", v)}
          />
          <StyledTextInput
            label="Phone Number"
            value={form.phoneNumber}
            onChangeText={(v) => handleChange("phoneNumber", v)}
          />
          <StyledTextInput
            label="Address"
            value={form.address}
            onChangeText={(v) => handleChange("address", v)}
          />
          <StyledTextInput
            label="Date of Birth"
            value={form.dateOfBirth ? new Date(form.dateOfBirth).toLocaleDateString() : ""}
            onFocus={() => setShowDatePicker(true)}
          />

          
          {showDatePicker && (

            <View>
              <DateTimePicker
              value={form.dateOfBirth ? new Date(form.dateOfBirth) : new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) handleChange("dateOfBirth", date.toISOString());
              }}
            />
            </View>
          )}

          




          <View style={[styles.field, { marginBottom: 4 }]}>
            <Text style={[styles.label, { color: theme.colors.text, marginTop: 10, }]}>
              License Type
            </Text>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 4, }}>
              {LICENSE_TYPES.map((type) => {
                const selected = form.licenseType === type;

                return (
                  <TouchableOpacity
                    key={type}
                    onPress={() => handleChange("licenseType", type)}
                    style={[
                      styles.radioOption,
                      {
                        borderColor: selected ? theme.colors.primary : theme.colors.border,
                        backgroundColor: selected ? theme.colors.primary + "22" : theme.colors.background,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: selected ? theme.colors.primary : theme.colors.text,
                        fontWeight: selected ? "600" : "400",
                      }}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        

        {
            form.licenseType === "Student" && (

              <View style={{ marginBottom: 16 }}>
                <StyledTextInput
                  label="Exit test expires"
                  value={form.exitExpires ? new Date(form.exitExpires).toLocaleDateString() : ""}
                  onFocus={() => setShowExitExpiresPicker(true)}
                />
                <StyledTextInput
                  label="Reserve test expires"
                  value={form.reserveExpires ? new Date(form.reserveExpires).toLocaleDateString() : ""}
                  onFocus={() => setShowReserveExpiresPicker(true)}
                />
              </View>
            )
          }


          {showExitExpiresPicker && (

            <View>
              <DateTimePicker
              value={new Date(Date.now())}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowExitExpiresPicker(false);
                if (date) handleChange("exitExpires", date.toISOString());
              }}
            />
            </View>
          )}
          {showReserveExpiresPicker && (

            <View>
              <DateTimePicker
              value={new Date(Date.now())}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowReserveExpiresPicker(false);
                if (date) handleChange("reserveExpires", date.toISOString());
              }}
            />
            </View>
          )}


          <StyledTextInput label="Club" value={form.club} onChangeText={(v) => handleChange("club", v)} />
          <StyledTextInput label="Primary Training" value={form.beginnersCourse} onChangeText={(v) => handleChange("beginnersCourse", v)} />
          <StyledTextInput label="Harness-Container System" value={form.harnessContainerSystem} onChangeText={(v) => handleChange("harnessContainerSystem", v)} />
      
      <View style={[styles.field, { marginBottom: 4 }]}>
        <Text style={[
              styles.label,{
              color: theme.colors.text,
              marginTop: 10,
            },
          ]}
        > Training Program</Text>

        <View style={{
              flexDirection: "row",
              marginTop: 6,
              gap: 10,
          }}
        >
          {["AFF", "Static Line"].map((prog) => {
            const selected = form.trainingSystem === prog;

            return (
              <TouchableOpacity
                key={prog}
                onPress={() => handleChange("trainingSystem", prog)}
                style={[
                  styles.radioOption,
                  {
                    borderColor: selected
                      ? theme.colors.primary
                      : theme.colors.border,
                    backgroundColor: selected
                      ? theme.colors.primary + "22"
                      : theme.colors.background,
                  },
                ]}
              >
                <Text
                  style={{
                    color: selected
                      ? theme.colors.primary
                      : theme.colors.text,
                    fontWeight: selected ? "600" : "400",
                  }}
                >
                  {prog}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      
      <StyledTextInput label="Altimeter" value={form.altimeter} onChangeText={(v) => handleChange("altimeter", v)} />
      <StyledTextInput label="Drop Zone Aircraft" value={form.aircraft} onChangeText={(v) => handleChange("aircraft", v)} />

      {/* Training status */}
      <StyledTextInput label="Student Qualification" value={form.studentQualification} onChangeText={(v) => handleChange("studentQualification", v)} />
      <StyledTextInput label="Use of HD Pilot Chute" value={form.useOfHDPilotChute} onChangeText={(v) => handleChange("useOfHDPilotChute", v)} />
      <StyledTextInput label="Basic Training" value={form.basicTraining} onChangeText={(v) => handleChange("basicTraining", v)} />
      <StyledTextInput label="Advanced Training" value={form.advancedTraining} onChangeText={(v) => handleChange("advancedTraining", v)} />

      {/* Licenses & equipment */}

      <View style={styles.dateContainer}>
        <Text style={[styles.dateLabel, { color: theme.colors.text }]}>A-License Requirements Verified</Text>

        <TouchableOpacity
          style={[
            styles.dateButton,
            {
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.background,
            },
          ]}
          onPress={() => setShowALicensePicker(true)}
        >
          <Text style={[styles.dateButtonText, { color: theme.colors.text }]}>
            {form.aLicenseVerified
              ? new Date(form.aLicenseVerified).toLocaleDateString()
              : "Select date"}
          </Text>
        </TouchableOpacity>

        {showALicensePicker && (
          <DateTimePicker
            value={form.aLicenseVerified ? new Date(form.aLicenseVerified) : new Date()}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowALicensePicker(false);
              if (date) handleChange("aLicenseVerified", date.toISOString());
            }}
          />
        )}
      </View>

      <View style={styles.dateContainer}>
        <Text style={[styles.dateLabel, { color: theme.colors.text }]}>Approved Use of Personal Equipment</Text>

        <TouchableOpacity
          style={[
            styles.dateButton,
            {
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.background,
            },
          ]}
          onPress={() => setShowApprovedEquipPicker(true)}
        >
          <Text style={[styles.dateButtonText, { color: theme.colors.text }]}>
            {form.approvedPersonalEquipment
              ? new Date(form.approvedPersonalEquipment).toLocaleDateString()
              : "Select date"}
          </Text>
        </TouchableOpacity>

        {showApprovedEquipPicker && (
          <DateTimePicker
            value={
              form.approvedPersonalEquipment
                ? new Date(form.approvedPersonalEquipment)
                : new Date()
            }
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowApprovedEquipPicker(false);
              if (date)
                handleChange("approvedPersonalEquipment", date.toISOString());
            }}
          />
        )}
      </View>
      
      <StyledTextInput label="Personal Equipment: Main Canopy" value={form.mainCanopy} onChangeText={(v) => handleChange("mainCanopy", v)} />
      <StyledTextInput label="Personal Equipment: Harness" value={form.harness} onChangeText={(v) => handleChange("harness", v)} />

      {/* Other */}
      <StyledTextInput
        label="Restrictions"
        value={form.restrictions}
        onChangeText={(v) => handleChange("restrictions", v)}
        multiline
      />
      <StyledTextInput
        label="ICE Contacts"
        value={form.iceContacts}
        onChangeText={(v) => handleChange("iceContacts", v)}
        multiline
      />

          <StyledButton title="Save changes" onPress={handleSave} />

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChangeInfoScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    fontFamily: "Inter_400Regular",
  },
  input: {
    height: 50,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    fontFamily: "Inter_300Light",
    textAlignVertical: "center",
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /* Training program (AFF / Static Line) */
  radioOption: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
    marginRight: 12,
  },
  radioSelected: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },

  /* Date picker */
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
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  dateButtonText: {
    fontSize: 16,
    fontFamily: "Inter_300Light",
  },

  safe: {
    flex: 1,
  },
});