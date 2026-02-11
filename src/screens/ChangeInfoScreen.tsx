import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import StyledButton from "../components/StyledButton";
import ProfileAuth from "../components/ProfileAuth";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { UserProfile } from "../types/auth";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ProfileScreen from "./ProfileScreen";

type Props = {};

const ChangeInfoScreen = (props: Props) => {
  return (
    <View>
        <Text>Phone Number: {/*{profile.phoneNumber}*/}</Text>
        <Text>Address: {/*{profile.address}*/}</Text>
        <Text>Date of Birth: {/*{formatDate(profile.dateOfBirth)}*/}</Text>
        <Text>Member Since: {/*{formatDate(profile.createdAt)}*/}</Text>

        <Text>Club:</Text>
        <Text>Primary Training:</Text>
        <Text>Harness-Container System:</Text>
        <Text>Training Program: AFF / Static Line Program</Text>
        <Text>Altimeter:</Text>
        <Text>Drop Zone Aircraft:</Text>
        <Text>Student Qualification:</Text>
        <Text>Use of HD Pilot Chute:</Text>
        <Text>Basic Training:</Text>
        <Text>Advanced Training:</Text>

        <Text>A-License requirements verified:</Text>

        <Text>Approved Use of Personal Equipment</Text>
        <Text>Canopy:</Text>
        <Text>Harness:</Text>

        <Text>Restrictions:</Text>
        <Text>ICE Contacts:</Text>
    </View>
  );
};

export default ChangeInfoScreen;

const styles = StyleSheet.create({});