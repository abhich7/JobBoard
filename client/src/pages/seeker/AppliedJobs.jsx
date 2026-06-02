import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";

const AppliedJobs = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get("/applications/my-applications");
        setApplications(res.data.applications);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const statusConfig = {
    Pending: { class: "status-pending", icon: "⏳", label: "Under Review" },
    Shortlisted: { class: "status-shortlisted", icon: "⭐", label: "Shortlisted" },
    Rejected: { class: "status-rejected", icon: "✕", label: "Not Selected" },
  };

  const filters = ["All", "Pending", "Shortlisted", "Rejected"];

  const filtered = filter === "All"
    ? applications
    : applications.filter((a) => a.status === filter);

  const counts = {
    All: applications.length,
    Pending: applications.filter((a) => a.status === "Pending").length,
    Shortlisted: applications.filter((a) => a.status === "Shortlisted").length,
    Rejected: applications.filter((a) => a.status === "Rejected").length,
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="spinner mx-auto mb-4"></div>
        <p className="text-gray-400 font-500">Loading applications...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <p className="text-sm font-600 text-indigo-600 mb-1">Job Seeker</p>
          <h1 className="text-3xl font-black text-gray-900">My Applications</h1>
          <p className="text-gray-400 mt-1 font-500">Track all your job applications in one place</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Applied", value: counts.All, color: "#6366f1", bg: "#eef2ff" },
            { label: "Under Review", value: counts.Pending, color: "#f59e0b", bg: "#fffbeb" },
            { label: "Shortlisted", value: counts.Shortlisted, color: "#10b981", bg: "#f0fdf4" },
            { label: "Not Selected", value: counts.Rejected, color: "#ef4444", bg: "#fef2f2" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 card-hover">
              <p className="text-3xl font-black mb-1" style={{ color: s.color }}>{s.value}</p>
              <p className="text-sm text-gray-400 font-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-700 transition-all whitespace-nowrap ${
                filter === f
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-200 text-gray-500 hover:border-gray-400"
              }`}>
              {f} ({counts[f]})
            </button>
          ))}
        </div>

        {/* Applications list */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">📋</div>
            <p className="text-gray-700 font-700 text-lg mb-1">No applications found</p>
            <p className="text-gray-400 text-sm mb-6">
              {filter === "All" ? "You haven't applied to any jobs yet" : `No ${filter.toLowerCase()} applications`}
            </p>
            <button onClick={() => navigate("/jobs")} className="btn-indigo px-6 py-2.5">
              Browse Jobs →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((app, i) => {
              const config = statusConfig[app.status] || statusConfig.Pending;
              return (
                <div key={app._id}
                  className="bg-white rounded-2xl border border-gray-200 p-6 fade-up card-hover"
                  style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-900 text-lg flex-shrink-0">
                        {app.jobId?.title?.charAt(0) || "?"}
                      </div>
                      <div className="flex-1">
                        <h2 className="font-800 text-gray-900 text-base mb-1">
                          {app.jobId?.title || "Job Deleted"}
                        </h2>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-400 font-500">
                          {app.jobId?.location && <span>📍 {app.jobId.location}</span>}
                          {app.jobId?.salary && (
                            <span>💰 ₹{app.jobId.salary.toLocaleString()}/yr</span>
                          )}
                          <span>📅 Applied {new Date(app.appliedAt).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric"
                          })}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <span className={`tag ${config.class} flex items-center gap-1.5`}>
                        <span>{config.icon}</span>
                        {config.label}
                      </span>
                      {app.jobId && (
                        <button onClick={() => navigate(`/jobs/${app.jobId._id}`)}
                          className="text-xs font-700 text-indigo-600 hover:underline">
                          View job →
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Status bar */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 flex items-center gap-2">
                        {["Applied", "Under Review", "Decision"].map((step, i) => {
                          const isActive = (app.status === "Pending" && i <= 1) ||
                                          (app.status === "Shortlisted" && i <= 2) ||
                                          (app.status === "Rejected" && i === 0);
                          return (
                            <div key={i} className="flex items-center gap-2 flex-1">
                              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                isActive ? "bg-indigo-600" : "bg-gray-200"
                              }`}></div>
                              <span className={`text-xs font-600 ${
                                isActive ? "text-indigo-600" : "text-gray-300"
                              }`}>{step}</span>
                              {i < 2 && <div className={`flex-1 h-0.5 ${isActive ? "bg-indigo-100" : "bg-gray-100"}`}></div>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedJobs;