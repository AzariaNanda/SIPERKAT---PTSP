import { useState, useEffect } from 'react';
import { 
  Calendar, Car, Home, Clock, LogOut, Plus, Edit2, Trash2, Phone, Upload, X, 
  CheckCircle, XCircle, AlertCircle, LayoutDashboard, ClipboardList, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Dashboard } from '@/components/dashboard/Dashboard';
import type { Kendaraan, Ruangan, Peminjaman, User } from '@/types/siperkat';

// KONSTANTA AUTENTIKASI
const ADMIN_EMAIL = 'subbagumpeg.dpmptspbms@gmail.com';
const USER_EMAIL = 'dpmpptspkabbanyumas@gmail.com';

// KOMPONEN JAM DIGITAL REAL-TIME
const LiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const formatTime = (date: Date) => {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="text-right">
      <div className="text-2xl font-bold text-primary-foreground">
        {formatTime(time)}
      </div>
      <div className="text-sm text-primary-foreground/80">
        {days[time.getDay()]}, {time.getDate()} {months[time.getMonth()]} {time.getFullYear()}
      </div>
    </div>
  );
};

// FUNGSI COLLISION DETECTION
const checkCollision = (
  newBooking: { id?: number; tgl_mulai: string; jam_mulai: string; tgl_selesai: string; jam_selesai: string },
  existingBookings: Peminjaman[],
  assetId: number
) => {
  const conflicts = existingBookings.filter(booking => {
    if (booking.status !== 'Disetujui') return false;
    if (booking.assetId !== assetId) return false;
    if (booking.id === newBooking.id) return false;

    const newStart = new Date(`${newBooking.tgl_mulai}T${newBooking.jam_mulai}`);
    const newEnd = new Date(`${newBooking.tgl_selesai}T${newBooking.jam_selesai}`);
    const existStart = new Date(`${booking.tgl_mulai}T${booking.jam_mulai}`);
    const existEnd = new Date(`${booking.tgl_selesai}T${booking.jam_selesai}`);

    return newStart < existEnd && newEnd > existStart;
  });

  return conflicts.length > 0 ? conflicts : null;
};

// Sample data with dates across months for testing
const generateSamplePeminjaman = (): Peminjaman[] => {
  const samples: Peminjaman[] = [];
  const statuses: Peminjaman['status'][] = ['Disetujui', 'Pending', 'Disetujui', 'Ditolak'];
  const units = ['Bidang Pelayanan', 'Sekretariat', 'Bidang Pengaduan', 'Bidang Perizinan'];
  
  for (let month = 0; month < 12; month++) {
    const kendaraanCount = Math.floor(Math.random() * 8) + 2;
    const ruanganCount = Math.floor(Math.random() * 6) + 1;
    
    for (let i = 0; i < kendaraanCount; i++) {
      const day = Math.floor(Math.random() * 28) + 1;
      samples.push({
        id: Date.now() + month * 100 + i,
        timestamp: new Date(2026, month, day).toISOString(),
        jenis: 'kendaraan',
        nama_pemohon: `Pegawai ${month + 1}-${i + 1}`,
        nip: `19850101 20100${month}1 00${i}`,
        unit: units[i % units.length],
        email: `pegawai${month}${i}@dpmptsp.go.id`,
        asset_id: String((i % 3) + 1),
        assetId: (i % 3) + 1,
        tgl_mulai: `2026-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        jam_mulai: '08:00',
        tgl_selesai: `2026-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        jam_selesai: '17:00',
        keperluan: 'Dinas luar',
        supir: Math.random() > 0.5,
        status: statuses[i % statuses.length],
        catatan_admin: '',
      });
    }
    
    for (let i = 0; i < ruanganCount; i++) {
      const day = Math.floor(Math.random() * 28) + 1;
      samples.push({
        id: Date.now() + month * 100 + kendaraanCount + i,
        timestamp: new Date(2026, month, day).toISOString(),
        jenis: 'ruangan',
        nama_pemohon: `Pegawai R${month + 1}-${i + 1}`,
        nip: `19900202 20150${month}2 00${i}`,
        unit: units[i % units.length],
        email: `pegawai.r${month}${i}@dpmptsp.go.id`,
        asset_id: String((i % 3) + 1),
        assetId: (i % 3) + 1,
        tgl_mulai: `2026-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        jam_mulai: '09:00',
        tgl_selesai: `2026-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        jam_selesai: '12:00',
        keperluan: 'Rapat koordinasi',
        supir: false,
        status: statuses[i % statuses.length],
        catatan_admin: '',
      });
    }
  }
  
  return samples;
};

