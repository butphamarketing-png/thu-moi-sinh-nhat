import { useEffect, useRef, useState } from "react";
import { FloralDivider } from "../story/Decorations";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const SEGMENT = 36;

const prizes = [
  { emoji: "💋", short: "Nịnh", title: "Chủ tiệc nịnh khách", detail: "Chủ tiệc phải chọn một vị khách và dành 3 lời khen thật lòng cho người đó. Cấm khen qua loa!", audio: "/audio/wheel-01.mp3", spoken: "Bạn quay trúng Chủ tiệc nịnh khách. Chủ tiệc phải chọn một vị khách và dành ba lời khen thật lòng cho người đó. Cấm khen qua loa!" },
  { emoji: "🍜", short: "Biểu cảm", title: "Thử thách biểu cảm", detail: "Chủ tiệc phải diễn tả cảm xúc khi nhận được món quà mình không thích trong 15 giây. Cả bàn làm ban giám khảo!", audio: "/audio/wheel-02.mp3", spoken: "Bạn quay trúng Thử thách biểu cảm. Chủ tiệc phải diễn tả cảm xúc khi nhận được món quà mình không thích trong mười lăm giây. Cả bàn làm ban giám khảo!" },
  { emoji: "🎤", short: "Hát", title: "Bị phạt hát", detail: "Hát một đoạn nhạc bất kỳ tặng chủ tiệc.", audio: "/audio/wheel-03.mp3", spoken: "Bạn quay trúng Bị phạt hát. Hãy hát một đoạn nhạc bất kỳ tặng chủ tiệc." },
  { emoji: "💃", short: "Nhảy", title: "Bị phạt nhảy", detail: "Nhảy 10 giây, không được ngại.", audio: "/audio/wheel-04.mp3", spoken: "Bạn quay trúng Bị phạt nhảy. Hãy nhảy mười giây, không được ngại." },
  { emoji: "🤣", short: "Quê", title: "Kể chuyện quê", detail: "Khai một chuyện quê độ của bản thân.", audio: "/audio/wheel-05.mp3", spoken: "Bạn quay trúng Kể chuyện quê. Hãy khai một chuyện quê độ của bản thân." },
  { emoji: "📸", short: "Ảnh", title: "Chụp ảnh thử thách", detail: "Chụp ảnh tạo dáng bá đạo cùng hai chủ tiệc.", audio: "/audio/wheel-06.mp3", spoken: "Bạn quay trúng Chụp ảnh thử thách. Hãy chụp ảnh tạo dáng bá đạo cùng hai chủ tiệc." },
  { emoji: "🫶", short: "Yêu cầu", title: "Chủ tiệc làm theo yêu cầu", detail: "Vị khách quay trúng được đưa ra một thử thách vui, phù hợp và an toàn để chủ tiệc thực hiện ngay tại chỗ.", audio: "/audio/wheel-07.mp3", spoken: "Bạn quay trúng Chủ tiệc làm theo yêu cầu. Vị khách quay trúng được đưa ra một thử thách vui, phù hợp và an toàn để chủ tiệc thực hiện ngay tại chỗ." },
  { emoji: "👑", short: "VIP", title: "Khách VIP", detail: "Được miễn một hình phạt bất kỳ.", audio: "/audio/wheel-08.mp3", spoken: "Bạn quay trúng Khách VIP. Bạn được miễn một hình phạt bất kỳ." },
  { emoji: "💸", short: "Lời chúc", title: "Nộp thuế sinh nhật", detail: "Nói một lời chúc thật có tâm dành cho hai chủ tiệc.", audio: "/audio/wheel-09.mp3", spoken: "Bạn quay trúng Nộp thuế sinh nhật. Hãy nói một lời chúc thật có tâm dành cho hai chủ tiệc." },
  { emoji: "🕺", short: "Quẩy", title: "Chủ tiệc quẩy tới bến", detail: "Cả Kim Tiền và Phương Uyên phải cùng nhảy theo một điệu nhạc bất kỳ trong 15 giây. Không được đứng im!", audio: "/audio/wheel-10.mp3", spoken: "Bạn quay trúng Chủ tiệc quẩy tới bến. Cả Kim Tiền và Phương Uyên phải cùng nhảy theo một điệu nhạc bất kỳ trong mười lăm giây. Không được đứng im!" },
] as const;

