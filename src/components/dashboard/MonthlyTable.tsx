import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { MonthlyStats } from '@/types/siperkat';

interface MonthlyTableProps {
  data: MonthlyStats[];
  year: number;
  yearlyTotals: {
    kendaraan: number;
    ruangan: number;
    total: number;
  };
  isAdmin: boolean;
  onExport?: () => void;
}

export const MonthlyTable = ({ 
  data, 
  year, 
  yearlyTotals,
  isAdmin,
  onExport 
}: MonthlyTableProps) => {
  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-xl font-bold text-foreground">
          Rekap Bulanan Tahun {year}
        </CardTitle>
        {isAdmin && onExport && (
          <Button onClick={onExport} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Excel
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary hover:bg-primary">
                <TableHead className="text-primary-foreground font-bold">Bulan</TableHead>
                <TableHead className="text-primary-foreground font-bold text-center">Kendaraan</TableHead>
                <TableHead className="text-primary-foreground font-bold text-center">Ruang Rapat</TableHead>
                <TableHead className="text-primary-foreground font-bold text-center">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, idx) => (
                <TableRow 
                  key={row.month}
                  className={idx % 2 === 0 ? 'bg-muted/30' : 'bg-card'}
                >
                  <TableCell className="font-medium">{row.monthName}</TableCell>
                  <TableCell className="text-center">{row.kendaraan}</TableCell>
                  <TableCell className="text-center">{row.ruangan}</TableCell>
                  <TableCell className="text-center font-semibold">{row.total}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-primary/10 font-bold border-t-2 border-primary">
                <TableCell className="text-primary font-bold">TOTAL TAHUNAN</TableCell>
                <TableCell className="text-center text-primary font-bold">{yearlyTotals.kendaraan}</TableCell>
                <TableCell className="text-center text-primary font-bold">{yearlyTotals.ruangan}</TableCell>
                <TableCell className="text-center text-primary font-bold">{yearlyTotals.total}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
