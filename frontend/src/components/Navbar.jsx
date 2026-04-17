export default function Navbar({ darkMode, setDarkMode }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">◈</span>
        <span className="brand-name">AlgoLab</span>
        <span className="brand-tagline">DSA Visualizer & Analyzer</span>
      </div>
      <div className="navbar-actions">
        <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle theme"
        >
          {darkMode ? "☀ Light" : "◐ Dark"}
        </button>
      </div>
    </nav>
  );
}
