"use server";

import { submitLaunchInterest } from "@/lib/email/subscribe-to-launch";
import type { WaitlistSubmissionResult } from "@/types/waitlist";

export async function subscribeToLaunch(
  input: unknown,
): Promise<WaitlistSubmissionResult> {
  return submitLaunchInterest(input);
}
