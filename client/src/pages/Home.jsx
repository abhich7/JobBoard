import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const companies = ["Google", "Microsoft", "Amazon", "Flipkart", "Infosys", "TCS", "Wipro", "Zomato"];

  const categories = [
    { icon: "⚡", name: "Engineering", jobs: "2,847 jobs", color: "#6366f1" },
    { icon: "📐", name: "Design", jobs: "1,203 jobs", color: "#ec4899" },
    { icon: "📊", name: "Finance", jobs: "983 jobs", color: "#10b981" },
    { icon: "📣", name: "Marketing", jobs: "1,456 jobs", color: "#f59e0b" },
    { icon: "🧬", name: "Healthcare", jobs: "756 jobs", color: "#06b6d4" },
    { icon: "📚", name: "Education", jobs: "634 jobs", color: "#8b5cf6" },
  ];

  const features = [
    {
      icon: "🎯",
      title: "Smart Job Matching",
      desc: "Our algorithm matches your skills with the perfect opportunities across thousands of listings.",
    },
    {
      icon: "⚡",
      title: "Instant Apply",
      desc: "One-click application with your saved profile. Track every application in real-time.",
    },
    {
      icon: "🔔",
      title: "Real-time Alerts",
      desc: "Get notified instantly when employers view your profile or update your application status.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="hero-bg noise relative min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
          <div className="max-w-4xl">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8 fade-up">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-white/70 text-sm font-500">500+ companies hiring right now</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.95] tracking-tight mb-8 fade-up"
              style={{ animationDelay: "0.1s" }}>
              Find work<br />
              <span className="gradient-text">you love.</span>
            </h1>

            <p className="text-white/50 text-xl font-400 max-w-xl leading-relaxed mb-12 fade-up"
              style={{ animationDelay: "0.2s" }}>
              JobBoard connects India's top talent with world-class companies. Your next chapter starts here.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 fade-up" style={{ animationDelay: "0.3s" }}>
              <button onClick={() => navigate("/jobs")}
                className="btn-indigo text-base px-8 py-4">
                Explore opportunities →
              </button>
              {!user && (
                <button onClick={() => navigate("/register")}
                  className="glass text-white text-base font-600 px-8 py-4 rounded-xl border border-white/20 hover:bg-white/10 transition">
                  Create free account
                </button>
              )}
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-8 mt-16 fade-up" style={{ animationDelay: "0.4s" }}>
              {[
                { num: "50K+", label: "Active Jobs" },
                { num: "12K+", label: "Companies" },
                { num: "2M+", label: "Job Seekers" },
                { num: "98%", label: "Satisfaction" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-3xl font-black text-white">{s.num}</div>
                  <div className="text-white/40 text-sm font-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating cards */}
        <div className="hidden lg:block absolute right-16 top-1/2 -translate-y-1/2 z-10 space-y-4">
          {[
            { role: "Senior React Dev", co: "Flipkart", sal: "₹32L/yr", type: "Remote", color: "#6366f1" },
            { role: "Product Designer", co: "Swiggy", sal: "₹24L/yr", type: "Hybrid", color: "#ec4899" },
            { role: "Data Engineer", co: "Zepto", sal: "₹28L/yr", type: "On-site", color: "#10b981" },
          ].map((card, i) => (
            <div key={i}
              className={`glass rounded-2xl p-5 w-72 cursor-pointer hover:bg-white/15 transition float-${i + 1}`}
              style={{ animationDelay: `${i * 0.5}s` }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-white font-700 text-sm">{card.role}</p>
                  <p className="text-white/50 text-xs mt-0.5">{card.co}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full font-600"
                  style={{ background: `${card.color}20`, color: card.color }}>
                  {card.type}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm font-600">{card.sal}</span>
                <button className="text-xs bg-white/10 text-white px-3 py-1.5 rounded-lg font-600 hover:bg-white/20 transition">
                  Apply →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trusted by */}
      <section className="py-12 border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-600 text-gray-400 uppercase tracking-widest mb-8">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {companies.map((co, i) => (
              <span key={i} className="text-gray-300 font-800 text-lg hover:text-gray-500 transition cursor-default">
                {co}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-indigo-600 text-sm font-700 uppercase tracking-widest mb-3">Explore</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
              Browse by category
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <div key={i}
                onClick={() => navigate("/jobs")}
                className="premium-card p-6 cursor-pointer group"
                style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                  style={{ background: `${cat.color}15` }}>
                  {cat.icon}
                </div>
                <h3 className="font-800 text-gray-900 text-base mb-1">{cat.name}</h3>
                <p className="text-sm font-600" style={{ color: cat.color }}>{cat.jobs}</p>
                <div className="mt-4 flex items-center gap-1 text-gray-400 group-hover:text-indigo-600 transition text-sm font-600">
                  <span>Explore</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-indigo-600 text-sm font-700 uppercase tracking-widest mb-3">Why JobBoard</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900">
              Built for serious<br />job seekers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 card-hover">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl mb-6">
                  {f.icon}
                </div>
                <h3 className="text-xl font-800 text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-indigo-600 text-sm font-700 uppercase tracking-widest mb-3">Process</p>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-8">
                Get hired in<br />3 simple steps
              </h2>
              <div className="space-y-8">
                {[
                  { num: "01", title: "Create your profile", desc: "Set up your professional profile with skills, experience, and upload your resume in minutes." },
                  { num: "02", title: "Discover opportunities", desc: "Browse curated job listings filtered by location, salary, category, and experience level." },
                  { num: "03", title: "Apply & get hired", desc: "Apply with one click and track your applications. Get real-time status updates from employers." },
                ].map((step, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                      <span className="text-indigo-600 font-900 text-sm">{step.num}</span>
                    </div>
                    <div>
                      <h3 className="font-800 text-gray-900 text-lg mb-1">{step.title}</h3>
                      <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gray-900 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl"></div>
                <div className="relative z-10 space-y-4">
                  {[
                    { label: "Applications sent", value: "47", change: "+12 this week", color: "#6366f1" },
                    { label: "Profile views", value: "234", change: "+38 this week", color: "#10b981" },
                    { label: "Interview calls", value: "8", change: "+3 this week", color: "#f59e0b" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/50 text-xs font-500 mb-1">{stat.label}</p>
                          <p className="text-white text-3xl font-900">{stat.value}</p>
                        </div>
                        <span className="text-xs font-700 px-2 py-1 rounded-full"
                          style={{ background: `${stat.color}20`, color: stat.color }}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="py-24 px-6 bg-gray-900">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-5xl font-black text-white mb-6">
              Ready to find your<br />
              <span className="gradient-text">dream job?</span>
            </h2>
            <p className="text-white/50 text-lg mb-10">
              Join over 2 million professionals already using JobBoard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate("/register")}
                className="btn-indigo text-base px-8 py-4">
                Start for free →
              </button>
              <button onClick={() => navigate("/jobs")}
                className="glass text-white text-base font-600 px-8 py-4 rounded-xl border border-white/20 hover:bg-white/10 transition">
                Browse jobs
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-500 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-black text-xs">J</span>
            </div>
            <span className="text-white font-800">JobBoard</span>
          </div>
          <p className="text-sm">© 2026 JobBoard. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            {["Privacy", "Terms", "Support"].map((l, i) => (
              <span key={i} className="hover:text-white cursor-pointer transition">{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;