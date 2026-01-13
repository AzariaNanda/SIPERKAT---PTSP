import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Peminjaman } from '@/types/siperkat';

type PeminjamanStatus = 'Pending' | 'Disetujui' | 'Ditolak' | 'Konflik';
type JenisAsset = 'kendaraan' | 'ruangan';

export const usePeminjaman = (userId?: string, isAdmin?: boolean) => {
  const [peminjaman, setPeminjaman] = useState<Peminjaman[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPeminjaman = async () => {
    try {
      let query = supabase
        .from('data_peminjaman')
        .select('*')
        .order('timestamp', { ascending: false });

      // If not admin, only fetch user's own data
      if (!isAdmin && userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Cast the data to match our Peminjaman type
      const typedData = (data || []).map(item => ({
        ...item,
        jenis_asset: item.jenis_asset as JenisAsset,
        status: item.status as PeminjamanStatus,
      }));
      
      setPeminjaman(typedData);
    } catch (error: any) {
      toast.error('Gagal mengambil data peminjaman: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeminjaman();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('peminjaman-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'data_peminjaman',
        },
        () => {
          fetchPeminjaman();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, isAdmin]);

  const checkCollision = async (
    assetId: string,
    jenisAsset: JenisAsset,
    tglMulai: string,
    jamMulai: string,
    tglSelesai: string,
    jamSelesai: string,
    excludeId?: string
  ): Promise<Peminjaman[]> => {
    try {
      let query = supabase
        .from('data_peminjaman')
        .select('*')
        .eq('asset_id', assetId)
        .eq('jenis_asset', jenisAsset)
        .eq('status', 'Disetujui');

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const newStart = new Date(`${tglMulai}T${jamMulai}`);
      const newEnd = new Date(`${tglSelesai}T${jamSelesai}`);

      const conflicts = (data || []).filter(booking => {
        const existStart = new Date(`${booking.tgl_mulai}T${booking.jam_mulai}`);
        const existEnd = new Date(`${booking.tgl_selesai}T${booking.jam_selesai}`);
        return newStart < existEnd && newEnd > existStart;
      });

      return conflicts.map(item => ({
        ...item,
        jenis_asset: item.jenis_asset as JenisAsset,
        status: item.status as PeminjamanStatus,
      }));
    } catch (error) {
      return [];
    }
  };

  const addPeminjaman = async (
    data: Omit<Peminjaman, 'id' | 'timestamp' | 'status' | 'catatan_admin' | 'created_at' | 'updated_at'>
  ) => {
    try {
      // Check for conflicts first
      const conflicts = await checkCollision(
        data.asset_id,
        data.jenis_asset,
        data.tgl_mulai,
        data.jam_mulai,
        data.tgl_selesai,
        data.jam_selesai
      );

      const status: PeminjamanStatus = conflicts.length > 0 ? 'Konflik' : 'Pending';

      const { error } = await supabase
        .from('data_peminjaman')
        .insert([{ ...data, status }]);

      if (error) throw error;

      if (conflicts.length > 0) {
        toast.warning('Pengajuan terdeteksi konflik jadwal! Status: Pending Review');
      } else {
        toast.success('Pengajuan berhasil dikirim');
      }
      
      await fetchPeminjaman();
      return true;
    } catch (error: any) {
      toast.error('Gagal mengajukan peminjaman: ' + error.message);
      return false;
    }
  };

  const updateStatus = async (id: string, status: PeminjamanStatus, catatanAdmin?: string) => {
    try {
      // If approving, check for conflicts first
      if (status === 'Disetujui') {
        const booking = peminjaman.find(p => p.id === id);
        if (booking) {
          const conflicts = await checkCollision(
            booking.asset_id,
            booking.jenis_asset,
            booking.tgl_mulai,
            booking.jam_mulai,
            booking.tgl_selesai,
            booking.jam_selesai,
            id
          );

          if (conflicts.length > 0) {
            toast.error('Tidak dapat menyetujui: Jadwal bentrok dengan peminjaman lain yang sudah disetujui');
            return false;
          }
        }
      }

      const updateData: { status: PeminjamanStatus; catatan_admin?: string } = { status };
      if (catatanAdmin !== undefined) {
        updateData.catatan_admin = catatanAdmin;
      }

      const { error } = await supabase
        .from('data_peminjaman')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast.success(`Status berhasil diubah menjadi ${status}`);
      await fetchPeminjaman();
      return true;
    } catch (error: any) {
      toast.error('Gagal mengubah status: ' + error.message);
      return false;
    }
  };

  return {
    peminjaman,
    loading,
    addPeminjaman,
    updateStatus,
    checkCollision,
    refetch: fetchPeminjaman,
  };
};
