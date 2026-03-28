import { Route, Routes } from "react-router-dom";
import { LearnerProvider } from "./context/LearnerContext";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { LessonPage } from "./pages/LessonPage";
import { ProgressPage } from "./pages/ProgressPage";
import { AssessmentPage } from "./pages/AssessmentPage";

export default function App() {
  return (
    <LearnerProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="lesson/:slug" element={<LessonPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="assessment" element={<AssessmentPage />} />
        </Route>
      </Routes>
    </LearnerProvider>
  );
}
