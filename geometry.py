import numpy as np
from scipy.integrate import solve_ivp
import sympy as sp

# ---------------------------------------------------------
# Module 2.1: Charts and Atlases (Simulation First Edition)
# ---------------------------------------------------------

def compute_hausdorff(radius_a, radius_b):
    """
    Simulates the 'Line with Two Origins' (a non-Hausdorff space).
    Origin A is at 0, Origin B is also at 0, but they are distinct points.
    Any open interval around Origin A is (-r_a, r_a) containing A.
    Any open interval around Origin B is (-r_b, r_b) containing B.
    Their intersection is (-min(r_a, r_b), min(r_a, r_b)) excluding 0, which is always non-empty.
    """
    intersection_radius = min(radius_a, radius_b)
    
    # We will return data to draw the line and the open sets
    # We can plot A and B slightly separated in 2D for visualization purposes
    
    return {
        "intersection_radius": float(intersection_radius),
        "status": "Overlapping (Cannot separate)" if intersection_radius > 0 else "Separated",
        "radius_a": float(radius_a),
        "radius_b": float(radius_b)
    }

def compute_locally_euclidean(cap_radius):
    """
    Simulates zooming into a spherical cap to show it converges to a flat tangent plane.
    cap_radius is the angle theta in radians.
    """
    # Create a grid of points on the spherical cap
    theta = np.linspace(0, cap_radius, 20)
    phi = np.linspace(0, 2 * np.pi, 30)
    T, P = np.meshgrid(theta, phi)
    
    # Sphere cap coordinates (centered at North pole)
    X_sphere = np.sin(T) * np.cos(P)
    Y_sphere = np.sin(T) * np.sin(P)
    Z_sphere = np.cos(T)
    
    # Flat tangent plane coordinates at North pole (z=1)
    # Distance from pole along surface is approx theta, so planar radius is theta
    R_plane = T
    X_plane = R_plane * np.cos(P)
    Y_plane = R_plane * np.sin(P)
    Z_plane = np.ones_like(X_plane)
    
    # Calculate max deviation (max difference in z or Euclidean distance)
    deviation = np.sqrt((X_sphere - X_plane)**2 + (Y_sphere - Y_plane)**2 + (Z_sphere - Z_plane)**2)
    max_dev = float(np.max(deviation))
    
    return {
        "sphere": {"x": X_sphere.tolist(), "y": Y_sphere.tolist(), "z": Z_sphere.tolist()},
        "plane": {"x": X_plane.tolist(), "y": Y_plane.tolist(), "z": Z_plane.tolist()},
        "max_deviation": max_dev
    }

def get_sphere_mesh(r=1.0, num=40):
    """Generates standard spherical coordinates for plotting the background sphere."""
    theta = np.linspace(0.01, np.pi - 0.01, num)
    phi = np.linspace(0, 2 * np.pi, num)
    theta, phi = np.meshgrid(theta, phi)
    
    x = r * np.sin(theta) * np.cos(phi)
    y = r * np.sin(theta) * np.sin(phi)
    z = r * np.cos(theta)
    return x.tolist(), y.tolist(), z.tolist()

def stereographic_north_to_3d(u, v, r=1.0):
    """Maps North stereographic projection coordinates (u, v) to R^3."""
    denom = u**2 + v**2 + 1
    x = 2 * r * u / denom
    y = 2 * r * v / denom
    z = r * (u**2 + v**2 - 1) / denom
    return x, y, z

def stereographic_south_to_3d(u, v, r=1.0):
    """Maps South stereographic projection coordinates (u, v) to R^3."""
    denom = u**2 + v**2 + 1
    x = 2 * r * u / denom
    y = 2 * r * v / denom
    z = r * (1 - u**2 - v**2) / denom
    return x, y, z

def get_stereographic_grid(chart_type='north', r=1.0, limit=3.0, num=30):
    """Generates a grid in the stereographic chart and maps it to R^3."""
    u_vals = np.linspace(-limit, limit, num)
    v_vals = np.linspace(-limit, limit, num)
    U, V = np.meshgrid(u_vals, v_vals)
    
    if chart_type == 'north':
        X, Y, Z = stereographic_north_to_3d(U, V, r)
    else:
        X, Y, Z = stereographic_south_to_3d(U, V, r)
        
    return {
        "u": U.tolist(),
        "v": V.tolist(),
        "x": X.tolist(),
        "y": Y.tolist(),
        "z": Z.tolist()
    }

def compute_charts_workbench(u_N, v_N):
    """
    Computes transition map workbench data for Module 2.1:
    1. Transition map: North chart -> South chart coordinates
    2. Jacobian of the transition map
    3. Determinant check (diffeomorphism verification)
    """
    r_sq = u_N**2 + v_N**2
    if r_sq < 1e-10:
        r_sq = 1e-10  # avoid division by zero at origin
    
    # Step 1: Transition map computation
    u_S = u_N / r_sq
    v_S = v_N / r_sq
    
    # Step 2: Jacobian of the transition map d(u_S, v_S)/d(u_N, v_N)
    # u_S = u_N / (u_N^2 + v_N^2), v_S = v_N / (u_N^2 + v_N^2)
    # du_S/du_N = (v_N^2 - u_N^2) / (u_N^2 + v_N^2)^2
    # du_S/dv_N = -2 u_N v_N / (u_N^2 + v_N^2)^2
    # dv_S/du_N = -2 u_N v_N / (u_N^2 + v_N^2)^2
    # dv_S/dv_N = (u_N^2 - v_N^2) / (u_N^2 + v_N^2)^2
    r_sq_sq = r_sq**2
    J = np.array([
        [(v_N**2 - u_N**2) / r_sq_sq, -2 * u_N * v_N / r_sq_sq],
        [-2 * u_N * v_N / r_sq_sq, (u_N**2 - v_N**2) / r_sq_sq]
    ])
    
    det_J = np.linalg.det(J)
    
    workbench = {
        "steps": [
            {
                "title": "Transition Map: φ_S ∘ φ_N⁻¹",
                "desc": f"North chart (u_N, v_N) = ({u_N:.2f}, {v_N:.2f}) → South chart (u_S, v_S)",
                "type": "mat_vec_mul",
                "matrix": [[1.0 / r_sq, 0.0], [0.0, 1.0 / r_sq]],
                "vector": [u_N, v_N],
                "result": [float(u_S), float(v_S)],
                "row_products": [[float(u_N / r_sq), 0.0], [0.0, float(v_N / r_sq)]],
                "mat_label": f"1/r² (r²={r_sq:.2f})",
                "vec_label": "(u_N, v_N)",
                "res_label": "(u_S, v_S)"
            },
            {
                "title": "Jacobian of Transition Map",
                "desc": "J_ij = ∂(u_S, v_S)/∂(u_N, v_N) — the derivative of the chart change",
                "type": "matrix",
                "matrix": J.tolist()
            },
            {
                "title": "Diffeomorphism Verification",
                "desc": "det(J) ≠ 0 confirms the transition map is a local diffeomorphism",
                "type": "verification",
                "checks": [
                    {
                        "label": "det(J) ≠ 0",
                        "lhs": float(det_J),
                        "rhs": 0.0,
                        "passed": bool(abs(det_J) > 1e-10)
                    }
                ]
            }
        ]
    }
    
    return {
        "u_S": float(u_S),
        "v_S": float(v_S),
        "jacobian": J.tolist(),
        "det_J": float(det_J),
        "workbench": workbench
    }

