# Module 2.3: Pushforwards and Pullbacks

## Hook
The Jacobian matrix is the universal translator between tangent spaces. This module shows you exactly how it works.

## Simulation Task

**Mission:** Set du=1, dv=0 and record the pushforward vector V₃d. Then set du=0, dv=1 and record the new V₃d. These two vectors are the *columns* of the Jacobian matrix. Open the Algebra Workbench and verify this against the displayed Jacobian.

**Guiding Question:** The pullback F*A evaluates a 3D 1-form as though it lives on the torus. Set du=0.5, dv=0.5. Now double both to du=1, dv=1. Does (F*A)(v) exactly double? What property of covectors does this confirm?

**Success Criteria:** The student reads off the Jacobian columns from two experiments, matches them to the Workbench, and confirms that (F*A)(v) is linear in v — the defining property of a covector.

**Hint:** The pushforward V₃d = J · [du, dv]ᵀ. When [du,dv] = [1,0], V₃d is exactly the first column of J.

## Theory (Lecture Notes Outline)

### Section 1: Smooth Maps Between Manifolds
- **Definition (Smooth Map):** F: M → N is smooth if for every pair of charts (U, φ) on M and (V, ψ) on N, the coordinate representation ψ ∘ F ∘ φ⁻¹ is C∞.
- **Running Example:** The inclusion map F: T² → ℝ³ that embeds the torus. Written explicitly:
  $$F(u,v) = \big((R + r\cos v)\cos u,\; (R + r\cos v)\sin u,\; r\sin v\big)$$
- *Visualization reference:* "The torus surface in the 3D panel is the image of this map F."

### Section 2: The Pushforward (Differential)
- **Definition:** The pushforward F_*: T_pM → T_{F(p)}N is the linear map defined by F_*(γ'(0)) = (F ∘ γ)'(0).
- **Coordinate Expression:** In coordinates, (F_*V)^i = Σ_j (∂F^i/∂x^j) V^j. This is matrix multiplication by the Jacobian.
- **Explicit Jacobian for the Torus:** Derive the 3×2 Jacobian matrix J with entries ∂(x,y,z)/∂(u,v). Show all 6 entries.
- *Visualization reference:* "The yellow arrow in the 3D panel is V₃d = J · [du, dv]ᵀ — the pushforward of the parameter-space vector to ℝ³."
- *Workbench reference:* "Open the Algebra Workbench to see the Jacobian matrix and the pushforward computed row-by-row with the product expansion."

### Section 3: The Pullback
- **Definition:** The pullback F*: T*_{F(p)}N → T*_pM maps covectors backward. Defined by (F*ω)(V) = ω(F_*V).
- **Coordinate Expression:** If ω = A_i dy^i is a 1-form on N, then F*ω = (Σ_i A_i ∂F^i/∂x^j) dx^j. This is multiplication by Jᵀ.
- **Worked Example:** Pull back the 1-form A = y·dx − x·dy + dz from ℝ³ to the torus. Compute F*A = (F*A)_u du + (F*A)_v dv explicitly.
- *Workbench reference:* "The Workbench shows this pullback as Jᵀ · A, with the row-product expansion."

### Section 4: Consistency Check — (F*A)(v)
- **Key Identity:** (F*A)(v) = A(F_*v). This is the defining property. Verify numerically in the Workbench's dot product step.
- **Linearity:** Both pushforward and pullback are linear maps. F_*(αV + βW) = αF_*V + βF_*W. The simulation task confirms this.
- **Why this matters:** When we define the metric tensor (m3_1), we will need to pull it back under coordinate changes. The pullback formula is the mechanism that ensures coordinate invariance.

## Workbench (EXISTS — already implemented ✅)
4 steps: Jacobian → Pushforward (J·v) → Pullback (Jᵀ·A) → Covector evaluation.

## Controls (Keep existing)
- u, v (torus coordinates)
- du, dv (parameter-space tangent vector)

## Stats (Keep existing)
- Pushforward vector V₃d
- Pullback covector F*A
