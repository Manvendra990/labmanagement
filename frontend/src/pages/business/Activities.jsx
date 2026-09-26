import "./business.css";
const events = [
  [
    "Case modified",
    "3:54PM, 21/09/2026",
    "Widal Test method was updated in lab case",
    "38276",
  ],
  [
    "Case modified",
    "3:52PM, 21/09/2026",
    "Investigations were updated in lab case",
    "38276",
  ],
  [
    "Case modified",
    "3:52PM, 21/09/2026",
    "Referrer changed from City Hospital to Dr. Raghav",
    "38276",
  ],
  [
    "Patient name updated",
    "3:52PM, 21/09/2026",
    "Patient name was corrected",
    "38276",
  ],
  [
    "Investigation Added",
    "2:54PM, 21/09/2026",
    "Bilirubin Total, Direct & Indirect was added to lab case",
    "38271",
  ],
];
export default function Activities() {
  return (
    <div className="business-page">
      <div className="biz-title">
        <h1>Activities</h1>
        <span className="feature">★ Advanced plan feature</span>
      </div>
      <div className="activity-intro">
        <div>
          <h3>ⓘ &nbsp; How does this work?</h3>
          <p>
            Activities sensitive to business are monitored and logged. Summary
            of the activity, activity owner and timestamp is logged in plain
            text and cannot be changed in future.
          </p>
        </div>
        <div>
          <h3>▣ &nbsp; Activities monitored:</h3>
          <ul>
            <li>Patient first name and last name change.</li>
            <li>Referrer first name and last name change.</li>
            <li>Referrer change on case.</li>
            <li>Investigations changed on a case.</li>
          </ul>
        </div>
      </div>
      <div className="biz-toolbar">
        <button className="biz-btn">‹</button>
        <input className="biz-input" value="21/09/2026" readOnly />
        <button className="biz-btn">›</button>
        <select className="biz-select">
          <option>All Activities</option>
          <option>Case modified</option>
          <option>Investigation Added</option>
        </select>
      </div>
      <div className="timeline">
        {events.map((e, i) => (
          <div
            className={"event " + (e[0].includes("Added") ? "add" : "")}
            key={i}
          >
            <h3>{e[0]}</h3>
            <b>{e[1]}</b>
            <p>
              {e[2]}
              <br />
              Reg. no. {e[3]}
            </p>
            <p>
              - DEMO LAB OWNER | <a>View bill</a>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
