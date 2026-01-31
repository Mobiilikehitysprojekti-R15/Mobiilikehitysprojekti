import { ReactNode } from "react";

export interface DropzoneContextType {
    dropzone: string;
    setDropzone: (dropzone: string) => void;
    loading: boolean;
}

export interface DropzoneProviderProps {
    children: ReactNode;
}

export interface DropzoneModalProps {
    visible: boolean;
    onClose: () => void;
}

// doesnt account for countries but oh well - comments have no metar data
export const DROPZONES = [
    { code: "EFOU", name: "Oulu Airport" },
    { code: "EFTU", name: "Turku Airport" },
    //{ code: "EFHF", name: "Helsinki-Malmi Airport" },
    { code: "EFTP", name: "Tampere-Pirkkala Airport" },
    { code: "EFJY", name: "Jyväskylä Airport" },
    { code: "EFUT", name: "Utti Airport" },
    //{ code: "EFLA", name: "Lahti-Vesivehmaa Airport" },
    //{ code: "EFIM", name: "Immola Airfield" },
    { code: "EFKE", name: "Kemi-Tornio Airport" },
    { code: "EFKU", name: "Kuopio Airport" },
    { code: "EFPO", name: "Pori Airport" },
    { code: "EFVA", name: "Vaasa Airport" },
    //{ code: "EFAL", name: "Alavus Airfield" },
    { code: "EFKI", name: "Kajaani Airport" },
    { code: "EFRO", name: "Rovaniemi Airport" },
    //{ code: "EFJM", name: "Jämijärvi Airfield" },
    { code: "EFHK", name: "Helsinki-Vantaa Airport" },
    //{ code: "EFSE", name: "Seinäjoki Airport" },
] as const;

export type DropzoneCode = (typeof DROPZONES)[number]["code"];
