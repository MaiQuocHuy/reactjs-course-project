import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Crown } from 'lucide-react';
import { useGetTopSpendersQuery } from '@/services/revenuesApi';

export const TopSpendersCard: React.FC = () => {
  const {
    data: topSpenders,
    isLoading,
    isError,
  } = useGetTopSpendersQuery({ limit: 5 });
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !topSpenders) {
    return <div>Error loading top spenders.</div>;
  }

  const handleStudentClick = (studentId: string) => {
    const newWindow = window.open(
      `/admin/users/${studentId}`,
      '_blank',
      'noopener,noreferrer'
    );
    if (newWindow) newWindow.opener = null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          {`Top ${topSpenders.limit} Students Who Spend the Most`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topSpenders.topStudents.map((student, index) => (
            <div
              key={student.id}
              className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border cursor-pointer hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 transition-colors"
              onClick={() => handleStudentClick(student.id)}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      index === 0
                        ? 'default'
                        : index === 1
                        ? 'secondary'
                        : 'outline'
                    }
                    className="w-8 h-8 rounded-full p-0 flex items-center justify-center"
                  >
                    {index === 0 ? <Crown className="h-4 w-4" /> : index + 1}
                  </Badge>
                  <Avatar>
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                      {student.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    ${student.totalSpent.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {student.coursesEnrolled} courses
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
