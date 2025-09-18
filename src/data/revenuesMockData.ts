// Mock data for revenue management analytics

export interface Course {
  id: string;
  title: string;
  category: string;
  instructorId: string;
  price: number;
  studentsEnrolled: number;
  rating: number;
  createdAt: string;
}

export interface Instructor {
  id: string;
  name: string;
  email: string;
  coursesCount: number;
  totalRevenue: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
  coursesEnrolled: number;
}

export interface RevenueData {
  date: string;
  totalRevenue: number;
  courseRevenue: number;
  subscriptionRevenue: number;
  transactions: number;
  category?: string;
  instructorId?: string;
}

export interface MonthlyRevenue {
  month: string;
  year: number;
  revenue: number;
  growth: number;
  transactions: number;
  categories: { [key: string]: number };
}

export interface DailyRevenue {
  date: string;
  revenue: number;
  transactions: number;
}

// Course categories
export const categories = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'DevOps',
  'UI/UX Design',
  'Digital Marketing',
  'Business',
  'Photography',
  'Music',
  'Cybersecurity',
  'Cloud Computing',
  'Blockchain',
  'Game Development',
  'Software Testing',
  'Database Administration',
  'Network Engineering',
  '3D Modeling',
  'Video Editing',
  'Graphic Design'
];

// Mock instructors
export const mockInstructors: Instructor[] = [
  { id: '1', name: 'John Smith', email: 'john@example.com', coursesCount: 12, totalRevenue: 85000 },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', coursesCount: 8, totalRevenue: 62000 },
  { id: '3', name: 'Mike Chen', email: 'mike@example.com', coursesCount: 15, totalRevenue: 98000 },
  { id: '4', name: 'Emily Davis', email: 'emily@example.com', coursesCount: 6, totalRevenue: 45000 },
  { id: '5', name: 'David Wilson', email: 'david@example.com', coursesCount: 10, totalRevenue: 72000 },
  { id: '6', name: 'Lisa Anderson', email: 'lisa@example.com', coursesCount: 9, totalRevenue: 68000 },
  { id: '7', name: 'James Brown', email: 'james@example.com', coursesCount: 7, totalRevenue: 53000 },
  { id: '8', name: 'Maria Garcia', email: 'maria@example.com', coursesCount: 11, totalRevenue: 78000 }
];

// Mock courses
export const mockCourses: Course[] = [
  { id: '1', title: 'React Fundamentals', category: 'Web Development', instructorId: '1', price: 199, studentsEnrolled: 1200, rating: 4.8, createdAt: '2024-01-15' },
  { id: '2', title: 'Node.js Backend Development', category: 'Web Development', instructorId: '1', price: 249, studentsEnrolled: 850, rating: 4.7, createdAt: '2024-02-20' },
  { id: '3', title: 'Python Data Science', category: 'Data Science', instructorId: '2', price: 299, studentsEnrolled: 950, rating: 4.9, createdAt: '2024-01-10' },
  { id: '4', title: 'Machine Learning Basics', category: 'Machine Learning', instructorId: '2', price: 349, studentsEnrolled: 720, rating: 4.6, createdAt: '2024-03-05' },
  { id: '5', title: 'iOS App Development', category: 'Mobile Development', instructorId: '3', price: 279, studentsEnrolled: 680, rating: 4.7, createdAt: '2024-01-25' },
  { id: '6', title: 'Android with Kotlin', category: 'Mobile Development', instructorId: '3', price: 259, studentsEnrolled: 890, rating: 4.8, createdAt: '2024-02-15' },
  { id: '7', title: 'UI/UX Design Masterclass', category: 'UI/UX Design', instructorId: '4', price: 199, studentsEnrolled: 1100, rating: 4.9, createdAt: '2024-01-30' },
  { id: '8', title: 'Docker & Kubernetes', category: 'DevOps', instructorId: '5', price: 329, studentsEnrolled: 540, rating: 4.7, createdAt: '2024-02-10' },
  { id: '9', title: 'AWS Cloud Practitioner', category: 'DevOps', instructorId: '5', price: 289, studentsEnrolled: 760, rating: 4.6, createdAt: '2024-03-01' },
  { id: '10', title: 'Digital Marketing Strategy', category: 'Digital Marketing', instructorId: '6', price: 179, studentsEnrolled: 920, rating: 4.5, createdAt: '2024-01-20' },
  { id: '11', title: 'Ethical Hacking Fundamentals', category: 'Cybersecurity', instructorId: '7', price: 399, studentsEnrolled: 650, rating: 4.8, createdAt: '2024-02-05' },
  { id: '12', title: 'Azure Cloud Architecture', category: 'Cloud Computing', instructorId: '8', price: 349, studentsEnrolled: 580, rating: 4.6, createdAt: '2024-01-18' },
  { id: '13', title: 'Bitcoin & Cryptocurrency', category: 'Blockchain', instructorId: '1', price: 299, studentsEnrolled: 420, rating: 4.7, createdAt: '2024-03-10' },
  { id: '14', title: 'Unity Game Development', category: 'Game Development', instructorId: '3', price: 279, studentsEnrolled: 480, rating: 4.5, createdAt: '2024-02-12' },
  { id: '15', title: 'Selenium Test Automation', category: 'Software Testing', instructorId: '2', price: 249, studentsEnrolled: 390, rating: 4.6, createdAt: '2024-01-28' },
  { id: '16', title: 'PostgreSQL Database Design', category: 'Database Administration', instructorId: '5', price: 229, studentsEnrolled: 350, rating: 4.7, createdAt: '2024-02-22' },
  { id: '17', title: 'Network Security Protocols', category: 'Network Engineering', instructorId: '7', price: 319, studentsEnrolled: 320, rating: 4.5, createdAt: '2024-03-08' },
  { id: '18', title: 'Blender 3D Modeling', category: '3D Modeling', instructorId: '4', price: 199, studentsEnrolled: 410, rating: 4.8, createdAt: '2024-01-12' },
  { id: '19', title: 'Adobe Premiere Pro', category: 'Video Editing', instructorId: '6', price: 189, studentsEnrolled: 380, rating: 4.6, createdAt: '2024-02-18' },
  { id: '20', title: 'Logo Design with Illustrator', category: 'Graphic Design', instructorId: '4', price: 159, studentsEnrolled: 340, rating: 4.4, createdAt: '2024-01-25' }
];

