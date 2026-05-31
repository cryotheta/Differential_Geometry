# Module 3.4: Geodesics

## Hook
A geodesic is not just the "shortest path." It is the path a free particle follows in curved space — the straight line generalized.

## Simulation Task

**Mission:** On the **Torus**, set start_u=1.5, start_v=0.5. Set vel_u=0.5, vel_v=1.0 (ratio vel_v/vel_u = 2). Observe the geodesic — does it close into a loop? Now change to vel_v=1.5 (ratio = 3). Finally try vel_v = 0.8 (ratio = 1.6, irrational approximation). Compare the three trajectories.

**Guiding Question:** A geodesic on a flat torus closes if and only if vel_v/vel_u is rational (it traces a (p,q)-torus knot). An irrational ratio produces a geodesic that is *dense* — it eventually passes arbitrarily close to every point. What does this say about the connection between differential geometry and ergodic theory?

**Success Criteria:** Student finds that integer ratios (2, 3) produce clean closed loops. Non-integer rational ratios (3/2, 5/3) produce longer closed loops. Near-irrational ratios produce curves that begin to fill the torus surface. They connect this to the structure of ℝ/ℤ (the circle group).

**Hint:** On the sphere, all geodesics are great circles (closed, period = 2π). The torus is more interesting because its Christoffel symbols mix the two directions.

## Theory (Lecture Notes Outline)

### Section 1: The Geodesic Equation
- **Derivation:** A geodesic γ(t) parallel-transports its own velocity: ∇_{γ̇} γ̇ = 0. In coordinates:
  $$\frac{d^2 x^k}{dt^2} + \sum_{i,j} \Gamma^k_{ij} \frac{dx^i}{dt} \frac{dx^j}{dt} = 0$$
- **Nature of the equation:** This is a nonlinear second-order ODE system. Given initial position x(0) and initial velocity ẋ(0), the solution exists and is unique (by Picard-Lindelöf).
- **Phase space reformulation:** Rewrite as a first-order system: state = [x^1, x^2, ẋ^1, ẋ^2]. The server solves this using SciPy's `solve_ivp` with an RK45 adaptive integrator.
- *Visualization reference:* "The cyan curve on the surface is the geodesic γ(t), computed in real time by the backend ODE solver."

### Section 2: Geodesics on the Sphere
- **Theorem:** Every geodesic on S² is a great circle.
- **Proof Sketch:** By symmetry (S² is homogeneous and isotropic), it suffices to check that the equator γ(t) = (π/2, t) satisfies the geodesic equation. Compute: ẍ^θ + Γ^θ_φφ (ẋ^φ)² = 0 − sin(π/2)cos(π/2) · 1 = 0 ✓. Since any geodesic can be rotated to the equator, all geodesics are great circles.
- **Consequence:** On the sphere, geodesics are always closed with period 2π (they wrap once around).
- *Visualization reference:* "On the sphere, vary the initial velocity direction — the geodesic always traces a great circle, just tilted differently."

### Section 3: Geodesics on the Torus
- **Christoffel Symbols (from m3_3):** Γ^u_uv = −r sin v/(R + r cos v), Γ^v_uu = (R + r cos v) sin v/r.
- **Geodesic ODE:** Write explicitly:
  $$\ddot{u} = \frac{2r\sin v}{R + r\cos v} \dot{u}\dot{v}, \quad \ddot{v} = -\frac{(R + r\cos v)\sin v}{r} \dot{u}^2$$
- **Classification by velocity ratio:** If the torus is "almost flat" (r ≪ R), geodesics approximate straight lines on the flat torus ℝ²/ℤ². The winding number (p,q) = (vel_u, vel_v) determines the topology. Rational ratio → closed; irrational → dense (Weyl's equidistribution theorem).
- *Visualization reference:* "Change vel_v/vel_u to see this transition. The simulation solves the full nonlinear ODE — the classification is exact only for the flat torus, but qualitatively correct for small r/R."

### Section 4: The Exponential Map
- **Definition:** exp_p: T_pM → M maps a tangent vector V to the point γ(1), where γ is the geodesic with γ(0) = p, γ̇(0) = V.
- **Properties:** exp_p is a local diffeomorphism near the origin. Its domain is the largest star-shaped region where geodesics don't hit conjugate points.
- **Normal Coordinates:** The coordinate system defined by exp_p is called *normal* or *geodesic* coordinates. In these coordinates, Γ^k_ij(p) = 0 — the manifold "looks flat" at p to first order.

### Section 5: Geodesics as Length Minimizers
- **Theorem (Local):** A geodesic locally minimizes arc length among nearby curves with the same endpoints.
- **Arc Length Functional:** L(γ) = ∫ √(g_ij γ̇^i γ̇^j) dt. Geodesics are critical points of L (Euler-Lagrange equations ↔ geodesic equation).
- **Caveat:** Geodesics are only *locally* length-minimizing. On the sphere, a great circle arc longer than half the circumference is a geodesic but not the shortest path.

## Workbench Specification (NEW — currently missing)
1. **ODE state display:** Table of [t, u, v, u̇, v̇] at 5–8 sampled time steps.
2. **Geodesic equation term-by-term:** At the first sample point, expand ü = −Σ Γ^u_ij ẋ^i ẋ^j showing each contributing Christoffel term.
3. **Arc length computation:** Numerical integration of √(g_ij γ̇^i γ̇^j) along the geodesic.

## Backend Changes (`geometry.py`)
- Add workbench dict to `run_geodesic()` return value.
- Sample 5–8 points from the ODE solution.
- Compute geodesic equation terms at each sample.
- Compute cumulative arc length via trapezoidal rule.

## Controls (Keep existing)
- Manifold selector, start_u, start_v, vel_u, vel_v

## Stats (Update)
- ODE integrator status
- **Add:** Arc length, Winding number estimate (vel_v/vel_u ratio)
