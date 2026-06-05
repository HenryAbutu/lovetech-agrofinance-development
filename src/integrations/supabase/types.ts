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
      academy_course_access_links: {
        Row: {
          course_id: string
          created_at: string
          id: string
          updated_at: string
          whatsapp_link: string | null
          zoom_link: string | null
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          updated_at?: string
          whatsapp_link?: string | null
          zoom_link?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          updated_at?: string
          whatsapp_link?: string | null
          zoom_link?: string | null
        }
        Relationships: []
      }
      academy_courses: {
        Row: {
          course_image: string | null
          created_at: string
          delivery_mode: string | null
          description: string | null
          discount_price: number | null
          id: string
          registration_deadline: string | null
          regular_price: number | null
          slug: string
          status: Database["public"]["Enums"]["course_status"]
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          course_image?: string | null
          created_at?: string
          delivery_mode?: string | null
          description?: string | null
          discount_price?: number | null
          id?: string
          registration_deadline?: string | null
          regular_price?: number | null
          slug: string
          status?: Database["public"]["Enums"]["course_status"]
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          course_image?: string | null
          created_at?: string
          delivery_mode?: string | null
          description?: string | null
          discount_price?: number | null
          id?: string
          registration_deadline?: string | null
          regular_price?: number | null
          slug?: string
          status?: Database["public"]["Enums"]["course_status"]
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      academy_enrolments: {
        Row: {
          access_status: Database["public"]["Enums"]["enrolment_access_status"]
          business_name: string | null
          business_sector: string | null
          course_id: string
          created_at: string
          email: string
          full_name: string
          id: string
          location: string | null
          main_challenge: string | null
          payment_status: Database["public"]["Enums"]["enrolment_payment_status"]
          phone: string | null
          referral_source: string | null
          user_id: string | null
        }
        Insert: {
          access_status?: Database["public"]["Enums"]["enrolment_access_status"]
          business_name?: string | null
          business_sector?: string | null
          course_id: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          location?: string | null
          main_challenge?: string | null
          payment_status?: Database["public"]["Enums"]["enrolment_payment_status"]
          phone?: string | null
          referral_source?: string | null
          user_id?: string | null
        }
        Update: {
          access_status?: Database["public"]["Enums"]["enrolment_access_status"]
          business_name?: string | null
          business_sector?: string | null
          course_id?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          location?: string | null
          main_challenge?: string | null
          payment_status?: Database["public"]["Enums"]["enrolment_payment_status"]
          phone?: string | null
          referral_source?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "academy_enrolments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "academy_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      academy_modules: {
        Row: {
          course_id: string
          created_at: string
          exercise: string | null
          id: string
          lesson_summary: string | null
          module_number: number
          objective: string | null
          resource_link: string | null
          sort_order: number
          title: string
          video_script: string | null
          video_url: string | null
        }
        Insert: {
          course_id: string
          created_at?: string
          exercise?: string | null
          id?: string
          lesson_summary?: string | null
          module_number: number
          objective?: string | null
          resource_link?: string | null
          sort_order?: number
          title: string
          video_script?: string | null
          video_url?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string
          exercise?: string | null
          id?: string
          lesson_summary?: string | null
          module_number?: number
          objective?: string | null
          resource_link?: string | null
          sort_order?: number
          title?: string
          video_script?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "academy_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "academy_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      academy_payments: {
        Row: {
          amount: number
          course_id: string
          created_at: string
          currency: string
          enrolment_id: string
          id: string
          paid_at: string | null
          payment_provider: string
          paystack_reference: string | null
          status: string
          user_email: string
        }
        Insert: {
          amount: number
          course_id: string
          created_at?: string
          currency?: string
          enrolment_id: string
          id?: string
          paid_at?: string | null
          payment_provider?: string
          paystack_reference?: string | null
          status?: string
          user_email: string
        }
        Update: {
          amount?: number
          course_id?: string
          created_at?: string
          currency?: string
          enrolment_id?: string
          id?: string
          paid_at?: string | null
          payment_provider?: string
          paystack_reference?: string | null
          status?: string
          user_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "academy_payments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "academy_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "academy_payments_enrolment_id_fkey"
            columns: ["enrolment_id"]
            isOneToOne: false
            referencedRelation: "academy_enrolments"
            referencedColumns: ["id"]
          },
        ]
      }
      academy_resources: {
        Row: {
          course_id: string | null
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          is_public: boolean
          module_id: string | null
          resource_type: string | null
          title: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          is_public?: boolean
          module_id?: string | null
          resource_type?: string | null
          title: string
        }
        Update: {
          course_id?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          is_public?: boolean
          module_id?: string | null
          resource_type?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "academy_resources_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "academy_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "academy_resources_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "academy_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      academy_waitlist: {
        Row: {
          business_name: string | null
          business_sector: string | null
          course_id: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          interest_area: string | null
          location: string | null
          main_challenge: string | null
          phone: string | null
          preferred_training_mode: string | null
        }
        Insert: {
          business_name?: string | null
          business_sector?: string | null
          course_id?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          interest_area?: string | null
          location?: string | null
          main_challenge?: string | null
          phone?: string | null
          preferred_training_mode?: string | null
        }
        Update: {
          business_name?: string | null
          business_sector?: string | null
          course_id?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          interest_area?: string | null
          location?: string | null
          main_challenge?: string | null
          phone?: string | null
          preferred_training_mode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "academy_waitlist_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "academy_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          body: string | null
          category: string | null
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          slug: string
          status: Database["public"]["Enums"]["post_status"]
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          category?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          slug: string
          status?: Database["public"]["Enums"]["post_status"]
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          category?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          slug?: string
          status?: Database["public"]["Enums"]["post_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      diagnostic_requests: {
        Row: {
          business_name: string
          business_sector: string | null
          created_at: string
          email: string
          full_name: string
          funding_amount_needed: string | null
          funding_type_needed: string | null
          id: string
          location: string | null
          main_funding_challenge: string | null
          monthly_sales_estimate: string | null
          phone: string | null
          registration_status: string | null
          status: string
          years_in_operation: string | null
        }
        Insert: {
          business_name: string
          business_sector?: string | null
          created_at?: string
          email: string
          full_name: string
          funding_amount_needed?: string | null
          funding_type_needed?: string | null
          id?: string
          location?: string | null
          main_funding_challenge?: string | null
          monthly_sales_estimate?: string | null
          phone?: string | null
          registration_status?: string | null
          status?: string
          years_in_operation?: string | null
        }
        Update: {
          business_name?: string
          business_sector?: string | null
          created_at?: string
          email?: string
          full_name?: string
          funding_amount_needed?: string | null
          funding_type_needed?: string | null
          id?: string
          location?: string | null
          main_funding_challenge?: string | null
          monthly_sales_estimate?: string | null
          phone?: string | null
          registration_status?: string | null
          status?: string
          years_in_operation?: string | null
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          business_name: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          message: string
          phone: string | null
          service_interest: string | null
          status: string
        }
        Insert: {
          business_name?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          message: string
          phone?: string | null
          service_interest?: string | null
          status?: string
        }
        Update: {
          business_name?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          message?: string
          phone?: string | null
          service_interest?: string | null
          status?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          business_name: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          business_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          business_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      video_script_prompts: {
        Row: {
          course_id: string | null
          created_at: string
          created_by: string | null
          generated_script: string | null
          id: string
          module_id: string | null
          prompt_text: string
          status: Database["public"]["Enums"]["video_script_status"]
          title: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          created_by?: string | null
          generated_script?: string | null
          id?: string
          module_id?: string | null
          prompt_text: string
          status?: Database["public"]["Enums"]["video_script_status"]
          title: string
        }
        Update: {
          course_id?: string | null
          created_at?: string
          created_by?: string | null
          generated_script?: string | null
          id?: string
          module_id?: string | null
          prompt_text?: string
          status?: Database["public"]["Enums"]["video_script_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_script_prompts_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "academy_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_script_prompts_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "academy_modules"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_enrolled_in_course: {
        Args: { _course_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "learner"
      course_status:
        | "draft"
        | "enrolment_open"
        | "coming_soon"
        | "closed"
        | "archived"
      enrolment_access_status: "inactive" | "active" | "revoked"
      enrolment_payment_status:
        | "pending_payment"
        | "paid"
        | "failed"
        | "refunded"
        | "manual"
      post_status: "draft" | "published" | "archived"
      video_script_status: "draft" | "ready" | "published"
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
    Enums: {
      app_role: ["admin", "learner"],
      course_status: [
        "draft",
        "enrolment_open",
        "coming_soon",
        "closed",
        "archived",
      ],
      enrolment_access_status: ["inactive", "active", "revoked"],
      enrolment_payment_status: [
        "pending_payment",
        "paid",
        "failed",
        "refunded",
        "manual",
      ],
      post_status: ["draft", "published", "archived"],
      video_script_status: ["draft", "ready", "published"],
    },
  },
} as const
