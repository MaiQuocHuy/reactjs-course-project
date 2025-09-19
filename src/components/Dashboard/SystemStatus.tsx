import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Activity } from 'lucide-react';

const SystemStatus = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          System Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-green-600 rounded-full mr-3"></div>
              <span className="font-medium">Database</span>
            </div>
            <Badge variant="default" className="bg-green-600">
              Operational
            </Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-green-600 rounded-full mr-3"></div>
              <span className="font-medium">API Services</span>
            </div>
            <Badge variant="default" className="bg-green-600">
              Operational
            </Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-200">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-yellow-600 rounded-full mr-3"></div>
              <span className="font-medium">Payment Gateway</span>
            </div>
            <Badge variant="secondary" className="bg-yellow-600 text-white">
              Maintenance
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatus;
