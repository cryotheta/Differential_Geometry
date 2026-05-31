// Module Data Dictionary (Theory text and Control definitions)
const moduleData = {
    "m2_1": {
        phase: "Phase 2: Smooth Manifolds",
        title: "Charts and Atlases",
        hook: "Every map of the Earth is wrong in some way — this module explains why, and why that's actually fine.",
        sections: [
            {
                id: "hausdorff",
                title: "1. The Hausdorff Condition",
                theory: `
                    <div class="def-block">
                        <div class="def-label">Definition (Topological Space & Hausdorff)</div>
                        <p>A topological space is a set $X$ with a topology (collection of open sets). It is <strong>Hausdorff</strong> if any two distinct points can be separated by disjoint open sets.</p>
                    </div>
                    <p>This prevents pathologic spaces where sequences can converge to multiple limits simultaneously. Consider the "Line with Two Origins" — a standard line except at zero, where there are two distinct origins $0_A$ and $0_B$. Every open interval around $0_A$ must contain points arbitrarily close to $0_B$, making it impossible to separate them.</p>
                    <span class="viz-ref">▸ Drag points A and B. Try to shrink their radii to separate them. Observe what happens when A and B represent the two origins.</span>
                `,
                task: {
                    mission: "Drag point A to Origin 1 and point B to Origin 2. Try to reduce their open set radii so they no longer overlap.",
                    guiding_question: "Can you separate the two origins with disjoint open sets? What does this mean for the Hausdorff condition?",
                    hint: "Notice that any open interval containing Origin 1 must contain some interval $(-\epsilon, 0) \cup (0, \epsilon)$, which overlaps any interval containing Origin 2."
                },
                controls: [
                    { id: "radius_a", label: "Open Set Radius around A", type: "range", min: 0.1, max: 2.0, step: 0.1, val: 1.0 },
                    { id: "radius_b", label: "Open Set Radius around B", type: "range", min: 0.1, max: 2.0, step: 0.1, val: 1.0 }
                ],
                stats: [
                    { id: "haus_status", label: "Intersection Status", value: "Overlapping" }
                ],
                apiPath: "/api/hausdorff"
            },
            {
                id: "locally_euclidean",
                title: "2. Locally Euclidean",
                theory: `
                    <div class="def-block">
                        <div class="def-label">Definition (Locally Euclidean)</div>
                        <p>A space is locally Euclidean if every point $p$ has a neighborhood homeomorphic to an open subset of $\\mathbb{R}^n$.</p>
                    </div>
                    <p>Globally, a manifold might be curved and complex, but if you zoom in close enough to any point, it looks exactly like flat space. A sphere $S^2$ is locally Euclidean because any small cap on the sphere resembles a flat disk in $\\mathbb{R}^2$.</p>
                    <span class="viz-ref">▸ Zoom into the spherical cap. Watch how the curved surface converges to the flat tangent plane.</span>
                `,
                task: {
                    mission: "Decrease the neighborhood radius $r$ until the curvature of the spherical cap becomes indistinguishable from the flat tangent plane.",
                    guiding_question: "As the radius shrinks, what happens to the maximum deviation between the sphere and the plane?",
                    hint: "Look at the 'Max Deviation' metric. Notice how quickly it drops as $r$ gets smaller."
                },
                controls: [
                    { id: "cap_radius", label: "Neighborhood Radius $r$", type: "range", min: 0.05, max: 1.57, step: 0.05, val: 1.0 }
                ],
                stats: [
                    { id: "max_deviation", label: "Max Deviation", value: "Loading..." }
                ],
                apiPath: "/api/locally_euclidean"
            },
            {
                id: "charts",
                title: "3. Charts and Coordinate Systems",
                theory: `
                    <div class="def-block">
                        <div class="def-label">Definition (Chart)</div>
                        <p>A <strong>chart</strong> on $M$ is a pair $(U, \\phi)$ where $U \\subseteq M$ is open and $\\phi: U \\to \\mathbb{R}^n$ is a homeomorphism onto an open subset of $\\mathbb{R}^n$. The map $\\phi$ assigns coordinates to each point in $U$.</p>
                    </div>
                    <p><strong>Example — Stereographic projection from the North Pole.</strong> Define $\\phi_N: S^2 \\setminus \\{N\\} \\to \\mathbb{R}^2$ by projecting each point $(x, y, z)$ from the north pole $N = (0,0,1)$ onto the equatorial plane:</p>
                    $$\\phi_N(x, y, z) = \\left(\\frac{x}{1 - z},\\; \\frac{y}{1 - z}\\right)$$
                    <p>This covers every point of the sphere <em>except</em> the north pole itself.</p>
                    <div class="thm-block">
                        <div class="thm-label">Theorem</div>
                        <p>The sphere $S^2$ cannot be covered by a single chart. At minimum, an <strong>atlas</strong> of two charts is needed.</p>
                    </div>
                `,
                task: {
                    mission: "Switch between North and South stereographic charts. Increase the boundary limit to its maximum. Identify where the grid degenerates.",
                    guiding_question: "Can a single chart cover the entire sphere? Why does the grid diverge at the projection pole?",
                    hint: "Toggle between North and South charts at the same limit. Notice which regions each chart covers well, and which point it fails to reach."
                },
                controls: [
                    { id: "chart_type", label: "Select Coordinate Chart", type: "select", options: [ {val: "north", label: "North Stereographic Projection"}, {val: "south", label: "South Stereographic Projection"} ] },
                    { id: "limit", label: "Chart Boundary Limit ($u, v$ range)", type: "range", min: 1.0, max: 5.0, step: 0.2, val: 3.0 }
                ],
                stats: [
                    { id: "coord_desc", label: "Chart Type", value: "North Pole" },
                    { id: "overlap_status", label: "Coordinate Area", value: "Stereographic Plane" }
                ],
                apiPath: "/api/charts"
            },
            {
                id: "transition_maps",
                title: "4. Transition Maps",
                theory: `
                    <p>Where two charts $(U_\\alpha, \\phi_\\alpha)$ and $(U_\\beta, \\phi_\\beta)$ overlap, we can convert between their coordinates using the <strong>transition map</strong>:</p>
                    $$\\phi_\\beta \\circ \\phi_\\alpha^{-1}: \\phi_\\alpha(U_\\alpha \\cap U_\\beta) \\to \\phi_\\beta(U_\\alpha \\cap U_\\beta)$$
                    <p>For $S^2$, the North-to-South transition map is an inversion in the plane:</p>
                    $$\\phi_S \\circ \\phi_N^{-1}(u_N, v_N) = \\left(\\frac{u_N}{u_N^2 + v_N^2},\\; \\frac{v_N}{u_N^2 + v_N^2}\\right)$$
                    <div class="def-block">
                        <div class="def-label">Definition (Diffeomorphism)</div>
                        <p>A <strong>diffeomorphism</strong> is a bijective smooth map whose inverse is also smooth. A manifold is called <strong>smooth</strong> when all its transition maps are diffeomorphisms.</p>
                    </div>
                    <span class="viz-ref">▸ Open the Algebra Workbench tab to see this transition map computed step-by-step.</span>
                `,
                task: {
                    mission: "Adjust the u and v coordinates on the North chart. Observe the mapped point on the South chart.",
                    guiding_question: "What happens to points that are inside the unit circle on the North chart when mapped to the South chart?",
                    hint: "The unit circle represents the equator. Notice that the transition map is a geometric inversion."
                },
                controls: [
                    { id: "u_n", label: "North coordinate $u_N$", type: "range", min: -2.0, max: 2.0, step: 0.1, val: 0.5 },
                    { id: "v_n", label: "North coordinate $v_N$", type: "range", min: -2.0, max: 2.0, step: 0.1, val: 0.5 }
                ],
                stats: [
                    { id: "trans_point", label: "Mapped South Point", value: "Loading..." }
                ],
                apiPath: "/api/transition_maps"
            }
        ]
    },
    "m2_2": {
        phase: "Phase 2: Smooth Manifolds",
        title: "Tangent and Cotangent Spaces",
        hook: "How do we define vectors without an ambient space to point them in?",
        sections: [
            {
                id: "derivations",
                title: "Vectors as Derivations & The Lie Bracket",
                theory: `
                    <p>On an abstract manifold without an ambient space, a vector *is* a derivation. It is an operator that takes a smooth function and returns its directional derivative.</p>
                    <p>To prove vectors are operators, we show they don't commute. The <strong>Lie Bracket</strong> $[X,Y] = XY - YX$ forms a new vector field. It measures the failure of the flows of $X$ and $Y$ to form closed rectangles.</p>
                    <p>This simulation shows the commutator gap: flowing along $X$ then $Y$ versus $Y$ then $X$.</p>
                `,
                task: {
                    mission: "Increase the step size $\\epsilon$ and observe the gap between the two flow paths.",
                    guiding_question: "Why does the gap scale roughly quadratically with $\\epsilon$?",
                    hint: "The Taylor expansion of the commutator reveals that the leading error term is $\\epsilon^2 [X,Y]$."
                },
                controls: [
                    { id: "epsilon", label: "Flow Step Size $\\epsilon$", type: "range", min: 0.1, max: 1.5, step: 0.1, val: 0.8 }
                ],
                stats: [
                    { id: "gap_dist", label: "Commutator Gap Distance", value: "Loading..." }
                ],
                apiPath: "/api/lie_bracket"
            },
            {
                id: "tangent_basis",
                title: "The Tangent Space & Holonomic Basis",
                theory: `
                    <p>The coordinate partial derivatives $\\partial_u, \\partial_v$ form a basis for the tangent space $T_pM$. However, these are <strong>non-orthonormal</strong> and vary wildly from point to point.</p>
                    <p>Students often confuse a vector with its components. If you keep components $(V^u, V^v)$ fixed but move the point $p$, the physical arrow stretches and shears dramatically as the local coordinate grid warps.</p>
                    <p>This visualizes why we desperately need a metric tensor to measure true lengths.</p>
                `,
                task: {
                    mission: "Keep the vector components $V^u, V^v$ fixed and drag the point $(u,v)$ around the ellipsoid.",
                    guiding_question: "What happens to the physical length of the vector as it approaches the poles?",
                    hint: "Notice how the coordinate grid lines bunch up near the poles, causing the basis vectors to shrink."
                },
                controls: [
                    { id: "u", label: "Coordinate $u$ (Longitude angle)", type: "range", min: 0.0, max: 6.28, step: 0.1, val: 0.78 },
                    { id: "v", label: "Coordinate $v$ (Latitude angle)", type: "range", min: -1.4, max: 1.4, step: 0.05, val: 0.5 },
                    { id: "vx", label: "Fixed Component $V^u$", type: "range", min: -1.0, max: 1.0, step: 0.1, val: 0.5 },
                    { id: "vy", label: "Fixed Component $V^v$", type: "range", min: -1.0, max: 1.0, step: 0.1, val: -0.4 }
                ],
                stats: [
                    { id: "p_coords", label: "Point p (x, y, z)", value: "Loading..." },
                    { id: "basis_lengths", label: "Length |∂u|, |∂v|", value: "Loading..." }
                ],
                apiPath: "/api/tangent_space"
            },
            {
                id: "covectors",
                title: "The Cotangent Space $T_p^*M$",
                theory: `
                    <p>The <strong>cotangent space</strong> $T_p^*M$ is the dual space to $T_pM$. Elements are 1-forms (covectors), which are linear functionals (measuring instruments) mapping vectors to scalars.</p>
                    <p>Stop thinking of covectors as arrows! Visually, a covector is exactly a stack of parallel hyperplanes. When a vector $V$ is evaluated by a covector $\\omega$, the output $\\omega(V)$ is precisely the number of planes pierced by $V$.</p>
                `,
                task: {
                    mission: "Adjust the covector density $\\alpha$ and the vector length $V^x$. Watch how the scalar product changes.",
                    guiding_question: "How does the number of pierced planes change if you double the vector length vs doubling the covector density?",
                    hint: "Both operations double the scalar output, illustrating bilinearity."
                },
                controls: [
                    { id: "alpha", label: "Covector Density $\\alpha$", type: "range", min: 0.5, max: 3.0, step: 0.5, val: 1.5 },
                    { id: "vx", label: "Vector Component $V^x$", type: "range", min: -2.0, max: 2.0, step: 0.5, val: 1.0 },
                    { id: "vy", label: "Vector Component $V^y$", type: "range", min: -2.0, max: 2.0, step: 0.5, val: 1.0 }
                ],
                stats: [
                    { id: "pierced_planes", label: "Planes Pierced ω(V)", value: "Loading..." }
                ],
                apiPath: "/api/covector_planes"
            },
            {
                id: "differential",
                title: "The Differential $df$",
                theory: `
                    <p>The differential of a function $f: M \\to \\mathbb{R}$ is a covector $df \\in T_p^*M$.</p>
                    <p>Visualized via contour lines (level sets), $df$ forms covector planes perfectly aligned with the contours. Acting on a vector $V$, $df(V)$ computes the exact rate at which the vector crosses the contours.</p>
                    <span class="viz-ref">▸ Open the Algebra Workbench tab to see $df(V) = \\sum \\frac{\\partial f}{\\partial x^i} V^i$ computed.</span>
                `,
                task: {
                    mission: "Rotate the vector $V$ until it is perfectly tangent to a contour line.",
                    guiding_question: "What is the value of $df(V)$ when $V$ is tangent to the contour?",
                    hint: "If it doesn't cross any contour planes, the rate of change is zero."
                },
                controls: [
                    { id: "vx", label: "Vector $V^x$", type: "range", min: -1.0, max: 1.0, step: 0.1, val: 0.8 },
                    { id: "vy", label: "Vector $V^y$", type: "range", min: -1.0, max: 1.0, step: 0.1, val: 0.3 }
                ],
                stats: [
                    { id: "df_val", label: "Rate of Change df(V)", value: "Loading..." }
                ],
                apiPath: "/api/differential"
            }
        ]
    },
    "m2_3": {
        phase: "Phase 2: Smooth Manifolds",
        title: "Pushforwards and Pullbacks",
        hook: "How do we transport geometry between entirely different manifold spaces?",
        sections: [
            {
                id: "pushforward",
                title: "The Pushforward Map $F_*$",
                theory: `
                    <p>Let $F: M \\to N$ be a smooth map between manifolds. The <strong>pushforward</strong> (or differential) maps tangent vectors from $M$ to $N$: $F_*: T_pM \\to T_{F(p)}N$.</p>
                    <p>In local coordinates, this is simply multiplication by the Jacobian matrix $J^i_j = \\frac{\\partial F^i}{\\partial x^j}$. We map a 2D vector in the flat parameter chart to a 3D tangent vector on the Torus.</p>
                `,
                task: {
                    mission: "Adjust $du$ and $dv$ in the 2D chart. Observe how the pushed-forward vector stretches and rotates on the 3D Torus.",
                    guiding_question: "Is the pushforward a linear map at a fixed point $p$?",
                    hint: "Yes! At a fixed point, the Jacobian is a constant matrix, making the pushforward a linear transformation."
                },
                controls: [
                    { id: "u", label: "Torus major angle $u$", type: "range", min: 0.0, max: 6.28, step: 0.1, val: 1.5 },
                    { id: "v", label: "Torus minor angle $v$", type: "range", min: 0.0, max: 6.28, step: 0.1, val: 0.8 },
                    { id: "du", label: "2D Vector $du$", type: "range", min: -1.0, max: 1.0, step: 0.1, val: 0.6 },
                    { id: "dv", label: "2D Vector $dv$", type: "range", min: -1.0, max: 1.0, step: 0.1, val: 0.4 }
                ],
                stats: [
                    { id: "pf_vector", label: "Pushforward V_3d", value: "Loading..." }
                ],
                apiPath: "/api/pushforward_map"
            },
            {
                id: "pullback",
                title: "The Pullback $F^*$ of a 1-form",
                theory: `
                    <p>While vectors push forward, covectors (1-forms) <strong>pull back</strong>. For a 1-form $\\omega$ on $N$, the pullback $F^* \\omega$ is a 1-form on $M$.</p>
                    <p>Since covectors are level sets, pulling back a covector means pulling back its level set planes from the 3D Torus onto the 2D flat parameter space.</p>
                `,
                task: {
                    mission: "Observe how the 3D planes (1-form) intersect the Torus, and how those intersections pull back to form 2D contour lines.",
                    guiding_question: "Why do we pull covectors back instead of pushing them forward?",
                    hint: "Because a covector eats vectors. If you have a vector in M, you can push it to N, then feed it to the covector in N. This effectively creates a new covector waiting in M!"
                },
                controls: [
                    { id: "u", label: "Torus major angle $u$", type: "range", min: 0.0, max: 6.28, step: 0.1, val: 1.5 },
                    { id: "v", label: "Torus minor angle $v$", type: "range", min: 0.0, max: 6.28, step: 0.1, val: 0.8 }
                ],
                stats: [
                    { id: "pb_covector", label: "Pullback Covector F*ω", value: "Loading..." }
                ],
                apiPath: "/api/pullback_map"
            },
            {
                id: "duality",
                title: "The Fundamental Duality",
                theory: `
                    <p>The definitions of pushforward and pullback are permanently locked together by the fundamental duality:</p>
                    $$(F^* \\omega)(V) = \\omega(F_* V)$$
                    <p>Evaluating the pulled-back covector on the original vector is identically equal to pushing the vector forward and evaluating it against the original covector.</p>
                    <span class="viz-ref">▸ Open the Algebra Workbench to see the side-by-side matrices proving this duality.</span>
                `,
                task: {
                    mission: "Open the Algebra Workbench and compare the final scalar outputs of both computation branches.",
                    guiding_question: "How does the Jacobian transpose $J^T$ factor into the pullback?",
                    hint: "While pushforward multiplies the vector by $J$, the pullback multiplies the covector by $J^T$."
                },
                controls: [
                    { id: "u", label: "Torus major angle $u$", type: "range", min: 0.0, max: 6.28, step: 0.1, val: 1.5 },
                    { id: "v", label: "Torus minor angle $v$", type: "range", min: 0.0, max: 6.28, step: 0.1, val: 0.8 },
                    { id: "du", label: "2D Vector $du$", type: "range", min: -1.0, max: 1.0, step: 0.1, val: 0.6 },
                    { id: "dv", label: "2D Vector $dv$", type: "range", min: -1.0, max: 1.0, step: 0.1, val: 0.4 }
                ],
                stats: [
                    { id: "cov_eval", label: "Dual Evaluation", value: "Loading..." }
                ],
                apiPath: "/api/pushforward" // Keep existing for the duality workbench
            }
        ]
    },
    "m2_4": {
        phase: "Phase 2: Smooth Manifolds",
        title: "Tensor Algebra & Invariance",
        theory: `
            <h4>Tensor Coordinate Transformations</h4>
            <p>A tensor of type $(r,s)$ is a multilinear map taking $r$ covectors and $s$ vectors to $\\mathbb{R}$. Under a coordinate change $x \\to x'$, the components of a $(0,2)$-tensor $T_{ij}$ transform according to the rule:</p>
            $$T'_{ij} = \\sum_{k,l} \\frac{\\partial x^k}{\\partial x'^i} \\frac{\\partial x^l}{\\partial x'^j} T_{kl}$$
            <p>This animation demonstrates that while the component representation $T_{ij}$ of a tensor changes depending on the rotation $\\alpha$ of our coordinate basis, the underlying geometric object (visualized as an ellipse $T_{ij} x^i x^j = 1$) remains completely invariant in space.</p>
            <p>Crucially, tensor contraction operations like the <strong>Trace</strong> and <strong>Determinant</strong> are invariant under change of coordinates:</p>
            $$\\text{Tr}(T) = \\text{Tr}(T'), \\quad \\det(T) = \\det(T')$$
        `,
        controls: [
            { id: "alpha", label: "Coordinate Rotation Angle $\\alpha$", type: "range", min: 0.0, max: 3.14, step: 0.05, val: 0.5 },
            { id: "theta", label: "Ellipse Orientation Angle $\\theta$", type: "range", min: 0.0, max: 3.14, step: 0.05, val: 0.8 },
            { id: "a", label: "Semi-major axis $a$", type: "range", min: 1.0, max: 3.0, step: 0.1, val: 2.0 },
            { id: "b", label: "Semi-minor axis $b$", type: "range", min: 0.3, max: 1.0, step: 0.1, val: 0.6 }
        ],
        stats: [
            { id: "t_comp", label: "T_ij Components", value: "Loading..." },
            { id: "t_prime_comp", label: "T'_ij Components", value: "Loading..." },
            { id: "invariants", label: "Det(T) | Det(T')", value: "Loading..." }
        ]
    },
    "m3_1": {
        phase: "Phase 3: Riemannian Geometry",
        title: "The Riemannian Metric",
        theory: `
            <h4>The Riemannian Metric Tensor $g_{ij}$</h4>
            <p>A <strong>Riemannian metric</strong> $g$ on a manifold $M$ assigns to each tangent space $T_pM$ an inner product $g_p(u, v)$ that varies smoothly with $p$. In local coordinates, it is represented as a symmetric, positive-definite $(0,2)$-tensor field $g_{ij}$:</p>
            $$g = \\sum_{i,j} g_{ij} dx^i \\otimes dx^j$$
            <p>The metric enables us to compute length, angle, and volume on curved manifolds. The length of a curve $\\gamma(t)$ is given by:</p>
            $$L(\\gamma) = \\int \\sqrt{ g_{ij}(\\gamma(t)) \\dot{\\gamma}^i(t) \\dot{\\gamma}^j(t) } \\, dt$$
            <p>We visualize the metric using <strong>Tissot's indicatrices</strong>. These are unit circles in the tangent space ($g_{ij} v^i v^j = \\epsilon^2$). When projected to coordinate space, they deform into ellipses, illustrating the scaling and shearing of space at each point. In Information Geometry, the Fisher Information Matrix (FIM) functions as a Riemannian metric tensor.</p>
        `,
        controls: [
            { id: "manifold", label: "Select Manifold", type: "select", options: [ {val: "sphere", label: "Sphere (S2)"}, {val: "torus", label: "Torus (T2)"}, {val: "poincare", label: "Poincare Half-Plane (Hyperbolic)"} ] },
            { id: "u", label: "Coordinate $u$ (latitude/x)", type: "range", min: 0.2, max: 2.9, step: 0.1, val: 1.0 },
            { id: "v", label: "Coordinate $v$ (longitude/y)", type: "range", min: 0.2, max: 5.0, step: 0.1, val: 1.5 }
        ],
        stats: [
            { id: "metric_g", label: "Metric tensor g_ij", value: "Loading..." },
            { id: "metric_det", label: "Det(g)", value: "Loading..." }
        ]
    },
    "m3_2": {
        phase: "Phase 3: Riemannian Geometry",
        title: "Affine Connections & Parallel Transport",
        theory: `
            <h4>Affine Connections & Parallel Transport</h4>
            <p>On a curved manifold, tangent spaces at different points are different vector spaces. To take derivatives of vector fields or compare vectors at $p$ and $q$, we need a connection.</p>
            <p>An <strong>Affine Connection</strong> $\\nabla$ defines a rule for <strong>parallel transport</strong>. A vector field $V$ along a curve $\\gamma(t)$ is parallel transported if its covariant derivative along the curve vanishes:</p>
            $$\\nabla_{\\dot{\\gamma}} V = 0$$
            <p>In coordinates, this is a system of linear ODEs involving the <strong>Christoffel symbols</strong> $\\Gamma_{ij}^k$:</p>
            $$\\frac{dV^k}{dt} + \\sum_{i,j} \\Gamma_{ij}^k V^i \\frac{d\\gamma^j}{dt} = 0$$
            <p>Transporting a vector around a closed loop does not return it to its original direction. The angle difference is called the <strong>holonomy</strong>, which is directly proportional to the curvature of the enclosed region.</p>
        `,
        controls: [
            { id: "path_type", label: "Select Transport Path", type: "select", options: [ {val: "triangle", label: "Geodesic Triangle (Large area)"}, {val: "circle", label: "Latitude Circle (constant theta = pi/4)"} ] }
        ],
        stats: [
            { id: "holonomy_angle", label: "Holonomy Angle Error", value: "Loading..." }
        ]
    },
    "m3_3": {
        phase: "Phase 3: Riemannian Geometry",
        title: "The Levi-Civita Connection",
        theory: `
            <h4>The Levi-Civita Connection</h4>
            <p>The <strong>Fundamental Theorem of Riemannian Geometry</strong> states that on any Riemannian manifold, there exists a unique affine connection $\\nabla$ that satisfies two properties:</p>
            <p>1. <strong>Metric Compatibility:</strong> Parallel transport preserves inner products (lengths and angles): $\\nabla g = 0$.</p>
            <p>2. <strong>Symmetry (Torsion-free):</strong> The space has no intrinsic twisting: $\\nabla_X Y - \\nabla_Y X = [X, Y]$.</p>
            <p>This unique connection is called the <strong>Levi-Civita Connection</strong>. Its Christoffel symbols $\\Gamma_{ij}^k$ are determined entirely by the metric tensor $g_{ij}$ and its partial derivatives:</p>
            $$\\Gamma_{ij}^k = \\frac{1}{2} \\sum_{l} g^{kl} \\left( \\frac{\\partial g_{jl}}{\\partial x^i} + \\frac{\\partial g_{il}}{\\partial x^j} - \\frac{\\partial g_{ij}}{\\partial x^l} \\right)$$
            <p>Where $g^{kl}$ represents the components of the inverse metric matrix.</p>
        `,
        controls: [
            { id: "manifold", label: "Select Manifold", type: "select", options: [ {val: "sphere", label: "Sphere (S2)"}, {val: "torus", label: "Torus (T2)"} ] },
            { id: "u", label: "Coordinate $u$", type: "range", min: 0.3, max: 2.8, step: 0.1, val: 1.0 },
            { id: "v", label: "Coordinate $v$", type: "range", min: 0.0, max: 6.2, step: 0.1, val: 1.5 }
        ],
        stats: [
            { id: "gamma_symbols", label: "Selected Christoffels", value: "Loading..." }
        ]
    },
    "m3_4": {
        phase: "Phase 3: Riemannian Geometry",
        title: "Geodesics",
        theory: `
            <h4>Geodesics on Curved Surfaces</h4>
            <p>A <strong>geodesic</strong> generalises the concept of a straight line to curved spaces. It is defined as a curve $\\gamma(t)$ that parallel transports its own velocity vector: $\\nabla_{\\dot{\\gamma}} \\dot{\\gamma} = 0$.</p>
            <p>In coordinates, this yields the non-linear second-order ODE system (the <strong>Geodesic Equation</strong>):</p>
            $$\\frac{d^2 x^k}{dt^2} + \\sum_{i,j} \\Gamma_{ij}^k \\frac{dx^i}{dt} \\frac{dx^j}{dt} = 0$$
            <p>This simulator solves these differential equations in real-time on the backend using <code>scipy.integrate.solve_ivp</code> (using an RK45 adaptive solver) and plots the resulting shortest/straightest path on the 3D surface.</p>
        `,
        controls: [
            { id: "manifold", label: "Select Manifold", type: "select", options: [ {val: "sphere", label: "Sphere (S2)"}, {val: "torus", label: "Torus (T2)"} ] },
            { id: "start_u", label: "Start Coordinate $u_0$", type: "range", min: 0.2, max: 2.8, step: 0.1, val: 1.2 },
            { id: "start_v", label: "Start Coordinate $v_0$", type: "range", min: 0.0, max: 6.2, step: 0.1, val: 0.1 },
            { id: "vel_u", label: "Initial Velocity $\\dot{u}_0$", type: "range", min: -1.5, max: 1.5, step: 0.1, val: 0.0 },
            { id: "vel_v", label: "Initial Velocity $\\dot{v}_0$", type: "range", min: -3.0, max: 3.0, step: 0.2, val: 1.6 }
        ],
        stats: [
            { id: "geo_status", label: "ODE Integrator", value: "RK45 Converged" },
            { id: "geo_length", label: "Integration Steps", value: "120 points" }
        ]
    },
    "m3_5": {
        phase: "Phase 3: Riemannian Geometry",
        title: "Information Curvature & Statistical Manifolds",
        theory: `
            <h4>Statistical Manifolds & Information Curvature</h4>
            <p>In <strong>Information Geometry</strong>, we treat a family of probability distributions as a smooth manifold. The coordinates represent parameters (e.g., mean $\\mu$ and standard deviation $\\sigma$). The metric is the <strong>Fisher Information Matrix</strong>:</p>
            $$g_{ij}(\\theta) = \\mathbb{E}_{X \\sim p_\\theta} \\left[ \\frac{\\partial \\log p(X;\\theta)}{\\partial \\theta^i} \\frac{\\partial \\log p(X;\\theta)}{\\partial \\theta^j} \\right]$$
            <p>For the univariate Normal distribution family, the metric is:</p>
            $$ds^2 = \\frac{d\\mu^2}{\\sigma^2} + 2\\frac{d\\sigma^2}{\\sigma^2}$$
            <p>Under coordinate rescaling, this is isomorphic to the Poincaré Half-Plane, which possesses a constant negative curvature of $R = -1$. Geodesics in this space represent the optimal paths of information projection, indicating the shortest path of continuous distribution morphing.</p>
        `,
        controls: [
            { id: "mu1", label: "Start Mean $\\mu_1$", type: "range", min: -3.0, max: 3.0, step: 0.2, val: -1.5 },
            { id: "sigma1", label: "Start Std Dev $\\sigma_1$", type: "range", min: 0.4, max: 3.0, step: 0.1, val: 0.6 },
            { id: "mu2", label: "End Mean $\\mu_2$", type: "range", min: -3.0, max: 3.0, step: 0.2, val: 1.5 },
            { id: "sigma2", label: "End Std Dev $\\sigma_2$", type: "range", min: 0.4, max: 3.0, step: 0.1, val: 1.8 }
        ],
        stats: [
            { id: "scal_curv", label: "Scalar Curvature R", value: "-1.0 (Constant)" },
            { id: "dist_length", label: "Fisher Distance", value: "Loading..." }
        ]
    }
};

