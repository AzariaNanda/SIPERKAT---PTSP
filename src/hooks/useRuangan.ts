import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Ruangan } from '@/types/siperkat';

export const useRuangan = () => {
  const [ruangan, setRuangan] = useState<Ruangan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRuangan = async () => {
    try {
      const { data, error } = await supabase
        .from('master_ruangan')
        .select('*')
        .order('nama_ruangan');

      if (error) throw error;
      setRuangan(data || []);
    } catch (error: any) {
      toast.error('Gagal mengambil data ruangan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRuangan();
  }, []);

  const addRuangan = async (data: Omit<Ruangan, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('master_ruangan')
        .insert([data]);

      if (error) throw error;
      toast.success('Ruangan berhasil ditambahkan');
      await fetchRuangan();
      return true;
    } catch (error: any) {
      toast.error('Gagal menambah ruangan: ' + error.message);
      return false;
    }
  };

  const updateRuangan = async (id: string, data: Partial<Ruangan>) => {
    try {
      const { error } = await supabase
        .from('master_ruangan')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      toast.success('Ruangan berhasil diperbarui');
      await fetchRuangan();
      return true;
    } catch (error: any) {
      toast.error('Gagal memperbarui ruangan: ' + error.message);
      return false;
    }
  };

  const deleteRuangan = async (id: string) => {
    try {
      const { error } = await supabase
        .from('master_ruangan')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Ruangan berhasil dihapus');
      await fetchRuangan();
      return true;
    } catch (error: any) {
      toast.error('Gagal menghapus ruangan: ' + error.message);
      return false;
    }
  };

  return {
    ruangan,
    loading,
    addRuangan,
    updateRuangan,
    deleteRuangan,
    refetch: fetchRuangan,
  };
};
