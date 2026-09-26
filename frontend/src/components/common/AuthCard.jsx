import Card from "./Card";

export default function AuthCard({ title, subtitle, children }) {
  return (
    <Card className="auth-card">
      <h1>{title}</h1>
      {subtitle && <p className="auth-subtitle">{subtitle}</p>}
      {children}
    </Card>
  );
}
