// Supabase generated types
// This file defines the database schema for TypeScript

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
      booking_requests: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          client_name: string
          client_email: string
          client_phone: string | null
          event_type: string | null
          booking_type: string | null
          desired_date: string
          desired_time: string | null
          num_guests: number | null
          special_requests: string | null
          menu: string | null
          menu_selection: Json | null
          menu_total_per_person: number | null
          menu_total_booking: number | null
          preset_menu: string | null
          dietary_restrictions: Json | null
          status: string
          confirmed_start: string | null
          confirmed_end: string | null
          rejection_reason: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          placement: string | null
          booking_source: string
          tenant_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          client_name: string
          client_email: string
          client_phone?: string | null
          event_type?: string | null
          booking_type?: string | null
          desired_date: string
          desired_time?: string | null
          num_guests?: number | null
          special_requests?: string | null
          menu?: string | null
          menu_selection?: Json | null
          menu_total_per_person?: number | null
          menu_total_booking?: number | null
          dietary_restrictions?: Json | null
          status?: string
          confirmed_start?: string | null
          confirmed_end?: string | null
          rejection_reason?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          placement?: string | null
          booking_source?: string
          tenant_id?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          client_name?: string
          client_email?: string
          client_phone?: string | null
          event_type?: string | null
          booking_type?: string | null
          desired_date?: string
          desired_time?: string | null
          num_guests?: number | null
          special_requests?: string | null
          menu?: string | null
          menu_selection?: Json | null
          menu_total_per_person?: number | null
          menu_total_booking?: number | null
          dietary_restrictions?: Json | null
          status?: string
          confirmed_start?: string | null
          confirmed_end?: string | null
          rejection_reason?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          placement?: string | null
          booking_source?: string
          tenant_id?: string
        }
      }
      menu_items: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          category: string
          price: number
          description: string | null
          sort_order: number
          tenant_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          category: string
          price: number
          description?: string | null
          sort_order?: number
          tenant_id?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          category?: string
          price?: number
          description?: string | null
          sort_order?: number
          tenant_id?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          email: string
          name: string | null
          created_at: string
          updated_at: string
          tenant_id: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          created_at?: string
          updated_at?: string
          tenant_id?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          created_at?: string
          updated_at?: string
          tenant_id?: string
        }
      }
      email_logs: {
        Row: {
          id: string
          booking_id: string | null
          email_type: string
          recipient_email: string
          sent_at: string
          status: string
          provider_response: Json | null
          error_message: string | null
          tenant_id: string
        }
        Insert: {
          id?: string
          booking_id?: string | null
          email_type: string
          recipient_email: string
          sent_at?: string
          status?: string
          provider_response?: Json | null
          error_message?: string | null
          tenant_id?: string
        }
        Update: {
          id?: string
          booking_id?: string | null
          email_type?: string
          recipient_email?: string
          sent_at?: string
          status?: string
          provider_response?: Json | null
          error_message?: string | null
          tenant_id?: string
        }
      }
      restaurant_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
          tenant_id: string
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
          tenant_id?: string
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
          tenant_id?: string
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          plan: string
          max_bookings_per_year: number
          max_booking_requests_per_year: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          plan?: string
          max_bookings_per_year?: number
          max_booking_requests_per_year?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          plan?: string
          max_bookings_per_year?: number
          max_booking_requests_per_year?: number
          created_at?: string
          updated_at?: string
        }
      }
      invite_tokens: {
        Row: {
          id: string
          organization_id: string
          token: string
          email: string | null
          expires_at: string
          used_at: string | null
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          organization_id: string
          token: string
          email?: string | null
          expires_at: string
          used_at?: string | null
          created_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          organization_id?: string
          token?: string
          email?: string | null
          expires_at?: string
          used_at?: string | null
          created_at?: string
          created_by?: string | null
        }
      }
      tenant_usage: {
        Row: {
          id: string
          organization_id: string
          year: number
          bookings_count: number
          booking_requests_count: number
        }
        Insert: {
          id?: string
          organization_id: string
          year: number
          bookings_count?: number
          booking_requests_count?: number
        }
        Update: {
          id?: string
          organization_id?: string
          year?: number
          bookings_count?: number
          booking_requests_count?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_admin_email: {
        Args: { check_email: string }
        Returns: { name: string; tenant_id: string }[]
      }
      set_tenant: {
        Args: { tid: string }
        Returns: undefined
      }
      cleanup_rate_limits: {
        Args: Record<string, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
