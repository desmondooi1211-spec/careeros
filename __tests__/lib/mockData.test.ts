import { describe, it, expect } from 'vitest';
import {
  INITIAL_COURSES,
  INITIAL_CANDIDATES,
  INITIAL_JOBS,
  INITIAL_REQUESTS,
} from '@/lib/mockData';

describe('Mock Data Integrity', () => {
  describe('INITIAL_COURSES', () => {
    it('should contain at least 5 courses', () => {
      expect(INITIAL_COURSES.length).toBeGreaterThanOrEqual(5);
    });

    it('should have unique IDs for every course', () => {
      const ids = INITIAL_COURSES.map((c) => c.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('every course should have a valid category', () => {
      const validCategories = [
        'Engineering',
        'Design',
        'Product',
        'Artificial Intelligence',
        'Marketing',
      ];
      for (const course of INITIAL_COURSES) {
        expect(validCategories).toContain(course.category);
      }
    });

    it('every course should have at least one lesson', () => {
      for (const course of INITIAL_COURSES) {
        expect(course.lessons.length).toBeGreaterThanOrEqual(1);
      }
    });

    it('every course should grant at least one skill', () => {
      for (const course of INITIAL_COURSES) {
        expect(course.skillsGranted.length).toBeGreaterThanOrEqual(1);
      }
    });

    it('every course should start unenrolled and uncompleted', () => {
      for (const course of INITIAL_COURSES) {
        expect(course.enrolled).toBe(false);
        expect(course.completed).toBe(false);
        expect(course.progress).toBe(0);
      }
    });

    it('every lesson with a quiz should have exactly 4 options and a valid correctAnswer index', () => {
      for (const course of INITIAL_COURSES) {
        for (const lesson of course.lessons) {
          if (lesson.quiz) {
            expect(lesson.quiz.options).toHaveLength(4);
            expect(lesson.quiz.correctAnswer).toBeGreaterThanOrEqual(0);
            expect(lesson.quiz.correctAnswer).toBeLessThan(4);
          }
        }
      }
    });
  });

  describe('INITIAL_CANDIDATES', () => {
    it('should contain at least 4 candidates', () => {
      expect(INITIAL_CANDIDATES.length).toBeGreaterThanOrEqual(4);
    });

    it('should have unique IDs for every candidate', () => {
      const ids = INITIAL_CANDIDATES.map((c) => c.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('should have exactly one current user (isCurrentUser)', () => {
      const currentUsers = INITIAL_CANDIDATES.filter((c) => c.isCurrentUser);
      expect(currentUsers).toHaveLength(1);
    });

    it('every candidate should have a valid status', () => {
      const validStatuses = ['Active', 'Interviewing', 'Open for Offers'];
      for (const cand of INITIAL_CANDIDATES) {
        expect(validStatuses).toContain(cand.status);
      }
    });

    it('current user should start with no completed courses', () => {
      const currentUser = INITIAL_CANDIDATES.find((c) => c.isCurrentUser);
      expect(currentUser).toBeDefined();
      expect(currentUser!.completedCourseIds).toHaveLength(0);
      expect(currentUser!.skills).toHaveLength(10);
    });

    it('non-current candidates with completedCourseIds should have matching skills', () => {
      const candidatesWithCourses = INITIAL_CANDIDATES.filter(
        (c) => !c.isCurrentUser && c.completedCourseIds.length > 0
      );
      for (const cand of candidatesWithCourses) {
        expect(cand.skills.length).toBeGreaterThan(0);
      }
    });
  });

  describe('INITIAL_JOBS', () => {
    it('should contain at least 4 jobs', () => {
      expect(INITIAL_JOBS.length).toBeGreaterThanOrEqual(4);
    });

    it('should have unique IDs for every job', () => {
      const ids = INITIAL_JOBS.map((j) => j.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('every job should have non-empty skillsNeeded', () => {
      for (const job of INITIAL_JOBS) {
        expect(job.skillsNeeded.length).toBeGreaterThan(0);
      }
    });

    it('every job should have a valid type', () => {
      const validTypes = ['Full-time', 'Contract', 'Part-time', 'Remote'];
      for (const job of INITIAL_JOBS) {
        expect(validTypes).toContain(job.type);
      }
    });

    it('every job should have required metadata fields', () => {
      for (const job of INITIAL_JOBS) {
        expect(job.title).toBeTruthy();
        expect(job.company).toBeTruthy();
        expect(job.description).toBeTruthy();
        expect(job.salary).toBeTruthy();
        expect(job.location).toBeTruthy();
        expect(job.logo).toBeTruthy();
      }
    });
  });

  describe('INITIAL_REQUESTS', () => {
    it('should contain at least 2 course requests', () => {
      expect(INITIAL_REQUESTS.length).toBeGreaterThanOrEqual(2);
    });

    it('should have unique IDs for every request', () => {
      const ids = INITIAL_REQUESTS.map((r) => r.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('every request should have a valid status', () => {
      const validStatuses = ['Pending', 'Approved'];
      for (const req of INITIAL_REQUESTS) {
        expect(validStatuses).toContain(req.status);
      }
    });

    it('every request should have at least one wanted skill', () => {
      for (const req of INITIAL_REQUESTS) {
        expect(req.skillsWanted.length).toBeGreaterThan(0);
      }
    });

    it('every request should have recruiter and company info', () => {
      for (const req of INITIAL_REQUESTS) {
        expect(req.recruiterName).toBeTruthy();
        expect(req.company).toBeTruthy();
      }
    });
  });

  describe('Cross-data consistency', () => {
    it('candidates with completedCourseIds should reference valid course IDs', () => {
      const courseIds = new Set(INITIAL_COURSES.map((c) => c.id));
      for (const cand of INITIAL_CANDIDATES) {
        for (const courseId of cand.completedCourseIds) {
          expect(courseIds.has(courseId)).toBe(true);
        }
      }
    });

    it('should have at least one Pending request for demo purposes', () => {
      const pending = INITIAL_REQUESTS.filter((r) => r.status === 'Pending');
      expect(pending.length).toBeGreaterThanOrEqual(1);
    });
  });
});
