import { useNavigate } from "react-router-dom";
import { Users, ShieldCheck, Stethoscope, ReceiptIndianRupee, FileText, Activity, ArrowRight } from "lucide-react";
import "./dashboard.css";

const dues = [
  ["Demo Patient 01","37431","12/09/2026","Rs.1,500"],
  ["Demo Patient 02","37220","10/09/2026","Rs.1,100"],
  ["Demo Patient 03","36961","08/09/2026","Rs.8,800"],
  ["Demo Patient 04","35903","25/08/2026","Rs.2,100"],
  ["Demo Patient 05","35860","24/08/2026","Rs.2,100"],
  ["Demo Patient 06","35595","21/08/2026","Rs.2,100"],
];
const transactions = [
  ["Demo Patient A","38388","+ Rs.3,200"],["Demo Patient B","38385","+ Rs.3,200"],
  ["Demo Patient C","38384","+ Rs.800"],["Demo Patient D","38383","+ Rs.1,200"],
  ["Demo Patient E","38382","+ Rs.200"],["Demo Patient F","38381","+ Rs.800"]
];

function Panel({title, subtitle, viewAll, children}) {
  return <section className="dash-panel">
    <div className="dash-panel-head">
      <div><h3>{title}</h3>{subtitle && <small>{subtitle}</small>}</div>
      <button onClick={viewAll}>View all</button>
    </div>
    {children}
  </section>;
}

export default function Dashboard(){
  const navigate = useNavigate();
  const quick = [
    ["Employee logins", Users, "/manage/employee-login", "green"],
    ["Browser security", ShieldCheck, "/manage/browser-security", "blue"],
    ["Doctor portal", Stethoscope, "/manage/doctor-access", "purple"]
  ];

  return <div className="dash-page">
    <div className="dash-quick-grid">
      {quick.map(([label,Icon,path,tone]) =>
        <button className="dash-quick" key={label} onClick={()=>navigate(path)}>
          <span className={`dash-qicon ${tone}`}><Icon size={16}/></span>
          {label}<ArrowRight size={14} className="dash-arrow"/>
        </button>
      )}
    </div>

    <div className="dash-layout">
      <div className="dash-main">
        <div className="dash-two">
          <Panel title="Payments due" subtitle="For all time" viewAll={()=>navigate("/business/due-reports")}>
            <div className="dash-th"><span>PATIENT</span><span>DUE</span><span>ACCEPT DUE</span></div>
            {dues.map((x,i)=><div className="dash-row" key={i}>
              <div><strong>{x[0]}</strong><small>Reg. {x[1]} | {x[2]}</small></div>
              <span>{x[3]}</span>
              <button className="dash-icon-btn" onClick={()=>navigate("/cases/bills")}><ReceiptIndianRupee size={14}/></button>
            </div>)}
          </Panel>

          <Panel title="Recent transactions" subtitle="For today" viewAll={()=>navigate("/cases/transactions")}>
            <div className="dash-th"><span>PATIENT</span><span>AMOUNT</span><span>VIEW BILL</span></div>
            {transactions.map((x,i)=><div className="dash-row" key={i}>
              <div><strong>{x[0]}</strong><small>Reg. no. {x[1]}</small></div>
              <span className="dash-positive">{x[2]}</span>
              <button className="dash-view" onClick={()=>navigate("/cases/bills")}><FileText size={12}/> View bill</button>
            </div>)}
          </Panel>
        </div>

        <Panel title="Recent activities" viewAll={()=>navigate("/business/activities")}>
          <div className="dash-activity">
            <span><Activity size={13}/> Advanced plan feature</span>
            <p>Recent laboratory activities will appear here.</p>
          </div>
        </Panel>
      </div>

      <aside className="dash-side">
        <div className="dash-alert">⚠ SMS balance is over <b>⌄</b></div>
        <div className="dash-demo"><strong>📊 Demo scheduled</strong><p>Your scheduled demo details can appear here.</p><button>View ↗</button></div>
        <div className="dash-refer">
          <h2>Refer and save<br/>Rs.3,000</h2>
          <p>▷ &nbsp; Invite labs to signup with your code</p>
          <p>♙ &nbsp; Register them for a free trial</p>
          <p>₹ &nbsp; Save on renewal after successful purchase</p>
          <button>Refer now <ArrowRight size={14}/></button>
        </div>
        <div className="dash-links"><span>Terms & Conditions</span><span>Privacy Policy</span><span>Refund Policy</span></div>
      </aside>
    </div>
  </div>;
}
