import type { CSSProperties } from "react";
import { birthdayContent, type ProgramItem } from "../../config/birthdayContent";
import { CakeIcon, CheersIcon, MusicIcon, UtensilsIcon } from "../icons";
import { FloralDivider } from "../story/Decorations";

const icons = {
  cheers: CheersIcon,
  cake: CakeIcon,
  utensils: UtensilsIcon,
  music: MusicIcon,
};

export function EventTimeline({ visibleCount }: { visibleCount: number }) {
  const items = birthdayContent.program.slice(0, visibleCount);
  if (items.length === 0) return null;
  const progress = items.length <= 1 ? 0 : (items.length - 1) / (birthdayContent.program.length - 1);

  return (
    <section className="section program-section reveal" id="program" aria-labelledby="program-title">
      <div className="section-heading">
        <p className="eyebrow">Buổi tối</p>
        <h2 id="program-title">Nội dung chương trình</h2>
        <FloralDivider />
      </div>
      <ol className="timeline" style={{ "--line": String(progress) } as CSSProperties}>
        {items.map((item) => (
          <TimelineItem key={item.id} item={item} />
        ))}
      </ol>
    </section>
  );
}

function TimelineItem({ item }: { item: ProgramItem }) {
  const Icon = icons[item.icon];
  return (
    <li className="timeline-item">
      <span className="timeline-icon">
        <Icon />
      </span>
      <div className="timeline-copy">
        {item.time.trim() && <p className="timeline-time">{item.time}</p>}
        <h3>{item.title}</h3>
        {item.description.trim() && <p>{item.description}</p>}
      </div>
    </li>
  );
}
