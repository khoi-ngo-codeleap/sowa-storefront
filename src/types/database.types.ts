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
      category: {
        Row: {
          author_id: string
          created_at: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      customer: {
        Row: {
          created_at: string
          display_name: string
          email: string
          first_name: string
          id: string
          last_name: string
          locale: string
          note: string | null
          phone: string
          rfm_group: string | null
          state: string
          tax_exempt: boolean
        }
        Insert: {
          created_at?: string
          display_name: string
          email: string
          first_name: string
          id?: string
          last_name: string
          locale: string
          note?: string | null
          phone: string
          rfm_group?: string | null
          state?: string
          tax_exempt?: boolean
        }
        Update: {
          created_at?: string
          display_name?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          locale?: string
          note?: string | null
          phone?: string
          rfm_group?: string | null
          state?: string
          tax_exempt?: boolean
        }
        Relationships: []
      }
      customer_address: {
        Row: {
          country: string
          customer_id: string
          formatted_area: string
          id: string
        }
        Insert: {
          country: string
          customer_id: string
          formatted_area: string
          id?: string
        }
        Update: {
          country?: string
          customer_id?: string
          formatted_area?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_address_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_event: {
        Row: {
          author_id: string | null
          created_at: string | null
          customer_id: string
          id: string
          payload: Json | null
          type: string
        }
        Insert: {
          author_id?: string | null
          created_at?: string | null
          customer_id?: string
          id?: string
          payload?: Json | null
          type: string
        }
        Update: {
          author_id?: string | null
          created_at?: string | null
          customer_id?: string
          id?: string
          payload?: Json | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_event_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_event_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_marketing_consent: {
        Row: {
          customer_id: string
          status: string
          type: string
        }
        Insert: {
          customer_id: string
          status?: string
          type?: string
        }
        Update: {
          customer_id?: string
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_marketing_consent_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_order: {
        Row: {
          created_at: string
          customer_id: string
          fulfilled: boolean
          id: string
          price: number
          product_id: string
          quantity: number
          status: string | null
          tax: number
        }
        Insert: {
          created_at?: string
          customer_id: string
          fulfilled?: boolean
          id?: string
          price?: number
          product_id: string
          quantity?: number
          status?: string | null
          tax?: number
        }
        Update: {
          created_at?: string
          customer_id?: string
          fulfilled?: boolean
          id?: string
          price?: number
          product_id?: string
          quantity?: number
          status?: string | null
          tax?: number
        }
        Relationships: [
          {
            foreignKeyName: "customer_order_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_order_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_tag: {
        Row: {
          customer_id: string
          enabled: boolean
          tag_id: string
        }
        Insert: {
          customer_id: string
          enabled?: boolean
          tag_id: string
        }
        Update: {
          customer_id?: string
          enabled?: boolean
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_tag_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
        ]
      }
      product: {
        Row: {
          author_id: string | null
          category_id: string | null
          created_at: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          category_id?: string | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          category_id?: string | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profile: {
        Row: {
          avatar: string | null
          email: string | null
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          avatar?: string | null
          email?: string | null
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          avatar?: string | null
          email?: string | null
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
