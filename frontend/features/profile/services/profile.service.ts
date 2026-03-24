import { apiGet, apiPut } from "@/lib/api";
import type { StudentProfile } from "@/features/profile/types";

const PROFILE_ROUTE = "/api/profile";

export async function getProfile(): Promise<StudentProfile> {
  return apiGet<StudentProfile>(PROFILE_ROUTE);
}

export async function saveProfile(profile: StudentProfile): Promise<StudentProfile> {
  return apiPut<StudentProfile>(PROFILE_ROUTE, profile);
}
