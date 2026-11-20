    import { useState } from "react";
import "./rooms.css";
import { floors, CAPACITY, TOTAL_STUDENTS, countSkipped } from "./roomData";

const meals = [
  { id: "BREAKFAST", label: "🍳 Breakfast" },
  { id: "LUNCH", label: "🍛 Lunch" },
  { id: "DINNER", label: "🌙 Dinner" },
];

/* Student list for one room */
function RoomDetail({ room, meal, onClose }) {
  const mealLabel = meals.find((m) => m.id === meal).label;
  const skippedCount = room.students.filter((s) => s.skips.includes(meal)).length;

  return (
    <div className="setting-card room-detail">
      <div className="detail-head">
        <h3>Room {room.room} · {mealLabel}</h3>
        <button className="link-btn" onClick={onClose}>Close</button>
      </div>
      <p className="meta">
        {room.students.length} members · {skippedCount} skipped
      </p>

      {room.students.map((s) => {
        const out = s.skips.includes(meal);
        return (
          <div className="student-row" key={s.name}>
            <span className="avatar">{s.name[0]}</span>
            <span className="name">{s.name}</span>
            <span className={out ? "chip-skip" : "chip-ok"}>
              {out ? "Skipped" : "Attending"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function RoomsView() {
  const [meal, setMeal] = useState("LUNCH");
  const [selected, setSelected] = useState(null); // room number or null

  const skipped = countSkipped(meal);

  return (
    <section>
      <div className="section-head">
        <h2>Rooms</h2>
        <p>See who stays in each room and who has skipped the selected meal. Tap a room for names.</p>
      </div>

      <div className="segmented room-meals">
        {meals.map((m) => (
          <button key={m.id}
                  className={meal === m.id ? "active" : ""}
                  onClick={() => setMeal(m.id)}>
            {m.label}
          </button>
        ))}
      </div>

      <div className="room-summary">
        <div><strong>{TOTAL_STUDENTS}</strong><span>students</span></div>
        <div><strong>{TOTAL_STUDENTS - skipped}</strong><span>attending</span></div>
        <div><strong className="skip-num">{skipped}</strong><span>skipped</span></div>
      </div>

      <div className="room-legend">
        <span><i className="dot-s here" /> Attending</span>
        <span><i className="dot-s skipped" /> Skipped</span>
        <span><i className="dot-s empty" /> Empty bed</span>
      </div>

      {floors.map((f) => {
        const openRoom = f.rooms.find((r) => r.room === selected);

        return (
          <div className="floor" key={f.floor}>
            <h3>{f.label}</h3>

            <div className="room-grid">
              {f.rooms.map((r) => {
                const skippedHere = r.students.filter((s) => s.skips.includes(meal)).length;
                return (
                  <button key={r.room}
                          className={`room-card ${selected === r.room ? "selected" : ""}`}
                          onClick={() => setSelected(selected === r.room ? null : r.room)}>
                    <span className="room-no">Room {r.room}</span>
                    <span className="room-count">👥 {r.students.length} members</span>
                    <span className={`room-skip ${skippedHere > 0 ? "has" : ""}`}>
                      {skippedHere} skipped
                    </span>
                    <div className="dots">
                      {Array.from({ length: CAPACITY }).map((_, i) => {
                        const s = r.students[i];
                        const state = !s ? "empty" : s.skips.includes(meal) ? "skipped" : "here";
                        return <span key={i} className={`dot-s ${state}`} />;
                      })}
                    </div>
                  </button>
                );
              })}
            </div>

            {openRoom && (
              <RoomDetail room={openRoom} meal={meal} onClose={() => setSelected(null)} />
            )}
          </div>
        );
      })}
    </section>
  );
}