const SiperkatApp = () => {
  // STATE AUTENTIKASI
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  // STATE UI
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedItem, setSelectedItem] = useState<Kendaraan | Ruangan | null>(null);
  const [assetType, setAssetType] = useState<'kendaraan' | 'ruangan'>('kendaraan');

  // STATE DATA
  const [kendaraan, setKendaraan] = useState<Kendaraan[]>([
    { id: 1, nama_kendaraan: 'Toyota Avanza', no_polisi: 'R 1234 AB', penempatan: 'Kantor Utama', foto_url: '' },
    { id: 2, nama_kendaraan: 'Honda Mobilio', no_polisi: 'R 5678 CD', penempatan: 'Kantor Cabang', foto_url: '' },
    { id: 3, nama_kendaraan: 'Daihatsu Xenia', no_polisi: 'R 9012 EF', penempatan: 'Kantor Utama', foto_url: '' }
  ]);

  const [ruangan, setRuangan] = useState<Ruangan[]>([
    { id: 1, nama_ruangan: 'Ruang Rapat Utama', lokasi: 'Lantai 2', kapasitas: 50, foto_url: '' },
    { id: 2, nama_ruangan: 'Ruang Rapat Kecil', lokasi: 'Lantai 1', kapasitas: 15, foto_url: '' },
    { id: 3, nama_ruangan: 'Aula Serbaguna', lokasi: 'Lantai 3', kapasitas: 200, foto_url: '' }
  ]);

  const [peminjaman, setPeminjaman] = useState<Peminjaman[]>(generateSamplePeminjaman());

  // STATE FORM USER
  const [formData, setFormData] = useState({
    jenis: 'kendaraan' as 'kendaraan' | 'ruangan',
    nama_pemohon: '',
    nip: '',
    unit: '',
    email: '',
    asset_id: '',
    tgl_mulai: '',
    jam_mulai: '',
    tgl_selesai: '',
    jam_selesai: '',
    keperluan: '',
    supir: false
  });

  // STATE FORM ADMIN CRUD
  const [crudForm, setCrudForm] = useState({
    nama_kendaraan: '',
    no_polisi: '',
    penempatan: '',
    nama_ruangan: '',
    lokasi: '',
    kapasitas: '',
    foto_url: '',
  });

  // FUNGSI LOGIN
  const handleLogin = async () => {
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const emails = [ADMIN_EMAIL, USER_EMAIL];
    const randomEmail = emails[Math.floor(Math.random() * emails.length)];
    
    if (randomEmail === ADMIN_EMAIL) {
      setUser({ email: randomEmail });
      setIsAdmin(true);
      setActiveTab('dashboard');
      toast.success('Login berhasil sebagai Administrator');
    } else if (randomEmail === USER_EMAIL) {
      setUser({ email: randomEmail });
      setIsAdmin(false);
      setActiveTab('dashboard');
      toast.success('Login berhasil sebagai User');
    } else {
      toast.error('Akses Ditolak. Akun tidak terdaftar.');
    }
    
    setLoading(false);
  };

  // FUNGSI LOGOUT
  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    toast.success('Logout berhasil');
  };

  // FUNGSI SUBMIT PENGAJUAN USER
  const handleSubmitPengajuan = () => {
    if (!formData.nama_pemohon || !formData.nip || !formData.unit || !formData.email || 
        !formData.asset_id || !formData.tgl_mulai || !formData.jam_mulai || 
        !formData.tgl_selesai || !formData.jam_selesai || !formData.keperluan) {
      toast.error('Mohon lengkapi semua field');
      return;
    }

    const newPeminjaman: Peminjaman = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...formData,
      assetId: parseInt(formData.asset_id),
      status: 'Pending',
      catatan_admin: ''
    };

    const conflicts = checkCollision(newPeminjaman, peminjaman, newPeminjaman.assetId);
    
    if (conflicts) {
      newPeminjaman.status = 'Konflik';
      toast.warning('Pengajuan terdeteksi konflik jadwal! Status: Pending Review');
    } else {
      toast.success('Pengajuan berhasil dikirim');
    }

    setPeminjaman([...peminjaman, newPeminjaman]);
    
    setFormData({
      jenis: 'kendaraan',
      nama_pemohon: '',
      nip: '',
      unit: '',
      email: '',
      asset_id: '',
      tgl_mulai: '',
      jam_mulai: '',
      tgl_selesai: '',
      jam_selesai: '',
      keperluan: '',
      supir: false
    });
  };

  // FUNGSI CRUD ADMIN
  const openAddModal = (type: 'kendaraan' | 'ruangan') => {
    setAssetType(type);
    setModalMode('add');
    setCrudForm({
      nama_kendaraan: '',
      no_polisi: '',
      penempatan: '',
      nama_ruangan: '',
      lokasi: '',
      kapasitas: '',
      foto_url: '',
    });
    setShowModal(true);
  };

  const openEditModal = (item: Kendaraan | Ruangan, type: 'kendaraan' | 'ruangan') => {
    setAssetType(type);
    setModalMode('edit');
    setSelectedItem(item);
    
    if (type === 'kendaraan') {
      const k = item as Kendaraan;
      setCrudForm({
        nama_kendaraan: k.nama_kendaraan,
        no_polisi: k.no_polisi,
        penempatan: k.penempatan,
        nama_ruangan: '',
        lokasi: '',
        kapasitas: '',
        foto_url: k.foto_url,
      });
    } else {
      const r = item as Ruangan;
      setCrudForm({
        nama_kendaraan: '',
        no_polisi: '',
        penempatan: '',
        nama_ruangan: r.nama_ruangan,
        lokasi: r.lokasi,
        kapasitas: String(r.kapasitas),
        foto_url: r.foto_url,
      });
    }
    
    setShowModal(true);
  };

  const handleSaveCrud = () => {
    if (assetType === 'kendaraan') {
      if (modalMode === 'add') {
        const newKendaraan: Kendaraan = {
          id: Date.now(),
          nama_kendaraan: crudForm.nama_kendaraan,
          no_polisi: crudForm.no_polisi,
          penempatan: crudForm.penempatan,
          foto_url: crudForm.foto_url
        };
        setKendaraan([...kendaraan, newKendaraan]);
        toast.success('Data kendaraan berhasil ditambahkan');
      } else if (selectedItem) {
        const updated = kendaraan.map(k => 
          k.id === selectedItem.id 
            ? { ...k, nama_kendaraan: crudForm.nama_kendaraan, no_polisi: crudForm.no_polisi, penempatan: crudForm.penempatan, foto_url: crudForm.foto_url }
            : k
        );
        setKendaraan(updated);
        toast.success('Data kendaraan berhasil diperbarui');
      }
    } else {
      if (modalMode === 'add') {
        const newRuangan: Ruangan = {
          id: Date.now(),
          nama_ruangan: crudForm.nama_ruangan,
          lokasi: crudForm.lokasi,
          kapasitas: parseInt(crudForm.kapasitas),
          foto_url: crudForm.foto_url
        };
        setRuangan([...ruangan, newRuangan]);
        toast.success('Data ruangan berhasil ditambahkan');
      } else if (selectedItem) {
        const updated = ruangan.map(r => 
          r.id === selectedItem.id 
            ? { ...r, nama_ruangan: crudForm.nama_ruangan, lokasi: crudForm.lokasi, kapasitas: parseInt(crudForm.kapasitas), foto_url: crudForm.foto_url }
            : r
        );
        setRuangan(updated);
        toast.success('Data ruangan berhasil diperbarui');
      }
    }

    setShowModal(false);
  };

  const handleDelete = (id: number, type: 'kendaraan' | 'ruangan') => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) return;

    if (type === 'kendaraan') {
      setKendaraan(kendaraan.filter(k => k.id !== id));
      toast.success('Data kendaraan berhasil dihapus');
    } else {
      setRuangan(ruangan.filter(r => r.id !== id));
      toast.success('Data ruangan berhasil dihapus');
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Pending': return 'secondary';
      case 'Disetujui': return 'default';
      case 'Ditolak': return 'destructive';
      case 'Konflik': return 'outline';
      default: return 'secondary';
    }
  };

  const getAssetName = (jenis: string, assetId: number) => {
    if (jenis === 'kendaraan') {
      const k = kendaraan.find(x => x.id === assetId);
      return k ? `${k.nama_kendaraan} (${k.no_polisi})` : 'Unknown';
    } else {
      const r = ruangan.find(x => x.id === assetId);
      return r ? r.nama_ruangan : 'Unknown';
    }
  };

  // RENDER LOGIN SCREEN
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-accent flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-2xl">
          <CardContent className="pt-8 pb-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
                <Car className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-primary mb-2">SIPERKAT</h1>
              <p className="text-foreground font-semibold">Sistem Peminjaman Terpadu</p>
              <p className="text-sm text-muted-foreground mt-2">DPMPTSP Kabupaten Banyumas</p>
            </div>
            
            <Button
              onClick={handleLogin}
              disabled={loading}
              className="w-full h-14 text-lg font-semibold"
              size="lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-3"></div>
                  Memproses...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Login dengan Google
                </>
              )}
            </Button>
            
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                <span className="font-semibold">Akses Terbatas:</span> Hanya pengguna terdaftar yang dapat mengakses sistem ini
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // RENDER MAIN DASHBOARD
  return (
    <div className="min-h-screen bg-background">
      {/* NAVBAR */}
      <nav className="bg-primary text-primary-foreground shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Car className="w-10 h-10" />
              <div>
                <h1 className="text-2xl font-bold">SIPERKAT</h1>
                <p className="text-sm text-primary-foreground/80">
                  {isAdmin ? 'Administrator Panel' : 'User Dashboard'} • DPMPTSP Banyumas
                </p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <LiveClock />
              <Button
                onClick={handleLogout}
                variant="secondary"
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* WHATSAPP FLOAT BUTTON */}
      <a
        href="https://wa.me/628123456789"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 bg-success text-success-foreground p-4 rounded-full shadow-2xl hover:scale-110 transition-all z-50"
        title="Hubungi Support WhatsApp"
      >
        <Phone className="w-6 h-6" />
      </a>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card shadow-sm border">
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            {!isAdmin && (
              <>
                <TabsTrigger value="pengajuan" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Pengajuan Baru
                </TabsTrigger>
                <TabsTrigger value="riwayat" className="gap-2">
                  <ClipboardList className="w-4 h-4" />
                  Riwayat
                </TabsTrigger>
              </>
            )}
            {isAdmin && (
              <>
                <TabsTrigger value="kendaraan" className="gap-2">
                  <Car className="w-4 h-4" />
                  Kendaraan
                </TabsTrigger>
                <TabsTrigger value="ruangan" className="gap-2">
                  <Home className="w-4 h-4" />
                  Ruangan
                </TabsTrigger>
                <TabsTrigger value="permintaan" className="gap-2">
                  <ClipboardList className="w-4 h-4" />
                  Permintaan
                </TabsTrigger>
              </>
            )}
          </TabsList>

          {/* DASHBOARD TAB */}
          <TabsContent value="dashboard">
            <Dashboard peminjaman={peminjaman} isAdmin={isAdmin} />
          </TabsContent>

          {/* USER: TAB PENGAJUAN */}
          {!isAdmin && (
            <TabsContent value="pengajuan">
              <Card className="shadow-lg border-none">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Calendar className="w-7 h-7 text-primary" />
                    Form Pengajuan Peminjaman
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Jenis Peminjaman</Label>
                      <Select
                        value={formData.jenis}
                        onValueChange={(val: 'kendaraan' | 'ruangan') => 
                          setFormData({ ...formData, jenis: val, asset_id: '' })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kendaraan">Kendaraan Dinas</SelectItem>
                          <SelectItem value="ruangan">Ruang Rapat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>{formData.jenis === 'kendaraan' ? 'Pilih Kendaraan' : 'Pilih Ruangan'}</Label>
                      <Select
                        value={formData.asset_id}
                        onValueChange={(val) => setFormData({ ...formData, asset_id: val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Pilih ${formData.jenis}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.jenis === 'kendaraan' 
                            ? kendaraan.map(k => (
                                <SelectItem key={k.id} value={String(k.id)}>
                                  {k.nama_kendaraan} ({k.no_polisi})
                                </SelectItem>
                              ))
                            : ruangan.map(r => (
                                <SelectItem key={r.id} value={String(r.id)}>
                                  {r.nama_ruangan} - Kapasitas {r.kapasitas}
                                </SelectItem>
                              ))
                          }
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        placeholder="Nomor Induk Pegawai"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Unit/Bidang</Label>
                      <Input
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        placeholder="Contoh: Bidang Pelayanan"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                  </div>

                  <div className="space-y-2">
                    <Label>{formData.jenis === 'kendaraan' ? 'Keperluan/Tujuan' : 'Agenda Rapat'}</Label>
                    <Textarea
                      value={formData.keperluan}
                      onChange={(e) => setFormData({ ...formData, keperluan: e.target.value })}
                      placeholder={formData.jenis === 'kendaraan' ? 'Jelaskan keperluan penggunaan kendaraan' : 'Jelaskan agenda rapat'}
                      rows={4}
                    />
                  </div>

                  {formData.jenis === 'kendaraan' && (
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                      <Checkbox
                        id="supir"
                        checked={formData.supir}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, supir: checked as boolean })
                        }
                      />
                      <Label htmlFor="supir" className="cursor-pointer">
                        Memerlukan Supir
                      </Label>
                    </div>
                  )}

                  <Button onClick={handleSubmitPengajuan} className="w-full h-12 text-lg gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Ajukan Peminjaman
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* USER: TAB RIWAYAT */}
          {!isAdmin && (
            <TabsContent value="riwayat">
              <Card className="shadow-lg border-none">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Calendar className="w-7 h-7 text-primary" />
                    Riwayat Peminjaman Saya
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {peminjaman.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                      <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p className="text-lg">Belum ada riwayat peminjaman</p>
                    </div>
                  ) : (
                    <div className="rounded-lg border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-primary hover:bg-primary">
                            <TableHead className="text-primary-foreground font-bold">Tanggal</TableHead>
                            <TableHead className="text-primary-foreground font-bold">Jenis</TableHead>
                            <TableHead className="text-primary-foreground font-bold">Aset</TableHead>
                            <TableHead className="text-primary-foreground font-bold">Waktu</TableHead>
                            <TableHead className="text-primary-foreground font-bold">Keperluan</TableHead>
                            <TableHead className="text-primary-foreground font-bold text-center">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {peminjaman.slice(0, 20).map((p, idx) => (
                            <TableRow key={p.id} className={idx % 2 === 0 ? 'bg-muted/30' : ''}>
                              <TableCell className="text-sm">
                                {new Date(p.timestamp).toLocaleDateString('id-ID')}
                              </TableCell>
                              <TableCell className="capitalize font-medium">{p.jenis}</TableCell>
                              <TableCell>{getAssetName(p.jenis, p.assetId)}</TableCell>
                              <TableCell className="text-sm">
                                <div>{p.tgl_mulai} {p.jam_mulai}</div>
                                <div className="text-muted-foreground">s/d {p.tgl_selesai} {p.jam_selesai}</div>
                              </TableCell>
                              <TableCell className="text-sm max-w-[200px] truncate">{p.keperluan}</TableCell>
                              <TableCell className="text-center">
                                <Badge variant={getStatusVariant(p.status)}>{p.status}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* ADMIN: TAB KENDARAAN */}
          {isAdmin && (
            <TabsContent value="kendaraan">
              <Card className="shadow-lg border-none">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Car className="w-7 h-7 text-primary" />
                    Manajemen Kendaraan Dinas
                  </CardTitle>
                  <Button onClick={() => openAddModal('kendaraan')} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Tambah Kendaraan
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {kendaraan.map(k => (
                      <Card key={k.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                        <div className="h-48 bg-muted flex items-center justify-center">
                          {k.foto_url ? (
                            <img src={k.foto_url} alt={k.nama_kendaraan} className="w-full h-full object-cover" />
                          ) : (
                            <Car className="w-16 h-16 text-muted-foreground" />
                          )}
                        </div>
                        <CardContent className="p-5">
                          <h3 className="font-bold text-lg text-primary mb-2">{k.nama_kendaraan}</h3>
                          <div className="space-y-1 text-sm text-muted-foreground mb-4">
                            <p><span className="font-semibold text-foreground">No. Polisi:</span> {k.no_polisi}</p>
                            <p><span className="font-semibold text-foreground">Penempatan:</span> {k.penempatan}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => openEditModal(k, 'kendaraan')}
                              variant="outline"
                              className="flex-1 gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDelete(k.id, 'kendaraan')}
                              variant="destructive"
                              className="flex-1 gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Hapus
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* ADMIN: TAB RUANGAN */}
          {isAdmin && (
            <TabsContent value="ruangan">
              <Card className="shadow-lg border-none">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Home className="w-7 h-7 text-primary" />
                    Manajemen Ruang Rapat
                  </CardTitle>
                  <Button onClick={() => openAddModal('ruangan')} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Tambah Ruangan
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ruangan.map(r => (
                      <Card key={r.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                        <div className="h-48 bg-muted flex items-center justify-center">
                          {r.foto_url ? (
                            <img src={r.foto_url} alt={r.nama_ruangan} className="w-full h-full object-cover" />
                          ) : (
                            <Home className="w-16 h-16 text-muted-foreground" />
                          )}
                        </div>
                        <CardContent className="p-5">
                          <h3 className="font-bold text-lg text-primary mb-2">{r.nama_ruangan}</h3>
                          <div className="space-y-1 text-sm text-muted-foreground mb-4">
                            <p><span className="font-semibold text-foreground">Lokasi:</span> {r.lokasi}</p>
                            <p><span className="font-semibold text-foreground">Kapasitas:</span> {r.kapasitas} orang</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => openEditModal(r, 'ruangan')}
                              variant="outline"
                              className="flex-1 gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDelete(r.id, 'ruangan')}
                              variant="destructive"
                              className="flex-1 gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Hapus
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* ADMIN: TAB PERMINTAAN */}
          {isAdmin && (
            <TabsContent value="permintaan">
              <Card className="shadow-lg border-none">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <ClipboardList className="w-7 h-7 text-primary" />
                    Daftar Permintaan Peminjaman
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-primary hover:bg-primary">
                          <TableHead className="text-primary-foreground font-bold">Tanggal</TableHead>
                          <TableHead className="text-primary-foreground font-bold">Pemohon</TableHead>
                          <TableHead className="text-primary-foreground font-bold">Jenis</TableHead>
                          <TableHead className="text-primary-foreground font-bold">Aset</TableHead>
                          <TableHead className="text-primary-foreground font-bold">Waktu</TableHead>
                          <TableHead className="text-primary-foreground font-bold text-center">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {peminjaman.slice(0, 30).map((p, idx) => (
                          <TableRow key={p.id} className={idx % 2 === 0 ? 'bg-muted/30' : ''}>
                            <TableCell className="text-sm">
                              {new Date(p.timestamp).toLocaleDateString('id-ID')}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{p.nama_pemohon}</div>
                              <div className="text-xs text-muted-foreground">{p.unit}</div>
                            </TableCell>
                            <TableCell className="capitalize">{p.jenis}</TableCell>
                            <TableCell>{getAssetName(p.jenis, p.assetId)}</TableCell>
                            <TableCell className="text-sm">
                              <div>{p.tgl_mulai} {p.jam_mulai}</div>
                              <div className="text-muted-foreground">s/d {p.tgl_selesai}</div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant={getStatusVariant(p.status)}>{p.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* MODAL CRUD */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {modalMode === 'add' ? 'Tambah' : 'Edit'} {assetType === 'kendaraan' ? 'Kendaraan' : 'Ruangan'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {assetType === 'kendaraan' ? (
              <>
                <div className="space-y-2">
                  <Label>Nama Kendaraan</Label>
                  <Input
                    value={crudForm.nama_kendaraan}
                    onChange={(e) => setCrudForm({ ...crudForm, nama_kendaraan: e.target.value })}
                    placeholder="Contoh: Toyota Avanza"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nomor Polisi</Label>
                  <Input
                    value={crudForm.no_polisi}
                    onChange={(e) => setCrudForm({ ...crudForm, no_polisi: e.target.value })}
                    placeholder="Contoh: R 1234 AB"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Penempatan</Label>
                  <Input
                    value={crudForm.penempatan}
                    onChange={(e) => setCrudForm({ ...crudForm, penempatan: e.target.value })}
                    placeholder="Contoh: Kantor Utama"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Nama Ruangan</Label>
                  <Input
                    value={crudForm.nama_ruangan}
                    onChange={(e) => setCrudForm({ ...crudForm, nama_ruangan: e.target.value })}
                    placeholder="Contoh: Ruang Rapat Utama"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Lokasi</Label>
                  <Input
                    value={crudForm.lokasi}
                    onChange={(e) => setCrudForm({ ...crudForm, lokasi: e.target.value })}
                    placeholder="Contoh: Lantai 2"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kapasitas (orang)</Label>
                  <Input
                    type="number"
                    value={crudForm.kapasitas}
                    onChange={(e) => setCrudForm({ ...crudForm, kapasitas: e.target.value })}
                    placeholder="Contoh: 50"
                  />
                </div>
              </>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setShowModal(false)}
                variant="outline"
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                onClick={handleSaveCrud}
                className="flex-1 gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SiperkatApp;
