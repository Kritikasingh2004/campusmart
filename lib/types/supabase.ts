export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string | null
          avatar_url: string | null
          location: string | null
          phone: string | null
          bio: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          name: string
          email?: string | null
          avatar_url?: string | null
          location?: string | null
          phone?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          avatar_url?: string | null
          location?: string | null
          phone?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      listings: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          image_url: string | null
          location: string
          category: string
          user_id: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          price: number
          image_url?: string | null
          location: string
          category: string
          user_id: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          image_url?: string | null
          location?: string
          category?: string
          user_id?: string
          created_at?: string
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
