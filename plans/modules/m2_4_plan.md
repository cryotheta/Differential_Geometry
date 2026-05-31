# Module 2.4: Tensor Algebra and Invariance

## Hook
The components of a tensor change when you rotate your coordinate system. The tensor itself does not. This module makes that precise.

## Simulation Task

**Mission:** Fix the ellipse parameters (θ, a, b). Rotate the coordinate frame by varying α from 0 to π. Watch T_ij and T'_ij change in the metrics panel. Now find the value of α where T'_ij becomes *diagonal*. Record the diagonal entries.

**Guiding Question:** When T'_ij is diagonal, what relationship does α have to the eigenvectors of T? The diagonal entries of T' — what are they in terms of the eigenvalues of T?

**Success Criteria:** Student discovers that T'_ij is diagonal precisely when α aligns the coordinate axes with the eigenvectors of T. The diagonal entries are the eigenvalues 1/a² and 1/b². They verify that trace and determinant are invariant throughout.

**Hint:** The diagonalizing angle α should equal the ellipse orientation angle θ. Try setting α = θ exactly.

## Theory (Lecture Notes Outline)

### Section 1: Multilinear Maps and Tensors
- **Definition (Multilinear Map):** A map T: V₁ × ... × Vₖ → ℝ that is linear in each argument separately.
- **Definition ((r,s)-Tensor):** A multilinear map T: (T*_pM)^r × (T_pM)^s → ℝ. It eats r covectors and s vectors and produces a scalar.
- **Examples:** A vector is a (1,0)-tensor. A covector is a (0,1)-tensor. The metric g is a (0,2)-tensor. A linear map A: V → V is a (1,1)-tensor.
- **Tensor Product:** (ω ⊗ η)(V, W) = ω(V) · η(W). Every tensor can be decomposed as a sum of tensor products of basis elements.

### Section 2: Components and Basis Representation
- **Component Representation:** In coordinates, T_ij = T(∂/∂x^i, ∂/∂x^j) for a (0,2)-tensor. The full tensor is T = Σ T_ij dx^i ⊗ dx^j.
- **Ellipse Representation:** The equation T_ij x^i x^j = 1 defines an ellipse in ℝ². This is the geometric object that the tensor represents.
- *Visualization reference:* "The blue ellipse in the plot is the set {x ∈ ℝ² : xᵀTx = 1}. It remains fixed regardless of α."

### Section 3: Coordinate Transformation Rule
- **Theorem:** Under a coordinate change x → x' with Jacobian J^i_k = ∂x^i/∂x'^k, a (0,2)-tensor transforms as:
  $$T'_{ij} = \sum_{k,l} \frac{\partial x^k}{\partial x'^i} \frac{\partial x^l}{\partial x'^j} T_{kl} = (J^T T J)_{ij}$$
- **Proof Sketch:** Direct application of the chain rule and multilinearity. *(Work through explicitly for 2×2 case.)*
- **Mnemonic:** Covariant indices (downstairs) transform with J. Contravariant indices (upstairs) transform with J⁻¹.
- *Workbench reference:* "The Algebra Workbench shows the triple product Jᵀ · T · J computed step by step, including the intermediate product M = Jᵀ · T."

### Section 4: Tensor Invariants
- **Definition (Invariant):** A quantity computed from tensor components that does not change under coordinate transformations.
- **Theorem:** For a (0,2)-tensor: trace Tr(T) = Σ g^{ij} T_{ij} and determinant det(T) are invariants.
- **Proof for 2×2:** det(Jᵀ T J) = det(J)² det(T). Since J is a rotation, det(J) = 1, so det(T') = det(T). Similarly for trace. *(Verify numerically in the metrics panel.)*
- **Significance:** Eigenvalues of a symmetric tensor are invariants (they are the roots of the characteristic polynomial, which involves only trace and determinant). This is why PCA and spectral decomposition are coordinate-independent operations.
- *Visualization reference:* "The 'Det(T) | Tr(T')' metrics remain constant as you sweep α. The Workbench verification step confirms this with pass/fail checks."

## Workbench (EXISTS ✅)
5 steps: Tensor construction (triple product) → Jacobian → Jᵀ·T → T' = M·J → Invariance verification.

## Controls (Keep existing)
- α (coordinate rotation), θ (ellipse orientation), a, b (semi-axes)

## Stats (Keep existing)
- T_ij, T'_ij components, Det(T)|Det(T'), Tr(T)|Tr(T')
