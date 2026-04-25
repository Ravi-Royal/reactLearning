export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface AngularQuestion {
  id: number;
  question: string;
  answer: string;
  code?: string;
  category: string;
  difficulty: Difficulty;
}

export interface QuestionCategory {
  id: string;
  label: string;
  icon: string;
}
