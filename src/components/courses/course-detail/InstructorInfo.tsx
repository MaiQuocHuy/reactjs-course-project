import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ExtendedInstructor } from '@/types/courses-review';
import { Linkedin, Globe } from 'lucide-react';

type Props = {
  instructor: ExtendedInstructor;
};

const InstructorInfo = ({ instructor }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Instructor Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-6 col-span-2">
              {/* Instructor Avatar (original image tag retained) */}
              <img
                src={instructor.avatar}
                alt={instructor.name}
                className="w-36 h-36 rounded-lg object-cover"
              />

              {/* Instructor Details */}
              <div className="space-y-2">
                <h4 className="font-semibold text-2xl text-gradient bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-orange-400">
                  {instructor.name}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {instructor.email}
                </p>
                <p className="text-sm text-foreground max-h-20 line-clamp-3">
                  {instructor.bio}
                </p>

                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="default">
                    Published Courses: {instructor.publishedCourses}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Instructor Social Links */}
            {instructor.socialLinks && (
              <div className="cols-span-1 bg-gradient-to-tr from-sky-50 to-white/30 rounded-lg p-4 border">
                <h5 className="font-semibold text-lg mb-2">Social Links</h5>
                <ul className="flex flex-col gap-2">
                  {instructor.socialLinks?.linkedin && (
                    <li>
                      <a
                        className="text-blue-700 hover:underline flex items-center gap-2"
                        href={instructor.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="size-4 text-blue-600" />
                        <span>{instructor.socialLinks.linkedin}</span>
                      </a>
                    </li>
                  )}
                  {instructor.socialLinks?.website && (
                    <li>
                      <a
                        className="text-rose-600 hover:underline flex items-center gap-2"
                        href={instructor.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe className="size-4 text-rose-500" />
                        <span>{instructor.socialLinks.website}</span>
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          <div className="px-6">
            <div className="flex justify-end">
              <Button variant="default" size="sm">
                View Detail
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructorInfo;
