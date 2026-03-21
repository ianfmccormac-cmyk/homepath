export type Role = "buyer" | "realtor";

export interface Profile {
  id: string;
  full_name: string | null;
  role: Role;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Buyer {
  id: string;
  location: string | null;
  budget: string | null;
  timeline: string | null;
  experience: string | null;
  com_style: string | null;
  journey_step: number;
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface Realtor {
  id: string;
  bio: string | null;
  location: string | null;
  specialties: string[] | null;
  license_number: string | null;
  years_experience: number | null;
  avg_rating: number;
  total_reviews: number;
  response_time: string;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  buyer_id: string;
  realtor_id: string;
  status: "pending" | "active" | "completed" | "cancelled";
  match_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
}
