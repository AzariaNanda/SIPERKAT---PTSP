import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

type Status = 'Pending' | 'Disetujui' | 'Ditolak' | 'Konflik';

interface StatusButtonsProps {
  currentStatus: Status;
  onStatusChange: (status: Status) => void;
  loading?: boolean;
}

export const StatusButtons = ({ currentStatus, onStatusChange, loading }: StatusButtonsProps) => {
  return (
    <div className="flex gap-1 flex-wrap">
      <Button
        size="sm"
        variant={currentStatus === 'Disetujui' ? 'default' : 'outline'}
        className={`h-7 px-2 text-xs gap-1 ${
          currentStatus === 'Disetujui' 
            ? 'bg-success hover:bg-success/90 text-success-foreground' 
            : 'border-success text-success hover:bg-success hover:text-success-foreground'
        }`}
        onClick={() => onStatusChange('Disetujui')}
        disabled={loading || currentStatus === 'Disetujui'}
      >
        <CheckCircle className="w-3 h-3" />
        Setujui
      </Button>
      
      <Button
        size="sm"
        variant={currentStatus === 'Pending' ? 'default' : 'outline'}
        className={`h-7 px-2 text-xs gap-1 ${
          currentStatus === 'Pending' 
            ? 'bg-warning hover:bg-warning/90 text-warning-foreground' 
            : 'border-warning text-warning hover:bg-warning hover:text-warning-foreground'
        }`}
        onClick={() => onStatusChange('Pending')}
        disabled={loading || currentStatus === 'Pending'}
      >
        <Clock className="w-3 h-3" />
        Pending
      </Button>
      
      <Button
        size="sm"
        variant={currentStatus === 'Ditolak' ? 'default' : 'outline'}
        className={`h-7 px-2 text-xs gap-1 ${
          currentStatus === 'Ditolak' 
            ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' 
            : 'border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground'
        }`}
        onClick={() => onStatusChange('Ditolak')}
        disabled={loading || currentStatus === 'Ditolak'}
      >
        <XCircle className="w-3 h-3" />
        Tolak
      </Button>
    </div>
  );
};
