import { useEffect } from "react";
import { Link } from "react-router-dom";
import heroImage from "https://static.igem.wiki/teams/6212/wiki/duckweed-dawn.avif";

const pathogenCards = [
  { icon: "virus", name: "Viruses" },
  { icon: "bacteria", name: "Bacteria" },
  { icon: "mycoplasma", name: "Mycoplasma" },
  { icon: "protozoa", name: "Protozoa" },
];

function PixelIcon({ type }: { type: string }) {
  return (
    <svg className={`pixel-icon pixel-icon-${type}`} viewBox="0 0 16 16" role="img" aria-label={type} shapeRendering="crispEdges">
      {type === "virus" && <><rect x="5" y="5" width="6" height="6"/><rect x="7" y="1" width="2" height="3"/><rect x="7" y="12" width="2" height="3"/><rect x="1" y="7" width="3" height="2"/><rect x="12" y="7" width="3" height="2"/><rect x="3" y="3" width="2" height="2"/><rect x="11" y="3" width="2" height="2"/><rect x="3" y="11" width="2" height="2"/><rect x="11" y="11" width="2" height="2"/><rect className="pixel-icon-light" x="7" y="7" width="2" height="2"/></>}
      {type === "bacteria" && <><rect x="3" y="4" width="10" height="8"/><rect x="2" y="6" width="12" height="4"/><rect className="pixel-icon-light" x="5" y="6" width="2" height="2"/><rect className="pixel-icon-light" x="9" y="9" width="2" height="1"/><rect x="13" y="3" width="1" height="2"/><rect x="14" y="2" width="1" height="1"/></>}
      {type === "mycoplasma" && <><rect x="3" y="3" width="7" height="3"/><rect x="2" y="5" width="11" height="6"/><rect x="5" y="10" width="7" height="3"/><rect className="pixel-icon-light" x="5" y="6" width="2" height="2"/><rect className="pixel-icon-light" x="9" y="8" width="2" height="2"/><rect x="1" y="8" width="2" height="1"/><rect x="12" y="12" width="2" height="1"/></>}
      {type === "protozoa" && <><rect x="5" y="2" width="6" height="2"/><rect x="3" y="4" width="10" height="8"/><rect x="5" y="12" width="6" height="2"/><rect x="2" y="6" width="2" height="4"/><rect x="12" y="6" width="2" height="4"/><rect className="pixel-icon-light" x="5" y="5" width="3" height="3"/><rect className="pixel-icon-light" x="9" y="9" width="2" height="2"/></>}
    </svg>
  );
}

export function Home() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = document.querySelectorAll<HTMLElement>(".farm-home [data-reveal]");
    const hero = document.querySelector<HTMLElement>(".farm-hero");

    if (reducedMotion) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.16 },
    );
    revealItems.forEach((item) => observer.observe(item));

    let frame = 0;
    const handleScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        hero?.style.setProperty("--farm-scroll", `${Math.min(window.scrollY * 0.18, 150)}px`);
        document.documentElement.style.setProperty("--scroll-y", `${window.scrollY}px`);
        frame = 0;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <main className="farm-home">
      <section
        className="farm-hero"
        style={{ backgroundImage: `url(${heroImage})` }}
        aria-labelledby="home-title"
      >
        <div className="farm-hero-shade" />
        <div className="farm-hero-copy" data-reveal="hero">
          <p className="pixel-kicker"><span /> SCU-CHINA · iGEM 2026</p>
          <h1 id="home-title">
            Small leaf.<br />
            <em>Big protection.</em>
          </h1>
          <p className="farm-hero-lead">
            Engineering duckweed into a plant-based vaccine platform for
            stronger mucosal immunity in livestock and poultry.
          </p>
          <div className="farm-actions">
            <Link className="farm-button farm-button-primary" to="/description">
              Explore our project <span aria-hidden="true">→</span>
            </Link>
            <a className="farm-button farm-button-ghost" href="#story">
              Start the story <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
        <div className="farm-season" aria-label="Project status" data-reveal="hero">
          <span className="farm-sun" aria-hidden="true">✦</span>
          <div><small>SEASON</small><strong>2026 · GROWING</strong></div>
        </div>
      </section>

      <section className="farm-intro" id="story" data-reveal="up">
        <div className="farm-eyebrow">THE CHALLENGE</div>
        <h2>Protection should begin<br />where infection begins.</h2>
        <p className="farm-intro-copy">
          Bronchial and intestinal mucosal diseases spread quickly through
          farms. By damaging the body&apos;s first barriers, they can trigger
          inflammation, secondary infections, reduced growth and severe losses.
        </p>
        <div className="pathogen-grid">
          {pathogenCards.map((card) => (
            <article className="pathogen-card" key={card.name} data-reveal="card">
              <PixelIcon type={card.icon} />
              <h3>{card.name}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="farm-problem">
        <div className="farm-problem-art" aria-hidden="true" data-reveal="left">
          <div className="pixel-pond">
            <span className="leaf leaf-one" />
            <span className="leaf leaf-two" />
            <span className="leaf leaf-three" />
            <span className="pond-ripple" />
          </div>
          <p>LEMNA MINOR</p>
        </div>
        <div className="farm-problem-copy" data-reveal="right">
          <div className="farm-eyebrow">WHY DUCKWEED?</div>
          <h2>A living platform,<br />built to do more.</h2>
          <p>
            Today&apos;s vaccines and adjuvants can struggle to create durable
            respiratory and intestinal protection. Our goal is to turn duckweed
            into a full-function vaccine platform that accurately expresses viral
            antigens while enhancing mucosal immune protection.
          </p>
          <div className="feature-list">
            <div data-reveal="list"><span>01</span><p><strong>Plant-based production</strong>Scalable expression in a compact aquatic crop.</p></div>
            <div data-reveal="list"><span>02</span><p><strong>Accurate antigen expression</strong>Designed around the pathogen target.</p></div>
            <div data-reveal="list"><span>03</span><p><strong>Mucosal protection</strong>Focused on the barriers pathogens attack first.</p></div>
          </div>
          <Link className="text-link" to="/engineering">See how we are building it →</Link>
        </div>
      </section>

      <section className="farm-journey">
        <div data-reveal="up">
          <div className="farm-eyebrow">FROM POND TO PROTECTION</div>
          <h2>Follow the growing season.</h2>
        </div>
        <nav className="journey-path" aria-label="Explore project chapters">
          <Link to="/description" data-reveal="step"><span>01</span><strong>Discover</strong><small>The need</small></Link>
          <i aria-hidden="true" />
          <Link to="/engineering" data-reveal="step"><span>02</span><strong>Engineer</strong><small>The platform</small></Link>
          <i aria-hidden="true" />
          <Link to="/experiments" data-reveal="step"><span>03</span><strong>Test</strong><small>The design</small></Link>
          <i aria-hidden="true" />
          <Link to="/human-practices" data-reveal="step"><span>04</span><strong>Connect</strong><small>The world</small></Link>
        </nav>
      </section>
    </main>
  );
}
