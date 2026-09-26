import { useState } from "react";
import { Link } from "react-router-dom";
import AuthCard from "../../components/common/AuthCard";
import Input from "../../components/common/Input";
import OtpInput from "../../components/common/OtpInput";
import Button from "../../components/common/Button";
import "./auth.css";

export default function EmailOtp() {
  const [email,setEmail]=useState(""); const [otp,setOtp]=useState(""); const [sent,setSent]=useState(false);
  return <div className="auth-page"><div className="auth-brand"><div className="auth-logo"><span>◔</span> LabLIMS</div><b>Effortless Laboratory Management</b></div>
    <main className="auth-shell"><AuthCard title="Login via Email OTP" subtitle="We'll send a 6-digit OTP to your registered email address.">
      <Input label="Email address" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Enter email address"/>
      {!sent ? <Button onClick={()=>setSent(true)}>Send Email OTP</Button> : <>
        <span className="auth-otp-label">Enter OTP</span><OtpInput value={otp} onChange={setOtp}/>
        <Button disabled={otp.length!==6}>Verify & Log in</Button><button className="auth-text-btn" onClick={()=>setOtp("")}>Resend OTP</button>
      </>}<Link className="auth-centered-link" to="/login">← Back to login</Link>
    </AuthCard></main></div>;
}
