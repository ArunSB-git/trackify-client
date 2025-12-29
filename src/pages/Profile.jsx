import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ProfilePage({ theme, toggleTheme }) {
  const [query, setQuery] = useState("");
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false); // 🔹 DELETE CONFIRMATION
  const [user, setUser] = useState(null);
  const isOnline = navigator.onLine;

  // 🔹 IMPORT STATES
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importStep, setImportStep] = useState(1);
  const [importFile, setImportFile] = useState(null);
  const [taskIdMap, setTaskIdMap] = useState(null);
  const [showImportResult, setShowImportResult] = useState(false);
  const [importResultMsg, setImportResultMsg] = useState("");
  // 🔹 LOGOUT CONFIRMATION
const [showLogoutDialog, setShowLogoutDialog] = useState(false);


  useEffect(() => {
    fetch(`${API_BASE_URL}/api/users/me`, {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(data => setUser(data))
      .catch(err => console.error("Failed to fetch user", err));
  }, []);

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      })
    : "";

    const handleLogout = async () => {
  try {
    await fetch(`${API_BASE_URL}/api/logout`, {
      method: "POST",
      credentials: "include",
    });

    // optional cleanup
    localStorage.removeItem("token");

    // redirect to login
    window.location.href = "/login";
  } catch (err) {
    console.error("Logout failed", err);
    alert("❌ Logout failed");
  }
};


  // 🔹 DELETE ACCOUNT HANDLER
  const handleDeleteUser = async () => {
    if (!user?.id) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${user.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (res.ok) {
        alert("✅ Your account and all data have been deleted!");
        setUser(null);
        setShowDeleteDialog(false);
        localStorage.removeItem("token");
        window.location.href = "/";
      } else {
        alert("❌ Failed to delete account");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error deleting account");
    }
  };

  const blocks = [
    {
      name: "Profile Details",
      description: isOnline ? "🟢 Active" : "🔴 Offline",
      image:
        user?.profilePicture ||
        `https://ui-avatars.com/api/?name=Arun+S.B&background=${theme.progressCircle.replace(
          "#",
          ""
        )}&color=fff&size=128`
    },
    {
      name: "Import Data",
      description: "Upload your data",
      image: `https://img.icons8.com/ios-filled/100/${theme.progressCircle.replace(
        "#",
        ""
      )}/upload.png`,
      onClick: () => {
        setShowImportDialog(true);
        setImportStep(1);
        setImportFile(null);
        setTaskIdMap(null);
      }
    },
    {
      name: "Download Statistics",
      description: "Export your stats",
      image: `https://img.icons8.com/ios-filled/100/${theme.progressCircle.replace(
        "#",
        ""
      )}/download.png`,
      onClick: () => setShowExportDialog(true)
    },
    {
      name: "Delete Account",
      description: "Remove your account permanently",
      image: `https://img.icons8.com/ios-filled/100/${theme.delete.replace(
        "#",
        ""
      )}/delete-forever.png`,
      onClick: () => setShowDeleteDialog(true) // 🔹 open delete modal
    },
{
  name: "Logout",
  description: "Sign out of your account",
  image: `https://img.icons8.com/ios-filled/100/${theme.progressCircle.replace(
    "#",
    ""
  )}/logout-rounded.png`,
  onClick: () => setShowLogoutDialog(true)
},
,
    {
      name: "Contribute on GitHub",
      description: "Open repository",
      image: `https://img.icons8.com/ios-glyphs/90/${theme.progressCircle.replace(
        "#",
        ""
      )}/github.png`,
      onClick: () => window.open("https://github.com/", "_blank")
    }
  ];

  const handleSendQuery = () => {
    if (!query || !user?.email) return;

    fetch(`${API_BASE_URL}/api/send-query`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        to: user.email,
        subject: "Query Regarding Dashboard Application",
        body: query
      })
    }).then(() => {
      alert("Query sent successfully!");
      setQuery("");
    });
  };

  const s = {
    page: { display: "flex", height: "100vh", background: theme.background, color: theme.text, fontFamily: "Arial" },
    main: { flex: 1, padding: "20px", overflowY: "auto", background: theme.mainBackground },
    grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", listStyle: "none", padding: 0, margin: 0 },
    gridItem: { background: theme.profileBlockBackground, borderRadius: "10px", cursor: "pointer", transition: "transform 0.3s", boxShadow: `0 0 5px ${theme.border}` },
    figure: { margin: 0, display: "flex", alignItems: "center", padding: "20px", gap: "15px" },
    blockImage: { width: "80px", height: "80px", borderRadius: "50%", border: `2px solid ${theme.progressCircle}` },
    blockTitle: { margin: "5px 0", fontSize: "18px", color: "#14b8a6" },
    blockDesc: { fontSize: "14px", color: theme.blockText },
    queryContainer: { display: "flex", justifyContent: "center", marginTop: "30px", gap: "5px" },
    queryInput: { width: "50%", padding: "10px", borderRadius: "6px", border: `1px solid ${theme.progressCircle}`, background: theme.inputBackground, color: theme.text },
    sendButton: { padding: "10px 15px", borderRadius: "6px", border: "none", background: theme.progressCircle, color: theme.text, cursor: "pointer" },
    modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
    modalBox: { background: theme.profileBlockBackground, padding: "25px", borderRadius: "12px", width: "520px", position: "relative" },
    closeIcon: { position: "absolute", top: "10px", right: "15px", cursor: "pointer", fontSize: "18px" },
    modalItem: { background: theme.mainBackground, padding: "20px", borderRadius: "10px", textAlign: "center" }
  };

  return (
    <div style={s.page}>
      <Sidebar theme={theme} toggleTheme={toggleTheme} />

      <div style={s.main}>
        <h1>Profile & Settings</h1>

        <ul style={s.grid}>
          {blocks.map(block => (
            <li
              key={block.name}
              style={s.gridItem}
              onClick={block.onClick}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-5px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <figure style={s.figure}>
                <img src={block.image} alt="" style={s.blockImage} />
                <figcaption>
                  <h3 style={s.blockTitle}>{block.name}</h3>
                  <p style={s.blockDesc}>{block.description}</p>
                  {block.name === "Profile Details" && user && (
                    <>
                      <p style={{ margin: "4px 0", fontWeight: "bold" }}>{user.name}</p>
                      <p style={{ fontSize: "12px" }}>{user.email}</p>
                      <p style={{ fontSize: "10px" }}>Member since {memberSince}</p>
                    </>
                  )}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <div style={s.queryContainer}>
          <input style={s.queryInput} placeholder="Type your query..." value={query} onChange={e => setQuery(e.target.value)} />
          <button style={s.sendButton} onClick={handleSendQuery}>➤</button>
        </div>
      </div>

      {/* 🔹 DELETE CONFIRMATION MODAL */}
      {showDeleteDialog && (
        <div style={s.modalOverlay}>
          <div style={{ ...s.modalBox, background: "#cbcbcb" }}>
            <span style={s.closeIcon} onClick={() => setShowDeleteDialog(false)}>✕</span>
            <h2 style={{ color: "#e11d48", textAlign: "center" }}>Confirm Account Deletion</h2>
            <p style={{ marginTop: "15px", fontSize: "14px", color: "#000000" }}>
              ⚠️ If you delete your account, all your tasks and related data will be permanently removed.
            </p>
            <p style={{ marginTop: "10px", fontSize: "13px", color: "#000000" }}>
              💡 Tip: If you plan to come back later, please download your data as backup:
            </p>
            <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginTop: "10px" }}>
              <img
                src={`https://img.icons8.com/ios-filled/50/${theme.progressCircle.replace("#", "")}/document--v1.png`}
                style={{ cursor: "pointer" }}
                alt="Download Tasks"
                onClick={() => window.location.href = `${API_BASE_URL}/api/tasks/export/tasks`}
              />
              <img
                src={`https://img.icons8.com/ios-filled/50/${theme.progressCircle.replace("#", "")}/statistics.png`}
                style={{ cursor: "pointer" }}
                alt="Download Statistics"
                onClick={() => window.location.href = `${API_BASE_URL}/api/tasks/export/task-completions`}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-around", marginTop: "25px" }}>
              <button style={{ background: "#e11d48", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer" }} onClick={handleDeleteUser}>
                Yes, Delete
              </button>
              <button style={{ background: "#6b7280", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer" }} onClick={() => setShowDeleteDialog(false)}>
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 LOGOUT CONFIRMATION MODAL */}
{showLogoutDialog && (
  <div style={s.modalOverlay}>
    <div
  style={{
    ...s.modalBox,
    background: "#cbcbcb",
    width: "360px",
    padding: "18px",
  }}
>

      <span
        style={s.closeIcon}
        onClick={() => setShowLogoutDialog(false)}
      >
        ✕
      </span>

      <h2 style={{ textAlign: "center", color: "#000" }}>
        Confirm Logout
      </h2>

<p
  style={{
    marginTop: "15px",
    fontSize: "14px",
    color: "#000",
    textAlign: "center",
  }}
>
  Are you sure you want to logout?
</p>


<div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "25px",
  }}
>

        <button
          style={{
            background: "#14b8a6",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          onClick={handleLogout}
        >
          Yes
        </button>

        <button
          style={{
            background: "#6b7280",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          onClick={() => setShowLogoutDialog(false)}
        >
          No
        </button>
      </div>
    </div>
  </div>
)}


      {/* 🔹 IMPORT MODAL */}
      {showImportDialog && (
        <div style={s.modalOverlay}>
          <div style={{ ...s.modalBox, background: "#cbcbcb" }}>

            <span
  style={{ ...s.closeIcon, color: "#000000" }}
  onClick={() => setShowImportDialog(false)}
>
  ✕
</span>

            <h2 style={{ color: "#000000" }}>{importStep === 1 ? "Import Tasks" : "Import Task History"}</h2>
            <div style={s.modalItem}>
              <input type="file" accept=".csv" onChange={e => setImportFile(e.target.files[0])} />
              <br />
              <button
                style={{ marginTop: "15px", background: "#14b8a6", color: "#fff", border: "none", padding: "10px 15px", borderRadius: "6px" }}
                onClick={async () => {
                  if (!importFile) return alert("Select CSV");
                  const fd = new FormData();
                  fd.append("file", importFile);

                  if (importStep === 1) {
                    const res = await fetch(`${API_BASE_URL}/api/tasks/import/tasks`, { method: "POST", credentials: "include", body: fd });
                    if (res.ok) {
                      await res.json();
                      alert("✅ Tasks uploaded successfully!");
                      setImportFile(null);
                      setImportStep(2);
                    } else {
                      alert("❌ Task upload failed");
                    }
                  } else {
                    const res = await fetch(`${API_BASE_URL}/api/tasks/import/task-completions`, { method: "POST", credentials: "include", body: fd });
                    if (res.ok) {
                      await res.json();
                      alert("✅ Tasks & history imported successfully!");
                      setShowImportDialog(false);
                    } else {
                      alert("❌ Task history upload failed");
                    }
                    setImportFile(null);
                  }
                }}
              >
                {importStep === 1 ? "Upload Tasks" : "Upload Task History"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 IMPORT RESULT */}
      {showImportResult && (
        <div style={s.modalOverlay}>
          <div style={s.modalBox}>
            <h3 style={{ textAlign: "center" }}>{importResultMsg}</h3>
            <button
              style={{ marginTop: "15px", background: "#14b8a6", color: "#fff", border: "none", padding: "10px 15px", borderRadius: "6px" }}
              onClick={() => setShowImportResult(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* 🔹 EXPORT MODAL */}
      {showExportDialog && (
        <div style={s.modalOverlay}>
          <div style={{ ...s.modalBox, background: "#cbcbcb" }}>

<span
  style={{ ...s.closeIcon, color: "#000" }}
  onClick={() => setShowExportDialog(false)}
>
  ✕
</span>

            <h2 style={{ color: "#000000" }}>Export Your Data</h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "20px" }}>
              <div style={s.modalItem} onClick={() => (window.location.href = `${API_BASE_URL}/api/tasks/export/tasks`)}>
                <img src={`https://img.icons8.com/ios-filled/100/${theme.progressCircle.replace("#", "")}/document--v1.png`} />
                <h4>Download Tasks</h4>
                <p>Click to download all your tasks</p>
              </div>
              <div style={s.modalItem} onClick={() => (window.location.href = `${API_BASE_URL}/api/tasks/export/task-completions`)}>
                <img src={`https://img.icons8.com/ios-filled/100/${theme.progressCircle.replace("#", "")}/statistics.png`} />
                <h4>Download Statistics</h4>
                <p>Click to download your completion data</p>
              </div>
            </div>
            <p
  style={{
    marginTop: "20px",
    fontSize: "13px",
    color: "#000",
    textAlign: "center",
  }}
>

              ⚠️ Please save these files safely. They may be required in case of data deletion or account recovery.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
