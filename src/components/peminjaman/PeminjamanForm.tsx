import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClipboardList, Send } from 'lucide-react';
import { toast } from 'sonner';
import type { Kendaraan, Ruangan } from '@/types/siperkat';

interface PeminjamanFormProps {
  kendaraan: Kendaraan[];
  ruangan: Ruangan[];
  userId: string;
  userEmail: string;
  onSubmit: (data: any) => Promise<boolean>;
}

export const PeminjamanForm = ({ kendaraan, ruangan, userId, userEmail, onSubmit }: PeminjamanFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    jenis_asset: 'kendaraan' as 'kendaraan' | 'ruangan',
    nama_pemohon: '',
    nip: '',
    unit: '',
    asset_id: '',
    tgl_mulai: '',
    jam_mulai: '',
    tgl_selesai: '',
    jam_selesai: '',
    keperluan: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nama_pemohon || !formData.nip || !formData.unit || 
        !formData.asset_id || !formData.tgl_mulai || !formData.jam_mulai || 
        !formData.tgl_selesai || !formData.jam_selesai || !formData.keperluan) {
      toast.error('Mohon lengkapi semua field');
      return;
    }

    // Validate dates
    const startDateTime = new Date(`${formData.tgl_mulai}T${formData.jam_mulai}`);
    const endDateTime = new Date(`${formData.tgl_selesai}T${formData.jam_selesai}`);
    
    if (endDateTime <= startDateTime) {
      toast.error('Tanggal/jam selesai harus setelah tanggal/jam mulai');
      return;
    }

    setLoading(true);
    const success = await onSubmit({
      ...formData,
      user_id: userId,
      email: userEmail,
    });

    if (success) {
      setFormData({
        jenis_asset: 'kendaraan',
        nama_pemohon: '',
        nip: '',
        unit: '',
        asset_id: '',
        tgl_mulai: '',
        jam_mulai: '',
        tgl_selesai: '',
        jam_selesai: '',
        keperluan: '',
      });
    }
    setLoading(false);
  };

  const availableAssets = formData.jenis_asset === 'kendaraan' ? kendaraan : ruangan;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-primary" />
          Form Pengajuan Peminjaman
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Jenis Aset</Label>
              <Select
                value={formData.jenis_asset}
                onValueChange={(val: 'kendaraan' | 'ruangan') => 
                  setFormData({ ...formData, jenis_asset: val, asset_id: '' })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis aset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kendaraan">Kendaraan</SelectItem>
                  <SelectItem value="ruangan">Ruangan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Pilih {formData.jenis_asset === 'kendaraan' ? 'Kendaraan' : 'Ruangan'}</Label>
              <Select
                value={formData.asset_id}
                onValueChange={(val) => setFormData({ ...formData, asset_id: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Pilih ${formData.jenis_asset}`} />
                </SelectTrigger>
                <SelectContent>
                  {availableAssets.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id}>
                      {formData.jenis_asset === 'kendaraan' 
                        ? `${(asset as Kendaraan).nama_kendaraan} (${(asset as Kendaraan).no_polisi})`
                        : `${(asset as Ruangan).nama_ruangan} - ${(asset as Ruangan).lokasi}`
                      }
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Nama Pemohon</Label>
              <Input
                value={formData.nama_pemohon}
                onChange={(e) => setFormData({ ...formData, nama_pemohon: e.target.value })}
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div className="space-y-2">
              <Label>NIP</Label>
              <Input
                value={formData.nip}
                onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                placeholder="Masukkan NIP"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Unit Kerja</Label>
              <Input
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="Masukkan unit kerja"
              />
            </div>

            <div className="space-y-2">
              <Label>Tanggal Mulai</Label>
              <Input
                type="date"
                value={formData.tgl_mulai}
                onChange={(e) => setFormData({ ...formData, tgl_mulai: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Jam Mulai</Label>
              <Input
                type="time"
                value={formData.jam_mulai}
                onChange={(e) => setFormData({ ...formData, jam_mulai: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Tanggal Selesai</Label>
              <Input
                type="date"
                value={formData.tgl_selesai}
                onChange={(e) => setFormData({ ...formData, tgl_selesai: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Jam Selesai</Label>
              <Input
                type="time"
                value={formData.jam_selesai}
                onChange={(e) => setFormData({ ...formData, jam_selesai: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Keperluan</Label>
              <Textarea
                value={formData.keperluan}
                onChange={(e) => setFormData({ ...formData, keperluan: e.target.value })}
                placeholder="Jelaskan keperluan peminjaman"
                rows={3}
              />
            </div>
          </div>

          <Button type="submit" className="w-full gap-2" disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                Mengirim...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Ajukan Peminjaman
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
