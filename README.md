# DataForge 2026 Pathway Track: Demonstration Coverage & Extrapolation

An interactive, single-file Streamlit application demonstrating how recurrent latent memory systems (inspired by BDH-CQ) fail or succeed in abstract reasoning tasks based on demonstration coverage.

## One-Sentence Claim
> "A model that learns from examples only works on new cases if those examples together cover every important rule. If any part of the rule is never shown, the model learns a simpler, wrong rule and fails."

---

## Architecture Overview

The app implements two curated ARC-style puzzle suites within a unified educational dashboard:

1. **Suite A: "The Barrier Collapse" (Gravity + Obstacle)**
   - Evaluates spatial physics rules (Gravity, Floor limits, and Obstacle/Barrier collision).
   - Exposes structural failure ("ghosting through barriers") when intermediate rule demonstrations are omitted.
2. **Suite B: "Parity & Color Inversion" (Geometric Transformation)**
   - Evaluates conditional logic rules based on shape dimensions (Odd copy vs. Even color inversion).
   - Exposes fallback behavior to trivial identity copying under incomplete coverage.

---

## Core Features Included

- **Interactive Suite Selector:** Toggle seamlessly between physics-based and geometric reasoning tasks.
- **Demonstration Toggle Matrix:** Check/uncheck individual demonstration cards to see immediate changes in latent memory and model predictions.
- **Recurrent Memory Visualizer ($h_t$):** Live updates of latent state vectors and norms following $h_{t+1} = \tanh(h_t + \eta \cdot \text{encode}(demo_t))$.
- **Hypothesis Space Barometer:** Real-time tracking of rule coverage scores and percentage completion.
- **Extrapolation Test Arena:** Side-by-side comparison of Model Prediction ($\hat{y}^-$$) versus Ground Truth ($y^*$).
- **Systematic Mistake Diagnostics:** Automated explanation of why the model adopted a spurious rule when coverage is incomplete.
- **Gamified "Coverage Detective" Mode:** 3 progressive challenge levels testing student diagnostic reasoning and minimal demo construction.
- **BDH-CQ Architecture Brief:** Complete technical breakdown mapping the toy model to real-world 150M parameter ARC solvers.

---

## Quickstart Installation & Execution

APP URL : https://streamlit-arc-puzzle-demo.vercel.app/
