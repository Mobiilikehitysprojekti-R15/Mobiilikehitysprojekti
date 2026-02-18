// firebase jump data type
export type JumpData = {
  jumpNumber: number;
  jumpDate: string;
  dropzone: string;
  plane: string;
  altitude: number | null;
  canopy: string;
  releaseType: "Static line" | "Free fall";
  isAccepted: boolean;
  freefallTime: number | null;
  notes: string;
  createdAt: string;
};