# ---------------------------------------------------------
# Module 2.2: Tangent Space (Ellipsoid & Derivations)
# ---------------------------------------------------------

def compute_lie_bracket(eps):
    """
    Simulates the Flow Commutator of two vector fields X and Y.
    Let X = y ∂_x and Y = x ∂_y.
    Starting at p = (1, 1).
    Path 1: Flow X for eps, then Y for eps.
    Path 2: Flow Y for eps, then X for eps.
    Returns the coordinates of both paths and the gap vector.
    """
    # Start point
    p0 = [1.0, 1.0]
    
    # Path 1: X then Y
    p1_mid = [p0[0] + eps * p0[1], p0[1]]
    p1_end = [p1_mid[0], p1_mid[1] + eps * p1_mid[0]]
    
    # Path 2: Y then X
    p2_mid = [p0[0], p0[1] + eps * p0[0]]
    p2_end = [p2_mid[0] + eps * p2_mid[1], p2_mid[1]]
    
    # Gap (Path 1 end - Path 2 end)
    gap = [p1_end[0] - p2_end[0], p1_end[1] - p2_end[1]]
    gap_dist = np.sqrt(gap[0]**2 + gap[1]**2)
    
    return {
        "p0": p0,
        "path1_mid": p1_mid,
        "path1_end": p1_end,
        "path2_mid": p2_mid,
        "path2_end": p2_end,
        "gap": gap,
        "gap_dist": float(gap_dist)
    }

def get_ellipsoid_mesh(a=1.5, b=1.0, c=0.8, num=45):
    """Generates the coordinates for a 3D Ellipsoid mesh."""
    u = np.linspace(0, 2 * np.pi, num)
    v = np.linspace(-np.pi / 2, np.pi / 2, num)
    U, V = np.meshgrid(u, v)
    
    X = a * np.cos(V) * np.cos(U)
    Y = b * np.cos(V) * np.sin(U)
    Z = c * np.sin(V)
    return X.tolist(), Y.tolist(), Z.tolist()

def compute_tangent_space(u, v, vx, vy, a=1.5, b=1.0, c=0.8):
    """
    Computes ellipsoid surface point p, tangent basis vectors, 
    the tangent plane mesh, and evaluates the differential df of height function.
    """
    # Point on ellipsoid
    px = a * np.cos(v) * np.cos(u)
    py = b * np.cos(v) * np.sin(u)
    pz = c * np.sin(v)
    
    # Coordinate tangent basis vectors (partial derivatives)
    eu_x = -a * np.cos(v) * np.sin(u)
    eu_y = b * np.cos(v) * np.cos(u)
    eu_z = 0.0
    
    ev_x = -a * np.sin(v) * np.cos(u)
    ev_y = -b * np.sin(v) * np.sin(u)
    ev_z = c * np.cos(v)
    
    # Tangent vector components in R^3
    vx_3d = vx * eu_x + vy * ev_x
    vy_3d = vx * eu_y + vy * ev_y
    vz_3d = vx * eu_z + vy * ev_z
    
    # Tangent plane representation (a grid around p)
    grid_size = 0.5
    s_vals = np.linspace(-grid_size, grid_size, 10)
    t_vals = np.linspace(-grid_size, grid_size, 10)
    S, T = np.meshgrid(s_vals, t_vals)
    
    plane_x = px + S * eu_x + T * ev_x
    plane_y = py + S * eu_y + T * ev_y
    plane_z = pz + S * eu_z + T * ev_z
    
    # Covector df (differential of f(x,y,z) = z, height)
    df_u = 0.0
    df_v = c * np.cos(v)
    df_val = df_u * vx + df_v * vy
    
    # Normalize basis vectors for visualization
    def norm_vec(x, y, z):
        n = np.sqrt(x**2 + y**2 + z**2) + 1e-9
        return x/n, y/n, z/n
        
    eu_nx, eu_ny, eu_nz = norm_vec(eu_x, eu_y, eu_z)
    ev_nx, ev_ny, ev_nz = norm_vec(ev_x, ev_y, ev_z)
    
    len_eu = np.sqrt(eu_x**2 + eu_y**2 + eu_z**2)
    len_ev = np.sqrt(ev_x**2 + ev_y**2 + ev_z**2)
    
    return {
        "p": [px, py, pz],
        "eu": [eu_nx * 0.4, eu_ny * 0.4, eu_nz * 0.4],
        "ev": [ev_nx * 0.4, ev_ny * 0.4, ev_nz * 0.4],
        "v_3d": [vx_3d, vy_3d, vz_3d],
        "plane_x": plane_x.tolist(),
        "plane_y": plane_y.tolist(),
        "plane_z": plane_z.tolist(),
        "df_coords": [df_u, df_v],
        "df_val": float(df_val),
        "len_eu": float(len_eu),
        "len_ev": float(len_ev)
    }

