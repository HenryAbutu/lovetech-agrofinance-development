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
      academy_assignment_submissions: {
        Row: {
          assignment_id: string
          course_id: string
          created_at: string
          feedback: string | null
          graded_at: string | null
          graded_by: string | null
          id: string
          score: number | null
          status: string
          submission_text: string | null
          submission_url: string | null
          submitted_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assignment_id: string
          course_id: string
          created_at?: string
          feedback?: string | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          score?: number | null
          status?: string
          submission_text?: string | null
          submission_url?: string | null
          submitted_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assignment_id?: string
          course_id?: string
          created_at?: string
          feedback?: string | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          score?: number | null
          status?: string
          submission_text?: string | null
          submission_url?: string | null
          submitted_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "academy_assignment_submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "academy_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "academy_assignment_submissions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "academy_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      academy_assignments: {
        Row: {
          course_id: string
          created_at: string
          id: string
          instructions: string
          is_published: boolean
          max_points: number
          module_id: string | null
          sort_order: number
          submission_type: string
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          instructions: string
          is_published?: boolean
          max_points?: number
          module_id?: string | null
          sort_order?: number
          submission_type?: string
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          instructions?: string
          is_published?: boolean
          max_points?: number
          module_id?: string | null
          sort_order?: number
          submission_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "academy_assignments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "academy_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "academy_assignments_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "academy_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      academy_badges: {
        Row: {
          code: string
          color: string
          created_at: string
          criteria: Json
          description: string
          icon: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          code: string
          color?: string
          created_at?: string
          criteria?: Json
          description: string
          icon?: string
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          code?: string
          color?: string
          created_at?: string
          criteria?: Json
          description?: string
          icon?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      academy_certificates: {
        Row: {
          admin_notes: string | null
          certificate_id: string | null
          certificate_name: string
          certificate_pdf_url: string | null
          course_id: string
          created_at: string
          id: string
          issued_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          certificate_id?: string | null
          certificate_name: string
          certificate_pdf_url?: string | null
          course_id: string
          created_at?: string
          id?: string
          issued_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          certificate_id?: string | null
          certificate_name?: string
          certificate_pdf_url?: string | null
          course_id?: string
          created_at?: string
          id?: string
          issued_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "academy_certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "academy_courses"
            referencedColumns: ["id"]
          },
        ]
      }
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
      academy_learner_badges: {
        Row: {
          awarded_at: string
          badge_id: string
          course_id: string | null
          id: string
          user_id: string
        }
        Insert: {
          awarded_at?: string
          badge_id: string
          course_id?: string | null
          id?: string
          user_id: string
        }
        Update: {
          awarded_at?: string
          badge_id?: string
          course_id?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "academy_learner_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "academy_badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "academy_learner_badges_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "academy_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      academy_lesson_progress: {
        Row: {
          completed: boolean
          completed_at: string
          course_id: string
          created_at: string
          id: string
          lesson_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string
          course_id: string
          created_at?: string
          id?: string
          lesson_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string
          course_id?: string
          created_at?: string
          id?: string
          lesson_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "academy_lesson_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "academy_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "academy_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "academy_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      academy_lessons: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          is_preview: boolean
          module_id: string
          resource_url: string | null
          sort_order: number
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_preview?: boolean
          module_id: string
          resource_url?: string | null
          sort_order?: number
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_preview?: boolean
          module_id?: string
          resource_url?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "academy_lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "academy_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "academy_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "academy_modules"
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
      academy_quiz_attempts: {
        Row: {
          answers: Json
          attempt_number: number
          course_id: string
          created_at: string
          earned_points: number
          id: string
          passed: boolean
          quiz_id: string
          score: number
          submitted_at: string
          total_points: number
          user_id: string
        }
        Insert: {
          answers?: Json
          attempt_number?: number
          course_id: string
          created_at?: string
          earned_points?: number
          id?: string
          passed?: boolean
          quiz_id: string
          score?: number
          submitted_at?: string
          total_points?: number
          user_id: string
        }
        Update: {
          answers?: Json
          attempt_number?: number
          course_id?: string
          created_at?: string
          earned_points?: number
          id?: string
          passed?: boolean
          quiz_id?: string
          score?: number
          submitted_at?: string
          total_points?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "academy_quiz_attempts_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "academy_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "academy_quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "academy_quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      academy_quiz_questions: {
        Row: {
          correct_option_ids: Json
          created_at: string
          explanation: string | null
          id: string
          options: Json
          points: number
          prompt: string
          question_type: string
          quiz_id: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          correct_option_ids?: Json
          created_at?: string
          explanation?: string | null
          id?: string
          options?: Json
          points?: number
          prompt: string
          question_type?: string
          quiz_id: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          correct_option_ids?: Json
          created_at?: string
          explanation?: string | null
          id?: string
          options?: Json
          points?: number
          prompt?: string
          question_type?: string
          quiz_id?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "academy_quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "academy_quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      academy_quizzes: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          is_published: boolean
          max_attempts: number
          module_id: string | null
          pass_score: number
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          max_attempts?: number
          module_id?: string | null
          pass_score?: number
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          max_attempts?: number
          module_id?: string | null
          pass_score?: number
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "academy_quizzes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "academy_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "academy_quizzes_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "academy_modules"
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
          display_name: string | null
          email: string | null
          full_name: string | null
          id: string
          leaderboard_opt_in: boolean
          phone: string | null
          updated_at: string
        }
        Insert: {
          business_name?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          leaderboard_opt_in?: boolean
          phone?: string | null
          updated_at?: string
        }
        Update: {
          business_name?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          leaderboard_opt_in?: boolean
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
      academy_learner_points: {
        Row: {
          assign_points: number | null
          badge_count: number | null
          course_id: string | null
          quiz_points: number | null
          total_points: number | null
          user_id: string | null
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
