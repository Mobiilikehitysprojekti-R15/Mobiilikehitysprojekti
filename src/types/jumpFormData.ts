export type JumpFormData = {
  jumpNumber: string;
  jumpDate: Date;
  place: string;
  plane: string;
  altitude: string;
  canopy: string;
  releaseType: "PL" | "IA";
  isAccepted: boolean;
  freefallTime: string;
  notes: string;
};
