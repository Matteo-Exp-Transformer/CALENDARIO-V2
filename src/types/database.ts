export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_requests: {
        Row: {
          booking_source: string
          booking_type: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          client_email: string
          client_name: string
          client_phone: string | null
          confirmed_end: string | null
          confirmed_start: string | null
          created_at: string
          desired_date: string
          desired_time: string | null
          dietary_restrictions: Json | null
          event_type: string | null
          id: string
          menu: string | null
          menu_selection: Json | null
          menu_total_booking: number | null
          menu_total_per_person: number | null
          no_show: boolean
          num_guests: number | null
          placement: string | null
          preset_menu: string | null
          rejection_reason: string | null
          source: string
          special_requests: string | null
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          booking_source?: string
          booking_type?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          client_email?: string
          client_name: string
          client_phone?: string | null
          confirmed_end?: string | null
          confirmed_start?: string | null
          created_at?: string
          desired_date: string
          desired_time?: string | null
          dietary_restrictions?: Json | null
          event_type?: string | null
          id?: string
          menu?: string | null
          menu_selection?: Json | null
          menu_total_booking?: number | null
          menu_total_per_person?: number | null
          no_show?: boolean
          num_guests?: number | null
          placement?: string | null
          preset_menu?: string | null
          rejection_reason?: string | null
          source?: string
          special_requests?: string | null
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          booking_source?: string
          booking_type?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          client_email?: string
          client_name?: string
          client_phone?: string | null
          confirmed_end?: string | null
          confirmed_start?: string | null
          created_at?: string
          desired_date?: string
          desired_time?: string | null
          dietary_restrictions?: Json | null
          event_type?: string | null
          id?: string
          menu?: string | null
          menu_selection?: Json | null
          menu_total_booking?: number | null
          menu_total_per_person?: number | null
          no_show?: boolean
          num_guests?: number | null
          placement?: string | null
          preset_menu?: string | null
          rejection_reason?: string | null
          source?: string
          special_requests?: string | null
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_requests_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_table_assignments: {
        Row: {
          booking_id: string
          checked_out_at: string | null
          created_at: string
          date: string
          id: string
          service_slot_id: string
          table_id: string
          tenant_id: string
          turn_number: number
        }
        Insert: {
          booking_id: string
          checked_out_at?: string | null
          created_at?: string
          date: string
          id?: string
          service_slot_id: string
          table_id: string
          tenant_id: string
          turn_number?: number
        }
        Update: {
          booking_id?: string
          checked_out_at?: string | null
          created_at?: string
          date?: string
          id?: string
          service_slot_id?: string
          table_id?: string
          tenant_id?: string
          turn_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "booking_table_assignments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "booking_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_table_assignments_service_slot_id_fkey"
            columns: ["service_slot_id"]
            isOneToOne: false
            referencedRelation: "service_slots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_table_assignments_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_table_assignments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          source: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          source?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          source?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      email_logs: {
        Row: {
          booking_id: string | null
          email_type: string
          error_message: string | null
          id: string
          provider_response: Json | null
          recipient_email: string
          sent_at: string
          status: string
          tenant_id: string
        }
        Insert: {
          booking_id?: string | null
          email_type: string
          error_message?: string | null
          id?: string
          provider_response?: Json | null
          recipient_email: string
          sent_at?: string
          status?: string
          tenant_id: string
        }
        Update: {
          booking_id?: string | null
          email_type?: string
          error_message?: string | null
          id?: string
          provider_response?: Json | null
          recipient_email?: string
          sent_at?: string
          status?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "booking_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      invite_tokens: {
        Row: {
          created_at: string
          created_by: string | null
          email: string | null
          expires_at: string
          id: string
          organization_id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email?: string | null
          expires_at: string
          id?: string
          organization_id: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string | null
          expires_at?: string
          id?: string
          organization_id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invite_tokens_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_categories: {
        Row: {
          created_at: string
          id: string
          key: string
          label: string
          sort_order: number
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          label: string
          sort_order?: number
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          label?: string
          sort_order?: number
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_categories_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          booking_types: string[]
          category: string
          created_at: string
          description: string | null
          id: string
          name: string
          price: number
          sort_order: number
          tenant_id: string
          updated_at: string
        }
        Insert: {
          booking_types?: string[]
          category: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          price: number
          sort_order?: number
          tenant_id: string
          updated_at?: string
        }
        Update: {
          booking_types?: string[]
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          price?: number
          sort_order?: number
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          edition: string
          id: string
          is_active: boolean
          max_booking_requests_per_year: number
          max_bookings_per_year: number
          name: string
          plan: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          edition?: string
          id?: string
          is_active?: boolean
          max_booking_requests_per_year?: number
          max_bookings_per_year?: number
          name: string
          plan?: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          edition?: string
          id?: string
          is_active?: boolean
          max_booking_requests_per_year?: number
          max_bookings_per_year?: number
          name?: string
          plan?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          endpoint: string
          id: string
          ip_address: string
          requested_at: string
        }
        Insert: {
          endpoint: string
          id?: string
          ip_address: string
          requested_at?: string
        }
        Update: {
          endpoint?: string
          id?: string
          ip_address?: string
          requested_at?: string
        }
        Relationships: []
      }
      restaurant_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: Json
          tenant_id: string
          updated_at: string
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value: Json
          tenant_id: string
          updated_at?: string
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: Json
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_settings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          created_at: string
          display_order: number
          height: number
          id: string
          name: string
          tenant_id: string
          updated_at: string
          width: number
        }
        Insert: {
          created_at?: string
          display_order?: number
          height?: number
          id?: string
          name: string
          tenant_id: string
          updated_at?: string
          width?: number
        }
        Update: {
          created_at?: string
          display_order?: number
          height?: number
          id?: string
          name?: string
          tenant_id?: string
          updated_at?: string
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "rooms_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      service_slot_overrides: {
        Row: {
          created_at: string
          date_from: string
          date_to: string
          id: string
          max_guests: number | null
          max_turns: number | null
          service_slot_id: string
          tenant_id: string
        }
        Insert: {
          created_at?: string
          date_from: string
          date_to: string
          id?: string
          max_guests?: number | null
          max_turns?: number | null
          service_slot_id: string
          tenant_id: string
        }
        Update: {
          created_at?: string
          date_from?: string
          date_to?: string
          id?: string
          max_guests?: number | null
          max_turns?: number | null
          service_slot_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_slot_overrides_service_slot_id_fkey"
            columns: ["service_slot_id"]
            isOneToOne: false
            referencedRelation: "service_slots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_slot_overrides_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      service_slots: {
        Row: {
          created_at: string
          display_order: number
          end_time: string
          id: string
          is_canonical: boolean
          max_guests: number | null
          max_turns: number | null
          max_turns_resume: number | null
          name: string
          start_time: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          end_time: string
          id?: string
          is_canonical?: boolean
          max_guests?: number | null
          max_turns?: number | null
          max_turns_resume?: number | null
          name: string
          start_time: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          end_time?: string
          id?: string
          is_canonical?: boolean
          max_guests?: number | null
          max_turns?: number | null
          max_turns_resume?: number | null
          name?: string
          start_time?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_slots_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      tables: {
        Row: {
          active: boolean
          capacity: number
          created_at: string
          id: string
          name: string
          placement: string
          position_x: number
          position_y: number
          room_id: string | null
          rotation: number
          shape: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          capacity: number
          created_at?: string
          id?: string
          name: string
          placement?: string
          position_x?: number
          position_y?: number
          room_id?: string | null
          rotation?: number
          shape?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          capacity?: number
          created_at?: string
          id?: string
          name?: string
          placement?: string
          position_x?: number
          position_y?: number
          room_id?: string | null
          rotation?: number
          shape?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tables_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tables_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_usage: {
        Row: {
          booking_requests_count: number
          bookings_count: number
          id: string
          organization_id: string
          year: number
        }
        Insert: {
          booking_requests_count?: number
          bookings_count?: number
          id?: string
          organization_id: string
          year: number
        }
        Update: {
          booking_requests_count?: number
          bookings_count?: number
          id?: string
          organization_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "tenant_usage_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_admin_email: {
        Args: { check_email: string }
        Returns: {
          edition: string
          name: string
          org_name: string
          slug: string
          tenant_id: string
        }[]
      }
      cleanup_rate_limits: { Args: never; Returns: undefined }
      current_admin_tenant_id: { Args: never; Returns: string }
      insert_service_slot: {
        Args: {
          p_display_order: number
          p_end_time: string
          p_max_guests: number
          p_max_turns: number
          p_name: string
          p_start_time: string
          p_tenant_id: string
        }
        Returns: {
          created_at: string
          display_order: number
          end_time: string
          id: string
          is_canonical: boolean
          max_guests: number | null
          max_turns: number | null
          name: string
          start_time: string
          tenant_id: string
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "service_slots"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      insert_service_slot_override: {
        Args: { payload: Json }
        Returns: {
          created_at: string
          date_from: string
          date_to: string
          id: string
          max_guests: number | null
          max_turns: number | null
          service_slot_id: string
          tenant_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "service_slot_overrides"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      update_service_slot: {
        Args: { payload: Json }
        Returns: {
          created_at: string
          display_order: number
          end_time: string
          id: string
          is_canonical: boolean
          max_guests: number | null
          max_turns: number | null
          name: string
          start_time: string
          tenant_id: string
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "service_slots"
          isOneToOne: false
          isSetofReturn: true
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
