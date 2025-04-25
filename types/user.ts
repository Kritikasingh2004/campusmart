export interface User {
  id: string;
  name: string;
  email?: string;
  avatar_url?: string;
  location?: string;
  phone?: string;
  bio?: string;
  created_at: string;
  updated_at?: string;
}

export interface UserFormData {
  name: string;
  email?: string;
  avatar_url?: string;
  location?: string;
  phone?: string;
  bio?: string;
}