function PrizeMark({ emoji }: { emoji: string }) {
  if (emoji === "🫶") return <img className="prize-mark" src="/images/heart-hands.svg" alt="" />;
  return emoji;
}

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
  window.setTimeout(() => void context.close(), Math.min(durationMs, 2200));
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
  const voiceRef = useRef<HTMLAudioElement | null>(null);

  function stopVoice() {
    window.speechSynthesis?.cancel();
    const audio = voiceRef.current;
    if (!audio) return;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  }

  function speakPrize(index: number) {
    stopVoice();
    const prizeVoice = prizes[index];
    const audio = new Audio(prizeVoice.audio);
    voiceRef.current = audio;
    const fallback = () => {
      const synth = window.speechSynthesis;
      if (!synth) return;
      const utterance = new SpeechSynthesisUtterance(prizeVoice.spoken);
      utterance.lang = "vi-VN";
      const voice = synth
        .getVoices()
        .find((item) => item.lang.toLowerCase().startsWith("vi"));
      if (voice) utterance.voice = voice;
      synth.cancel();
      synth.speak(utterance);
    };
    audio.onerror = fallback;
    void audio.play().catch(fallback);
  }

  useEffect(() => stopVoice, []);

  function closeResult() {
    stopVoice();
    setShowResult(false);
    spinButton.current?.focus();
  }

  function finish(index: number) {
    pending.current = null;
    setSpinning(false);
    setResult(index);
    setShowResult(true);
    speakPrize(index);
    window.setTimeout(() => againButton.current?.focus(), 0);
  }

  useEffect(() => {
    if (!showResult) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeResult();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [showResult]);

  function spin() {
    if (spinning) return;
    stopVoice();
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
        <span className="wheel-glow" aria-hidden="true" />
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
            <circle cx="50" cy="50" r="47.2" fill="#fffaf6" stroke="#e7c98a" strokeWidth="1.7" />
            <circle cx="50" cy="50" r="44.2" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="0.35" />
            {prizes.map((item, index) => {
              const center = -90 + index * SEGMENT;
              const [x, y] = polar(50, 50, 30, center);
              return (
                <g key={item.title}>
                  <path d={wedgePath(index)} fill={sliceColors[index]} stroke="#fffaf8" strokeWidth="0.45" />
                  {item.emoji === "🫶" && (
                    <image
                      href="/images/heart-hands.svg"
                      x={x - 3.1}
                      y={y - 7.6}
                      width="6.2"
                      height="6.2"
                      transform={`rotate(${center + 90} ${x} ${y})`}
                    />
                  )}
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
                      {item.emoji === "🫶" ? "" : item.emoji}
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

      {showResult && prize && (
        <div className="fortune-popup" onClick={closeResult}>
          <div
            className="fortune-result"
            role="dialog"
            aria-modal="true"
            aria-labelledby="fortune-result-title"
            onClick={(event) => event.stopPropagation()}
          >
            {!reduced && (
              <div className="fortune-burst" aria-hidden="true">
                {Array.from({ length: 8 }, (_, index) => (
                  <i key={index} className={`confetti-bit bit-${index}`} />
                ))}
              </div>
            )}
            <p className="fortune-banner">Nhân phẩm đã lên tiếng! 🎉</p>
            <p className="fortune-emoji"><PrizeMark emoji={prize.emoji} /></p>
            <h3 id="fortune-result-title">{prize.title}</h3>
            <p>{prize.detail}</p>
            <div className="fortune-actions">
              <button ref={againButton} type="button" className="rsvp-btn" onClick={spin}>
                QUAY TIẾP
              </button>
              <button type="button" className="text-btn" onClick={closeResult}>
                ĐÓNG
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