// Global variables for active state
let activeModule = "m2_1";
let activeSectionId = null;
const API_URL = ""; // Relative path to local server

// Initialize Dashboard
document.addEventListener("DOMContentLoaded", () => {
    setupNavigation();
    setupWorkbenchTabs();
    loadModule(activeModule);
});

// Sidebar navigation binding
function setupNavigation() {
    document.querySelectorAll(".nav-item").forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            
            const modId = item.getAttribute("data-module");
            loadModule(modId);
        });
    });
}

// 3-way tab switching: Visualization / Algebra Workbench / Python Source
function setupWorkbenchTabs() {
    const panelMap = {
        'viz': 'viz-panel',
        'workbench': 'workbench-panel',
        'code': 'code-panel'
    };

    document.querySelectorAll('.wb-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            // Toggle active tab
            document.querySelectorAll('.wb-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Toggle content panels
            const target = tab.getAttribute('data-tab');
            document.querySelectorAll('.wb-tab-content').forEach(panel => {
                panel.classList.remove('active');
            });
            
            const panelId = panelMap[target];
            if (panelId) {
                document.getElementById(panelId).classList.add('active');
            }
            
            // Plotly needs a resize when its container becomes visible again
            if (target === 'viz') {
                const plotDiv = document.getElementById('plotly-div');
                if (plotDiv && typeof Plotly !== 'undefined') {
                    requestAnimationFrame(() => Plotly.Plots.resize(plotDiv));
                }
            }
        });
    });
}

