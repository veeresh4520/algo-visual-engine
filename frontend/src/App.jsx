import { useState } from "react";
import SortingModule from "./components/SortingModule";
import ListSetModule from "./components/ListSetModule";
import Navbar from "./components/Navbar";
import "./styles/global.css";

export default function App() {
 const [activeTab, setActiveTab] = useState(
  localStorage.getItem("activeTab") || "sorting"
);

useEffect(() => {
  localStorage.setItem("activeTab", activeTab);
}, [activeTab]);
  
  const [darkMode, setDarkMode] = useState(
  JSON.parse(localStorage.getItem("darkMode")) ?? true
);

useEffect(() => {
  localStorage.setItem("darkMode", darkMode);
}, [darkMode]);

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="tab-bar">
        <button
          className={`tab-btn ${activeTab === "sorting" ? "active" : ""}`}
          onClick={() => setActiveTab("sorting")}
        >
          <span className="tab-icon">⚡</span> Sorting Visualizer
        </button>
        <button
          className={`tab-btn ${activeTab === "listset" ? "active" : ""}`}
          onClick={() => setActiveTab("listset")}
        >
          <span className="tab-icon">🔬</span> List vs Set Analyzer
        </button>
      </div>
      <main className="main-content">
        {activeTab === "sorting" ? <SortingModule /> : <ListSetModule />}
      </main>
    </div>
  );
}
