export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string
          created_at: string | null
          description: string
          icon: string
          id: string
          requirements: Json | null
          title: string
          xp_reward: number
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          icon: string
          id?: string
          requirements?: Json | null
          title: string
          xp_reward: number
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          requirements?: Json | null
          title?: string
          xp_reward?: number
        }
        Relationships: []
      }
      career_progress: {
        Row: {
          current_level: Database["public"]["Enums"]["engineer_level"] | null
          experience_points: number | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          current_level?: Database["public"]["Enums"]["engineer_level"] | null
          experience_points?: number | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          current_level?: Database["public"]["Enums"]["engineer_level"] | null
          experience_points?: number | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      code_reviews: {
        Row: {
          changes: Json | null
          created_at: string | null
          feedback: string | null
          id: string
          status: string | null
          ticket_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          changes?: Json | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          status?: string | null
          ticket_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          changes?: Json | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          status?: string | null
          ticket_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "code_reviews_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_paths: {
        Row: {
          category: string
          created_at: string | null
          description: string
          id: string
          required_achievements: Json | null
          required_level: number | null
          required_skills: Json | null
          title: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          id?: string
          required_achievements?: Json | null
          required_level?: number | null
          required_skills?: Json | null
          title: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          required_achievements?: Json | null
          required_level?: number | null
          required_skills?: Json | null
          title?: string
        }
        Relationships: []
      }
      learning_steps: {
        Row: {
          created_at: string | null
          description: string
          duration: string
          id: string
          order_index: number
          path_id: string
          prerequisites: Json | null
          title: string
          type: string
          xp_reward: number
        }
        Insert: {
          created_at?: string | null
          description: string
          duration: string
          id?: string
          order_index: number
          path_id: string
          prerequisites?: Json | null
          title: string
          type: string
          xp_reward: number
        }
        Update: {
          created_at?: string | null
          description?: string
          duration?: string
          id?: string
          order_index?: number
          path_id?: string
          prerequisites?: Json | null
          title?: string
          type?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "learning_steps_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          metadata: Json | null
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          metadata?: Json | null
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          metadata?: Json | null
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          email: string | null
          id: string
          name: string | null
          updated_at: string | null
        }
        Insert: {
          email?: string | null
          id: string
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          email?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      solutions: {
        Row: {
          changes: Json
          commit_message: string
          created_at: string
          id: string
          review_comment: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          ticket_id: string
          user_id: string
        }
        Insert: {
          changes: Json
          commit_message: string
          created_at?: string
          id?: string
          review_comment?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status: string
          ticket_id: string
          user_id: string
        }
        Update: {
          changes?: Json
          commit_message?: string
          created_at?: string
          id?: string
          review_comment?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          ticket_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "solutions_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          description: string
          difficulty: string
          estimated_time: number
          id: string
          started_at: string | null
          status: Database["public"]["Enums"]["ticket_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          description: string
          difficulty: string
          estimated_time: number
          id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string
          difficulty?: string
          estimated_time?: number
          id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_learning_progress: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          status: string
          step_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          status?: string
          step_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          status?: string
          step_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_learning_progress_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "learning_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed_tasks: number | null
          created_at: string | null
          id: string
          last_activity: string | null
          level: number | null
          next_level_xp: number | null
          streak_days: number | null
          updated_at: string | null
          user_id: string
          xp: number | null
        }
        Insert: {
          completed_tasks?: number | null
          created_at?: string | null
          id?: string
          last_activity?: string | null
          level?: number | null
          next_level_xp?: number | null
          streak_days?: number | null
          updated_at?: string | null
          user_id: string
          xp?: number | null
        }
        Update: {
          completed_tasks?: number | null
          created_at?: string | null
          id?: string
          last_activity?: string | null
          level?: number | null
          next_level_xp?: number | null
          streak_days?: number | null
          updated_at?: string | null
          user_id?: string
          xp?: number | null
        }
        Relationships: []
      }
      user_repl_files: {
        Row: {
          content: string
          created_at: string
          file_path: string
          id: string
          updated_at: string
          user_repl_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          file_path: string
          id?: string
          updated_at?: string
          user_repl_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          file_path?: string
          id?: string
          updated_at?: string
          user_repl_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_repl_files_user_repl_id_fkey"
            columns: ["user_repl_id"]
            isOneToOne: false
            referencedRelation: "user_repls"
            referencedColumns: ["id"]
          },
        ]
      }
      user_repls: {
        Row: {
          created_at: string | null
          current_ticket_id: string | null
          id: string
          last_accessed: string | null
          progress: Json | null
          stackblitz_id: string | null
          template_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_ticket_id?: string | null
          id?: string
          last_accessed?: string | null
          progress?: Json | null
          stackblitz_id?: string | null
          template_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_ticket_id?: string | null
          id?: string
          last_accessed?: string | null
          progress?: Json | null
          stackblitz_id?: string | null
          template_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_repls_current_ticket_id_fkey"
            columns: ["current_ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_skills: {
        Row: {
          created_at: string | null
          id: string
          level: string
          max_progress: number | null
          progress: number | null
          skill_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          level: string
          max_progress?: number | null
          progress?: number | null
          skill_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          level?: string
          max_progress?: number | null
          progress?: number | null
          skill_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      engineer_level: "junior" | "mid" | "senior" | "lead"
      ticket_status: "open" | "in_progress" | "review" | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
