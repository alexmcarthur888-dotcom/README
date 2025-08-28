import React, { useEffect, useState } from "react";

// ------------------------------------------------------------
// SkillSwap – Single-file React prototype (ChatGPT-runnable)
// - Dark theme forced (no toggle)
// - Starter Tasks onboarding (3 tasks → +1 👑 each; tab disappears when done)
// - Pages: Overview, Marketplace, Post Task, Profile, Community, Safety, FAQ
// - Crown 👑 for tokens everywhere; red ❤️ counts; high-contrast text
// - Lock system:
//    • Grey overshadow on tabs (Overview, Marketplace, Post Task, Community) while Starter Tasks are active
//    • Post Task unlocks immediately after completing "Complete your profile" (s1)
//    • Lockable buttons/inputs show tooltip: "complete starter tasks to unlock"
// ------------------------------------------------------------

// -------------------- Utilities --------------------
const classNames = (...xs) => xs.filter(Boolean).join(" ");
const currency = (n) => `${n} 👑`;

const Badge = ({ children }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-200 px-3 py-1 text-xs font-medium">{children}</span>
);

const Tag = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 text-[11px] uppercase tracking-wide text-zinc-600 dark:text-zinc-300">{children}</span>
);

const Pill = ({ children }) => (
  <span className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs">{children}</span>
);

const Toast = ({ toast, onClose }) => (
  <div className={classNames("fixed left-1/2 -translate-x-1/2 bottom-6 z-50 w-[92%] sm:w-auto")}> 
    <div className="shadow-2xl rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 flex items-start gap-3">
      <div className="text-xl">{toast.icon || "✨"}</div>
      <div className="text-sm leading-5 text-zinc-700 dark:text-zinc-200">
        <div className="font-semibold mb-0.5">{toast.title}</div>
        {toast.body && <div className="opacity-90">{toast.body}</div>}
      </div>
      <button onClick={onClose} className="ml-auto text-zinc-500 hover:text-zinc-900 dark:hover:text-white">✖</button>
    </div>
  </div>
);

// Lockable button with grey overlay + tooltip
function LockButton({ locked, onClick, className = "", children, title }) {
  return (
    <div className="relative group inline-block">
      <button
        disabled={locked}
        onClick={locked ? undefined : onClick}
        className={classNames(
          "relative overflow-hidden",
          locked && "opacity-60 grayscale cursor-not-allowed",
          className
        )}
        title={locked ? "complete starter tasks to unlock" : title}
      >
        {locked && (
          <span className="pointer-events-none absolute inset-0 bg-zinc-900/30" />
        )}
        <span className="relative z-10">{children}</span>
      </button>
      {locked && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max max-w-[220px] px-3 py-1.5 rounded-lg bg-zinc-800 text-white text-xs shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none">
          complete starter tasks to unlock
        </div>
      )}
    </div>
  );
}

// Lockable field wrapper with grey overlay + tooltip (for inputs)
function LockField({ locked, children }) {
  return (
    <div className="relative group">
      {children}
      {locked && <div className="absolute inset-0 bg-zinc-900/30 rounded-xl z-10 pointer-events-none" />}
      {locked && (
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 w-max max-w-[240px] px-3 py-1.5 rounded-lg bg-zinc-800 text-white text-xs shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none">
          complete starter tasks to unlock
        </div>
      )}
    </div>
  );
}

