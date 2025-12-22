
export type Subject = 'Lịch sử' | 'Địa lí';
export type Grade = '6' | '7' | '8' | '9';

export interface MatrixRow {
  tt: number;
  topic: string;
  content: string;
  tnkq: {
    know: number;
    understand: number;
    apply: number;
  };
  essay: {
    know: number;
    understand: number;
    apply: number;
  };
  totalQuestions: number;
  totalPoints: number;
}

export interface SpecRow {
  tt: number;
  topic: string;
  content: string;
  learningOutcomes: string;
  tnkq: {
    know: string;
    understand: string;
    apply: string;
  };
  essay: {
    know: string;
    understand: string;
    apply: string;
  };
}

export interface Question {
  id: number;
  type: 'MCQ' | 'ESSAY';
  level: 'know' | 'understand' | 'apply';
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
  points: number;
}

export interface GeneratedTest {
  school: string;
  subject: Subject;
  grade: Grade;
  time: number;
  scale: number;
  matrix: MatrixRow[];
  specTable: SpecRow[];
  questions: Question[];
}
