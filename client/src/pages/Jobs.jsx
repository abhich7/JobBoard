import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

const Jobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [filters, setFilters] = useState({
    keyword: "", location: "", category: "",
    experience: "", minSalary: "", maxSalary: "", sortBy: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchJobs = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/jobs", { params: { ...filters, page, limit: 10 } });
      setJobs(res.data.jobs);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);
      setTotalJobs(res.data.totalJobs);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleReset = () => {
    const empty = { keyword: "", location: "", category: "", experience: "", minSalary: "", maxSalary: "", sortBy: "" };
    setFilters(empty);
    setTimeout(() => fetchJobs(1), 100);
  };

  return (
    <div className="min-h-screen" style={{ background: "#f3f2ef" }}>

      {/* Search header */}
      <div className="bg-white border-b border-gray-200 sticky top-14 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex gap-3 items-center">
            <div className="relative flex-1 max-w-sm">
              <input
                placeholder="Search jobs..."
                value={filters.keyword}
                onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && fetchJobs(1)}
                className="li-input py-2.5 text-sm pl-10"
              />
              <span className="absolute left-3 top-3 text-gray-400 text-sm">🔍</span>
            </div>
            <div className="relative">
              <input
                placeholder="📍 Location"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="li-input py-2.5 text-sm w-40"
              />
            </div>
            <button onClick={() => fetchJobs(1)} className="btn-li-primary btn-sm px-5 py-2.5">
              Search
            </button>
            <button onClick={() => setShowFilters(!showFilters)}
              className="btn-li-secondary btn-sm px-4 py-2.5 flex items-center gap-1">
              <span>⚙️</span> Filters
            </button>
            {Object.values(filters).some(v => v) && (
              <button onClick={handleReset} className="text-sm text-gray-500 hover:text-gray-700 font-500">
                Clear all
              </button>
            )}
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 pt-3 border-t border-gray-100 slide-down">
              <input placeholder="Category" value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="li-input py-2 text-sm" />
              <input placeholder="Experience" value={filters.experience}
                onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                className="li-input py-2 text-sm" />
              <input type="number" placeholder="Min Salary" value={filters.minSalary}
                onChange={(e) => setFilters({ ...filters, minSalary: e.target.value })}
                className="li-input py-2 text-sm" />
              <select value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="li-input py-2 text-sm">
                <option value="">Sort by: Relevance</option>
                <option value="salary_desc">Salary: High → Low</option>
                <option value="salary_asc">Salary: Low → High</option>
                <option value="oldest">Date: Oldest</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {!loading && (
          <p className="text-sm text-gray-500 font-500 mb-4">
            {totalJobs} job{totalJobs !== 1 ? "s" : ""} found
          </p>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="spinner"></div>
            <p className="text-gray-400 text-sm font-500">Finding opportunities...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🔍</div>
            <h3 className="font-700 text-gray-800 text-lg mb-1">No jobs found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {jobs.map((job, i) => (
              <div key={job._id}
                onClick={() => navigate(`/jobs/${job._id}`)}
                className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all fade-up"
                style={{ animationDelay: `${i * 0.04}s` }}>

                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center font-800 text-blue-600 text-xl flex-shrink-0">
                    {job.title?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="font-700 text-gray-900 text-base leading-tight">{job.title}</h2>
                        <p className="text-sm text-gray-500 font-500 mt-0.5">{job.employerId?.name || "Company"}</p>
                      </div>
                      <span className="li-tag tag-blue flex-shrink-0">{job.category}</span>
                    </div>
                    <p className="text-gray-500 text-xs mt-2 line-clamp-1 font-400">{job.description}</p>

                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <span className="text-xs text-gray-500 font-500">📍 {job.location}</span>
                      <span className="text-xs text-gray-500 font-500">🕐 {job.experience}</span>
                      <span className="text-xs font-700 text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                        ₹{job.salary?.toLocaleString()}/yr
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400 font-400">
                    {new Date(job.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                  <button className="btn-li-secondary btn-sm px-4 py-1.5 text-xs">
                    Apply →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button onClick={() => fetchJobs(currentPage - 1)} disabled={currentPage === 1}
              className="btn-li-secondary btn-sm disabled:opacity-40 px-4 py-2">← Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => fetchJobs(page)}
                className={`w-9 h-9 rounded-full text-sm font-700 transition ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-blue-400"
                }`}>
                {page}
              </button>
            ))}
            <button onClick={() => fetchJobs(currentPage + 1)} disabled={currentPage === totalPages}
              className="btn-li-secondary btn-sm disabled:opacity-40 px-4 py-2">Next →</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;