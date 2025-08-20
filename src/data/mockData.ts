import type { User, Course, Payment, ActivityLog } from '../types/users';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://i.pravatar.cc/150?u=john',
    role: 'STUDENT',
    status: 'ACTIVE',
    isActive: true,
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-08-10T14:22:00Z',
    lastLoginAt: '2024-08-15T09:15:00Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: 'https://i.pravatar.cc/150?u=jane',
    role: 'INSTRUCTOR',
    status: 'ACTIVE',
    isActive: true,
    createdAt: '2024-02-20T10:45:00Z',
    updatedAt: '2024-08-12T11:30:00Z',
    lastLoginAt: '2024-08-16T16:45:00Z'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    avatar: 'https://i.pravatar.cc/150?u=mike',
    role: 'STUDENT',
    status: 'BANNED',
    isActive: false,
    createdAt: '2024-03-10T12:00:00Z',
    updatedAt: '2024-07-25T09:00:00Z',
    lastLoginAt: '2024-07-20T14:30:00Z'
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    role: 'ADMIN',
    status: 'ACTIVE',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-08-16T18:00:00Z',
    lastLoginAt: '2024-08-17T08:00:00Z'
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.brown@example.com',
    role: 'STUDENT',
    status: 'INACTIVE',
    isActive: false,
    createdAt: '2024-05-15T14:30:00Z',
    updatedAt: '2024-06-01T10:00:00Z'
  }
];

export const mockCourses: Record<string, Course[]> = {
  '1': [
    {
      id: 'course-1',
      title: 'React Fundamentals',
      thumbnail: 'https://picsum.photos/200/120?random=1',
      price: 99.99,
      enrolledAt: '2024-06-01T10:00:00Z',
      progress: 75,
      status: 'ENROLLED'
    },
    {
      id: 'course-2',
      title: 'Advanced JavaScript',
      thumbnail: 'https://picsum.photos/200/120?random=2',
      price: 149.99,
      enrolledAt: '2024-07-15T14:30:00Z',
      progress: 100,
      status: 'COMPLETED'
    }
  ],
  '3': [
    {
      id: 'course-3',
      title: 'Python for Beginners',
      thumbnail: 'https://picsum.photos/200/120?random=3',
      price: 79.99,
      enrolledAt: '2024-05-20T09:15:00Z',
      progress: 30,
      status: 'DROPPED'
    }
  ]
};

export const mockPayments: Record<string, Payment[]> = {
  '1': [
    {
      id: 'pay-1',
      courseId: 'course-1',
      courseTitle: 'React Fundamentals',
      amount: 99.99,
      currency: 'USD',
      status: 'COMPLETED',
      paymentMethod: 'Credit Card',
      transactionId: 'txn_1234567890',
      createdAt: '2024-06-01T10:00:00Z'
    },
    {
      id: 'pay-2',
      courseId: 'course-2',
      courseTitle: 'Advanced JavaScript',
      amount: 149.99,
      currency: 'USD',
      status: 'COMPLETED',
      paymentMethod: 'PayPal',
      transactionId: 'txn_0987654321',
      createdAt: '2024-07-15T14:30:00Z'
    }
  ],
  '3': [
    {
      id: 'pay-3',
      courseId: 'course-3',
      courseTitle: 'Python for Beginners',
      amount: 79.99,
      currency: 'USD',
      status: 'REFUNDED',
      paymentMethod: 'Credit Card',
      transactionId: 'txn_1122334455',
      createdAt: '2024-05-20T09:15:00Z'
    }
  ]
};

export const mockActivityLogs: Record<string, ActivityLog[]> = {
  '1': [
    {
      id: 'log-1',
      action: 'LOGIN',
      description: 'User logged in successfully',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      createdAt: '2024-08-17T08:00:00Z'
    },
    {
      id: 'log-2',
      action: 'COURSE_ENROLL',
      description: 'Enrolled in React Fundamentals',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      createdAt: '2024-06-01T10:00:00Z'
    }
  ],
  '2': [
    {
      id: 'log-3',
      action: 'COURSE_CREATE',
      description: 'Created new course: Advanced JavaScript',
      ipAddress: '10.0.0.50',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      createdAt: '2024-07-01T09:30:00Z'
    }
  ],
  '3': [
    {
      id: 'log-4',
      action: 'ACCOUNT_BANNED',
      description: 'Account was banned for policy violation',
      ipAddress: '172.16.0.25',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      createdAt: '2024-07-25T09:00:00Z'
    }
  ]
};
