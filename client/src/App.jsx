import { useState, useEffect, useCallback, createContext, useContext } from "react";

// ─── GOOGLE FONTS ───────────────────────────────────────────────────────────
const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);
  return null;
};

// ─── API LAYER ───────────────────────────────────────────────────────────────
const BASE = "http://localhost:3000/api/v1";

const api = async (method, path, body = null, token = null) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const opts = { method, headers, credentials: "include" };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json();
  if (!data.success && res.status >= 400) throw new Error(data.message || "Request failed");
  return data;
};

// ─── AUTH CONTEXT ────────────────────────────────────────────────────────────
const AuthCtx = createContext(null);
const useAuth = () => useContext(AuthCtx);

// ─── TOAST ───────────────────────────────────────────────────────────────────
const ToastCtx = createContext(null);
const useToast = () => useContext(ToastCtx);

// ─── STYLES ──────────────────────────────────────────────────────────────────
const G = {
  bg: "#07080c",
  surface: "#0e1018",
  card: "#13151f",
  cardHover: "#181b27",
  border: "#1e2235",
  borderLight: "#252a3d",
  accent: "#4f8ef7",
  accentDim: "rgba(79,142,247,0.12)",
  accentGlow: "rgba(79,142,247,0.25)",
  green: "#34d399",
  greenDim: "rgba(52,211,153,0.12)",
  amber: "#fbbf24",
  amberDim: "rgba(251,191,36,0.12)",
  red: "#f87171",
  redDim: "rgba(248,113,113,0.12)",
  purple: "#a78bfa",
  purpleDim: "rgba(167,139,250,0.12)",
  text: "#e8eaf2",
  textMid: "#9399b2",
  textDim: "#555d7a",
  font: "'Syne', sans-serif",
  body: "'DM Sans', sans-serif",
};

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }
  body {
    background: ${G.bg};
    color: ${G.text};
    font-family: ${G.body};
    font-size: 14px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }
  ::selection { background: ${G.accentGlow}; color: ${G.accent}; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${G.border}; border-radius: 4px; }
  input, textarea, select {
    background: ${G.surface};
    border: 1px solid ${G.border};
    color: ${G.text};
    font-family: ${G.body};
    font-size: 14px;
    border-radius: 8px;
    padding: 10px 14px;
    width: 100%;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  input:focus, textarea:focus, select:focus {
    border-color: ${G.accent};
    box-shadow: 0 0 0 3px ${G.accentDim};
  }
  input::placeholder, textarea::placeholder { color: ${G.textDim}; }
  button { cursor: pointer; font-family: ${G.font}; border: none; outline: none; }
  @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideIn { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:translateX(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes toastIn { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.4; } }
  .fade-in { animation: fadeIn 0.3s ease forwards; }
  .slide-in { animation: slideIn 0.25s ease forwards; }
`;

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────
const Btn = ({ children, variant = "primary", size = "md", onClick, disabled, style = {}, type = "button" }) => {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 9,
    fontWeight: 600, letterSpacing: "0.02em", transition: "all 0.18s",
    cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
    whiteSpace: "nowrap",
  };
  const sizes = { sm: { padding: "6px 14px", fontSize: 12 }, md: { padding: "10px 20px", fontSize: 14 }, lg: { padding: "13px 28px", fontSize: 15 } };
  const variants = {
    primary: { background: G.accent, color: "#fff", boxShadow: `0 4px 20px ${G.accentGlow}` },
    ghost: { background: "transparent", color: G.textMid, border: `1px solid ${G.border}` },
    danger: { background: G.redDim, color: G.red, border: `1px solid rgba(248,113,113,0.2)` },
    success: { background: G.greenDim, color: G.green, border: `1px solid rgba(52,211,153,0.2)` },
    subtle: { background: G.accentDim, color: G.accent, border: `1px solid rgba(79,142,247,0.2)` },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>
      {children}
    </button>
  );
};

const Badge = ({ label, color = "blue" }) => {
  const map = { blue: [G.accent, G.accentDim], green: [G.green, G.greenDim], amber: [G.amber, G.amberDim], red: [G.red, G.redDim], purple: [G.purple, G.purpleDim] };
  const [fg, bg] = map[color] || map.blue;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", background: bg, color: fg, fontFamily: G.font, textTransform: "uppercase" }}>
      {label}
    </span>
  );
};

const Spinner = ({ size = 20 }) => (
  <span style={{ display: "inline-block", width: size, height: size, border: `2px solid ${G.border}`, borderTopColor: G.accent, borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
);

const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 14, padding: 20, transition: "all 0.2s", cursor: onClick ? "pointer" : "default", ...style }}
    onMouseEnter={e => onClick && (e.currentTarget.style.borderColor = G.borderLight, e.currentTarget.style.background = G.cardHover)}
    onMouseLeave={e => onClick && (e.currentTarget.style.borderColor = G.border, e.currentTarget.style.background = G.card)}>
    {children}
  </div>
);

const Modal = ({ open, onClose, title, children, width = 480 }) => {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(7,8,12,0.85)", backdropFilter: "blur(6px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="fade-in" style={{ background: G.card, border: `1px solid ${G.borderLight}`, borderRadius: 16, padding: 28, width, maxWidth: "calc(100vw - 32px)", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ fontFamily: G.font, fontSize: 18, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "transparent", color: G.textMid, fontSize: 20, lineHeight: 1, padding: "2px 8px", borderRadius: 6, border: `1px solid ${G.border}` }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Field = ({ label, error, children }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: G.textMid, marginBottom: 6, fontFamily: G.font, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</label>}
    {children}
    {error && <p style={{ color: G.red, fontSize: 12, marginTop: 4 }}>{error}</p>}
  </div>
);

// ─── TOAST PROVIDER ───────────────────────────────────────────────────────────
const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "info") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);
  const colors = { info: G.accent, success: G.green, error: G.red, warning: G.amber };
  return (
    <ToastCtx.Provider value={add}>
      {children}
      <div style={{ position: "fixed", top: 20, right: 20, zIndex: 999, display: "flex", flexDirection: "column", gap: 10 }}>
        {toasts.map(t => (
          <div key={t.id} style={{ animation: "toastIn 0.3s ease", background: G.card, border: `1px solid ${G.borderLight}`, borderLeft: `3px solid ${colors[t.type]}`, borderRadius: 10, padding: "12px 18px", minWidth: 260, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", fontSize: 13, fontFamily: G.body }}>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
};

// ─── AUTH PROVIDER ────────────────────────────────────────────────────────────
const AuthProvider = ({ children, onAuth }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("pm_token") || null);

  const login = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem("pm_token", accessToken);
    onAuth(true);
  };

  const logout = async () => {
    try { await api("POST", "/auth/logout", null, token); } catch {}
    setUser(null); setToken(null);
    localStorage.removeItem("pm_token");
    onAuth(false);
  };

  return (
    <AuthCtx.Provider value={{ user, token, login, logout, setUser }}>
      {children}
    </AuthCtx.Provider>
  );
};

// ─── AUTH PAGES ───────────────────────────────────────────────────────────────
const AuthPage = ({ onSuccess }) => {
  const [mode, setMode] = useState("login"); // login | register | forgot
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: G.bg, padding: 20 }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(79,142,247,0.05) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(167,139,250,0.04) 0%, transparent 60%)`, pointerEvents: "none" }} />
      <div className="fade-in" style={{ width: "100%", maxWidth: 420, position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 52, height: 52, borderRadius: 14, background: G.accentDim, border: `1px solid rgba(79,142,247,0.3)`, marginBottom: 16 }}>
            <span style={{ fontSize: 24 }}>⬡</span>
          </div>
          <h1 style={{ fontFamily: G.font, fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em" }}>Basecampy</h1>
          <p style={{ color: G.textDim, marginTop: 6, fontSize: 13 }}>Project management, simplified.</p>
        </div>
        {mode === "login" && <LoginForm onSuccess={onSuccess} onSwitch={setMode} />}
        {mode === "register" && <RegisterForm onSuccess={() => setMode("login")} onSwitch={setMode} />}
        {mode === "forgot" && <ForgotForm onSwitch={setMode} />}
      </div>
    </div>
  );
};

