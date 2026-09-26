import "./addon.css";

export default function UsgAddonScreen() {
  return (
    <div className="addon-page">
      <section className="addon-hero">
        <h1>Your free trial for <span>USG reporting</span> addon has ended!</h1>
        <p>Kindly purchase to continue enjoying <b>USG reporting</b></p>

        <div className="addon-price-card">
          <div><span>Subscription expires on</span><strong>16 Dec 2026 (85 days)</strong></div>
          <div><span>Addon Price</span><strong>Rs. 4,800 for every 12 months</strong></div>
          <div><span>Price for 85 Days</span><strong>Rs. 1,133.33</strong></div>
          <div><span>Payable amount</span><strong>Rs. 1,337.33 (Incl. GST)</strong></div>
        </div>

        <button className="addon-primary">ⓘ &nbsp; Buy now</button>
      </section>
    </div>
  );
}
