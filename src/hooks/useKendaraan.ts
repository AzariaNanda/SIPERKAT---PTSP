import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Kendaraan } from '@/types/siperkat';

export const useKendaraan = () => {
  const [kendaraan, setKendaraan] = useState<Kendaraan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchKendaraan = async () => {
    try {
      const { data, error } = await supabase
        .from('master_kendaraan')
        .select('*')
        .order('nama_kendaraan');

      if (error) throw error;
      setKendaraan(data || []);
    } catch (error: any) {
      toast.error('Gagal mengambil data kendaraan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKendaraan();
  }, []);

  const addKendaraan = async (data: Omit<Kendaraan, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('master_kendaraan')
        .insert([data]);

      if (error) throw error;
      toast.success('Kendaraan berhasil ditambahkan');
      await fetchKendaraan();
      return true;
    } catch (error: any) {
      toast.error('Gagal menambah kendaraan: ' + error.message);
      return false;
    }
  };

  const updateKendaraan = async (id: string, data: Partial<Kendaraan>) => {
    try {
      const { error } = await supabase
        .from('master_kendaraan')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      toast.success('Kendaraan berhasil diperbarui');
      await fetchKendaraan();
      return true;
    } catch (error: any) {
      toast.error('Gagal memperbarui kendaraan: ' + error.message);
      return false;
    }
  };

  const deleteKendaraan = async (id: string) => {
    try {
      const { error } = await supabase
        .from('master_kendaraan')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Kendaraan berhasil dihapus');
      await fetchKendaraan();
      return true;
    } catch (error: any) {
      toast.error('Gagal menghapus kendaraan: ' + error.message);
      return false;
    }
  };

  return {
    kendaraan,
    loading,
    addKendaraan,
    updateKendaraan,
    deleteKendaraan,
    refetch: fetchKendaraan,
  };
};
