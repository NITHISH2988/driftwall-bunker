import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowLeft, ArrowUpRight, Check, Clock3, Sparkles } from "lucide-react";
import { AmbientToggle } from "@/lib/ambient-toggle";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

export const Route = createFileRoute("/care")({
  head: () => ({
    meta: [
      { title: "Website Care Plans — Esper Studio" },
      { name: "description", content: "Thoughtful monthly website care, design support, and a clear 30-day launch bug-fix window from Esper Studio." },
    ],
  }),
  component: Care,
});

const contact = "support.esper@gmail.com";

const plans = [
  {
    name: "Essential Care",
    price: "₹2,499",
    note: "Billed monthly · one month at a time",
    description: "A little expert attention to keep a small business site tidy and current.",
    features: ["Up to 1 hour of small content or site updates", "Monthly software and dependency check", "Email support for site questions", "Reply within 3 business days"],
  },
  {
    name: "Studio Care",
    price: "₹6,999",
    note: "Billed monthly · one month at a time",
    description: "Ongoing improvements for a business ready to keep moving online.",
    features: ["Up to 4 hours of updates and improvements", "Routine dependency and site-health review", "Small layout and design refinements", "Reply within 2 business days"],
    featured: true,
  },
  {
    name: "Design Partner",
    price: "₹14,999",
    note: "Billed monthly · one month at a time",
    description: "A considered design partner for a site that is growing with your business.",
    features: ["Up to 8 hours of design and web improvements", "New landing-page sections and conversion refinements", "Monthly priorities and progress summary", "Reply within 1 business day"],
  },
];

