import { birthdayContent } from "../../config/birthdayContent";
import { HeartIcon } from "../icons";

export function BirthdayFooter() {
  return (
    <footer className="site-footer reveal">
      <HeartIcon />
      <p>{birthdayContent.thanks}</p>
      <div className="bow" aria-hidden="true">
        <span />
        <i />
        <span />
      </div>
    </footer>
  );
}
