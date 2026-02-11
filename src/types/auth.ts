import { User } from "firebase/auth";
import { ReactNode } from "react";

export type LicenseType = "Student" | "A" | "B" | "C" | "D";

export interface UserProfile {
  photoURL: string;
  profileImageBase64?: string;
  name: string;
  email: string;
  licenseType: LicenseType;
  address: string;
  phoneNumber: string;
  dateOfBirth: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface AuthProviderProps {
  children: ReactNode;
}
