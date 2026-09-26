import "./addon.css";

export default function XrayAddonScreen() {
  const startTrial = () => {
    window.alert("Digital X-ray trial action is frontend-only for now.");
  };

  return (
    <div className="addon-page">
      <section className="addon-hero">
        <h1>Start your 5 day free <span>Digital X-ray reporting</span> addon trial</h1>
        <p>Discover the full potential of <b>Digital X-ray reporting</b> built to optimize and enhance efficiency</p>
        <p className="addon-price-line">Addon Price: <b>Rs. 4,800 + 18% GST for every 12 months</b></p>
        <button className="addon-primary" onClick={startTrial}>Start free trial now!</button>
      </section>
    </div>
  );
}
