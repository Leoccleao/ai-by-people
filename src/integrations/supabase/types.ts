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
      allowed_domains: {
        Row: {
          created_at: string
          domain: string
        }
        Insert: {
          created_at?: string
          domain: string
        }
        Update: {
          created_at?: string
          domain?: string
        }
        Relationships: []
      }
      assets: {
        Row: {
          content_type: string | null
          created_at: string
          filename: string
          id: string
          lob_id: string
          size_bytes: number | null
          sort_order: number
          storage_key: string
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          filename: string
          id?: string
          lob_id: string
          size_bytes?: number | null
          sort_order?: number
          storage_key: string
        }
        Update: {
          content_type?: string | null
          created_at?: string
          filename?: string
          id?: string
          lob_id?: string
          size_bytes?: number | null
          sort_order?: number
          storage_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_lob_id_fkey"
            columns: ["lob_id"]
            isOneToOne: false
            referencedRelation: "lobs"
            referencedColumns: ["id"]
          },
        ]
      }
      blocked_domains: {
        Row: {
          domain: string
        }
        Insert: {
          domain: string
        }
        Update: {
          domain?: string
        }
        Relationships: []
      }
      bootstrap_admins: {
        Row: {
          email: string
        }
        Insert: {
          email: string
        }
        Update: {
          email?: string
        }
        Relationships: []
      }
      company_webinar_requests: {
        Row: {
          audience_size: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          lob_slugs: string[]
          name: string
          notes: string | null
          preferred_windows: string | null
          status: Database["public"]["Enums"]["request_status"]
          user_id: string | null
        }
        Insert: {
          audience_size?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          lob_slugs?: string[]
          name: string
          notes?: string | null
          preferred_windows?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          user_id?: string | null
        }
        Update: {
          audience_size?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          lob_slugs?: string[]
          name?: string
          notes?: string | null
          preferred_windows?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          user_id?: string | null
        }
        Relationships: []
      }
      engagement_events: {
        Row: {
          asset_id: string | null
          created_at: string
          email_domain: string | null
          id: number
          lob_id: string | null
          type: Database["public"]["Enums"]["engagement_type"]
          user_id: string
        }
        Insert: {
          asset_id?: string | null
          created_at?: string
          email_domain?: string | null
          id?: never
          lob_id?: string | null
          type: Database["public"]["Enums"]["engagement_type"]
          user_id: string
        }
        Update: {
          asset_id?: string | null
          created_at?: string
          email_domain?: string | null
          id?: never
          lob_id?: string | null
          type?: Database["public"]["Enums"]["engagement_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "engagement_events_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "engagement_events_lob_id_fkey"
            columns: ["lob_id"]
            isOneToOne: false
            referencedRelation: "lobs"
            referencedColumns: ["id"]
          },
        ]
      }
      invited_emails: {
        Row: {
          claimed_at: string | null
          created_at: string
          email: string
          invited_by: string | null
          note: string | null
        }
        Insert: {
          claimed_at?: string | null
          created_at?: string
          email: string
          invited_by?: string | null
          note?: string | null
        }
        Update: {
          claimed_at?: string | null
          created_at?: string
          email?: string
          invited_by?: string | null
          note?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          email: string
          id: string
          language: string | null
          message: string | null
          name: string | null
          organization: string | null
          program: string | null
          source: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          language?: string | null
          message?: string | null
          name?: string | null
          organization?: string | null
          program?: string | null
          source: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          language?: string | null
          message?: string | null
          name?: string | null
          organization?: string | null
          program?: string | null
          source?: string
        }
        Relationships: []
      }
      lob_progress: {
        Row: {
          lob_id: string
          user_id: string
          watched_at: string | null
        }
        Insert: {
          lob_id: string
          user_id: string
          watched_at?: string | null
        }
        Update: {
          lob_id?: string
          user_id?: string
          watched_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lob_progress_lob_id_fkey"
            columns: ["lob_id"]
            isOneToOne: false
            referencedRelation: "lobs"
            referencedColumns: ["id"]
          },
        ]
      }
      lobs: {
        Row: {
          body_md: string | null
          created_at: string
          duration_min: number | null
          event_date: string | null
          id: string
          instructor: string | null
          instructor_photo_url: string | null
          instructor_title: string | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          subtitle: string | null
          tags: string[]
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          body_md?: string | null
          created_at?: string
          duration_min?: number | null
          event_date?: string | null
          id?: string
          instructor?: string | null
          instructor_photo_url?: string | null
          instructor_title?: string | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          subtitle?: string | null
          tags?: string[]
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          body_md?: string | null
          created_at?: string
          duration_min?: number | null
          event_date?: string | null
          id?: string
          instructor?: string | null
          instructor_photo_url?: string | null
          instructor_title?: string | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          subtitle?: string | null
          tags?: string[]
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      office_hours: {
        Row: {
          capacity: number | null
          created_at: string
          description: string | null
          duration_min: number
          id: string
          instructor: string | null
          lob_id: string | null
          meeting_url: string | null
          recording_url: string | null
          starts_at: string
          title: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          description?: string | null
          duration_min?: number
          id?: string
          instructor?: string | null
          lob_id?: string | null
          meeting_url?: string | null
          recording_url?: string | null
          starts_at: string
          title: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          description?: string | null
          duration_min?: number
          id?: string
          instructor?: string | null
          lob_id?: string | null
          meeting_url?: string | null
          recording_url?: string | null
          starts_at?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "office_hours_lob_id_fkey"
            columns: ["lob_id"]
            isOneToOne: false
            referencedRelation: "lobs"
            referencedColumns: ["id"]
          },
        ]
      }
      office_hours_signups: {
        Row: {
          created_at: string
          id: string
          office_hour_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          office_hour_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          office_hour_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "office_hours_signups_office_hour_id_fkey"
            columns: ["office_hour_id"]
            isOneToOne: false
            referencedRelation: "office_hours"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company: string | null
          created_at: string
          email: string
          email_domain: string
          id: string
          is_active: boolean
          last_seen_at: string | null
          name: string | null
          origin: Database["public"]["Enums"]["user_origin"]
          role_lob: string | null
          terms_accepted_at: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          email_domain: string
          id: string
          is_active?: boolean
          last_seen_at?: string | null
          name?: string | null
          origin?: Database["public"]["Enums"]["user_origin"]
          role_lob?: string | null
          terms_accepted_at?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          email_domain?: string
          id?: string
          is_active?: boolean
          last_seen_at?: string | null
          name?: string | null
          origin?: Database["public"]["Enums"]["user_origin"]
          role_lob?: string | null
          terms_accepted_at?: string | null
        }
        Relationships: []
      }
      success_stories: {
        Row: {
          company: string | null
          consent_contact_at: string
          consent_no_publish_ack_at: string
          created_at: string
          description: string
          email: string
          id: string
          lob_id: string | null
          name: string
          status: Database["public"]["Enums"]["story_status"]
          title: string
          user_id: string | null
          video_url: string
        }
        Insert: {
          company?: string | null
          consent_contact_at: string
          consent_no_publish_ack_at: string
          created_at?: string
          description: string
          email: string
          id?: string
          lob_id?: string | null
          name: string
          status?: Database["public"]["Enums"]["story_status"]
          title: string
          user_id?: string | null
          video_url: string
        }
        Update: {
          company?: string | null
          consent_contact_at?: string
          consent_no_publish_ack_at?: string
          created_at?: string
          description?: string
          email?: string
          id?: string
          lob_id?: string | null
          name?: string
          status?: Database["public"]["Enums"]["story_status"]
          title?: string
          user_id?: string | null
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "success_stories_lob_id_fkey"
            columns: ["lob_id"]
            isOneToOne: false
            referencedRelation: "lobs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      admin_domain_stats: {
        Row: {
          active_30d: number | null
          domain: string | null
          downloads: number | null
          last_seen_at: string | null
          oh_signups: number | null
          users: number | null
          video_plays: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      email_may_access: { Args: { _email: string }; Returns: boolean }
      grant_domain_from_email: { Args: { _email: string }; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "participant" | "admin"
      content_status: "published" | "coming_soon"
      engagement_type:
        | "page_view"
        | "video_play"
        | "video_complete"
        | "download"
        | "oh_signup"
      request_status: "novo" | "em_contato" | "agendado" | "recusado"
      story_status: "nova" | "em_avaliacao" | "selecionada" | "arquivada"
      user_origin: "invite" | "self_signup"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["participant", "admin"],
      content_status: ["published", "coming_soon"],
      engagement_type: [
        "page_view",
        "video_play",
        "video_complete",
        "download",
        "oh_signup",
      ],
      request_status: ["novo", "em_contato", "agendado", "recusado"],
      story_status: ["nova", "em_avaliacao", "selecionada", "arquivada"],
      user_origin: ["invite", "self_signup"],
    },
  },
} as const
