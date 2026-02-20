"use client";

import ThreeCanvas from "@/components/ThreeCanvas";
import { useUIStore } from "@/store/useUIStore";
import { motion } from "framer-motion";

export default function Home() {
  const setHoveringButton = useUIStore((state) => state.setHoveringButton);
  const hasInteracted = useUIStore((state) => state.hasInteracted);

  return (
    <main>
      <section className="hero">
        {/* Z=5: Background Massive Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="split-text-bg"
        >
          THE QUANTUM
        </motion.div>

        {/* Z=10: The 3D Canvas */}
        <ThreeCanvas />

        {/* Z=20: Foreground Overlapping Text */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
          className="split-text-fg"
        >
          CORE
        </motion.div>

        {/* HUD Elements (Z=30+) */}

        {/* HUD: Bottom Left (Mission Statement) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="hud-element hud-bottom-left"
        >
          <p className="hud-desc mb-2">
            Engineered for unparalleled processing power. A synthetic intelligence node designed with ruthless aesthetics and uncompromised performance.
          </p>
          <p className="hud-mono" style={{ fontSize: '0.65rem' }}>
            // AETHER_SYS_v2.0.4
          </p>
        </motion.div>

        {/* HUD: Middle Right (Data Diagnostics) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="hud-element hud-middle-right"
        >
          <div className="hud-data-item">
            <span className="hud-mono">STATUS</span>
            <span className="hud-mono" style={{ color: '#0f0' }}>ONLINE</span>
          </div>
          <div className="hud-data-item">
            <span className="hud-mono">TEMP</span>
            <span className="hud-mono">0.04K</span>
          </div>
          <div className="hud-data-item">
            <span className="hud-mono">LATENCY</span>
            <span className="hud-mono">0.00ms</span>
          </div>
        </motion.div>

        {/* HUD: Bottom Right (Action) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="hud-element hud-bottom-right"
        >
          <div
            className="hud-indicator"
            onMouseEnter={() => setHoveringButton(true)}
            onMouseLeave={() => setHoveringButton(false)}
          >
            INITIALIZE SEQUENCE
          </div>
        </motion.div>

        {/* Interaction Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hasInteracted ? 0 : 0.7 }}
          transition={{ duration: 1, delay: 2.5 }}
          style={{
            position: 'absolute',
            bottom: 'var(--spacing-md)',
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            zIndex: 40
          }}
          className="hud-mono"
        >
          [ Drag to inspect core ]
        </motion.div>
      </section>

      <section className="section">
        <div className="container">
          <div className="product-info">
            <div>
              <h2 style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>Aether<br />Concept 01</h2>
              <p className="product-desc">
                Defying traditional computation. The Core is encased in an ultra-refractive transmission shell, utilizing multi-dimensional floating nodes for zero-latency data processing. Built for the elite.
              </p>
            </div>
            <div>
              <ul className="spec-list">
                <li className="spec-item">
                  <span>Architecture</span>
                  <span>Neural Synaptic Web</span>
                </li>
                <li className="spec-item">
                  <span>Encasement</span>
                  <span>Hyper-Glass Shield</span>
                </li>
                <li className="spec-item">
                  <span>Processing</span>
                  <span>244 YottaFLOPS</span>
                </li>
                <li className="spec-item">
                  <span>Availability</span>
                  <span>By Invitation Only</span>
                </li>
              </ul>
              <button className="brutalist-button" style={{ marginTop: 'var(--spacing-md)', width: '100%', textAlign: 'center' }}>
                View Full Documentation
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: 'white' }}>
        <h2 style={{ fontSize: '5vw', textAlign: 'center' }}>Omniscient.</h2>
      </section>
    </main>
  );
}
