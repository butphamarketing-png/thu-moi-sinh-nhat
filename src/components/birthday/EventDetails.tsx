import { birthdayContent } from "../../config/birthdayContent";
import { CalendarIcon, PinIcon } from "../icons";

function Value({ value, placeholder }: { value: string; placeholder: string }) {
  const empty = value.trim() === "";
  return <p className={empty ? "info-value is-placeholder" : "info-value"}>{empty ? placeholder : value}</p>;
}

export function EventDetails({ showTime, showPlace }: { showTime: boolean; showPlace: boolean }) {
  const { event, placeholders } = birthdayContent;

  return (
    <>
      {showTime && (
        <article className="info-card reveal">
          <span className="info-icon">
            <CalendarIcon />
          </span>
          <h3>Thời gian</h3>
          <Value value={event.date} placeholder={placeholders.date} />
          <Value value={event.time} placeholder={placeholders.time} />
        </article>
      )}
      {showPlace && (
        <article className="info-card reveal">
          <span className="info-icon">
            <PinIcon />
          </span>
          <h3>Địa điểm</h3>
          <Value value={event.venue} placeholder={placeholders.venue} />
          <Value value={event.address} placeholder={placeholders.address} />
        </article>
      )}
    </>
  );
}
