import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({ label = "Password", error, rightElement, ...props }) {
  const [visible, setVisible] = useState(false);
  return (
    <label className="auth-field">
      <span className="auth-field__head"><span>{label}</span>{rightElement}</span>
      <span className="auth-password">
        <input className={error ? "auth-input auth-input--error" : "auth-input"} type={visible ? "text" : "password"} {...props} />
        <button type="button" className="auth-eye" onClick={() => setVisible(v => !v)} aria-label="Show or hide password">
          {visible ? <EyeOff size={17}/> : <Eye size={17}/>}
        </button>
      </span>
      {error && <small className="auth-error">{error}</small>}
    </label>
  );
}
