import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../services/axiosInstance";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      login(res.data.user, res.data.token);
      if (res.data.user.role === "employer") navigate("/employer/dashboard");
      else navigate("/jobs");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
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
            Your next big<br />
            <span className="gradient-text">opportunity</span><br />
            awaits.
          </h2>
          <p className="text-white/50 text-lg leading-relaxed max-w-sm">
            Join thousands of professionals who found their dream careers through JobBoard.
          </p>

          <div className="mt-10 space-y-3">
            {[
              { avatar: "P", name: "Priya S.", role: "Hired at Google", color: "#6366f1" },
              { avatar: "R", name: "Rahul M.", role: "Hired at Microsoft", color: "#10b981" },
              { avatar: "A", name: "Ananya K.", role: "Hired at Flipkart", color: "#ec4899" },
            ].map((person, i) => (
              <div key={i} className="flex items-center gap-3 glass rounded-xl px-4 py-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-800 text-sm flex-shrink-0"
                  style={{ background: person.color }}>
                  {person.avatar}
                </div>
                <div>
                  <p className="text-white font-700 text-sm">{person.name}</p>
                  <p className="text-white/40 text-xs">{person.role}</p>
                </div>
                <div className="ml-auto">
                  <span className="text-xs text-emerald-400 font-700">✓ Hired</span>
                </div>
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
            <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-500">Sign in to your JobBoard account</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 flex items-start gap-3">
              <span className="text-red-500 mt-0.5">⚠</span>
              <p className="text-red-600 text-sm font-500">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-700 text-gray-700 mb-1.5">Email address</label>
              <input type="email" name="email" value={formData.email}
                onChange={handleChange} required placeholder="you@example.com"
                className="pro-input" />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-700 text-gray-700">Password</label>
              </div>
              <input type="password" name="password" value={formData.password}
                onChange={handleChange} required placeholder="••••••••"
                className="pro-input" />
            </div>

            <button type="submit" disabled={loading}
              className="btn-dark w-full py-3 mt-2 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : "Sign in →"}
            </button>
          </form>

          <div className="section-divider"></div>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 font-700 hover:underline">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;