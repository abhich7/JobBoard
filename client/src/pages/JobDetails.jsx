import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../services/axiosInstance";

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axiosInstance.get(`/jobs/${id}`);
        setJob(res.data.job);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!user) { navigate("/login"); return; }
    try {
      setApplying(true);
      setMessage({ type: "", text: "" });
      await axiosInstance.post(`/applications/apply/${id}`);
      setMessage({ type: "success", text: "Application submitted successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to apply" });
    } finally { setApplying(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="spinner mx-auto mb-4"></div>
        <p className="text-gray-400">Loading job details...</p>
      </div>
    </div>
  );

  if (!job) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-gray-500">Job not found</p>
        <button onClick={() => navigate("/jobs")} className="btn-dark mt-4 px-6 py-2.5">← Back</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">

        <button onClick={() => navigate("/jobs")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-600 text-sm mb-8 transition">
          ← Back to jobs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Header card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 fade-up">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-900 text-2xl">
                    {job.title?.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h1 className="text-2xl font-black text-gray-900 mb-1">{job.title}</h1>
                      <p className="text-gray-500 font-500">{job.employerId?.name}</p>
                    </div>
                    <span className="tag" style={{ background: "#eef2ff", color: "#4f46e5" }}>
                      {job.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Location", value: job.location, icon: "📍" },
                  { label: "Experience", value: job.experience, icon: "🕐" },
                  { label: "Salary", value: `₹${job.salary?.toLocaleString()}/yr`, icon: "💰" },
                ].map((info, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-xl mb-1">{info.icon}</div>
                    <p className="text-xs text-gray-400 font-500 mb-1">{info.label}</p>
                    <p className="text-sm font-700 text-gray-800">{info.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 fade-up" style={{ animationDelay: "0.1s" }}>
              <h2 className="text-lg font-800 text-gray-900 mb-4">Job Description</h2>
              <p className="text-gray-600 leading-relaxed">{job.description}</p>
            </div>

            {/* Employer */}
            {job.employerId && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 fade-up" style={{ animationDelay: "0.2s" }}>
                <h2 className="text-lg font-800 text-gray-900 mb-4">About the Employer</h2>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-800">
                      {job.employerId?.name?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-700 text-gray-900">{job.employerId?.name}</p>
                    <p className="text-gray-400 text-sm">{job.employerId?.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24 fade-up">
              <div className="mb-4">
                <p className="text-2xl font-900 text-gray-900">
                  ₹{job.salary?.toLocaleString()}
                </p>
                <p className="text-gray-400 text-sm font-500">per year</p>
              </div>

              <p className="text-xs text-gray-400 mb-4 font-500">
                Posted {new Date(job.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>

              {message.text && (
                <div className={`rounded-xl p-3 mb-4 text-sm font-600 ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-100"
                    : "bg-red-50 text-red-600 border border-red-100"
                }`}>
                  {message.type === "success" ? "✓ " : "⚠ "}{message.text}
                </div>
              )}

              {user?.role === "jobseeker" && (
                <button onClick={handleApply} disabled={applying}
                  className="btn-indigo w-full py-3 flex items-center justify-center gap-2">
                  {applying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Applying...
                    </>
                  ) : "Apply Now →"}
                </button>
              )}

              {!user && (
                <button onClick={() => navigate("/login")}
                  className="btn-dark w-full py-3">
                  Sign in to Apply →
                </button>
              )}

              {user?.role === "employer" && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
                  <p className="text-amber-700 text-sm font-600">Employers cannot apply for jobs</p>
                </div>
              )}

              <div className="section-divider"></div>

              <div className="space-y-2 text-sm">
                {[
                  { label: "Job type", value: "Full-time" },
                  { label: "Level", value: job.experience },
                  { label: "Category", value: job.category },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-gray-400 font-500">{item.label}</span>
                    <span className="text-gray-700 font-600">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;