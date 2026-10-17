import { useState, type FormEvent } from "react";
import { birthdayContent } from "../../config/birthdayContent";
import { FloralDivider } from "../story/Decorations";

type Attendance = "" | "yes" | "maybe" | "no";

type Fields = {
  name: string;
  phone: string;
  attendance: Attendance;
  companions: string;
  message: string;
};

const initial: Fields = {
  name: "",
  phone: "",
  attendance: "",
  companions: "0",
  message: "",
};

export function RSVPSection() {
  const [fields, setFields] = useState<Fields>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [notice, setNotice] = useState("");

  if (!birthdayContent.rsvpEnabled) {
    return (
      <section className="section rsvp-section reveal" id="rsvp">
        <h2>Bạn sẽ đến chung vui cùng chúng mình chứ?</h2>
        <p>Phần xác nhận tham dự sẽ được mở khi có nơi nhận lời mời.</p>
      </section>
    );
  }

  function update<K extends keyof Fields>(key: K, value: Fields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setNotice("");
  }

  function validate(next: Fields) {
    const nextErrors: Partial<Record<keyof Fields, string>> = {};
    if (next.name.trim().length < 2) nextErrors.name = "Hãy nhập tên khách mời.";
    if (next.phone.trim()) {
      const phone = next.phone.replace(/[\s.-]/g, "");
      if (!/^(\+?84|0)\d{8,10}$/.test(phone)) nextErrors.phone = "Số điện thoại chưa đúng định dạng.";
    }
    if (!next.attendance) nextErrors.attendance = "Hãy chọn trạng thái tham dự.";
    if (next.attendance === "yes" || next.attendance === "maybe") {
      const count = Number(next.companions);
      if (!Number.isInteger(count) || count < 0 || count > 8) {
        nextErrors.companions = "Số người đi cùng từ 0 đến 8.";
      }
    }
    return nextErrors;
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(fields);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setNotice("");
      return;
    }
    setNotice(
      "Thông tin đã được kiểm tra trên máy bạn. Trang này chưa có máy chủ lưu trữ, nên xác nhận chưa được gửi đi và sẽ mất khi tải lại trang.",
    );
  }

  const showCompanions = fields.attendance === "yes" || fields.attendance === "maybe";

  return (
    <section className="section rsvp-section reveal" id="rsvp" aria-labelledby="rsvp-title">
      <div className="section-heading">
        <p className="eyebrow">RSVP</p>
        <h2 id="rsvp-title">Bạn sẽ đến chung vui cùng chúng mình chứ?</h2>
        <FloralDivider />
      </div>
      <form className="rsvp-form" onSubmit={onSubmit} noValidate>
        <label>
          Tên khách mời
          <input
            name="name"
            autoComplete="name"
            value={fields.name}
            aria-invalid={Boolean(errors.name)}
            onChange={(event) => update("name", event.target.value)}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </label>
        <label>
          Số điện thoại, không bắt buộc
          <input
            name="phone"
            inputMode="tel"
            autoComplete="tel"
            value={fields.phone}
            aria-invalid={Boolean(errors.phone)}
            onChange={(event) => update("phone", event.target.value)}
          />
          {errors.phone && <span className="field-error">{errors.phone}</span>}
        </label>
        <fieldset>
          <legend>Trạng thái tham dự</legend>
          {(
            [
              ["yes", "Mình sẽ đến"],
              ["maybe", "Mình chưa chắc"],
              ["no", "Mình chưa thể đến"],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className="choice">
              <input
                type="radio"
                name="attendance"
                value={value}
                checked={fields.attendance === value}
                onChange={() => update("attendance", value)}
              />
              <span>{label}</span>
            </label>
          ))}
          {errors.attendance && <span className="field-error">{errors.attendance}</span>}
        </fieldset>
        {showCompanions && (
          <label>
            Số người đi cùng
            <input
              name="companions"
              type="number"
              min={0}
              max={8}
              inputMode="numeric"
              value={fields.companions}
              aria-invalid={Boolean(errors.companions)}
              onChange={(event) => update("companions", event.target.value)}
            />
            {errors.companions && <span className="field-error">{errors.companions}</span>}
          </label>
        )}
        <label>
          Lời nhắn, không bắt buộc
          <textarea
            name="message"
            rows={4}
            value={fields.message}
            onChange={(event) => update("message", event.target.value)}
          />
        </label>
        <button type="submit" className="rsvp-btn">
          Xác nhận tham dự
        </button>
        {notice && (
          <p className="form-notice" role="status">
            {notice}
          </p>
        )}
      </form>
    </section>
  );
}
