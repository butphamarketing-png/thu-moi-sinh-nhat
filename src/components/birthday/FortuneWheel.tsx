import { useRef, useState } from "react";
import { FloralDivider } from "../story/Decorations";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const SEGMENT = 36;

const prizes = [
  { emoji: "💗", short: "Tâm sự", title: "Tâm sự đặc quyền", detail: "Được ưu tiên tâm sự với hai nhân vật chính." },
  { emoji: "🍗", short: "Món đầu", title: "Ăn món đầu tiên", detail: "Được quyền chọn món đầu tiên." },
  { emoji: "🎤", short: "Hát", title: "Bị phạt hát", detail: "Hát một đoạn nhạc bất kỳ tặng chủ tiệc." },
  { emoji: "💃", short: "Nhảy", title: "Bị phạt nhảy", detail: "Nhảy 10 giây, không được ngại." },
  { emoji: "🤣", short: "Quê", title: "Kể chuyện quê", detail: "Khai một chuyện quê độ của bản thân." },
  { emoji: "📸", short: "Ảnh", title: "Chụp ảnh thử thách", detail: "Chụp ảnh tạo dáng bá đạo cùng hai chủ tiệc." },
  { emoji: "🥤", short: "Rót nước", title: "Phục vụ danh dự", detail: "Rót nước cho người ngồi cạnh." },
  { emoji: "👑", short: "VIP", title: "Khách VIP", detail: "Được miễn một hình phạt bất kỳ." },
  { emoji: "💸", short: "Lời chúc", title: "Nộp thuế sinh nhật", detail: "Nói một lời chúc thật có tâm dành cho hai chủ tiệc." },
  { emoji: "🍀", short: "Thoát", title: "Thoát nạn", detail: "Miễn phạt một lượt, nhân phẩm vô cực!" },
] as const;

const sliceColors = [
  "#ffd0e0",
  "#fff6ea",
  "#f4e4ff",
  "#f3d6a0",
  "#ffe4ee",
  "#fffaf4",
  "#f8d7ef",
  "#ffe8c7",
  "#ffd6e6",
  "#f7f0ff",
];

function polar(cx: number, cy: number, radius: number, degrees: number) {
  const radians = (degrees * Math.PI) / 180;
  return [cx + radius * Math.cos(radians), cy + radius * Math.sin(radians)] as const;
}

function wedgePath(index: number) {
  const center = -90 + index * SEGMENT;
  const start = center - SEGMENT / 2;
  const end = center + SEGMENT / 2;
  const [x1, y1] = polar(50, 50, 46, start);
  const [x2, y2] = polar(50, 50, 46, end);
  return `M 50 50 L ${x1} ${y1} A 46 46 0 0 1 ${x2} ${y2} Z`;
}

function playWheelSound(reduced: boolean, durationMs: number) {
  if (reduced) return;
  const context = new AudioContext();
  const master = context.createGain();
  master.gain.value = 0.05;
  master.connect(context.destination);
  const tick = (time: number, frequency: number, gain: number) => {
    const osc = context.createOscillator();
    const amp = context.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(frequency, time);
    amp.gain.setValueAtTime(0.0001, time);
    amp.gain.exponentialRampToValueAtTime(gain, time + 0.01);
    amp.gain.exponentialRampToValueAtTime(0.0001, time + 0.08);
    osc.connect(amp);
    amp.connect(master);
    osc.start(time);
    osc.stop(time + 0.09);
  };
  const start = context.currentTime + 0.05;
  for (let step = 0; step < 10; step += 1) {
    tick(start + step * 0.16, 620 + step * 28, 0.2);
  }
  const win = start + durationMs / 1000;
  tick(win, 784, 0.35);
  tick(win + 0.12, 1046, 0.28);
  window.setTimeout(() => void context.close(), durationMs + 600);
}

