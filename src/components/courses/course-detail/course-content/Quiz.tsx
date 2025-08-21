'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../Collapsible';
import { ChevronRight } from 'lucide-react';
import type { Question } from '@/types/courses';

type Props = {
  questions: Question[];
};

export function Quiz({ questions }: Props) {
  const renderQuestion = (question: Question, index: number) => (
    <Collapsible key={question.id} defaultOpen={index === 0}>
      <Card className="gap-3">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 ">
            <CardTitle className="text-base flex items-center justify-between ">
              <div className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 transition-transform data-[state=open]:rotate-90 shrink-0" />
                <span className="whitespace-nowrap">Question {index + 1}</span>
                {question.questionText && (
                  <span className="line-clamp-1 text-sm font-normal text-muted-foreground ">
                    - {question.questionText}
                  </span>
                )}
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="font-medium">{question.questionText}</p>
              <div className="space-y-1">
                {Object.values(question.options).map(
                  (optionText: string, optionIndex: number) => {
                    const optionLetter = String.fromCharCode(65 + optionIndex);
                    return (
                      <div
                        key={optionIndex}
                        className={`p-2 rounded text-sm ${
                          question.correctAnswer === optionLetter
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-muted'
                        }`}
                      >
                        {question.correctAnswer === optionLetter && '✓ '}
                        {optionLetter}: {optionText}
                      </div>
                    );
                  }
                )}
              </div>
              {question.explanation && (
                <p className="text-sm text-muted-foreground">
                  <strong>Explanation:</strong> {question.explanation}
                </p>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );

  return (
    <>
      {questions.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              Quiz Questions ({questions.length})
            </h3>
          </div>

          {questions.map(renderQuestion)}
        </div>
      ) : (
        <Card className="p-8 text-center text-muted-foreground">
          <p>No questions yet. Click "Add Question" to get started.</p>
        </Card>
      )}
    </>
  );
}