const LoginForm = ({ onSuccess, onSwitch }) => {
  const toast = useToast();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.email || !form.password) return toast("Please fill all fields", "error");
    setLoading(true);
    try {
      const res = await api("POST", "/auth/login", form);
      login(res.data.user, res.data.accessToken);
      toast("Welcome back!", "success");
      onSuccess();
    } catch (e) { toast(e.message, "error"); }
    finally { setLoading(false); }
  };

  return (
    <Card>
      <Field label="Email">
        <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      </Field>
      <Field label="Password">
        <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
          onKeyDown={e => e.key === "Enter" && submit()} />
      </Field>
      <Btn onClick={submit} disabled={loading} style={{ width: "100%", justifyContent: "center", marginTop: 4 }}>
        {loading ? <Spinner size={16} /> : "Sign In"}
      </Btn>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, fontSize: 12, color: G.textDim }}>
        <button style={{ background: "none", color: G.textMid, fontSize: 12, fontFamily: G.body }} onClick={() => onSwitch("forgot")}>Forgot password?</button>
        <button style={{ background: "none", color: G.accent, fontSize: 12, fontFamily: G.body }} onClick={() => onSwitch("register")}>Create account →</button>
      </div>
    </Card>
  );
};

const RegisterForm = ({ onSuccess, onSwitch }) => {
  const toast = useToast();
  const [form, setForm] = useState({ email: "", username: "", password: "", fullName: "" });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.email || !form.username || !form.password) return toast("Please fill required fields", "error");
    setLoading(true);
    try {
      await api("POST", "/auth/register", form);
      toast("Registered! Check your email to verify.", "success");
      onSuccess();
    } catch (e) { toast(e.message, "error"); }
    finally { setLoading(false); }
  };

  return (
    <Card>
      <Field label="Full Name">
        <input placeholder="John Doe" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
      </Field>
      <Field label="Username *">
        <input placeholder="johndoe" value={form.username} onChange={e => setForm({ ...form, username: e.target.value.toLowerCase() })} />
      </Field>
      <Field label="Email *">
        <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      </Field>
      <Field label="Password *">
        <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
      </Field>
      <Btn onClick={submit} disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
        {loading ? <Spinner size={16} /> : "Create Account"}
      </Btn>
      <p style={{ textAlign: "center", marginTop: 14, fontSize: 12, color: G.textDim }}>
        Already have an account? <button style={{ background: "none", color: G.accent, fontSize: 12, fontFamily: G.body }} onClick={() => onSwitch("login")}>Sign in</button>
      </p>
    </Card>
  );
};

