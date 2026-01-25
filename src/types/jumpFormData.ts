export type JumpFormData = {
  jumpNumber: string;
  jumpDate: Date;
  place: string;
  plane: string;
  altitude: string;
  canopy: string;
  releaseType: "Static line" | "Free fall";
  isAccepted: boolean;
  freefallTime: string;
  notes: string;
};
