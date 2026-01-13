import { Car, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LiveClock } from '@/components/common/LiveClock';

interface NavbarProps {
  isAdmin: boolean;
  email?: string;
  onLogout: () => void;
}

export const Navbar = ({ isAdmin, email, onLogout }: NavbarProps) => {
  return (
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
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{isAdmin ? 'Admin' : 'User'}</p>
                <p className="text-xs text-primary-foreground/70 truncate max-w-[150px]">{email}</p>
              </div>
              <Button
                onClick={onLogout}
                variant="secondary"
                size="sm"
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