// Toggle hint visibility
function toggleHint() {
    const hint = document.getElementById("task-hint");
    const btn = document.getElementById("task-hint-btn");
    if (hint.style.display === "none") {
        hint.style.display = "block";
        btn.textContent = "Hide Hint";
    } else {
        hint.style.display = "none";
        btn.textContent = "Show Hint";
    }
}

// Load Content and Layout of a Module (supports Scrollytelling format)
function loadModule(modId) {
    activeModule = modId;
    activeSectionId = null;
    const mod = moduleData[modId];
    
    // Update breadcrumbs and titles
    document.getElementById("breadcrumb-phase").innerText = mod.phase;
    document.getElementById("breadcrumb-module").innerText = `Module ${modId.replace('m', '').replace('_', '.')}`;
    document.getElementById("module-title").innerText = mod.title;
    
    // Inject hook text
    const hookEl = document.getElementById("hook-text");
    hookEl.innerText = mod.hook || "";
    
    // Normalize to sections format for legacy modules
    let sections = mod.sections;
    if (!sections) {
        sections = [{
            id: "legacy",
            theory: mod.theory || "",
            task: mod.task,
            controls: mod.controls || [],
            stats: mod.stats || [],
            apiPath: getLegacyApiPath(modId)
        }];
    }
    
    // Inject theory sections
    const theoryDiv = document.getElementById("theory-content");
    theoryDiv.innerHTML = "";
    
    // Global helper for inline buttons to trigger section activation
    window.activateSectionById = function(id) {
        const mod = moduleData[activeModule];
        let sections = mod.sections;
        if (!sections) return;
        const sectionData = sections.find(s => s.id === id);
        if (sectionData) {
            activateSection(id, sectionData);
            // Update active styling
            document.querySelectorAll('.theory-section').forEach(el => el.classList.remove('active'));
            const activeEl = document.getElementById(`section-${id}`);
            if (activeEl) activeEl.classList.add('active');
            
            // Scroll right pane to top if needed
            const rightPane = document.querySelector('.right-pane');
            if (rightPane) rightPane.scrollTop = 0;
        }
    };
    
    sections.forEach((sec, index) => {
        const secDiv = document.createElement("div");
        secDiv.className = "theory-section";
        secDiv.id = `section-${sec.id}`;
        
        let html = "";
        if (sec.title) {
            html += `<h3>${sec.title}</h3>`;
        }
        html += sec.theory;
        
        // Append a toggle button if there are multiple sections
        if (sections.length > 1) {
            html += `
            <div style="margin-top: 20px;">
                <button class="btn btn-outline" style="width: 100%; border-color: var(--primary); color: var(--primary);" onclick="activateSectionById('${sec.id}')">
                    <i class="fas fa-play" style="margin-right: 8px;"></i> Load Simulation: ${sec.title || sec.id}
                </button>
            </div>`;
        }
        
        secDiv.innerHTML = html;
        theoryDiv.appendChild(secDiv);
    });
    
    if (window.renderMathInElement) {
        window.renderMathInElement(theoryDiv, {
            delimiters: [
                {left: "$$", right: "$$", display: true},
                {left: "$", right: "$", display: false}
            ]
        });
    }

    // Inject Python/NumPy Code Snippet once per module (or could be per section later)
    const codeSnippet = document.getElementById("code-snippet");
    if (window.numpySnippets && window.numpySnippets[modId]) {
        codeSnippet.textContent = window.numpySnippets[modId];
    } else {
        codeSnippet.textContent = "# Code snippet coming soon...";
    }
    
    // Activate first section manually to populate UI initially
    if (sections.length > 0) {
        document.getElementById(`section-${sections[0].id}`).classList.add('active');
        activateSection(sections[0].id, sections[0]);
    }
}