function Care() {
  useScrollReveal();
  return (
    <main className="esper-site care-site">
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="Esper Studio home"><span className="wordmark-symbol" aria-hidden="true"><i /><i /><i /></span><span>esper<span className="wordmark-light"> studio</span></span></a>
        <nav className="main-nav care-nav" aria-label="Main navigation">
          <a href="/#work">Selected work</a><a href="/#approach">What we do</a><a href="/">Studio</a>
          <a className="nav-contact glass-button" href={`mailto:${contact}?subject=${encodeURIComponent("Ask about a care plan")}`}>Ask about care <ArrowUpRight size={15} /></a>
        </nav>
        <AmbientToggle />
      </header>

      <section className="care-hero section-wrap" id="top">
        <div className="care-orb care-orb-one" /><div className="care-orb care-orb-two" />
        <div className="care-hero-copy" data-reveal>
          <a className="care-back" href="/"><ArrowLeft size={15} /> Esper Studio</a>
          <p className="eyebrow"><span className="status-dot" /> Thoughtful support, after launch</p>
          <h1>Your website,<br /><em>well looked after.</em></h1>
          <p className="care-intro">A calm plan for the fixes, updates, and little improvements that help your online home keep pace with your business.</p>
          <a className="glass-button care-hero-cta" href="#plans">Find your care plan <ArrowDown size={16} /></a>
        </div>
        <aside className="care-note glass-panel" data-reveal>
          <span className="care-note-icon"><Sparkles size={18} /></span>
          <p className="eyebrow">Every Esper website</p>
          <h2>30 days of launch care.</h2>
          <p>If something in the delivered scope is not working as agreed, tell us within 30 days of launch. We’ll review and fix covered bugs at no extra charge.</p>
          <span className="care-note-foot"><Clock3 size={13} /> Clear scope. No surprise bill.</span>
        </aside>
        <div className="care-hero-foot"><span>CARE THAT GROWS WITH YOU</span><span>01 — SUPPORT / 03</span></div>
      </section>

      <section className="care-promise section-wrap" data-reveal>
        <p className="eyebrow">A simple promise</p>
        <h2>When something needs attention,<br /><em>you know where to turn.</em></h2>
        <p>We’ll look at the issue, explain what it involves, and agree the next step with you. For work outside your plan, you’ll get a quote before anything extra begins.</p>
      </section>

      <section className="care-plans" id="plans">
        <div className="section-wrap">
          <div className="section-heading care-section-heading"><div><p className="eyebrow">Choose your pace</p><h2>Good care,<br /><em>clearly priced.</em></h2></div><p>Monthly plans start when we agree your scope and first month together. No online checkout or surprise renewal here—just a direct conversation.</p></div>
          <div className="care-plan-grid">
            {plans.map((plan, index) => (
              <article className={`care-plan-card glass-panel${plan.featured ? " care-plan-featured" : ""}`} data-reveal key={plan.name}>
                <div className="care-plan-top"><span className="care-plan-index">0{index + 1} / 03</span>{plan.featured && <span className="care-popular">A LITTLE MORE ROOM</span>}</div>
                <h3>{plan.name}</h3><p className="care-plan-desc">{plan.description}</p>
                <p className="care-price">{plan.price}<span> / month</span></p><p className="care-plan-note">{plan.note}</p>
                <ul>{plan.features.map((feature) => <li key={feature}><Check size={15} />{feature}</li>)}</ul>
                <a className="glass-button care-plan-cta" href={`mailto:${contact}?subject=${encodeURIComponent(`Ask about ${plan.name}`)}&body=${encodeURIComponent(`Hello Esper Studio,\n\nI’d like to ask about the ${plan.name} care plan.\n\nBusiness / website:\n`)}`}>Ask about this plan <ArrowUpRight size={16} /></a>
              </article>
            ))}
          </div>
          <p className="care-price-note">Prices are in INR. Hours are used within the month and don’t roll over. Hosting, domains, paid third-party tools, and new features are separate; we’ll always scope and approve those with you first.</p>
        </div>
      </section>

      <section className="care-boundaries section-wrap">
        <div data-reveal><p className="eyebrow">A note on fixes</p><h2>Clear lines make<br /><em>better partnerships.</em></h2></div>
        <div className="care-boundary-copy" data-reveal>
          <p>The 30-day launch window covers bugs where the delivered site does not work as agreed in the approved scope. It doesn’t cover new features, new content, changes in direction, or outages and changes caused by hosting providers or other third parties.</p>
          <p>After that window, covered time is included in an active care plan. If an issue falls outside the agreed scope or plan hours, we’ll explain it and share a separate estimate before starting.</p>
        </div>
      </section>

      <section className="care-cta-band">
        <div className="section-wrap care-cta-inner" data-reveal>
          <span className="care-cta-flower">✳</span><p className="eyebrow">A steady hand, when you need one</p>
          <h2>Let’s make caring<br />for your site <em>easy.</em></h2>
          <a className="glass-button care-last-cta" href={`mailto:${contact}?subject=${encodeURIComponent("Let’s talk website care")}`}>Talk with the studio <ArrowUpRight size={16} /></a>
        </div>
      </section>

      <section className="care-team section-wrap" aria-labelledby="care-team-title">
        <div className="care-team-heading" data-reveal>
          <p className="eyebrow">The people behind the studio</p>
          <h2 id="care-team-title">A little care,<br /><em>from our team.</em></h2>
        </div>
        <div className="care-team-list">
          <div className="care-team-person" data-reveal>
            <span className="care-team-role">Founders</span>
            <div className="care-team-names"><h3>Venkata Harish</h3><h3>Sadineni Nithish</h3></div>
          </div>
          <div className="care-team-person" data-reveal>
            <span className="care-team-role">Free worker</span>
            <div className="care-team-names"><h3>V. siddardha</h3></div>
          </div>
        </div>
      </section>

      <footer className="site-footer section-wrap care-footer">
        <a className="wordmark footer-wordmark" href="/"><span className="wordmark-symbol" aria-hidden="true"><i /><i /><i /></span><span>esper<span className="wordmark-light"> studio</span></span></a>
        <p>Thoughtful websites for the next version of your business.</p>
        <a className="back-top" href="#top">Back to top ↑</a><span className="copyright">© {new Date().getFullYear()} Esper Studio · <a href={`mailto:${contact}`}>{contact}</a></span>
      </footer>
    </main>
  );
}
