import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { primeTimeChapter } from "../data/primeTimeChapter";
import { useLearner } from "../context/LearnerContext";
import { QuizRunner } from "../components/QuizRunner";

export function LessonPage() {
  const { slug } = useParams();
  const { completeLesson, submitLessonQuiz, state } = useLearner();

  const lesson = useMemo(
    () => primeTimeChapter.lessons.find((l) => l.slug === slug),
    [slug]
  );

  if (!lesson) {
    return (
      <p>
        Lesson not found. <Link to="/">Home</Link>
      </p>
    );
  }

  const done = state.completedLessons.includes(lesson.slug);
  const mastery = state.mastery[lesson.conceptId];

  return (
    <>
      <p className="pill">
        Lesson {lesson.order} of {primeTimeChapter.lessons.length} ·{" "}
        <Link to="/">Chapter home</Link>
      </p>
      <h1 className="page-title">{lesson.title}</h1>
      <p className="lead">
        Concept focus: <strong>{lesson.conceptId.replace(/_/g, " ")}</strong> ·
        Tracked mastery: {mastery}%
      </p>

      <div className="objectives">
        <strong>Learning objectives</strong>
        <ul>
          {lesson.learningObjectives.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </div>

      {lesson.vocabulary.length > 0 && (
        <div className="card">
          <h2>Key vocabulary</h2>
          <dl className="vocab">
            {lesson.vocabulary.map((v) => (
              <div key={v.term}>
                <dt>{v.term}</dt>
                <dd>{v.definition}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {lesson.sections.map((s) => (
        <div key={s.id} className="card">
          <h2>{s.title}</h2>
          <div className="reading">
            {s.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      ))}

      <div className="card">
        <h2>Guided practice</h2>
        {lesson.guidedPractice.map((g, i) => (
          <div key={i} style={{ marginBottom: "1.25rem" }}>
            <p>
              <strong>Prompt.</strong> {g.prompt}
            </p>
            <p style={{ color: "var(--muted)" }}>
              <strong>Hint.</strong> {g.hint}
            </p>
            <p>
              <strong>Solution.</strong> {g.solution}
            </p>
          </div>
        ))}
      </div>

      <QuizRunner
        title="Checkpoint quiz"
        submitLabel="Submit checkpoint"
        questions={lesson.quiz}
        onSubmit={({ byConcept }) => {
          submitLessonQuiz(lesson.id, byConcept);
          completeLesson(lesson.slug);
        }}
      />

      <div className="btn-row">
        {done && (
          <span className="pill">Lesson marked complete after last submit</span>
        )}
        {primeTimeChapter.lessons.some((l) => l.order === lesson.order + 1) ? (
          <Link
            className="btn btn-primary"
            to={`/lesson/${
              primeTimeChapter.lessons.find((l) => l.order === lesson.order + 1)!
                .slug
            }`}
          >
            Next lesson
          </Link>
        ) : (
          <Link className="btn btn-primary" to="/assessment">
            Unit assessment
          </Link>
        )}
        <Link className="btn" to="/progress">
          Progress
        </Link>
      </div>
    </>
  );
}
