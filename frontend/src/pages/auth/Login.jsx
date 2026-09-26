import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, MessageSquare } from "lucide-react";
import AuthCard from "../../components/common/AuthCard";
import Input from "../../components/common/Input";
import PasswordInput from "../../components/common/PasswordInput";
import Button from "../../components/common/Button";
import "./auth.css";

export default function EmployeeLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ identity: "", password: "", remember: false });

  const submit = e => {
    e.preventDefault();
    // Frontend phase only. Replace with authApi.login() when backend integration starts.
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-ribbon auth-ribbon--top"/><div className="auth-ribbon auth-ribbon--bottom"/>
      <div className="auth-brand"><div className="auth-logo"><span>◔</span> LabLIMS</div><b>Effortless Laboratory Management</b></div>

      <main className="auth-shell">
        <AuthCard title="Log in to your account">
          <form onSubmit={submit}>
            <Input label="Email / Mobile number" value={form.identity} placeholder="Enter email or mobile number"
              onChange={e => setForm({ ...form, identity: e.target.value })} />
            <PasswordInput value={form.password} placeholder="Enter password"
              onChange={e => setForm({ ...form, password: e.target.value })}
              rightElement={<Link to="/forgot-password">Forgot Password?</Link>} />
            <label className="auth-check"><input type="checkbox" checked={form.remember}
              onChange={e => setForm({ ...form, remember: e.target.checked })}/> Remember me</label>
            <Button type="submit">Log in</Button>
          </form>

          <div className="auth-divider"><span>OR</span></div>
          <Button variant="outline" onClick={() => navigate("/email-otp")}><Mail size={16}/> Login via Email OTP</Button>
          <Button variant="outline" onClick={() => navigate("/sms-otp")}><MessageSquare size={16}/> Login via SMS OTP</Button>
          <Link className="auth-centered-link" to="/account-locked">Account locked?</Link>
        </AuthCard>

        <div className="auth-signup">Don't have an account ? <a href="#" onClick={e => e.preventDefault()}>Sign up</a></div>
        <div className="auth-help">Speak to an expert &nbsp; <span>+91 90000 00000</span><br/><small>Monday to Friday 11:00 am - 5:00 pm</small></div>
        <div className="auth-social">Follow us on: &nbsp; ◉ &nbsp; f &nbsp; ◎ &nbsp; in</div>
      </main>
    </div>
  );
}