// Mock top spending students
export const mockTopStudents: Student[] = [
  { id: '1', name: 'Alex Thompson', email: 'alex@student.com', totalSpent: 2850, coursesEnrolled: 12 },
  { id: '2', name: 'Emma Rodriguez', email: 'emma@student.com', totalSpent: 2640, coursesEnrolled: 10 },
  { id: '3', name: 'Marcus Johnson', email: 'marcus@student.com', totalSpent: 2390, coursesEnrolled: 9 },
  { id: '4', name: 'Sophie Chen', email: 'sophie@student.com', totalSpent: 2180, coursesEnrolled: 8 },
  { id: '5', name: 'Ryan Mitchell', email: 'ryan@student.com', totalSpent: 1950, coursesEnrolled: 7 }
];

// Generate daily revenue data for the past year
export const generateDailyRevenueData = (): DailyRevenue[] => {
  const data: DailyRevenue[] = [];
  const today = new Date();
  
  for (let i = 365; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Simulate seasonal patterns and weekday effects
    const dayOfWeek = date.getDay();
    const month = date.getMonth();
    
    // Base revenue with seasonal variations
    let baseRevenue = 15000 + Math.sin((month / 12) * 2 * Math.PI) * 5000;
    
    // Weekend effect (lower on weekends)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      baseRevenue *= 0.7;
    }
    
    // Random variation
    const randomFactor = 0.8 + Math.random() * 0.4;
    const revenue = Math.round(baseRevenue * randomFactor);
    const transactions = Math.round(revenue / 180 + Math.random() * 20);
    
    data.push({
      date: date.toISOString().split('T')[0],
      revenue,
      transactions
    });
  }
  
  return data;
};

// Generate monthly revenue data
export const generateMonthlyRevenueData = (): MonthlyRevenue[] => {
  const data: MonthlyRevenue[] = [];
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  // 2023 data (full year)
  for (let i = 0; i < 12; i++) {
    const baseRevenue = 350000 + Math.sin((i / 12) * 2 * Math.PI) * 80000;
    const revenue = Math.round(baseRevenue * (0.85 + Math.random() * 0.25));
    
    data.push({
      month: months[i],
      year: 2023,
      revenue,
      growth: -8 + Math.random() * 18, // -8% to 10% growth (lower growth in 2023)
      transactions: Math.round(revenue / 185),
      categories: {
        'Web Development': Math.round(revenue * 0.25),
        'Data Science': Math.round(revenue * 0.15),
        'Mobile Development': Math.round(revenue * 0.12),
        'Machine Learning': Math.round(revenue * 0.11),
        'UI/UX Design': Math.round(revenue * 0.09),
        'DevOps': Math.round(revenue * 0.08),
        'Cybersecurity': Math.round(revenue * 0.07),
        'Cloud Computing': Math.round(revenue * 0.06),
        'Digital Marketing': Math.round(revenue * 0.04),
        'Business': Math.round(revenue * 0.03)
      }
    });
  }
  
  // 2024 data (full year)
  for (let i = 0; i < 12; i++) {
    const baseRevenue = 400000 + Math.sin((i / 12) * 2 * Math.PI) * 100000;
    const revenue = Math.round(baseRevenue * (0.9 + Math.random() * 0.2));
    const prevYearRevenue = data[i] && data[i].revenue ? data[i].revenue : 0; // 2023 data
    const growth = ((revenue - prevYearRevenue) / prevYearRevenue) * 100;
    
    data.push({
      month: months[i],
      year: 2024,
      revenue,
      growth: Math.round(growth * 100) / 100,
      transactions: Math.round(revenue / 180),
      categories: {
        'Web Development': Math.round(revenue * 0.23),
        'Data Science': Math.round(revenue * 0.16),
        'Mobile Development': Math.round(revenue * 0.13),
        'Machine Learning': Math.round(revenue * 0.12),
        'UI/UX Design': Math.round(revenue * 0.10),
        'DevOps': Math.round(revenue * 0.08),
        'Cybersecurity': Math.round(revenue * 0.07),
        'Cloud Computing': Math.round(revenue * 0.06),
        'Digital Marketing': Math.round(revenue * 0.03),
        'Business': Math.round(revenue * 0.02)
      }
    });
  }
  
  // Current year data (2025, up to September)
  for (let i = 0; i < 9; i++) {
    const baseRevenue = 420000 + Math.sin((i / 12) * 2 * Math.PI) * 110000;
    const revenue = Math.round(baseRevenue * (0.95 + Math.random() * 0.2));
    const prevYearRevenue = data[i + 12] && data[i + 12].revenue ? data[i + 12].revenue : 0; // 2024 data (12 months ahead in array)
    const growth = ((revenue - prevYearRevenue) / prevYearRevenue) * 100;
    
    data.push({
      month: months[i],
      year: 2025,
      revenue,
      growth: Math.round(growth * 100) / 100,
      transactions: Math.round(revenue / 175),
      categories: {
        'Web Development': Math.round(revenue * 0.21),
        'Data Science': Math.round(revenue * 0.17),
        'Mobile Development': Math.round(revenue * 0.14),
        'Machine Learning': Math.round(revenue * 0.13),
        'UI/UX Design': Math.round(revenue * 0.09),
        'DevOps': Math.round(revenue * 0.08),
        'Cybersecurity': Math.round(revenue * 0.07),
        'Cloud Computing': Math.round(revenue * 0.06),
        'Digital Marketing': Math.round(revenue * 0.03),
        'Business': Math.round(revenue * 0.02)
      }
    });
  }
  
  return data;
};