export function FortuneWheel() {
  const reduced = useReducedMotion();
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const pending = useRef<number | null>(null);
  const spinButton = useRef<HTMLButtonElement>(null);
  const againButton = useRef<HTMLButtonElement>(null);

  function finish(index: number) {
    pending.current = null;
    setSpinning(false);
    setResult(index);
    setShowResult(true);
    window.setTimeout(() => againButton.current?.focus(), 0);
  }

  function spin() {
    if (spinning) return;
    const index = Math.floor(Math.random() * prizes.length);
    const turns = reduced ? 0 : 6 + Math.floor(Math.random() * 2);
    const current = ((rotation % 360) + 360) % 360;
    const target = (360 - index * SEGMENT) % 360;
    let delta = target - current;
    if (delta < 0) delta += 360;
    const next = rotation + turns * 360 + delta;
    setShowResult(false);
    setRotation(next);
    if (reduced || next === rotation) {
      finish(index);
      return;
    }
    pending.current = index;
    setSpinning(true);
    playWheelSound(false, 4800);
  }

  const prize = result == null ? null : prizes[result];

  return (
    <section className="section fortune-section reveal" id="rsvp" aria-labelledby="fortune-title">
      <div className="section-heading">
        <h2 id="fortune-title">Vòng quay nhân phẩm 🎡</h2>
        <FloralDivider />
      </div>
      <p className="fortune-lead">
        Đến sinh nhật thì phải có chút thử thách! 😈 Hãy thử vận may xem hôm nay bạn là khách VIP hay nhân vật chính của những pha khó đỡ nhé!
      </p>
      <p className="fortune-hint">Nhấn nút bên dưới và để nhân phẩm quyết định!</p>

      <div className="wheel-stage">
        <span className="wheel-pointer" aria-hidden="true" />
        <div
          className={reduced ? "wheel-rotor is-still" : "wheel-rotor"}
          style={{ transform: `rotate(${rotation}deg)` }}
          onTransitionEnd={(event) => {
            if (event.target !== event.currentTarget || event.propertyName !== "transform") return;
            if (pending.current == null) return;
            finish(pending.current);
          }}
        >
          <svg className="wheel-svg" viewBox="0 0 100 100" role="img" aria-label="Vòng quay mười thử thách">
            <circle cx="50" cy="50" r="47.2" fill="#fffaf6" stroke="#e7c98a" strokeWidth="1.6" />
            {prizes.map((item, index) => {
              const center = -90 + index * SEGMENT;
              const [x, y] = polar(50, 50, 30, center);
              return (
                <g key={item.title}>
                  <path d={wedgePath(index)} fill={sliceColors[index]} stroke="#fffaf8" strokeWidth="0.45" />
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#5c3140"
                    fontSize="3.1"
                    fontFamily="Be Vietnam Pro, sans-serif"
                    fontWeight="700"
                    transform={`rotate(${center + 90} ${x} ${y})`}
                  >
                    <tspan x={x} dy="-0.55em" fontSize="4.4">
                      {item.emoji}
                    </tspan>
                    <tspan x={x} dy="1.25em">
                      {item.short}
                    </tspan>
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="wheel-hub" aria-hidden="true">
          ♥
        </div>
      </div>

      {!showResult && (
        <button ref={spinButton} type="button" className="rsvp-btn fortune-spin" disabled={spinning} aria-busy={spinning} onClick={spin}>
          {spinning ? "Đang quay…" : "QUAY NHÂN PHẨM 🎡"}
        </button>
      )}

      <ol className="fortune-legend">
        {prizes.map((item) => (
          <li key={item.title}>
            <span aria-hidden="true">{item.emoji}</span>
            <strong>{item.title}</strong>
          </li>
        ))}
      </ol>

      {showResult && prize && (
        <div className="fortune-result" role="status" aria-live="polite">
          {!reduced && (
            <div className="fortune-burst" aria-hidden="true">
              {Array.from({ length: 8 }, (_, index) => (
                <i key={index} className={`confetti-bit bit-${index}`} />
              ))}
            </div>
          )}
          <p className="fortune-banner">Nhân phẩm đã lên tiếng! 🎉</p>
          <p className="fortune-emoji">{prize.emoji}</p>
          <h3>{prize.title}</h3>
          <p>{prize.detail}</p>
          <div className="fortune-actions">
            <button ref={againButton} type="button" className="rsvp-btn" onClick={spin}>
              QUAY TIẾP
            </button>
            <button
              type="button"
              className="text-btn"
              onClick={() => {
                setShowResult(false);
                spinButton.current?.focus();
              }}
            >
              ĐÓNG
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
