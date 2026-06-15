export interface Lesson {
  id: string;
  title: string;
  content: string;
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
  };
}

export interface Course {
  id: string;
  title: string;
  category: 'Engineering' | 'Design' | 'Product' | 'Artificial Intelligence' | 'Marketing';
  description: string;
  duration: string;
  skillsGranted: string[];
  enrolled: boolean;
  completed: boolean;
  progress: number; // percentage completed
  lessons: Lesson[];
  currentLessonIndex?: number;
  requestedByRecruiter?: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  skills: string[];
  link?: string;
  github?: string;
}

export interface Candidate {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  email: string;
  completedCourseIds: string[];
  skills: string[]; // Dynamically aggregated from completed courses
  skillLevels?: Record<string, 'Beginner' | 'Intermediate' | 'Pro'>;
  targetJobId?: string;
  followedJobIds?: string[];
  projects: Project[];
  status: 'Active' | 'Interviewing' | 'Open for Offers';
  isCurrentUser?: boolean;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  description: string;
  skillsNeeded: string[];
  salary: string;
  type: 'Full-time' | 'Contract' | 'Part-time' | 'Remote';
  location: string;
  datePosted: string;
  applicantsCount: number;
}

export interface CourseRequest {
  id: string;
  title: string;
  description: string;
  notes: string;
  skillsWanted: string[];
  recruiterName: string;
  company: string;
  status: 'Pending' | 'Approved';
  dateRequested: string;
}
