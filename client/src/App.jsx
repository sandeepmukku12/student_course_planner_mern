import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardLayout from "./dashboard/DashboardLayout";
import StudyGroupsPage from "./pages/StudyGroups";
import Courses from "./pages/Courses";
import StudyGroupDetails from "./pages/StudyGroupDetails";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" />
      <Routes>
        <Route path="/dashboard" element={<DashboardLayout />}/>
        <Route path="/study-groups" element={<StudyGroupsPage />} />
        <Route path="/study-groups/:id" element={<StudyGroupDetails />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
