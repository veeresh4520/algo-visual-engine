import { useState, useEffect, useRef } from "react";
import { apiListVsSet } from "../utils/api";

const RANDOM_POOL = () =>
  Array.from({ length: 20 }, () => Math.floor(Math.random() * 30) + 1);

export default function ListSetModule() {
  const [listInput, setListInput] = useState("3, 7, 3, 15, 2, 7, 22, 8, 3");
  const [listB, setListB] = useState("7, 12, 3, 45, 22, 1");
  const [target, setTarget] = useState("7");
  const [activeOp, setActiveOp] = useState("membership");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // membership animation state
  const [memberAnim, setMemberAnim] = useState({ step: -1, done: false });
  const animRef = useRef(null);

  const parseList = (str) =>
    str.split(",").map((s) => s.trim()).filter(Boolean).map((x) => {
      const n = isNaN(x) ? x : Number(x);
      return n;
    });

  const handleRandom = () => {
    const arr = RANDOM_POOL();
    setListInput(arr.join(", "));
    setResult(null);
  };

  const handleAnalyze = async () => {
    setError("");
    setResult(null);
    setMemberAnim({ step: -1, done: false });
    clearInterval(animRef.current);

    let lst, data;
    try {
      lst = parseList(listInput);
      if (lst.length < 2) throw new Error("List must have at least 2 items");

      if (activeOp === "membership") {
        if (!target.trim()) throw new Error("Please enter a target value");
        const tgt = isNaN(target) ? target.trim() : Number(target);
        data = { list: lst, target: tgt };
      } else if (activeOp === "duplicates") {
        data = { list: lst };
      } else if (activeOp === "common") {
        const lb = parseList(listB);
        if (lb.length < 1) throw new Error("List B must have at least 1 item");
        data = { list_a: lst, list_b: lb };
      }
    } catch (e) {
      setError(e.message);
      return;
    }

    setLoading(true);
    try {
      const res = await apiListVsSet(activeOp, data);
      setResult(res);

      // Kick off membership animation
      if (activeOp === "membership") {
        let step = 0;
        animRef.current = setInterval(() => {
          setMemberAnim((prev) => {
            if (step >= res.list.steps) {
              clearInterval(animRef.current);
              return { step: res.list.steps - 1, done: true };
            }
            return { step: step++, done: false };
          });
        }, 200);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => () => clearInterval(animRef.current), []);

  const listItems = parseList(listInput);

  return (
    <div className="module">
      {/* ── INPUT PANEL ───────────────────────────── */}
      <section className="panel input-panel">
        <h2 className="panel-title">⚙ Configuration</h2>

        <div className="operation-tabs">
          {[
            { key: "membership", label: "🔍 Membership Check" },
            { key: "duplicates", label: "🗑 Duplicate Removal" },
            { key: "common", label: "∩ Common Elements" },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`op-tab-btn ${activeOp === key ? "active" : ""}`}
              onClick={() => { setActiveOp(key); setResult(null); setError(""); }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="input-grid">
          <div className="input-group" style={{ gridColumn: "span 2" }}>
            <label>List Input (comma-separated)</label>
            <div className="input-row">
              <input
                type="text"
                value={listInput}
                onChange={(e) => setListInput(e.target.value)}
                className="text-input"
                placeholder="e.g. 3, 7, 3, 15, 2, 7"
              />
              <button className="btn btn-secondary" onClick={handleRandom}>🎲 Random</button>
            </div>
          </div>

          {activeOp === "membership" && (
            <div className="input-group">
              <label>Target Value</label>
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="text-input"
                placeholder="Value to search for"
              />
            </div>
          )}

          {activeOp === "common" && (
            <div className="input-group">
              <label>List B</label>
              <input
                type="text"
                value={listB}
                onChange={(e) => setListB(e.target.value)}
                className="text-input"
                placeholder="e.g. 7, 12, 3, 45"
              />
            </div>
          )}
        </div>

        {error && <div className="error-msg">{error}</div>}

        <button className="btn btn-primary" onClick={handleAnalyze} disabled={loading}>
          {loading ? "⏳ Analyzing…" : "▶ Analyze"}
        </button>
      </section>

      {/* ── VISUALIZATION + RESULTS ───────────────── */}
      {result && (
        <>
          {activeOp === "membership" && (
            <MembershipResult
              result={result}
              list={listItems}
              anim={memberAnim}
              target={target}
            />
          )}
          {activeOp === "duplicates" && <DuplicateResult result={result} />}
          {activeOp === "common" && (
            <CommonResult result={result} listA={listItems} listB={parseList(listB)} />
          )}
        </>
      )}

      {/* ── COMPARISON TABLE ──────────────────────── */}
      <section className="panel">
        <h2 className="panel-title">📋 List vs Set Comparison</h2>
        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>List</th>
                <th>Set</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Duplicates</td><td className="green">✔ Allowed</td><td className="red">✘ Not Allowed</td></tr>
              <tr><td>Order</td><td className="green">✔ Maintained</td><td className="yellow">~ Not Guaranteed</td></tr>
              <tr><td>Search</td><td className="red">O(n)</td><td className="green">O(1) avg</td></tr>
              <tr><td>Insert</td><td className="green">O(1) append</td><td className="green">O(1) avg</td></tr>
              <tr><td>Memory</td><td className="green">More compact</td><td className="yellow">Hash overhead</td></tr>
              <tr><td>Use Case</td><td>Ordered data, duplicates OK</td><td>Fast lookup, unique items</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────

function MembershipResult({ result, list, anim, target }) {
  return (
    <section className="panel">
      <h2 className="panel-title">🔍 Membership Check Results</h2>

      <div className="dual-viz">
        {/* List visualization */}
        <div className="viz-card">
          <div className="viz-header">
            <span className="viz-algo-label">List — Linear Search</span>
            <span className="viz-message">
              {anim.done ? (result.list.found ? "✅ Found!" : "❌ Not Found") : `Step ${anim.step + 1}`}
            </span>
          </div>
          <div className="list-cells">
            {list.map((val, i) => {
              let cls = "list-cell";
              if (i < anim.step) cls += " cell-visited";
              if (i === anim.step) cls += " cell-active";
              if (anim.done && result.list.found && i === anim.step) cls += " cell-found";
              return (
                <div key={i} className={cls}>
                  <span className="cell-val">{String(val)}</span>
                  <span className="cell-idx">{i}</span>
                </div>
              );
            })}
          </div>
          <div className="metric-row"><span>⏱ Time</span><strong>{result.list.time_ms} ms</strong></div>
          <div className="metric-row"><span>👣 Steps</span><strong>{result.list.steps}</strong></div>
        </div>

        {/* Set visualization */}
        <div className="viz-card">
          <div className="viz-header">
            <span className="viz-algo-label">Set — Hash Lookup</span>
            <span className="viz-message">{result.set.found ? "✅ Found instantly!" : "❌ Not Found"}</span>
          </div>
          <div className="set-lookup-anim">
            <div className="hash-box">
              <span className="hash-icon">⚡</span>
              <span>Hash({String(target)})</span>
              <span className="hash-arrow">→</span>
              <span className={`hash-result ${result.set.found ? "found" : "not-found"}`}>
                {result.set.found ? "EXISTS" : "ABSENT"}
              </span>
            </div>
          </div>
          <div className="metric-row"><span>⏱ Time</span><strong>{result.set.time_ms} ms</strong></div>
          <div className="metric-row"><span>👣 Steps</span><strong>1 (O(1))</strong></div>
        </div>
      </div>
    </section>
  );
}

function DuplicateResult({ result }) {
  return (
    <section className="panel">
      <h2 className="panel-title">🗑 Duplicate Removal Results</h2>
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-num">{result.original_size}</span>
          <span className="stat-label">Original Size</span>
        </div>
        <div className="stat-card green">
          <span className="stat-num">{result.unique_size}</span>
          <span className="stat-label">Unique Elements</span>
        </div>
        <div className="stat-card red">
          <span className="stat-num">{result.duplicates_removed}</span>
          <span className="stat-label">Duplicates Removed</span>
        </div>
      </div>

      <div className="dual-viz">
        <div className="viz-card">
          <div className="viz-header"><span className="viz-algo-label">List Manual Dedup</span></div>
          <div className="metric-row"><span>⏱ Time</span><strong>{result.list.time_ms} ms</strong></div>
          <div className="list-cells small">
            {result.list.result.map((v, i) => (
              <div key={i} className="list-cell cell-visited"><span className="cell-val">{String(v)}</span></div>
            ))}
          </div>
        </div>
        <div className="viz-card">
          <div className="viz-header"><span className="viz-algo-label">Set Conversion</span></div>
          <div className="metric-row"><span>⏱ Time</span><strong>{result.set.time_ms} ms</strong></div>
          <div className="list-cells small">
            {result.set.result.map((v, i) => (
              <div key={i} className="list-cell cell-found"><span className="cell-val">{String(v)}</span></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CommonResult({ result, listA, listB }) {
  const commonSet = new Set(result.common_elements.map(String));
  return (
    <section className="panel">
      <h2 className="panel-title">∩ Common Elements Results</h2>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-num">{listA.length}</span>
          <span className="stat-label">List A Size</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{listB.length}</span>
          <span className="stat-label">List B Size</span>
        </div>
        <div className="stat-card green">
          <span className="stat-num">{result.common_count}</span>
          <span className="stat-label">Common Elements</span>
        </div>
      </div>

      <div className="dual-viz">
        <div className="viz-card">
          <div className="viz-header"><span className="viz-algo-label">List — Nested Loops O(n·m)</span></div>
          <div className="metric-row"><span>⏱ Time</span><strong>{result.list.time_ms} ms</strong></div>
          <div className="metric-row"><span>🔄 Operations</span><strong>{result.list.operations.toLocaleString()}</strong></div>
        </div>
        <div className="viz-card">
          <div className="viz-header"><span className="viz-algo-label">Set — Intersection O(min(n,m))</span></div>
          <div className="metric-row"><span>⏱ Time</span><strong>{result.set.time_ms} ms</strong></div>
          <div className="metric-row"><span>🔄 Operations</span><strong>{result.set.operations.toLocaleString()}</strong></div>
        </div>
      </div>

      {result.common_elements.length > 0 && (
        <div className="common-elements-display">
          <strong>Common elements: </strong>
          {result.common_elements.map((v, i) => (
            <span key={i} className="common-badge">{String(v)}</span>
          ))}
        </div>
      )}
    </section>
  );
}
