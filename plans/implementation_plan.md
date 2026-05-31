# Master Plan: Differential Geometry SBL Course Overhaul

**Audience:** Stanford senior-year Math/Engineering undergraduates
**Standard:** Rigorous, complete, challenging — must function as standalone lecture notes with live simulations
**Modules:** 9 existing modules (m2_1–m3_5), no new modules added

---

## Key Decisions (Locked)

| Decision | Resolution |
|---|---|
| **Manim** | ❌ Skipped entirely. All visualization is real-time interactive (Plotly/MathBox). |
| **IG Link field** | ❌ Removed from modules m2_1–m3_4. Only m3_5 is Information Geometry. |
| **Theory section** | Detailed lecture notes — not hidden behind a toggle. Must reference the visualization explicitly ("observe in the 3D panel that..."). Functions as a standalone reading. |
| **Rigor** | Every definition states hypotheses. Every theorem is either proved in the Workbench or cited (e.g., "Theorem 3.3.1, Lee Ch. 5"). Exercises are non-trivial. |

---

## Module Plans (Individual Files)

Each module has a dedicated plan document with full content specification:

| Module | Plan File | Status |
|---|---|---|
| m2_1 Charts & Atlases | [m2_1_plan.md](file:///home/scai/msr/aiy247541/.gemini/antigravity/brain/bcc57d2a-0a32-49b8-ab5c-ca02d7a15b8b/artifacts/modules/m2_1_plan.md) | ✅ |
| m2_2 Tangent Spaces | [m2_2_plan.md](file:///home/scai/msr/aiy247541/.gemini/antigravity/brain/bcc57d2a-0a32-49b8-ab5c-ca02d7a15b8b/artifacts/modules/m2_2_plan.md) | ✅ |
| m2_3 Pushforwards & Pullbacks | [m2_3_plan.md](file:///home/scai/msr/aiy247541/.gemini/antigravity/brain/bcc57d2a-0a32-49b8-ab5c-ca02d7a15b8b/artifacts/modules/m2_3_plan.md) | ✅ |
| m2_4 Tensor Algebra | [m2_4_plan.md](file:///home/scai/msr/aiy247541/.gemini/antigravity/brain/bcc57d2a-0a32-49b8-ab5c-ca02d7a15b8b/artifacts/modules/m2_4_plan.md) | ✅ |
| m3_1 Riemannian Metrics | [m3_1_plan.md](file:///home/scai/msr/aiy247541/.gemini/antigravity/brain/bcc57d2a-0a32-49b8-ab5c-ca02d7a15b8b/artifacts/modules/m3_1_plan.md) | ✅ |
| m3_2 Affine Connections | [m3_2_plan.md](file:///home/scai/msr/aiy247541/.gemini/antigravity/brain/bcc57d2a-0a32-49b8-ab5c-ca02d7a15b8b/artifacts/modules/m3_2_plan.md) | ✅ |
| m3_3 Levi-Civita Connection | [m3_3_plan.md](file:///home/scai/msr/aiy247541/.gemini/antigravity/brain/bcc57d2a-0a32-49b8-ab5c-ca02d7a15b8b/artifacts/modules/m3_3_plan.md) | ✅ |
| m3_4 Geodesics | [m3_4_plan.md](file:///home/scai/msr/aiy247541/.gemini/antigravity/brain/bcc57d2a-0a32-49b8-ab5c-ca02d7a15b8b/artifacts/modules/m3_4_plan.md) | ✅ |
| m3_5 Information Curvature | [m3_5_plan.md](file:///home/scai/msr/aiy247541/.gemini/antigravity/brain/bcc57d2a-0a32-49b8-ab5c-ca02d7a15b8b/artifacts/modules/m3_5_plan.md) | ✅ |

---

## `moduleData` Schema (Revised)

```js
{
  phase: "Phase 2: Smooth Manifolds",
  title: "Charts and Atlases",

  // 1-sentence motivator, always visible, large font
  hook: "Every map of the Earth is wrong. This module explains why.",

  // Full lecture notes in HTML+KaTeX. NOT hidden.
  // Must be standalone reading quality.
  // Must reference the visualization: "In the 3D panel, observe that..."
  // Must reference the Workbench: "Open the Algebra Workbench to verify..."
  theory: `<h4>...</h4><p>...</p>`,

  // SBL Task — the simulation challenge
  task: {
    mission: "What the student must do with the controls.",
    guiding_question: "What should they observe or conclude?",
    success_criteria: "What the simulation shows when they succeed.",
    hint: "Optional nudge."
  },

  controls: [...],  // existing
  stats: [...]      // existing
}
```

**Removed:** `intuition` (merged into theory), `ig_link` (removed except m3_5).

---

## UI Layout (Revised)

```
┌─────────────────────────────────────────────────────────┐
│  HOOK  (1 sentence, always visible, prominent)          │
├─────────────────────────────────────────────────────────┤
│  🎯 SIMULATION TASK                                     │
│  Mission: [task.mission]                                │
│  ❓ [task.guiding_question]                             │
│  [Show Hint] button                                     │
├─────────────────────────────────────────────────────────┤
│  INTERACTIVE PARAMETERS  (sliders/dropdowns)            │
├─────────────────────────────────────────────────────────┤
│  CALCULATED METRICS                                     │
├─────────────────────────────────────────────────────────┤
│  LECTURE NOTES                                          │
│  (Full theory — detailed, rigorous, references viz)     │
│  (Scrollable, not collapsed)                            │
└─────────────────────────────────────────────────────────┘
```

**Rationale:** Task is above the controls so the student reads the mission *before* touching sliders. Theory is below — a reference they scroll to when they want deeper understanding. This follows the SBL principle: **Goal → Action → Observation → Reflection (via theory)**.

---

## Engineering Roadmap

### Phase 0: POC on m3_4 Geodesics (1 week)
- Implement new schema for m3_4 only
- Build new left-pane layout (hook → task → controls → stats → theory)
- Build geodesic workbench in `geometry.py`
- Validate the full SBL loop end-to-end
- **Gate:** Does this feel like a Stanford-quality learning module?

### Phase 1: Schema + UI Rollout (1 week)
- Apply schema to all 9 modules (content from module plans)
- Deploy full UI restructuring (`index.html`, `css/style.css`)
- Add workbench active badge to tab

### Phase 2: Backend Workbench Expansion (1.5 weeks)
- Build workbench for m2_1, m2_2, m3_1, m3_4, m3_5 (currently missing)
- Extend `workbench.js` renderer for any new step types

### Phase 3: Content + Rigor Pass (1.5 weeks)
- Write all lecture-note theory referencing visualizations
- Write all task content (missions, questions, hints)
- Rigor review: hypotheses on definitions, theorem citations
- Update `numpy_snippets.js` to match new tasks

### Phase 4: Polish + QA (1 week)
- Visual quality assessment (Plotly vs MathBox2 decision)
- Cross-browser testing
- Performance profiling of `geometry.py` endpoints
- Accessibility pass

**Total: ~6 weeks**

---

## Open Questions

> [!IMPORTANT]
> **Proof Depth:** For m3_3, the plan includes the Koszul formula derivation (existence proof). Should we also include the full uniqueness argument? A complete proof adds ~1 page.

> [!IMPORTANT]
> **Problem Sets:** Should each module include 2-3 pen-and-paper exercises that transfer simulation insights to formal proofs? This is standard at Stanford but adds significant content scope.

> [!NOTE]
> **Visual Quality Gate:** Phase 0 will reveal whether Plotly is sufficient or we need MathBox2/Three.js for Stanford-quality rendering. This is the key technical risk.
