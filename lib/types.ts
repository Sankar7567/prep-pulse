export type TabId = 'home' | 'resume' | 'interview' | 'learn' | 'campus';

export type UserProgress = {
  xp: number;
  streak: number;
  lastActive: string;
  completed: string[];
  interviews: number;
};

export type Course = {
  id: string;
  title: string;
  label: string;
  duration: string;
  description: string;
  concept: string;
  question: string;
  options: string[];
  correct: number;
  color: 'violet' | 'blue' | 'mint';
  icon: string;
};

export const COURSES: Course[] = [
  {
    id: 'star', title: 'STAR Behavioral Method', label: 'COMMUNICATION', duration: '6 min',
    description: 'Turn real experiences into crisp, compelling answers.',
    concept: 'A strong behavioral answer gives the interviewer context without getting lost in it. Set the Situation and Task briefly, spend most of your answer on your Actions, then close with a Result and what you learned.',
    question: 'In a STAR answer, which part should get most of your airtime?',
    options: ['Situation and background', 'Your specific Actions', 'A long list of tools'], correct: 1, color: 'violet', icon: '✳'
  },
  {
    id: 'system', title: 'System Design Basics', label: 'ENGINEERING', duration: '9 min',
    description: 'A dependable framework for open-ended design prompts.',
    concept: 'Start by clarifying users and scale. Define functional and non-functional requirements, sketch the API and data model, then describe components and trade-offs. Call out bottlenecks, reliability, and how you would measure success.',
    question: 'What is the best first move when given a system design prompt?',
    options: ['Pick a database immediately', 'Clarify requirements and expected scale', 'Draw every service you know'], correct: 1, color: 'blue', icon: '⌘'
  },
  {
    id: 'technical', title: 'Technical Screening Drills', label: 'PROBLEM SOLVING', duration: '7 min',
    description: 'Make your thinking visible while solving technical problems.',
    concept: 'Restate the problem, ask about constraints, and test a simple example. Explain a baseline approach, improve it thoughtfully, then walk through edge cases and complexity. Clear reasoning is part of the solution—not commentary after it.',
    question: 'What should you do before optimizing an algorithm?',
    options: ['Confirm understanding with an example', 'Start coding the cleverest solution', 'Skip edge cases'], correct: 0, color: 'mint', icon: '⌁'
  }
];

export const DEMO_RESUME = 'Alex Morgan\nalex.morgan@email.com · Seattle, WA\nEXPERIENCE\nBuilt a React dashboard for 12,000 users and reduced support tickets by 24%.\nCollaborated with product and design to ship accessible features using TypeScript.\nEDUCATION\nB.S. Computer Science, University of Washington\nSKILLS: React, TypeScript, JavaScript, accessibility, testing, collaboration';

export const DEMO_JOB_DESCRIPTION = 'Frontend Engineer. Build accessible React and TypeScript experiences, collaborate with product and design, improve performance, write automated tests, and create reliable interfaces for customers.';

export const DEFAULT_PROGRESS: UserProgress = { xp: 120, streak: 0, lastActive: '', completed: [], interviews: 0 };
