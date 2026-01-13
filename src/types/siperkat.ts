export interface Kendaraan {
  id: string;
  nama_kendaraan: string;
  no_polisi: string;
  penempatan: string;
  foto_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Ruangan {
  id: string;
  nama_ruangan: string;
  lokasi: string;
  kapasitas: number;
  foto_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Peminjaman {
  id: string;
  timestamp: string;
  user_id: string;
  nama_pemohon: string;
  nip: string;
  unit: string;
  email: string;
  asset_id: string;
  jenis_asset: 'kendaraan' | 'ruangan';
  tgl_mulai: string;
  jam_mulai: string;
  tgl_selesai: string;
  jam_selesai: string;
  keperluan: string;
  status: 'Pending' | 'Disetujui' | 'Ditolak' | 'Konflik';
  catatan_admin: string | null;
  created_at: string;
  updated_at: string;
}

export interface MonthlyStats {
  month: string;
  monthName: string;
  kendaraan: number;
  ruangan: number;
  total: number;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
  created_at: string;
}

export type AppRole = 'admin' | 'user';
