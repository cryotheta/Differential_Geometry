# Module 3.3: The Levi-Civita Connection

## Hook
Among all possible connections on a Riemannian manifold, there is exactly one that preserves lengths and has no torsion. It is completely determined by the metric.

## Simulation Task

**Mission:** On the Sphere, move the point to θ = π/2, φ = 0 (equator). Record the Christoffel symbols from the metrics panel. Now move to θ = π/4 (45° latitude). Record again. For the sphere, the analytical values are Γ^θ_φφ = −sin θ cos θ and Γ^φ_θφ = cot θ. Verify the simulation matches.

**Guiding Question:** Switch to the Torus. Move to the outermost point of the torus (v = 0) and then to the innermost point (v = π). How do the Christoffel symbols differ? What does this tell you about the intrinsic geometry at these two locations?

**Success Criteria:** Student verifies analytical formulas numerically. On the torus, they observe that Christoffel symbols vanish at v = 0 and v = π (where sin(v) = 0) — these are the points of zero extrinsic curvature in the minor direction.

**Hint:** The Workbench shows the full derivation: each Γ^k_ij is computed from g_ij and its derivatives via the Koszul formula. Check that the numerical and analytical values agree to 4 decimal places.

## Theory (Lecture Notes Outline)

### Section 1: Metric Compatibility
- **Definition:** A connection ∇ is metric-compatible if ∇g = 0. Equivalently: for any vector fields V, W and any curve γ,
  $$\frac{d}{dt} g(\tilde{V}, \tilde{W}) = 0$$
  where $\tilde{V}, \tilde{W}$ are the parallel transports of V, W along γ.
- **Consequence:** Parallel transport preserves lengths and angles. *(This was verified numerically in m3_2's norm check.)*
- **Non-Example:** A connection that scales vectors during transport (Γ^k_ij = δ^k_i δ^0_j, for instance) would not be metric-compatible.

### Section 2: Torsion
- **Definition (Torsion Tensor):** T(X, Y) = ∇_X Y − ∇_Y X − [X, Y].
- **In coordinates:** T^k_{ij} = Γ^k_{ij} − Γ^k_{ji}. A connection is torsion-free iff Γ^k_{ij} = Γ^k_{ji} (symmetry in lower indices).
- **Geometric Meaning:** Torsion measures intrinsic twisting of the space. A torsion-free connection means that infinitesimal parallelograms close — the Lie bracket [X,Y] accounts for all the "failure to commute."

### Section 3: The Fundamental Theorem of Riemannian Geometry
- **Theorem:** On any Riemannian manifold (M, g), there exists a unique affine connection ∇ that is (i) metric-compatible and (ii) torsion-free. This connection is called the **Levi-Civita connection**.
- **Proof (Existence via Koszul Formula):**
  Start from metric compatibility: X g(Y,Z) = g(∇_X Y, Z) + g(Y, ∇_X Z). Write three cyclic permutations of (X,Y,Z), add the first two, subtract the third, and use torsion-free + Lie bracket identities to isolate:
  $$2g(\nabla_X Y, Z) = Xg(Y,Z) + Yg(X,Z) - Zg(X,Y) + g([X,Y],Z) - g([X,Z],Y) - g([Y,Z],X)$$
  Since g is non-degenerate, this uniquely determines ∇_X Y. ∎
- **Christoffel Symbol Formula:** In coordinates (where [∂_i, ∂_j] = 0):
  $$\Gamma^k_{ij} = \frac{1}{2} \sum_l g^{kl} \left( \frac{\partial g_{jl}}{\partial x^i} + \frac{\partial g_{il}}{\partial x^j} - \frac{\partial g_{ij}}{\partial x^l} \right)$$
- *Workbench reference:* "The Algebra Workbench derives each Christoffel symbol from this formula: it shows g, g⁻¹, the partial derivatives ∂g/∂x^i, and the 3-term sum for each (k,i,j)."

### Section 4: Worked Examples
- **Sphere S²:** From g = diag(1, sin²θ), derive Γ^θ_φφ = −sin θ cos θ and Γ^φ_θφ = cot θ analytically. Show all intermediate steps: ∂g/∂θ, ∂g/∂φ, g⁻¹, and the summation.
- **Torus T²:** From g = diag((R+r cos v)², r²), derive Γ^u_uv = −r sin v/(R+r cos v) and Γ^v_uu = (R+r cos v) sin v / r.
- **Verification:** Compare analytical values with the Workbench's numerical derivatives at the selected point.

## Workbench (EXISTS ✅)
4 steps: Metric pair (g, g⁻¹) → Metric derivatives → Christoffel derivation with l-term expansion → (no verification step yet — add one comparing numerical to analytical).

## Backend Changes (`geometry.py`)
- Add an analytical comparison step to the workbench output in `compute_levicivita_workbench()`.

## Controls (Keep existing)
- Manifold selector, u, v

## Stats (Keep existing)
- Selected Christoffel symbols
