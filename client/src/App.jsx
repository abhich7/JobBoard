import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import EmployerDashboard from "./pages/employer/Dashboard";
import CreateJob from "./pages/employer/CreateJob";
import SeekerProfile from "./pages/seeker/Profile";
import AppliedJobs from "./pages/seeker/AppliedJobs";
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />

        {/* Employer Protected Routes */}
        <Route
          path="/employer/dashboard"
          element={
            <ProtectedRoute role="employer">
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/create-job"
          element={
            <ProtectedRoute role="employer">
              <CreateJob />
            </ProtectedRoute>
          }
        />

        {/* Seeker Protected Routes */}
        <Route
          path="/seeker/profile"
          element={
            <ProtectedRoute role="jobseeker">
              <SeekerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seeker/applied-jobs"
          element={
            <ProtectedRoute role="jobseeker">
              <AppliedJobs />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;