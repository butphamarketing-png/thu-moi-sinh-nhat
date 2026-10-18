import { useEffect, useState } from "react";
import { birthdayContent } from "../../config/birthdayContent";

const PARTY_AT = new Date("2026-10-22T19:30:00+07:00").getTime();

function countdownLabel(remainingMs: number) {
  if (remainingMs <= 0) return "Đến giờ gặp nhau rồi";
  const totalMinutes = Math.floor(remainingMs / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  const parts = [
    days > 0 ? `${days} ngày` : "",
    hours > 0 || days > 0 ? `${hours} giờ` : "",
    `${minutes} phút`,
  ].filter(Boolean);
  return `Còn ${parts.join(" ")}`;
}

export function PartyCountdown() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 15000);
    return () => window.clearInterval(timer);
  }, []);

  const remaining = PARTY_AT - now;
  const { time, date } = birthdayContent.event;

  return (
    <p className="countdown" role="timer">
      <span>{countdownLabel(remaining)}</span>
      {remaining > 0 && <span className="countdown-when">tới {time} ngày {date}</span>}
    </p>
  );
}
