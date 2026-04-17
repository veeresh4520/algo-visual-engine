import { useEffect, useRef } from "react";

/**
 * PerformanceChart - Bar chart comparing execution time, comparisons, swaps
 * Uses Chart.js loaded via CDN (included in index.html)
 */
export default function PerformanceChart({ results, algorithms }) {
  const timeRef = useRef(null);
  const compRef = useRef(null);
  const timeChartRef = useRef(null);
  const compChartRef = useRef(null);

  const colors = ["#00d4aa", "#ff6b6b", "#ffd93d", "#6c5ce7"];

  useEffect(() => {
    if (!results || !window.Chart) return;

    const labels = algorithms.map((a) => results[a]?.label || a);
    const timeData = algorithms.map((a) => results[a]?.time_ms || 0);
    const compData = algorithms.map((a) => results[a]?.comparisons || 0);
    const swapData = algorithms.map((a) => results[a]?.swaps || 0);

    const bgColors = algorithms.map((_, i) => colors[i % colors.length] + "cc");
    const borderColors = algorithms.map((_, i) => colors[i % colors.length]);

    // Destroy old charts
    if (timeChartRef.current) timeChartRef.current.destroy();
    if (compChartRef.current) compChartRef.current.destroy();

    const chartDefaults = {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          ticks: { color: "var(--text-muted)" },
          grid: { color: "var(--border)" },
        },
        y: {
          ticks: { color: "var(--text-muted)" },
          grid: { color: "var(--border)" },
          beginAtZero: true,
        },
      },
    };

    timeChartRef.current = new window.Chart(timeRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [{ label: "Time (ms)", data: timeData, backgroundColor: bgColors, borderColor: borderColors, borderWidth: 2 }],
      },
      options: { ...chartDefaults, plugins: { ...chartDefaults.plugins, title: { display: true, text: "Execution Time (ms)", color: "var(--text)" } } },
    });

    compChartRef.current = new window.Chart(compRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          { label: "Comparisons", data: compData, backgroundColor: bgColors[0] + "bb", borderColor: borderColors[0], borderWidth: 2 },
          { label: "Swaps", data: swapData, backgroundColor: bgColors[1] + "bb", borderColor: borderColors[1], borderWidth: 2 },
        ],
      },
      options: {
        ...chartDefaults,
        plugins: {
          legend: { display: true, labels: { color: "var(--text)" } },
          title: { display: true, text: "Comparisons vs Swaps", color: "var(--text)" },
        },
      },
    });

    return () => {
      if (timeChartRef.current) timeChartRef.current.destroy();
      if (compChartRef.current) compChartRef.current.destroy();
    };
  }, [results, algorithms]);

  if (!results) return null;

  return (
    <div className="charts-grid">
      <div className="chart-card">
        <canvas ref={timeRef} />
      </div>
      <div className="chart-card">
        <canvas ref={compRef} />
      </div>
    </div>
  );
}
