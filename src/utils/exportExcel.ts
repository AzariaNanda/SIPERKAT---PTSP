import * as XLSX from 'xlsx';
import type { MonthlyStats, Peminjaman } from '@/types/siperkat';

export const exportMonthlyStats = (stats: MonthlyStats[], year: number) => {
  const data = stats.map(s => ({
    'Bulan': s.monthName,
    'Peminjaman Kendaraan': s.kendaraan,
    'Peminjaman Ruangan': s.ruangan,
    'Total Peminjaman': s.total,
  }));

  // Add totals row
  const totals = stats.reduce(
    (acc, s) => ({
      kendaraan: acc.kendaraan + s.kendaraan,
      ruangan: acc.ruangan + s.ruangan,
      total: acc.total + s.total,
    }),
    { kendaraan: 0, ruangan: 0, total: 0 }
  );

  data.push({
    'Bulan': 'TOTAL',
    'Peminjaman Kendaraan': totals.kendaraan,
    'Peminjaman Ruangan': totals.ruangan,
    'Total Peminjaman': totals.total,
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Statistik ${year}`);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 15 },
    { wch: 22 },
    { wch: 22 },
    { wch: 18 },
  ];

  XLSX.writeFile(workbook, `Laporan_Peminjaman_${year}.xlsx`);
};

export const exportDetailedData = (
  peminjaman: Peminjaman[], 
  year: number, 
  jenisAsset: 'kendaraan' | 'ruangan',
  getAssetName: (assetId: string, jenis: 'kendaraan' | 'ruangan') => string
) => {
  // Filter by asset type
  const filtered = peminjaman.filter(p => p.jenis_asset === jenisAsset);
  
  const data = filtered.map(p => ({
    'Tanggal Pengajuan': new Date(p.timestamp).toLocaleDateString('id-ID'),
    'Jenis': p.jenis_asset === 'kendaraan' ? 'Kendaraan' : 'Ruangan',
    'Aset': getAssetName(p.asset_id, p.jenis_asset),
    'Nama Pemohon': p.nama_pemohon,
    'NIP': p.nip,
    'Unit/Bidang': p.unit,
    'Email': p.email,
    'Tanggal Mulai': p.tgl_mulai,
    'Jam Mulai': p.jam_mulai,
    'Tanggal Selesai': p.tgl_selesai,
    'Jam Selesai': p.jam_selesai,
    'Keperluan': p.keperluan,
    'Status': p.status,
    'Catatan Admin': p.catatan_admin || '-',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  
  const jenisLabel = jenisAsset === 'kendaraan' ? 'Kendaraan' : 'Ruangan';
  const sheetName = `Peminjaman ${jenisLabel}`;
  
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 18 },
    { wch: 12 },
    { wch: 25 },
    { wch: 25 },
    { wch: 20 },
    { wch: 20 },
    { wch: 30 },
    { wch: 14 },
    { wch: 10 },
    { wch: 14 },
    { wch: 10 },
    { wch: 40 },
    { wch: 12 },
    { wch: 20 },
  ];

  const filename = `Detail_Peminjaman_${jenisLabel}_${year}.xlsx`;
    
  XLSX.writeFile(workbook, filename);
};
