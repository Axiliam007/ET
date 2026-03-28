import type { ConceptId } from "../types";

const STORAGE_KEY = "prime-time-learner-v1";

/** Mastery score 0–100 per concept; updated with exponential moving average after each quiz. */
export type MasteryMap = Record<ConceptId, number>;

export interface AttemptRecord {
  at: string;
  quizId: string;
  scorePercent: number;
  conceptId: ConceptId;
}

export interface LearnerState {
  version: 1;
  mastery: MasteryMap;
  attempts: AttemptRecord[];
  /** Lesson slugs marked complete by learner (navigation aid) */
  completedLessons: string[];
  unitAssessmentBest: number | null;
}

const CONCEPT_ORDER: ConceptId[] = [
  "intro",
  "factor_pairs",
  "prime_composite",
  "prime_factorization",
  "gcf_lcm",
  "applications",
];

const PREREQ: Record<ConceptId, ConceptId | null> = {
  intro: null,
  factor_pairs: "intro",
  prime_composite: "factor_pairs",
  prime_factorization: "prime_composite",
  gcf_lcm: "prime_factorization",
  applications: "gcf_lcm",
};

function defaultMastery(): MasteryMap {
  return {
    intro: 0,
    factor_pairs: 0,
    prime_composite: 0,
    prime_factorization: 0,
    gcf_lcm: 0,
    applications: 0,
  };
}

export function emptyLearnerState(): LearnerState {
  return {
    version: 1,
    mastery: defaultMastery(),
    attempts: [],
    completedLessons: [],
    unitAssessmentBest: null,
  };
}

export function loadLearnerState(): LearnerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyLearnerState();
    const parsed = JSON.parse(raw) as LearnerState;
    if (parsed.version !== 1 || typeof parsed.mastery !== "object") {
      return emptyLearnerState();
    }
    const base = emptyLearnerState();
    return {
      ...base,
      ...parsed,
      mastery: { ...base.mastery, ...parsed.mastery },
      attempts: Array.isArray(parsed.attempts) ? parsed.attempts : [],
      completedLessons: Array.isArray(parsed.completedLessons)
        ? parsed.completedLessons
        : [],
    };
  } catch {
    return emptyLearnerState();
  }
}

export function saveLearnerState(state: LearnerState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/**
 * After a scored activity, blend prior mastery with new score.
 * alpha higher => faster reaction to latest performance.
 */
export function updateMastery(
  prev: MasteryMap,
  conceptId: ConceptId,
  scorePercent: number,
  alpha = 0.35
): MasteryMap {
  const prior = prev[conceptId] ?? 0;
  const blended = prior * (1 - alpha) + scorePercent * alpha;
  return { ...prev, [conceptId]: Math.min(100, Math.round(blended)) };
}

export function recordAttempt(
  state: LearnerState,
  quizId: string,
  conceptId: ConceptId,
  scorePercent: number
): LearnerState {
  const attempt: AttemptRecord = {
    at: new Date().toISOString(),
    quizId,
    scorePercent,
    conceptId,
  };
  return {
    ...state,
    mastery: updateMastery(state.mastery, conceptId, scorePercent),
    attempts: [attempt, ...state.attempts].slice(0, 80),
  };
}

export function markLessonComplete(state: LearnerState, slug: string): LearnerState {
  if (state.completedLessons.includes(slug)) return state;
  return { ...state, completedLessons: [...state.completedLessons, slug] };
}

export function recordUnitAssessment(
  state: LearnerState,
  scorePercent: number
): LearnerState {
  const best =
    state.unitAssessmentBest == null
      ? scorePercent
      : Math.max(state.unitAssessmentBest, scorePercent);
  return { ...state, unitAssessmentBest: best };
}

export type Recommendation =
  | {
      kind: "review_prerequisite";
      message: string;
      targetConcept: ConceptId;
      reason: string;
    }
  | {
      kind: "remedial_practice";
      message: string;
      targetConcept: ConceptId;
      reason: string;
    }
  | {
      kind: "stretch";
      message: string;
      targetConcept: ConceptId;
      reason: string;
    }
  | {
      kind: "proceed";
      message: string;
      nextConcept: ConceptId | null;
      reason: string;
    };

const THRESHOLD_WEAK = 55;
const THRESHOLD_STRONG = 88;

/**
 * Rule-based adaptation: uses prerequisite mastery and weakest concept.
 * Pedagogical intent: block rushing ahead when foundations are weak;
 * suggest enrichment when consistently strong.
 */
export function getRecommendations(state: LearnerState): Recommendation[] {
  const { mastery } = state;
  const out: Recommendation[] = [];

  for (const c of CONCEPT_ORDER) {
    const p = PREREQ[c];
    if (p != null && mastery[p] < THRESHOLD_WEAK && mastery[c] < 70) {
      out.push({
        kind: "review_prerequisite",
        message: `Strengthen ${label(p)} before pushing deep into ${label(c)}.`,
        targetConcept: p,
        reason: `${label(p)} mastery is ${mastery[p]}% (below ${THRESHOLD_WEAK}%).`,
      });
    }
  }

  let weakest: ConceptId = "intro";
  for (const c of CONCEPT_ORDER) {
    if (mastery[c] < mastery[weakest]) weakest = c;
  }
  if (mastery[weakest] < THRESHOLD_WEAK && mastery[weakest] > 0) {
    out.push({
      kind: "remedial_practice",
      message: `Focus extra practice on ${label(weakest)}.`,
      targetConcept: weakest,
      reason: `Lowest tracked mastery is ${mastery[weakest]}% in ${label(weakest)}.`,
    });
  }

  const last = CONCEPT_ORDER[CONCEPT_ORDER.length - 1];
  if (mastery[last] >= THRESHOLD_STRONG) {
    out.push({
      kind: "stretch",
      message:
        "Try extension problems: explain why GCF × LCM = product for two numbers, or explore prime gaps.",
      targetConcept: last,
      reason: "Strong performance on applications—time for generalization tasks.",
    });
  }

  const next = CONCEPT_ORDER.find((c) => mastery[c] < 75) ?? null;
  out.push({
    kind: "proceed",
    message: next
      ? `Suggested next emphasis: ${label(next)}.`
      : "Chapter objectives look secure—take the unit check or revisit any lesson.",
    nextConcept: next,
    reason: "Based on mastery profile and prerequisite chain.",
  });

  return out;
}

function label(c: ConceptId): string {
  switch (c) {
    case "intro":
      return "Factors & meaning";
    case "factor_pairs":
      return "Factor pairs";
    case "prime_composite":
      return "Prime & composite";
    case "prime_factorization":
      return "Prime factorization";
    case "gcf_lcm":
      return "GCF & LCM";
    case "applications":
      return "Applications";
    default:
      return c;
  }
}

export function conceptSlugMap(): Record<ConceptId, string> {
  return {
    intro: "ways-to-think-about-factors",
    factor_pairs: "factor-pairs-systematically",
    prime_composite: "prime-and-composite",
    prime_factorization: "prime-factorization",
    gcf_lcm: "gcf-and-lcm",
    applications: "using-structure-in-problems",
  };
}