def compute_covector_planes(alpha_density, vx, vy):
    """
    Simulates a covector as a set of parallel lines (planes in 2D).
    Covector w = alpha_density * dx.
    Vector V = vx * dx + vy * dy.
    The scalar product w(V) = alpha_density * vx.
    Returns the lines to draw and the scalar product.
    """
    # w = alpha dx, so the level sets are vertical lines (x = const)
    # The spacing between lines is 1/alpha
    spacing = 1.0 / alpha_density if alpha_density > 0 else 999.0
    
    lines_x = []
    # Draw lines from x=-3 to x=3
    x_val = -3.0
    while x_val <= 3.0:
        lines_x.append(x_val)
        x_val += spacing
        
    scalar_val = alpha_density * vx
    
    return {
        "lines_x": lines_x,
        "vector": [vx, vy],
        "scalar_val": float(scalar_val)
    }

def compute_differential(vx, vy):
    """
    Simulates the differential of a scalar field f(x,y) = x^2 + y^2 at p=(1,1).
    df = 2x dx + 2y dy. At (1,1), df = 2 dx + 2 dy.
    df(V) = 2 vx + 2 vy.
    Returns contour data and the vector.
    """
    # Create contour grid
    x = np.linspace(-1, 3, 50)
    y = np.linspace(-1, 3, 50)
    X, Y = np.meshgrid(x, y)
    Z = X**2 + Y**2
    
    df_val = 2.0 * vx + 2.0 * vy
    
    return {
        "contour_z": Z.tolist(),
        "x_grid": x.tolist(),
        "y_grid": y.tolist(),
        "p": [1.0, 1.0],
        "vector": [vx, vy],
        "df_val": float(df_val)
    }

# ---------------------------------------------------------
# Module 2.3: Pushforwards and Pullbacks (Torus)
# ---------------------------------------------------------

def get_torus_mesh(R=2.0, r=0.6, num=40):
    """Generates 3D Torus mesh."""
    u = np.linspace(0, 2 * np.pi, num)
    v = np.linspace(0, 2 * np.pi, num)
    U, V = np.meshgrid(u, v)
    
    X = (R + r * np.cos(V)) * np.cos(U)
    Y = (R + r * np.cos(V)) * np.sin(U)
    Z = r * np.sin(V)
    return X.tolist(), Y.tolist(), Z.tolist()

def compute_pushforward_map(u, v, du, dv, R=2.0, r=0.6):
    """Computes Pushforward of a 2D vector to the 3D Torus."""
    px = (R + r * np.cos(v)) * np.cos(u)
    py = (R + r * np.cos(v)) * np.sin(u)
    pz = r * np.sin(v)
    
    dx_du = -(R + r * np.cos(v)) * np.sin(u)
    dx_dv = -r * np.sin(v) * np.cos(u)
    dy_du = (R + r * np.cos(v)) * np.cos(u)
    dy_dv = -r * np.sin(v) * np.sin(u)
    dz_du = 0.0
    dz_dv = r * np.cos(v)
    
    vx_3d = dx_du * du + dx_dv * dv
    vy_3d = dy_du * du + dy_dv * dv
    vz_3d = dz_du * du + dz_dv * dv
    
    return {
        "p_2d": [u, v],
        "v_2d": [du, dv],
        "p_3d": [px, py, pz],
        "v_3d": [vx_3d, vy_3d, vz_3d],
        "jacobian": [
            [dx_du, dx_dv],
            [dy_du, dy_dv],
            [dz_du, dz_dv]
        ]
    }

def compute_pullback_map(u, v, R=2.0, r=0.6):
    """Computes Pullback of a 3D 1-form back to the 2D parameter space."""
    px = (R + r * np.cos(v)) * np.cos(u)
    py = (R + r * np.cos(v)) * np.sin(u)
    pz = r * np.sin(v)
    
    dx_du = -(R + r * np.cos(v)) * np.sin(u)
    dx_dv = -r * np.sin(v) * np.cos(u)
    dy_du = (R + r * np.cos(v)) * np.cos(u)
    dy_dv = -r * np.sin(v) * np.sin(u)
    dz_du = 0.0
    dz_dv = r * np.cos(v)
    
    wx = py
    wy = -px
    wz = 1.0
    
    fw_u = wx * dx_du + wy * dy_du + wz * dz_du
    fw_v = wx * dx_dv + wy * dy_dv + wz * dz_dv
    
    # Generate 3D planes for w at p
    def create_planes(normal, p_center, size=1.0, count=5):
        n = np.array(normal)
        n_norm = np.linalg.norm(n)
        if n_norm == 0: return []
        n = n / n_norm
        
        if abs(n[0]) < 0.9: v1 = np.array([1, 0, 0])
        else: v1 = np.array([0, 1, 0])
        v1 = v1 - np.dot(v1, n) * n
        v1 = v1 / np.linalg.norm(v1)
        v2 = np.cross(n, v1)
        
        planes = []
        offsets = np.linspace(-size/2, size/2, count)
        for offset in offsets:
            center = np.array(p_center) + offset * n
            s = np.linspace(-size, size, 2)
            t = np.linspace(-size, size, 2)
            S, T = np.meshgrid(s, t)
            X = center[0] + S * v1[0] + T * v2[0]
            Y = center[1] + S * v1[1] + T * v2[1]
            Z = center[2] + S * v1[2] + T * v2[2]
            planes.append({"x": X.tolist(), "y": Y.tolist(), "z": Z.tolist()})
        return planes
        
    planes_3d = create_planes([wx, wy, wz], [px, py, pz])
    
    return {
        "p_2d": [u, v],
        "fw_covector": [fw_u, fw_v],
        "p_3d": [px, py, pz],
        "planes_3d": planes_3d
    }

