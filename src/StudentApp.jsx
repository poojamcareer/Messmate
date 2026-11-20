import { useState, useEffect } from "react";
import "./features.css";
import ProfilePage from "./ProfilePage";
const defaultUser = {
  name: "Student",
  email: "student@college.edu",
  phone: "+91 98765 43210",
  room: "204",
};

function loadProfile() {
  try {
    return { ...defaultUser, ...JSON.parse(localStorage.getItem("messmate-profile")) };
  } catch {
    return defaultUser;
  }
}

const todayMeals = [
  { id: 1, type: "Breakfast", time: "7:30 – 9:00 AM", icon: "🍳",
    items: ["Idli", "Sambar", "Coconut chutney", "Tea"], likes: 24,
    comments: [{ id: 1, author: "Anitha", text: "Sambar was really good today!" }] },
  { id: 2, type: "Lunch", time: "12:30 – 2:00 PM", icon: "🍛",
    items: ["Rice", "Dal fry", "Potato poriyal", "Curd"], likes: 41,
    comments: [] },
  { id: 3, type: "Dinner", time: "7:30 – 9:00 PM", icon: "🌙",
    items: ["Chapati", "Paneer curry", "Rice", "Banana"], likes: 18,
    comments: [{ id: 1, author: "Karthik", text: "Please add a sweet on Sundays." }] },
];

const weekMenu = [
  { day: "Monday", breakfast: "Pongal, Vada, Chutney", lunch: "Rice, Sambar, Beans poriyal, Curd", dinner: "Chapati, Veg kurma" },
  { day: "Tuesday", breakfast: "Idli, Sambar, Chutney", lunch: "Lemon rice, Potato fry, Curd", dinner: "Dosa, Tomato chutney" },
  { day: "Wednesday", breakfast: "Poori, Aloo masala", lunch: "Rice, Dal, Cabbage poriyal, Rasam", dinner: "Chapati, Paneer curry" },
  { day: "Thursday", breakfast: "Upma, Coconut chutney", lunch: "Veg biryani, Raita", dinner: "Parotta, Salna" },
  { day: "Friday", breakfast: "Idli, Vada, Sambar", lunch: "Rice, Mixed veg curry, Rasam, Papad", dinner: "Fried rice, Gobi manchurian" },
  { day: "Saturday", breakfast: "Dosa, Chutney, Podi", lunch: "Tomato rice, Boiled egg, Curd", dinner: "Chapati, Dal tadka" },
  { day: "Sunday", breakfast: "Pongal, Vada", lunch: "Rice, Sambar, Poriyal, Payasam", dinner: "Chapati, Chana masala" },
];

const categories = ["Food quality", "Hygiene", "Quantity", "Timing", "Other"];

const initialPosts = [
  { id: 1, author: "Anitha", room: "A-112", category: "Hygiene",
    text: "The wash area in the dining hall was not clean at dinner yesterday.",
    time: "11 Oct, 8:40 pm", agrees: 12, status: "Open" },
  { id: 2, author: "Karthik", room: "C-305", category: "Timing",
    text: "Breakfast ran out by 8:30 AM. Can we increase the quantity or extend the serving time?",
    time: "10 Oct, 8:55 am", agrees: 27, status: "Resolved" },
];

/* Notification types: icon and whether it is urgent */
const typeMeta = {
  "special-meal": { icon: "🎉", urgent: false },
  "special-snack": { icon: "🍪", urgent: false },
  "food-over": { icon: "⚠️", urgent: true },
  emergency: { icon: "🚫", urgent: true },
};

const initialNotifications = [
  { id: 1, type: "special-meal", title: "Special meal this Saturday",
    message: "Festival lunch with payasam and sweets.", time: "Today, 9:00 AM", read: false },
  { id: 2, type: "special-snack", title: "Special snack this evening",
    message: "Hot samosa and tea at 5:00 PM in the dining hall.", time: "Today, 2:30 PM", read: false },
  { id: 3, type: "food-over", title: "Food over",
    message: "Dinner rice is finished. More is being cooked, ready in about 20 minutes.",
    time: "Yesterday, 8:45 PM", read: false },
  { id: 4, type: "emergency", title: "Mess closed",
    message: "Dinner service was cancelled due to a power failure. Sorry for the trouble.",
    time: "9 Oct, 6:10 PM", read: true },
];

