export default function Card({ children, className = "" }) {
  return <div className={`auth-card-base ${className}`}>{children}</div>;
}
