import { useState } from "react";
import { Link } from "react-router-dom";
import AuthCard from "../../components/common/AuthCard";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Alert from "../../components/common/Alert";
import "./auth.css";

export default function ForgotPassword() {
  const [identity, setIdentity] = useState("");
  const [sent, setSent] = useState(false);
  return <div className="auth-page"><div className="auth-brand"><div className="auth-logo"><span>◔</span> LabLIMS</div><b>Effortless Laboratory Management</b></div>
    <main className="auth-shell"><AuthCard title="Forgot Password?" subtitle="Enter your registered email or mobile number to receive recovery instructions.">
      {sent && <Alert>Recovery instructions have been requested.</Alert>}
      <form onSubmit={e => {e.preventDefault(); setSent(true);}}>
        <Input label="Email / Mobile number" value={identity} onChange={e=>setIdentity(e.target.value)} placeholder="Enter registered email or mobile"/>
        <Button type="submit">Continue</Button>
      </form><Link className="auth-centered-link" to="/login">← Back to login</Link>
    </AuthCard></main></div>;
}
