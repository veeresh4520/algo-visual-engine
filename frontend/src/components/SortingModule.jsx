import { useState, useEffect, useRef, useCallback } from "react";
import SortBars from "./SortBars";
import PerformanceChart from "./PerformanceChart";
import TheoryPanel from "./TheoryPanel";
import { ALGORITHM_INFO, ALGORITHM_KEYS } from "../utils/algorithmMeta";
import { FRAME_GENERATORS } from "../utils/sortingFrames";
import { apiSort, randomArray, parseArrayInput } from "../utils/api";

const SPEED_MAP = { slow: 400, medium: 120, fast: 30 };

export default function SortingModule() {
  // ── Input state ──────────────────────────────────────────
  const [arrayInput, setArrayInput] = useState("");
  const [arraySize, setArraySize] = useState(20);
  const [currentArray, setCurrentArray] = useState([]);
  const [algo1, setAlgo1] = useState("bubble");
  const [algo2, setAlgo2] = useState("merge");
  const [speed, setSpeed] = useState("medium");
  const [inputError, setInputError] = useState("");

  // ── Animation state ──────────────────────────────────────
  const [frames1, setFrames1] = useState([]);
  const [frames2, setFrames2] = useState([]);
  const [frameIdx, setFrameIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const intervalRef = useRef(null);

  // ── Results state ─────────────────────────────────────────
  const [apiResults, setApiResults] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // ── Generate random array on mount ───────────────────────
  useEffect(() => {
    const arr = randomArray(arraySize);
    setCurrentArray(arr);
    setArrayInput(arr.join(", "));
  }, []);

  const handleGenRandom = () => {
    const arr = randomArray(arraySize);
    setCurrentArray(arr);
    setArrayInput(arr.join(", "));
    resetAnimation();
    setApiResults(null);
    setInputError("");
  };

  const handleArrayInput = (val) => {
    setArrayInput(val);
    setInputError("");
  };

  const handleApplyInput = () => {
    try {
      const arr = parseArrayInput(arrayInput);
      setCurrentArray(arr);
      resetAnimation();
      setApiResults(null);
    } catch (e) {
      setInputError(e.message);
    }
  };

  const resetAnimation = () => {
    clearInterval(intervalRef.current);
    setFrames1([]);
    setFrames2([]);
    setFrameIdx(0);
    setIsPlaying(false);
    setIsDone(false);
  };

  // ── Build frames and start animating ─────────────────────
  const handleStart = async () => {
    if (currentArray.length === 0) return;
    resetAnimation();

    const gen1 = FRAME_GENERATORS[algo1];
    const gen2 = FRAME_GENERATORS[algo2];
    const f1 = gen1(currentArray);
    const f2 = gen2(currentArray);
    setFrames1(f1);
    setFrames2(f2);
    setFrameIdx(0);
    setIsPlaying(true);
    setIsDone(false);

    // Also fetch backend metrics
    setApiLoading(true);
    setApiError("");
    try {
      const algos = algo1 === algo2 ? [algo1] : [algo1, algo2];
      const data = await apiSort(currentArray, algos);
      const res = {};
      for (const a of algos) {
        res[a] = { ...data.results[a], label: ALGORITHM_INFO[a]?.label || a };
      }
      if (algo1 === algo2) res[algo2] = res[algo1];
      setApiResults(res);
    } catch (e) {
      setApiError(e.message);
    } finally {
      setApiLoading(false);
    }
  };

  const handlePauseResume = () => setIsPlaying((p) => !p);

  const handleReset = () => {
    resetAnimation();
    setApiResults(null);
  };

  // ── Animation ticker ─────────────────────────────────────
  useEffect(() => {
    if (!isPlaying || frames1.length === 0) return;
    const maxFrames = Math.max(frames1.length, frames2.length);
    intervalRef.current = setInterval(() => {
      setFrameIdx((idx) => {
        if (idx >= maxFrames - 1) {
          clearInterval(intervalRef.current);
          setIsPlaying(false);
          setIsDone(true);
          return maxFrames - 1;
        }
        return idx + 1;
      });
    }, SPEED_MAP[speed]);
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, frames1, frames2, speed]);

  const f1 = frames1[Math.min(frameIdx, frames1.length - 1)];
  const f2 = frames2[Math.min(frameIdx, frames2.length - 1)];
  const maxVal = Math.max(...currentArray, 1);

  const progressPct1 = frames1.length > 1 ? Math.min((frameIdx / (frames1.length - 1)) * 100, 100) : 0;
  const progressPct2 = frames2.length > 1 ? Math.min((frameIdx / (frames2.length - 1)) * 100, 100) : 0;

  return (
    <div className="module">
      {/* ── INPUT PANEL ────────────────────────────────── */}
      <section className="panel input-panel">
        <h2 className="panel-title">⚙ Configuration</h2>
        <div className="input-grid">
          <div className="input-group">
            <label>Custom Array</label>
            <div className="input-row">
              <input
                type="text"
                value={arrayInput}
                onChange={(e) => handleArrayInput(e.target.value)}
                placeholder="e.g. 42, 7, 19, 55, 3"
                className="text-input"
              />
              <button className="btn btn-secondary" onClick={handleApplyInput}>Apply</button>
            </div>
            {inputError && <span className="error-msg">{inputError}</span>}
          </div>

          <div className="input-group">
            <label>Array Size: <strong>{arraySize}</strong></label>
            <input
              type="range" min={5} max={50} value={arraySize}
              onChange={(e) => setArraySize(+e.target.value)}
              className="slider"
            />
            <button className="btn btn-secondary" onClick={handleGenRandom}>
              🎲 Random Array
            </button>
          </div>

          <div className="input-group">
            <label>Algorithm 1</label>
            <select value={algo1} onChange={(e) => setAlgo1(e.target.value)} className="select-input">
              {ALGORITHM_KEYS.map((k) => (
                <option key={k} value={k}>{ALGORITHM_INFO[k].label}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Algorithm 2</label>
            <select value={algo2} onChange={(e) => setAlgo2(e.target.value)} className="select-input">
              {ALGORITHM_KEYS.map((k) => (
                <option key={k} value={k}>{ALGORITHM_INFO[k].label}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Animation Speed</label>
            <div className="speed-buttons">
              {["slow", "medium", "fast"].map((s) => (
                <button
                  key={s} className={`btn speed-btn ${speed === s ? "active" : ""}`}
                  onClick={() => setSpeed(s)}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="control-buttons">
          <button className="btn btn-primary" onClick={handleStart} disabled={isPlaying}>
            ▶ Start
          </button>
          <button className="btn btn-warning" onClick={handlePauseResume} disabled={frames1.length === 0}>
            {isPlaying ? "⏸ Pause" : "▶ Resume"}
          </button>
          <button className="btn btn-danger" onClick={handleReset}>
            ↺ Reset
          </button>
        </div>
      </section>

      {/* ── VISUALIZATION PANEL ───────────────────────── */}
      {(frames1.length > 0 || currentArray.length > 0) && (
        <section className="panel viz-panel">
          <h2 className="panel-title">🎬 Visualization</h2>
          <div className="dual-viz">
            {/* Algorithm 1 */}
            <div className="viz-card">
              <div className="viz-header">
                <span className="viz-algo-label">{ALGORITHM_INFO[algo1]?.label}</span>
                {f1 && <span className="viz-message">{f1.message}</span>}
              </div>
              <SortBars
                array={f1 ? f1.array : currentArray}
                comparing={f1?.comparing || []}
                swapping={f1?.swapping || []}
                maxVal={maxVal}
              />
              <div className="progress-bar-wrap">
                <div className="progress-bar" style={{ width: `${progressPct1}%` }} />
              </div>
            </div>

            {/* Algorithm 2 */}
            <div className="viz-card">
              <div className="viz-header">
                <span className="viz-algo-label">{ALGORITHM_INFO[algo2]?.label}</span>
                {f2 && <span className="viz-message">{f2.message}</span>}
              </div>
              <SortBars
                array={f2 ? f2.array : currentArray}
                comparing={f2?.comparing || []}
                swapping={f2?.swapping || []}
                maxVal={maxVal}
              />
              <div className="progress-bar-wrap">
                <div className="progress-bar" style={{ width: `${progressPct2}%` }} />
              </div>
            </div>
          </div>

          {isDone && <div className="done-badge">✅ Sorting Complete!</div>}
        </section>
      )}

      {/* ── RESULTS PANEL ─────────────────────────────── */}
      {(apiResults || apiLoading) && (
        <section className="panel results-panel">
          <h2 className="panel-title">📊 Performance Metrics</h2>
          {apiLoading && <div className="loading-spinner">Measuring performance…</div>}
          {apiError && <div className="error-msg">{apiError}</div>}
          {apiResults && (
            <>
              <div className="metrics-grid">
                {[algo1, algo2].map((algo) => {
                  const r = apiResults[algo];
                  if (!r) return null;
                  return (
                    <div key={algo} className="metric-card">
                      <h4>{ALGORITHM_INFO[algo]?.label}</h4>
                      <div className="metric-row">
                        <span>⏱ Time</span>
                        <strong>{r.time_ms} ms</strong>
                      </div>
                      <div className="metric-row">
                        <span>🔄 Comparisons</span>
                        <strong>{r.comparisons?.toLocaleString()}</strong>
                      </div>
                      <div className="metric-row">
                        <span>↔ Swaps</span>
                        <strong>{r.swaps?.toLocaleString()}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
              <PerformanceChart results={apiResults} algorithms={[algo1, algo2]} />
            </>
          )}
        </section>
      )}

      {/* ── THEORY PANEL ──────────────────────────────── */}
      <TheoryPanel algorithms={[algo1, algo2]} />
    </div>
  );
}
