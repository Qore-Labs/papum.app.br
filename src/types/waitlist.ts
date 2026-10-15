import type { z } from "zod";

import type { launchInterestRequestSchema } from "@/schemas/waitlist-form";

export type LaunchInterestRequest = z.infer<typeof launchInterestRequestSchema>;

export interface WaitlistSubmissionResult {
  status: "success" | "error";
  message: string;
}
