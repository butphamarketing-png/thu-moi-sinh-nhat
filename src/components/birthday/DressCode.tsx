import { birthdayContent } from "../../config/birthdayContent";
import { DressIcon } from "../icons";

export function DressCode({ showLabel, showValue }: { showLabel: boolean; showValue: boolean }) {
  if (!showLabel && !showValue) return null;

  return (
    <article className="info-card dress-card reveal">
      <span className="info-icon">
        <DressIcon />
      </span>
      {showLabel && <p className="dress-label">Dress code</p>}
      {showValue && (
        <>
          <p className="dress-value">{birthdayContent.dressCode}</p>
          <div className="swatches" aria-hidden="true">
            <i className="swatch swatch-white" />
            <i className="swatch swatch-black" />
          </div>
        </>
      )}
    </article>
  );
}
