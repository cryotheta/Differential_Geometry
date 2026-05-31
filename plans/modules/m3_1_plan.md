# Module 3.1: The Riemannian Metric

## Hook
A metric tensor assigns a ruler to every point of a curved space. Different rulers at different points is what makes geometry non-Euclidean.

## Simulation Task

**Mission:** Select the Sphere. Drag θ (latitude) from near 0 (pole) toward π/2 (equator). Watch the Tissot indicatrix ellipse change size and shape. Record the determinant det(g) at θ = 0.3 and θ = π/2. Now switch to the Torus and repeat: move u around the torus and observe how the indicatrix stretches on the inner vs outer edge.

**Guiding Question:** On the sphere, the indicatrix is always a *circle* but its size changes. Why? (Hint: g_θθ = 1, g_φφ = sin²θ — the metric is diagonal but not the identity.) On the torus, the indicatrix becomes an *ellipse* on the inner edge. What does this tell you about the anisotropy of the metric there?

**Success Criteria:** Student connects indicatrix size to det(g): larger determinant → more "volume distortion." On the sphere, det(g) = sin²θ → 0 at poles (indicatrix shrinks). On the torus inner edge (u near π), the circumferential metric component shrinks, making the indicatrix elongated.

**Hint:** For the Poincaré half-plane, move y upward from 0.1 to 3. The indicatrix *grows* — meaning the metric *shrinks*. In the upper half-plane, distances get cheaper as you move away from the boundary.

## Theory (Lecture Notes Outline)

### Section 1: Inner Products on Vector Spaces (Review)
- **Definition (Inner Product):** A symmetric, positive-definite bilinear form ⟨·,·⟩: V × V → ℝ.
- **Matrix Representation:** ⟨v, w⟩ = vᵀ G w for some SPD matrix G. When G = I, this is the standard dot product.
- **Why SPD?** Positive-definite ensures ‖v‖² = ⟨v,v⟩ > 0 for all v ≠ 0.

### Section 2: The Riemannian Metric
- **Definition:** A Riemannian metric g on M assigns to each p ∈ M an inner product g_p on T_pM that varies smoothly with p.
- **Component Form:** g = Σ g_ij dx^i ⊗ dx^j, where g_ij(p) = g_p(∂/∂x^i, ∂/∂x^j).
- **Example (Sphere):** Derive g from the embedding. The inclusion ι: S² → ℝ³ gives g = ι*(g_Euclidean). In spherical coordinates: ds² = dθ² + sin²θ dφ². Thus g_θθ = 1, g_φφ = sin²θ, g_θφ = 0.
- **Example (Torus):** ds² = (R + r cos v)² du² + r² dv².
- **Example (Poincaré Half-Plane):** ds² = (dx² + dy²)/y². This is the *hyperbolic metric* — constant negative curvature.
- *Visualization reference:* "The metric tensor shown in the metrics panel is g_ij at the selected point. On the sphere, it's always diagonal — the coordinate directions are orthogonal."

### Section 3: Measuring with the Metric
- **Length of a tangent vector:** ‖V‖ = √(g_ij V^i V^j).
- **Angle between vectors:** cos α = g(V,W) / (‖V‖ ‖W‖).
- **Length of a curve:** L(γ) = ∫ √(g_ij γ̇^i γ̇^j) dt. This integral depends on the metric and is the foundation for geodesics (m3_4).
- **Volume element:** dVol = √(det g) dx¹ ∧ ... ∧ dxⁿ. This is why det(g) matters.

### Section 4: Tissot's Indicatrix
- **Definition:** The Tissot indicatrix at p is the image of the unit circle {V ∈ T_pM : g_ij V^i V^j = ε²} projected into coordinate space.
- **Computation:** Factor g = VDVᵀ (eigendecomposition). The unit circle in T_pM maps to an ellipse with semi-axes proportional to 1/√(eigenvalues of g).
- **Interpretation:** Where the indicatrix is large, the metric is weak (distances are "cheap"). Where it's small, the metric is strong (distances are "expensive").
- *Visualization reference:* "The orange ellipse on the surface is the Tissot indicatrix. Its shape encodes the full local geometry of the metric."
- *Workbench reference:* "Open the Algebra Workbench to see the eigendecomposition of g and the indicatrix computation."

### Section 5: Coordinate Invariance of Metric Quantities
- **Theorem:** Lengths, angles, and volumes computed from g are invariant under coordinate changes. *(This follows from the pullback transformation rule: g'_ij = Jᵀ g J, which is exactly what we proved in m2_4.)*
- This is the payoff of the tensor transformation machinery — the metric *components* change, but all geometric measurements stay the same.

## Workbench Specification (NEW — currently missing)
1. **Metric tensor display:** g and g⁻¹ as matrix pair with det(g).
2. **Eigendecomposition:** g = VDVᵀ, show eigenvalues and eigenvectors.
3. **Indicatrix computation:** Show g⁻¹/² applied to the unit circle, resulting in the ellipse axes.

## Backend Changes (`geometry.py`)
- Add workbench dict to the `/api/metric` response.
- Compute eigendecomposition of g and return as structured steps.

## Controls (Keep existing)
- Manifold selector (Sphere/Torus/Poincaré)
- u, v coordinates

## Stats (Keep existing + add)
- g_ij, det(g)
- **Add:** Eigenvalues λ₁, λ₂
