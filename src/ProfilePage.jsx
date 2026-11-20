import { useState } from "react";
import "./profile.css";

export default function ProfilePage({ user, onSave }) {
  const [form, setForm] = useState(user);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  function change(field, value) {
    setForm({ ...form, [field]: value });
    setSaved(false);
  }

  function validate() {
    const found = {};
    const digits = form.phone.replace(/\D/g, "");
    if (!form.name.trim()) found.name = "Please enter your name.";
    if (digits.length < 10 || digits.length > 13) {
      found.phone = "Enter a valid phone number (10 to 13 digits).";
    }
    if (!form.room.trim()) found.room = "Please enter your room number.";
    return found;
  }

  function submit(e) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    onSave({
      ...form,
      name: form.name.trim(),
      phone: form.phone.trim(),
      room: form.room.trim(),
    });
    setSaved(true);
  }

  function reset() {
    setForm(user);
    setErrors({});
    setSaved(false);
  }

  return (
    <section>
      <div className="section-head">
        <h2>Edit Profile</h2>
        <p>Keep your details up to date so the mess admin can reach you.</p>
      </div>

      <div className="profile-layout">
        <div className="setting-card profile-summary">
          <div className="avatar big">{(form.name.trim()[0] || "?").toUpperCase()}</div>
          <h3>{form.name || "Your name"}</h3>
          <p className="label">📧 {user.email}</p>
          <p className="label">🏠 Room {form.room || "-"}</p>
        </div>

        <form className="setting-card" onSubmit={submit}>
          <div className="pfield">
            <label>Full name</label>
            <input value={form.name} onChange={(e) => change("name", e.target.value)} />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="pfield">
            <label>Email</label>
            <input value={form.email} disabled />
            <span className="hint">Your email is your login ID and can't be changed here.</span>
          </div>

          <div className="pfield">
            <label>Phone number</label>
            <input type="tel" value={form.phone} onChange={(e) => change("phone", e.target.value)} />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>

          <div className="pfield">
            <label>Room number</label>
            <input value={form.room} onChange={(e) => change("room", e.target.value)} />
            {errors.room && <span className="field-error">{errors.room}</span>}
          </div>

          <div className="btn-row">
            <button type="button" className="ghost-btn" onClick={reset}>Reset</button>
            <button type="submit" className="save-btn">Save changes</button>
          </div>

          {saved && <p className="thanks">✅ Profile updated.</p>}
        </form>
      </div>
    </section>
  );
}