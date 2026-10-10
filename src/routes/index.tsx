import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";

export const Route = createFileRoute("/")({ component: EsperStudio });

const CONTACT = "support.esper@gmail.com";

function EsperStudio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);

  function sendBrief(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Website enquiry — ${String(values.get("business"))}`);
    const body = encodeURIComponent(
      [
        `Name: ${values.get("name")}`,
        `Email: ${values.get("email")}`,
        `Business: ${values.get("business")}`,
        "",
        String(values.get("brief")),
      ].join("\n"),
    );
    window.location.href = `mailto:${CONTACT}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <main className="esper-site">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Esper Studio home">
          <span className="wordmark-symbol" aria-hidden="true"><i /><i /><i /></span>
          <span>esper<span className="wordmark-light"> studio</span></span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">
          <a href="#work" onClick={() => setMenuOpen(false)}>Selected work</a>
          <a href="#approach" onClick={() => setMenuOpen(false)}>What we do</a>
          <a href="#studio" onClick={() => setMenuOpen(false)}>Studio</a>
          <a className="nav-contact" href="#contact" onClick={() => setMenuOpen(false)}>
            Start a project <ArrowUpRight size={15} />
          </a>
        </nav>
      </header>

      <section className="hero section-wrap" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> Independent digital studio · India / everywhere</p>
          <h1>Make room<br />for <em>what’s next.</em></h1>
          <div className="hero-bottom">
            <p className="hero-lede">We build thoughtful websites that help ambitious businesses meet the moment—and the people looking for them.</p>
            <a className="circle-link" href="#work" aria-label="Explore selected work"><ArrowDown size={19} /></a>
          </div>
        </div>

        <div className="hero-art">
          <img className="hero-art-image" src="/images/esper-hero.png" alt="Sculptural forest-green arch opening toward a sunlit horizon" />
          <div className="art-label label-top"><span>ES—01</span><span>Digital, made human</span></div>
          <div className="art-stamp"><span>Made for</span><strong>what’s<br /><i>next.</i></strong><span className="stamp-star">✳</span></div>
          <div className="art-label label-bottom"><span>Ideas into presence</span><span>01 / 03</span></div>
        </div>

        <div className="hero-index"><span>01</span><span className="index-rule" /><span>Scroll to explore</span></div>
      </section>

      <section className="intro-band section-wrap" id="studio">
        <p className="eyebrow">A good business deserves to be found.</p>
        <div className="intro-grid">
          <h2>The world moved<br />online. <em>Your business<br />can move with it.</em></h2>
          <div className="intro-text">
            <p>People discover, compare, and choose differently now. We help independent businesses show up with confidence through a clear strategy, a distinctive identity, and a website built around real customers.</p>
            <a className="text-link" href="#approach">Meet your digital partner <ArrowRight size={16} /></a>
          </div>
        </div>
      </section>

      <section className="work-section section-wrap" id="work">
        <div className="section-heading">
          <div><p className="eyebrow">A glimpse of what’s possible</p><h2>Built to <em>belong.</em></h2></div>
          <p>Concept directions, made to show how a thoughtful online presence can feel.</p>
        </div>
        <div className="work-grid">
          <article className="work-card work-card-large">
            <div className="concept concept-grove">
              <div className="concept-top"><span>GROVE / CONCEPT</span><span>01—03</span></div>
              <div className="grove-sun" /><div className="grove-arch" /><div className="grove-type">ROOTED<br /><i>in care.</i></div>
              <div className="grove-bottom"><span>Everyday wellness, thoughtfully made.</span><span>↗</span></div>
            </div>
            <div className="work-meta"><div><p className="eyebrow">Studio concept · Wellness</p><h3>Grove, naturally</h3></div><span className="work-arrow"><ArrowUpRight size={18} /></span></div>
          </article>
          <article className="work-card">
            <div className="concept concept-table">
              <div className="table-sun" /><div className="table-card"><span>THE SUNDAY TABLE</span><strong>Gather<br /><i>slowly.</i></strong><small>GOOD FOOD · GOOD COMPANY</small></div>
              <div className="table-orbit orbit-one" /><div className="table-orbit orbit-two" />
            </div>
            <div className="work-meta"><div><p className="eyebrow">Studio concept · Hospitality</p><h3>Sunday, served</h3></div><span className="work-arrow"><ArrowUpRight size={18} /></span></div>
          </article>
          <article className="work-card">
            <div className="concept concept-studio">
              <div className="studio-top"><span>FORM / OBJECTS</span><span>EST. IN THE EVERYDAY</span></div>
              <div className="studio-object"><span /><span /><span /></div>
              <div className="studio-title">Made for<br /><i>living.</i></div>
              <div className="studio-bottom"><span>Objects with a little more thought.</span><span>Explore →</span></div>
            </div>
            <div className="work-meta"><div><p className="eyebrow">Studio concept · Retail</p><h3>Form & function</h3></div><span className="work-arrow"><ArrowUpRight size={18} /></span></div>
          </article>
        </div>
        <p className="concept-note">These are original studio concepts, not client projects.</p>
      </section>

      <section className="approach-section" id="approach">
        <div className="section-wrap approach-inner">
          <div className="approach-heading"><p className="eyebrow">From first thought to launch day</p><h2>Digital, without<br />the <em>detours.</em></h2><p>Clear steps. Direct collaboration. A site your customers can use and your team can own.</p></div>
          <div className="service-list">
            <article className="service-row"><span className="service-number">01</span><div><h3>Find your signal</h3><p>We get to know your business, your customers, and what a successful next step looks like.</p></div><span className="service-tag">Strategy</span></article>
            <article className="service-row"><span className="service-number">02</span><div><h3>Shape your story</h3><p>Positioning, words, and a visual identity that feel unmistakably like you.</p></div><span className="service-tag">Identity</span></article>
            <article className="service-row"><span className="service-number">03</span><div><h3>Build your home online</h3><p>A responsive, accessible website with the essentials your customers need to act.</p></div><span className="service-tag">Web design</span></article>
            <article className="service-row"><span className="service-number">04</span><div><h3>Make it yours</h3><p>We launch together, then hand over a site you can confidently keep growing.</p></div><span className="service-tag">Launch + care</span></article>
          </div>
        </div>
      </section>

      <section className="manifesto section-wrap">
        <div className="manifesto-mark">E<span>✳</span></div>
        <p>Modern doesn’t have to mean complicated.<br /><em>It should feel like you, at your best.</em></p>
        <span className="manifesto-foot">A LITTLE MORE HUMAN. A LOT MORE POSSIBLE.</span>
      </section>

      <section className="contact-section section-wrap" id="contact">
        <div className="contact-heading"><p className="eyebrow">Your next chapter starts here</p><h2>Let’s make<br />you <em>easier to find.</em></h2><p>Tell us a little about your business. We’ll take it from there.</p><a className="contact-email" href={`mailto:${CONTACT}`}>{CONTACT}<ArrowUpRight size={15} /></a></div>
        <form className="brief-form" onSubmit={sendBrief}>
          <label>Your name<input autoComplete="name" name="name" placeholder="How should we address you?" required /></label>
          <label>Your email<input autoComplete="email" name="email" type="email" placeholder="you@yourbusiness.com" required /></label>
          <label>Business name<input name="business" placeholder="The name on your door" required /></label>
          <label>What would you like to build?<textarea name="brief" placeholder="A new website, a refresh, or just exploring?" rows={3} required /></label>
          <button className="submit-button" type="submit">{sent ? "Email draft opened" : "Send your brief"}<ArrowUpRight size={17} /></button>
          <p className="form-note">Your email app will open with your brief ready to send. Nothing is stored on this website.</p>
        </form>
      </section>

      <footer className="site-footer section-wrap">
        <a className="wordmark footer-wordmark" href="#top"><span className="wordmark-symbol" aria-hidden="true"><i /><i /><i /></span><span>esper<span className="wordmark-light"> studio</span></span></a>
        <p>Thoughtful websites for the next version of your business.</p>
        <a className="back-top" href="#top">Back to top ↑</a>
        <span className="copyright">© {new Date().getFullYear()} Esper Studio</span>
      </footer>
    </main>
  );
}
