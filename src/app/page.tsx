import ThreeCanvas from "@/components/ThreeCanvas";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <ThreeCanvas />
        <div style={{ zIndex: 10, pointerEvents: 'none' }}>
          <h1 className="hero-title">
            The Shape<br />Of Future
          </h1>
          <p className="hero-subtitle">
            Engineered for pure performance and ruthless elegance. An exclusive piece created with zero compromises for the modern elite.
          </p>
          <button className="brutalist-button" style={{ pointerEvents: 'auto' }}>
            Pre-Order Now
          </button>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="product-info">
            <div>
              <h2 style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>Aether<br />Concept 01</h2>
              <p className="product-desc">
                Defying gravity and convention. The Concept 01 is milled from a single block of aerospace-grade titanium. It utilizes advanced magnetic levitation technology internally to reduce friction to absolute zero.
              </p>
            </div>
            <div>
              <ul className="spec-list">
                <li className="spec-item">
                  <span>Material</span>
                  <span>Grade-5 Titanium</span>
                </li>
                <li className="spec-item">
                  <span>Core</span>
                  <span>Magnetic Levitation</span>
                </li>
                <li className="spec-item">
                  <span>Weight</span>
                  <span>142g</span>
                </li>
                <li className="spec-item">
                  <span>Production</span>
                  <span>Limited to 100</span>
                </li>
              </ul>
              <button className="brutalist-button" style={{ marginTop: 'var(--spacing-md)', width: '100%', textAlign: 'center' }}>
                View Full Specifications
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: 'white' }}>
        <h2 style={{ fontSize: '5vw', textAlign: 'center' }}>Uncompromising.</h2>
      </section>
    </main>
  );
}
