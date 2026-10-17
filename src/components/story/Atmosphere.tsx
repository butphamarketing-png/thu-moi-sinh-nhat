import { Decorations } from "./Decorations";

const petals = [0, 1, 2, 3, 4];
const sparks = [0, 1, 2, 3, 4, 5, 6, 7];

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
        sparks.map((spark) => <span key={spark} className={`spark spark-${spark}`} />)}
      {!reduced &&
        petals.map((petal) => (
          <span key={petal} className={`petal petal-${petal}`} />
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
