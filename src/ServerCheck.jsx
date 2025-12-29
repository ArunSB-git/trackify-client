// import { useEffect, useState } from "react";
// import { CircularProgress, Box, Typography, Button } from "@mui/material";

// export default function ServerCheck({ children }) {
//   const [loading, setLoading] = useState(true);
//   const [serverAlive, setServerAlive] = useState(false);

//   const checkServer = () => {
//     setLoading(true);
//     fetch("http://localhost:8080/api/users/me", { credentials: "include" })
//       .then(res => setServerAlive(res.ok))
//       .catch(() => setServerAlive(false))
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => {
//     checkServer();
//   }, []);

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           height: "100vh",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           flexDirection: "column",
//         }}
//       >
//         <CircularProgress size={60} thickness={5} />
//         <Typography variant="h6" sx={{ mt: 2 }}>
//           Checking server...
//         </Typography>
//       </Box>
//     );
//   }

//   if (!serverAlive) {
//     return (
//       <Box
//         sx={{
//           height: "100vh",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//           gap: 2,
//           backgroundColor: "#f5f5f5",
//         }}
//       >
//         <Box
//           sx={{
//             width: 150,
//             height: 150,
//             borderRadius: "50%",
//             border: "6px solid #f44336",
//             borderTopColor: "#ff7961",
//             animation: "spin 1s linear infinite",
//           }}
//         />
//         <Typography variant="h5" color="error">
//           Server is unreachable
//         </Typography>
//         <Typography variant="body1" color="textSecondary" textAlign="center">
//           Please ask the administrator to restart the backend server.
//         </Typography>
//         <Button variant="contained" color="primary" onClick={checkServer}>
//           Refresh
//         </Button>

//         {/* Add keyframes for spinning animation */}
//         <style>
//           {`
//             @keyframes spin {
//               0% { transform: rotate(0deg); }
//               100% { transform: rotate(360deg); }
//             }
//           `}
//         </style>
//       </Box>
//     );
//   }

//   return children;
// }


// import { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// export default function ServerCheck({ children }) {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [checked, setChecked] = useState(false);

//   useEffect(() => {
//     // Only check if not already on login
//     if (location.pathname === "/login") {
//       setChecked(true);
//       return;
//     }

//     const checkSession = async () => {
//       try {
//         const res = await fetch("http://localhost:8080/api/session-check", {
//           credentials: "include",
//         });
//         if (res.ok) {
//           const data = await res.json();
//           if (!data.valid) {
//             navigate("/login");
//           }
//         } else {
//           navigate("/login");
//         }
//       } catch (err) {
//         console.error("Session check failed:", err);
//         navigate("/login");
//       } finally {
//         setChecked(true);
//       }
//     };

//     checkSession();
//   }, [navigate, location.pathname]);

//   if (!checked) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//         }}
//       >
//         Checking session...
//       </div>
//     );
//   }

//   return children;
// }


import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CircularProgress, Box, Typography, Button } from "@mui/material";

export default function ServerCheck({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [checked, setChecked] = useState(false);
  const [serverAlive, setServerAlive] = useState(true);
  const [loading, setLoading] = useState(true);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const checkSession = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/session-check`, {
        credentials: "include",
      });

      if (!res.ok) {
        setServerAlive(false);
        return;
      }

      const data = await res.json();

      if (!data.valid) {
        navigate("/login");
      } else {
        setServerAlive(true);
      }
    } catch (err) {
      console.error("Session check failed:", err);
      setServerAlive(false);
    } finally {
      setLoading(false);
      setChecked(true);
    }
  };

  useEffect(() => {
    // Skip check on login page
    if (location.pathname === "/login") {
      setChecked(true);
      setLoading(false);
      return;
    }

    checkSession();
  }, [location.pathname]);

  /* ---------- LOADING UI ---------- */
  if (loading && !checked) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <CircularProgress size={60} thickness={5} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Checking session...
        </Typography>
      </Box>
    );
  }

  /* ---------- SERVER DOWN UI ---------- */
  if (!serverAlive) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          backgroundColor: "#f5f5f5",
        }}
      >
        <Box
          sx={{
            width: 150,
            height: 150,
            borderRadius: "50%",
            border: "6px solid #f44336",
            borderTopColor: "#ff7961",
            animation: "spin 1s linear infinite",
          }}
        />
        <Typography variant="h5" color="error">
          Server is unreachable
        </Typography>
        <Typography variant="body1" color="textSecondary" textAlign="center">
          Please ask the administrator to restart the backend server.
        </Typography>
        <Button variant="contained" onClick={checkSession}>
          Refresh
        </Button>

        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </Box>
    );
  }

  return children;
}