def compute_duality(u, v, du, dv, R=2.0, r=0.6):
    """Computes both pushforward and pullback to demonstrate the duality."""
    pf = compute_pushforward_map(u, v, du, dv, R, r)
    pb = compute_pullback_map(u, v, R, r)
    
    eval_pullback = pb["fw_covector"][0] * du + pb["fw_covector"][1] * dv
    
    wx, wy, wz = pb["p_3d"][1], -pb["p_3d"][0], 1.0
    v3x, v3y, v3z = pf["v_3d"]
    eval_pushforward = wx * v3x + wy * v3y + wz * v3z
    
    workbench = {
        "steps": [
            {
                "title": "Branch A: Pullback the Covector, then Evaluate",
                "desc": "First pull w back to F*w, then evaluate on 2D vector",
                "type": "dot_product",
                "left": [pb["fw_covector"][0], pb["fw_covector"][1]],
                "right": [du, dv],
                "terms": [pb["fw_covector"][0]*du, pb["fw_covector"][1]*dv],
                "result": float(eval_pullback),
                "left_label": "F*w",
                "right_label": "v"
            },
            {
                "title": "Branch B: Pushforward the Vector, then Evaluate",
                "desc": "First push v forward to V_3d, then evaluate against 3D w",
                "type": "dot_product",
                "left": [wx, wy, wz],
                "right": [v3x, v3y, v3z],
                "terms": [wx*v3x, wy*v3y, wz*v3z],
                "result": float(eval_pushforward),
                "left_label": "w",
                "right_label": "V_3d"
            }
        ]
    }
    
    return {
        "eval_pullback": float(eval_pullback),
        "eval_pushforward": float(eval_pushforward),
        "workbench": workbench
    }

# ---------------------------------------------------------
# Module 2.4: Tensor Coordinate Transformation (2D Rotation)
# ---------------------------------------------------------

def compute_tensor_transform(alpha, a=2.0, b=0.5, theta=0.0):
    """
    Demonstrates coordinate transformation of a (0,2)-tensor T.
    T is defined as a symmetric tensor: in initial coordinates, it represents an ellipse
    rotated by 'theta' with semi-axes a and b.
    We transform it to new coordinates rotated by 'alpha' (in radians).
    """
    # Create the tensor T in Cartesian coordinates
    # Ellipse: x^T T x = 1. If T is diagonalized as diag(1/a^2, 1/b^2), and rotated by theta
    cos_t = np.cos(theta)
    sin_t = np.sin(theta)
    R_theta = np.array([
        [cos_t, -sin_t],
        [sin_t, cos_t]
    ])
    T_diag = np.array([
        [1.0 / (a**2), 0.0],
        [0.0, 1.0 / (b**2)]
    ])
    T = R_theta @ T_diag @ R_theta.T
    
    # Coordinate transformation matrix (Jacobian of old coordinates w.r.t new coordinates)
    # x = x' cos(alpha) - y' sin(alpha)
    # y = x' sin(alpha) + y' cos(alpha)
    # J_ik = dx^i / dx'^k
    cos_a = np.cos(alpha)
    sin_a = np.sin(alpha)
    J = np.array([
        [cos_a, -sin_a],
        [sin_a, cos_a]
    ])
    
    # Transform T_ij (pullback transformation: T' = J^T T J)
    M_intermediate = J.T @ T  # intermediate product
    T_prime = M_intermediate @ J
    
    # Verify invariants: Trace and Determinant
    det_T = np.linalg.det(T)
    det_T_prime = np.linalg.det(T_prime)
    trace_T = np.trace(T)
    trace_T_prime = np.trace(T_prime)
    
    # Generate points on the ellipse x^T T x = 1 for visualization
    angles = np.linspace(0, 2*np.pi, 100)
    circle = np.array([np.cos(angles), np.sin(angles)])
    
    # Map points to ellipse using eigenvectors
    vals, vecs = np.linalg.eigh(T)
    # x = vecs * diag(1/sqrt(vals)) * circle
    ellipse_points = vecs @ np.diag(1.0 / np.sqrt(vals)) @ circle
    
    # --- Workbench step-by-step data ---
    workbench = {
        "steps": [
            {
                "title": "Tensor Construction",
                "desc": "T = R(θ) · diag(1/a², 1/b²) · R(θ)ᵀ",
                "type": "triple_product",
                "A": R_theta.tolist(),
                "B": T_diag.tolist(),
                "C": R_theta.T.tolist(),
                "result": T.tolist(),
                "labels": ["R(θ)", "D", "R(θ)ᵀ", "T"]
            },
            {
                "title": "Coordinate Change Jacobian",
                "desc": "J(α) = rotation matrix for basis change by angle α",
                "type": "matrix",
                "matrix": J.tolist(),
                "header_labels": ["x'", "y'"]
            },
            {
                "title": "Step 1: M = Jᵀ · T",
                "desc": "First half of the tensor transformation",
                "type": "mat_mat_mul",
                "A": J.T.tolist(),
                "B": T.tolist(),
                "result": M_intermediate.tolist(),
                "labels": ["Jᵀ", "T", "M"]
            },
            {
                "title": "Step 2: T' = M · J",
                "desc": "Complete transformation T' = Jᵀ · T · J",
                "type": "mat_mat_mul",
                "A": M_intermediate.tolist(),
                "B": J.tolist(),
                "result": T_prime.tolist(),
                "labels": ["M", "J", "T'"]
            },
            {
                "title": "Invariance Verification",
                "desc": "Tensor invariants are preserved under coordinate change",
                "type": "verification",
                "checks": [
                    {
                        "label": "det(T) = det(T')",
                        "lhs": float(det_T),
                        "rhs": float(det_T_prime),
                        "passed": bool(np.allclose(det_T, det_T_prime))
                    },
                    {
                        "label": "tr(T) = tr(T')",
                        "lhs": float(trace_T),
                        "rhs": float(trace_T_prime),
                        "passed": bool(np.allclose(trace_T, trace_T_prime))
                    }
                ]
            }
        ]
    }
    
    return {
        "T": T.tolist(),
        "T_prime": T_prime.tolist(),
        "det_T": float(det_T),
        "det_T_prime": float(det_T_prime),
        "trace_T": float(trace_T),
        "trace_T_prime": float(trace_T_prime),
        "ellipse_x": ellipse_points[0].tolist(),
        "ellipse_y": ellipse_points[1].tolist(),
        "workbench": workbench
    }

# ---------------------------------------------------------
# Module 3.1: Riemannian Metric & Indicatrices
# ---------------------------------------------------------

