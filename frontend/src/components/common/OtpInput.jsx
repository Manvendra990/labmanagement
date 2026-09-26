import { useRef } from "react";

export default function OtpInput({ value = "", onChange, length = 6 }) {
  const refs = useRef([]);
  const digits = Array.from({ length }, (_, i) => value[i] || "");

  const update = (index, next) => {
    if (!/^\d?$/.test(next)) return;
    const copy = [...digits];
    copy[index] = next;
    onChange(copy.join(""));
    if (next && index < length - 1) refs.current[index + 1]?.focus();
  };

  return (
    <div className="auth-otp">
      {digits.map((digit, index) => (
        <input key={index} ref={el => refs.current[index] = el} value={digit} maxLength={1}
          inputMode="numeric" onChange={e => update(index, e.target.value)}
          onKeyDown={e => {
            if (e.key === "Backspace" && !digit && index > 0) refs.current[index - 1]?.focus();
          }} />
      ))}
    </div>
  );
}
