import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, ClipboardList, Settings, Car, Home } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useKendaraan } from '@/hooks/useKendaraan';
import { useRuangan } from '@/hooks/useRuangan';
import { usePeminjaman } from '@/hooks/usePeminjaman';
import { LoginPage } from '@/components/auth/LoginPage';
import { Navbar } from '@/components/layout/Navbar';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { PeminjamanForm } from '@/components/peminjaman/PeminjamanForm';
import { PeminjamanTable } from '@/components/peminjaman/PeminjamanTable';
import { AssetManagement } from '@/components/assets/AssetManagement';

const Index = () => {
  const { user, isAdmin, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const { kendaraan, addKendaraan, updateKendaraan, deleteKendaraan } = useKendaraan();
  const { ruangan, addRuangan, updateRuangan, deleteRuangan } = useRuangan();
  const { peminjaman, addPeminjaman, updateStatus } = usePeminjaman(user?.id, isAdmin);

  const [activeTab, setActiveTab] = useState('dashboard');

  // Show login if not authenticated
  if (!user) {
    return <LoginPage onLogin={signInWithGoogle} loading={authLoading} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAdmin={isAdmin} email={user.email} onLogout={signOut} />
      <WhatsAppButton />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="peminjaman" className="gap-2">
              <ClipboardList className="w-4 h-4" />
              {isAdmin ? 'Kelola Pengajuan' : 'Ajukan Peminjaman'}
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="aset" className="gap-2">
                <Settings className="w-4 h-4" />
                Kelola Aset
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard peminjaman={peminjaman} isAdmin={isAdmin} kendaraan={kendaraan} ruangan={ruangan} />
          </TabsContent>

          <TabsContent value="peminjaman">
            {isAdmin ? (
              <PeminjamanTable
                peminjaman={peminjaman}
                kendaraan={kendaraan}
                ruangan={ruangan}
                isAdmin={isAdmin}
                onStatusChange={updateStatus}
                title="Manajemen Pengajuan Peminjaman"
              />
            ) : (
              <div className="space-y-6">
                <PeminjamanForm
                  kendaraan={kendaraan}
                  ruangan={ruangan}
                  userId={user.id}
                  userEmail={user.email || ''}
                  onSubmit={addPeminjaman}
                />
                <PeminjamanTable
                  peminjaman={peminjaman}
                  kendaraan={kendaraan}
                  ruangan={ruangan}
                  isAdmin={false}
                  title="Riwayat Peminjaman Saya"
                />
              </div>
            )}
          </TabsContent>

          {isAdmin && (
            <TabsContent value="aset">
              <AssetManagement
                kendaraan={kendaraan}
                ruangan={ruangan}
                isAdmin={isAdmin}
                onAddKendaraan={addKendaraan}
                onUpdateKendaraan={updateKendaraan}
                onDeleteKendaraan={deleteKendaraan}
                onAddRuangan={addRuangan}
                onUpdateRuangan={updateRuangan}
                onDeleteRuangan={deleteRuangan}
              />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
