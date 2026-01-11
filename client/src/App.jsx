import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardLayout from "./dashboard/DashboardLayout";
import StudyGroupsPage from "./pages/StudyGroups";
import Courses from "./pages/Courses";
import StudyGroupDetails from "./pages/StudyGroupDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import PlannerPage from "./pages/Planner";
import ResourcesPage from "./pages/ResourcesPage";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" />
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Dashboard routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/study-groups" />} />
          <Route path="/" element={<DashboardLayout />}>
            <Route path="/study-groups" element={<StudyGroupsPage />} />
            <Route path="/study-groups/:id" element={<StudyGroupDetails />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetailsPage />} />
            <Route path="/planner" element={<PlannerPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
