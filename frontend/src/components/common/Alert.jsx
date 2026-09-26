export default function Alert({ children, type = "info" }) {
  return <div className={`auth-alert auth-alert--${type}`} role="alert">{children}</div>;
}