def get_metric_details(manifold_name, u, v, r=1.0, R=2.0, r_torus=0.6):
    """
    Returns metric tensor components g_ij and inverse metric g^ij
    at coordinates (u,v) for different manifolds.
    """
    g = np.zeros((2,2))
    if manifold_name == 'sphere':
        # u = theta (lat), v = phi (lon)
        g[0,0] = r**2
        g[1,1] = r**2 * np.sin(u)**2
    elif manifold_name == 'torus':
        # u = u (major), v = v (minor)
        g[0,0] = (R + r_torus * np.cos(v))**2
        g[1,1] = r_torus**2
    elif manifold_name == 'poincare':
        # u = x, v = y (y > 0)
        y = max(v, 1e-3)
        g[0,0] = 1.0 / y**2
        g[1,1] = 1.0 / y**2
    else:
        # Flat plane
        g[0,0] = 1.0
        g[1,1] = 1.0
        
    g_inv = np.linalg.inv(g)
    return g, g_inv

def get_indicatrix_ellipse(manifold_name, u, v, scale=0.15, r=1.0, R=2.0, r_torus=0.6):
    """
    Computes the representation of a local unit circle in tangent space,
    mapped to coordinates to form Tissot's indicatrix.
    """
    g, _ = get_metric_details(manifold_name, u, v, r, R, r_torus)
    
    # We want to solve v^T g v = scale^2.
    # We parameterize the tangent vector v as v = scale * R * [cos(phi), sin(phi)]^T
    # where R is the inverse square root of g.
    vals, vecs = np.linalg.eigh(g)
    g_inv_sqrt = vecs @ np.diag(1.0 / np.sqrt(vals)) @ vecs.T
    
    angles = np.linspace(0, 2*np.pi, 40)
    circle = np.array([np.cos(angles), np.sin(angles)])
    tangent_vectors = scale * (g_inv_sqrt @ circle)
    
    # Return coordinates of the ellipse centered at (u,v)
    ellipse_u = (u + tangent_vectors[0]).tolist()
    ellipse_v = (v + tangent_vectors[1]).tolist()
    return ellipse_u, ellipse_v

# ---------------------------------------------------------
# Module 3.2 & 3.3: Affine Connection & Parallel Transport (Sphere)
# ---------------------------------------------------------

def sphere_christoffel(theta):
    """
    Computes Christoffel symbols for the unit sphere at latitude theta.
    Coordinates: (theta, phi)
    """
    cot_t = 1.0 / np.tan(theta) if np.sin(theta) != 0 else 0
    sin_cos = np.sin(theta) * np.cos(theta)
    
    # Gamma^k_ij
    gamma = np.zeros((2, 2, 2))
    
    # Gamma^theta_ij
    gamma[0, 1, 1] = -sin_cos
    
    # Gamma^phi_ij
    gamma[1, 0, 1] = cot_t
    gamma[1, 1, 0] = cot_t
    
    return gamma

def parallel_transport_ode(t, V, path_func, dpath_func):
    """
    ODE system for parallel transport: dV^k/dt = - Gamma^k_ij V^i (dpath^j/dt)
    V is a 2-element state vector: [V^theta, V^phi]
    path_func(t) returns [theta, phi]
    dpath_func(t) returns [dtheta/dt, dphi/dt]
    """
    theta, _ = path_func(t)
    dtheta, dphi = dpath_func(t)
    
    gamma = sphere_christoffel(theta)
    
    # dV^k/dt
    dV = np.zeros(2)
    for k in range(2):
        sum_terms = 0.0
        for i in range(2):
            for j in range(2):
                sum_terms += gamma[k, i, j] * V[i] * (dtheta if j==0 else dphi)
        dV[k] = -sum_terms
        
    return dV

