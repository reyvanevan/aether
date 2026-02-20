# AETHER — CONCEPT 01
**A Hyper-Premium E-Commerce Blueprint for KROMIA Agency**

AETHER is a conceptual, headless luxury e-Commerce platform built with an aesthetic driven by **Digital Brutalism** and **High-End 3D Visuals**. It serves as an exploration of cutting-edge web technologies, fusing traditional web layout practices with real-time, procedurally generated WebGL experiences.

## 🚀 Key Features

*   **The Quantum Core (Code-Only 3D Generation):** At the heart of the hero section lies an interactive 3D object constructed purely using `Three.js` primitive geometries and complex shaders (`MeshTransmissionMaterial` for the hyper-refractive glass shell and `MeshStandardMaterial` for the emissive inner node). No external `.gltf` or `.obj` files are used.
*   **"HUD" & Split-Level Typography:** A highly responsive user interface breaking away from traditional layouts. Leveraging Z-index layering, massive typography weaves *behind* and *in front* of the 3D scene. Information is distributed across the screen corners like a heads-up display.
*   **Unified State Interaction:** A seamless dialogue between standard DOM elements (HTML/CSS) and the 3D `<Canvas>`. Hovering over the brutalist HTML buttons instantly dictates the rotation speed, pulsation, and glow intensity of the 3D object via `Zustand`.
*   **Adaptive Viewport Rendering:** The WebGL elements automatically respond to screen dimensions (via React Three Fiber's `useThree().viewport`), smoothly shrinking on smaller mobile devices without overlapping the HUD, and maintaining majestic scale on desktop monitors.
*   **Fluid Animations & Scrolling:** `Framer Motion` handles staggered, silky-smooth entry animations for UI elements, while Studio Freight's `Lenis` provides flawless, momentum-based page scrolling.

## 💻 Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) (App Router structure)
*   **Language:** TypeScript
*   **WebGL Layer:** `three`, `@react-three/fiber`, `@react-three/drei`
*   **State Management:** `zustand` (For synchronizing state between HTML and the 3D Scene)
*   **Animation & Scrolling:** `framer-motion`, `lenis`
*   **Styling:** Pure Vanilla CSS (Implementing variables for strict digital brutalism logic, completely bypassing traditional macro frameworks like Tailwind)

## 📁 Project Architecture

*   `src/app/page.tsx`: Main entry point utilizing the absolute layout, Framer Motion entry animations, and the overarching HUD grid.
*   `src/components/ThreeCanvas.tsx`: The WebGL engine room containing the `QuantumCore`, particle field, dynamic lighting, and `OrbitControls`.
*   `src/app/globals.css`: Holds all Custom CSS variables, fonts (`Playfair Display`, `Inter`), typography clamp rules, and layout logic.
*   `src/store/useUIStore.ts`: Cross-environment state communication.
*   `src/components/SmoothScroll.tsx`: Global Lenis implementation wrapper.
*   `CONCEPTS_BLUEPRINT.md`: KROMIA's internal blueprint containing documentation of abstract 3D asset generation ideas.

## ⚡ Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/reyvanevan/aether.git
    cd aether
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open in Browser:**
    Navigate to [http://localhost:3000](http://localhost:3000)

## 📌 Roadmap & Future Iterations

*   Implementation of the **"Monolith"** and **"Aether Network"** product variants.
*   Integrating shader configurations into manageable JSON files for Headless CMS injections.
*   Scroll-linked WebGL timelines (Triggering 3D object transformations based on the `Lenis` scroll position).
