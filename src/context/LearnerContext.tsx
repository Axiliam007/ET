import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ConceptId } from "../types";
import {
  loadLearnerState,
  markLessonComplete,
  recordAttempt,
  recordUnitAssessment,
  saveLearnerState,
  type LearnerState,
} from "../lib/learnerModel";

interface Ctx {
  state: LearnerState;
  reset: () => void;
  completeLesson: (slug: string) => void;
  submitLessonQuiz: (
    lessonKey: string,
    scoresByConcept: Map<ConceptId, number>
  ) => void;
  submitUnitAssessment: (
    scoresByConcept: Map<ConceptId, number>,
    overallPercent: number
  ) => void;
}

const LearnerContext = createContext<Ctx | null>(null);

export function LearnerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LearnerState>(() => loadLearnerState());

  useEffect(() => {
    saveLearnerState(state);
  }, [state]);

  const reset = useCallback(() => {
    setState({
      version: 1,
      mastery: {
        intro: 0,
        factor_pairs: 0,
        prime_composite: 0,
        prime_factorization: 0,
        gcf_lcm: 0,
        applications: 0,
      },
      attempts: [],
      completedLessons: [],
      unitAssessmentBest: null,
    });
  }, []);

  const completeLesson = useCallback((slug: string) => {
    setState((s) => markLessonComplete(s, slug));
  }, []);

  const submitLessonQuiz = useCallback(
    (lessonKey: string, scoresByConcept: Map<ConceptId, number>) => {
      setState((s) => {
        let next = s;
        for (const [conceptId, pct] of scoresByConcept) {
          next = recordAttempt(next, `lesson:${lessonKey}`, conceptId, pct);
        }
        return next;
      });
    },
    []
  );

  const submitUnitAssessment = useCallback(
    (scoresByConcept: Map<ConceptId, number>, overallPercent: number) => {
      setState((s) => {
        let next = s;
        for (const [conceptId, pct] of scoresByConcept) {
          next = recordAttempt(next, "unit-assessment", conceptId, pct);
        }
        next = recordUnitAssessment(next, overallPercent);
        return next;
      });
    },
    []
  );

  const value = useMemo(
    () => ({
      state,
      reset,
      completeLesson,
      submitLessonQuiz,
      submitUnitAssessment,
    }),
    [state, reset, completeLesson, submitLessonQuiz, submitUnitAssessment]
  );

  return (
    <LearnerContext.Provider value={value}>{children}</LearnerContext.Provider>
  );
}

export function useLearner() {
  const v = useContext(LearnerContext);
  if (!v) throw new Error("useLearner requires LearnerProvider");
  return v;
}