def run_parallel_transport(path_type='triangle', steps=100):
    """
    Simulates parallel transporting a vector along a closed loop on a unit sphere.
    - triangle: North Pole (almost, at theta=0.1) -> Equator (theta=pi/2, phi=0)
                -> along equator to (theta=pi/2, phi=pi/2) -> back to North Pole.
    - circle: Latitude circle at theta_0 = pi/4, phi from 0 to 2*pi.
    """
    # We will define piece-wise linear segments or smooth approximations.
    # For robust simulation, we'll define a smooth loop in parameterized t in [0, 1]
    
    t_span = (0.0, 1.0)
    t_eval = np.linspace(0.0, 1.0, steps)
    
    if path_type == 'triangle':
        # Let's create a smooth triangle or a 3-segment integration.
        # Path details:
        # Segment 1: from (0.1, 0) to (pi/2, 0)
        # Segment 2: from (pi/2, 0) to (pi/2, pi/2)
        # Segment 3: from (pi/2, pi/2) to (0.1, 0)
        
        # We can write a single parameterized path:
        def path(t):
            if t < 1/3:
                s = 3 * t
                theta = 0.1 + s * (np.pi/2 - 0.1)
                phi = 0.0
            elif t < 2/3:
                s = 3 * (t - 1/3)
                theta = np.pi/2
                phi = s * (np.pi/2)
            else:
                s = 3 * (t - 2/3)
                theta = np.pi/2 - s * (np.pi/2 - 0.1)
                phi = np.pi/2 * (1 - s)
            return np.array([theta, phi])
            
        def dpath(t):
            if t < 1/3:
                dtheta = 3 * (np.pi/2 - 0.1)
                dphi = 0.0
            elif t < 2/3:
                dtheta = 0.0
                dphi = 3 * (np.pi/2)
            else:
                dtheta = -3 * (np.pi/2 - 0.1)
                dphi = -3 * (np.pi/2)
            return np.array([dtheta, dphi])
            
        # Initial vector at t=0: pointing in the direction of the first step (along theta)
        V0 = np.array([1.0, 0.0]) # V^theta = 1, V^phi = 0 (pointing South)
        
    else: # constant latitude circle at theta = pi/4
        theta_0 = np.pi / 4
        def path(t):
            return np.array([theta_0, t * 2 * np.pi])
        def dpath(t):
            return np.array([0.0, 2 * np.pi])
            
        # Initial vector pointing along theta (South)
        V0 = np.array([1.0, 0.0])
        
    # Solve ODE
    sol = solve_ivp(parallel_transport_ode, t_span, V0, t_eval=t_eval, 
                    args=(path, dpath), rtol=1e-8, atol=1e-8)
    
    # Build geometry output list
    path_points = []
    vector_directions_3d = []
    tangent_bases_3d = []
    
    for idx, t in enumerate(t_eval):
        theta, phi = path(t)
        v_theta, v_phi = sol.y[0, idx], sol.y[1, idx]
        
        # 3D Position
        x = np.sin(theta) * np.cos(phi)
        y = np.sin(theta) * np.sin(phi)
        z = np.cos(theta)
        path_points.append([x, y, z])
        
        # Coordinate bases in R^3
        # e_theta = (cos theta cos phi, cos theta sin phi, -sin theta)
        # e_phi = (-sin theta sin phi, sin theta cos phi, 0)
        e_theta = np.array([np.cos(theta) * np.cos(phi), np.cos(theta) * np.sin(phi), -np.sin(theta)])
        e_phi = np.array([-np.sin(theta) * np.sin(phi), np.sin(theta) * np.cos(phi), 0.0])
        
        # Vector components in R^3
        V_3d = v_theta * e_theta + v_phi * e_phi
        # Scale for plotting
        V_3d_scaled = (V_3d / (np.linalg.norm(V_3d) + 1e-9) * 0.35).tolist()
        
        vector_directions_3d.append(V_3d_scaled)
        
    # Compute holonomy (angle difference between start and end vectors)
    V_start = sol.y[:, 0]
    V_end = sol.y[:, -1]
    
    # Metric at start/end
    g, _ = get_metric_details('sphere', path(0)[0], path(0)[1])
    norm_start = np.sqrt(V_start.T @ g @ V_start)
    norm_end = np.sqrt(V_end.T @ g @ V_end)
    cos_angle = (V_start.T @ g @ V_end) / (norm_start * norm_end)
    angle_deg = np.arccos(np.clip(cos_angle, -1.0, 1.0)) * 180.0 / np.pi
    
    # --- Workbench step-by-step data ---
    # Sample 5 representative points along the path for the workbench display
    sample_indices = np.linspace(0, len(t_eval) - 1, 5, dtype=int)
    wb_samples = []
    
    for sidx in sample_indices:
        t = t_eval[sidx]
        theta, phi = path(t)
        dtheta, dphi = dpath(t)
        v_theta = sol.y[0, sidx]
        v_phi = sol.y[1, sidx]
        
        gamma = sphere_christoffel(theta)
        
        # Compute each contraction term for dV^k/dt = -Γ^k_ij V^i (dγ^j/dt)
        dV_terms = {}
        coord_names = ["θ", "φ"]
        vel = [dtheta, dphi]
        V_comp = [v_theta, v_phi]
        
        for k in range(2):
            terms = []
            for i in range(2):
                for j in range(2):
                    g_val = gamma[k, i, j]
                    if abs(g_val) > 1e-10:
                        term_val = g_val * V_comp[i] * vel[j]
                        terms.append({
                            "symbol": f"Γ^{coord_names[k]}_{coord_names[i]}{coord_names[j]}",
                            "gamma": float(g_val),
                            "V_i": float(V_comp[i]),
                            "dg_j": float(vel[j]),
                            "product": float(term_val)
                        })
            dV_terms[coord_names[k]] = terms
        
        # Norm check: g_ij V^i V^j should be constant
        g_at, _ = get_metric_details('sphere', theta, phi)
        V_vec = np.array([v_theta, v_phi])
        norm_sq = float(V_vec.T @ g_at @ V_vec)
        
        wb_samples.append({
            "t": float(t),
            "theta": float(theta),
            "phi": float(phi),
            "V": [float(v_theta), float(v_phi)],
            "christoffels": {
                "Γ^θ_φφ": float(gamma[0, 1, 1]),
                "Γ^φ_θφ": float(gamma[1, 0, 1])
            },
            "dV_terms": dV_terms,
            "norm_sq": norm_sq
        })
    
    workbench = {
        "steps": [
            {
                "title": "Christoffel Symbols (Sphere)",
                "desc": "Non-zero: Γ^θ_φφ = −sin(θ)cos(θ), Γ^φ_θφ = cot(θ)",
                "type": "christoffel_table",
                "samples": wb_samples
            },
            {
                "title": "Transport ODE at Sampled Points",
                "desc": "dV^k/dt = −Σ Γ^k_ij V^i (dγ^j/dt)",
                "type": "ode_breakdown",
                "samples": wb_samples
            },
            {
                "title": "Norm Preservation",
                "desc": "g_ij V^i V^j should remain constant along the path",
                "type": "norm_check",
                "norms": [{"t": s["t"], "norm_sq": s["norm_sq"]} for s in wb_samples],
                "passed": bool(np.allclose([s["norm_sq"] for s in wb_samples], wb_samples[0]["norm_sq"], atol=1e-4))
            },
            {
                "title": "Holonomy (Rotation Deficit)",
                "desc": "Angle between initial and final vector after closed loop",
                "type": "verification",
                "checks": [
                    {
                        "label": "Holonomy angle",
                        "lhs": float(angle_deg),
                        "rhs": 0.0,
                        "unit": "°",
                        "passed": False
                    }
                ]
            }
        ]
    }
    
    return {
        "path_3d": path_points,
        "vector_3d": vector_directions_3d,
        "angle_error_deg": float(angle_deg),
        "workbench": workbench
    }

# ---------------------------------------------------------
# Module 3.4: Geodesics (Sphere and Torus)
# ---------------------------------------------------------

