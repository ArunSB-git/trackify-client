import { useEffect, useState } from "react";
import ProgressCircle from "./ProgressCircle";
import Sidebar from "./Sidebar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const DAYS_IN_MONTH = 31;

export default function Dashboard({ theme, toggleTheme }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [newTaskName, setNewTaskName] = useState("");

  // Load tasks
const loadDashboard = async () => {
  try {
    const tasksRes = await fetch(`${API_BASE_URL}/api/tasks`, { credentials: "include" });
    const tasksData = await tasksRes.json();

    // Get current year and month in yyyy-MM format
    const today = new Date();
    const monthParam = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

    const completedRes = await fetch(`${API_BASE_URL}/api/tasks/completed-dates?month=${monthParam}`, { credentials: "include" });
    const completedMap = await completedRes.json();

    const formatted = tasksData.map(task => {
      const dates = completedMap[task.id] || [];
      const completedDays = dates.map(d => new Date(d).getDate());
      return { id: task.id, name: task.title, completedDays };
    });

    setTasks(formatted);
  } catch (err) {
    console.error("Dashboard load failed:", err);
  }
};

  useEffect(() => { loadDashboard(); }, []);

  const toggleDay = async (taskId, day) => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    const date = `${yyyy}-${mm}-${dd}`;
    try {
      await fetch(`${API_BASE_URL}/api/tasks/${taskId}/toggle?date=${date}`, { method: "POST", credentials: "include" });
      await loadDashboard();
    } catch (err) { console.error("Toggle failed:", err); }
  };

  const createTask = async () => {
    if (!newTask.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks/createTask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title: newTask })
      });
      if (res.ok) {
        setDialogMessage("Task created successfully");
        setShowDialog(true);
        setNewTask("");
        await loadDashboard();
      }
    } catch (err) { console.error("Create task failed:", err); }
  };

  const handleDeleteTask = async taskId => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, { method: "DELETE", credentials: "include" });
      const data = await res.json();
      setDialogMessage(data.message || "Task deleted successfully");
      setShowDialog(true);
      await loadDashboard();
    } catch (err) { console.error("Delete task failed:", err); }
  };

  const handleEditTask = async () => {
    if (!newTaskName.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks/${taskToEdit.id}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title: newTaskName })
      });
      if (res.ok) {
        setDialogMessage("Task updated successfully");
        setShowDialog(true);
        setEditDialog(false);
        setNewTaskName("");
        await loadDashboard();
      }
    } catch (err) { console.error("Edit task failed:", err); }
  };
  const today = new Date();
const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate(); // last day of month


const getCompletionPercent = task => {
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate(); // last day of month
  const percent = Math.round((task.completedDays.length / daysInMonth) * 100);
  
  //console.log(`Task: ${task.name}, Completed: ${task.completedDays.length}/${daysInMonth}, Percent: ${percent}%`);
  
  return percent;
};



  // Styles using theme
  const s = {
    page: { display: "flex", height: "100vh", background: theme.background, color: theme.text, fontFamily: "Arial" },
    main: { flex: 1, padding: "20px", overflowX: "hidden", background: theme.mainBackground },
    createBox: { display: "flex", gap: "10px", marginBottom: "15px" },
    input: { padding: "8px", background: theme.inputBackground, color: theme.text, border: `1px solid ${theme.border}`, width: "250px" },
    createBtn: { padding: "8px 14px", background: theme.progressCircle, color: theme.text, border: "none", cursor: "pointer", fontWeight: "bold" },
    deleteBtn: { padding: "6px 12px", background: theme.delete, color: theme.text, border: "none", cursor: "pointer", fontWeight: "bold" },
    tableWrapper: { overflowX: "auto" },
    table: { borderCollapse: "collapse", minWidth: "1400px", border: `1px solid ${theme.border}` },
    th: { border: `1px solid ${theme.border}`, padding: "8px", background: theme.tableHeader, color: theme.text, textAlign: "center" },
    td: { border: `1px solid ${theme.border}`, padding: "6px", textAlign: "center", minWidth: "28px", height: "28px" },
    stickyCol: { position: "sticky", right: 0, background: theme.tableHeader, zIndex: 2 },
    dialogOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 },
    dialog: { background: theme.inputBackground, padding: "20px", borderRadius: "6px", textAlign: "center", border: `1px solid ${theme.border}` }
  };

  return (
    <div style={s.page}>
      <Sidebar theme={theme} toggleTheme={toggleTheme} />
      <div style={s.main}>
        <h1>Dashboard</h1>

        {/* Create Task */}
        <div style={s.createBox}>
          <input type="text" placeholder="Enter task name" value={newTask} onChange={e => setNewTask(e.target.value)} style={s.input} />
          <button onClick={createTask} style={s.createBtn}>➕ Create</button>
        </div>

        {/* Table */}
        <div style={s.tableWrapper}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Task</th>
                {[...Array(daysInMonth)].map((_, i) => <th key={i} style={s.th}>{i + 1}</th>)}
                <th style={{ ...s.th, ...s.stickyCol }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id}>
                  <td style={s.td}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ borderRight: `1px solid ${theme.border}`, paddingRight: "10px", flex: 1, textAlign: "center" }}>{task.name}</div>
                      <div style={{ paddingLeft: "10px" }}><ProgressCircle percent={getCompletionPercent(task)} color={theme.progressCircle} /></div>
                    </div>
                  </td>

                  {[...Array(daysInMonth)].map((_, i) => {
                    const day = i + 1;
                    const done = task.completedDays.includes(day);
                    return <td key={day} onClick={() => toggleDay(task.id, day)} style={{ ...s.td, cursor: "pointer", background: done ? theme.progressCircle : theme.tableCell }} />;
                  })}

                  <td style={{ ...s.td, ...s.stickyCol }}>
                    <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                      <button style={{ ...s.createBtn, padding: "4px 8px", background: theme.highlight }} onClick={() => { setTaskToEdit(task); setNewTaskName(""); setEditDialog(true); }}>✏️ Edit</button>
                      <button style={s.deleteBtn} onClick={() => { setConfirmDelete(true); setTaskToDelete(task.id); }}>🗑 Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialogs */}

      {/* Success / Info Dialog */}
      {showDialog && (
        <div style={s.dialogOverlay}>
          <div style={s.dialog}>
            <h3>Info</h3>
            <p>{dialogMessage}</p>
            <button onClick={() => setShowDialog(false)}>OK</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div style={s.dialogOverlay}>
          <div style={s.dialog}>
            <h3>⚠️ Confirm Delete</h3>
            <p>Are you sure you want to delete this task? This will remove all its history.</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "10px" }}>
              <button onClick={() => { handleDeleteTask(taskToDelete); setConfirmDelete(false); }} style={s.deleteBtn}>Yes, Delete</button>
              <button onClick={() => setConfirmDelete(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Dialog */}
      {editDialog && taskToEdit && (
        <div style={s.dialogOverlay}>
          <div style={s.dialog}>
            <h3>Edit Task</h3>
            <input
              type="text"
              placeholder="Enter new task name"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              style={{ padding: "8px", marginBottom: "10px", width: "80%", border: `1px solid ${theme.border}`, background: theme.inputBackground, color: theme.text }}
            />
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              <button onClick={handleEditTask} style={{ padding: "6px 12px", background: theme.highlight, color: theme.text, border: "none" }}>Update</button>
              <button onClick={() => setEditDialog(false)} style={{ padding: "6px 12px", background: theme.delete, color: theme.text, border: "none" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
