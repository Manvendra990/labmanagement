export default function Button({ children, variant = "primary", loading = false, className = "", ...props }) {
  return (
    <button className={`auth-btn auth-btn--${variant} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading ? <span className="auth-spinner" /> : children}
    </button>
  );
}
