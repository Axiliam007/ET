import { Link } from "react-router-dom";
import { useLearner } from "../context/LearnerContext";
import {
  conceptSlugMap,
  getRecommendations,
  type ConceptId,
} from "../lib/learnerModel";

function MasteryBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="meter" aria-hidden>
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

const LABELS: Record<ConceptId, string> = {
  intro: "Factors & meaning",
  factor_pairs: "Factor pairs",
  prime_composite: "Prime & composite",
  prime_factorization: "Prime factorization",
  gcf_lcm: "GCF & LCM",
  applications: "Applications",
};

export function ProgressPage() {
  const { state } = useLearner();
  const recs = getRecommendations(state);
  const slugFor = conceptSlugMap();

  return (
    <>
      <h1 className="page-title">Progress &amp; adaptation</h1>
      <p className="lead">
        Mastery estimates update when you submit quizzes. They are stored in
        your browser (localStorage) for this device.
      </p>

      <div className="card">
        <h2>Concept mastery</h2>
        <div style={{ display: "grid", gap: "1rem" }}>
          {(Object.keys(state.mastery) as ConceptId[]).map((id) => (
            <MasteryBar key={id} label={LABELS[id]} value={state.mastery[id]} />
          ))}
        </div>
      </div>

      <div className="card">
        <h2>Adaptive recommendations</h2>
        <p className="reading">
          Rules combine <strong>prerequisite strength</strong>, your{" "}
          <strong>weakest concept</strong>, and <strong>stretch</strong>{" "}
          thresholds. This is transparent rule-based adaptation (inspectable in
          the source)—not a black box.
        </p>
        <ul className="reading">
          {recs.map((r, i) => (
            <li key={i} style={{ marginBottom: "0.75rem" }}>
              <div>
                <span className="badge recommend">{r.kind.replace(/_/g, " ")}</span>
              </div>
              <div>{r.message}</div>
              <div style={{ color: "var(--muted)", fontSize: "0.92rem" }}>
                {r.reason}
              </div>
              {"targetConcept" in r && (
                <div style={{ marginTop: "0.35rem" }}>
                  <Link
                    className="btn"
                    to={`/lesson/${slugFor[r.targetConcept]}`}
                  >
                    Go to related lesson
                  </Link>
                </div>
              )}
              {r.kind === "proceed" && r.nextConcept && (
                <div style={{ marginTop: "0.35rem" }}>
                  <Link
                    className="btn btn-primary"
                    to={`/lesson/${slugFor[r.nextConcept]}`}
                  >
                    Open suggested lesson
                  </Link>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2>Recent attempts</h2>
        {state.attempts.length === 0 ? (
          <p className="reading">No quiz submissions yet.</p>
        ) : (
          <ul className="reading" style={{ fontSize: "0.95rem" }}>
            {state.attempts.slice(0, 12).map((a, i) => (
              <li key={i}>
                {new Date(a.at).toLocaleString()} — {a.quizId} ·{" "}
                {LABELS[a.conceptId]}: {a.scorePercent}%
              </li>
            ))}
          </ul>
        )}
      </div>

      {state.unitAssessmentBest != null && (
        <div className="card">
          <h2>Unit assessment</h2>
          <p>
            Best score: <strong>{state.unitAssessmentBest}%</strong>
          </p>
        </div>
      )}
    </>
  );
}
