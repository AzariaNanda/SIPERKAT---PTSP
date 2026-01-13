import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from './StatusBadge';
import { StatusButtons } from './StatusButtons';
import { ClipboardList, Car, Home } from 'lucide-react';
import type { Peminjaman, Kendaraan, Ruangan } from '@/types/siperkat';

interface PeminjamanTableProps {
  peminjaman: Peminjaman[];
  kendaraan: Kendaraan[];
  ruangan: Ruangan[];
  isAdmin: boolean;
  onStatusChange?: (id: string, status: 'Pending' | 'Disetujui' | 'Ditolak' | 'Konflik') => Promise<boolean>;
  title?: string;
}

export const PeminjamanTable = ({ 
  peminjaman, 
  kendaraan, 
  ruangan, 
  isAdmin, 
  onStatusChange,
  title = 'Daftar Pengajuan'
}: PeminjamanTableProps) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const getAssetName = (assetId: string, jenis: 'kendaraan' | 'ruangan') => {
    if (jenis === 'kendaraan') {
      const k = kendaraan.find(x => x.id === assetId);
      return k ? `${k.nama_kendaraan} (${k.no_polisi})` : 'Unknown';
    } else {
      const r = ruangan.find(x => x.id === assetId);
      return r ? r.nama_ruangan : 'Unknown';
    }
  };

  const handleStatusChange = async (id: string, status: 'Pending' | 'Disetujui' | 'Ditolak' | 'Konflik') => {
    if (!onStatusChange) return;
    setLoadingId(id);
    await onStatusChange(id, status);
    setLoadingId(null);
  };

  if (peminjaman.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Belum ada data pengajuan
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-primary" />
          {title}
          <span className="text-sm font-normal text-muted-foreground">
            ({peminjaman.length} data)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Pemohon</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Aset</TableHead>
                <TableHead>Jadwal</TableHead>
                <TableHead>Keperluan</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {peminjaman.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="whitespace-nowrap">
                    {new Date(p.timestamp).toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{p.nama_pemohon}</p>
                      <p className="text-xs text-muted-foreground">{p.nip}</p>
                      <p className="text-xs text-muted-foreground">{p.unit}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {p.jenis_asset === 'kendaraan' ? (
                        <Car className="w-4 h-4 text-accent" />
                      ) : (
                        <Home className="w-4 h-4 text-success" />
                      )}
                      <span className="capitalize">{p.jenis_asset}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    {getAssetName(p.asset_id, p.jenis_asset)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="text-sm">
                      <p>{p.tgl_mulai} {p.jam_mulai}</p>
                      <p className="text-muted-foreground">s/d</p>
                      <p>{p.tgl_selesai} {p.jam_selesai}</p>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <p className="truncate">{p.keperluan}</p>
                    {p.catatan_admin && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Catatan: {p.catatan_admin}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    {isAdmin && onStatusChange ? (
                      <StatusButtons
                        currentStatus={p.status}
                        onStatusChange={(status) => handleStatusChange(p.id, status)}
                        loading={loadingId === p.id}
                      />
                    ) : (
                      <StatusBadge status={p.status} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
