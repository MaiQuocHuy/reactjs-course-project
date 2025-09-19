import React, { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { BarChart3, Filter, Calendar, Thermometer } from 'lucide-react';

// Revenue Components
import { RevenueProvider } from '@/components/revenues/RevenueContext';
import MonthlyRevenue from '@/components/revenues/MonthlyRevenue/MonthlyRevenue';
import PerformanceMetrics from '@/components/revenues/PerformanceMetrics/PerformanceMetrics';
import ComparativeAnalysis from '@/components/revenues/ComparativeAnalysis';
import SeasonalHeatmap from '@/components/revenues/SeasonalHeatmap';
import Statistics from '@/components/revenues/Statistics';
import { TopSpendersCard } from '@/components/revenues/TopSpendersCard';

const RevenuesPage2: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <RevenueProvider>
      <div className="container mx-auto p-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              Revenue Management
            </h1>
            <Badge variant="outline" className="text-sm">
              Advanced Analytics
            </Badge>
          </div>
          <p className="text-gray-600">
            Comprehensive revenue analytics with trends, forecasting,
            performance metrics, and comparative analysis
          </p>
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Monthly Revenue
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Comparison
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="seasonal" className="flex items-center gap-2">
              <Thermometer className="h-4 w-4" />
              Seasonal
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab - Dashboard Summary */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Statistics */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Revenue Dashboard Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <Statistics />
                </CardContent>
              </Card>
            </div>

            {/* Top Spenders */}
            <TopSpendersCard />
          </TabsContent>

          {/* Revenue Trends & Forecasting */}
          <TabsContent value="trends" className="space-y-6">
            <MonthlyRevenue />
          </TabsContent>

          {/* Comparative Analysis */}
          <TabsContent value="comparison" className="space-y-6">
            <ComparativeAnalysis />
          </TabsContent>

          {/* Performance Metrics */}
          <TabsContent value="performance" className="space-y-6">
            <PerformanceMetrics />
          </TabsContent>

          {/* Seasonal Patterns */}
          <TabsContent value="seasonal" className="space-y-6">
            <SeasonalHeatmap />
          </TabsContent>
        </Tabs>
      </div>
    </RevenueProvider>
  );
};

export default RevenuesPage2;
