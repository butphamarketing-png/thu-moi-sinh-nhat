import type { SceneId } from "../../types/story";
import type { PortraitStage } from "../../types/story";
import { birthdayContent } from "../../config/birthdayContent";
import { PortraitPair } from "../birthday/PortraitPair";
import { SpokenLine } from "./SpokenLine";

const kickers: Partial<Record<SceneId, string>> = {
  angels: "Hai tiểu thiên thần",
  frames: "Hai cô gái, hai cá tính",
  together: "Một chương thật đặc biệt",
  joy: "Tiếng cười và lời chúc",
  focus: "Những vị khách đặc biệt",
  names: "Chính là",
};

type CinematicStageProps = {
  scene: SceneId;
  caption: string;
  segmentId: string | null;
  dissolving: boolean;
  stage: PortraitStage;
};

export function CinematicStage({ scene, caption, segmentId, dissolving, stage }: CinematicStageProps) {
  const showPortraits = stage !== "hidden";
  const kicker = kickers[scene];

  return (
    <section className={`cinematic scene-${scene}`} aria-label="Đang kể chuyện">
      <div className="cinematic-copy">
        {kicker && <p className="cinematic-kicker">{kicker}</p>}
        {caption && <SpokenLine text={caption} segmentId={segmentId} dissolving={dissolving} />}
      </div>
      {showPortraits && (
        <PortraitPair portraits={birthdayContent.celebrants} stage={stage} variant="cinematic" />
      )}
    </section>
  );
}