const ForgotForm = ({ onSwitch }) => {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email) return toast("Email is required", "error");
    setLoading(true);
    try {
      await api("POST", "/auth/forgot-password", { email });
      toast("Password reset email sent!", "success");
    } catch (e) { toast(e.message, "error"); }
    finally { setLoading(false); }
  };

  return (
    <Card>
      <p style={{ color: G.textMid, marginBottom: 18, fontSize: 13 }}>Enter your email and we'll send you a reset link.</p>
      <Field label="Email">
        <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
      </Field>
      <Btn onClick={submit} disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
        {loading ? <Spinner size={16} /> : "Send Reset Link"}
      </Btn>
      <p style={{ textAlign: "center", marginTop: 14, fontSize: 12 }}>
        <button style={{ background: "none", color: G.accent, fontSize: 12, fontFamily: G.body }} onClick={() => onSwitch("login")}>← Back to login</button>
      </p>
    </Card>
  );
};

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const Sidebar = ({ page, setPage, onLogout, user }) => {
  const navItems = [
    { id: "dashboard", icon: "◈", label: "Dashboard" },
    { id: "projects", icon: "⬡", label: "Projects" },
    { id: "tasks", icon: "◻", label: "My Tasks" },
    { id: "profile", icon: "◯", label: "Profile" },
  ];

  return (
    <aside style={{ width: 220, background: G.surface, borderRight: `1px solid ${G.border}`, display: "flex", flexDirection: "column", padding: "24px 0", flexShrink: 0, height: "100vh", position: "sticky", top: 0 }}>
      <div style={{ padding: "0 20px 24px", borderBottom: `1px solid ${G.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: G.accentDim, border: `1px solid rgba(79,142,247,0.3)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: G.accent }}>⬡</div>
          <span style={{ fontFamily: G.font, fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em" }}>Basecampy</span>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "16px 12px" }}>
        {navItems.map(item => {
          const active = page === item.id;
          return (
            <button key={item.id} onClick={() => setPage(item.id)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, marginBottom: 4, background: active ? G.accentDim : "transparent", color: active ? G.accent : G.textMid, border: active ? `1px solid rgba(79,142,247,0.2)` : "1px solid transparent", fontSize: 14, fontWeight: active ? 600 : 400, transition: "all 0.15s", textAlign: "left", fontFamily: G.body }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: "16px 12px", borderTop: `1px solid ${G.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 10, marginBottom: 8, background: G.card }}>
          <img src={user?.avatar?.url || `https://placehold.co/32x32`} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
          <div style={{ overflow: "hidden" }}>
            <p style={{ fontSize: 13, fontWeight: 600, fontFamily: G.font, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.fullName || user?.username}</p>
            <p style={{ fontSize: 11, color: G.textDim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</p>
          </div>
        </div>
        <Btn variant="ghost" size="sm" onClick={onLogout} style={{ width: "100%", justifyContent: "center" }}>
          Sign Out
        </Btn>
      </div>
    </aside>
  );
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const Dashboard = ({ setPage, setSelectedProject }) => {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("GET", "/projects", null, token)
      .then(r => setProjects(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Total Projects", value: projects.length, color: G.accent, icon: "⬡" },
    { label: "Admin", value: projects.filter(p => p.role === "admin").length, color: G.purple, icon: "◈" },
    { label: "Member", value: projects.filter(p => p.role === "member").length, color: G.green, icon: "◯" },
  ];

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontFamily: G.font, fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>Dashboard</h2>
        <p style={{ color: G.textDim, marginTop: 4 }}>Welcome back. Here's what's going on.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {stats.map(s => (
          <Card key={s.label} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: s.color, flexShrink: 0 }}>{s.icon}</div>
            <div>
              <p style={{ fontSize: 26, fontWeight: 800, fontFamily: G.font, color: s.color }}>{loading ? "—" : s.value}</p>
              <p style={{ fontSize: 12, color: G.textDim, marginTop: 1 }}>{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h3 style={{ fontFamily: G.font, fontSize: 16, fontWeight: 700 }}>Recent Projects</h3>
        <Btn variant="subtle" size="sm" onClick={() => setPage("projects")}>View All →</Btn>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><Spinner /></div>
      ) : projects.length === 0 ? (
        <EmptyState icon="⬡" message="No projects yet. Create your first project!" action={<Btn onClick={() => setPage("projects")}>Create Project</Btn>} />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {projects.slice(0, 6).map((p, i) => (
            <ProjectCard key={i} proj={p} onClick={() => { setSelectedProject(p.project); setPage("project-detail"); }} />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────
const ProjectCard = ({ proj, onClick }) => {
  const project = proj.project || proj;
  const role = proj.role;
  const roleColor = { admin: "red", project_admin: "amber", member: "green" }[role] || "blue";

  return (
    <Card onClick={onClick} style={{ cursor: "pointer" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: G.accentDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: G.accent }}>⬡</div>
        {role && <Badge label={role.replace("_", " ")} color={roleColor} />}
      </div>
      <h4 style={{ fontFamily: G.font, fontWeight: 700, fontSize: 15, marginBottom: 6, lineHeight: 1.3 }}>{project?.name || "—"}</h4>
      <p style={{ color: G.textDim, fontSize: 12, lineHeight: 1.5, marginBottom: 12, minHeight: 36 }}>{project?.description || "No description provided."}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11, color: G.textDim }}>
        {project?.members != null && <span>👥 {project.members} member{project.members !== 1 ? "s" : ""}</span>}
        {project?.createdAt && <span>📅 {new Date(project.createdAt).toLocaleDateString()}</span>}
      </div>
    </Card>
  );
};

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
const EmptyState = ({ icon, message, action }) => (
  <div style={{ textAlign: "center", padding: "60px 20px", color: G.textDim }}>
    <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>{icon}</div>
    <p style={{ marginBottom: 20 }}>{message}</p>
    {action}
  </div>
);

// ─── PROJECTS PAGE ────────────────────────────────────────────────────────────
const ProjectsPage = ({ setPage, setSelectedProject }) => {
  const { token } = useAuth();
  const toast = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [creating, setCreating] = useState(false);

  const load = () => {
    setLoading(true);
    api("GET", "/projects", null, token)
      .then(r => setProjects(r.data || []))
      .catch(e => toast(e.message, "error"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const createProject = async () => {
    if (!form.name.trim()) return toast("Project name is required", "error");
    setCreating(true);
    try {
      await api("POST", "/projects", form, token);
      toast("Project created!", "success");
      setShowCreate(false);
      setForm({ name: "", description: "" });
      load();
    } catch (e) { toast(e.message, "error"); }
    finally { setCreating(false); }
  };

  return (
    <div className="fade-in">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontFamily: G.font, fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>Projects</h2>
          <p style={{ color: G.textDim, marginTop: 4 }}>{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
        </div>
        <Btn onClick={() => setShowCreate(true)}>+ New Project</Btn>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spinner /></div>
      ) : projects.length === 0 ? (
        <EmptyState icon="⬡" message="No projects yet. Create your first!" action={<Btn onClick={() => setShowCreate(true)}>Create Project</Btn>} />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {projects.map((p, i) => (
            <ProjectCard key={i} proj={p} onClick={() => { setSelectedProject(p.project || p); setPage("project-detail"); }} />
          ))}
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New Project">
        <Field label="Project Name *">
          <input placeholder="My awesome project" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field label="Description">
          <textarea rows={3} placeholder="What's this project about?" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ resize: "vertical" }} />
        </Field>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <Btn variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Btn>
          <Btn onClick={createProject} disabled={creating}>{creating ? <Spinner size={14} /> : "Create"}</Btn>
        </div>
      </Modal>
    </div>
  );
};

// ─── PROJECT DETAIL ───────────────────────────────────────────────────────────
const ProjectDetail = ({ project, setPage }) => {
  const { token, user } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState("tasks");
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [memberForm, setMemberForm] = useState({ email: "", role: "member" });
  const [taskForm, setTaskForm] = useState({ title: "", description: "", status: "todo", assignedTo: "" });
  const [addingMember, setAddingMember] = useState(false);
  const [creatingTask, setCreatingTask] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({ name: project?.name || "", description: project?.description || "" });
  const [deleting, setDeleting] = useState(false);

  const loadTasks = () => {
    if (!project?._id) return;
    setLoadingTasks(true);
    api("GET", `/projects/${project._id}/tasks`, null, token)
      .then(r => setTasks(r.data || []))
      .catch(() => {})
      .finally(() => setLoadingTasks(false));
  };

  const loadMembers = () => {
    if (!project?._id) return;
    setLoadingMembers(true);
    api("GET", `/projects/${project._id}/members`, null, token)
      .then(r => setMembers(r.data || []))
      .catch(() => {})
      .finally(() => setLoadingMembers(false));
  };

  useEffect(() => { loadTasks(); loadMembers(); }, [project?._id]);

  const addMember = async () => {
    if (!memberForm.email) return toast("Email is required", "error");
    setAddingMember(true);
    try {
      await api("POST", `/projects/${project._id}/members`, memberForm, token);
      toast("Member added!", "success");
      setShowAddMember(false);
      setMemberForm({ email: "", role: "member" });
      loadMembers();
    } catch (e) { toast(e.message, "error"); }
    finally { setAddingMember(false); }
  };

  const createTask = async () => {
    if (!taskForm.title) return toast("Title is required", "error");
    setCreatingTask(true);
    try {
      await api("POST", `/projects/${project._id}/tasks`, taskForm, token);
      toast("Task created!", "success");
      setShowCreateTask(false);
      setTaskForm({ title: "", description: "", status: "todo", assignedTo: "" });
      loadTasks();
    } catch (e) { toast(e.message, "error"); }
    finally { setCreatingTask(false); }
  };

  const updateProject = async () => {
    try {
      await api("PUT", `/projects/${project._id}`, editForm, token);
      toast("Project updated!", "success");
      setShowEdit(false);
    } catch (e) { toast(e.message, "error"); }
  };

  const deleteProject = async () => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await api("DELETE", `/projects/${project._id}`, null, token);
      toast("Project deleted", "info");
      setPage("projects");
    } catch (e) { toast(e.message, "error"); }
    finally { setDeleting(false); }
  };

  const removeMember = async (userId) => {
    if (!confirm("Remove this member?")) return;
    try {
      await api("DELETE", `/projects/${project._id}/members/${userId}`, null, token);
      toast("Member removed", "info");
      loadMembers();
    } catch (e) { toast(e.message, "error"); }
  };

  const todoTasks = tasks.filter(t => t.status === "todo");
  const inProgressTasks = tasks.filter(t => t.status === "in_progress");
  const doneTasks = tasks.filter(t => t.status === "done");

  const taskStatusColor = { todo: "blue", in_progress: "amber", done: "green" };

  return (
    <div className="fade-in">
      <button onClick={() => setPage("projects")} style={{ background: "none", color: G.textMid, fontSize: 13, marginBottom: 20, display: "flex", alignItems: "center", gap: 6, fontFamily: G.body }}>
        ← Back to Projects
      </button>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ fontFamily: G.font, fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>{project?.name}</h2>
          {project?.description && <p style={{ color: G.textDim, marginTop: 6, maxWidth: 500 }}>{project.description}</p>}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Btn variant="ghost" size="sm" onClick={() => setShowEdit(true)}>Edit</Btn>
          <Btn variant="danger" size="sm" onClick={deleteProject} disabled={deleting}>{deleting ? <Spinner size={12} /> : "Delete"}</Btn>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${G.border}`, marginBottom: 24 }}>
        {["tasks", "members"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: "10px 18px", fontSize: 13, fontWeight: tab === t ? 700 : 400, color: tab === t ? G.accent : G.textMid, background: "none", borderBottom: tab === t ? `2px solid ${G.accent}` : "2px solid transparent", marginBottom: -1, transition: "all 0.15s", fontFamily: G.body, textTransform: "capitalize" }}>
            {t} {t === "tasks" ? `(${tasks.length})` : `(${members.length})`}
          </button>
        ))}
      </div>

      {tab === "tasks" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
            <Btn size="sm" onClick={() => setShowCreateTask(true)}>+ Add Task</Btn>
          </div>
          {loadingTasks ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><Spinner /></div>
          ) : tasks.length === 0 ? (
            <EmptyState icon="◻" message="No tasks yet. Add your first task!" action={<Btn size="sm" onClick={() => setShowCreateTask(true)}>Add Task</Btn>} />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {[["todo", "To Do", todoTasks], ["in_progress", "In Progress", inProgressTasks], ["done", "Done", doneTasks]].map(([status, label, items]) => (
                <div key={status}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <Badge label={label} color={taskStatusColor[status]} />
                    <span style={{ fontSize: 12, color: G.textDim }}>({items.length})</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {items.map(task => <TaskCard key={task._id} task={task} />)}
                    {items.length === 0 && <div style={{ padding: "20px", border: `1px dashed ${G.border}`, borderRadius: 10, textAlign: "center", color: G.textDim, fontSize: 12 }}>Empty</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "members" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
            <Btn size="sm" onClick={() => setShowAddMember(true)}>+ Add Member</Btn>
          </div>
          {loadingMembers ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><Spinner /></div>
          ) : members.length === 0 ? (
            <EmptyState icon="◯" message="No members yet." action={<Btn size="sm" onClick={() => setShowAddMember(true)}>Add Member</Btn>} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {members.map((m, i) => {
                const mu = m.user || {};
                const roleColor = { admin: "red", project_admin: "amber", member: "green" }[m.role] || "blue";
                return (
                  <Card key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <img src={mu.avatar?.url || `https://placehold.co/40x40`} alt="" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontFamily: G.font, fontSize: 14 }}>{mu.fullName || mu.username || "—"}</p>
                      <p style={{ fontSize: 12, color: G.textDim }}>@{mu.username}</p>
                    </div>
                    <Badge label={m.role?.replace("_", " ")} color={roleColor} />
                    <Btn variant="danger" size="sm" onClick={() => removeMember(mu._id)}>Remove</Btn>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Add Member Modal */}
      <Modal open={showAddMember} onClose={() => setShowAddMember(false)} title="Add Member">
        <Field label="Email *">
          <input type="email" placeholder="member@example.com" value={memberForm.email} onChange={e => setMemberForm({ ...memberForm, email: e.target.value })} />
        </Field>
        <Field label="Role *">
          <select value={memberForm.role} onChange={e => setMemberForm({ ...memberForm, role: e.target.value })}>
            <option value="member">Member</option>
            <option value="project_admin">Project Admin</option>
            <option value="admin">Admin</option>
          </select>
        </Field>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <Btn variant="ghost" onClick={() => setShowAddMember(false)}>Cancel</Btn>
          <Btn onClick={addMember} disabled={addingMember}>{addingMember ? <Spinner size={14} /> : "Add"}</Btn>
        </div>
      </Modal>

      {/* Create Task Modal */}
      <Modal open={showCreateTask} onClose={() => setShowCreateTask(false)} title="New Task">
        <Field label="Title *">
          <input placeholder="Task title" value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} />
        </Field>
        <Field label="Description">
          <textarea rows={3} placeholder="Describe the task..." value={taskForm.description} onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} style={{ resize: "vertical" }} />
        </Field>
        <Field label="Status">
          <select value={taskForm.status} onChange={e => setTaskForm({ ...taskForm, status: e.target.value })}>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </Field>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <Btn variant="ghost" onClick={() => setShowCreateTask(false)}>Cancel</Btn>
          <Btn onClick={createTask} disabled={creatingTask}>{creatingTask ? <Spinner size={14} /> : "Create"}</Btn>
        </div>
      </Modal>

      {/* Edit Project Modal */}
      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Edit Project">
        <Field label="Name *">
          <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
        </Field>
        <Field label="Description">
          <textarea rows={3} value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} style={{ resize: "vertical" }} />
        </Field>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <Btn variant="ghost" onClick={() => setShowEdit(false)}>Cancel</Btn>
          <Btn onClick={updateProject}>Save Changes</Btn>
        </div>
      </Modal>
    </div>
  );
};

// ─── TASK CARD ────────────────────────────────────────────────────────────────
const TaskCard = ({ task }) => {
  const statusColor = { todo: "blue", in_progress: "amber", done: "green" };
  return (
    <Card style={{ padding: 14 }}>
      <p style={{ fontWeight: 600, fontSize: 13, fontFamily: G.font, marginBottom: 6, lineHeight: 1.4 }}>{task.title}</p>
      {task.description && <p style={{ color: G.textDim, fontSize: 12, marginBottom: 10, lineHeight: 1.5 }}>{task.description}</p>}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
        {task.assignedTo && (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <img src={task.assignedTo.avatar?.url || `https://placehold.co/20x20`} alt="" style={{ width: 20, height: 20, borderRadius: "50%" }} />
            <span style={{ fontSize: 11, color: G.textDim }}>@{task.assignedTo.username}</span>
          </div>
        )}
        {task.attachments?.length > 0 && <span style={{ fontSize: 11, color: G.textDim }}>📎 {task.attachments.length}</span>}
      </div>
    </Card>
  );
};

// ─── MY TASKS PAGE ────────────────────────────────────────────────────────────
const MyTasksPage = () => {
  return (
    <div className="fade-in">
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: G.font, fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>My Tasks</h2>
        <p style={{ color: G.textDim, marginTop: 4 }}>Tasks assigned to you across all projects.</p>
      </div>
      <Card>
        <div style={{ textAlign: "center", padding: "40px 20px", color: G.textDim }}>
          <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>◻</div>
          <p>Task routes are not yet registered on the backend.</p>
          <p style={{ fontSize: 12, marginTop: 6 }}>Add <code style={{ background: G.surface, padding: "2px 6px", borderRadius: 4 }}>/api/v1/projects/:projectId/tasks</code> routes to see tasks here.</p>
        </div>
      </Card>
    </div>
  );
};

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
const ProfilePage = () => {
  const { user, token } = useAuth();
  const toast = useToast();
  const [pwForm, setPwForm] = useState({ oldPassword: "", newPassword: "" });
  const [changingPw, setChangingPw] = useState(false);
  const [resending, setResending] = useState(false);

  const changePassword = async () => {
    if (!pwForm.oldPassword || !pwForm.newPassword) return toast("Fill both fields", "error");
    setChangingPw(true);
    try {
      await api("POST", "/auth/change-password", pwForm, token);
      toast("Password changed!", "success");
      setPwForm({ oldPassword: "", newPassword: "" });
    } catch (e) { toast(e.message, "error"); }
    finally { setChangingPw(false); }
  };

  const resendVerification = async () => {
    setResending(true);
    try {
      await api("POST", "/auth/resend-email-verification", null, token);
      toast("Verification email sent!", "success");
    } catch (e) { toast(e.message, "error"); }
    finally { setResending(false); }
  };

  return (
    <div className="fade-in" style={{ maxWidth: 560 }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: G.font, fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>Profile</h2>
      </div>

      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <img src={user?.avatar?.url || `https://placehold.co/64x64`} alt="" style={{ width: 64, height: 64, borderRadius: "50%", border: `2px solid ${G.border}` }} />
          <div>
            <h3 style={{ fontFamily: G.font, fontWeight: 700, fontSize: 18 }}>{user?.fullName || user?.username}</h3>
            <p style={{ color: G.textDim, fontSize: 13 }}>@{user?.username}</p>
            <p style={{ color: G.textDim, fontSize: 13 }}>{user?.email}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Badge label={user?.isEmailVerified ? "Email Verified" : "Email Not Verified"} color={user?.isEmailVerified ? "green" : "amber"} />
        </div>
        {!user?.isEmailVerified && (
          <Btn variant="subtle" size="sm" onClick={resendVerification} disabled={resending} style={{ marginTop: 12 }}>
            {resending ? <Spinner size={12} /> : "Resend Verification Email"}
          </Btn>
        )}
      </Card>

      <Card>
        <h4 style={{ fontFamily: G.font, fontWeight: 700, marginBottom: 16 }}>Change Password</h4>
        <Field label="Current Password">
          <input type="password" placeholder="••••••••" value={pwForm.oldPassword} onChange={e => setPwForm({ ...pwForm, oldPassword: e.target.value })} />
        </Field>
        <Field label="New Password">
          <input type="password" placeholder="••••••••" value={pwForm.newPassword} onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} />
        </Field>
        <Btn onClick={changePassword} disabled={changingPw}>
          {changingPw ? <Spinner size={14} /> : "Update Password"}
        </Btn>
      </Card>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [authed, setAuthed] = useState(() => !!localStorage.getItem("pm_token"));
  const [page, setPage] = useState("dashboard");
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <>
      <style>{css}</style>
      <FontLoader />
      <ToastProvider>
        <AuthProvider onAuth={setAuthed}>
          {!authed ? (
            <AuthPage onSuccess={() => setAuthed(true)} />
          ) : (
            <AppShell
              page={page} setPage={setPage}
              selectedProject={selectedProject} setSelectedProject={setSelectedProject}
              onLogout={() => setAuthed(false)}
            />
          )}
        </AuthProvider>
      </ToastProvider>
    </>
  );
}

const AppShell = ({ page, setPage, selectedProject, setSelectedProject, onLogout }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => { await logout(); onLogout(); };

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard setPage={setPage} setSelectedProject={setSelectedProject} />;
      case "projects": return <ProjectsPage setPage={setPage} setSelectedProject={setSelectedProject} />;
      case "project-detail": return <ProjectDetail project={selectedProject} setPage={setPage} />;
      case "tasks": return <MyTasksPage />;
      case "profile": return <ProfilePage />;
      default: return <Dashboard setPage={setPage} setSelectedProject={setSelectedProject} />;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar page={page} setPage={p => { setPage(p); }} onLogout={handleLogout} user={user} />
      <main style={{ flex: 1, overflowY: "auto", padding: "32px 36px" }}>
        {renderPage()}
      </main>
    </div>
  );
};
