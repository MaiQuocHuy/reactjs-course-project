import { useState } from 'react';
import ActiveCourses from '../../components/courses/ActiveCourses';
import PendingCourses from '@/components/courses/PendingCourses';

type CourseTab = 'published' | 'pending';

export default function CoursesPage() {
  // Local UI state
  const [activeTab, setActiveTab] = useState<CourseTab>('published');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main */}
          <main className="flex-1 min-w-0" role="main">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">
                {activeTab === 'published' ? 'Active' : 'Pending & Resubmit'}{' '}
                Courses
              </h1>
            </div>

            {/* Course Type Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('published')}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === 'published'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Published & Approved Courses
                  </button>
                  <button
                    onClick={() => setActiveTab('pending')}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === 'pending'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Pending & Resubmit Courses
                  </button>
                </nav>
              </div>
            </div>

            {activeTab === 'published' ? <ActiveCourses /> : <PendingCourses />}
          </main>
        </div>
      </div>
    </div>
  );
}
