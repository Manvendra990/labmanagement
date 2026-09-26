export default function Input({ label, error, rightElement, className = "", ...props }) {
  return (
    <label className={`auth-field ${className}`}>
      <span className="auth-field__head">
        <span>{label}</span>
        {rightElement}
      </span>
      <input className={error ? "auth-input auth-input--error" : "auth-input"} {...props} />
      {error && <small className="auth-error">{error}</small>}
    </label>
  );
}