// Revenue by category
export const revenueByCategory = {
  'Web Development': 1200000,
  'Data Science': 850000,
  'Mobile Development': 720000,
  'Machine Learning': 690000,
  'UI/UX Design': 520000,
  'DevOps': 480000,
  'Cybersecurity': 420000,
  'Cloud Computing': 380000,
  'Digital Marketing': 320000,
  'Business': 280000,
  'Blockchain': 250000,
  'Game Development': 230000,
  'Software Testing': 210000,
  'Database Administration': 190000,
  'Photography': 180000,
  'Network Engineering': 165000,
  '3D Modeling': 155000,
  'Music': 150000,
  'Video Editing': 145000,
  'Graphic Design': 135000
};

// Revenue forecasting data
export const revenueForecastData = [
  { month: 'Oct 2025', actual: null, forecast: 485000, confidence: { lower: 460000, upper: 510000 } },
  { month: 'Nov 2025', actual: null, forecast: 520000, confidence: { lower: 485000, upper: 555000 } },
  { month: 'Dec 2025', actual: null, forecast: 580000, confidence: { lower: 535000, upper: 625000 } },
  { month: 'Jan 2026', actual: null, forecast: 450000, confidence: { lower: 400000, upper: 500000 } },
  { month: 'Feb 2026', actual: null, forecast: 470000, confidence: { lower: 420000, upper: 520000 } },
  { month: 'Mar 2026', actual: null, forecast: 510000, confidence: { lower: 460000, upper: 560000 } }
];

// Performance metrics
export const performanceMetrics = {
  totalRevenue: 7570000, // Updated total with new categories
  averageRevenuePerUser: 285.50,
  totalActiveUsers: 18500,
  monthlyGrowthRate: 12.5,
  quarterlyGrowthRate: 8.3,
  yearlyGrowthRate: 24.7,
  topPerformingCategory: 'Web Development',
  worstPerformingCategory: 'Graphic Design',
  bestMonth: 'December 2024',
  worstMonth: 'February 2024'
};

// Seasonal pattern data for heatmap
export interface SeasonalData {
  month: string;
  day: number;
  revenue: number;
  date: string;
}

export const generateSeasonalHeatmapData = (): SeasonalData[] => {
  const data: SeasonalData[] = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  months.forEach((month, monthIndex) => {
    for (let day = 1; day <= daysInMonth[monthIndex]; day++) {
      // Simulate revenue patterns
      const baseRevenue = 15000;
      const seasonalFactor = 1 + 0.3 * Math.sin((monthIndex / 12) * 2 * Math.PI);
      const dailyFactor = 1 + 0.2 * Math.sin((day / 30) * 2 * Math.PI);
      const revenue = Math.round(baseRevenue * seasonalFactor * dailyFactor * (0.8 + Math.random() * 0.4));
      
      data.push({
        month,
        day,
        revenue,
        date: `2025-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      });
    }
  });
  
  return data;
};

export const dailyRevenueData = generateDailyRevenueData();
export const monthlyRevenueData = generateMonthlyRevenueData();
export const seasonalHeatmapData = generateSeasonalHeatmapData();