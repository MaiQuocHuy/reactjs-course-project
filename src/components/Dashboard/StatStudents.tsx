import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../ui/avatar';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  isActive: boolean;
}

interface UsersData {
  data: {
    users: User[];
  };
}

interface StatStudentsProps {
  users?: UsersData;
}

const StatStudents: React.FC<StatStudentsProps> = ({ users }) => {
  const navigate = useNavigate();

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'destructive'; // Red color for admin (signifies special access)
      case 'INSTRUCTOR':
        return 'refunded'; // Blue color for instructors (professional)
      case 'STUDENT':
        return 'secondary'; // Purple/gray color for students (differentiates from other statuses)
      default:
        return 'outline'; // Default fallback
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'completed'; // Green color for active status
      case 'INACTIVE':
        return 'pending'; // Yellow color for inactive status
      case 'BANNED':
        return 'destructive'; // Red color for banned status
      default:
        return 'outline'; // Default fallback
    }
  };

  const hasUsers = users && users.data?.users?.length > 0;
  const usersToShow = hasUsers 
    ? users.data.users.slice(0, users.data.users.length > 3 ? 3 : users.data.users.length)
    : [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>
              Latest user registrations on your platform
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={() => navigate('/admin/users')}
          >
            <Eye className="h-4 w-4 mr-2" />
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!hasUsers ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <p className="text-muted-foreground text-sm">
                  No registered users yet
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Users will appear here once they register on your platform
                </p>
              </div>
            </div>
          ) : (
            usersToShow.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={getRoleBadgeVariant(user.role)}
                    className="text-xs"
                  >
                    {user.role}
                  </Badge>
                  <Badge
                    variant={getStatusBadgeVariant(
                      user.isActive ? 'ACTIVE' : 'INACTIVE'
                    )}
                    className="text-xs"
                  >
                    {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatStudents;