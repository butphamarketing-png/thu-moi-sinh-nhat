import { Decorations } from "./Decorations";

const blossoms = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const blossomFill = ["#f7b7c8", "#f3d6a0", "#ee7ea3"];

function Blossom({ index }: { index: number }) {
  return (
    <span className={`blossom blossom-${index}`}>
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <g fill={blossomFill[index % blossomFill.length]}>
          <circle cx="16" cy="7" r="6" />
          <circle cx="25" cy="16" r="6" />
          <circle cx="16" cy="25" r="6" />
          <circle cx="7" cy="16" r="6" />
        </g>
        <circle cx="16" cy="16" r="3.2" fill="#fff8ee" />
      </svg>
    </span>
  );
}
const sparks = [
  ["star", 0],
  ["gem", 1],
  ["mote", 2],
  ["firefly", 3],
  ["star", 4],
  ["gem", 5],
  ["mote", 6],
  ["firefly", 7],
  ["star", 8],
  ["gem", 9],
] as const;

export function Atmosphere({ reduced, finale }: { reduced: boolean; finale: boolean }) {
  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="wash" />
      <Decorations reduced={reduced} />
      <div className="bokeh bokeh-a" />
      <div className="bokeh bokeh-b" />
      <div className="bokeh bokeh-c" />
      <div className="center-glow" />
      <div className="orb orb-left" />
      <div className="orb orb-right" />
      <div className="veil" />
      {!reduced &&
        sparks.map(([kind, index]) => (
          <span key={index} className={`spark spark-${kind} spark-${index}`} />
        ))}
      {!reduced && blossoms.map((index) => <Blossom key={index} index={index} />)}
      {!reduced &&
        [0, 1, 2].map((index) => <span key={index} className={`meteor meteor-${index}`} />)}
      {finale && !reduced && (
        <div className="confetti">
          {Array.from({ length: 12 }, (_, index) => (
            <i key={index} className={`confetti-bit bit-${index}`} />
          ))}
        </div>
      )}
    </div>
  );
}
