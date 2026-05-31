# Module 2.1: Charts and Atlases

## Hook
Every map of the Earth is wrong in some way — this module explains why, and why that's actually fine.

## Simulation Task

**Mission:** Switch between North and South stereographic charts. Increase the boundary limit slider to its maximum. Identify the coordinate value at which the grid begins to degenerate (lines pile up near one point on the sphere).

**Guiding Question:** Can a single chart cover the entire sphere? What happens at the projection pole — why does the grid diverge there?

**Success Criteria:** The student observes that the projection pole is never covered (grid lines diverge to infinity). They conclude: a single chart cannot cover S², hence we need an atlas of ≥2 charts.

**Hint:** Try toggling between North and South charts at the same limit. Notice which regions each chart covers well.

## Theory (Lecture Notes Outline)

The theory section must be written as **detailed lecture notes**. Required content:

### Section 1: Topological Spaces and Manifolds
- **Definition (Topological Space):** A set X with a topology τ (collection of open sets). State the 3 axioms.
- **Definition (Topological Manifold):** A topological space M that is (i) Hausdorff, (ii) second-countable, (iii) locally homeomorphic to ℝⁿ. State each condition and explain why it's needed.
- *Visualization reference:* "The sphere S² in the 3D panel is a 2-dimensional manifold — every point has a neighborhood that looks like a patch of ℝ²."

### Section 2: Charts and Coordinate Systems
- **Definition (Chart):** A pair (U, φ) where U ⊂ M is open and φ: U → ℝⁿ is a homeomorphism onto an open subset of ℝⁿ.
- **Example:** Stereographic projection from the north pole. Derive the formula:
  $$\phi_N(x,y,z) = \left(\frac{x}{1-z}, \frac{y}{1-z}\right)$$
  and its inverse. Show this is a homeomorphism on S² \ {N}.
- *Visualization reference:* "In the 3D panel, select 'North Stereographic Projection.' The colored grid lines on the sphere are the images of a regular Cartesian grid in ℝ² under φ_N⁻¹."

### Section 3: Atlases and Smooth Structure
- **Definition (Atlas):** A collection {(Uα, φα)} of charts whose domains cover M.
- **Definition (Smooth Atlas):** An atlas where all transition maps are C∞.
- **Theorem:** S² requires at least 2 charts. *(State without proof; the simulation demonstrates the obstruction.)*
- *Visualization reference:* "Toggle to 'South Stereographic Projection' and observe that it covers the North Pole but misses the South Pole — the complement of what the North chart covers."

### Section 4: Transition Maps
- **Definition (Transition Map):** φ_β ∘ φ_α⁻¹ between overlapping charts.
- **Derivation:** Compute the north-to-south transition map explicitly:
  $$\phi_S \circ \phi_N^{-1}(u, v) = \left(\frac{u}{u^2+v^2}, \frac{v}{u^2+v^2}\right)$$
  Verify this is smooth (C∞) on its domain ℝ² \ {0}.
- **Definition (Diffeomorphism):** A smooth bijection with smooth inverse. Verify the transition map is a diffeomorphism.
- *Workbench reference:* "Open the Algebra Workbench to see this transition map computed step-by-step at the current grid point."

### Section 5: Why This Matters
- The chart formalism is the foundation of everything that follows. Tangent vectors, metrics, and connections are all defined *in coordinates* via charts, and must transform correctly under chart changes.
- This is why we need transition maps to be smooth — so that calculus (derivatives, integrals) transfers consistently between coordinate systems.

## Workbench Specification (NEW — currently missing)
Build workbench steps:
1. **Transition map computation:** Given (u_N, v_N), compute (u_S, v_S) step by step.
2. **Jacobian of transition map:** Show the 2×2 Jacobian matrix ∂(u_S,v_S)/∂(u_N,v_N).
3. **Verification:** det(J) ≠ 0 confirms it's a local diffeomorphism.

## Backend Changes (`geometry.py`)
- Add `compute_transition_map_workbench(u, v, chart_type)` function.
- Return workbench dict with steps for transition map, Jacobian, determinant.

## Controls (Keep existing)
- Chart type selector (North/South)
- Boundary limit slider

## Stats (Keep existing)
- Chart type label
- Coordinate area label
