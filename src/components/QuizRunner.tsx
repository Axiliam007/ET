import { useMemo, useState } from "react";
import type { ConceptId, QuizQuestion } from "../types";

function scoresByConceptFromQuestions(
  questions: QuizQuestion[],
  correctIds: Set<string>
): Map<ConceptId, number> {
  const map = new Map<ConceptId, { ok: number; total: number }>();
  for (const q of questions) {
    const cur = map.get(q.conceptId) ?? { ok: 0, total: 0 };
    cur.total += 1;
    if (correctIds.has(q.id)) cur.ok += 1;
    map.set(q.conceptId, cur);
  }
  const out = new Map<ConceptId, number>();
  for (const [c, v] of map) {
    out.set(c, v.total === 0 ? 0 : Math.round((100 * v.ok) / v.total));
  }
  return out;
}

export function QuizRunner({
  questions,
  title,
  submitLabel,
  onSubmit,
  disabled,
}: {
  questions: QuizQuestion[];
  title: string;
  submitLabel: string;
  onSubmit: (payload: {
    overallPercent: number;
    byConcept: Map<ConceptId, number>;
  }) => void;
  disabled?: boolean;
}) {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const correctIds = useMemo(() => {
    const s = new Set<string>();
    for (const q of questions) {
      if (selections[q.id] === q.correctOptionId) s.add(q.id);
    }
    return s;
  }, [questions, selections]);

  const overallPercent = useMemo(() => {
    if (questions.length === 0) return 0;
    return Math.round((100 * correctIds.size) / questions.length);
  }, [questions.length, correctIds]);

  const handleSubmit = () => {
    if (disabled || submitted) return;
    setSubmitted(true);
    onSubmit({
      overallPercent,
      byConcept: scoresByConceptFromQuestions(questions, correctIds),
    });
  };

  return (
    <section className="card" aria-labelledby="quiz-title">
      <h2 id="quiz-title">{title}</h2>
      {questions.map((q, i) => {
        const sel = selections[q.id];
        const show = submitted;
        return (
          <div key={q.id} className="quiz-q">
            <p>
              {i + 1}. {q.prompt}
            </p>
            <div className="options" role="group" aria-label={`Question ${i + 1}`}>
              {q.options.map((o) => {
                const isSel = sel === o.id;
                const isCor = o.id === q.correctOptionId;
                let cls = "option";
                if (isSel) cls += " selected";
                if (show) {
                  if (isCor) cls += " correct";
                  else if (isSel) cls += " incorrect";
                }
                return (
                  <button
                    key={o.id}
                    type="button"
                    className={cls}
                    disabled={submitted || disabled}
                    onClick={() =>
                      setSelections((prev) => ({ ...prev, [q.id]: o.id }))
                    }
                  >
                    <span>{o.label}</span>
                  </button>
                );
              })}
            </div>
            {show && (
              <div
                className={`feedback ${sel === q.correctOptionId ? "ok" : "bad"}`}
              >
                {q.rationale}
              </div>
            )}
          </div>
        );
      })}
      <div className="btn-row">
        {!submitted ? (
          <button
            type="button"
            className="btn btn-primary"
            disabled={
              disabled || questions.some((q) => selections[q.id] == null)
            }
            onClick={handleSubmit}
          >
            {submitLabel}
          </button>
        ) : (
          <p className="pill">
            Score: {overallPercent}% ({correctIds.size}/{questions.length}{" "}
            correct)
          </p>
        )}
      </div>
    </section>
  );
}
