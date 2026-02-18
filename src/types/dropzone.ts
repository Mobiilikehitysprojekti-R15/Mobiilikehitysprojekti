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
    {
        ICAO: "EFOU",
        name: "Oulu skydive censsster",
        country: "Finlandssss"
    }
] as const;


export type dropzoneType = {
    ICAO : string,
    name: string,
    country: string
}


export type DropzoneCode = (typeof DROPZONES)[number]["ICAO"];
