import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../services/axiosInstance";

const EmployerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("jobs");

  useEffect(() => {
    if (user?.role !== "employer") { navigate("/jobs"); return; }
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [statsRes, jobsRes] = await Promise.all([
        axiosInstance.get("/employer/stats"),
        axiosInstance.get("/jobs/my-jobs"),
      ]);
      setStats(statsRes.data.stats);
      setJobs(jobsRes.data.jobs);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchApplicants = async (jobId, jobTitle) => {
    try {
      const res = await axiosInstance.get(`/applications/job/${jobId}`);
      setApplicants(res.data.applications);
      setSelectedJob(jobTitle);
      setActiveTab("applicants");
    } catch (err) { console.error(err); }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await axiosInstance.put(`/applications/status/${applicationId}`, { status });
      setApplicants((prev) =>
        prev.map((app) => app._id === applicationId ? { ...app, status } : app)
      );
    } catch (err) { console.error(err); }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await axiosInstance.delete(`/jobs/${jobId}`);
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch (err) { console.error(err); }
  };

  const statusStyle = {
    Pending: "status-pending",
    Shortlisted: "status-shortlisted",
    Rejected: "status-rejected",
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="spinner mx-auto mb-4"></div>
        <p className="text-gray-400 font-500">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-600 text-indigo-600 mb-1">Employer Dashboard</p>
              <h1 className="text-3xl font-black text-gray-900">Welcome back, {user?.name}</h1>
              <p className="text-gray-400 mt-1 font-500">Manage your job postings and applicants</p>
            </div>
            <button onClick={() => navigate("/employer/create-job")}
              className="btn-indigo px-6 py-3 flex items-center gap-2">
              + Post New Job
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Jobs", value: stats.totalJobs, icon: "📋", color: "#6366f1", bg: "#eef2ff" },
              { label: "Applications", value: stats.totalApplications, icon: "📨", color: "#10b981", bg: "#f0fdf4" },
              { label: "Shortlisted", value: stats.shortlisted, icon: "⭐", color: "#f59e0b", bg: "#fffbeb" },
              { label: "Rejected", value: stats.rejected, icon: "✕", color: "#ef4444", bg: "#fef2f2" },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 card-hover fade-up"
                style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: s.bg }}>
                    {s.icon}
                  </div>
                  <span className="text-xs font-700 px-2 py-1 rounded-full"
                    style={{ background: s.bg, color: s.color }}>
                    Live
                  </span>
                </div>
                <p className="text-3xl font-black text-gray-900 mb-1">{s.value}</p>
                <p className="text-sm text-gray-400 font-500">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
          {[
            { id: "jobs", label: "My Jobs" },
            { id: "applicants", label: selectedJob ? `Applicants — ${selectedJob}` : "Applicants" },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-lg text-sm font-700 transition-all ${
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Jobs Tab */}
        {activeTab === "jobs" && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden fade-up">
            {jobs.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">📋</div>
                <p className="text-gray-700 font-700 text-lg mb-1">No jobs posted yet</p>
                <p className="text-gray-400 text-sm mb-6">Create your first job listing to start receiving applications</p>
                <button onClick={() => navigate("/employer/create-job")} className="btn-indigo px-6 py-2.5">
                  Post your first job →
                </button>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-6 py-4 text-xs font-700 text-gray-400 uppercase tracking-wider">Job Title</th>
                    <th className="text-left px-6 py-4 text-xs font-700 text-gray-400 uppercase tracking-wider">Location</th>
                    <th className="text-left px-6 py-4 text-xs font-700 text-gray-400 uppercase tracking-wider">Salary</th>
                    <th className="text-left px-6 py-4 text-xs font-700 text-gray-400 uppercase tracking-wider">Posted</th>
                    <th className="text-left px-6 py-4 text-xs font-700 text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {jobs.map((job, i) => (
                    <tr key={job._id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-800 text-sm">
                            {job.title?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-700 text-gray-900 text-sm">{job.title}</p>
                            <p className="text-xs text-gray-400 font-500">{job.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-500">{job.location}</td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-700 text-gray-900">₹{job.salary?.toLocaleString()}</span>
                        <span className="text-xs text-gray-400 font-500">/yr</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400 font-500">
                        {new Date(job.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => fetchApplicants(job._id, job.title)}
                            className="text-xs font-700 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition">
                            View Applicants
                          </button>
                          <button onClick={() => deleteJob(job._id)}
                            className="text-xs font-700 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Applicants Tab */}
        {activeTab === "applicants" && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden fade-up">
            {!selectedJob ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">👥</div>
                <p className="text-gray-700 font-700 text-lg mb-1">No job selected</p>
                <p className="text-gray-400 text-sm">Click "View Applicants" on a job to see applications</p>
              </div>
            ) : applicants.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">📭</div>
                <p className="text-gray-700 font-700 text-lg mb-1">No applicants yet</p>
                <p className="text-gray-400 text-sm">Applications will appear here once candidates apply</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-6 py-4 text-xs font-700 text-gray-400 uppercase tracking-wider">Applicant</th>
                    <th className="text-left px-6 py-4 text-xs font-700 text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="text-left px-6 py-4 text-xs font-700 text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-4 text-xs font-700 text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {applicants.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-800 text-sm">
                            {app.applicantId?.name?.charAt(0).toUpperCase()}
                          </div>
                          <p className="font-700 text-gray-900 text-sm">{app.applicantId?.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-500">{app.applicantId?.email}</td>
                      <td className="px-6 py-4">
                        <span className={`tag ${statusStyle[app.status]}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateStatus(app._id, "Shortlisted")}
                            className="text-xs font-700 px-3 py-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition">
                            Shortlist
                          </button>
                          <button onClick={() => updateStatus(app._id, "Rejected")}
                            className="text-xs font-700 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition">
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;