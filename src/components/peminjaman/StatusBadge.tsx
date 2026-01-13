import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

type Status = 'Pending' | 'Disetujui' | 'Ditolak' | 'Konflik';

interface StatusBadgeProps {
  status: Status;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusConfig = (status: Status) => {
    switch (status) {
      case 'Disetujui':
        return {
          className: 'bg-success text-success-foreground hover:bg-success/90',
          icon: CheckCircle,
        };
      case 'Pending':
        return {
          className: 'bg-warning text-warning-foreground hover:bg-warning/90',
          icon: Clock,
        };
      case 'Ditolak':
        return {
          className: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
          icon: XCircle,
        };
      case 'Konflik':
        return {
          className: 'bg-orange-500 text-white hover:bg-orange-600',
          icon: AlertTriangle,
        };
      default:
        return {
          className: 'bg-muted text-muted-foreground',
          icon: Clock,
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge className={`${config.className} gap-1`}>
      <Icon className="w-3 h-3" />
      {status}
    </Badge>
  );
};
