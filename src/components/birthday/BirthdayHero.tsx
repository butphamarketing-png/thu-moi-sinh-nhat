import { birthdayContent } from "../../config/birthdayContent";
import type { PortraitStage } from "../../types/story";
import { FloralDivider } from "../story/Decorations";
import { PartyCountdown } from "./PartyCountdown";
import { PortraitPair } from "./PortraitPair";

export function BirthdayHero({ stage }: { stage: PortraitStage }) {
  const [left, right] = birthdayContent.celebrants;

  return (
    <header className="hero reveal" id="hero">
      <div className="hero-lights" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
      <p className="eyebrow ribbon-label">Thư mời</p>
      <FloralDivider />
      <h1 className="script-title">Sinh Nhật</h1>
      <FloralDivider />
      <p className="hero-names">
        <span>{left.name}</span>
        <span aria-hidden="true">&</span>
        <span>{right.name}</span>
      </p>
      <PartyCountdown />
      <PortraitPair portraits={birthdayContent.celebrants} stage={stage} variant="hero" />
      <p className="invitation">{birthdayContent.invitation}</p>
    </header>
  );
}
