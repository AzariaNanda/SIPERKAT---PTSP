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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      allowed_users: {
        Row: {
          created_at: string | null
          email: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string | null
          email: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string | null
          email?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      data_peminjaman: {
        Row: {
          asset_id: string
          butuh_supir: string | null
          catatan_admin: string | null
          created_at: string | null
          email: string
          file_surat_url: string | null
          id: string
          jam_mulai: string
          jam_selesai: string
          jenis_asset: Database["public"]["Enums"]["jenis_asset"]
          keperluan: string
          nama_pemohon: string
          nip: string
          status: Database["public"]["Enums"]["status_peminjaman"] | null
          tgl_mulai: string
          tgl_selesai: string
          timestamp: string | null
          unit: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          asset_id: string
          butuh_supir?: string | null
          catatan_admin?: string | null
          created_at?: string | null
          email: string
          file_surat_url?: string | null
          id?: string
          jam_mulai: string
          jam_selesai: string
          jenis_asset: Database["public"]["Enums"]["jenis_asset"]
          keperluan: string
          nama_pemohon: string
          nip: string
          status?: Database["public"]["Enums"]["status_peminjaman"] | null
          tgl_mulai: string
          tgl_selesai: string
          timestamp?: string | null
          unit: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          asset_id?: string
          butuh_supir?: string | null
          catatan_admin?: string | null
          created_at?: string | null
          email?: string
          file_surat_url?: string | null
          id?: string
          jam_mulai?: string
          jam_selesai?: string
          jenis_asset?: Database["public"]["Enums"]["jenis_asset"]
          keperluan?: string
          nama_pemohon?: string
          nip?: string
          status?: Database["public"]["Enums"]["status_peminjaman"] | null
          tgl_mulai?: string
          tgl_selesai?: string
          timestamp?: string | null
          unit?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      master_kendaraan: {
        Row: {
          created_at: string | null
          foto_url: string | null
          id: string
          nama_kendaraan: string
          no_polisi: string
          penempatan: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          foto_url?: string | null
          id?: string
          nama_kendaraan: string
          no_polisi: string
          penempatan: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          foto_url?: string | null
          id?: string
          nama_kendaraan?: string
          no_polisi?: string
          penempatan?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      master_ruangan: {
        Row: {
          created_at: string | null
          foto_url: string | null
          id: string
          kapasitas: number | null
          lokasi: string
          nama_ruangan: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          foto_url?: string | null
          id?: string
          kapasitas?: number | null
          lokasi: string
          nama_ruangan: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          foto_url?: string | null
          id?: string
          kapasitas?: number | null
          lokasi?: string
          nama_ruangan?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      master_supir: {
        Row: {
          created_at: string | null
          id: string
          nama_supir: string
          status: string | null
          telepon: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          nama_supir: string
          status?: string | null
          telepon?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          nama_supir?: string
          status?: string | null
          telepon?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      jenis_asset: "kendaraan" | "ruangan"
      status_peminjaman: "Pending" | "Disetujui" | "Ditolak" | "Konflik"
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
      app_role: ["admin", "user"],
      jenis_asset: ["kendaraan", "ruangan"],
      status_peminjaman: ["Pending", "Disetujui", "Ditolak", "Konflik"],
    },
  },
} as const
