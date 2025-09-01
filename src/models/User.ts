export type UserRole = "attendee" | "organizer" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at?: string;
}
