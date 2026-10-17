function Rose({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="18" rx="16" ry="7" fill="#8eae86" transform="rotate(-28)" />
      <ellipse cx="14" cy="16" rx="14" ry="6" fill="#6f946c" transform="rotate(24)" />
      <circle cx="0" cy="0" r="13" fill="#f7c3d2" />
      <circle cx="-4" cy="-2" r="8" fill="#f18aab" />
      <circle cx="2" cy="1" r="5.5" fill="#e45280" />
      <circle cx="1" cy="0" r="2.4" fill="#c73366" />
    </g>
  );
}

function Bouquet({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 180 200" aria-hidden="true">
      <path d="M40 190c20-40 30-70 18-110" fill="none" stroke="#7d9a74" strokeWidth="3" />
      <path d="M70 188c8-46 6-78-10-112" fill="none" stroke="#6d8b68" strokeWidth="3" />
      <Rose x={48} y={78} scale={1.15} />
      <Rose x={92} y={96} scale={0.86} />
      <Rose x={28} y={118} scale={0.72} />
      <circle cx="120" cy="70" r="4" fill="#fff" opacity="0.9" />
      <circle cx="136" cy="88" r="3" fill="#fff6ea" />
      <circle cx="18" cy="96" r="3" fill="#fff" />
      <circle cx="150" cy="120" r="2.5" fill="#f3d6a0" />
    </svg>
  );
}

function Balloon({ className, color }: { className: string; color: string }) {
  return (
    <svg className={className} viewBox="0 0 70 110" aria-hidden="true">
      <ellipse cx="35" cy="36" rx="20" ry="28" fill={color} />
      <ellipse cx="28" cy="26" rx="6" ry="10" fill="#fff" opacity="0.35" />
      <path d="M35 64c4 8-6 10-2 18 3 6-4 12 0 18" fill="none" stroke="#b76a84" strokeWidth="1.4" />
      <path d="M31 64h8l-2 6h-4z" fill="#d7a2b4" />
    </svg>
  );
}

export function FloralDivider() {
  return (
    <div className="floral-divider" aria-hidden="true">
      <span />
      <svg viewBox="0 0 36 28" width="28" height="22">
        <Rose x={18} y={12} scale={0.55} />
      </svg>
      <span />
    </div>
  );
}

function Spray({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 90 420" aria-hidden="true">
      <path d="M40 10c8 70 4 120-8 190s6 140 10 210" fill="none" stroke="#7d9a74" strokeWidth="3" />
      <Rose x={42} y={70} scale={0.9} />
      <Rose x={30} y={160} scale={0.72} />
      <Rose x={48} y={250} scale={0.84} />
      <Rose x={34} y={340} scale={0.68} />
      <circle cx="18" cy="120" r="3" fill="#fff" />
      <circle cx="64" cy="210" r="3" fill="#fff6ea" />
      <circle cx="20" cy="300" r="2.5" fill="#f3d6a0" />
    </svg>
  );
}

export function Decorations({ reduced }: { reduced: boolean }) {
  return (
    <div className={reduced ? "decor is-still" : "decor"}>
      <Bouquet className="bouquet bouquet-tl" />
      <Bouquet className="bouquet bouquet-tr" />
      <Bouquet className="bouquet bouquet-bl" />
      <Bouquet className="bouquet bouquet-br" />
      <Spray className="spray spray-left" />
      <Spray className="spray spray-right" />
      <Balloon className="balloon balloon-a" color="#f7a8c4" />
      <Balloon className="balloon balloon-b" color="#fff" />
      <Balloon className="balloon balloon-c" color="#f3d6a0" />
      <Balloon className="balloon balloon-d" color="#ee7ea3" />
      <Balloon className="balloon balloon-e" color="#fff6fb" />
      <svg className="ribbon" viewBox="0 0 220 70" aria-hidden="true">
        <path d="M10 36c40-24 70 18 110-2s60-20 90 4" fill="none" stroke="#e35d86" strokeWidth="8" strokeLinecap="round" />
        <path d="M10 36c40-24 70 18 110-2s60-20 90 4" fill="none" stroke="#ffd0e0" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}
