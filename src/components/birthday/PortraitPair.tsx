import { useState } from "react";
import type { Celebrant } from "../../config/birthdayContent";
import type { PortraitStage } from "../../types/story";
import { HeartIcon } from "../icons";

type PortraitPairProps = {
  portraits: Celebrant[];
  stage: PortraitStage;
  variant: "cinematic" | "hero";
};

export function PortraitPair({ portraits, stage, variant }: PortraitPairProps) {
  if (stage === "hidden") return null;

  return (
    <div className={`portrait-pair portrait-pair-${variant} stage-${stage}`}>
      {portraits.map((portrait, index) => (
        <PortraitCard key={portrait.id} portrait={portrait} stage={stage} index={index} />
      ))}
      <span className="pair-heart" aria-hidden="true">
        <HeartIcon />
      </span>
      <span className="portrait-link" aria-hidden="true" />
    </div>
  );
}

function PortraitCard({
  portrait,
  stage,
  index,
}: {
  portrait: Celebrant;
  stage: PortraitStage;
  index: number;
}) {
  const [missing, setMissing] = useState(false);
  const nameVisible =
    stage === "complete" || (stage === "named-left" && index === 0);

  return (
    <figure className="portrait-card">
      <div className="portrait-frame">
        {missing ? (
          <p className="portrait-missing">Không tải được ảnh</p>
        ) : (
          <img
            src={portrait.image}
            alt={portrait.alt}
            style={{ objectPosition: portrait.objectPosition }}
            width={600}
            height={800}
            fetchPriority="high"
            decoding="async"
            onError={() => setMissing(true)}
          />
        )}
      </div>
      <figcaption aria-hidden={nameVisible ? undefined : true} className={nameVisible ? "portrait-name is-on" : "portrait-name"}>
        {portrait.name}
      </figcaption>
    </figure>
  );
}