const defaultSettings = { notifOn: true, emergencyOn: true, theme: "light", accent: "orange" };

const accents = [
  { id: "orange", color: "#ff6b35" },
  { id: "green", color: "#2ea36b" },
  { id: "purple", color: "#7c5cff" },
  { id: "blue", color: "#2f80ed" },
];

const faqs = [
  { q: "How do I skip a meal?",
    a: "Tap Skip meal on the meal card in the Today tab. The mess uses skips to plan how much food to cook." },
  { q: "When is next week's menu published?",
    a: "Every Saturday evening. Open the Week Menu tab to see it." },
  { q: "How do I raise a complaint?",
    a: "Open the Complaints tab, choose a category, write your complaint and press Post. All students and the mess admin can see it." },
  { q: "Why am I not getting notifications?",
    a: "Open Settings and check that Notifications is turned on. Turn on Emergency alerts too if you want mess closure and food-over notices." },
];

function loadSettings() {
  try {
    return { ...defaultSettings, ...JSON.parse(localStorage.getItem("messmate-settings")) };
  } catch {
    return defaultSettings;
  }
}

/* ---------- Notification bell ---------- */
function NotificationBell({ items, enabled, onRead, onMarkAll }) {
  const [open, setOpen] = useState(false);
  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="bell-wrap">
      <button className="icon-btn" onClick={() => setOpen(!open)} aria-label="Notifications">
        {enabled ? "🔔" : "🔕"}
        {enabled && unread > 0 && <span className="dot">{unread}</span>}
      </button>

      {open && (
        <div className="notif-panel">
          <div className="notif-head">
            <h4>Notifications</h4>
            {enabled && unread > 0 && (
              <button className="link-btn" onClick={onMarkAll}>Mark all as read</button>
            )}
          </div>

          {!enabled && (
            <p className="empty">Notifications are turned off. You can turn them on in Settings.</p>
          )}
          {enabled && items.length === 0 && <p className="empty">You're all caught up 🎉</p>}

          {enabled && items.map((n) => (
            <div key={n.id}
                 className={`notif ${n.read ? "" : "unread"} ${typeMeta[n.type].urgent ? "urgent" : ""}`}
                 onClick={() => onRead(n.id)}>
              <span className="notif-icon">{typeMeta[n.type].icon}</span>
              <div>
                <strong>{n.title}</strong>
                <p>{n.message}</p>
                <span className="meta">{n.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Profile menu (top right) ---------- */
function ProfileMenu({ user, onEdit, onLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="profile">
      <button className="profile-btn" onClick={() => setOpen(!open)}>
        <span className="avatar">{user.name[0]}</span>
        <span className="profile-name">{user.name}</span>
        <span className="chevron">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="profile-card">
          <div className="avatar big">{user.name[0]}</div>
          <h4>{user.name}</h4>
          <p>📧 {user.email}</p>
          <p>📞 {user.phone}</p>
          <p>🏠 Room {user.room}</p>
          <button className="edit-profile-btn" onClick={() => { setOpen(false); onEdit(); }}>✏️ Edit profile</button>
<button className="logout" onClick={onLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

/* ---------- One meal card with likes, skip and comments ---------- */
function MealCard({ meal }) {
  const [liked, setLiked] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(meal.comments);
  const [text, setText] = useState("");
  const likeCount = meal.likes + (liked ? 1 : 0);

  function addComment(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setComments([...comments, { id: Date.now(), author: "You", text: text.trim() }]);
    setText("");
  }

  return (
    <div className={`meal-card ${skipped ? "skipped" : ""}`}>
      <div className="meal-head">
        <span className="meal-icon">{meal.icon}</span>
        <div>
          <h3>{meal.type}</h3>
          <p className="time">{meal.time}</p>
        </div>
      </div>

      <ul className="items">
        {meal.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div className="actions">
        <button className={`like ${liked ? "on" : ""}`} onClick={() => setLiked(!liked)}>
          {liked ? "❤️" : "🤍"} {likeCount}
        </button>
        <button className="comment-btn" onClick={() => setShowComments(!showComments)}>
          💬 {comments.length}
        </button>
        <button className="skip" onClick={() => setSkipped(!skipped)}>
          {skipped ? "Undo skip" : "Skip meal"}
        </button>
      </div>

      {showComments && (
        <div className="comments">
          {comments.length === 0 && <p className="time">No comments yet. Be the first!</p>}
          {comments.map((c) => (
            <div className="comment" key={c.id}>
              <strong>{c.author}</strong> {c.text}
            </div>
          ))}
          <form className="comment-form" onSubmit={addComment}>
            <input
              placeholder="Write a comment..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

/* ---------- Week menu table ---------- */
function WeekMenu() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  return (
    <section>
      <div className="section-head">
        <h2>This Week's Menu</h2>
        <p>The next week's chart is published every Saturday evening.</p>
      </div>

      <div className="table-wrap">
        <table className="week-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>🍳 Breakfast</th>
              <th>🍛 Lunch</th>
              <th>🌙 Dinner</th>
            </tr>
          </thead>
          <tbody>
            {weekMenu.map((row) => (
              <tr key={row.day} className={row.day === today ? "today-row" : ""}>
                <td className="day">
                  {row.day}
                  {row.day === today && <span className="badge">Today</span>}
                </td>
                <td>{row.breakfast}</td>
                <td>{row.lunch}</td>
                <td>{row.dinner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ---------- Complaint board ---------- */
function ComplaintPost({ post }) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="post">
      <div className="post-head">
        <span className="avatar">{post.author[0]}</span>
        <div>
          <strong>{post.author}</strong>
          <span className="meta"> · Room {post.room} · {post.time}</span>
        </div>
        <span className={`status ${post.status.toLowerCase()}`}>{post.status}</span>
      </div>
      <span className="tag">{post.category}</span>
      <p className="post-text">{post.text}</p>
      <button className={`agree ${agreed ? "on" : ""}`} onClick={() => setAgreed(!agreed)}>
        👍 Me too · {post.agrees + (agreed ? 1 : 0)}
      </button>
    </div>
  );
}

function Complaints({ posts, onAdd }) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState(categories[0]);

  function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd({ category, text: text.trim() });
    setText("");
  }

  return (
    <section>
      <div className="section-head">
        <h2>Complaint Board</h2>
        <p>Posts here are visible to all students and the mess admin.</p>
      </div>

      <form className="post-box" onSubmit={submit}>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <textarea
          rows={3}
          placeholder="Write your complaint or suggestion..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="post-btn">Post</button>
      </form>

      <div className="posts">
        {posts.map((p) => (
          <ComplaintPost key={p.id} post={p} />
        ))}
      </div>
    </section>
  );
}

/* ---------- Settings ---------- */
function Switch({ on, onChange }) {
  return (
    <button className={`switch ${on ? "on" : ""}`}
            onClick={() => onChange(!on)}
            role="switch" aria-checked={on}>
      <span className="knob" />
    </button>
  );
}

function Feedback() {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);

  function send(e) {
    e.preventDefault();
    if (!rating && !text.trim()) return;
    setSent(true);
    setRating(0);
    setText("");
  }

  return (
    <div className="setting-card">
      <h3>💬 Feedback</h3>
      <span className="label">How is MessMate working for you?</span>
      <div className="rating">
        {["😞", "😐", "🙂", "😍"].map((emoji, i) => (
          <button type="button" key={emoji}
                  className={rating === i + 1 ? "active" : ""}
                  onClick={() => { setRating(i + 1); setSent(false); }}>
            {emoji}
          </button>
        ))}
      </div>
      <form onSubmit={send}>
        <textarea
          rows={3}
          placeholder="Tell us what we can improve..."
          value={text}
          onChange={(e) => { setText(e.target.value); setSent(false); }}
        />
        <button type="submit" className="post-btn">Send feedback</button>
      </form>
      {sent && <p className="thanks">Thank you! Your feedback was sent. 🙏</p>}
    </div>
  );
}

function Settings({ settings, onChange }) {
  return (
    <section>
      <div className="section-head">
        <h2>Settings</h2>
        <p>Manage notifications, appearance, help and feedback.</p>
      </div>

      <div className="settings-grid">
        <div className="setting-card">
          <h3>🔔 Notifications</h3>
          <div className="setting-row">
            <div>
              <strong>Notifications</strong>
              <p>Special meals, special snacks and mess updates</p>
            </div>
            <Switch on={settings.notifOn} onChange={(v) => onChange("notifOn", v)} />
          </div>
          <div className={`setting-row ${settings.notifOn ? "" : "disabled"}`}>
            <div>
              <strong>Emergency alerts</strong>
              <p>Mess closed or food over. Recommended to keep on.</p>
            </div>
            <Switch on={settings.emergencyOn} onChange={(v) => onChange("emergencyOn", v)} />
          </div>
        </div>

        <div className="setting-card">
          <h3>🎨 Appearance</h3>
          <span className="label">Theme</span>
          <div className="segmented">
            <button className={settings.theme === "light" ? "active" : ""}
                    onClick={() => onChange("theme", "light")}>☀️ Light</button>
            <button className={settings.theme === "dark" ? "active" : ""}
                    onClick={() => onChange("theme", "dark")}>🌙 Dark</button>
          </div>
          <span className="label">Accent colour</span>
          <div className="swatches">
            {accents.map((a) => (
              <button key={a.id} aria-label={a.id}
                      className={`swatch ${settings.accent === a.id ? "active" : ""}`}
                      style={{ background: a.color }}
                      onClick={() => onChange("accent", a.id)} />
            ))}
          </div>
        </div>

        <div className="setting-card">
          <h3>❓ Help</h3>
          {faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
          <p className="label" style={{ marginTop: 14 }}>
            Still stuck? Please ask the mess admin at the mess office.
          </p>
        </div>

        <Feedback />
      </div>
    </section>
  );
}

/* ---------- Main app ---------- */
export default function StudentApp({ onLogout }) {
  const [tab, setTab] = useState("today");
  const [posts, setPosts] = useState(initialPosts);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [settings, setSettings] = useState(loadSettings);
  const [user, setUser] = useState(loadProfile);

function saveProfile(updated) {
  setUser(updated);
  localStorage.setItem("messmate-profile", JSON.stringify(updated));
}

  // Apply theme and accent to the page, and remember them
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", settings.theme);
    document.documentElement.setAttribute("data-accent", settings.accent);
    localStorage.setItem("messmate-settings", JSON.stringify(settings));
  }, [settings]);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long",
  });

  function updateSetting(key, value) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function addPost({ category, text }) {
    const time = new Date().toLocaleString("en-IN", {
      day: "numeric", month: "short", hour: "numeric", minute: "2-digit",
    });
    const newPost = {
      id: Date.now(), author: user.name, room: user.room,
      category, text, time, agrees: 0, status: "Open",
    };
    setPosts([newPost, ...posts]);
  }

  function markRead(id) {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  function markAllRead() {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  }

  // Which notifications the student should see, based on their settings
  const visibleNotifications = settings.notifOn
    ? notifications.filter((n) => settings.emergencyOn || !typeMeta[n.type].urgent)
    : [];

  const urgentUnread = visibleNotifications.find((n) => typeMeta[n.type].urgent && !n.read);

  const tabs = [
    ["today", "🍽️ Today"],
    ["week", "📅 Week Menu"],
    ["complaints", "📢 Complaints"],
    ["settings", "⚙️ Settings"],
  ];

  return (
    <div className="app">
      <header className="navbar">
        <h1 className="brand">🍽️ MessMate</h1>
        <div className="nav-right">
          <NotificationBell
            items={visibleNotifications}
            enabled={settings.notifOn}
            onRead={markRead}
            onMarkAll={markAllRead}
          />
          <ProfileMenu user={user} onEdit={() => setTab("profile")} onLogout={onLogout} />
        </div>
      </header>

      {urgentUnread && (
        <div className="alert-bar">
          <span>
            {typeMeta[urgentUnread.type].icon} <strong>{urgentUnread.title}:</strong>{" "}
            {urgentUnread.message}
          </span>
          <button onClick={() => markRead(urgentUnread.id)}>Dismiss</button>
        </div>
      )}

      <div className="tabs">
        {tabs.map(([id, label]) => (
          <button key={id}
                  className={tab === id ? "tab active" : "tab"}
                  onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>

      <main>
        {tab === "today" && (
          <>
            <section className="hero">
              <h2>Today's Menu</h2>
              <p>{today}</p>
            </section>
            <div className="meal-grid">
              {todayMeals.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>
          </>
        )}

        {tab === "week" && <WeekMenu />}
        {tab === "complaints" && <Complaints posts={posts} onAdd={addPost} />}
        {tab === "settings" && <Settings settings={settings} onChange={updateSetting} />}
        {tab === "profile" && <ProfilePage user={user} onSave={saveProfile} />}
      </main>
    </div>
  );
}