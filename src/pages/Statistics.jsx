import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell,
  BarChart, Bar, Legend, ResponsiveContainer
} from "recharts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ==================== Color Generation ==================== */
function stringToNumber(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function stringToColor(str, theme) {
  const hash = stringToNumber(str);
  const h = hash % 360;
  const s = 70;
  const l = theme === "light" ? 50 : 30;
  return `hsl(${h}, ${s}%, ${l}%)`;
}

const CustomMonthTick = ({ x, y, payload, index, visibleTicksCount }) => {
  const isLast = index === visibleTicksCount - 1;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        dy={16}
        textAnchor={isLast ? "end" : "middle"}   // 👈 only DEC moves left
        fontSize={15}
        fontWeight="700"  
        fill="#14b8a6"
      >
        {payload.value}
      </text>
    </g>
  );
};


function formatMonthLabel(label) {
  if (!label) return label;
  const [month, year] = label.split(" ");
  return `${month.substring(0, 3).toUpperCase()} ${year}`;
}


/* ==================== Component ==================== */
export default function Statistics({ theme, toggleTheme }) {
  const [period, setPeriod] = useState("YEARLY");
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/tasks`, { credentials: "include" })
      .then(res => res.json())
      .then(data => { setTasks(data); if(data.length) setSelectedTaskId(data[0].id); });
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/graph/task-summary?period=${period}`, { credentials: "include" })
      .then(res => res.json())
      .then(data => setPieData(data.map(d => ({ name: d.taskTitle, value: d.completedDays }))));
  }, [period]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/graph/monthly-task-details`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
const transformed = data.map(monthData => {
  const [monthName, year] = monthData.monthLabel.split(" ");
  const shortMonth = monthName.substring(0, 3).toUpperCase();

  const obj = {
    month: `${shortMonth} ${year}`   // JAN 2025
  };

  monthData.tasks.forEach(task => {
    obj[task.taskTitle] = task.completedDays;
  });

  return obj;
});

        setLineData(transformed);
      });
  }, []);

  useEffect(() => {
    if (!selectedTaskId) return;
    fetch(`${API_BASE_URL}/api/graph/task/planned-actual?taskId=${selectedTaskId}`, { credentials: "include" })
      .then(res => res.json())
      .then(data =>
  setBarData(
    data.map(d => ({
      month: formatMonthLabel(d.monthLabel), // JAN 2025
      Planned: d.plannedDays,
      Actual: d.actualDays
    }))
  )
);

  }, [selectedTaskId]);

  const s = {
    page: { display: "flex", height: "100vh", background: theme.background, color: theme.text },
    main: { flex: 1, padding: "12px", overflow: "hidden", background: theme.mainBackground },
    grid: { height: "calc(100vh - 60px)", display: "grid", gridTemplateRows: "0.8fr 2fr 2fr", gap: "10px" },
    insights: { border: `1px solid ${theme.border}`, padding: "10px" },
    lineBox: { border: `1px solid ${theme.border}`, padding: "8px" },
    bottomRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", height: "100%" },
    chartBox: { border: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", padding: "6px" },
    chartArea: { flex: 1, minHeight: 0 },
    select: { background: theme.selectBackground, color: theme.selectText, border: `1px solid ${theme.border}`, padding: "6px", marginBottom: "6px" }
  };

  return (
    <div style={s.page}>
      <Sidebar theme={theme} toggleTheme={toggleTheme} />
      <div style={s.main}>
        <h1>Statistics</h1>
        <div style={s.grid}>
          <div style={s.insights}>
            <h3>Insights (Coming Soon)</h3>
            <p>Weekly streaks, best task, consistency score, etc.</p>
          </div>

          <div style={s.lineBox}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
<XAxis
  dataKey="month"
  stroke={theme.text}
  interval={0}
  height={60}
  tick={<CustomMonthTick />}
/>

                <YAxis stroke={theme.text} />
                <Tooltip cursor={false} contentStyle={{ backgroundColor: theme.tooltipBg, border: `1px solid ${theme.tooltipBorder}` }} labelStyle={{ color:"#000000", fontWeight: 600 }} itemStyle={{ color: "#000000" }} />
                <Legend />
                {tasks.map(task => <Line key={task.id} dataKey={task.title} stroke={stringToColor(task.title, theme === "light" ? "light" : "dark")} strokeWidth={2} dot={{ r: 3 }} />)}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={s.bottomRow}>
            <div style={s.chartBox}>
              <select value={period} onChange={e => setPeriod(e.target.value)} style={s.select}>
                <option value="YEARLY">YEARLY</option>
                <option value="MONTHLY">MONTHLY</option>
                <option value="ALL_TIME">ALL_TIME</option>
              </select>
              <div style={s.chartArea}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="40%" cy="50%" outerRadius={100} label={false}>
                      {pieData.map((_, i) => <Cell key={i} fill={stringToColor(pieData[i].name, theme === "light" ? "light" : "dark")} fillOpacity={0.9} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: theme.tooltipBg, border: `1px solid ${theme.tooltipBorder}` }} labelStyle={{ color: "#000000", fontWeight: 600 }} itemStyle={{ color: "#000000" }} />
                    <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" wrapperStyle={{ color: theme.text, fontSize: "13px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={s.chartBox}>
              <select value={selectedTaskId} onChange={e => setSelectedTaskId(e.target.value)} style={s.select}>
                {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
              <div style={s.chartArea}>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={barData} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
                    <XAxis
  dataKey="month"
  stroke={theme.text}
  interval={0}          // 👈 show ALL months
  textAnchor="middle"
  height={60}
  tick={{ fontSize: 10 }}
/>

                    <YAxis stroke={theme.text} />
                    <Tooltip cursor={false} contentStyle={{ backgroundColor: theme.tooltipBg, border: `1px solid ${theme.tooltipBorder}` }} labelStyle={{ color: "#000000", fontWeight: 600 }} itemStyle={{ color: "#000000" }} />
                    <Legend />
                    <Bar dataKey="Actual" fill={theme.progressCircle} />
                    <Bar dataKey="Planned" fill={theme.highlight} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
