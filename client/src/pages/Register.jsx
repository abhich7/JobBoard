import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "jobseeker" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await axiosInstance.post("/auth/register", formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-white flex">

      {/* Left */}
      <div className="hidden lg:flex lg:w-1/2 hero-bg noise flex-col justify-between p-12 relative overflow-hidden">
        <div className="flex items-center gap-2.5 relative z-10">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-black text-sm">J</span>
          </div>
          <span className="text-white font-800 text-lg">JobBoard</span>
        </div>

        <div className="relative z-10">
          <h2 className="text-5xl font-black text-white leading-tight mb-6">
            Start your<br />
            <span className="gradient-text">career journey</span><br />
            today.
          </h2>
          <div className="grid grid-cols-2 gap-3 mt-8">
            {[
              { icon: "🎯", label: "Smart matching", desc: "AI-powered job recommendations" },
              { icon: "⚡", label: "Instant apply", desc: "One-click applications" },
              { icon: "📊", label: "Track progress", desc: "Real-time status updates" },
              { icon: "🔔", label: "Alerts", desc: "Get notified instantly" },
            ].map((f, i) => (
              <div key={i} className="glass rounded-2xl p-4">
                <div className="text-2xl mb-2">{f.icon}</div>
                <p className="text-white font-700 text-sm">{f.label}</p>
                <p className="text-white/40 text-xs mt-0.5">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/20 text-sm relative z-10">© 2026 JobBoard</p>
      </div>

      {/* Right */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-sm fade-up">

          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-2">Create account</h1>
            <p className="text-gray-500">Join JobBoard for free today</p>
          </div>

          {/* Role toggle */}
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 mb-6">
            {[
              { value: "jobseeker", label: "Job Seeker" },
              { value: "employer", label: "Employer" },
            ].map((r) => (
              <button key={r.value} type="button"
                onClick={() => setFormData({ ...formData, role: r.value })}
                className={`flex-1 py-2.5 rounded-lg text-sm font-700 transition-all ${
                  formData.role === r.value
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}>
                {r.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 flex items-start gap-3">
              <span className="text-red-500 mt-0.5">⚠</span>
              <p className="text-red-600 text-sm font-500">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-700 text-gray-700 mb-1.5">Full name</label>
              <input type="text" name="name" value={formData.name}
                onChange={handleChange} required placeholder="Abhiram Kumar"
                className="pro-input" />
            </div>
            <div>
              <label className="block text-sm font-700 text-gray-700 mb-1.5">Email address</label>
              <input type="email" name="email" value={formData.email}
                onChange={handleChange} required placeholder="you@example.com"
                className="pro-input" />
            </div>
            <div>
              <label className="block text-sm font-700 text-gray-700 mb-1.5">Password</label>
              <input type="password" name="password" value={formData.password}
                onChange={handleChange} required placeholder="Create a strong password"
                className="pro-input" />
            </div>

            <button type="submit" disabled={loading}
              className="btn-dark w-full py-3 mt-2 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating account...
                </>
              ) : `Create ${formData.role === "employer" ? "employer" : "seeker"} account →`}
            </button>
          </form>

          <div className="section-divider"></div>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-700 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;