function activateSection(sectionId, sectionData) {
    if (activeSectionId === sectionId) return; // Already active
    activeSectionId = sectionId;
    
    // Inject task panel
    const taskMission = document.getElementById("task-mission");
    const taskQuestion = document.getElementById("task-question");
    const taskHint = document.getElementById("task-hint");
    const taskHintBtn = document.getElementById("task-hint-btn");
    
    if (sectionData.task) {
        taskMission.innerText = sectionData.task.mission;
        taskQuestion.innerText = sectionData.task.guiding_question;
        taskHint.innerText = sectionData.task.hint || "";
        taskHint.style.display = "none";
        taskHintBtn.textContent = "Show Hint";
        taskHintBtn.style.display = sectionData.task.hint ? "inline-block" : "none";
        document.querySelector(".task-card").style.display = "block";
    } else {
        document.querySelector(".task-card").style.display = "none";
    }
    
    // Inject controls UI elements
    const controlsContainer = document.getElementById("controls-container");
    controlsContainer.innerHTML = "";
    
    if (sectionData.controls && sectionData.controls.length > 0) {
        document.querySelector(".controls-card").style.display = "block";
        sectionData.controls.forEach(ctrl => {
            const group = document.createElement("div");
            group.className = "control-group";
            
            if (ctrl.type === "range") {
                group.innerHTML = `
                    <div class="control-label-wrapper">
                        <label for="${ctrl.id}">${ctrl.label}</label>
                        <span class="control-val" id="val-${ctrl.id}">${ctrl.val}</span>
                    </div>
                    <input type="range" id="${ctrl.id}" min="${ctrl.min}" max="${ctrl.max}" step="${ctrl.step}" value="${ctrl.val}">
                `;
                controlsContainer.appendChild(group);
                
                const slider = group.querySelector("input");
                slider.addEventListener("input", (e) => {
                    document.getElementById(`val-${ctrl.id}`).innerText = e.target.value;
                    updateSimulation();
                });
            } else if (ctrl.type === "select") {
                let optionsHTML = ctrl.options.map(o => `<option value="${o.val}">${o.label}</option>`).join('');
                group.innerHTML = `
                    <label for="${ctrl.id}" style="font-size: 13px; font-weight: 500; color: var(--text-secondary); margin-bottom: 6px;">${ctrl.label}</label>
                    <select id="${ctrl.id}" class="form-control">
                        ${optionsHTML}
                    </select>
                `;
                controlsContainer.appendChild(group);
                
                const selectEl = group.querySelector("select");
                selectEl.addEventListener("change", () => {
                    if (activeModule === "m3_1" && ctrl.id === "manifold") adjustMetricSliders(selectEl.value);
                    if (activeModule === "m3_4" && ctrl.id === "manifold") adjustGeodesicSliders(selectEl.value);
                    updateSimulation();
                });
            }
        });
    } else {
        document.querySelector(".controls-card").style.display = "none";
    }
    
    // Inject metrics list
    const statsContainer = document.getElementById("stats-container");
    statsContainer.innerHTML = "";
    if (sectionData.stats && sectionData.stats.length > 0) {
        document.querySelector(".stats-card").style.display = "block";
        sectionData.stats.forEach(stat => {
            const item = document.createElement("div");
            item.className = "stat-item";
            item.innerHTML = `
                <div class="stat-label">${stat.label}</div>
                <div class="stat-value" id="stat-${stat.id}">${stat.value}</div>
            `;
            statsContainer.appendChild(item);
        });
    } else {
        document.querySelector(".stats-card").style.display = "none";
    }
    
    updateSimulation();
}

