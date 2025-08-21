import { useState } from 'react';
import { BookOpen, Brain, ChevronRight, Video } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Lesson, Section } from '@/types/courses';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../Collapsible';
import { Badge } from '@/components/ui/badge';
import VideoContent from './VideoContent';
import { Quiz } from './Quiz';

type Props = {
  sections: Section[];
};

const CourseContent = ({ sections }: Props) => {  
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(
    new Set()
  );

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const toggleLesson = (lessonId: string) => {
    const newExpanded = new Set(expandedLessons);
    if (newExpanded.has(lessonId)) {
      newExpanded.delete(lessonId);
    } else {
      newExpanded.add(lessonId);
    }
    setExpandedLessons(newExpanded);
  };

  if (!sections || sections.length === 0)
    return <div>No content available</div>;

  const renderLesson = (lesson: Lesson, lessonIndex: number) => {
    const isExpanded = expandedLessons.has(lesson.id);

    return (
      <Collapsible key={lesson.id} defaultOpen={lessonIndex === 0}>
        <Card key={lesson.id} className="ml-4 gap-2">
          <CollapsibleTrigger asChild>
            <CardHeader
              className="pb-3 cursor-pointer hover:bg-muted/50"
              onClick={() => toggleLesson(lesson.id)}
            >
              <CardTitle className="text-base flex items-center justify-between">
                {/* Lesson title */}
                <div className="flex items-center gap-2">
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 transition-transform',
                      isExpanded && 'rotate-90'
                    )}
                  />
                  {lesson.type === 'VIDEO' ? (
                    <Video className="h-4 w-4" />
                  ) : (
                    <Brain className="h-4 w-4" />
                  )}
                  <span>Lesson {lessonIndex + 1}</span>
                  {lesson.title && (
                    <span className="text-sm font-normal text-muted-foreground">
                      - {lesson.title}
                    </span>
                  )}
                  <Badge
                    variant={lesson.type === 'VIDEO' ? 'default' : 'secondary'}
                    className="ml-2"
                  >
                    {lesson.type === 'VIDEO' ? 'Video' : 'Quiz'}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="space-y-4">
              <>
                {/* Lesson video */}
                {lesson.video && <VideoContent videoUrl={lesson.video.url} />}

                {/* Quiz questions preview in view mode */}
                {lesson.quiz &&
                  lesson.quiz.questions &&
                  lesson.quiz.questions.length > 0 && (
                    <Quiz questions={lesson.quiz.questions} />
                  )}
              </>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    );
  };

  const renderSection = (section: Section, sectionIndex: number) => {
    const isExpanded = expandedSections.has(section.id);
    return (
      <Collapsible key={section.id} defaultOpen={sectionIndex === 0}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => toggleSection(section.id)}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ChevronRight
                    className={cn(
                      'h-5 w-5 transition-transform',
                      isExpanded && 'rotate-90'
                    )}
                  />
                  <BookOpen className="h-5 w-5" />
                  <span>Section {sectionIndex + 1}</span>
                  {section.title && (
                    <span className="text-base font-normal text-muted-foreground">
                      - {section.title}
                    </span>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="space-y-6">
              {section.description && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </div>
              )}

              {/* Lessons */}
              <div className="space-y-4">
                <h4 className="font-medium">
                  Lessons ({section.lessons.length})
                </h4>

                {/* Render lessons in edit mode */}
                <div className="space-y-4">
                  {section.lessons.map((lesson, lessonIndex) =>
                    renderLesson(lesson, lessonIndex)
                  )}
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    );
  };

  return (
    <div className='space-y-6'>
      {sections.map((section, sectionIndex) =>
        renderSection(section, sectionIndex)
      )}
    </div>
  );
};

export default CourseContent;