def compute_levicivita_workbench(manifold, u, v, r=1.0, R=2.0, r_torus=0.6, h=1e-5):
    """
    Computes Christoffel symbols from the metric tensor using the Levi-Civita formula.
    Returns complete step-by-step workbench data showing:
    1. Metric tensor and its inverse
    2. Partial derivatives of the metric
    3. The 3-term sum for each non-zero Christoffel symbol
    """
    # Step 1: Metric and inverse at (u, v)
    g, g_inv = get_metric_details(manifold, u, v, r, R, r_torus)
    
    # Step 2: Numerical partial derivatives of metric components
    # dg/du (derivative w.r.t. first coordinate)
    g_u_plus, _ = get_metric_details(manifold, u + h, v, r, R, r_torus)
    g_u_minus, _ = get_metric_details(manifold, u - h, v, r, R, r_torus)
    dg_du = (g_u_plus - g_u_minus) / (2 * h)
    
    # dg/dv (derivative w.r.t. second coordinate)
    g_v_plus, _ = get_metric_details(manifold, u, v + h, r, R, r_torus)
    g_v_minus, _ = get_metric_details(manifold, u, v - h, r, R, r_torus)
    dg_dv = (g_v_plus - g_v_minus) / (2 * h)
    
    dg = [dg_du, dg_dv]  # dg[m] = partial of g w.r.t. x^m
    
    # Step 3: Compute Christoffel symbols from formula
    # Γ^k_ij = 0.5 * g^kl * (∂_i g_jl + ∂_j g_il - ∂_l g_ij)
    coord_names = ["θ", "φ"] if manifold == 'sphere' else ["u", "v"]
    
    gamma = np.zeros((2, 2, 2))
    derivation_steps = []
    
    for k in range(2):
        for i in range(2):
            for j in range(i, 2):  # symmetric in i,j
                # Build the 3-term sum for each l
                l_contributions = []
                total = 0.0
                for l in range(2):
                    term1 = dg[i][j, l]  # ∂_i g_jl
                    term2 = dg[j][i, l]  # ∂_j g_il
                    term3 = dg[l][i, j]  # ∂_l g_ij
                    three_sum = term1 + term2 - term3
                    contribution = 0.5 * g_inv[k, l] * three_sum
                    total += contribution
                    
                    if abs(three_sum) > 1e-10 or abs(g_inv[k, l]) > 1e-10:
                        l_contributions.append({
                            "l": coord_names[l],
                            "g_inv_kl": float(g_inv[k, l]),
                            "d_i_g_jl": float(term1),
                            "d_j_g_il": float(term2),
                            "d_l_g_ij": float(term3),
                            "three_sum": float(three_sum),
                            "contribution": float(contribution)
                        })
                
                gamma[k, i, j] = total
                gamma[k, j, i] = total  # symmetry
                
                if abs(total) > 1e-10:
                    derivation_steps.append({
                        "symbol": f"Γ^{coord_names[k]}_{coord_names[i]}{coord_names[j]}",
                        "k": k, "i": i, "j": j,
                        "result": float(total),
                        "l_terms": l_contributions
                    })
    
    # Analytical Christoffels for comparison
    analytical = {}
    if manifold == 'sphere':
        analytical = {
            "Γ^θ_φφ": float(-np.sin(u) * np.cos(u)),
            "Γ^φ_θφ": float(1.0 / np.tan(u) if np.sin(u) != 0 else 0)
        }
    elif manifold == 'torus':
        denom_t = R + r_torus * np.cos(v)
        analytical = {
            "Γ^u_uv": float(-r_torus * np.sin(v) / denom_t),
            "Γ^v_uu": float(denom_t * np.sin(v) / r_torus)
        }
    
    workbench = {
        "steps": [
            {
                "title": "Metric Tensor g_ij",
                "desc": f"Evaluated at ({coord_names[0]}={u:.2f}, {coord_names[1]}={v:.2f})",
                "type": "matrix_pair",
                "g": g.tolist(),
                "g_inv": g_inv.tolist(),
                "det": float(np.linalg.det(g)),
                "labels": ["g_ij", "g^ij"]
            },
            {
                "title": "Metric Derivatives",
                "desc": f"∂g/∂{coord_names[0]} and ∂g/∂{coord_names[1]} (numerical, h={h})",
                "type": "derivative_matrices",
                "dg_du": dg_du.tolist(),
                "dg_dv": dg_dv.tolist(),
                "coord_labels": coord_names
            },
            {
                "title": "Levi-Civita Formula",
                "desc": "Γ^k_ij = ½ g^kl (∂_i g_jl + ∂_j g_il − ∂_l g_ij)",
                "type": "christoffel_derivation",
                "derivations": derivation_steps
            },
            {
                "title": "Verification vs Analytical",
                "desc": "Compare numerical derivation with known formulas",
                "type": "verification",
                "checks": [
                    {
                        "label": f"{sym} (numerical vs analytical)",
                        "lhs": float(gamma[
                            {"θ": 0, "φ": 1, "u": 0, "v": 1}[sym.split("^")[1][0]],
                            {"θ": 0, "φ": 1, "u": 0, "v": 1}[sym.split("_")[1][0]],
                            {"θ": 0, "φ": 1, "u": 0, "v": 1}[sym.split("_")[1][1]]
                        ]),
                        "rhs": val,
                        "passed": bool(np.allclose(gamma[
                            {"θ": 0, "φ": 1, "u": 0, "v": 1}[sym.split("^")[1][0]],
                            {"θ": 0, "φ": 1, "u": 0, "v": 1}[sym.split("_")[1][0]],
                            {"θ": 0, "φ": 1, "u": 0, "v": 1}[sym.split("_")[1][1]]
                        ], val, atol=1e-3))
                    }
                    for sym, val in analytical.items()
                ]
            }
        ]
    }
    
    return {
        "g": g.tolist(),
        "g_inv": g_inv.tolist(),
        "gamma": gamma.tolist(),
        "workbench": workbench
    }

def torus_christoffel(u, v, R=2.0, r=0.6):
    """
    Computes Christoffel symbols for Torus at (u,v).
    Coordinates: (u, v) - u: major, v: minor angle
    """
    denom = R + r * np.cos(v)
    sin_v = np.sin(v)
    
    gamma = np.zeros((2,2,2))
    
    # Gamma^u_ij
    gamma[0, 0, 1] = -r * sin_v / denom
    gamma[0, 1, 0] = -r * sin_v / denom
    
    # Gamma^v_ij
    gamma[1, 0, 0] = (denom * sin_v) / r
    
    return gamma

def geodesic_ode_sphere(t, y):
    """
    Geodesic ODE on Sphere:
    y = [theta, phi, dtheta/dt, dphi/dt]
    dy/dt = [dtheta/dt, dphi/dt, d^2theta/dt^2, d^2phi/dt^2]
    """
    theta, phi, dtheta, dphi = y
    gamma = sphere_christoffel(theta)
    
    d2theta = - (gamma[0,0,0]*dtheta**2 + 2*gamma[0,0,1]*dtheta*dphi + gamma[0,1,1]*dphi**2)
    d2phi = - (gamma[1,0,0]*dtheta**2 + 2*gamma[1,0,1]*dtheta*dphi + gamma[1,1,1]*dphi**2)
    
    return [dtheta, dphi, d2theta, d2phi]