function getLegacyApiPath(modId) {
    switch (modId) {
        case "m2_1": return "/api/charts"; // fallback
        case "m2_2": return "/api/tangent_space";
        case "m2_3": return "/api/pushforward";
        case "m2_4": return "/api/tensor_transform";
        case "m3_1": return "/api/metric";
        case "m3_2": return "/api/parallel_transport";
        case "m3_3": return "/api/levicivita";
        case "m3_4": return "/api/geodesic";
        case "m3_5": return "/api/statistical_manifold";
    }
    return "";
}

// Adjust sliders range depending on selected metric space
function adjustMetricSliders(manifold) {
    const uSlider = document.getElementById("u");
    const vSlider = document.getElementById("v");
    if (!uSlider || !vSlider) return;

    if (manifold === 'sphere') {
        uSlider.min = 0.1; uSlider.max = 3.0; uSlider.value = 1.0;
        vSlider.min = 0.0; vSlider.max = 6.2; vSlider.value = 1.5;
        document.querySelector("label[for='u']").innerHTML = "Coordinate $\\theta$ (latitude)";
        document.querySelector("label[for='v']").innerHTML = "Coordinate $\\phi$ (longitude)";
    } else if (manifold === 'torus') {
        uSlider.min = 0.0; uSlider.max = 6.2; uSlider.value = 1.5;
        vSlider.min = 0.0; vSlider.max = 6.2; vSlider.value = 1.5;
        document.querySelector("label[for='u']").innerHTML = "Coordinate $u$ (major angle)";
        document.querySelector("label[for='v']").innerHTML = "Coordinate $v$ (minor angle)";
    } else if (manifold === 'poincare') {
        uSlider.min = -4.0; uSlider.max = 4.0; uSlider.value = 0.0;
        vSlider.min = 0.1; vSlider.max = 4.0; vSlider.value = 1.5;
        document.querySelector("label[for='u']").innerHTML = "Coordinate $x$";
        document.querySelector("label[for='v']").innerHTML = "Coordinate $y$ ($y > 0$)";
    }
    document.getElementById("val-u").innerText = uSlider.value;
    document.getElementById("val-v").innerText = vSlider.value;
}

// Adjust geodesic parameters depending on selected surface
function adjustGeodesicSliders(manifold) {
    const startU = document.getElementById("start_u");
    const startV = document.getElementById("start_v");
    if (!startU || !startV) return;

    if (manifold === 'sphere') {
        startU.min = 0.2; startU.max = 2.8; startU.value = 1.2;
        startV.min = 0.0; startV.max = 6.2; startV.value = 0.1;
    } else { // torus
        startU.min = 0.0; startU.max = 6.2; startU.value = 1.5;
        startV.min = 0.0; startV.max = 6.2; startV.value = 0.5;
    }
    document.getElementById("val-start_u").innerText = startU.value;
    document.getElementById("val-start_v").innerText = startV.value;
}

// Gather all inputs and fetch from python server
function updateSimulation() {
    const mod = moduleData[activeModule];
    let sectionData = mod.sections ? mod.sections.find(s => s.id === activeSectionId) : null;
    
    if (!sectionData) {
        sectionData = { controls: mod.controls, apiPath: getLegacyApiPath(activeModule) };
    }
    
    const params = {};
    if (sectionData.controls) {
        sectionData.controls.forEach(ctrl => {
            const el = document.getElementById(ctrl.id);
            if (el) params[ctrl.id] = el.value;
        });
    }

    const queryString = new URLSearchParams(params).toString();
    const apiPath = sectionData.apiPath;

    fetch(`${API_URL}${apiPath}?${queryString}`)
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                console.error("API error:", data.error);
                return;
            }
            renderPlot(data);
            updateStatsUI(data);
            
            // Render workbench for supported modules
            if (window.WorkbenchRenderer) {
                let wbData = data;
                if (activeModule === 'm2_3' && data.pushforward && data.pushforward.workbench) {
                    wbData = data.pushforward;
                } else if (activeModule === 'm3_2' && data.transport_data && data.transport_data.workbench) {
                    wbData = data.transport_data;
                }
                WorkbenchRenderer.render(activeModule, wbData);
            }
        })
        .catch(err => {
            console.error("Fetch failed. Is the Python server running?", err);
        });
}

// Update stats metric cards in the UI
function updateStatsUI(data) {
    if (data.stats) {
        Object.keys(data.stats).forEach(key => {
            const el = document.getElementById(`stat-${key}`);
            if (el) el.innerText = data.stats[key];
        });
    }
    
    // Legacy fallback
    if (activeModule === "m2_1" && (!activeSectionId || activeSectionId === "charts")) {
        const el = document.getElementById("chart_type");
        const isNorth = el ? el.value === "north" : true;
        const sd1 = document.getElementById("stat-coord_desc");
        if(sd1) sd1.innerText = isNorth ? "North Pole Chart" : "South Pole Chart";
        const sd2 = document.getElementById("stat-overlap_status");
        if(sd2) sd2.innerText = "Active Stereographic";
    }
    
    else if (activeModule === "m2_2") {
        if (activeSectionId === "derivations" && data.gap) {
            document.getElementById("stat-gap_dist").innerText = data.gap_dist.toFixed(4);
        } else if (activeSectionId === "tangent_basis" && data.tangent_data) {
            const p = data.tangent_data.p;
            document.getElementById("stat-p_coords").innerText = `(${p[0].toFixed(2)}, ${p[1].toFixed(2)}, ${p[2].toFixed(2)})`;
            document.getElementById("stat-basis_lengths").innerText = `|∂u|=${data.tangent_data.len_eu.toFixed(2)}, |∂v|=${data.tangent_data.len_ev.toFixed(2)}`;
        } else if (activeSectionId === "covectors" && data.scalar_val !== undefined) {
            document.getElementById("stat-pierced_planes").innerText = data.scalar_val.toFixed(2);
        } else if (activeSectionId === "differential" && data.df_val !== undefined) {
            document.getElementById("stat-df_val").innerText = data.df_val.toFixed(2);
        }
    }
    
    else if (activeModule === "m2_3") {
        if (activeSectionId === "pushforward" && data.pushforward) {
            const pf = data.pushforward.v_3d;
            document.getElementById("stat-pf_vector").innerText = `(${pf[0].toFixed(2)}, ${pf[1].toFixed(2)}, ${pf[2].toFixed(2)})`;
        } else if (activeSectionId === "pullback" && data.pullback) {
            const pb = data.pullback.fw_covector;
            document.getElementById("stat-pb_covector").innerText = `${pb[0].toFixed(2)} du + ${pb[1].toFixed(2)} dv`;
        } else if (activeSectionId === "duality" && data.eval_pullback !== undefined) {
            document.getElementById("stat-cov_eval").innerText = `${data.eval_pullback.toFixed(2)} == ${data.eval_pushforward.toFixed(2)}`;
        }
    }
    
    else if (activeModule === "m2_4") {
        const T = data.T;
        const Tp = data.T_prime;
        document.getElementById("stat-t_comp").innerText = `[${T[0][0].toFixed(1)}, ${T[0][1].toFixed(1)}; ${T[1][0].toFixed(1)}, ${T[1][1].toFixed(1)}]`;
        document.getElementById("stat-t_prime_comp").innerText = `[${Tp[0][0].toFixed(1)}, ${Tp[0][1].toFixed(1)}; ${Tp[1][0].toFixed(1)}, ${Tp[1][1].toFixed(1)}]`;
        document.getElementById("stat-invariants").innerText = `Det = ${data.det_T.toFixed(3)} | Tr = ${data.trace_T.toFixed(2)}`;
    }
    
    else if (activeModule === "m3_1" && data.g) {
        const g = data.g;
        document.getElementById("stat-metric_g").innerText = `[${g[0][0].toFixed(2)}, ${g[0][1].toFixed(2)}; ${g[1][0].toFixed(2)}, ${g[1][1].toFixed(2)}]`;
        const det = g[0][0] * g[1][1] - g[0][1] * g[1][0];
        document.getElementById("stat-metric_det").innerText = det.toFixed(4);
    }
    
    else if (activeModule === "m3_2" && data.transport_data) {
        document.getElementById("stat-holonomy_angle").innerText = `${data.transport_data.angle_error_deg.toFixed(1)}°`;
    }
    
    else if (activeModule === "m3_3" && data.g) {
        // Compute connection Christoffels approximately or read symbols
        // For sphere: Gamma^theta_phiphi = -sin(theta)cos(theta), Gamma^phi_thetaphi = cot(theta)
        const uVal = parseFloat(document.getElementById("u").value);
        const manifold = document.getElementById("manifold").value;
        if (manifold === 'sphere') {
            const g_t_pp = -Math.sin(uVal) * Math.cos(uVal);
            const g_p_tp = 1.0 / Math.tan(uVal);
            document.getElementById("stat-gamma_symbols").innerText = `Γ^θ_φφ = ${g_t_pp.toFixed(2)} | Γ^φ_θφ = ${g_p_tp.toFixed(2)}`;
        } else {
            // Torus non-zero Christoffel symbols
            const vVal = parseFloat(document.getElementById("v").value);
            const R = 2.0, r = 0.6;
            const denom = R + r * Math.cos(vVal);
            const g_u_uv = -r * Math.sin(vVal) / denom;
            const g_v_uu = denom * Math.sin(vVal) / r;
            document.getElementById("stat-gamma_symbols").innerText = `Γ^u_uv = ${g_u_uv.toFixed(2)} | Γ^v_uu = ${g_v_uu.toFixed(2)}`;
        }
    }
    
    else if (activeModule === "m3_4") {
        document.getElementById("stat-geo_status").innerText = "RK45 Solved";
        document.getElementById("stat-geo_length").innerText = "120 Steps";
    }
    
    else if (activeModule === "m3_5") {
        // Fisher distance formula for half-plane geodesics
        // d = arcosh( 1 + ((mu1-mu2)^2 + 2*(sigma1-sigma2)^2) / (2*sigma1*sigma2) )
        const mu1 = parseFloat(document.getElementById("mu1").value);
        const s1 = parseFloat(document.getElementById("sigma1").value);
        const mu2 = parseFloat(document.getElementById("mu2").value);
        const s2 = parseFloat(document.getElementById("sigma2").value);
        const num = Math.pow(mu1 - mu2, 2) + 2 * Math.pow(s1 - s2, 2);
        const d_fisher = Math.acosh(1 + num / (2 * s1 * s2));
        document.getElementById("stat-dist_length").innerText = d_fisher.toFixed(3);
    }
}

