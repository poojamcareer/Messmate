import { useState, useEffect } from "react";
import "./features.css";
import "./admin.css";
import RoomsView from "./RoomsView";
import { TOTAL_STUDENTS, countSkipped } from "./roomData";


const mealTypes = ["BREAKFAST", "LUNCH", "DINNER"];
const mealLabels = {
  BREAKFAST: "🍳 Breakfast",
  LUNCH: "🍛 Lunch",
  DINNER: "🌙 Dinner",
};

const announceTypes = {
  "special-meal": { icon: "🎉", label: "Special meal", urgent: false },
  "special-snack": { icon: "🍪", label: "Special snack", urgent: false },
  "food-over": { icon: "⚠️", label: "Food over", urgent: true },
  emergency: { icon: "🚫", label: "Mess closed (emergency)", urgent: true },
};

const quickAlerts = [
  { label: "⚠️ Food over", type: "food-over", title: "Food over",
    message: "Today's food has finished. More is being prepared, please wait." },
  { label: "🚫 Mess closed", type: "emergency", title: "Mess closed",
    message: "The mess is closed due to an emergency. We will update you as soon as it reopens." },
];

// Mock numbers for the UI. Later these come from your Java API.
const todayStats = ["BREAKFAST", "LUNCH", "DINNER"].map((type) => ({
  type,
  skipped: countSkipped(type),
}));

const weekStats = [
  { day: "Mon", b: 104, l: 111, d: 99 },
  { day: "Tue", b: 108, l: 112, d: 102 },
  { day: "Wed", b: 101, l: 110, d: 96 },
  { day: "Thu", b: 99, l: 115, d: 94 },
  { day: "Fri", b: 95, l: 108, d: 88 },
  { day: "Sat", b: 90, l: 102, d: 80 },
  { day: "Sun", b: 84, l: 98, d: 76 },
];

const topMeals = [
  { name: "Veg biryani", likes: 58 },
  { name: "Dosa with chutney", likes: 47 },
  { name: "Paneer curry", likes: 41 },
  { name: "Idli and sambar", likes: 36 },
  { name: "Lemon rice", likes: 12 },
];

function isoDate(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("en-CA"); // YYYY-MM-DD in local time
}

function prettyDate(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short",
  });
}

const initialMenus = [
  { id: 1, date: isoDate(0), mealType: "BREAKFAST", items: "Idli, Sambar, Coconut chutney, Tea", special: false },
  { id: 2, date: isoDate(0), mealType: "LUNCH", items: "Rice, Dal fry, Potato poriyal, Curd", special: false },
  { id: 3, date: isoDate(0), mealType: "DINNER", items: "Chapati, Paneer curry, Rice, Banana", special: false },
  { id: 4, date: isoDate(1), mealType: "LUNCH", items: "Veg biryani, Raita, Payasam", special: true },
];

const initialAnnouncements = [
  { id: 1, type: "special-snack", title: "Special snack this evening",
    message: "Hot samosa and tea at 5:00 PM.", time: "Today, 2:30 PM" },
  { id: 2, type: "emergency", title: "Mess closed",
    message: "Dinner service was cancelled due to a power failure.", time: "9 Oct, 6:10 PM" },
];

const initialComplaints = [
  { id: 1, author: "Anitha", room: "A-112", category: "Hygiene",
    text: "The wash area in the dining hall was not clean at dinner yesterday.",
    time: "11 Oct, 8:40 pm", agrees: 12, status: "Open" },
  { id: 2, author: "Karthik", room: "C-305", category: "Timing",
    text: "Breakfast ran out by 8:30 AM. Can we increase the quantity or extend the serving time?",
    time: "10 Oct, 8:55 am", agrees: 27, status: "Resolved" },
  { id: 3, author: "Divya", room: "B-118", category: "Quantity",
    text: "Curd is not enough for everyone at lunch. Please add more.",
    time: "12 Oct, 1:20 pm", agrees: 8, status: "Open" },
];

