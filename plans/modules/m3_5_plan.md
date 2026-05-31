# Module 3.5: Information Curvature and Statistical Manifolds

## Hook
The family of Gaussian distributions forms a curved space with constant negative curvature — it is a copy of the hyperbolic plane.

## Simulation Task

**Mission:** Place distribution 1 at (μ₁ = −2, σ₁ = 0.5) and distribution 2 at (μ₂ = 2, σ₂ = 0.5) — same width, different means. Observe the geodesic path in the (μ, σ) plane. Does it travel in a straight horizontal line, or does it dip *downward* (through smaller σ)?

Now set μ₁ = μ₂ = 0, σ₁ = 0.5, σ₂ = 2.5 — same mean, different widths. What shape is the geodesic now?

**Guiding Question:** The geodesic between two equal-width Gaussians at different means dips toward smaller σ. Interpret this geometrically: in the Poincaré half-plane, geodesics are semicircles. Interpret this statistically: why is it "cheaper" (in Fisher distance) to pass through a sharper distribution?

**Success Criteria:** Student observes the semicircular geodesic dip and connects it to the hyperbolic metric ds² = (dx² + dy²)/y². At small y (small σ), the metric is *large* — each step covers more Fisher distance. So the geodesic bends toward larger y first (wider σ), travels cheaply in the "fast lane," then descends again. For equal means with different σ, the geodesic is a vertical line segment.

**Hint:** In the Poincaré half-plane, the "speed of travel" is inversely proportional to y (= √2 σ). Near the boundary y → 0, distances become infinite — like approaching a black hole horizon.

## Theory (Lecture Notes Outline)

### Section 1: Statistical Models as Manifolds
- **Setup:** Let {p(x; θ) : θ ∈ Θ ⊂ ℝⁿ} be a parametric family of probability distributions. The parameter space Θ is an n-dimensional manifold.
- **Example:** The 1D normal family N(μ, σ²) has parameter space Θ = ℝ × ℝ₊ — a 2D manifold (the upper half-plane).
- **Smooth Structure:** The map θ ↦ p(·; θ) is smooth (assuming regularity conditions). A chart on Θ is simply a reparametrization.

### Section 2: The Fisher Information Matrix as a Riemannian Metric
- **Definition (Score Function):** s_i(x; θ) = ∂ log p(x; θ)/∂θ^i. This is a random variable.
- **Definition (Fisher Information Matrix):**
  $$g_{ij}(\theta) = \mathbb{E}_{X \sim p_\theta}\left[\frac{\partial \log p(X;\theta)}{\partial \theta^i} \frac{\partial \log p(X;\theta)}{\partial \theta^j}\right]$$
- **Theorem (Rao, 1945):** The FIM defines a Riemannian metric on the statistical manifold, called the **Fisher-Rao metric**. *(Verify: it is symmetric by commutativity of multiplication, positive-definite by Cauchy-Schwarz, smooth by the regularity conditions.)*
- **Theorem (Čencov, 1982):** The Fisher-Rao metric is the *unique* Riemannian metric (up to scaling) that is invariant under sufficient statistics. This is why it is the canonical metric on statistical manifolds.
- **Worked Example (Normal Distribution):** Compute g_ij for N(μ, σ):
  - log p = −½ log(2πσ²) − (x−μ)²/(2σ²)
  - ∂/∂μ log p = (x−μ)/σ²
  - ∂/∂σ log p = −1/σ + (x−μ)²/σ³
  - g_μμ = E[(x−μ)²/σ⁴] = 1/σ²
  - g_σσ = E[(−1/σ + (x−μ)²/σ³)²] = 2/σ²
  - g_μσ = E[(x−μ)/σ² · (−1/σ + (x−μ)²/σ³)] = 0
  - **Result:** ds² = dμ²/σ² + 2dσ²/σ²

### Section 3: The Poincaré Half-Plane Isometry
- **Coordinate Change:** Let x = μ, y = √2 σ. Then ds² = (dx² + dy²)/y².
- This is the standard **Poincaré half-plane metric** — the canonical model of 2D hyperbolic geometry.
- **Scalar Curvature:** R = −1 (constant negative curvature). *(State the computation; the full Riemann tensor derivation is a significant exercise.)*
- *Visualization reference:* "The 'Scalar Curvature R' in the metrics panel reads −1.0 (Constant) — confirming this is a space of constant negative curvature."

### Section 4: Geodesics in the Statistical Manifold
- **Theorem:** Geodesics of the Poincaré half-plane are:
  1. Vertical lines (x = const), and
  2. Semicircles with center on the x-axis (y = 0 boundary).
- **Derivation:** The geodesic equation for ds² = (dx²+dy²)/y² yields: the center x_c of the semicircle is x_c = ((x₂²−x₁²)+(y₂²−y₁²))/(2(x₂−x₁)), radius R = √((x₁−x_c)²+y₁²).
- **Fisher Distance:** d(p₁, p₂) = arccosh(1 + ((μ₁−μ₂)² + 2(σ₁−σ₂)²)/(2σ₁σ₂)).
- *Visualization reference:* "The purple curve in the (μ, σ) plane is the geodesic. The small green PDF curves at sampled points show how the distribution shape changes along the path."
- *Workbench reference:* "The Algebra Workbench shows the Fisher metric computation and the geodesic arc length integral."

### Section 5: Interpretation and Applications
- **Geodesic Distance as Divergence:** The Fisher distance locally approximates the KL divergence: d²(θ, θ+dθ) ≈ Σ g_ij dθ^i dθ^j. This connects Riemannian geometry to hypothesis testing and estimation theory.
- **Natural Gradient:** The natural gradient of a loss function ℓ(θ) is g⁻¹ ∇ℓ — the gradient *adjusted for the curvature of parameter space*. This is why natural gradient descent converges faster than standard gradient descent for neural network training (Amari, 1998).
- **Cramér-Rao Bound:** The Fisher information matrix sets the lower bound on the variance of unbiased estimators: Var(θ̂) ≥ g⁻¹. The geometry of the statistical manifold determines the fundamental limits of estimation.

## Workbench Specification (NEW — currently missing)
1. **Fisher metric derivation:** Show the 4 entries of g_ij computed from E[score_i · score_j].
2. **Metric at endpoints:** Display g(θ₁) and g(θ₂).
3. **Geodesic arc length:** Numerical integration ∫ √(g_ij γ̇^i γ̇^j) dt along the geodesic. Compare to the closed-form arccosh formula.

## Backend Changes (`geometry.py`)
- Add workbench dict to `run_statistical_manifold()`.
- Compute Fisher metric at start/end points.
- Numerically integrate arc length along the geodesic path.

## Controls (Keep existing)
- μ₁, σ₁, μ₂, σ₂

## Stats (Keep existing)
- Scalar curvature R = −1
- Fisher distance
