import { useState } from "react";
import { ALGORITHM_INFO } from "../utils/algorithmMeta";

export default function TheoryPanel({ algorithms }) {
  const [showCode, setShowCode] = useState({});

  const toggleCode = (algo) =>
    setShowCode((prev) => ({ ...prev, [algo]: !prev[algo] }));

  if (!algorithms || algorithms.length === 0) return null;

  return (
    <div className="theory-panel">
      <h3 className="panel-title">📚 Algorithm Theory</h3>
      <div className="theory-grid">
        {algorithms.map((algo) => {
          const info = ALGORITHM_INFO[algo];
          if (!info) return null;
          return (
            <div key={algo} className="theory-card">
              <h4 className="theory-algo-name">{info.label}</h4>
              <p className="theory-description">{info.description}</p>

              <div className="complexity-table">
                <div className="complexity-row">
                  <span className="complexity-label">Best</span>
                  <span className="complexity-value green">{info.best}</span>
                </div>
                <div className="complexity-row">
                  <span className="complexity-label">Average</span>
                  <span className="complexity-value yellow">{info.average}</span>
                </div>
                <div className="complexity-row">
                  <span className="complexity-label">Worst</span>
                  <span className="complexity-value red">{info.worst}</span>
                </div>
                <div className="complexity-row">
                  <span className="complexity-label">Space</span>
                  <span className="complexity-value blue">{info.space}</span>
                </div>
                <div className="complexity-row">
                  <span className="complexity-label">In-place</span>
                  <span className={`complexity-value ${info.inPlace ? "green" : "red"}`}>
                    {info.inPlace ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              <button className="code-toggle-btn" onClick={() => toggleCode(algo)}>
                {showCode[algo] ? "▲ Hide Code" : "▼ Show Python Code"}
              </button>

              {showCode[algo] && (
                <pre className="code-block">
                  <code>{info.python}</code>
                </pre>
              )}
            </div>
          );
        })}
      </div>

      <div className="disclaimer-box">
        ⚠️ <strong>Note:</strong> Execution time is measured experimentally and depends on hardware,
        system load, and input data. Time and space complexities shown are theoretical.
      </div>
    </div>
  );
}
