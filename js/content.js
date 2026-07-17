// ============================================================================
// Module Content — lecture notes, simulation tasks, controls, and stats.
// Loaded before app.js; app.js reads window.moduleData.
//
// Theory strings are HTML + KaTeX ($...$ inline, $$...$$ display; use \\ for
// LaTeX backslashes inside these template literals).
// Sections without an `apiPath` are reading-only (no simulation attached).
// ============================================================================

const moduleData = {
    "m2_1": {
        phase: "Phase 2: Smooth Manifolds",
        title: "Charts and Atlases",
        hook: "Every map of the Earth is wrong in some way — this module explains why, and why that's actually fine.",
        sections: [
            {
                id: "hausdorff",
                title: "1. Topological Manifolds",
                theory: `
                    <p>Before we can do calculus on a curved space, we must say what kind of space we are willing to work on. The answer is a <em>topological manifold</em>: a space that may be globally complicated but is locally indistinguishable from $\\mathbb{R}^n$, and is free of two specific pathologies. We start with the pathologies.</p>
                    <div class="def-block">
                        <div class="def-label">Definition (Topological Space)</div>
                        <p>A <strong>topological space</strong> is a set $X$ together with a collection $\\tau$ of subsets of $X$ (the <em>open sets</em>) such that: (i) $\\varnothing \\in \\tau$ and $X \\in \\tau$; (ii) arbitrary unions of members of $\\tau$ belong to $\\tau$; (iii) finite intersections of members of $\\tau$ belong to $\\tau$.</p>
                    </div>
                    <div class="def-block">
                        <div class="def-label">Definition (Topological Manifold)</div>
                        <p>A topological space $M$ is an <strong>$n$-dimensional topological manifold</strong> if it is</p>
                        <p><strong>(i) Hausdorff:</strong> for any distinct $p, q \\in M$ there exist disjoint open sets $U \\ni p$ and $V \\ni q$;</p>
                        <p><strong>(ii) second-countable:</strong> the topology has a countable base — countably many open sets from which every open set is built by unions;</p>
                        <p><strong>(iii) locally Euclidean of dimension $n$:</strong> every point has an open neighborhood homeomorphic to an open subset of $\\mathbb{R}^n$.</p>
                    </div>
                    <p><strong>Why Hausdorff?</strong> Without it, limits are not unique. The canonical counterexample is the <em>line with two origins</em>: take two copies of $\\mathbb{R}$ and glue them together everywhere <em>except</em> at $0$, leaving two distinct origins $0_A$ and $0_B$. Every open set containing $0_A$ contains a punctured interval $(-\\epsilon, 0) \\cup (0, \\epsilon)$, and so does every open set containing $0_B$ — hence they always intersect. A sequence like $x_k = 1/k$ converges to <em>both</em> origins simultaneously. Calculus (which is built on limits) would be ambiguous on such a space, so we exclude it by decree. Note this space is perfectly locally Euclidean: the pathology is invisible in any single neighborhood.</p>
                    <p><strong>Why second-countable?</strong> This is a size constraint: it rules out monsters like the long line — a space locally identical to $\\mathbb{R}$ but "too long" to be explored by any countable process. Second countability is what later guarantees partitions of unity exist, which is the technical engine behind gluing local constructions (metrics, integrals) into global ones, and behind the Whitney embedding theorem (Lee, <em>Introduction to Smooth Manifolds</em>, Ch. 1–2).</p>
                    <span class="viz-ref">▸ The simulation shows the line with two origins. The two origins are drawn slightly separated for visibility, but they occupy the same location on the line.</span>
                `,
                task: {
                    mission: "Shrink both open-set radii as far as they will go, trying to produce two disjoint neighborhoods — one around each origin.",
                    guiding_question: "Why does every open interval around origin $A$ intersect every open interval around origin $B$, no matter how small the radii?",
                    hint: "Any open set containing either origin must contain a punctured interval $(-\\epsilon, 0) \\cup (0, \\epsilon)$ of the shared line. Two such punctured intervals always overlap — so the Hausdorff condition fails, and $x_k = 1/k$ converges to both origins at once."
                },
                controls: [
                    { id: "radius_a", label: "Open Set Radius around $0_A$", type: "range", min: 0.1, max: 2.0, step: 0.1, val: 1.0 },
                    { id: "radius_b", label: "Open Set Radius around $0_B$", type: "range", min: 0.1, max: 2.0, step: 0.1, val: 1.0 }
                ],
                stats: [
                    { id: "haus_status", label: "Intersection Status", value: "Overlapping" }
                ],
                apiPath: "/api/hausdorff"
            },
            {
                id: "locally_euclidean",
                title: "2. Locally Euclidean Spaces",
                theory: `
                    <div class="def-block">
                        <div class="def-label">Definition (Locally Euclidean)</div>
                        <p>A topological space $M$ is <strong>locally Euclidean of dimension $n$</strong> if every point $p \\in M$ has an open neighborhood $U$ homeomorphic to an open subset of $\\mathbb{R}^n$.</p>
                    </div>
                    <p>The dimension $n$ is well-defined: an open subset of $\\mathbb{R}^n$ is never homeomorphic to an open subset of $\\mathbb{R}^m$ for $n \\neq m$. This is Brouwer's <em>invariance of domain</em> theorem — surprisingly hard to prove, and one of the facts we import from algebraic topology without proof (Lee, Ch. 1, Thm. 1.2).</p>
                    <p><strong>Quantifying "locally flat".</strong> The sphere $S^2$ is locally Euclidean, and the simulation makes this quantitative. Take the spherical cap of angular radius $r$ around the north pole and compare it against the flat tangent disk at the pole. Writing points of the cap as $(\\sin\\theta\\cos\\varphi, \\sin\\theta\\sin\\varphi, \\cos\\theta)$ and matching them to plane points $(\\theta\\cos\\varphi, \\theta\\sin\\varphi, 1)$, the discrepancy at angle $\\theta$ is dominated by the vertical gap $1 - \\cos\\theta \\approx \\theta^2/2$. Hence:</p>
                    $$\\max_{\\text{cap}} \\|\\,p_{\\text{sphere}} - p_{\\text{plane}}\\,\\| \\;\\approx\\; \\tfrac{1}{2}r^2 \\quad \\text{as } r \\to 0.$$
                    <p>Flatness is a <em>second-order</em> property: shrink the neighborhood by half and the deviation drops by a factor of four. This quadratic decay is precisely why first-order calculus works on curved spaces at all — and the coefficient hiding in front of $r^2$ is our first, unnamed encounter with curvature (Module 3.5).</p>
                    <p><strong>Warning.</strong> Locally Euclidean does <em>not</em> mean globally trivial: the sphere is locally flat everywhere yet is not homeomorphic to any subset of the plane, as the next section proves.</p>
                    <span class="viz-ref">▸ In the 3D panel, the green surface is the spherical cap and the blue disk is the flat tangent plane. The "Max Deviation" metric is the exact maximum distance between matched points.</span>
                `,
                task: {
                    mission: "Read off Max Deviation at $r = 1.0$, then at $r = 0.5$, then at $r = 0.25$. Estimate the exponent $k$ in $\\text{deviation} \\sim r^k$.",
                    guiding_question: "Each time you halve $r$, by what factor does the deviation drop? What does that tell you about the order of contact between the sphere and its tangent plane?",
                    hint: "You should see the deviation quarter each time you halve $r$: deviation $\\approx r^2/2$, so $k = 2$. The tangent plane matches the sphere to first order; they disagree only at second order."
                },
                controls: [
                    { id: "cap_radius", label: "Neighborhood Radius $r$ (radians)", type: "range", min: 0.05, max: 1.57, step: 0.05, val: 1.0 }
                ],
                stats: [
                    { id: "max_deviation", label: "Max Deviation", value: "Loading..." }
                ],
                apiPath: "/api/locally_euclidean"
            },
            {
                id: "charts",
                title: "3. Charts: Stereographic Projection",
                theory: `
                    <div class="def-block">
                        <div class="def-label">Definition (Chart)</div>
                        <p>A <strong>chart</strong> on a topological manifold $M$ is a pair $(U, \\phi)$ where $U \\subseteq M$ is open and $\\phi : U \\to \\widehat{U} \\subseteq \\mathbb{R}^n$ is a homeomorphism onto an open subset $\\widehat{U}$ of $\\mathbb{R}^n$. The component functions $\\phi = (x^1, \\dots, x^n)$ are called <em>local coordinates</em> on $U$.</p>
                    </div>
                    <p><strong>Derivation: stereographic projection.</strong> Let $N = (0,0,1)$ be the north pole of the unit sphere. For $p = (x, y, z) \\in S^2 \\setminus \\{N\\}$, draw the ray from $N$ through $p$ and follow it to the equatorial plane $z = 0$. The ray is $\\ell(t) = N + t(p - N) = (tx,\\; ty,\\; 1 + t(z - 1))$, which meets $z = 0$ at $t = \\tfrac{1}{1-z}$ (defined since $z \\neq 1$). Therefore:</p>
                    $$\\phi_N(x, y, z) = \\left(\\frac{x}{1 - z},\\; \\frac{y}{1 - z}\\right).$$
                    <p>For the inverse, run the ray from $N$ through the plane point $(u, v, 0)$: $\\ell(t) = (tu,\\, tv,\\, 1 - t)$. Imposing $\\|\\ell(t)\\| = 1$ gives $t^2(u^2 + v^2 + 1) - 2t = 0$, whose nonzero root is $t = \\tfrac{2}{u^2 + v^2 + 1}$. Hence:</p>
                    $$\\phi_N^{-1}(u, v) = \\frac{\\left(2u,\\; 2v,\\; u^2 + v^2 - 1\\right)}{u^2 + v^2 + 1}.$$
                    <p>Both $\\phi_N$ and $\\phi_N^{-1}$ are manifestly continuous (rational functions with nonvanishing denominators), so $\\phi_N$ is a homeomorphism $S^2 \\setminus \\{N\\} \\to \\mathbb{R}^2$: a single chart covering <em>all but one point</em> of the sphere. The mirror chart $\\phi_S$, projecting from the south pole $S = (0,0,-1)$, covers $S^2 \\setminus \\{S\\}$.</p>
                    <div class="thm-block">
                        <div class="thm-label">Theorem (no global chart)</div>
                        <p>$S^2$ cannot be covered by a single chart. <em>Proof.</em> A chart covering all of $S^2$ would be a homeomorphism from $S^2$ onto an open set $\\widehat{U} \\subseteq \\mathbb{R}^2$. Since $S^2$ is compact, $\\widehat{U}$ would be compact, hence closed in $\\mathbb{R}^2$ — but $\\widehat{U}$ is also open and nonempty, and the only clopen nonempty subset of the connected space $\\mathbb{R}^2$ is $\\mathbb{R}^2$ itself, which is not compact. Contradiction. $\\blacksquare$ (Cf. Lee, Ch. 1.)</p>
                    </div>
                    <div class="def-block">
                        <div class="def-label">Definition (Atlas)</div>
                        <p>An <strong>atlas</strong> for $M$ is a collection of charts $\\{(U_\\alpha, \\phi_\\alpha)\\}$ whose domains cover $M$: $\\bigcup_\\alpha U_\\alpha = M$. By the theorem, every atlas of $S^2$ contains at least two charts — and $\\{\\phi_N, \\phi_S\\}$ shows two suffice.</p>
                    </div>
                    <span class="viz-ref">▸ In the 3D panel, the colored curves are the images under $\\phi_N^{-1}$ (or $\\phi_S^{-1}$) of a regular Cartesian grid in the plane. Watch what the grid does near the projection pole as you raise the boundary limit.</span>
                `,
                task: {
                    mission: "Switch between North and South stereographic charts. Increase the boundary limit to its maximum. Identify the point of the sphere where the grid degenerates — lines pile up but never arrive.",
                    guiding_question: "Can a single chart cover the entire sphere? Why does the grid accumulate at the projection pole without reaching it?",
                    hint: "Points at coordinate radius $\\sqrt{u^2+v^2} = R$ map to sphere points with $z = \\frac{R^2-1}{R^2+1} \\to 1$ as $R \\to \\infty$: the pole is the image of \"the point at infinity,\" which is not in $\\mathbb{R}^2$. Toggle to the South chart and see the missing point switch poles."
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
                id: "spherical_transition",
                title: "4. Changing Charts I: Spherical ↔ Stereographic",
                theory: `
                    <p>A second, familiar coordinate system on the sphere is <strong>spherical coordinates</strong>: colatitude $\\theta$ and longitude $\\varphi$, with</p>
                    $$\\psi^{-1}(\\theta, \\varphi) = (\\sin\\theta\\cos\\varphi,\\; \\sin\\theta\\sin\\varphi,\\; \\cos\\theta).$$
                    <p>Note carefully: this is <em>not</em> a chart on all of $S^2$. At the poles ($\\theta = 0, \\pi$) the longitude is undefined, and $\\varphi$ must be restricted to an open interval such as $(0, 2\\pi)$ — removing a closed half great circle (a "dateline") — before $\\psi$ becomes a homeomorphism onto the open rectangle $(0,\\pi) \\times (0, 2\\pi)$. Choosing a chart always means choosing a domain.</p>
                    <div class="def-block">
                        <div class="def-label">Definition (Transition Map)</div>
                        <p>If $(U_\\alpha, \\phi_\\alpha)$ and $(U_\\beta, \\phi_\\beta)$ are charts with $U_\\alpha \\cap U_\\beta \\neq \\varnothing$, the <strong>transition map</strong> is $$\\phi_\\beta \\circ \\phi_\\alpha^{-1} : \\phi_\\alpha(U_\\alpha \\cap U_\\beta) \\to \\phi_\\beta(U_\\alpha \\cap U_\\beta),$$ a map between open subsets of $\\mathbb{R}^n$ — an object ordinary multivariable calculus can handle.</p>
                    </div>
                    <p><strong>Derivation.</strong> Compose stereographic projection with spherical coordinates. With $x = \\sin\\theta\\cos\\varphi$, $z = \\cos\\theta$:</p>
                    $$u = \\frac{\\sin\\theta\\cos\\varphi}{1 - \\cos\\theta}, \\qquad \\frac{\\sin\\theta}{1-\\cos\\theta} = \\frac{2\\sin\\tfrac{\\theta}{2}\\cos\\tfrac{\\theta}{2}}{2\\sin^2\\tfrac{\\theta}{2}} = \\cot\\tfrac{\\theta}{2},$$
                    <p>using the half-angle identities. Therefore:</p>
                    $$(\\phi_N \\circ \\psi^{-1})(\\theta, \\varphi) = \\cot\\tfrac{\\theta}{2}\\,(\\cos\\varphi,\\; \\sin\\varphi).$$
                    <p>This is a <em>genuinely nonlinear</em> map — there is no matrix that implements it. Linear algebra enters only through its derivative, the Jacobian</p>
                    $$J = \\frac{\\partial(u,v)}{\\partial(\\theta,\\varphi)} = \\begin{pmatrix} -\\tfrac{\\cos\\varphi}{2\\sin^2(\\theta/2)} & -\\cot\\tfrac{\\theta}{2}\\sin\\varphi \\\\[4pt] -\\tfrac{\\sin\\varphi}{2\\sin^2(\\theta/2)} & \\phantom{-}\\cot\\tfrac{\\theta}{2}\\cos\\varphi \\end{pmatrix}, \\qquad \\det J = \\frac{-\\cot\\tfrac{\\theta}{2}}{2\\sin^2\\tfrac{\\theta}{2}} \\neq 0 \\;\\; \\text{on } (0,\\pi),$$
                    <p>which is a <em>different matrix at every point</em>. This pointwise linearization is precisely the idea that Module 2.2 will elevate into the tangent space, and the smoothness of transition maps like this one is what will let us differentiate on the sphere without ever leaving coordinates.</p>
                    <span class="viz-ref">▸ In the 3D panel: the orange dashed ray runs from the north pole through $p$ (green) to its stereographic image (cyan ×) on the equatorial plane. Open the Algebra Workbench to see the transition map evaluated and its Jacobian cross-checked against finite differences.</span>
                `,
                task: {
                    mission: "Slide $\\theta$ down toward $0$ (the north pole) and watch the image point on the plane. Then slide $\\theta$ up toward $\\pi$ and watch again.",
                    guiding_question: "As $\\theta \\to 0$ the spherical coordinates stay finite but the stereographic image escapes to infinity. What does this mismatch tell you about comparing quantities computed in different charts?",
                    hint: "$\\cot(\\theta/2) \\to \\infty$ as $\\theta \\to 0$: the same point has modest coordinates in one chart and enormous coordinates in another. Raw coordinate values mean nothing by themselves — only objects with a transformation law (Modules 2.2–2.4) carry chart-independent information."
                },
                controls: [
                    { id: "theta", label: "Colatitude $\\theta$", type: "range", min: 0.35, max: 2.9, step: 0.05, val: 1.0 },
                    { id: "phi", label: "Longitude $\\varphi$", type: "range", min: 0.1, max: 6.2, step: 0.05, val: 0.8 }
                ],
                stats: [
                    { id: "sph_coords", label: "Spherical Chart (θ, φ)", value: "Loading..." },
                    { id: "st_coords", label: "Stereographic Chart (u, v)", value: "Loading..." },
                    { id: "trans_det", label: "det J (transition)", value: "Loading..." }
                ],
                apiPath: "/api/spherical_transition"
            },
            {
                id: "transition_maps",
                title: "5. Changing Charts II: North ↔ South and Smooth Atlases",
                theory: `
                    <p>Now compose the two stereographic charts with each other. With $r^2 = u_N^2 + v_N^2$, the inverse formula from Section 3 gives $z = \\tfrac{r^2 - 1}{r^2 + 1}$, so $1 + z = \\tfrac{2r^2}{r^2+1}$, and the south projection $\\phi_S(x,y,z) = \\left(\\tfrac{x}{1+z}, \\tfrac{y}{1+z}\\right)$ evaluates to:</p>
                    $$(\\phi_S \\circ \\phi_N^{-1})(u_N, v_N) = \\left(\\frac{u_N}{u_N^2 + v_N^2},\\; \\frac{v_N}{u_N^2 + v_N^2}\\right).$$
                    <p>This is <strong>inversion in the unit circle</strong>. Its domain is $\\phi_N(U_N \\cap U_S) = \\mathbb{R}^2 \\setminus \\{0\\}$: the origin is excluded because $\\phi_N^{-1}(0,0)$ is the south pole, which the south chart does not cover. On its domain the map is a quotient of polynomials with nonvanishing denominator, hence $C^\\infty$; it is its own inverse (apply it twice), so its inverse is also $C^\\infty$.</p>
                    <div class="def-block">
                        <div class="def-label">Definition (Diffeomorphism)</div>
                        <p>A map $F: V \\to W$ between open subsets of $\\mathbb{R}^n$ is a <strong>diffeomorphism</strong> if it is bijective, $C^\\infty$, and $F^{-1}$ is $C^\\infty$. The transition map above is a diffeomorphism of $\\mathbb{R}^2 \\setminus \\{0\\}$ onto itself.</p>
                    </div>
                    <div class="def-block">
                        <div class="def-label">Definition (Smooth Atlas, Smooth Manifold)</div>
                        <p>An atlas is <strong>smooth</strong> if every transition map between its charts is a diffeomorphism. A <strong>smooth manifold</strong> is a topological manifold equipped with a maximal smooth atlas (every chart compatible with the atlas is already in it — a bookkeeping device that frees us from privileging any particular coordinates).</p>
                    </div>
                    <p>The pair $\\{\\phi_N, \\phi_S\\}$ is a smooth atlas for $S^2$: we just verified its only transition map is a diffeomorphism. This single check upgrades the sphere from a topological manifold to a <em>smooth</em> manifold — the arena for everything in this course.</p>
                    <p><strong>Two workbench observations.</strong> First, the transition map is not linear (the factor $1/r^2$ depends on the point); its Jacobian is the honest linear object, and it changes from point to point. Second, $\\det J = -1/r^4 < 0$ everywhere: this particular chart change reverses orientation — a fact that will become thematic in the Möbius section below.</p>
                    <span class="viz-ref">▸ Open the Algebra Workbench to see the evaluation, the Jacobian, and the two determinant checks at your chosen point. Set both sliders to $0$ to see how the workbench handles the excluded origin.</span>
                `,
                task: {
                    mission: "Place $(u_N, v_N)$ inside the unit circle, then outside it, then exactly at the origin. Watch the mapped point and the workbench each time.",
                    guiding_question: "What does the transition map do to the unit circle and to the regions inside/outside it? Why must the origin be excluded from its domain?",
                    hint: "Inversion swaps inside and outside of the unit circle (the equator's image), and fixes the circle itself. The origin is $\\phi_N$(south pole) — a point the south chart cannot see, so the transition map has nowhere to send it. The domain $\\mathbb{R}^2 \\setminus \\{0\\}$ is forced by geometry, not by an algebraic accident."
                },
                controls: [
                    { id: "u_n", label: "North coordinate $u_N$", type: "range", min: -2.0, max: 2.0, step: 0.1, val: 0.5 },
                    { id: "v_n", label: "North coordinate $v_N$", type: "range", min: -2.0, max: 2.0, step: 0.1, val: 0.5 }
                ],
                stats: [
                    { id: "trans_point", label: "Mapped South Point", value: "Loading..." }
                ],
                apiPath: "/api/transition_maps"
            },
            {
                id: "mobius",
                title: "6. Atlases in Action: The Möbius Band",
                theory: `
                    <p>So far the atlas machinery may look like pedantry — the sphere is easy to picture without it. The Möbius band is the first space where the atlas data records something you <em>cannot</em> see in any single chart.</p>
                    <p><strong>Construction.</strong> Take the strip $[0, 2\\pi] \\times (-1, 1)$ with coordinates $(u, w)$ and glue the two ends with a flip:</p>
                    $$(u + 2\\pi,\\; w) \\;\\sim\\; (u,\\; -w).$$
                    <p>The 3D panel shows the standard half-twist embedding $\\big((1 + \\tfrac{w}{2}\\cos\\tfrac{u}{2})\\cos u,\\; (1 + \\tfrac{w}{2}\\cos\\tfrac{u}{2})\\sin u,\\; \\tfrac{w}{2}\\sin\\tfrac{u}{2}\\big)$, for which you can check directly that $u \\mapsto u + 2\\pi$ lands on the point with $w$ negated.</p>
                    <p><strong>A two-chart atlas.</strong> No single $(u, w)$ rectangle covers the band (the seam must be cut somewhere), so take two overlapping charts that cut it in different places:</p>
                    $$\\text{Chart } A:\\; u \\in (0, 2\\pi), \\qquad \\text{Chart } B:\\; u \\in (-\\pi, \\pi).$$
                    <p>Their overlap has <strong>two connected components</strong>, and the transition map is a different formula on each — perfectly legal, and in fact typical:</p>
                    $$u_A \\in (0, \\pi):\\;\\; (u_B, w_B) = (u_A,\\; w_A), \\qquad J = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix},\\;\\; \\det J = +1;$$
                    $$u_A \\in (\\pi, 2\\pi):\\;\\; (u_B, w_B) = (u_A - 2\\pi,\\; -w_A), \\qquad J = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix},\\;\\; \\det J = -1.$$
                    <p>Both transitions are affine, hence $C^\\infty$ diffeomorphisms: this is a smooth atlas and the Möbius band is a smooth 2-manifold (with the strip's edge removed).</p>
                    <div class="def-block">
                        <div class="def-label">Definition (Oriented Atlas)</div>
                        <p>A smooth atlas is <strong>oriented</strong> if every one of its transition maps has $\\det J > 0$ on its whole domain. A manifold is <strong>orientable</strong> if it admits some oriented atlas.</p>
                    </div>
                    <div class="thm-block">
                        <div class="thm-label">Theorem</div>
                        <p>The Möbius band is not orientable: no atlas of it is oriented. <em>(Stated without proof; see Lee, Ch. 15.)</em> The simulation shows the obstruction concretely: transporting a chosen "up" direction ($+w$) once around the band returns it as "down" ($-w$), and the $\\det J = -1$ component of our transition map is exactly where the bookkeeping registers the flip. No re-choice of charts can remove it — only relocate it.</p>
                    </div>
                    <p><strong>Why this module matters.</strong> Everything that follows in this course — tangent vectors (2.2), pushforwards (2.3), tensors (2.4), metrics and curvature (Phase 3) — is <em>defined in charts</em> and glued together by transition maps. Smoothness of the transitions is what lets calculus transfer between charts; and as the Möbius band shows, the transition data is not overhead but geometry: a single sign in a Jacobian encodes whether the space has a consistent notion of orientation at all.</p>
                    <span class="viz-ref">▸ In the 3D panel, the two overlap components are shaded differently and the orange segment marks the seam $u = 0 \\sim 2\\pi$. The Algebra Workbench evaluates the transition map, its Jacobian, and verifies both charts describe the same physical point.</span>
                `,
                task: {
                    mission: "Slide $u$ across $\\pi$ and watch the transition formula and $\\det J$ switch. Then take the marker once around the band (slide $u$ from one end to the other) with $w \\neq 0$ fixed.",
                    guiding_question: "After a full loop the point returns with its $w$-coordinate negated. Why does this make a globally consistent choice of \"upward across the band\" impossible?",
                    hint: "Chart B's description of \"up\" agrees with chart A's on one overlap component and is its mirror image on the other ($\\det J = -1$). Any global orientation would have to agree with both — a contradiction. Compare the sphere's atlas: $\\det J = -1/r^4 < 0$ there too, but composing with a single reflection fixes it; here no fix exists."
                },
                controls: [
                    { id: "u", label: "Chart A coordinate $u_A$", type: "range", min: 0.05, max: 6.23, step: 0.02, val: 2.0 },
                    { id: "w", label: "Width coordinate $w$", type: "range", min: -0.7, max: 0.7, step: 0.05, val: 0.4 }
                ],
                stats: [
                    { id: "chart_a", label: "Chart A coords", value: "Loading..." },
                    { id: "chart_b", label: "Chart B coords", value: "Loading..." },
                    { id: "mob_det", label: "det J (transition)", value: "Loading..." }
                ],
                apiPath: "/api/mobius"
            }
        ]
    },
    "m2_2": {
        phase: "Phase 2: Smooth Manifolds",
        title: "Tangent and Cotangent Spaces",
        hook: "How do we define vectors without an ambient space to point them in?",
        sections: [
            {
                id: "curves_derivations",
                title: "1. Tangent Vectors: Curves and Derivations",
                theory: `
                    <p>In $\\mathbb{R}^n$ a vector at $p$ is an arrow: a direction and a magnitude, drawn in the surrounding space. An abstract manifold has no surrounding space, so the arrow picture must be rebuilt from intrinsic data. There are two standard reconstructions, and the entire module rests on the fact that they agree.</p>
                    <div class="def-block">
                        <div class="def-label">Definition (Velocity of a Curve)</div>
                        <p>A <strong>smooth curve through $p$</strong> is a smooth map $\\gamma : (-\\varepsilon, \\varepsilon) \\to M$ with $\\gamma(0) = p$. Two curves $\\gamma_1, \\gamma_2$ are <strong>equivalent</strong> if $(\\phi \\circ \\gamma_1)'(0) = (\\phi \\circ \\gamma_2)'(0)$ for some chart $(U, \\phi)$ around $p$ — and then, by the chain rule applied to transition maps, for <em>every</em> such chart. A <strong>tangent vector at $p$</strong> is an equivalence class of curves; intuitively, a velocity.</p>
                    </div>
                    <p>The chart-independence step is where Module 2.1 pays off: because transition maps are diffeomorphisms, their Jacobians convert velocity components between charts bijectively, so "same velocity" is a chart-free notion even though the components are not.</p>
                    <div class="def-block">
                        <div class="def-label">Definition (Derivation)</div>
                        <p>A <strong>derivation at $p$</strong> is a linear map $D : C^\\infty(M) \\to \\mathbb{R}$ satisfying the Leibniz rule $$D(fg) = f(p)\\,D(g) + g(p)\\,D(f).$$ Derivations form a real vector space under pointwise operations.</p>
                    </div>
                    <p>Every curve class defines a derivation by differentiating along the curve, $D_\\gamma f = (f \\circ \\gamma)'(0)$ — linearity is immediate and Leibniz is the product rule. The converse is the substantive result:</p>
                    <div class="thm-block">
                        <div class="thm-label">Theorem (Lee, Ch. 3)</div>
                        <p>Let $M$ be a smooth $n$-manifold and $p \\in M$. The space of derivations at $p$ is an $n$-dimensional real vector space, denoted $T_pM$; every derivation arises from a curve; and for any chart $(U, \\phi) = (x^1, \\dots, x^n)$ around $p$, the coordinate operators $$\\left.\\frac{\\partial}{\\partial x^1}\\right|_p, \\dots, \\left.\\frac{\\partial}{\\partial x^n}\\right|_p, \\qquad \\left.\\frac{\\partial}{\\partial x^i}\\right|_p f := \\partial_i (f \\circ \\phi^{-1})\\big(\\phi(p)\\big),$$ form a basis of $T_pM$. <em>(Proof via Taylor's theorem with the Hadamard remainder; omitted here.)</em></p>
                    </div>
                    <p>So a tangent vector may be held in either hand: as a velocity (geometric, good for pictures) or as a directional-derivative operator (algebraic, good for proofs). A general vector expands as $V = \\sum_i V^i \\partial/\\partial x^i|_p$, and the numbers $V^i$ — the <em>components</em> — are chart-dependent bookkeeping for a chart-free object.</p>
                    <p>The remaining sections make all of this concrete on a fixed running example: the ellipsoid $\\big(a\\cos v\\cos u,\\; b\\cos v \\sin u,\\; c \\sin v\\big)$ with $a = 1.5$, $b = 1.0$, $c = 0.8$, in the latitude–longitude chart $(u, v)$.</p>
                `
            },
            {
                id: "tangent_basis",
                title: "2. The Coordinate Basis on the Ellipsoid",
                theory: `
                    <p>On the ellipsoid chart $(u, v)$, the abstract basis vectors $\\partial/\\partial u,\\, \\partial/\\partial v$ acquire a concrete ambient picture: differentiate the embedding $\\Phi(u,v) = (a\\cos v\\cos u,\\; b\\cos v\\sin u,\\; c\\sin v)$ along each coordinate:</p>
                    $$\\partial_u := \\frac{\\partial \\Phi}{\\partial u} = \\begin{pmatrix} -a\\cos v\\sin u \\\\ \\phantom{-}b\\cos v\\cos u \\\\ 0 \\end{pmatrix}, \\qquad \\partial_v := \\frac{\\partial \\Phi}{\\partial v} = \\begin{pmatrix} -a\\sin v\\cos u \\\\ -b\\sin v\\sin u \\\\ \\phantom{-}c\\cos v \\end{pmatrix}.$$
                    <p>These span the tangent plane $T_pM$ at $p = \\Phi(u,v)$, and a tangent vector with components $(V^u, V^v)$ is the literal linear combination $V_{3d} = V^u \\partial_u + V^v \\partial_v$ — the yellow arrow in the panel. (Strictly, drawing $V$ as an ambient arrow uses the pushforward of the inclusion map $M \\hookrightarrow \\mathbb{R}^3$; Module 2.3 makes this precise.)</p>
                    <p><strong>The basis is not innocent.</strong> The coordinate basis is neither orthonormal nor even of constant length. Directly from the formula:</p>
                    $$\\|\\partial_u\\| = \\cos v\\,\\sqrt{a^2\\sin^2 u + b^2\\cos^2 u} \\;\\xrightarrow{\\;v \\to \\pm\\pi/2\\;}\\; 0,$$
                    <p>so as $p$ approaches a pole the $u$-basis vector collapses: the chart itself degenerates there, exactly like longitude on the Earth. The consequence is the central trap of tensor calculus: <em>components alone tell you nothing</em>. Holding $(V^u, V^v)$ fixed while moving $p$ changes the actual vector dramatically, because the yardsticks $\\partial_u, \\partial_v$ change underneath the numbers. Measuring true lengths requires extra structure — the metric tensor of Module 3.1.</p>
                    <span class="viz-ref">▸ The blue and green arrows are $\\partial_u$ and $\\partial_v$ drawn at true relative scale — they genuinely shrink and tilt as you move $p$. The Algebra Workbench shows the basis as a $3 \\times 2$ column matrix and builds $V_{3d}$ as an explicit matrix–vector product.</span>
                `,
                task: {
                    mission: "Fix the components at $(V^u, V^v) = (0.5, -0.4)$ and slide the latitude $v$ from $0$ toward its maximum. Watch the basis arrows, the yellow vector, and the $|\\partial_u|$ metric.",
                    guiding_question: "The components $(V^u, V^v)$ never change during the experiment — so why does the actual arrow $V_{3d}$ shrink and swing toward the meridian direction?",
                    hint: "$V_{3d} = V^u\\partial_u + V^v\\partial_v$, and $\\|\\partial_u\\| \\to 0$ near the pole while $\\partial_v$ stays healthy: the $V^u$ part of the vector is silently vanishing. Components are meaningless without their basis — this is why the metric tensor is unavoidable."
                },
                controls: [
                    { id: "u", label: "Longitude $u$", type: "range", min: 0.0, max: 6.28, step: 0.1, val: 0.78 },
                    { id: "v", label: "Latitude $v$", type: "range", min: -1.4, max: 1.4, step: 0.05, val: 0.5 },
                    { id: "vx", label: "Component $V^u$", type: "range", min: -1.0, max: 1.0, step: 0.1, val: 0.5 },
                    { id: "vy", label: "Component $V^v$", type: "range", min: -1.0, max: 1.0, step: 0.1, val: -0.4 }
                ],
                stats: [
                    { id: "p_coords", label: "Point p (x, y, z)", value: "Loading..." },
                    { id: "basis_lengths", label: "Length |∂u|, |∂v|", value: "Loading..." }
                ],
                apiPath: "/api/tangent_space"
            },
            {
                id: "covectors",
                title: "3. Covectors: The Cotangent Space",
                theory: `
                    <div class="def-block">
                        <div class="def-label">Definition (Cotangent Space)</div>
                        <p>The <strong>cotangent space</strong> at $p$ is the dual vector space $T_p^*M := (T_pM)^*$ — the space of linear functionals $\\omega : T_pM \\to \\mathbb{R}$. Its elements are called <strong>covectors</strong> (or 1-forms at $p$). Given a chart, the <strong>dual basis</strong> $du, dv$ is defined by $$du(\\partial_u) = 1,\\quad du(\\partial_v) = 0,\\quad dv(\\partial_u) = 0,\\quad dv(\\partial_v) = 1.$$</p>
                    </div>
                    <div class="def-block">
                        <div class="def-label">Definition (Differential of a Function)</div>
                        <p>For $f \\in C^\\infty(M)$, the <strong>differential</strong> $df_p \\in T_p^*M$ is the covector $df_p(V) := V(f)$ — feed the function to the vector-as-derivation. In coordinates, $df = \\tfrac{\\partial f}{\\partial u}\\,du + \\tfrac{\\partial f}{\\partial v}\\,dv$.</p>
                    </div>
                    <p><strong>Worked example (our running one).</strong> Take $f = z$, the height function, restricted to the ellipsoid. In the chart, $f(u, v) = c\\sin v$, so:</p>
                    $$df = \\frac{\\partial}{\\partial u}(c \\sin v)\\, du + \\frac{\\partial}{\\partial v}(c\\sin v)\\, dv = 0 \\cdot du + c\\cos v \\, dv,$$
                    $$df(V) = c\\cos v \\; V^v.$$
                    <p><strong>How to picture a covector.</strong> Resist drawing an arrow. A covector is a <em>measuring instrument</em>: its faithful picture is the stack of its level sets — parallel hyperplanes spaced $1/\\|\\omega\\|$ apart — and $\\omega(V)$ is the signed count of planes the arrow $V$ pierces. The simulation draws exactly this for $\\omega = df$: the horizontal planes $z = z_p + k\\delta$ slice the tangent plane at $p$ in a family of parallel lines (all parallel to $\\partial_u$, since $du$ never appears in $df$), and the reported $df(V)$ equals the piercing count times $\\delta$.</p>
                    <p>Watch the geometry encode the algebra: at the equator the surface climbs fastest per unit $v$, the lines crowd together, and $df$ is strong; approaching a pole, $\\cos v \\to 0$, the lines spread toward infinite spacing, and $df \\to 0$ — moving along $\\partial_v$ there barely changes your height.</p>
                    <span class="viz-ref">▸ The cyan lines in the tangent plane are the level sets of the height function; the orange arrow is $V$. The Algebra Workbench computes $df(V)$ as a dot product and then <em>verifies</em> it against a finite-difference directional derivative — the definition $df(V) = V(f)$, checked numerically.</span>
                `,
                task: {
                    mission: "Set $V^u = 0$ and $V^v = 1$. Sweep the latitude $v$ across its full range and find where $df(V)$ is maximized. Then park $p$ near a pole.",
                    guiding_question: "Why is $df(V)$ largest at the equator $v = 0$ and nearly zero at the poles, even though $V$'s components are pinned?",
                    hint: "$df(V) = c\\cos v \\, V^v$ and $\\cos v$ peaks at $v = 0$. Geometrically: at the equator $\\partial_v$ points almost straight up (each unit of $v$ buys the most height), while at the pole $\\partial_v$ is nearly horizontal. The plane stack shows it: dense stack = strong covector."
                },
                controls: [
                    { id: "u", label: "Longitude $u$", type: "range", min: 0.0, max: 6.28, step: 0.1, val: 0.78 },
                    { id: "v", label: "Latitude $v$", type: "range", min: -1.4, max: 1.4, step: 0.05, val: 0.5 },
                    { id: "vx", label: "Component $V^u$", type: "range", min: -1.0, max: 1.0, step: 0.1, val: 0.5 },
                    { id: "vy", label: "Component $V^v$", type: "range", min: -1.0, max: 1.0, step: 0.1, val: 0.6 }
                ],
                stats: [
                    { id: "df_comps", label: "Differential df", value: "Loading..." },
                    { id: "df_value", label: "df(V)", value: "Loading..." },
                    { id: "pierced", label: "Planes Pierced", value: "Loading..." }
                ],
                apiPath: "/api/covector_ellipsoid"
            },
            {
                id: "differential",
                title: "4. Chart Invariance: Components vs. Objects",
                theory: `
                    <p>Section 2 warned that components are meaningless without their basis. This section shows the flip side: components from <em>different charts</em> conspire so that every honest measurement agrees. This conspiracy is the design principle of all tensor calculus.</p>
                    <p><strong>Transformation laws.</strong> Let $x \\mapsto x'$ be a chart change with Jacobian $J^i_{\\ j} = \\partial x'^i / \\partial x^j$. Applying the chain rule to the two definitions from Section 1:</p>
                    $$V'^i = \\sum_j \\frac{\\partial x'^i}{\\partial x^j} V^j \\quad \\text{(vectors: \\textbf{contravariant} — with } J\\text{)},$$
                    $$\\omega'_i = \\sum_j \\frac{\\partial x^j}{\\partial x'^i}\\, \\omega_j \\quad \\text{(covectors: \\textbf{covariant} — with } J^{-1}\\text{)}.$$
                    <p>The two Jacobians cancel in the pairing: $\\omega'(V') = \\omega(J^{-1}J\\,V) = \\omega(V)$. Scalars survive chart changes; components do not.</p>
                    <p><strong>Worked example on the ellipsoid.</strong> Keep chart 1 as $(u, v)$ and define chart 2 as $(u, s)$ with $s = \\sin v$ — smooth with smooth inverse for $v \\in (-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2})$, so a legitimate chart change with</p>
                    $$J = \\begin{pmatrix} 1 & 0 \\\\ 0 & \\cos v \\end{pmatrix}.$$
                    <p>The vector components push <em>with</em> $J$: $(V^u, V^v) \\mapsto (V^u,\\; \\cos v\\, V^v)$. The height function becomes $f = c\\,s$, so its differential in chart 2 is $df = c\\,ds$ — <em>constant</em> components $(0, c)$, versus the latitude-dependent $(0, c\\cos v)$ of chart 1; this is the covariant transformation $df_s = df_v / \\cos v$. And the pairing is identical in both charts:</p>
                    $$\\underbrace{(c\\cos v)\\, V^v}_{\\text{chart } (u,v)} \\;=\\; \\underbrace{c \\,\\cdot\\, (\\cos v\\, V^v)}_{\\text{chart } (u,s)}.$$
                    <p>Nothing about the surface, the point, or the arrow changed — the 3D panel is deliberately static under a change of chart. Only the bookkeeping changed, in two mutually cancelling ways. When Module 2.4 defines tensors by their transformation law, and Module 3.5 shows the Fisher information transforming as a $(0,2)$-tensor, this cancellation is the property being institutionalized.</p>
                    <span class="viz-ref">▸ The metrics panel shows both component pairs updating as you move $p$, and their pairing staying equal. The Algebra Workbench performs the full pipeline: Jacobian → contravariant push of $V$ → covariant pull of $df$ → both pairings → invariance check.</span>
                `,
                task: {
                    mission: "Sweep the latitude $v$ across its range. Watch the two component pairs (chart 1 vs. chart 2) change in the metrics panel while their pairing stays equal.",
                    guiding_question: "Of all the numbers on screen — $V^u, V^v, V^s$, $df_v$, $df_s$, $df(V)$ — which are geometric facts and which are artifacts of a chart choice?",
                    hint: "Only the pairing $df(V)$ is chart-independent (and $V^u$ happens to survive because our chart change fixed $u$). A quantity earns geometric meaning by being computable in every chart with the same result — that is the invariance test, and it is the reason tensors are defined by transformation laws."
                },
                controls: [
                    { id: "u", label: "Longitude $u$", type: "range", min: 0.0, max: 6.28, step: 0.1, val: 0.78 },
                    { id: "v", label: "Latitude $v$", type: "range", min: -1.4, max: 1.4, step: 0.05, val: 0.5 },
                    { id: "vx", label: "Component $V^u$", type: "range", min: -1.0, max: 1.0, step: 0.1, val: 0.5 },
                    { id: "vy", label: "Component $V^v$", type: "range", min: -1.0, max: 1.0, step: 0.1, val: 0.6 }
                ],
                stats: [
                    { id: "v_comps", label: "V: chart (u,v) → (u,s)", value: "Loading..." },
                    { id: "df_comps", label: "df: chart (u,v) → (u,s)", value: "Loading..." },
                    { id: "pairing", label: "df(V) in both charts", value: "Loading..." }
                ],
                apiPath: "/api/df_invariance"
            },
            {
                id: "lie_bracket",
                title: "5. Coda: Vector Fields and the Lie Bracket",
                theory: `
                    <div class="def-block">
                        <div class="def-label">Definition (Vector Field)</div>
                        <p>A <strong>vector field</strong> is a smooth assignment $X : p \\mapsto X_p \\in T_pM$. Through the derivation picture, $X$ acts on functions: $(Xf)(p) := X_p(f)$, producing a new smooth function $Xf$.</p>
                    </div>
                    <p>Because vector fields are operators, we can compose them — but $XY$ is <em>not</em> a vector field (it takes second derivatives and violates Leibniz). The failure cancels in the commutator:</p>
                    <div class="def-block">
                        <div class="def-label">Definition (Lie Bracket)</div>
                        <p>$[X, Y] := XY - YX$ is again a vector field, with components $$[X,Y]^k = \\sum_j \\left( X^j \\partial_j Y^k - Y^j \\partial_j X^k \\right).$$</p>
                    </div>
                    <p><strong>Flow interpretation.</strong> Flow along $X$ for time $\\epsilon$, then along $Y$ for $\\epsilon$; compare with doing it in the opposite order. The two endpoints differ by $$\\text{gap} = \\epsilon^2\\,[X,Y]_p + O(\\epsilon^3):$$ the bracket measures the failure of coordinate-style "rectangles" to close.</p>
                    <p><strong>The simulation, exactly.</strong> Take $X = y\\,\\partial_x$ and $Y = x\\,\\partial_y$ in the plane, starting at $p = (1,1)$. By the component formula: $[X,Y]^1 = y\\,\\partial_x(0) - x\\,\\partial_y(y) = -x$ and $[X,Y]^2 = y\\,\\partial_x(x) - x\\,\\partial_y(0) = y$, so $[X,Y] = -x\\,\\partial_x + y\\,\\partial_y$, which at $p$ has components $(-1, 1)$.</p>
                    <p>These particular flows are affine, so the straight-segment construction in the panel is <em>exact</em>, not an Euler approximation — and the gap comes out to precisely $\\epsilon^2(-1, 1)$, with no $O(\\epsilon^3)$ correction. The quadratic law you observe is the theorem, not an artifact.</p>
                    <p><strong>Where this goes.</strong> The bracket returns at two decisive moments: the torsion-free condition $\\nabla_X Y - \\nabla_Y X = [X,Y]$ that pins down the Levi-Civita connection (Module 3.3), and the curvature tensor's commutator of covariant derivatives (Module 3.5). It is the first hint that the <em>algebra</em> of derivations knows the <em>geometry</em> of the space.</p>
                `,
                task: {
                    mission: "Increase $\\epsilon$ and check the gap metric against the prediction $\\|\\text{gap}\\| = \\sqrt{2}\\,\\epsilon^2$ at several values (e.g. $\\epsilon = 0.5, 1.0, 1.5$).",
                    guiding_question: "Why does the gap grow quadratically in $\\epsilon$ — what cancels at first order?",
                    hint: "To first order both paths land at $p + \\epsilon X_p + \\epsilon Y_p$ — addition of displacements commutes. The order-$\\epsilon^2$ term keeps the ordering information, and its coefficient is exactly $[X,Y]_p = (-1,1)$, so $\\|\\text{gap}\\| = \\epsilon^2\\sqrt{2}$."
                },
                controls: [
                    { id: "epsilon", label: "Flow Step Size $\\epsilon$", type: "range", min: 0.1, max: 1.5, step: 0.1, val: 0.8 }
                ],
                stats: [
                    { id: "gap_dist", label: "Commutator Gap Distance", value: "Loading..." }
                ],
                apiPath: "/api/lie_bracket"
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

// Export to window for app.js
if (typeof window !== 'undefined') {
    window.moduleData = moduleData;
}
