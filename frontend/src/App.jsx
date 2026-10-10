import { useEffect, useMemo, useState } from "react";

const API = "http://localhost:5000/api/habits";
const today = () => new Date().toLocaleDateString("en-CA");

export default function App() {
  const [habits, setHabits] = useState([]);
  const [habitName, setHabitName] = useState("");
  const [target, setTarget] = useState("");
  const [date, setDate] = useState(today());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadHabits() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API}?date=${date}`);
      if (!response.ok) throw new Error("Unable to load habits");
      setHabits(await response.json());
    } catch {
      setError("Cannot connect to the backend. Start the backend and MongoDB first.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadHabits(); }, [date]);

  async function addHabit(event) {
    event.preventDefault();
    if (!habitName.trim()) return;
    setError("");
    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitName: habitName.trim(), target: target.trim(), date })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not add habit");
      setHabits((current) => [data, ...current]);
      setHabitName("");
      setTarget("");
    } catch (err) {
      setError(err.message || "Could not add habit");
    }
  }

  async function toggleHabit(habit) {
    try {
      const response = await fetch(`${API}/${habit._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !habit.completed })
      });
      if (!response.ok) throw new Error("Could not update habit");
      const updated = await response.json();
      setHabits((current) => current.map((item) => item._id === updated._id ? updated : item));
    } catch (err) { setError(err.message); }
  }

  async function deleteHabit(id) {
    try {
      const response = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Could not delete habit");
      setHabits((current) => current.filter((habit) => habit._id !== id));
    } catch (err) { setError(err.message); }
  }

  const completedCount = useMemo(() => habits.filter((h) => h.completed).length, [habits]);
  const percent = habits.length ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <main className="page">
      <header className="topbar">
        <div className="brand-mark">✓</div>
        <div><strong>HabitFlow</strong><span>Small steps, big change.</span></div>
        <div className="date-control">
          <label htmlFor="date">Tracking date</label>
          <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">YOUR DAILY RESET</p>
          <h1>Build better habits.<br /><em>One day at a time.</em></h1>
          <p className="hero-copy">Make your goals visible, track your effort, and celebrate every completed task.</p>
        </div>
        <div className="progress-card">
          <div className="progress-head"><span>Today's progress</span><strong>{percent}%</strong></div>
          <div className="progress-track"><div style={{ width: `${percent}%` }} /></div>
          <p>{completedCount} of {habits.length} habits completed</p>
          <div className="progress-icon">✦</div>
        </div>
      </section>

      <section className="content-grid">
        <div className="panel add-panel">
          <div className="section-title"><div><p className="eyebrow">GET STARTED</p><h2>Add a habit</h2></div><span className="title-icon">＋</span></div>
          <form onSubmit={addHabit}>
            <label htmlFor="habitName">Habit name</label>
            <input id="habitName" value={habitName} onChange={(e) => setHabitName(e.target.value)} placeholder="e.g. Read 20 pages" required />
            <label htmlFor="target">Daily target <small>(optional)</small></label>
            <input id="target" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="e.g. 8 glasses, 20 minutes" />
            <button className="primary" type="submit">＋ Add habit</button>
          </form>
          <div className="tip"><span>✧</span><p><strong>Keep it achievable.</strong><br />Start with small, repeatable actions.</p></div>
        </div>

        <div className="panel habits-panel">
          <div className="section-title"><div><p className="eyebrow">YOUR ROUTINE</p><h2>Today's habits <span className="count">{habits.length}</span></h2></div></div>
          {error && <div className="error">{error}</div>}
          {loading ? <p className="empty">Loading your habits…</p> :
            habits.length === 0 ? <div className="empty"><span>☀</span><h3>A fresh start</h3><p>Add your first habit to begin tracking progress.</p></div> :
            <div className="habit-list">{habits.map((habit) => (
              <article className={`habit-item ${habit.completed ? "is-done" : ""}`} key={habit._id}>
                <button className="check" onClick={() => toggleHabit(habit)} aria-label={habit.completed ? "Mark as pending" : "Mark as completed"}>{habit.completed ? "✓" : ""}</button>
                <div className="habit-info"><strong>{habit.habitName}</strong><span>{habit.target || "Daily habit"}</span></div>
                <span className={`status ${habit.completed ? "done" : ""}`}>{habit.completed ? "Completed" : "Pending"}</span>
                <button className="delete" onClick={() => deleteHabit(habit._id)} aria-label={`Delete ${habit.habitName}`} title="Delete habit">×</button>
              </article>
            ))}</div>
          }
          <div className="bottom-note"><span>✦</span> Progress over perfection.</div>
        </div>
      </section>
      <footer>HabitFlow <span>·</span> MERN Stack College Project <span>·</span> MongoDB · Express · React · Node</footer>
    </main>
  );
}
