import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Stack, Switch, FormControlLabel } from "@mui/material";

export default function Sidebar({ theme, toggleTheme, currentTheme }) {
  const navigate = useNavigate();

  return (
    <Stack
      sx={{
        width: 240,
        height: "100vh",
        p: 2,
        bgcolor: theme.sidebarBackground,
        borderRight: `1px solid ${theme.border}`,
        justifyContent: "space-between", // keeps bottom section at bottom
        boxSizing: "border-box",
      }}
    >
      {/* Top Section: Title + Buttons */}
      <Stack spacing={1}>
        <h2 style={{ color: theme.text, marginBottom: "12px" }}>Trackify</h2>

        <Button
          variant="outlined"
          fullWidth
          onClick={() => navigate("/")}
          sx={{
            justifyContent: "flex-start",
            bgcolor: theme.inputBackground,
            color: theme.text,
            borderColor: theme.border,
            "&:hover": {
              bgcolor: theme.progressCircle,
            },
          }}
        >
          📊 Dashboard
        </Button>

        <Button
          variant="outlined"
          fullWidth
          onClick={() => navigate("/statistics")}
          sx={{
            justifyContent: "flex-start",
            bgcolor: theme.inputBackground,
            color: theme.text,
            borderColor: theme.border,
            "&:hover": {
              bgcolor: theme.progressCircle,
            },
          }}
        >
          📈 Statistics
        </Button>

        <Button
          variant="outlined"
          fullWidth
          onClick={() => navigate("/profile")}
          sx={{
            justifyContent: "flex-start",
            bgcolor: theme.inputBackground,
            color: theme.text,
            borderColor: theme.border,
            "&:hover": {
              bgcolor: theme.progressCircle,
            },
          }}
        >
          👤 Profile
        </Button>
      </Stack>

      {/* Bottom Section: Theme Switch */}
      <FormControlLabel
        control={
          <Switch
            checked={currentTheme === "dark"} // proper checked state
            onChange={toggleTheme}          // toggles theme in parent
            color="secondary"               // optional: color of switch
          />
        }
        label={currentTheme === "light" ? "Light Mode" : "Dark Mode"}
        sx={{ color: theme.text, mb: 0 }} // removes extra bottom margin
      />
    </Stack>
  );
}
