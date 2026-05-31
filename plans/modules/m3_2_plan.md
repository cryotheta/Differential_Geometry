# Module 3.2: Affine Connections and Parallel Transport

## Hook
On a curved surface, "moving a vector without rotating it" is non-trivial. The connection defines what "not rotating" means.

## Simulation Task

**Mission:** Use the "Geodesic Triangle" path. Record the holonomy angle from the metrics panel. Now switch to the "Latitude Circle" path (θ = π/4). Record its holonomy angle. Compute the expected analytical holonomy for the latitude circle: 2π(1 − cos θ) = 2π(1 − cos(π/4)) = 2π(1 − √2/2) ≈ 1.840 rad ≈ 105.4°. Does the simulation agree?

**Guiding Question:** The holonomy of a loop on S² equals the solid angle (area) it encloses. The geodesic triangle encloses 1/8 of the sphere (solid angle = π/2). Does the simulated holonomy match π/2 radians = 90°?

**Success Criteria:** Student verifies both predictions: triangle holonomy ≈ 90° (from area = π/2), latitude circle holonomy ≈ 105° (from formula 2π(1−cos θ)). They connect holonomy to enclosed curvature — a preview of Gauss-Bonnet.

**Hint:** The Gauss-Bonnet theorem states: holonomy = ∫∫ K dA, where K = 1 for the unit sphere. For the triangle, the enclosed area is π/2 (an octant of the unit sphere).

## Theory (Lecture Notes Outline)

### Section 1: The Problem of Differentiation on Manifolds
- **Motivating Problem:** On ℝⁿ, we compare vectors at different points by translating them. On a manifold, tangent spaces at p and q are *different vector spaces*. There is no canonical way to identify T_pM with T_qM.
- **Consequence:** The expression "V(q) − V(p)" is meaningless on a manifold. We need a *connection* to define derivatives of vector fields.

### Section 2: The Affine Connection
- **Definition (Affine Connection):** A map ∇: 𝔛(M) × 𝔛(M) → 𝔛(M), written ∇_X Y, satisfying:
  1. ∇_{fX+gY} Z = f∇_X Z + g∇_Y Z (C∞-linear in first argument)
  2. ∇_X (Y + Z) = ∇_X Y + ∇_X Z (additive in second argument)
  3. ∇_X (fY) = (Xf)Y + f∇_X Y (Leibniz rule in second argument)
- **Definition (Christoffel Symbols):** In coordinates, ∇_{∂_i} ∂_j = Σ_k Γ^k_{ij} ∂_k. The Christoffel symbols are the n³ functions that specify the connection.
- **Covariant Derivative of a Vector Field:** (∇_X Y)^k = X(Y^k) + Σ_{i,j} Γ^k_{ij} X^i Y^j.

### Section 3: Parallel Transport
- **Definition:** A vector field V along a curve γ is parallel if ∇_{γ̇} V = 0.
- **ODE System:** In coordinates: dV^k/dt + Σ_{i,j} Γ^k_{ij} V^i dγ^j/dt = 0. This is a linear first-order ODE.
- **Key Property:** Parallel transport preserves the vector in the sense defined by the connection. It is path-dependent on curved manifolds.
- *Visualization reference:* "The green arrows along the path are the parallel-transported vector V at each sample point. The pink arrow (start) and cyan arrow (end) show the holonomy rotation."
- *Workbench reference:* "The Algebra Workbench shows the ODE computation at each sample point: the Christoffel symbols Γ^k_ij, the velocity dγ/dt, and the resulting dV/dt term by term."

### Section 4: Holonomy
- **Definition:** The holonomy of a loop γ is the linear map Hol(γ): T_pM → T_pM obtained by parallel transporting around γ and back to p.
- **Theorem (for S²):** The rotation angle of Hol(γ) equals the solid angle enclosed by γ.
- **Proof Idea:** This follows from Stokes' theorem applied to the curvature 2-form. The curvature R is the "infinitesimal holonomy."
- *Visualization reference:* "The 'Holonomy Angle Error' in the metrics panel is the angle between the pink (start) and cyan (end) vectors."

### Section 5: The Norm Preservation Question
- **Key Question:** Does parallel transport preserve the length ‖V‖²_g = g_ij V^i V^j? Not necessarily — it depends on whether the connection is *metric-compatible* (∇g = 0).
- **Simulation Evidence:** The Workbench's norm check verifies that ‖V‖²_g is constant along the path. This is because the sphere's standard connection *is* metric-compatible (it is the Levi-Civita connection — module m3_3).
- This motivates the next module: among all possible connections, is there a "best" one? The answer is yes — the Levi-Civita connection.

## Workbench (EXISTS ✅)
4 steps: Christoffel table → ODE breakdown → Norm preservation → Holonomy verification.

## Controls (Keep existing)
- Path type selector (Geodesic Triangle / Latitude Circle)

## Stats (Keep existing)
- Holonomy angle
