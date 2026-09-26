import { Link } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import AuthCard from "../../components/common/AuthCard";
import Button from "../../components/common/Button";
import "./auth.css";

export default function AccountLocked() {
  return <div className="auth-page"><div className="auth-brand"><div className="auth-logo"><span>◔</span> LabLIMS</div><b>Effortless Laboratory Management</b></div>
    <main className="auth-shell"><AuthCard title="Account locked">
      <div className="auth-lock"><LockKeyhole size={30}/></div>
      <p className="auth-message">Your account may be temporarily locked after multiple unsuccessful login attempts. Recover your account or contact your administrator.</p>
      <Link to="/forgot-password"><Button>Recover account</Button></Link>
      <Link className="auth-centered-link" to="/login">← Back to login</Link>
    </AuthCard></main></div>;
}
