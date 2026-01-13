import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Car, Home } from 'lucide-react';
import { AssetCard } from './AssetCard';
import { AssetFormModal } from './AssetFormModal';
import { toast } from 'sonner';
import type { Kendaraan, Ruangan } from '@/types/siperkat';

interface AssetManagementProps {
  kendaraan: Kendaraan[];
  ruangan: Ruangan[];
  isAdmin: boolean;
  onAddKendaraan: (data: any) => Promise<boolean>;
  onUpdateKendaraan: (id: string, data: any) => Promise<boolean>;
  onDeleteKendaraan: (id: string) => Promise<boolean>;
  onAddRuangan: (data: any) => Promise<boolean>;
  onUpdateRuangan: (id: string, data: any) => Promise<boolean>;
  onDeleteRuangan: (id: string) => Promise<boolean>;
}

export const AssetManagement = ({
  kendaraan,
  ruangan,
  isAdmin,
  onAddKendaraan,
  onUpdateKendaraan,
  onDeleteKendaraan,
  onAddRuangan,
  onUpdateRuangan,
  onDeleteRuangan,
}: AssetManagementProps) => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'kendaraan' | 'ruangan'>('kendaraan');
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedAsset, setSelectedAsset] = useState<Kendaraan | Ruangan | null>(null);

  const openAddModal = (type: 'kendaraan' | 'ruangan') => {
    setModalType(type);
    setModalMode('add');
    setSelectedAsset(null);
    setShowModal(true);
  };

  const openEditModal = (asset: Kendaraan | Ruangan, type: 'kendaraan' | 'ruangan') => {
    setModalType(type);
    setModalMode('edit');
    setSelectedAsset(asset);
    setShowModal(true);
  };

  const handleDelete = async (id: string, type: 'kendaraan' | 'ruangan') => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    
    if (type === 'kendaraan') {
      await onDeleteKendaraan(id);
    } else {
      await onDeleteRuangan(id);
    }
  };

  const handleSave = async (data: any) => {
    if (modalMode === 'add') {
      if (modalType === 'kendaraan') {
        return await onAddKendaraan(data);
      } else {
        return await onAddRuangan(data);
      }
    } else if (selectedAsset) {
      if (modalType === 'kendaraan') {
        return await onUpdateKendaraan(selectedAsset.id, data);
      } else {
        return await onUpdateRuangan(selectedAsset.id, data);
      }
    }
    return false;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="kendaraan">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="kendaraan" className="gap-2">
              <Car className="w-4 h-4" />
              Kendaraan ({kendaraan.length})
            </TabsTrigger>
            <TabsTrigger value="ruangan" className="gap-2">
              <Home className="w-4 h-4" />
              Ruangan ({ruangan.length})
            </TabsTrigger>
          </TabsList>
          
          {isAdmin && (
            <div className="flex gap-2">
              <Button onClick={() => openAddModal('kendaraan')} size="sm" className="gap-1">
                <Plus className="w-4 h-4" />
                Tambah Kendaraan
              </Button>
              <Button onClick={() => openAddModal('ruangan')} size="sm" variant="outline" className="gap-1">
                <Plus className="w-4 h-4" />
                Tambah Ruangan
              </Button>
            </div>
          )}
        </div>

        <TabsContent value="kendaraan">
          {kendaraan.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Belum ada data kendaraan</p>
                {isAdmin && (
                  <Button onClick={() => openAddModal('kendaraan')} className="mt-4">
                    Tambah Kendaraan Pertama
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {kendaraan.map((k) => (
                <AssetCard
                  key={k.id}
                  asset={k}
                  type="kendaraan"
                  isAdmin={isAdmin}
                  onEdit={() => openEditModal(k, 'kendaraan')}
                  onDelete={() => handleDelete(k.id, 'kendaraan')}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="ruangan">
          {ruangan.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Home className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Belum ada data ruangan</p>
                {isAdmin && (
                  <Button onClick={() => openAddModal('ruangan')} className="mt-4">
                    Tambah Ruangan Pertama
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {ruangan.map((r) => (
                <AssetCard
                  key={r.id}
                  asset={r}
                  type="ruangan"
                  isAdmin={isAdmin}
                  onEdit={() => openEditModal(r, 'ruangan')}
                  onDelete={() => handleDelete(r.id, 'ruangan')}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AssetFormModal
        open={showModal}
        onOpenChange={setShowModal}
        type={modalType}
        mode={modalMode}
        asset={selectedAsset}
        onSave={handleSave}
      />
    </div>
  );
};