// -------------------- App --------------------
export default function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => { document.documentElement.classList.remove("dark"); };
  }, []);

  const tabs = ["Overview", "Marketplace", "Post Task", "Profile", "Community", "Safety", "FAQ"];
  const [tab, setTab] = useState("Starter Tasks");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Account state
  const [myTokens, setMyTokens] = useState(120);
  const [myReputation, setMyReputation] = useState(4.7);
  const [streak] = useState(6);

  // Toasts
  const [toast, setToast] = useState(null);
  const notify = (t) => { setToast(t); setTimeout(() => setToast(null), 4000); };

  // Starter Tasks
  const [starterTasks, setStarterTasks] = useState([
    { id: "s1", title: "Complete your profile", desc: "Fill out your skills and bio on the Profile page.", done: false },
    { id: "s2", title: "Post your first task", desc: "Use the Post Task page to create a small request.", done: false },
    { id: "s3", title: "Reply in the community", desc: "Comment or like a post in the Community feed.", done: false },
  ]);
  const starterActive = starterTasks.some((t) => !t.done);
  // Unlock rule: once s1 is done, allow Post Task even if others remain
  const profileDone = starterTasks.find((t) => t.id === "s1")?.done;
  const communityDone = starterTasks.find((t) => t.id === "s2")?.done || false;// Start newcomers on Starter Tasks
  useEffect(() => { if (starterActive) setTab("Starter Tasks"); }, [starterActive]);

  const awardToken = () => setMyTokens((t) => t + 1);

  // When a user successfully posts their first task, auto-complete Starter Task s2 and unlock Community
  const handleFirstPost = () => {
    const s2 = starterTasks.find((t) => t.id === "s2");
    if (!s2?.done) {
      setStarterTasks((ts) => ts.map((t) => (t.id === "s2" ? { ...t, done: true } : t)));
      notify({ icon: "✅", title: "Starter task complete", body: "Community unlocked" });
    }
  };

  useEffect(() => {
    if (!starterActive && tab === "Starter Tasks") {
      notify({ icon: "🎉", title: "Starter pack complete!", body: "You earned 3 tokens. Welcome aboard!" });
      setTab("Overview");
    }
  }, [starterActive, tab]);

  const bg = 'bg-[radial-gradient(60rem_60rem_at_120%_-10%,#3b82f6_0%,#111827_55%,#09090b_100%)]';

  return (
    <div className={classNames("min-h-screen", bg, "transition-colors duration-500")}>      
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 shadow-lg grid place-items-center text-white font-black">S</div>
              <div>
                <div className="font-extrabold tracking-tight text-lg text-white">SkillSwap</div>
                <div className="text-[11px] uppercase tracking-wider text-zinc-400">Trade time, not money</div>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              {starterActive && (
                <button
                  onClick={() => setTab("Starter Tasks")}
                  className={classNames(
                    "px-3 py-2 rounded-xl text-sm font-semibold ring-2 ring-inset ring-violet-400/70 bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-fuchsia-500/20",
                    tab === "Starter Tasks" ? "text-white bg-zinc-900" : "text-violet-200 hover:bg-zinc-800"
                  )}
                  title="Complete these quick tasks to unlock everything"
                >
                  Starter Tasks <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-violet-600 text-white">NEW</span>
                </button>
              )}
              {tabs.map((t) => {
                // Tabs that show the grey overshadow while Starter Tasks are active
                const lockedTabs = [
                  "Overview",
                  "Marketplace",
                  ...(communityDone ? [] : ["Community"]),
                  ...(profileDone ? [] : ["Post Task"]),
                ]; // Profile intentionally not locked; Post Task unlocks after s1
                const isLockedTab = starterActive && lockedTabs.includes(t);
                const base = classNames(
                  "px-3 py-2 rounded-xl text-sm font-medium relative overflow-hidden",
                  tab === t ? "bg-zinc-100 text-black" : "text-zinc-300 hover:text-white hover:bg-zinc-800"
                );
                return (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={classNames(base, isLockedTab && "after:absolute after:inset-0 after:bg-zinc-900/25 after:pointer-events-none")}
                    title={isLockedTab ? "complete starter tasks to unlock" : undefined}
                  >
                    {t}
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 bg-black/20 border border-zinc-800 rounded-2xl px-2 py-1">
                <Pill>{currency(myTokens)}</Pill>
                <Pill>⭐ {myReputation.toFixed(1)}</Pill>
                <Pill>🔥 {streak}-day</Pill>
              </div>
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="md:hidden h-9 w-9 grid place-items-center rounded-xl border border-zinc-700 bg-black/20"
                aria-label="Open navigation"
              >☰</button>
            </div>
          </div>

          {/* Mobile nav */}
          {mobileNavOpen && (
            <div className="md:hidden pb-3 flex flex-wrap gap-2">
              {starterActive && (
                <button onClick={() => { setTab("Starter Tasks"); setMobileNavOpen(false); }}
                  className={classNames(
                    "px-3 py-1.5 rounded-xl text-sm",
                    tab === "Starter Tasks" ? "bg-zinc-100 text-black" : "bg-zinc-800 text-violet-200"
                  )}>
                  Starter Tasks
                </button>
              )}
              {tabs.map((t) => (
                <button key={t} onClick={() => { setTab(t); setMobileNavOpen(false); }}
                  className={classNames(
                    "px-3 py-1.5 rounded-xl text-sm",
                    tab === t ? "bg-zinc-100 text-black" : "bg-zinc-800 text-zinc-200"
                  )}>
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tab === "Overview" && (
          <Overview
            setTab={setTab}
            lockedPost={starterActive && !profileDone}
            lockedMarket={starterActive}
          />
        )}

        {tab === "Starter Tasks" && starterActive && (
          <StarterTasks tasks={starterTasks} setTasks={setStarterTasks} awardToken={awardToken} notify={notify} />
        )}

        {tab === "Marketplace" && <Marketplace notify={notify} locked={starterActive} />}

        {tab === "Post Task" && (
          <PostTask notify={notify} locked={starterActive && !profileDone} onFirstPost={handleFirstPost} />
        )}

        {tab === "Profile" && <Profile myTokens={myTokens} myReputation={myReputation} />}

        {tab === "Community" && <Community locked={starterActive && !communityDone} />}

        {tab === "Safety" && <Safety />}

        {tab === "FAQ" && <FAQ />}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="mt-10 rounded-3xl border border-zinc-800 bg-black/20 p-6 text-sm text-zinc-300 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>© {new Date().getFullYear()} SkillSwap — A safe way to trade skills with time tokens.</div>
          <div className="flex items-center gap-2">
            <Tag>Non-monetary</Tag>
            <Tag>Student-friendly</Tag>
            <Tag>Escrow</Tag>
            <Tag>Disputes</Tag>
          </div>
        </div>
      </footer>

      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

// -------------------- Sections --------------------

function Overview({ setTab, lockedPost, lockedMarket }) {
  return (
    <section>
      <div className="rounded-3xl overflow-hidden relative">
        <div className="absolute inset-0 -z-10 opacity-70" aria-hidden>
          <div className="absolute -top-20 -left-16 w-80 h-80 bg-indigo-400/40 blur-3xl rounded-full" />
          <div className="absolute -bottom-16 -right-8 w-80 h-80 bg-fuchsia-400/40 blur-3xl rounded-full" />
        </div>

        <div className="bg-black/20 border border-zinc-800 rounded-3xl p-8 md:p-12">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                Trade time, learn faster — <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">no money needed</span>
              </h1>
              <p className="mt-4 text-lg text-zinc-300 leading-relaxed">
                SkillSwap is a token‑based marketplace for kids, teens, and uni students. Earn tokens by helping with your skills, spend tokens when you need help. Escrow, disputes, and reputation keep it fair and safe.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Badge>Profiles & portfolios</Badge>
                <Badge>Marketplace with escrow</Badge>
                <Badge>Gamified progress</Badge>
                <Badge>Guardian options</Badge>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {/* Post a task button — white by default, purple on hover */}
                <LockButton
                  locked={lockedPost}
                  onClick={() => setTab("Post Task")}
                  className="px-5 py-3 rounded-2xl bg-white text-zinc-900 font-semibold shadow-lg transition hover:bg-gradient-to-r hover:from-indigo-500 hover:via-violet-500 hover:to-fuchsia-500 hover:text-white"
                >
                  Post a task
                </LockButton>
                <LockButton
                  locked={lockedMarket}
                  onClick={() => setTab("Marketplace")}
                  className="px-5 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold"
                >
                  Explore marketplace
                </LockButton>
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { t: "Design help", s: 22 },
                  { t: "Essay review", s: 12 },
                  { t: "Coding bugfix", s: 18 },
                  { t: "Maths tutoring", s: 15 },
                ].map((x, i) => (
                  <div key={i} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
                    <div className="text-sm text-zinc-400">{x.t}</div>
                    <div className="mt-2 text-2xl font-black text-white">{currency(x.s)}</div>
                    <div className="mt-3 h-2 rounded-full bg-zinc-800">
                      <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" style={{ width: `${Math.min(100, x.s)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {[
          { title: "Skill Exchange", body: "Post tasks, accept gigs, and trade time‑tokens using secure escrow.", icon: "🤝" },
          { title: "Reputation", body: "Ratings, badges, and streaks make good work visible and trustworthy.", icon: "⭐" },
          { title: "Safe for Students", body: "No money between users. Optional guardian oversight for under‑16s.", icon: "🛡️" },
        ].map((c, i) => (
          <div key={i} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <div className="text-3xl">{c.icon}</div>
            <div className="mt-3 text-lg font-semibold text-white">{c.title}</div>
            <p className="mt-1 text-sm text-zinc-300">{c.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function StarterTasks({ tasks, setTasks, awardToken, notify }) {
  const complete = (id) => {
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: true } : t)));
    awardToken();
    const remaining = tasks.filter((t) => !t.done && t.id !== id).length;
    notify({ icon: "✅", title: "+1 token earned", body: remaining ? `${remaining} starter task${remaining > 1 ? "s" : ""} left` : "All starter tasks complete!" });
  };
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
      <h2 className="text-xl font-bold text-white">Starter Tasks (earn 3 tokens)</h2>
      <p className="text-sm text-zinc-300 mt-1">Do these quick one‑hour tasks to learn the ropes. Each completion awards <strong className="text-white">1 👑</strong>.</p>
      <div className="mt-4 grid md:grid-cols-3 gap-4">
        {tasks.map((t) => (
          <div key={t.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 flex flex-col">
            <div className="text-sm text-zinc-400">~1 hour</div>
            <div className="mt-1 font-semibold text-white">{t.title}</div>
            <p className="mt-1 text-sm text-zinc-300">{t.desc}</p>
            <div className="mt-auto pt-3 flex items-center justify-between">
              <Badge>Reward: 1 👑</Badge>
              {t.done ? (
                <span className="text-emerald-400 font-semibold">Done</span>
              ) : (
                <button onClick={() => complete(t.id)} className="px-3 py-2 rounded-xl bg-white text-black text-sm font-semibold">Mark done</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Marketplace({ notify, locked }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", "Design", "Writing", "Coding", "Tutoring", "Music", "Video", "Other"];

  const [jobs, setJobs] = useState([
    { id: "p1", title: "Edit my 1000-word essay (grammar & flow)", tokens: 12, category: "Writing", tags: ["Proofread", "Fast"], requester: "Maya A.", time: "~1.0h", deadline: "Today, 8pm", status: "open", escrow: 0, notes: "Google Doc link will be shared in chat." },
    { id: "p2", title: "Fix a small JavaScript bug in my portfolio", tokens: 18, category: "Coding", tags: ["Frontend", "Bugfix"], requester: "Leo W.", time: "~1.5h", deadline: "Tomorrow, 2pm", status: "open", escrow: 0, notes: "Navbar not closing on route change." },
    { id: "p3", title: "Design a simple club logo (PNG + SVG)", tokens: 22, category: "Design", tags: ["Logo", "Vector"], requester: "Aisha K.", time: "~2h", deadline: "Aug 28", status: "open", escrow: 0, notes: "Include 2 colorways; playful vibe." },
    { id: "p4", title: "1 hour GCSE Maths tutoring (algebra)", tokens: 15, category: "Tutoring", tags: ["Maths", "Zoom"], requester: "Noah D.", time: "1h live", deadline: "Aug 27, 6pm", status: "open", escrow: 0, notes: "Need help with factorising." },
  ]);

  const filteredJobs = jobs.filter((j) => {
    const inCat = category === "All" || j.category === category;
    const inSearch = !search || [j.title, j.requester, j.tags.join(" ")].join(" ").toLowerCase().includes(search.toLowerCase());
    return inCat && inSearch && j.status === "open";
  });

  const startJob = (id) => {
    setJobs((prev) => prev.map((j) => j.id === id ? { ...j, status: "inprogress", escrow: j.tokens } : j));
    notify?.({ icon: "🔒", title: "Escrow locked", body: "Tokens are secured. Finish the work and deliver inside the project room." });
  };

  const deliverJob = (id) => {
    setJobs((prev) => prev.map((j) => j.id === id ? { ...j, status: "delivered" } : j));
    notify?.({ icon: "📦", title: "Work delivered", body: "Waiting for client confirmation or auto‑release in 24h." });
  };

  const confirmJob = (id) => {
    setJobs((prev) => prev.map((j) => j.id === id ? { ...j, status: "done" } : j));
    const job = jobs.find(j => j.id === id);
    notify?.({ icon: "✅", title: "Tokens released", body: job ? `${currency(job.tokens)} released` : "Nice!" });
  };

  const disputeJob = (id) => {
    setJobs((prev) => prev.map((j) => j.id === id ? { ...j, status: "disputed" } : j));
    notify?.({ icon: "🛡️", title: "Dispute opened", body: "A moderator will review deliverables. Escrow is frozen." });
  };

  const open = jobs.filter(j => j.status === "open");
  const inprogress = jobs.filter(j => j.status === "inprogress");
  const delivered = jobs.filter(j => j.status === "delivered");
  const done = jobs.filter(j => j.status === "done");
  const disputed = jobs.filter(j => j.status === "disputed");
  const [view, setView] = useState("Open");

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 rounded-2xl bg-zinc-900/40 border border-zinc-800 p-2 flex items-center gap-2">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects, tags, users…" className="flex-1 bg-transparent outline-none px-2 py-2 text-zinc-100 placeholder-zinc-400" />
          <div className="w-px h-6 bg-zinc-800" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-transparent px-2 py-2 text-sm outline-none text-zinc-200">
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          {[
            { k: "Open", n: open.length },
            { k: "In progress", n: inprogress.length },
            { k: "Delivered", n: delivered.length },
            { k: "Done", n: done.length },
            { k: "Disputed", n: disputed.length },
          ].map(x => (
            <button key={x.k} onClick={() => setView(x.k)} className={classNames(
              "px-3 py-2 rounded-xl text-sm font-medium",
              view === x.k ? "bg-zinc-100 text-black" : "bg-zinc-800 text-zinc-200"
            )}>
              {x.k} <span className="ml-1 opacity-70">({x.n})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        {(view === "Open" ? filteredJobs :
          view === "In progress" ? inprogress :
          view === "Delivered" ? delivered :
          view === "Done" ? done : disputed
        ).map((j) => (
          <article key={j.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-white leading-snug">{j.title}</h3>
              <div className="text-right">
                <div className="text-sm font-bold text-white">{currency(j.tokens)}</div>
                <div className="text-xs text-zinc-400">{j.time}</div>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <Tag>{j.category}</Tag>
              {j.tags.map((t, i) => <Tag key={i}>{t}</Tag>)}
              <span className="text-xs text-zinc-400">Deadline: {j.deadline}</span>
            </div>
            <p className="mt-3 text-sm text-zinc-300 line-clamp-3">{j.notes}</p>

            {j.status !== "open" && (
              <div className="mt-3 text-xs flex items-center gap-2">
                <Badge>Escrow: {currency(j.escrow)}</Badge>
                <Badge>Status: {j.status}</Badge>
              </div>
            )}

            <div className="mt-auto pt-4 flex items-center justify-between gap-2">
              <div className="text-xs text-zinc-400">By {j.requester}</div>
              <div className="flex items-center gap-2">
                {j.status === "open" && (
                  <LockButton locked={locked} onClick={() => startJob(j.id)} className="px-3 py-2 rounded-xl bg-white text-black text-sm font-semibold">Start job</LockButton>
                )}
                {j.status === "inprogress" && (
                  <LockButton locked={locked} onClick={() => deliverJob(j.id)} className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold">Deliver work</LockButton>
                )}
                {j.status === "delivered" && (
                  <>
                    <LockButton locked={locked} onClick={() => confirmJob(j.id)} className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold">Client confirm</LockButton>
                    <LockButton locked={locked} onClick={() => disputeJob(j.id)} className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold">Open dispute</LockButton>
                  </>
                )}
                {j.status === "done" && (
                  <span className="text-emerald-400 font-semibold">Completed</span>
                )}
                {j.status === "disputed" && (
                  <span className="text-amber-400 font-semibold">Under review</span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PostTask({ notify, locked, onFirstPost }) {
  const [form, setForm] = useState({ title: "", category: "Design", tokens: 10, details: "", deadline: "", quick: false });

  const submitAction = () => {
    notify?.({ icon: "🚀", title: "Task posted", body: form.title || "Untitled task" });
    onFirstPost?.();
    setForm({ title: "", category: "Design", tokens: 10, details: "", deadline: "", quick: false });
  };

  return (
    <section className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="text-xl font-bold text-white">Post a new task</h2>
        <p className="text-sm text-zinc-300 mt-1">Offer tokens for help. Tokens are time credits, not money.</p>
        <form onSubmit={(e) => { e.preventDefault(); if (!locked) submitAction(); }} className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-200">Title</label>
            <LockField locked={locked}>
              <input disabled={locked} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required placeholder="e.g., Design a logo for my study group" className="w-full rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-100 placeholder-zinc-400 px-3 py-2 outline-none" />
            </LockField>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-200">Category</label>
              <LockField locked={locked}>
                <select disabled={locked} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="w-full rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-100 px-3 py-2">
                  {["Design","Writing","Coding","Tutoring","Music","Video","Other"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </LockField>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-200">Tokens offered</label>
              <LockField locked={locked}>
                <input disabled={locked} type="number" min={1} value={form.tokens} onChange={(e) => setForm((f) => ({ ...f, tokens: e.target.value }))} className="w-full rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-100 px-3 py-2" />
              </LockField>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-200">Details</label>
            <LockField locked={locked}>
              <textarea disabled={locked} value={form.details} onChange={(e) => setForm((f) => ({ ...f, details: e.target.value }))} rows={5} placeholder="Describe the work, deliverables, and any references." className="w-full rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-100 placeholder-zinc-400 px-3 py-2" />
            </LockField>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-200">Deadline</label>
              <LockField locked={locked}>
                <input disabled={locked} value={form.deadline} onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))} placeholder="e.g., Aug 30, 6pm" className="w-full rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-100 placeholder-zinc-400 px-3 py-2" />
              </LockField>
            </div>
            <LockField locked={locked}>
              <label className="mt-6 inline-flex items-center gap-2 text-sm text-zinc-200">
                <input disabled={locked} type="checkbox" checked={form.quick} onChange={(e) => setForm((f) => ({ ...f, quick: e.target.checked }))} className="accent-indigo-600" />
                Mark as quick (≈1h)
              </label>
            </LockField>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <LockButton locked={locked} onClick={() => submitAction()} className="px-5 py-3 rounded-2xl bg-white text-black font-semibold">Post task</LockButton>
            <button type="reset" onClick={() => setForm({ title: "", category: "Design", tokens: 10, details: "", deadline: "", quick: false })} className="px-5 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold">Clear</button>
          </div>
        </form>
      </div>

      <aside className="lg:col-span-2 space-y-6">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h3 className="font-semibold text-white">Tips for great posts</h3>
          <ul className="mt-3 text-sm list-disc pl-5 space-y-2 text-zinc-300">
            <li>Be specific about deliverables and style.</li>
            <li>Attach references or examples inside the project room.</li>
            <li>Offer fair tokens for time and complexity.</li>
            <li>Set realistic deadlines and availability windows.</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h3 className="font-semibold text-white">How escrow works</h3>
          <p className="mt-2 text-sm text-zinc-300">Tokens are locked when you accept a bid. After delivery, tokens auto‑release in 24h unless you open a dispute.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge>Secure</Badge>
            <Badge>Transparent</Badge>
            <Badge>Dispute‑ready</Badge>
          </div>
        </div>
      </aside>
    </section>
  );
}

function Profile({ myTokens, myReputation }) {
  const skills = [
    { name: "Design", level: 86 },
    { name: "Writing", level: 72 },
    { name: "Coding", level: 64 },
    { name: "Tutoring", level: 35 },
  ];
  const badges = ["Rising Talent", "Trusted", "100+ hrs", "Early Adopter"];
  return (
    <section className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white grid place-items-center font-black text-2xl">A</div>
          <div>
            <div className="text-xl font-bold text-white">Alex M.</div>
            <div className="text-sm text-zinc-300">Brighton • Student • Open for work</div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Pill>{currency(myTokens)}</Pill>
            <Pill>⭐ {myReputation.toFixed(1)}</Pill>
          </div>
        </div>
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          {skills.map((s) => (
            <div key={s.name} className="rounded-2xl border border-zinc-800 p-4">
              <div className="flex justify-between text-sm text-white">
                <div className="font-medium">{s.name}</div>
                <div className="opacity-70">{s.level}%</div>
              </div>
              <div className="mt-2 h-2 rounded-full bg-zinc-800">
                <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" style={{ width: `${s.level}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <div className="text-sm font-semibold text-white">Badges</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {badges.map((b, i) => <Badge key={i}>{b}</Badge>)}
          </div>
        </div>
      </div>
      <aside className="space-y-6">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h3 className="font-semibold text-white">About me</h3>
          <p className="mt-2 text-sm text-zinc-300">I love clean design, quick turnarounds, and helping classmates ship projects. DM me for logos, slide decks, and front‑end tweaks!</p>
        </div>
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h3 className="font-semibold text-white">Availability</h3>
          <ul className="mt-2 text-sm text-zinc-300 space-y-1">
            <li>Mon–Fri: 6–9pm</li>
            <li>Sat: 10am–4pm</li>
            <li>Sun: Occasional</li>
          </ul>
        </div>
      </aside>
    </section>
  );
}

function Community({ locked }) {
  const [posts, setPosts] = useState([
    { id: 1, user: "Maya", text: "Just finished a poster design swap – love this community!", likes: 8 },
    { id: 2, user: "Omar", text: "Anyone up for a weekly coding bugfix hour?", likes: 5 },
    { id: 3, user: "Aisha", text: "Shared my logo process as a tutorial – check it out.", likes: 12 },
  ]);
  const [draft, setDraft] = useState("");

  return (
    <section className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="text-xl font-bold text-white">Community feed</h2>
        <div className="mt-4 space-y-4">
          {posts.map(p => (
            <div key={p.id} className="rounded-2xl border border-zinc-800 p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white grid place-items-center font-bold">{p.user[0]}</div>
                <div className="font-medium text-white">{p.user}</div>
                <LockButton locked={locked} onClick={()=>setPosts(ps=>ps.map(x=>x.id===p.id?{...x,likes:x.likes+1}:x))} className="ml-auto text-sm px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700">
                  <span className="text-rose-500">❤️ {p.likes}</span>
                </LockButton>
              </div>
              <p className="mt-2 text-sm text-zinc-300">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
      <aside className="space-y-6">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h3 className="font-semibold text-white">Post to feed</h3>
          <textarea value={draft} onChange={(e)=>setDraft(e.target.value)} rows={4} placeholder="Share progress, ask for help, or start a challenge…" className="w-full rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-100 placeholder-zinc-400 px-3 py-2" />
          <div className="mt-3 flex justify-end">
            <LockButton locked={locked} onClick={()=>{ if(!draft.trim()) return; setPosts(ps=>[{ id:Date.now(), user:"You", text:draft.trim(), likes:0 }, ...ps]); setDraft(""); }} className="px-4 py-2 rounded-xl bg-white text-black disabled:opacity-40">Post</LockButton>
          </div>
        </div>
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h3 className="font-semibold text-white">Trending tags</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {["logo","essay","bugfix","maths","video","guitar"].map(t=> <Tag key={t}>#{t}</Tag>)}
          </div>
        </div>
      </aside>
    </section>
  );
}

function Safety() {
  const items = [
    { t: "Escrow by default", d: "Tokens lock when a job starts and release on approval or auto‑release after 24h." },
    { t: "Dispute resolution", d: "Open a dispute and a moderator reviews deliverables. Escrow stays frozen." },
    { t: "Verification", d: "Email/phone and optional school/uni domain checks reduce fake accounts." },
    { t: "Guardian options", d: "For under‑16s, guardians can view activity and set limits." },
    { t: "No real‑money transfers", d: "Tokens are time credits — safer and student‑friendly." },
  ];
  return (
    <section className="grid md:grid-cols-2 gap-6">
      {items.map((it, i) => (
        <div key={i} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <div className="text-lg font-semibold text-white">{it.t}</div>
          <p className="mt-2 text-sm text-zinc-300">{it.d}</p>
          <div className="mt-4 flex gap-2">
            <Badge>Safe</Badge>
            <Badge>Transparent</Badge>
          </div>
        </div>
      ))}
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "What are tokens?", a: "Tokens are time credits you earn by helping others and spend when you need help. They are not money and cannot be cashed out." },
    { q: "How do disputes work?", a: "If delivery isn’t as agreed, open a dispute. A moderator reviews evidence and decides. Escrow remains locked during review." },
    { q: "Is this safe for kids?", a: "Yes. Verification, content moderation, and optional guardian oversight create a safe environment." },
    { q: "How do I build reputation?", a: "Do good work on time, communicate well, and collect positive ratings. Streaks and badges help highlight consistency." },
    { q: "Can I use real money?", a: "No person-to-person cash. Monetization is via optional boosters and cosmetics, not user payments to each other." },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="max-w-3xl">
      {faqs.map((f, i) => (
        <div key={i} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 mb-3">
          <button onClick={()=>setOpen(open===i? -1 : i)} className="w-full text-left flex items-center justify-between">
            <div className="font-semibold text-white">{f.q}</div>
            <div className="text-xl text-white">{open===i? "–" : "+"}</div>
          </button>
          {open===i && <p className="mt-3 text-sm text-zinc-300">{f.a}</p>}
        </div>
      ))}
    </section>
  );
}
