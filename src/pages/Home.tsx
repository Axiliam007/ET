import { Link } from "react-router-dom";
import { primeTimeChapter } from "../data/primeTimeChapter";
import { useLearner } from "../context/LearnerContext";
import { getRecommendations } from "../lib/learnerModel";

export function Home() {
  const { state, reset } = useLearner();
  const recs = getRecommendations(state);
  const { meta, lessons } = primeTimeChapter;

  return (
    <>
      <h1 className="page-title">{meta.title}</h1>
      <p className="lead">{meta.description}</p>

      <div className="card">
        <h2>How this chapter is organized</h2>
        <p className="reading">
          You move through six lessons that build from the meaning of factors to
          applications of GCF and LCM. Each lesson has objectives, explanations,
          guided practice with solutions, and a short checkpoint quiz. A final
          unit assessment draws on all ideas together.
        </p>
        <h3>Adaptation (learner model)</h3>
        <p className="reading">
          After each quiz, the system updates a <strong>mastery estimate</strong>{" "}
          per concept (0–100%) using a weighted blend of your recent scores. The{" "}
          <Link to="/progress">Progress</Link> page shows recommendations: if a
          prerequisite is weak, you are nudged to review earlier ideas before
          stretching ahead; consistently strong work unlocks stretch suggestions.
        </p>
        <div className="callout">
          <strong>Try it:</strong> complete a lesson quiz—your profile updates and
          the recommendation list refreshes.
        </div>
        <div className="btn-row">
          <Link className="btn btn-primary" to={`/lesson/${lessons[0].slug}`}>
            Begin lesson 1
          </Link>
          <Link className="btn" to="/progress">
            View progress
          </Link>
          <button type="button" className="btn" onClick={reset}>
            Reset saved progress
          </button>
        </div>
      </div>

      <div className="card">
        <h2>Current recommendations</h2>
        <ul className="reading">
          {recs.map((r, i) => (
            <li key={i}>
              <span className="badge recommend">{r.kind.replace(/_/g, " ")}</span>{" "}
              {r.message}{" "}
              <span style={{ color: "var(--muted)" }}>({r.reason})</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