/* ---------- Overview ---------- */
function Overview({ openComplaints }) {
  const maxVal = Math.max(...weekStats.flatMap((w) => [w.b, w.l, w.d]));
  const maxLikes = Math.max(...topMeals.map((m) => m.likes));
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long",
  });

  return (
    <>
      <section className="hero">
        <h2>Today's Headcount</h2>
        <p>{today} · {TOTAL_STUDENTS} students enrolled</p>
      </section>

      <div className="stat-grid">
        {todayStats.map((s) => {
          const expected = TOTAL_STUDENTS - s.skipped;
          const pct = Math.round((expected / TOTAL_STUDENTS) * 100);
          return (
            <div className="stat-card" key={s.type}>
              <span className="stat-label">{mealLabels[s.type]}</span>
              <strong className="stat-number">{expected}</strong>
              <span className="stat-sub">students expected · {s.skipped} skipped</span>
              <div className="progress"><div style={{ width: `${pct}%` }} /></div>
            </div>
          );
        })}

        <div className="stat-card alert-card">
          <span className="stat-label">📢 Open complaints</span>
          <strong className="stat-number">{openComplaints}</strong>
          <span className="stat-sub">waiting for a response</span>
        </div>
      </div>

      <div className="two-col">
        <div className="setting-card">
          <h3>📊 Expected headcount this week</h3>
          <div className="legend">
            <span className="lg b">Breakfast</span>
            <span className="lg l">Lunch</span>
            <span className="lg d">Dinner</span>
          </div>
          <div className="chart">
            {weekStats.map((w) => (
              <div className="chart-col" key={w.day}>
                <div className="bars">
                  <div className="bar b" style={{ height: `${(w.b / maxVal) * 100}%` }} title={`Breakfast ${w.b}`} />
                  <div className="bar l" style={{ height: `${(w.l / maxVal) * 100}%` }} title={`Lunch ${w.l}`} />
                  <div className="bar d" style={{ height: `${(w.d / maxVal) * 100}%` }} title={`Dinner ${w.d}`} />
                </div>
                <span className="chart-day">{w.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="setting-card">
          <h3>❤️ Meal reactions</h3>
          {topMeals.map((m) => (
            <div className="like-row" key={m.name}>
              <span>{m.name}</span>
              <div className="like-track"><div style={{ width: `${(m.likes / maxLikes) * 100}%` }} /></div>
              <strong>{m.likes}</strong>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ---------- Menu manager ---------- */
function MenuManager({ menus, onSave, onDelete }) {
  const [date, setDate] = useState(isoDate(0));
  const [mealType, setMealType] = useState("BREAKFAST");
  const [items, setItems] = useState("");
  const [special, setSpecial] = useState(false);
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!date) { setError("Please choose a date."); return; }
    if (!items.trim()) { setError("Please enter the menu items."); return; }
    setError("");
    onSave({ date, mealType, items: items.trim(), special });
    setItems("");
    setSpecial(false);
  }

  const sorted = [...menus].sort(
    (a, b) => a.date.localeCompare(b.date) ||
              mealTypes.indexOf(a.mealType) - mealTypes.indexOf(b.mealType)
  );

  return (
    <section>
      <div className="section-head">
        <h2>Menu</h2>
        <p>Students see next week's menu from Saturday evening. Saving the same date and meal again updates it.</p>
      </div>

      <form className="post-box" onSubmit={submit}>
        <div className="form-row">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
            {mealTypes.map((m) => (
              <option key={m} value={m}>{mealLabels[m]}</option>
            ))}
          </select>
        </div>
        <textarea rows={2} placeholder="Menu items, separated by commas (Rice, Sambar, Poriyal)"
                  value={items} onChange={(e) => setItems(e.target.value)} />
        <label className="check">
          <input type="checkbox" checked={special} onChange={(e) => setSpecial(e.target.checked)} />
          Mark as a special meal
        </label>
        {error && <p className="field-error">{error}</p>}
        <button type="submit" className="post-btn">Save menu</button>
      </form>

      <div className="table-wrap">
        <table className="week-table">
          <thead>
            <tr><th>Date</th><th>Meal</th><th>Items</th><th></th></tr>
          </thead>
          <tbody>
            {sorted.map((m) => (
              <tr key={m.id}>
                <td className="day">{prettyDate(m.date)}</td>
                <td>{mealLabels[m.mealType]}</td>
                <td>{m.items} {m.special && <span className="badge">Special</span>}</td>
                <td><button className="del-btn" onClick={() => onDelete(m.id)} aria-label="Delete">🗑️</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ---------- Announcements ---------- */
function Announcements({ sent, onSend }) {
  const [type, setType] = useState("special-meal");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function quick(q) {
    setType(q.type);
    setTitle(q.title);
    setMessage(q.message);
    setError("");
  }

  function submit(e) {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setError("Please add a title and a message.");
      return;
    }
    setError("");
    onSend({ type, title: title.trim(), message: message.trim() });
    setTitle("");
    setMessage("");
  }

  return (
    <section>
      <div className="section-head">
        <h2>Announcements</h2>
        <p>Students get these in their notification bell. Urgent ones also show a red alert bar.</p>
      </div>

      <form className="post-box" onSubmit={submit}>
        <span className="label">Emergency? One tap to fill the form:</span>
        <div className="quick-row">
          {quickAlerts.map((q) => (
            <button type="button" key={q.type} className="quick-btn" onClick={() => quick(q)}>
              {q.label}
            </button>
          ))}
        </div>

        <select value={type} onChange={(e) => setType(e.target.value)}>
          {Object.entries(announceTypes).map(([key, t]) => (
            <option key={key} value={key}>{t.icon} {t.label}</option>
          ))}
        </select>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea rows={3} placeholder="Message for students..."
                  value={message} onChange={(e) => setMessage(e.target.value)} />
        {error && <p className="field-error">{error}</p>}
        <button type="submit" className="post-btn">Send to all students</button>
      </form>

      <div className="setting-card">
        <h3>Sent announcements</h3>
        {sent.map((a) => {
          const t = announceTypes[a.type];
          return (
            <div className="ann-item" key={a.id}>
              <span className="notif-icon">{t.icon}</span>
              <div>
                <strong>{a.title}</strong>{" "}
                <span className={`tag ${t.urgent ? "tag-urgent" : ""}`}>{t.label}</span>
                <p>{a.message}</p>
                <span className="meta">{a.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- Complaints ---------- */
function ComplaintsAdmin({ items, onToggle }) {
  const [filter, setFilter] = useState("All");
  const shown = items.filter((c) => filter === "All" || c.status === filter);

  return (
    <section>
      <div className="section-head">
        <h2>Complaints</h2>
        <p>Everything students post on the complaint board appears here.</p>
      </div>

      <div className="chips">
        {["All", "Open", "Resolved"].map((f) => (
          <button key={f} className={filter === f ? "chip active" : "chip"} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      <div className="posts">
        {shown.length === 0 && <p className="empty">Nothing here.</p>}
        {shown.map((c) => (
          <div className="post" key={c.id}>
            <div className="post-head">
              <span className="avatar">{c.author[0]}</span>
              <div>
                <strong>{c.author}</strong>
                <span className="meta"> · Room {c.room} · {c.time}</span>
              </div>
              <span className={`status ${c.status.toLowerCase()}`}>{c.status}</span>
            </div>
            <span className="tag">{c.category}</span>
            <p className="post-text">{c.text}</p>
            <div className="post-foot">
              <span className="meta">👥 {c.agrees} students agree</span>
              <button className={c.status === "Open" ? "resolve-btn" : "reopen-btn"}
                      onClick={() => onToggle(c.id)}>
                {c.status === "Open" ? "✔ Mark resolved" : "↩ Reopen"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Main admin app ---------- */
export default function AdminApp({ onLogout }) {
  const [tab, setTab] = useState("overview");
  const [menus, setMenus] = useState(initialMenus);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [complaints, setComplaints] = useState(initialComplaints);

  // Use the same theme the user picked in Settings
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("messmate-settings")) || {};
      document.documentElement.setAttribute("data-theme", s.theme || "light");
      document.documentElement.setAttribute("data-accent", s.accent || "orange");
    } catch {
      /* ignore */
    }
  }, []);

  const openCount = complaints.filter((c) => c.status === "Open").length;

  function saveMenu(entry) {
    setMenus((prev) => [
      ...prev.filter((m) => !(m.date === entry.date && m.mealType === entry.mealType)),
      { ...entry, id: Date.now() },
    ]);
  }

  function deleteMenu(id) {
    setMenus((prev) => prev.filter((m) => m.id !== id));
  }

  function sendAnnouncement({ type, title, message }) {
    const time = new Date().toLocaleString("en-IN", {
      day: "numeric", month: "short", hour: "numeric", minute: "2-digit",
    });
    setAnnouncements((prev) => [{ id: Date.now(), type, title, message, time }, ...prev]);
  }

  function toggleComplaint(id) {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === "Open" ? "Resolved" : "Open" } : c))
    );
  }

  const tabs = [
    ["overview", "📊 Overview"],
    ["rooms", "🏠 Rooms"],
    ["menu", "🍽️ Menu"],
    ["announcements", "📣 Announcements"],
    ["complaints", `📢 Complaints (${openCount})`],
  ];

  return (
    <div className="app">
      <header className="navbar">
        <h1 className="brand">🍽️ MessMate <span className="admin-pill">Admin</span></h1>
        <div className="nav-right">
          <div className="admin-chip">
            <span className="avatar">A</span>
            <span className="profile-name">Mess Admin</span>
          </div>
          <button className="admin-logout" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <div className="tabs">
        {tabs.map(([id, label]) => (
          <button key={id} className={tab === id ? "tab active" : "tab"} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>

      <main>
        {tab === "overview" && <Overview openComplaints={openCount} />}
        {tab === "menu" && <MenuManager menus={menus} onSave={saveMenu} onDelete={deleteMenu} />}
        {tab === "announcements" && <Announcements sent={announcements} onSend={sendAnnouncement} />}
        {tab === "complaints" && <ComplaintsAdmin items={complaints} onToggle={toggleComplaint} />}
        {tab === "rooms" && <RoomsView />}
      </main>
    </div>
  );
}