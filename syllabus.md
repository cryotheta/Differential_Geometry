# Differential Geometry Syllabus: The Path to Information Geometry

**Objective:** Master the machinery of smooth manifolds and Riemannian metrics to understand statistical models as geometric spaces.

---

## Phase 2: Smooth Manifolds (Calculus on Curved Spaces)
*Goal: Generalize multivariable calculus so it works identically regardless of how you parameterize your probability distributions.*

### Module 2.1: Charts and Atlases
*   **Concepts:**
    *   Topological spaces vs. Manifolds.
    *   Charts (local coordinate systems) and Atlases (global coverage).
    *   Transition maps (coordinate transformations) and Diffeomorphisms.
*   **Information Geometry Link:** Understanding that reparameterizing a statistical model (e.g., standard deviation vs. variance) is simply changing charts via transition maps.

### Module 2.2: Tangent and Cotangent Spaces
*   **Concepts:**
    *   Tangent vectors as directional derivatives / derivation operators ($\frac{\partial}{\partial x^i}$).
    *   The Tangent Space $T_pM$ at a point $p$.
    *   The Dual Space (Cotangent Space) $T_p^*M$ and covectors (1-forms) $dx^i$.
    *   Differentials of functions.
*   **Information Geometry Link:** A tangent vector represents a zero-mean random variable (a perturbation of the distribution). The score function is a tangent vector.

### Module 2.3: Pushforwards and Pullbacks
*   **Concepts:**
    *   Smooth maps between manifolds ($F: M \to N$).
    *   The Pushforward ($F_*$ or $dF$): Mapping vectors forward using the Jacobian matrix.
    *   The Pullback ($F^*$): Mapping covectors and functions backward using the transpose of the Jacobian.
*   **Information Geometry Link:** Ensuring that statistical measurements (like information metrics) remain invariant when changing parameters by correctly pulling them back to the new coordinate space.

### Module 2.4: Tensor Algebra
*   **Concepts:**
    *   Definition of a $(r,s)$-tensor as a multilinear map.
    *   Tensor products ($\otimes$) and basis representations.
    *   Coordinate transformation rules for tensors.
*   **Key Milestone:** Prove that the output of a tensor operation is invariant under coordinate transformations.

---

## Phase 3: Riemannian Geometry (Distance and Curvature)
*Goal: Equip the manifold with a metric to measure distances, take derivatives of vector fields, and calculate curvature.*

### Module 3.1: The Riemannian Metric
*   **Concepts:**
    *   Definition of the metric tensor $g$: a symmetric, positive-definite $(0,2)$-tensor.
    *   Measuring vector lengths: $\|v\| = \sqrt{g(v,v)}$.
    *   Measuring angles between vectors.
    *   Calculating the length of a curve $\gamma(t)$ on the manifold.
*   **Information Geometry Link:** Deriving the Fisher Information Matrix (FIM) and proving it satisfies all properties of a Riemannian metric tensor.

### Module 3.2: Affine Connections and Parallel Transport
*   **Concepts:**
    *   The problem of comparing vectors in different tangent spaces.
    *   The Affine Connection ($\nabla$) as a rule for parallel transport.
    *   The Covariant Derivative ($\nabla_X Y$): taking the derivative of a vector field along a path.
    *   Christoffel symbols ($\Gamma_{ij}^k$) as coordinate representations of the connection.

### Module 3.3: The Levi-Civita Connection
*   **Concepts:**
    *   Metric compatibility ($\nabla g = 0$): ensuring lengths and angles don't change during transport.
    *   Torsion-free connections ($\Gamma_{ij}^k = \Gamma_{ji}^k$): ensuring the space doesn't intrinsically "twist".
    *   **The Fundamental Theorem of Riemannian Geometry:** The existence and uniqueness of the Levi-Civita connection.
    *   **Key Exercise:** Derive the formula for $\Gamma_{ij}^k$ purely from the metric tensor components $g_{ij}$ and its inverse $g^{kl}$.

### Module 3.4: Geodesics
*   **Concepts:**
    *   The Geodesic Equation: $\ddot{x}^k + \Gamma_{ij}^k \dot{x}^i \dot{x}^j = 0$.
    *   Geodesics as curves that parallel transport their own velocity vectors.
    *   Shortest-path distance vs. straightest-path distance.
    *   The Exponential Map ($\text{exp}_p: T_pM \to M$).

### Module 3.5: Curvature
*   **Concepts:**
    *   The Riemann Curvature Tensor $R(X,Y)Z$ as the commutator of covariant derivatives.
    *   Geometric intuition: parallel transporting a vector around a closed loop.
    *   Component form of the Riemann tensor ($R^\rho_{\sigma\mu\nu}$) built from Christoffel symbols.
    *   Tensor contractions: The Ricci Tensor ($R_{ij}$) and Scalar Curvature ($R$).
*   **Information Geometry Link:** Calculating the scalar curvature of a 1D Normal distribution and proving it has constant negative curvature ($R = -1$).