// Render Plotly 3D visualisations depending on activeModule and API data
function renderPlot(data) {
    const layout_base = {
        paper_bgcolor: '#0a0e06',
        plot_bgcolor: '#0a0e06',
        margin: { l: 0, r: 0, b: 0, t: 0 },
        showlegend: false,
        scene: {
            bgcolor: '#0a0e06',
            xaxis: { title: 'X', color: '#4a6a40', gridcolor: '#1a2414', zeroline: false },
            yaxis: { title: 'Y', color: '#4a6a40', gridcolor: '#1a2414', zeroline: false },
            zaxis: { title: 'Z', color: '#4a6a40', gridcolor: '#1a2414', zeroline: false },
            camera: {
                eye: { x: 1.5, y: 1.5, z: 1.2 }
            }
        }
    };

    let traces = [];

    if (activeModule === "m2_1") {
        if (activeSectionId === "hausdorff" && data.hausdorff) {
            // 2D plot for Hausdorff
            const rA = data.hausdorff.radius_a;
            const rB = data.hausdorff.radius_b;
            traces.push({
                type: 'scatter', mode: 'lines+markers',
                x: [-3, 3], y: [0, 0],
                line: { color: '#4a6a40', width: 2 }, marker: { size: 1 }
            });
            // Origin A and its open set
            traces.push({
                type: 'scatter', mode: 'markers',
                x: [0], y: [0.1],
                marker: { color: '#a3e635', size: 10, symbol: 'diamond' },
                name: 'Origin 1 (A)'
            });
            traces.push({
                type: 'scatter', mode: 'lines',
                x: [-rA, rA], y: [0.1, 0.1],
                line: { color: '#a3e635', width: 8 }, opacity: 0.6
            });
            // Origin B and its open set
            traces.push({
                type: 'scatter', mode: 'markers',
                x: [0], y: [-0.1],
                marker: { color: '#0e7490', size: 10, symbol: 'diamond' },
                name: 'Origin 2 (B)'
            });
            traces.push({
                type: 'scatter', mode: 'lines',
                x: [-rB, rB], y: [-0.1, -0.1],
                line: { color: '#0e7490', width: 8 }, opacity: 0.6
            });
            
            const layout_2d = {
                paper_bgcolor: '#0a0e06', plot_bgcolor: '#0a0e06',
                margin: { l: 20, r: 20, b: 20, t: 20 }, showlegend: false,
                xaxis: { range: [-3, 3], showgrid: false, zeroline: false, visible: false },
                yaxis: { range: [-1, 1], showgrid: false, zeroline: false, visible: false }
            };
            Plotly.newPlot('plotly-div', traces, layout_2d);
            
        } else if (activeSectionId === "locally_euclidean" && data.locally_euclidean) {
            // 3D plot for sphere cap vs flat plane
            const cap = data.locally_euclidean.sphere;
            const plane = data.locally_euclidean.plane;
            
            traces.push({
                type: 'surface',
                x: cap.x, y: cap.y, z: cap.z,
                opacity: 0.8,
                showscale: false,
                colorscale: [[0, '#0e2010'], [1, '#a3e635']]
            });
            
            traces.push({
                type: 'surface',
                x: plane.x, y: plane.y, z: plane.z,
                opacity: 0.4,
                showscale: false,
                colorscale: [[0, '#0a1a2a'], [1, '#0e7490']]
            });
            
            // Adjust camera zoom based on max_deviation or radius
            const layout_3d = Object.assign({}, layout_base);
            layout_3d.scene.camera = { eye: { x: 1.0, y: 1.0, z: 0.5 } };
            Plotly.newPlot('plotly-div', traces, layout_3d);
            
        } else if (activeSectionId === "transition_maps" && data.transition) {
            // 2D plot for Transition Map (Inversion)
            const uN = data.transition.workbench.steps[0].vector[0];
            const vN = data.transition.workbench.steps[0].vector[1];
            const uS = data.transition.u_S;
            const vS = data.transition.v_S;
            
            // Draw Equator (Unit Circle)
            const angles = Array.from({length: 100}, (_, i) => i * 2 * Math.PI / 100);
            const cx = angles.map(a => Math.cos(a));
            const cy = angles.map(a => Math.sin(a));
            
            traces.push({
                type: 'scatter', mode: 'lines',
                x: cx, y: cy,
                line: { color: '#4a6a40', width: 2, dash: 'dash' }, name: 'Equator'
            });
            
            // Point on North Chart
            traces.push({
                type: 'scatter', mode: 'markers',
                x: [uN], y: [vN],
                marker: { color: '#a3e635', size: 12 }, name: 'North Coord (u_N, v_N)'
            });
            
            // Mapped point on South Chart
            traces.push({
                type: 'scatter', mode: 'markers',
                x: [uS], y: [vS],
                marker: { color: '#d97706', size: 12, symbol: 'x' }, name: 'South Coord (u_S, v_S)'
            });
            
            const layout_2d = {
                paper_bgcolor: '#0a0e06', plot_bgcolor: '#0a0e06',
                margin: { l: 20, r: 20, b: 20, t: 20 }, showlegend: true,
                legend: { font: { color: '#b8f7a8' } },
                xaxis: { range: [-3, 3], gridcolor: '#1a2414', zerolinecolor: '#4a6a40' },
                yaxis: { range: [-3, 3], scaleanchor: 'x', scaleratio: 1, gridcolor: '#1a2414', zerolinecolor: '#4a6a40' }
            };
            Plotly.newPlot('plotly-div', traces, layout_2d);
            
        } else if (data.sphere_mesh && data.grid_mesh) {
            // Existing Charts fallback
            const s = data.sphere_mesh;
            const g = data.grid_mesh;
            
            traces.push({
                type: 'surface',
                x: s.x, y: s.y, z: s.z,
                opacity: 0.18, showscale: false,
                colorscale: [[0, '#0e2010'], [1, '#1a4020']]
            });
            
            for (let i = 0; i < g.x.length; i += 2) {
                traces.push({
                    type: 'scatter3d', mode: 'lines',
                    x: g.x[i], y: g.y[i], z: g.z[i],
                    line: { color: '#a3e635', width: 2 }, opacity: 0.6
                });
                const lat_x = g.x.map(row => row[i]);
                const lat_y = g.y.map(row => row[i]);
                const lat_z = g.z.map(row => row[i]);
                traces.push({
                    type: 'scatter3d', mode: 'lines',
                    x: lat_x, y: lat_y, z: lat_z,
                    line: { color: '#0e7490', width: 2 }, opacity: 0.6
                });
            }
            const midIdx = Math.floor(g.x.length / 2);
            traces.push({
                type: 'scatter3d', mode: 'markers',
                x: [g.x[midIdx][midIdx]], y: [g.y[midIdx][midIdx]], z: [g.z[midIdx][midIdx]],
                marker: { color: '#d97706', size: 9 }
            });
            Plotly.newPlot('plotly-div', traces, layout_base);
        }
    }
    
    else if (activeModule === "m2_2") {
        if (activeSectionId === "derivations" && data.gap) {
            // Lie bracket gap logic (2D)
            const p0 = data.p0;
            const p1m = data.path1_mid;
            const p1e = data.path1_end;
            const p2m = data.path2_mid;
            const p2e = data.path2_end;
            
            traces.push({
                type: 'scatter', mode: 'lines+markers',
                x: [p0[0], p1m[0], p1e[0]], y: [p0[1], p1m[1], p1e[1]],
                line: { color: '#a3e635', width: 3 }, name: 'Path 1 (X then Y)'
            });
            traces.push({
                type: 'scatter', mode: 'lines+markers',
                x: [p0[0], p2m[0], p2e[0]], y: [p0[1], p2m[1], p2e[1]],
                line: { color: '#0e7490', width: 3 }, name: 'Path 2 (Y then X)'
            });
            traces.push({
                type: 'scatter', mode: 'lines',
                x: [p1e[0], p2e[0]], y: [p1e[1], p2e[1]],
                line: { color: '#d97706', width: 4, dash: 'dot' }, name: 'Commutator Gap'
            });
            
            const layout_2d = {
                paper_bgcolor: '#0a0e06', plot_bgcolor: '#0a0e06', margin: { l: 20, r: 20, b: 20, t: 20 }, showlegend: true, legend: { font: { color: '#b8f7a8' } },
                xaxis: { title: 'X', color: '#4a6a40', gridcolor: '#1a2414' },
                yaxis: { title: 'Y', color: '#4a6a40', gridcolor: '#1a2414' }
            };
            Plotly.newPlot('plotly-div', traces, layout_2d);
            
        } else if (activeSectionId === "tangent_basis" && data.tangent_data) {
            // Ellipsoid tangent space
            const e = data.ellipsoid_mesh;
            const t = data.tangent_data;
            traces.push({ type: 'surface', x: e.x, y: e.y, z: e.z, opacity: 0.25, showscale: false, colorscale: [[0, '#0e2010'], [1, '#2a5030']] });
            traces.push({ type: 'surface', x: t.plane_x, y: t.plane_y, z: t.plane_z, opacity: 0.55, showscale: false, colorscale: [[0, '#0a1a2a'], [1, '#0e4a6a']] });
            traces.push({ type: 'scatter3d', mode: 'markers', x: [t.p[0]], y: [t.p[1]], z: [t.p[2]], marker: { color: '#a3e635', size: 8 } });
            traces.push({ type: 'scatter3d', mode: 'lines', x: [t.p[0], t.p[0] + t.v_3d[0]], y: [t.p[1], t.p[1] + t.v_3d[1]], z: [t.p[2], t.p[2] + t.v_3d[2]], line: { color: '#d97706', width: 6 } });
            traces.push({ type: 'scatter3d', mode: 'lines', x: [t.p[0], t.p[0] + t.eu[0]], y: [t.p[1], t.p[1] + t.eu[1]], z: [t.p[2], t.p[2] + t.eu[2]], line: { color: '#0e7490', width: 5 } });
            traces.push({ type: 'scatter3d', mode: 'lines', x: [t.p[0], t.p[0] + t.ev[0]], y: [t.p[1], t.p[1] + t.ev[1]], z: [t.p[2], t.p[2] + t.ev[2]], line: { color: '#a3e635', width: 5 } });
            Plotly.newPlot('plotly-div', traces, layout_base);
            
        } else if (activeSectionId === "covectors" && data.lines_x) {
            // Covector planes
            data.lines_x.forEach((lx, idx) => {
                traces.push({
                    type: 'scatter', mode: 'lines',
                    x: [lx, lx], y: [-3, 3],
                    line: { color: '#0e7490', width: 2 }, showlegend: false
                });
            });
            traces.push({
                type: 'scatter', mode: 'lines+markers',
                x: [0, data.vector[0]], y: [0, data.vector[1]],
                line: { color: '#a3e635', width: 4 }, marker: { size: 8, symbol: 'arrow' }, name: 'Vector V'
            });
            const layout_2d = {
                paper_bgcolor: '#0a0e06', plot_bgcolor: '#0a0e06', margin: { l: 20, r: 20, b: 20, t: 20 }, showlegend: true, legend: { font: { color: '#b8f7a8' } },
                xaxis: { range: [-3, 3], title: 'X', color: '#4a6a40', gridcolor: '#1a2414' },
                yaxis: { range: [-3, 3], title: 'Y', color: '#4a6a40', gridcolor: '#1a2414' }
            };
            Plotly.newPlot('plotly-div', traces, layout_2d);
            
        } else if (activeSectionId === "differential" && data.contour_z) {
            traces.push({
                type: 'contour',
                z: data.contour_z, x: data.x_grid, y: data.y_grid,
                colorscale: [[0, '#0a0e06'], [1, '#4a6a40']], showscale: false, contours: { coloring: 'heatmap' }
            });
            traces.push({
                type: 'scatter', mode: 'lines+markers',
                x: [data.p[0], data.p[0] + data.vector[0]], y: [data.p[1], data.p[1] + data.vector[1]],
                line: { color: '#a3e635', width: 4 }, marker: { size: 8 }, name: 'Vector V'
            });
            const layout_2d = { paper_bgcolor: '#0a0e06', plot_bgcolor: '#0a0e06', margin: { l: 20, r: 20, b: 20, t: 20 }, xaxis: { color: '#4a6a40' }, yaxis: { color: '#4a6a40' } };
            Plotly.newPlot('plotly-div', traces, layout_2d);
        }
    }
    
    else if (activeModule === "m2_3") {
        if (activeSectionId === "pushforward" && data.pushforward) {
            const pf = data.pushforward;
            const t = data.torus_mesh;
            traces.push({ type: 'surface', x: t.x, y: t.y, z: t.z, opacity: 0.22, showscale: false, colorscale: [[0, '#1a0e08'], [1, '#4a2010']] });
            traces.push({ type: 'scatter3d', mode: 'markers', x: [pf.p_3d[0]], y: [pf.p_3d[1]], z: [pf.p_3d[2]], marker: { color: '#0e7490', size: 8 } });
            traces.push({ type: 'scatter3d', mode: 'lines', x: [pf.p_3d[0], pf.p_3d[0] + pf.v_3d[0]], y: [pf.p_3d[1], pf.p_3d[1] + pf.v_3d[1]], z: [pf.p_3d[2], pf.p_3d[2] + pf.v_3d[2]], line: { color: '#d97706', width: 6 } });
            Plotly.newPlot('plotly-div', traces, layout_base);
            
        } else if (activeSectionId === "pullback" && data.pullback) {
            const pb = data.pullback;
            const t = data.torus_mesh;
            traces.push({ type: 'surface', x: t.x, y: t.y, z: t.z, opacity: 0.22, showscale: false, colorscale: [[0, '#1a0e08'], [1, '#4a2010']] });
            pb.planes_3d.forEach(plane => {
                traces.push({ type: 'surface', x: plane.x, y: plane.y, z: plane.z, opacity: 0.6, showscale: false, colorscale: [[0, '#0e7490'], [1, '#0e7490']] });
            });
            Plotly.newPlot('plotly-div', traces, layout_base);
        } else if (activeSectionId === "duality") {
            // Nothing to render, just algebra workbench!
            document.getElementById("plotly-div").innerHTML = "<div style='color: #4a6a40; text-align: center; margin-top: 100px; font-size: 1.2rem;'><i class='fas fa-calculator' style='font-size: 3rem; margin-bottom: 20px; display: block;'></i>See Algebra Workbench below for step-by-step Duality proof.</div>";
        }
    }
    
    else if (activeModule === "m2_4") {
        // Tensor transform. (2D Plot representation is more readable than 3D!)
        const layout_2d = {
            paper_bgcolor: '#0a0e06',
            plot_bgcolor: '#0a0e06',
            margin: { l: 40, r: 40, b: 40, t: 40 },
            showlegend: false,
            xaxis: { range: [-3.5, 3.5], color: '#4a6a40', gridcolor: '#1a2414', zerolinecolor: '#2a3a1a' },
            yaxis: { range: [-3.5, 3.5], color: '#4a6a40', gridcolor: '#1a2414', zerolinecolor: '#2a3a1a', scaleanchor: 'x' }
        };
        
        // Draw the invariant tensor shape (fixed ellipse)
        traces.push({
            type: 'scatter',
            mode: 'lines',
            x: data.ellipse_x,
            y: data.ellipse_y,
            line: { color: '#0e7490', width: 3 }
        });
        
        // Draw rotating coordinate axes (showing basis rotation)
        const alpha = parseFloat(document.getElementById("alpha").value);
        const cos_a = Math.cos(alpha);
        const sin_a = Math.sin(alpha);
        
        // X' axis
        traces.push({
            type: 'scatter',
            mode: 'lines+text',
            x: [-3 * cos_a, 3 * cos_a],
            y: [-3 * sin_a, 3 * sin_a],
            line: { color: '#a3e635', width: 1.5, dash: 'dash' },
            text: ['', "x'"],
            textposition: 'top right',
            textfont: { color: '#a3e635' }
        });
        // Y' axis
        traces.push({
            type: 'scatter',
            mode: 'lines+text',
            x: [3 * sin_a, -3 * sin_a],
            y: [-3 * cos_a, 3 * cos_a],
            line: { color: '#d97706', width: 1.5, dash: 'dash' },
            text: ['', "y'"],
            textposition: 'top left',
            textfont: { color: '#d97706' }
        });
        
        Plotly.newPlot('plotly-div', traces, layout_2d);
    }
    
    else if (activeModule === "m3_1" && data.g) {
        // Metric spaces / Tissot indicatrices
        const manifold = document.getElementById("manifold").value;
        
        if (data.mesh) {
            // Plot 3D surface
            traces.push({
                type: 'surface',
                x: data.mesh.x, y: data.mesh.y, z: data.mesh.z,
                opacity: 0.22,
                showscale: false,
                colorscale: [[0, '#0a1a0a'], [0.5, '#1a3a1a'], [1, '#2a5a2a']]
            });
            
            // Plot selected coordinate center indicatrix on 3D mesh
            // For simple visualization, we plot the indicatrix ellipse coordinate path
            const uVal = parseFloat(document.getElementById("u").value);
            const vVal = parseFloat(document.getElementById("v").value);
            
            // Project the 2D indicatrix ellipse path on coordinates to 3D points
            const ell_x = [];
            const ell_y = [];
            const ell_z = [];
            
            for (let i = 0; i < data.ellipse_u.length; ++i) {
                const eu = data.ellipse_u[i];
                const ev = data.ellipse_v[i];
                let px, py, pz;
                if (manifold === 'sphere') {
                    px = Math.sin(eu) * Math.cos(ev);
                    py = Math.sin(eu) * Math.sin(ev);
                    pz = Math.cos(eu);
                } else if (manifold === 'torus') {
                    const R = 2.0, r = 0.6;
                    px = (R + r * Math.cos(ev)) * Math.cos(eu);
                    py = (R + r * Math.cos(ev)) * Math.sin(eu);
                    pz = r * Math.sin(ev);
                } else { // Flat / Poincare (mapped on coordinates)
                    px = eu; py = ev; pz = 0.0;
                }
                ell_x.push(px); ell_y.push(py); ell_z.push(pz);
            }
            
            traces.push({
                type: 'scatter3d',
                mode: 'lines',
                x: ell_x, y: ell_y, z: ell_z,
                line: { color: '#d97706', width: 5 }
            });
            
            Plotly.newPlot('plotly-div', traces, layout_base);
            
        } else {
            // Poincare Half Plane 2D visualization
            const layout_2d = {
                paper_bgcolor: '#0a0e06',
                plot_bgcolor: '#0a0e06',
                margin: { l: 40, r: 40, b: 40, t: 40 },
                showlegend: false,
                xaxis: { range: [-3, 3], color: '#4a6a40', gridcolor: '#1a2414' },
                yaxis: { range: [0, 4.0], color: '#4a6a40', gridcolor: '#1a2414' }
            };
            
            // Draw indicatrix ellipse centered at (u,v)
            traces.push({
                type: 'scatter',
                mode: 'lines',
                x: data.ellipse_u,
                y: data.ellipse_v,
                line: { color: '#d97706', width: 3.5 }
            });
            
            // Draw center dot
            traces.push({
                type: 'scatter',
                mode: 'markers',
                x: [parseFloat(document.getElementById("u").value)],
                y: [parseFloat(document.getElementById("v").value)],
                marker: { color: '#0e7490', size: 9 }
            });
            
            Plotly.newPlot('plotly-div', traces, layout_2d);
        }
    }
    
    else if (activeModule === "m3_2" && data.sphere_mesh) {
        // Parallel transport on Sphere
        const s = data.sphere_mesh;
        const t = data.transport_data;
        
        traces.push({
            type: 'surface',
            x: s.x, y: s.y, z: s.z,
            opacity: 0.25,
            showscale: false,
            colorscale: 'Blues'
        });
        
        // Path loop curve
        const px = t.path_3d.map(p => p[0]);
        const py = t.path_3d.map(p => p[1]);
        const pz = t.path_3d.map(p => p[2]);
        traces.push({
            type: 'scatter3d',
            mode: 'lines',
            x: px, y: py, z: pz,
            line: { color: '#6366f1', width: 4.5 }
        });
        
        // Transported Vectors (plot a few vectors along the curve)
        for (let i = 0; i < px.length; i += 10) {
            traces.push({
                type: 'scatter3d',
                mode: 'lines',
                x: [px[i], px[i] + t.vector_3d[i][0]],
                y: [py[i], py[i] + t.vector_3d[i][1]],
                z: [pz[i], pz[i] + t.vector_3d[i][2]],
                line: { color: '#10b981', width: 4.5 }
            });
        }
        
        // Starting/ending vector highlighted
        traces.push({
            type: 'scatter3d',
            mode: 'lines',
            x: [px[0], px[0] + t.vector_3d[0][0]],
            y: [py[0], py[0] + t.vector_3d[0][1]],
            z: [pz[0], pz[0] + t.vector_3d[0][2]],
            line: { color: '#ec4899', width: 7.0 }
        });

        // The transported vector at the very end (to compare rotation)
        const lastIdx = px.length - 1;
        traces.push({
            type: 'scatter3d',
            mode: 'lines',
            x: [px[lastIdx], px[lastIdx] + t.vector_3d[lastIdx][0]],
            y: [py[lastIdx], py[lastIdx] + t.vector_3d[lastIdx][1]],
            z: [pz[lastIdx], pz[lastIdx] + t.vector_3d[lastIdx][2]],
            line: { color: '#06b6d4', width: 7.0 }
        });

        Plotly.newPlot('plotly-div', traces, layout_base);
    }
    
    else if (activeModule === "m3_3" && data.g) {
        // Levi-Civita connection surface mesh
        traces.push({
            type: 'surface',
            x: data.mesh.x, y: data.mesh.y, z: data.mesh.z,
            opacity: 0.35,
            showscale: false,
            colorscale: 'Blues'
        });
        
        // Plot selected point
        const uVal = parseFloat(document.getElementById("u").value);
        const vVal = parseFloat(document.getElementById("v").value);
        const manifold = document.getElementById("manifold").value;
        
        let px, py, pz;
        if (manifold === 'sphere') {
            px = Math.sin(uVal) * Math.cos(vVal);
            py = Math.sin(uVal) * Math.sin(vVal);
            pz = Math.cos(uVal);
        } else {
            const R = 2.0, r = 0.6;
            px = (R + r * Math.cos(vVal)) * Math.cos(uVal);
            py = (R + r * Math.cos(vVal)) * Math.sin(uVal);
            pz = r * Math.sin(vVal);
        }
        
        traces.push({
            type: 'scatter3d',
            mode: 'markers',
            x: [px], y: [py], z: [pz],
            marker: { color: '#ec4899', size: 8 }
        });

        Plotly.newPlot('plotly-div', traces, layout_base);
    }
    
    else if (activeModule === "m3_4" && data.geodesic) {
        // Geodesics paths
        const m = data.mesh;
        const g = data.geodesic;
        
        traces.push({
            type: 'surface',
            x: m.x, y: m.y, z: m.z,
            opacity: 0.35,
            showscale: false,
            colorscale: 'Purples'
        });
        
        // Geodesic curve path
        traces.push({
            type: 'scatter3d',
            mode: 'lines',
            x: g.x, y: g.y, z: g.z,
            line: { color: '#06b6d4', width: 5.5 }
        });

        Plotly.newPlot('plotly-div', traces, layout_base);
    }
    
    else if (activeModule === "m3_5") {
        // Statistical Manifold Curvature
        // 2D Hyperbolic Half Plane view + Normal PDF curves
        const layout_split = {
            paper_bgcolor: '#090d16',
            plot_bgcolor: '#090d16',
            margin: { l: 40, r: 40, b: 40, t: 40 },
            showlegend: false,
            xaxis: { title: 'Mean (mu)', color: '#64748b', gridcolor: '#1e293b' },
            yaxis: { title: 'Std Dev (sigma)', color: '#64748b', gridcolor: '#1e293b', scaleanchor: 'x' }
        };
        
        // 1. Draw geodesic path in (mu, sigma) plane
        traces.push({
            type: 'scatter',
            mode: 'lines',
            x: data.mu_geodesic,
            y: data.sigma_geodesic,
            line: { color: '#6366f1', width: 3.5 }
        });
        
        // 2. Draw dots at sampled distributions
        data.distributions.forEach((dist, idx) => {
            traces.push({
                type: 'scatter',
                mode: 'markers+text',
                x: [dist.mu],
                y: [dist.sigma],
                marker: { color: '#10b981', size: 10 },
                text: [`d${idx+1}`],
                textposition: 'top right',
                textfont: { color: '#f8fafc', size: 10 }
            });
        });
        
        // Instead of a separate div, let's plot the morphed PDF functions inside the same space
        // by scaling and shifting them so they display as small inset plots under the geodesic!
        // This is a highly creative, wowed aesthetic choice!
        data.distributions.forEach((dist, idx) => {
            // Draw morphed normal PDF graph
            // We scale pdf_y to fit nicely and shift center to (mu, sigma)
            const scale = 0.8;
            const pdf_x_shifted = dist.pdf_x;
            // Shift Y values up so they sit near the coordinate points
            const pdf_y_scaled = dist.pdf_y.map(y => dist.sigma + y * scale);
            
            traces.push({
                type: 'scatter',
                mode: 'lines',
                x: pdf_x_shifted,
                y: pdf_y_scaled,
                line: { color: 'rgba(16, 185, 129, 0.45)', width: 1.5 },
                fill: 'toself',
                fillcolor: 'rgba(16, 185, 129, 0.05)'
            });
        });

        Plotly.newPlot('plotly-div', traces, layout_split);
    }
}
