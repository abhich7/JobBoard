import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../services/axiosInstance";

const SeekerProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [basicForm, setBasicForm] = useState({ name: "", headline: "", phone: "", location: "", about: "" });
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [expForm, setExpForm] = useState({ company: "", role: "", startDate: "", endDate: "", description: "", current: false });
  const [eduForm, setEduForm] = useState({ school: "", degree: "", field: "", startYear: "", endYear: "" });
  const [showExpForm, setShowExpForm] = useState(false);
  const [showEduForm, setShowEduForm] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/users/profile");
      const u = res.data.user;
      setProfile(u);
      setBasicForm({ name: u.name || "", headline: u.headline || "", phone: u.phone || "", location: u.location || "", about: u.about || "" });
      setSkills(u.skills || []);
      setExperience(u.experience || []);
      setEducation(u.education || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleBasicUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await axiosInstance.put("/users/profile", basicForm);
      showMsg("success", "Profile updated successfully");
      fetchProfile();
    } catch { showMsg("error", "Failed to update profile"); }
    finally { setUpdating(false); }
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    const updated = [...skills, skillInput.trim()];
    setSkills(updated);
    setSkillInput("");
    saveSkills(updated);
  };

  const removeSkill = (index) => {
    const updated = skills.filter((_, i) => i !== index);
    setSkills(updated);
    saveSkills(updated);
  };

  const saveSkills = async (updated) => {
    try {
      await axiosInstance.put("/users/profile", { skills: updated });
      showMsg("success", "Skills updated");
    } catch { showMsg("error", "Failed to update skills"); }
  };

  const addExperience = async () => {
    const updated = [...experience, expForm];
    try {
      await axiosInstance.put("/users/profile", { experience: updated });
      setExperience(updated);
      setExpForm({ company: "", role: "", startDate: "", endDate: "", description: "", current: false });
      setShowExpForm(false);
      showMsg("success", "Experience added");
    } catch { showMsg("error", "Failed to add experience"); }
  };

  const removeExperience = async (index) => {
    const updated = experience.filter((_, i) => i !== index);
    await axiosInstance.put("/users/profile", { experience: updated });
    setExperience(updated);
    showMsg("success", "Experience removed");
  };

  const addEducation = async () => {
    const updated = [...education, eduForm];
    try {
      await axiosInstance.put("/users/profile", { education: updated });
      setEducation(updated);
      setEduForm({ school: "", degree: "", field: "", startYear: "", endYear: "" });
      setShowEduForm(false);
      showMsg("success", "Education added");
    } catch { showMsg("error", "Failed to add education"); }
  };

  const removeEducation = async (index) => {
    const updated = education.filter((_, i) => i !== index);
    await axiosInstance.put("/users/profile", { education: updated });
    setEducation(updated);
    showMsg("success", "Education removed");
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append("resume", resumeFile);
      await axiosInstance.post("/users/upload-resume", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showMsg("success", "Resume uploaded");
      fetchProfile();
    } catch { showMsg("error", "Upload failed"); }
    finally { setUploading(false); }
  };

  const getPct = () => {
    let score = 0;
    if (profile?.name) score += 20;
    if (profile?.headline) score += 20;
    if (profile?.about) score += 20;
    if (skills.length > 0) score += 20;
    if (profile?.resume) score += 20;
    return score;
  };

  const tabs = [
    { id: "profile", icon: "👤", label: "Basic Info" },
    { id: "skills", icon: "⚡", label: "Skills" },
    { id: "experience", icon: "💼", label: "Experience" },
    { id: "education", icon: "🎓", label: "Education" },
    { id: "resume", icon: "📄", label: "Resume" },
  ];

  const suggestedSkills = ["React.js", "Node.js", "Python", "JavaScript", "MongoDB", "SQL", "TypeScript", "Docker", "AWS", "Git", "Figma", "Java", "Express.js", "Next.js"];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="spinner mx-auto mb-4"></div>
        <p className="text-gray-400 font-500 text-sm">Loading your profile...</p>
      </div>
    </div>
  );

  const pct = getPct();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Toast notification */}
      {message.text && (
        <div className={`fixed top-20 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl font-600 text-sm fade-in flex items-center gap-2 border ${
          message.type === "success"
            ? "bg-white border-emerald-200 text-emerald-700"
            : "bg-white border-red-200 text-red-600"
        }`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0 ${
            message.type === "success" ? "bg-emerald-500" : "bg-red-500"
          }`}>
            {message.type === "success" ? "✓" : "!"}
          </span>
          {message.text}
        </div>
      )}

      {/* Dark hero cover */}
      <div className="hero-bg h-44 relative noise">
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-5xl mx-auto w-full px-6 pb-6">
            <p className="text-white/40 text-sm font-600">My Profile</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">

        {/* Profile header */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm -mt-14 relative z-10 p-7 mb-6">
          <div className="flex flex-col md:flex-row gap-6">

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg border-4 border-white">
                <span className="text-white font-black text-4xl">
                  {profile?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center shadow">
                <span className="text-white text-[10px] font-black">✓</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight">{profile?.name}</h1>
                  <p className="text-indigo-600 font-600 text-sm mt-0.5">
                    {profile?.headline || (
                      <span className="text-gray-300 italic">Add your professional headline</span>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-2.5">
                    {profile?.location && (
                      <span className="flex items-center gap-1 text-xs text-gray-400 font-500">
                        <span>📍</span> {profile.location}
                      </span>
                    )}
                    {profile?.phone && (
                      <span className="flex items-center gap-1 text-xs text-gray-400 font-500">
                        <span>📞</span> {profile.phone}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-gray-400 font-500">
                      <span>✉</span> {profile?.email}
                    </span>
                    <span className="text-xs bg-indigo-50 text-indigo-600 font-700 px-2.5 py-0.5 rounded-full capitalize">
                      {profile?.role}
                    </span>
                  </div>
                </div>

                {/* Profile strength */}
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 min-w-52">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-700 text-gray-500">Profile Strength</span>
                    <span className="text-xs font-900" style={{
                      color: pct >= 80 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#6366f1"
                    }}>{pct}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2.5">
                    <div className="h-1.5 rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: pct >= 80
                          ? "linear-gradient(90deg,#10b981,#34d399)"
                          : pct >= 50
                          ? "linear-gradient(90deg,#f59e0b,#fbbf24)"
                          : "linear-gradient(90deg,#6366f1,#818cf8)"
                      }}>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 font-500">
                    {pct < 40 ? "Add more details to stand out" :
                     pct < 80 ? "Almost there — keep going!" :
                     "Your profile is strong 🎉"}
                  </p>
                </div>
              </div>

              {/* Skills preview */}
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {skills.slice(0, 7).map((s, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-gray-600 font-600 px-2.5 py-1 rounded-lg">
                      {s}
                    </span>
                  ))}
                  {skills.length > 7 && (
                    <span className="text-xs bg-gray-100 text-gray-400 font-600 px-2.5 py-1 rounded-lg">
                      +{skills.length - 7} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Skills", value: skills.length, icon: "⚡", border: "#6366f1" },
            { label: "Experience", value: experience.length, icon: "💼", border: "#8b5cf6" },
            { label: "Education", value: education.length, icon: "🎓", border: "#10b981" },
            { label: "Complete", value: `${pct}%`, icon: "🎯", border: "#f59e0b" },
          ].map((s, i) => (
            <div key={i}
              className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-sm transition"
              style={{ borderTop: `3px solid ${s.border}` }}>
              <div className="text-xl mb-1">{s.icon}</div>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 font-600 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white border border-gray-200 rounded-xl mb-6 overflow-x-auto">
          <div className="flex">
            {tabs.map((tab, i) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-fit flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-700 transition-all border-b-2 ${
                  activeTab === tab.id
                    ? "border-indigo-600 text-indigo-600 bg-indigo-50/50"
                    : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}>
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-10 shadow-sm">

          {/* ── BASIC INFO ── */}
          {activeTab === "profile" && (
            <div className="fade-in">
              <div className="mb-7">
                <h2 className="text-lg font-800 text-gray-900">Basic Information</h2>
                <p className="text-gray-400 text-sm mt-0.5">Update your personal and contact details</p>
              </div>

              <form onSubmit={handleBasicUpdate} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-700 text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                    <input className="pro-input" value={basicForm.name}
                      onChange={(e) => setBasicForm({ ...basicForm, name: e.target.value })}
                      placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-xs font-700 text-gray-500 uppercase tracking-wider mb-2">Professional Headline</label>
                    <input className="pro-input" value={basicForm.headline}
                      onChange={(e) => setBasicForm({ ...basicForm, headline: e.target.value })}
                      placeholder="e.g. Full Stack Developer | React & Node.js" />
                  </div>
                  <div>
                    <label className="block text-xs font-700 text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                    <input className="pro-input" value={basicForm.phone}
                      onChange={(e) => setBasicForm({ ...basicForm, phone: e.target.value })}
                      placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <label className="block text-xs font-700 text-gray-500 uppercase tracking-wider mb-2">Location</label>
                    <input className="pro-input" value={basicForm.location}
                      onChange={(e) => setBasicForm({ ...basicForm, location: e.target.value })}
                      placeholder="Hyderabad, India" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-700 text-gray-500 uppercase tracking-wider mb-2">
                    About Me
                    <span className="text-gray-300 font-400 normal-case ml-2 tracking-normal">— Tell employers about yourself</span>
                  </label>
                  <textarea className="pro-input" rows={5} value={basicForm.about}
                    onChange={(e) => setBasicForm({ ...basicForm, about: e.target.value })}
                    placeholder="Write a professional summary highlighting your background, key skills, and career goals..." />
                </div>

                <div>
                  <label className="block text-xs font-700 text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                  <input className="pro-input cursor-not-allowed" style={{ opacity: 0.5 }}
                    value={profile?.email} disabled />
                </div>

                <div className="pt-2">
                  <button type="submit" disabled={updating}
                    className="btn-dark px-8 py-2.5 flex items-center gap-2">
                    {updating ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Saving changes...
                      </>
                    ) : "Save changes"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── SKILLS ── */}
          {activeTab === "skills" && (
            <div className="fade-in">
              <div className="mb-7">
                <h2 className="text-lg font-800 text-gray-900">Skills & Expertise</h2>
                <p className="text-gray-400 text-sm mt-0.5">Add skills that represent your technical and professional abilities</p>
              </div>

              {/* Add skill input */}
              <div className="flex gap-3 mb-7">
                <input className="pro-input flex-1" value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  placeholder="Type a skill (e.g. React.js) and press Enter or Add" />
                <button onClick={addSkill} className="btn-dark px-5 py-2.5 flex-shrink-0">
                  + Add
                </button>
              </div>

              {/* Suggested */}
              <div className="mb-7">
                <p className="text-xs font-700 text-gray-400 uppercase tracking-wider mb-3">Quick Add — Suggested Skills</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedSkills.filter((s) => !skills.includes(s)).map((s) => (
                    <button key={s}
                      onClick={() => { const u = [...skills, s]; setSkills(u); saveSkills(u); }}
                      className="text-xs font-600 px-3 py-1.5 rounded-lg border border-dashed border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                      + {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="section-divider"></div>

              {/* Current skills */}
              {skills.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-2xl mb-2">⚡</p>
                  <p className="text-gray-500 font-600 text-sm">No skills added yet</p>
                  <p className="text-gray-300 text-xs mt-1">Add skills to help employers discover you</p>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-700 text-gray-400 uppercase tracking-wider mb-4">
                    Your Skills <span className="text-indigo-500">({skills.length})</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, i) => (
                      <div key={i}
                        className="group flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3.5 py-2 rounded-xl hover:border-indigo-300 transition">
                        <span className="text-sm font-700">{skill}</span>
                        <button onClick={() => removeSkill(i)}
                          className="w-4 h-4 rounded-md bg-indigo-200 hover:bg-red-400 hover:text-white flex items-center justify-center text-[10px] font-black transition opacity-60 group-hover:opacity-100">
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── EXPERIENCE ── */}
          {activeTab === "experience" && (
            <div className="fade-in">
              <div className="flex justify-between items-start mb-7">
                <div>
                  <h2 className="text-lg font-800 text-gray-900">Work Experience</h2>
                  <p className="text-gray-400 text-sm mt-0.5">Your professional work history</p>
                </div>
                <button onClick={() => setShowExpForm(!showExpForm)}
                  className={showExpForm ? "btn-outline px-4 py-2 text-sm" : "btn-dark px-4 py-2 text-sm"}>
                  {showExpForm ? "Cancel" : "+ Add Experience"}
                </button>
              </div>

              {showExpForm && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6 fade-in">
                  <p className="text-sm font-800 text-gray-700 mb-4">New Experience</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-700 text-gray-400 uppercase tracking-wider mb-1.5">Company Name *</label>
                      <input className="pro-input" value={expForm.company}
                        onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                        placeholder="Google, TCS, Infosys..." />
                    </div>
                    <div>
                      <label className="block text-xs font-700 text-gray-400 uppercase tracking-wider mb-1.5">Job Title *</label>
                      <input className="pro-input" value={expForm.role}
                        onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                        placeholder="Software Engineer" />
                    </div>
                    <div>
                      <label className="block text-xs font-700 text-gray-400 uppercase tracking-wider mb-1.5">Start Date</label>
                      <input type="month" className="pro-input" value={expForm.startDate}
                        onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-700 text-gray-400 uppercase tracking-wider mb-1.5">End Date</label>
                      <input type="month" className="pro-input" value={expForm.endDate}
                        disabled={expForm.current}
                        onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })} />
                      <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
                        <input type="checkbox" className="rounded" checked={expForm.current}
                          onChange={(e) => setExpForm({ ...expForm, current: e.target.checked })} />
                        <span className="text-xs font-600 text-gray-500">I currently work here</span>
                      </label>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-700 text-gray-400 uppercase tracking-wider mb-1.5">Description</label>
                      <textarea className="pro-input" rows={3} value={expForm.description}
                        onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                        placeholder="Describe your key responsibilities, achievements, and technologies used..." />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={addExperience} className="btn-dark px-6 py-2.5">Save Experience</button>
                    <button onClick={() => setShowExpForm(false)} className="btn-outline px-6 py-2.5">Cancel</button>
                  </div>
                </div>
              )}

              {experience.length === 0 ? (
                <div className="text-center py-14 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-3xl mb-2">💼</p>
                  <p className="text-gray-500 font-600 text-sm">No experience added yet</p>
                  <p className="text-gray-300 text-xs mt-1">Add your work history to impress employers</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {experience.map((exp, i) => (
                    <div key={i}
                      className="border border-gray-100 rounded-xl p-5 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex gap-4">
                          <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 text-xl">
                            🏢
                          </div>
                          <div>
                            <h3 className="font-800 text-gray-900 text-sm leading-tight">{exp.role}</h3>
                            <p className="text-indigo-600 font-700 text-sm mt-0.5">{exp.company}</p>
                            <p className="text-gray-400 text-xs mt-1 font-500">
                              {exp.startDate} — {exp.current ? (
                                <span className="text-emerald-500 font-700">Present</span>
                              ) : exp.endDate}
                            </p>
                            {exp.description && (
                              <p className="text-gray-500 text-sm mt-2 leading-relaxed">{exp.description}</p>
                            )}
                          </div>
                        </div>
                        <button onClick={() => removeExperience(i)}
                          className="flex-shrink-0 text-xs font-700 text-gray-300 hover:text-red-500 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── EDUCATION ── */}
          {activeTab === "education" && (
            <div className="fade-in">
              <div className="flex justify-between items-start mb-7">
                <div>
                  <h2 className="text-lg font-800 text-gray-900">Education</h2>
                  <p className="text-gray-400 text-sm mt-0.5">Your academic background and qualifications</p>
                </div>
                <button onClick={() => setShowEduForm(!showEduForm)}
                  className={showEduForm ? "btn-outline px-4 py-2 text-sm" : "btn-dark px-4 py-2 text-sm"}>
                  {showEduForm ? "Cancel" : "+ Add Education"}
                </button>
              </div>

              {showEduForm && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6 fade-in">
                  <p className="text-sm font-800 text-gray-700 mb-4">New Education</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-700 text-gray-400 uppercase tracking-wider mb-1.5">School / University *</label>
                      <input className="pro-input" value={eduForm.school}
                        onChange={(e) => setEduForm({ ...eduForm, school: e.target.value })}
                        placeholder="IIT Hyderabad, BITS Pilani..." />
                    </div>
                    <div>
                      <label className="block text-xs font-700 text-gray-400 uppercase tracking-wider mb-1.5">Degree *</label>
                      <input className="pro-input" value={eduForm.degree}
                        onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                        placeholder="B.Tech, MBA, MCA, B.Sc..." />
                    </div>
                    <div>
                      <label className="block text-xs font-700 text-gray-400 uppercase tracking-wider mb-1.5">Field of Study</label>
                      <input className="pro-input" value={eduForm.field}
                        onChange={(e) => setEduForm({ ...eduForm, field: e.target.value })}
                        placeholder="Computer Science, Electronics..." />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-700 text-gray-400 uppercase tracking-wider mb-1.5">Start Year</label>
                        <input type="number" className="pro-input" value={eduForm.startYear}
                          onChange={(e) => setEduForm({ ...eduForm, startYear: e.target.value })}
                          placeholder="2020" />
                      </div>
                      <div>
                        <label className="block text-xs font-700 text-gray-400 uppercase tracking-wider mb-1.5">End Year</label>
                        <input type="number" className="pro-input" value={eduForm.endYear}
                          onChange={(e) => setEduForm({ ...eduForm, endYear: e.target.value })}
                          placeholder="2024" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={addEducation} className="btn-dark px-6 py-2.5">Save Education</button>
                    <button onClick={() => setShowEduForm(false)} className="btn-outline px-6 py-2.5">Cancel</button>
                  </div>
                </div>
              )}

              {education.length === 0 ? (
                <div className="text-center py-14 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-3xl mb-2">🎓</p>
                  <p className="text-gray-500 font-600 text-sm">No education added yet</p>
                  <p className="text-gray-300 text-xs mt-1">Add your academic qualifications</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {education.map((edu, i) => (
                    <div key={i}
                      className="border border-gray-100 rounded-xl p-5 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex gap-4">
                          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 text-xl">
                            🎓
                          </div>
                          <div>
                            <h3 className="font-800 text-gray-900 text-sm leading-tight">
                              {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                            </h3>
                            <p className="text-emerald-600 font-700 text-sm mt-0.5">{edu.school}</p>
                            <p className="text-gray-400 text-xs mt-1 font-500">
                              {edu.startYear} — {edu.endYear}
                            </p>
                          </div>
                        </div>
                        <button onClick={() => removeEducation(i)}
                          className="flex-shrink-0 text-xs font-700 text-gray-300 hover:text-red-500 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── RESUME ── */}
          {activeTab === "resume" && (
            <div className="fade-in">
              <div className="mb-7">
                <h2 className="text-lg font-800 text-gray-900">Resume</h2>
                <p className="text-gray-400 text-sm mt-0.5">Upload your resume to apply for jobs instantly</p>
              </div>

              {/* Current resume */}
              {profile?.resume ? (
                <div className="flex items-center gap-4 border border-emerald-200 bg-emerald-50 rounded-xl p-5 mb-6">
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0 shadow-sm">
                    📄
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-800 text-emerald-700 text-sm">Resume uploaded ✓</p>
                    <p className="text-gray-400 text-xs mt-0.5 truncate font-500">{profile.resume}</p>
                  </div>
                  <a href={`http://localhost:5000/uploads/${profile.resume}`}
                    target="_blank" rel="noreferrer"
                    className="btn-dark text-xs px-4 py-2 flex-shrink-0">
                    View →
                  </a>
                </div>
              ) : (
                <div className="border border-amber-200 bg-amber-50 rounded-xl p-5 mb-6 flex items-center gap-3">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <p className="text-amber-700 font-700 text-sm">No resume uploaded</p>
                    <p className="text-amber-600/70 text-xs font-500 mt-0.5">Upload a resume to apply for jobs quickly</p>
                  </div>
                </div>
              )}

              {/* Upload area */}
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center hover:border-indigo-300 hover:bg-indigo-50/30 transition-all">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                  📁
                </div>
                <p className="font-700 text-gray-700 mb-1">Upload New Resume</p>
                <p className="text-gray-400 text-xs mb-6">Supports PDF, DOC, DOCX — Max 5MB</p>
                <input type="file" accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="hidden" id="resumeInput" />
                <label htmlFor="resumeInput"
                  className="btn-outline cursor-pointer inline-block">
                  Choose file
                </label>
                {resumeFile && (
                  <div className="mt-5">
                    <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-600 px-4 py-2 rounded-lg mb-4">
                      <span>📄</span> {resumeFile.name}
                    </div>
                    <br />
                    <button onClick={handleResumeUpload} disabled={uploading}
                      className="btn-dark px-7 py-2.5 flex items-center gap-2 mx-auto">
                      {uploading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Uploading...
                        </>
                      ) : "Upload Resume"}
                    </button>
                  </div>
                )}
              </div>

              {/* Tips */}
              <div className="mt-6 bg-gray-50 border border-gray-100 rounded-xl p-5">
                <p className="text-sm font-800 text-gray-700 mb-4">💡 Resume Tips from Hiring Experts</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { tip: "Keep it to 1-2 pages maximum", icon: "📏" },
                    { tip: "Use action verbs: Built, Led, Designed", icon: "✍️" },
                    { tip: "Quantify achievements with numbers", icon: "📊" },
                    { tip: "Tailor it for each job application", icon: "🎯" },
                    { tip: "Use a clean ATS-friendly format", icon: "✅" },
                    { tip: "Proofread for grammar and spelling", icon: "🔍" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm text-gray-500 font-500">
                      <span className="text-base flex-shrink-0">{item.icon}</span>
                      {item.tip}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SeekerProfile;