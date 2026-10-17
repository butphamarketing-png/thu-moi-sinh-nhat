import { Decorations } from "./Decorations";

const petals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

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
        petals.map((petal) => (
          <span key={petal} className={`petal petal-${petal}`}>
            <svg viewBox="0 0 40 56" width="28" height="40">
              <path
                d="M20 2C20 2 3 18 7 34c4 13 13 20 13 20s9-7 13-20C37 18 20 2 20 2z"
                fill="#f3b3c6"
              />
            </svg>
          </span>
        ))}
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
