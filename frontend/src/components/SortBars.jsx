/**
 * SortBars - Renders the animated bar chart for sorting visualization
 */
export default function SortBars({ array, comparing = [], swapping = [], maxVal }) {
  const max = maxVal || Math.max(...array, 1);

  return (
    <div className="sort-bars-container">
      {array.map((val, idx) => {
        const isComparing = comparing.includes(idx);
        const isSwapping = swapping.includes(idx);
        let barClass = "sort-bar";
        if (isSwapping) barClass += " bar-swap";
        else if (isComparing) barClass += " bar-compare";

        const heightPct = Math.max((val / max) * 100, 2);

        return (
          <div key={idx} className="sort-bar-wrapper">
            <div
              className={barClass}
              style={{ height: `${heightPct}%` }}
              title={`${val}`}
            >
              {array.length <= 20 && (
                <span className="bar-label">{val}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
