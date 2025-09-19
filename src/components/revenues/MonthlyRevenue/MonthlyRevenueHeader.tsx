import React from 'react';
import { CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Activity, Calendar } from 'lucide-react';

interface MonthlyRevenueHeaderProps {
  selectedYear: number;
  selectedPeriod: string;
  availableYears: number[];
  onYearChange: (year: string) => void;
}

const MonthlyRevenueHeader: React.FC<MonthlyRevenueHeaderProps> = ({
  selectedYear,
  selectedPeriod,
  availableYears,
  onYearChange,
}) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Monthly Revenue
          </CardTitle>
          <Badge variant="outline">Click months to see daily data</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <Select
            value={selectedYear.toString()}
            onValueChange={onYearChange}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {selectedPeriod && (
        <p className="text-sm text-gray-600">
          Selected Period: {selectedPeriod}
        </p>
      )}
    </CardHeader>
  );
};

export default MonthlyRevenueHeader;