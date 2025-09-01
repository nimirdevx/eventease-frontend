export interface Event {
  id: number;
  title: string;
  description: string | null;
  date: string;
  organizer_id: number;
  organizer?: {
    id: number;
    name: string;
    email: string;
  };
  comments?: Array<{
    id: number;
    content: string;
    created_at: string;
    user_id: number;
    event_id: number;
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
  }>;
  // These fields might be used in the frontend but don't exist in backend
  // Keeping them optional for compatibility
  location?: string;
  price?: number;
  max_attendees?: number;
  category?: string;
  status?: string;
  current_attendees?: number;
  attendees?: User[];
  registrations?: Registration[];
}

export interface Registration {
  id: number;
  user_id: number;
  event_id: number;
  registration_date: string;
  status: string;
  attended: boolean;
  user: User;
}

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_id: number;
  event_id: number;
  user: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}
