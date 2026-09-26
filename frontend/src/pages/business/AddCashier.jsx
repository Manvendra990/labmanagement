import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./business.css";
import "./business-update.css";

export default function AddCashier() {
  const navigate = useNavigate();
  const [showPassword,setShowPassword]=useState(false);
  const [showConfirm,setShowConfirm]=useState(false);
  const [form,setForm]=useState({firstName:"",lastName:"",email:"",mobile:"",password:"",confirmPassword:""});
  const change=(key,value)=>setForm(v=>({...v,[key]:value}));

  function submit(e){
    e.preventDefault();
    if(form.password!==form.confirmPassword){ alert("Password and password confirmation must match."); return; }
    // Frontend-only. API integration comes later.
    navigate("/business/daily");
  }

  return <div className="business-page cashier-page">
    <div className="biz-breadcrumb">DASHBOARD <span>/</span> MANAGE EMPLOYEE <span>/</span> NEW</div>
    <h1>Add employee</h1>
    <form className="cashier-card" onSubmit={submit}>
      <label>* First name<input required value={form.firstName} onChange={e=>change("firstName",e.target.value)}/></label>
      <label>Last name<input value={form.lastName} onChange={e=>change("lastName",e.target.value)}/></label>
      <label>* Email<input required type="email" value={form.email} onChange={e=>change("email",e.target.value)}/></label>
      <label>* Mobile number<div className="phone-input"><span>+91</span><input required value={form.mobile} onChange={e=>change("mobile",e.target.value)}/></div></label>
      <label>* Password<div className="password-field"><input required type={showPassword?"text":"password"} value={form.password} onChange={e=>change("password",e.target.value)}/><button type="button" onClick={()=>setShowPassword(v=>!v)}>{showPassword?<EyeOff size={15}/>:<Eye size={15}/>}</button></div></label>
      <label>* Password confirmation<div className="password-field"><input required type={showConfirm?"text":"password"} value={form.confirmPassword} onChange={e=>change("confirmPassword",e.target.value)}/><button type="button" onClick={()=>setShowConfirm(v=>!v)}>{showConfirm?<EyeOff size={15}/>:<Eye size={15}/>}</button></div></label>
    </form>
    <button className="biz-btn primary cashier-submit" onClick={submit}>Add Employee</button>
  </div>;
}
