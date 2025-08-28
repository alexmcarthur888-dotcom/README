diff --git a/skill_swap_token_marketplace_for_students_single_file_react_prototype (6).jsx	 b/index.tsx
index ac35aeeabcc37af84c2751ca88821c44deb49936..7006d0c006ee7ea168764b45212539697289bae3 100644
--- a/skill_swap_token_marketplace_for_students_single_file_react_prototype (6).jsx	
+++ b/index.tsx
@@ -1,32 +1,33 @@
 import React, { useEffect, useState } from "react";
+import { createRoot } from "react-dom/client";
 
 // ------------------------------------------------------------
-// SkillSwap – Single-file React prototype (ChatGPT-runnable)
+// TaskSwap – Single-file React prototype (ChatGPT-runnable)
 // - Dark theme forced (no toggle)
 // - Starter Tasks onboarding (3 tasks → +1 👑 each; tab disappears when done)
-// - Pages: Overview, Marketplace, Post Task, Profile, Community, Safety, FAQ
+// - Pages: Overview, Marketplace, Post Task, Profile, Community, Premium, Safety, FAQ
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
diff --git a/skill_swap_token_marketplace_for_students_single_file_react_prototype (6).jsx	 b/index.tsx
index ac35aeeabcc37af84c2751ca88821c44deb49936..7006d0c006ee7ea168764b45212539697289bae3 100644
--- a/skill_swap_token_marketplace_for_students_single_file_react_prototype (6).jsx	
+++ b/index.tsx
@@ -63,57 +64,57 @@ function LockButton({ locked, onClick, className = "", children, title }) {
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
-export default function App() {
+function App() {
   useEffect(() => {
     document.documentElement.classList.add("dark");
     return () => { document.documentElement.classList.remove("dark"); };
   }, []);
 
-  const tabs = ["Overview", "Marketplace", "Post Task", "Profile", "Community", "Safety", "FAQ"];
+  const tabs = ["Overview", "Marketplace", "Post Task", "Profile", "Community", "Safety", "FAQ", "Premium"];
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
diff --git a/skill_swap_token_marketplace_for_students_single_file_react_prototype (6).jsx	 b/index.tsx
index ac35aeeabcc37af84c2751ca88821c44deb49936..7006d0c006ee7ea168764b45212539697289bae3 100644
--- a/skill_swap_token_marketplace_for_students_single_file_react_prototype (6).jsx	
+++ b/index.tsx
@@ -121,202 +122,220 @@ export default function App() {
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
-              <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 shadow-lg grid place-items-center text-white font-black">S</div>
+              <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 shadow-lg grid place-items-center text-white font-black">T</div>
               <div>
-                <div className="font-extrabold tracking-tight text-lg text-white">SkillSwap</div>
+                <div className="font-extrabold tracking-tight text-lg text-white">TaskSwap</div>
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
-              {tabs.map((t) => {
-                // Tabs that show the grey overshadow while Starter Tasks are active
-                const lockedTabs = [
-                  "Overview",
-                  "Marketplace",
-                  ...(communityDone ? [] : ["Community"]),
-                  ...(profileDone ? [] : ["Post Task"]),
-                ]; // Profile intentionally not locked; Post Task unlocks after s1
-                const isLockedTab = starterActive && lockedTabs.includes(t);
-                const base = classNames(
-                  "px-3 py-2 rounded-xl text-sm font-medium relative overflow-hidden",
-                  tab === t ? "bg-zinc-100 text-black" : "text-zinc-300 hover:text-white hover:bg-zinc-800"
-                );
-                return (
-                  <button
-                    key={t}
-                    onClick={() => setTab(t)}
-                    className={classNames(base, isLockedTab && "after:absolute after:inset-0 after:bg-zinc-900/25 after:pointer-events-none")}
-                    title={isLockedTab ? "complete starter tasks to unlock" : undefined}
-                  >
-                    {t}
-                  </button>
-                );
-              })}
+                {tabs.map((t) => {
+                  // Tabs that show the grey overshadow while Starter Tasks are active
+                  const lockedTabs = [
+                    "Overview",
+                    "Marketplace",
+                    ...(communityDone ? [] : ["Community"]),
+                    ...(profileDone ? [] : ["Post Task"]),
+                  ]; // Profile intentionally not locked; Post Task unlocks after s1
+                  const isLockedTab = starterActive && lockedTabs.includes(t);
+                  const isPremium = t === "Premium";
+                  const base = classNames(
+                    "px-3 py-2 rounded-xl text-sm font-medium relative overflow-hidden",
+                    isPremium
+                      ? tab === t
+                        ? "bg-yellow-500 text-black ring-2 ring-yellow-400"
+                        : "text-yellow-300 ring-2 ring-yellow-400 hover:bg-yellow-500/20 hover:text-yellow-200"
+                      : tab === t
+                        ? "bg-zinc-100 text-black"
+                        : "text-zinc-300 hover:text-white hover:bg-zinc-800"
+                  );
+                  return (
+                    <button
+                      key={t}
+                      onClick={() => setTab(t)}
+                      className={classNames(base, isLockedTab && "after:absolute after:inset-0 after:bg-zinc-900/25 after:pointer-events-none")}
+                      title={isLockedTab ? "complete starter tasks to unlock" : undefined}
+                    >
+                      {t}
+                    </button>
+                  );
+                })}
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
-              {tabs.map((t) => (
-                <button key={t} onClick={() => { setTab(t); setMobileNavOpen(false); }}
-                  className={classNames(
-                    "px-3 py-1.5 rounded-xl text-sm",
-                    tab === t ? "bg-zinc-100 text-black" : "bg-zinc-800 text-zinc-200"
-                  )}>
-                  {t}
-                </button>
-              ))}
+              {tabs.map((t) => {
+                const isPremium = t === "Premium";
+                const cls = classNames(
+                  "px-3 py-1.5 rounded-xl text-sm",
+                  isPremium
+                    ? tab === t
+                      ? "bg-yellow-500 text-black ring-2 ring-yellow-400"
+                      : "bg-zinc-900 text-yellow-300 ring-2 ring-yellow-400"
+                    : tab === t
+                      ? "bg-zinc-100 text-black"
+                      : "bg-zinc-800 text-zinc-200"
+                );
+                return (
+                  <button key={t} onClick={() => { setTab(t); setMobileNavOpen(false); }} className={cls}>
+                    {t}
+                  </button>
+                );
+              })}
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
+
+        {tab === "Premium" && <Premium />}
       </main>
 
       {/* Footer */}
       <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
         <div className="mt-10 rounded-3xl border border-zinc-800 bg-black/20 p-6 text-sm text-zinc-300 flex flex-col sm:flex-row items-center justify-between gap-3">
-          <div>© {new Date().getFullYear()} SkillSwap — A safe way to trade skills with time tokens.</div>
+          <div>© {new Date().getFullYear()} TaskSwap — A safe way to trade skills with time tokens.</div>
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
-                SkillSwap is a token‑based marketplace for kids, teens, and uni students. Earn tokens by helping with your skills, spend tokens when you need help. Escrow, disputes, and reputation keep it fair and safe.
+                TaskSwap is a token‑based marketplace for kids, teens, and uni students. Earn tokens by helping with your skills, spend tokens when you need help. Escrow, disputes, and reputation keep it fair and safe.
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
diff --git a/skill_swap_token_marketplace_for_students_single_file_react_prototype (6).jsx	 b/index.tsx
index ac35aeeabcc37af84c2751ca88821c44deb49936..7006d0c006ee7ea168764b45212539697289bae3 100644
--- a/skill_swap_token_marketplace_for_students_single_file_react_prototype (6).jsx	
+++ b/index.tsx
@@ -695,72 +714,122 @@ function Community({ locked }) {
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
 
+function Premium() {
+  const plans = [
+    { name: "Bronze", price: "5 👑", features: ["Priority support", "Bronze badge"] },
+    { name: "Silver", price: "15 👑", features: ["All Bronze perks", "Highlighted listings", "2x reputation gain"] },
+    { name: "Gold", price: "30 👑", features: ["All Silver perks", "Front-page feature", "Exclusive tasks"] },
+  ];
+  const sparkles = [
+    { top: "10%", left: "15%" },
+    { top: "30%", left: "70%" },
+    { top: "60%", left: "40%" },
+    { top: "80%", left: "80%" },
+    { top: "50%", left: "10%" },
+  ];
+  return (
+    <section className="relative">
+      <div className="absolute inset-0 pointer-events-none overflow-hidden">
+        {sparkles.map((s, i) => (
+          <span
+            key={i}
+            className="absolute text-yellow-300 animate-ping"
+            style={{ top: s.top, left: s.left, animationDelay: `${i * 0.4}s` }}
+          >
+            ✦
+          </span>
+        ))}
+      </div>
+      <h2 className="text-3xl font-black text-center text-yellow-400 mb-8">Premium Upgrades</h2>
+      <div className="grid md:grid-cols-3 gap-6 relative">
+        {plans.map((p) => (
+          <div key={p.name} className="rounded-3xl border-2 border-yellow-400 bg-zinc-900/40 p-6 text-center">
+            <h3 className="text-xl font-bold text-yellow-300">{p.name}</h3>
+            <div className="mt-2 text-2xl font-black text-white">{p.price}</div>
+            <ul className="mt-4 text-sm text-zinc-300 space-y-1">
+              {p.features.map((f, i) => (
+                <li key={i}>• {f}</li>
+              ))}
+            </ul>
+            <button className="mt-6 w-full px-4 py-2 rounded-xl bg-yellow-500 text-black font-semibold hover:bg-yellow-400">
+              Choose {p.name}
+            </button>
+          </div>
+        ))}
+      </div>
+    </section>
+  );
+}
+
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
+
+const root = createRoot(document.getElementById('root') as HTMLElement);
+root.render(<App />);

