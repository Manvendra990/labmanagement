import { useMemo, useState } from "react";
import { Check, Circle, Play, Rocket, ExternalLink } from "lucide-react";
import "./gettingStarted.css";

const initialSteps = [
  { id: 1, title: "Create your lab account", description: "This step is done but you can always update your profile.", done: true },
  { id: 2, title: "Verify email", description: "Your email is verified.", done: true, video: true },
  { id: 3, title: "Patient registration and billing", description: "Ensure bill printout is as expected and you understand the print settings. Update centre details and case registration number starting point from setup.", video: true },
  { id: 4, title: "Understand daily business", description: "Ensure you understand how total income in daily business is calculated.", video: true },
  { id: 5, title: "Edit and print lab reports", description: "Ensure report printout is as expected and you understand various print options provided.", video: true },
  { id: 6, title: "Send report online", description: "Ensure you are able to send report using provided options like WhatsApp, SMS and email.", video: true },
  { id: 7, title: "Proofread normal values", description: "Ensure you have read all normal values added to your account during setup.", link: "Proofread", video: true },
  { id: 8, title: "Check ratelist and test database", description: "Ensure you have updated rates in provided rate-list, disable booking when not required, and check the list of available tests.", video: true },
  { id: 9, title: "Check report formats", description: "Ensure you have checked report printouts for all possible reporting needs.", video: true },
  { id: 10, title: "Print referral business", description: "Ensure you understand how to view and print referral business.", video: true },
  { id: 11, title: "Understand how to get help", description: "Create a support ticket whenever you need help. Support availability can be configured later.", video: true }
];

export default function GettingStarted() {
  const [steps, setSteps] = useState(initialSteps);
  const completed = steps.filter(s => s.done).length;
  const percent = Math.round((completed / steps.length) * 100);

  const toggle = id => setSteps(items =>
    items.map(item => item.id === id ? { ...item, done: !item.done } : item)
  );

  return (
    <div className="gs-page">
      <section className="gs-intro">
        <Rocket size={35} className="gs-rocket" />
        <h1>Welcome to LabLIMS!</h1>
        <p>Create beautifully designed lab reports and start managing your lab easily. Let's get started.</p>
        <button className="gs-demo"><Play size={14}/> Watch demo</button>
      </section>

      <section className="gs-card">
        <header className="gs-card-head">
          <strong>Go-live Checklist</strong>
          <div className="gs-progress-label">
            <span className="gs-progress-ring" style={{"--progress": `${percent * 3.6}deg`}} />
            {percent}% complete
          </div>
        </header>

        <div className="gs-progress-track">
          <div style={{width:`${percent}%`}} />
        </div>

        {steps.map(step => (
          <div className="gs-step" key={step.id}>
            <button className={`gs-check ${step.done ? "done" : ""}`} onClick={() => toggle(step.id)}
              aria-label={`Mark ${step.title} ${step.done ? "incomplete" : "complete"}`}>
              {step.done ? <Check size={13}/> : <Circle size={13}/>}
            </button>

            <div className="gs-step-copy">
              <strong>{step.title}</strong>
              <p>
                {step.description}
                {step.link && <> <button className="gs-inline-link">{step.link} <ExternalLink size={10}/></button></>}
              </p>
            </div>

            {step.video && (
              <button className="gs-watch" onClick={() => window.alert(`${step.title} video will be connected later.`)}>
                <Play size={11}/> Watch video
              </button>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