def geodesic_ode_torus(t, y, R=2.0, r=0.6):
    """
    Geodesic ODE on Torus:
    y = [u, v, du/dt, dv/dt]
    """
    u, v, du, dv = y
    gamma = torus_christoffel(u, v, R, r)
    
    d2u = - (gamma[0,0,0]*du**2 + 2*gamma[0,0,1]*du*dv + gamma[0,1,1]*dv**2)
    d2v = - (gamma[1,0,0]*du**2 + 2*gamma[1,0,1]*du*dv + gamma[1,1,1]*dv**2)
    
    return [du, dv, d2u, d2v]

def run_geodesic(manifold='sphere', start_coords=[1.5, 0.1], init_vel=[0.0, 1.5], t_max=4.0, steps=120):
    """
    Solves the geodesic ODE starting from start_coords with init_vel.
    """
    t_span = (0.0, t_max)
    t_eval = np.linspace(0.0, t_max, steps)
    
    y0 = [start_coords[0], start_coords[1], init_vel[0], init_vel[1]]
    
    if manifold == 'sphere':
        sol = solve_ivp(geodesic_ode_sphere, t_span, y0, t_eval=t_eval, rtol=1e-8, atol=1e-8)
        
        # Project solution to 3D
        theta_sol = sol.y[0]
        phi_sol = sol.y[1]
        
        x = np.sin(theta_sol) * np.cos(phi_sol)
        y = np.sin(theta_sol) * np.sin(phi_sol)
        z = np.cos(theta_sol)
        
    else: # torus
        sol = solve_ivp(geodesic_ode_torus, t_span, y0, t_eval=t_eval, args=(2.0, 0.6), rtol=1e-8, atol=1e-8)
        
        u_sol = sol.y[0]
        v_sol = sol.y[1]
        
        R = 2.0
        r = 0.6
        x = (R + r * np.cos(v_sol)) * np.cos(u_sol)
        y = (R + r * np.cos(v_sol)) * np.sin(u_sol)
        z = r * np.sin(v_sol)
        
    return {
        "x": x.tolist(),
        "y": y.tolist(),
        "z": z.tolist()
    }

# ---------------------------------------------------------
# Module 3.5: Statistical Manifold Curvature (Information Geometry)
# ---------------------------------------------------------

def normal_dist_pdf(x, mu, sigma):
    """PDF of 1D Normal distribution."""
    return np.exp(-0.5 * ((x - mu) / sigma) ** 2) / (np.sqrt(2 * np.pi) * sigma)

def run_statistical_manifold(mu1=0.0, sigma1=1.0, mu2=3.0, sigma2=2.0, steps=80):
    """
    Computes the geodesic on the statistical manifold of 1D Normal distributions.
    The Fisher metric is ds^2 = (dmu^2 + 2 * dsigma^2) / sigma^2.
    
    Under reparameterization x = mu, y = sqrt(2) * sigma, the metric becomes:
    ds^2 = (dx^2 + dy^2) / y^2
    which is the standard hyperbolic metric of the Poincare Half-Plane!
    
    The geodesics in the Poincare half-plane are vertical lines or circles orthogonal to the boundary (y=0).
    For two points P1 = (x1, y1) and P2 = (x2, y2):
    1. If x1 == x2: Geodesic is a vertical line.
    2. If x1 != x2: Geodesic is a circle centered at (x_c, 0) with radius R.
       (x_c - x1)^2 + y1^2 = R^2
       (x_c - x2)^2 + y2^2 = R^2
       Solving gives: x_c = ( (x2^2 - x1^2) + (y2^2 - y1^2) ) / (2 * (x2 - x1))
       R = sqrt((x1 - x_c)^2 + y1^2)
    """
    x1, y1 = mu1, np.sqrt(2.0) * sigma1
    x2, y2 = mu2, np.sqrt(2.0) * sigma2
    
    geodesic_x = []
    geodesic_y = []
    
    if np.abs(x1 - x2) < 1e-7:
        # Case 1: Vertical line
        geodesic_x = np.full(steps, x1)
        geodesic_y = np.linspace(y1, y2, steps)
    else:
        # Case 2: Circle
        xc = ((x2**2 - x1**2) + (y2**2 - y1**2)) / (2.0 * (x2 - x1))
        R = np.sqrt((x1 - xc)**2 + y1**2)
        
        # Parametrize circle using angles
        theta1 = np.arctan2(y1, x1 - xc)
        theta2 = np.arctan2(y2, x2 - xc)
        
        theta_vals = np.linspace(theta1, theta2, steps)
        geodesic_x = xc + R * np.cos(theta_vals)
        geodesic_y = R * np.sin(theta_vals)
        
    # Map back to statistical manifold coordinates: mu = x, sigma = y / sqrt(2)
    mu_vals = geodesic_x.tolist()
    sigma_vals = (geodesic_y / np.sqrt(2.0)).tolist()
    
    # Generate some PDF shapes along the geodesic to show how the distribution morphs
    sample_indices = np.linspace(0, steps - 1, 5, dtype=int)
    distributions = []
    
    x_range = np.linspace(min(mu1 - 3*sigma1, mu2 - 3*sigma2), max(mu1 + 3*sigma1, mu2 + 3*sigma2), 150)
    
    for idx in sample_indices:
        m = mu_vals[idx]
        s = sigma_vals[idx]
        y_pdf = normal_dist_pdf(x_range, m, s)
        distributions.append({
            "mu": float(m),
            "sigma": float(s),
            "pdf_x": x_range.tolist(),
            "pdf_y": y_pdf.tolist()
        })
        
    # Compute curvature components of Fisher space symbolically to show the math
    # R = -1 constant curvature
    
    return {
        "mu_geodesic": mu_vals,
        "sigma_geodesic": sigma_vals,
        "distributions": distributions,
        "scalar_curvature": -1.0 # The theoretical scalar curvature (constant)
    }
