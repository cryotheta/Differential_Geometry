# Module 2.2: Tangent and Cotangent Spaces

## Hook
At every point on a curved surface, calculus lives in a flat plane. That plane is the tangent space.

## Simulation Task

**Mission:** Move the point p to the "pole" of the ellipsoid (v ≈ π/2). Observe the tangent basis vectors e_u and e_v and the tangent plane. Now move p to the "equator" (v ≈ 0). Set V^u = 0, vary V^v only. Find the latitude v where the covector value df(V) is maximized.

**Guiding Question:** df(V) measures how fast the height function f = z changes along V. Why is df(V) maximized at v = 0 (equator) when V points along e_v? Why does it vanish at the pole?

**Success Criteria:** Student identifies that at v = 0, the surface is "most tilted" relative to the height function, so ∂f/∂v is largest. At the pole, moving along e_v is nearly horizontal — height barely changes.

**Hint:** Watch the e_v arrow. At the pole it is horizontal (parallel to the xy-plane). At the equator it points nearly vertically.

## Theory (Lecture Notes Outline)

### Section 1: Curves and Velocities
- **Motivation:** On ℝⁿ, a tangent vector is a direction + magnitude. On a manifold, there is no ambient space to embed vectors in. We need an intrinsic definition.
- **Definition (Smooth Curve):** A smooth map γ: (-ε, ε) → M with γ(0) = p.
- **Definition (Tangent Vector via Curves):** The tangent vector γ'(0) is the equivalence class of curves through p with the same velocity in *any* coordinate chart.

### Section 2: Derivations (The Abstract Definition)
- **Definition (Derivation):** A linear map D: C∞(M) → ℝ satisfying the Leibniz rule D(fg) = f(p)D(g) + g(p)D(f).
- **Theorem:** The set of all derivations at p forms a vector space isomorphic to ℝⁿ. This is T_pM.
- **Coordinate Basis:** In a chart (U, φ) with coordinates (x¹, ..., xⁿ), the partial derivatives {∂/∂x¹|_p, ..., ∂/∂xⁿ|_p} form a basis for T_pM.
- *Visualization reference:* "The blue and green arrows in the 3D panel are e_u = ∂/∂u and e_v = ∂/∂v — the coordinate basis vectors at p, embedded in ℝ³."

### Section 3: The Tangent Space as a Vector Space
- **General tangent vector:** V = V^u ∂/∂u + V^v ∂/∂v. The components (V^u, V^v) are set by the sliders.
- **Embedding in ℝ³:** The yellow arrow V₃d = V^u e_u + V^v e_v is the pushforward of V into ambient space. *(This is formally a pushforward of the inclusion map — covered in m2_3.)*
- *Visualization reference:* "Adjust the V^u and V^v sliders to see how the tangent vector (yellow arrow) is built as a linear combination of the basis vectors."

### Section 4: The Cotangent Space and Differentials
- **Definition (Cotangent Space):** T*_pM is the dual space of T_pM — the space of linear functionals ω: T_pM → ℝ.
- **Dual Basis:** {dx¹, ..., dxⁿ} defined by dx^i(∂/∂x^j) = δ^i_j.
- **Definition (Differential of a function):** For f: M → ℝ, the differential df ∈ T*_pM acts by df(V) = V(f) = Σ V^i (∂f/∂x^i).
- **Worked Example:** f = z (height function on the ellipsoid). Compute df = (∂f/∂u)du + (∂f/∂v)dv. Since z = c sin(v), we get df = 0·du + c cos(v)·dv. Evaluate df(V) = c cos(v) · V^v.
- *Visualization reference:* "The 'Covector Value df(V)' in the metrics panel is exactly this computation: df(V) = c·cos(v)·V^v."

### Section 5: Why Cotangent Vectors?
- Cotangent vectors are *not* an abstraction for its own sake. They are the natural home for gradients, differential forms, and (crucially) the metric tensor.
- **Key insight:** Vectors transform *contravariantly* (with the Jacobian), while covectors transform *covariantly* (with the inverse Jacobian). This distinction is essential for defining tensors in m2_4.

## Workbench Specification (NEW — currently missing)
1. **Basis construction:** Show e_u and e_v as column vectors in ℝ³ (the partial derivatives of the embedding).
2. **Linear combination:** V₃d = V^u · e_u + V^v · e_v as a matrix-vector multiplication.
3. **Covector evaluation:** df = [0, c·cos(v)], then df · [V^u, V^v]ᵀ = result. Show term-by-term.

## Backend Changes (`geometry.py`)
- Add workbench dict to `compute_tangent_space()` return value.
- Build 3 steps: basis vectors, linear combination (mat_vec_mul), covector dot product.

## Controls (Keep existing)
- u, v (point coordinates)
- V^u, V^v (tangent vector components)

## Stats (Keep existing)
- Point p coordinates
- Covector value df(V)
