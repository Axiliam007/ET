export type ConceptId =
  | "intro"
  | "factor_pairs"
  | "prime_composite"
  | "prime_factorization"
  | "gcf_lcm"
  | "applications";

export interface QuizOption {
  id: string;
  label: string;
}

export interface QuizQuestion {
  id: string;
  conceptId: ConceptId;
  prompt: string;
  options: QuizOption[];
  /** Correct option id */
  correctOptionId: string;
  /** Short rationale shown after answer */
  rationale: string;
}

export interface LessonSection {
  id: string;
  title: string;
  /** Curated HTML-safe content: we use plain text + line breaks in paragraphs */
  body: string[];
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  order: number;
  conceptId: ConceptId;
  learningObjectives: string[];
  vocabulary: { term: string; definition: string }[];
  sections: LessonSection[];
  /** Inline practice (no scoring) */
  guidedPractice: { prompt: string; hint: string; solution: string }[];
  quiz: QuizQuestion[];
}

export interface ChapterMeta {
  id: string;
  title: string;
  grade: string;
  unit: string;
  description: string;
}

export interface UnitAssessment {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface Chapter {
  meta: ChapterMeta;
  lessons: Lesson[];
  unitAssessment: UnitAssessment;
}
