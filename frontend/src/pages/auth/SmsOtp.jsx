import { useState } from "react";
import { Link } from "react-router-dom";
import AuthCard from "../../components/common/AuthCard";
import Input from "../../components/common/Input";
import OtpInput from "../../components/common/OtpInput";
import Button from "../../components/common/Button";
import "./auth.css";

export default function SmsOtp() {
  const [mobile,setMobile]=useState(""); const [otp,setOtp]=useState(""); const [sent,setSent]=useState(false);
  return <div className="auth-page"><div className="auth-brand"><div className="auth-logo"><span>◔</span> LabLIMS</div><b>Effortless Laboratory Management</b></div>
    <main className="auth-shell"><AuthCard title="Login via SMS OTP" subtitle="We'll send a 6-digit OTP to your registered mobile number.">
      <Input label="Mobile number" value={mobile} onChange={e=>setMobile(e.target.value)} placeholder="Enter mobile number"/>
      {!sent ? <Button onClick={()=>setSent(true)}>Send SMS OTP</Button> : <>
        <span className="auth-otp-label">Enter OTP</span><OtpInput value={otp} onChange={setOtp}/>
        <Button disabled={otp.length!==6}>Verify & Log in</Button><button className="auth-text-btn" onClick={()=>setOtp("")}>Resend OTP</button>
      </>}<Link className="auth-centered-link" to="/login">← Back to login</Link>
    </AuthCard></main></div>;
}
