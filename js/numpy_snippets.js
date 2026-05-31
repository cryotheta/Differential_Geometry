const numpySnippets = {
    "m2_1": `import numpy as np

def stereographic_north_to_3d(u, v, R=1.0):
    """Maps North Pole stereographic coordinates to 3D."""
    denom = u**2 + v**2 + 1
    x = 2 * R * u / denom
    y = 2 * R * v / denom
    z = R * (u**2 + v**2 - 1) / denom
    return np.array([x, y, z])

def transition_north_to_south(u_N, v_N):
    """Transition map from North to South chart."""
    denom = u_N**2 + v_N**2
    u_S = u_N / denom
    v_S = v_N / denom
    return u_S, v_S

# Compute transition mapping over a grid
u_N_grid = np.linspace(-3.0, 3.0, 30)
v_N_grid = np.linspace(-3.0, 3.0, 30)
U_N, V_N = np.meshgrid(u_N_grid, v_N_grid)
U_S, V_S = transition_north_to_south(U_N, V_N)`,

    "m2_2": `import numpy as np

def ellipsoid_tangent_basis(u, v, a=1.5, b=1.0, c=0.8):
    """Computes point and tangent basis vectors on Ellipsoid."""
    # Point p
    p = np.array([a * np.cos(v) * np.cos(u), 
                  b * np.cos(v) * np.sin(u), 
                  c * np.sin(v)])
    # Coordinate basis tangent vectors (partial derivatives)
    e_u = np.array([-a * np.cos(v) * np.sin(u), 
                     b * np.cos(v) * np.cos(u), 
                     0.0])
    e_v = np.array([-a * np.sin(v) * np.cos(u), 
                    -b * np.sin(v) * np.sin(u), 
                     c * np.cos(v)])
    return p, e_u, e_v

def evaluate_differential_df(v, V_v, c=0.8):
    """Evaluates the covector df (differential of height function z) on vector V."""
    # df = 0*du + c*cos(v)*dv
    df_u = 0.0
    df_v = c * np.cos(v)
    return df_u * V_v[0] + df_v * V_v[1]`,

    "m2_3": `import numpy as np

def torus_pushforward(u, v, du, dv, R=2.0, r=0.6):
    """Computes Jacobian (pushforward map) and maps a 2D tangent vector."""
    # Point on Torus
    p = np.array([(R + r*np.cos(v))*np.cos(u),
                  (R + r*np.cos(v))*np.sin(u),
                  r*np.sin(v)])
    # Jacobian matrix J_ik = dx^i/du^k
    J = np.array([
        [-(R + r*np.cos(v))*np.sin(u), -r*np.sin(v)*np.cos(u)],
        [ (R + r*np.cos(v))*np.cos(u), -r*np.sin(v)*np.sin(u)],
        [ 0.0,                         r*np.cos(v)]
    ])
    # Pushed forward vector: V_3d = J * V
    V = np.array([du, dv])
    V_3d = J @ V
    return p, J, V_3d

def torus_pullback_form(u, v, Ax, Ay, Az, R=2.0, r=0.6):
    """Pulls back a 1-form A from R^3 to Torus coordinates."""
    # Torus derivatives
    dx_du = -(R + r*np.cos(v))*np.sin(u)
    dx_dv = -r*np.sin(v)*np.cos(u)
    dy_du = (R + r*np.cos(v))*np.cos(u)
    dy_dv = -r*np.sin(v)*np.sin(u)
    dz_dv = r*np.cos(v)
    
    # F*A = A_u du + A_v dv
    A_u = Ax * dx_du + Ay * dy_du
    A_v = Ax * dx_dv + Ay * dy_dv + Az * dz_dv
    return np.array([A_u, A_v])`,

    "m2_4": `import numpy as np

def rotate_tensor_components(T, alpha):
    """Transforms a (0,2)-tensor components under a coordinate rotation alpha."""
    # Rotation transformation Jacobian (2D rotation)
    cos_a = np.cos(alpha)
    sin_a = np.sin(alpha)
    J = np.array([
        [cos_a, -sin_a],
        [sin_a,  cos_a]
    ])
    
    # Tensor coordinate transformation: T_prime = J.T @ T @ J
    T_prime = J.T @ T @ J
    
    # Verify invariants
    det_T = np.linalg.det(T)
    det_T_prime = np.linalg.det(T_prime)
    trace_T = np.trace(T)
    trace_T_prime = np.trace(T_prime)
    
    assert np.allclose(det_T, det_T_prime)
    assert np.allclose(trace_T, trace_T_prime)
    return T_prime`,

    "m3_1": `import numpy as np

def get_metric_tensor(manifold_type, u, v, R=1.0, r_torus=0.4, R_torus=2.0):
    """Calculates the metric tensor g_ij and its inverse g^ij."""
    g = np.zeros((2, 2))
    if manifold_type == 'sphere':
        g[0,0] = R**2
        g[1,1] = R**2 * np.sin(u)**2  # u is theta
    elif manifold_type == 'torus':
        g[0,0] = (R_torus + r_torus * np.cos(v))**2
        g[1,1] = r_torus**2
    elif manifold_type == 'poincare_half_plane':
        y = max(v, 1e-4)
        g[0,0] = 1.0 / (y**2)
        g[1,1] = 1.0 / (y**2)
        
    g_inv = np.linalg.inv(g)
    return g, g_inv

def compute_tissot_ellipse(g, scale=0.15):
    """Computes coordinates of a local unit circle transformed by the metric tensor."""
    vals, vecs = np.linalg.eigh(g)
    g_inv_sqrt = vecs @ np.diag(1.0 / np.sqrt(vals)) @ vecs.T
    
    angles = np.linspace(0, 2*np.pi, 100)
    circle = np.array([np.cos(angles), np.sin(angles)])
    # Distorted coordinates representing equal-distance bounds
    return scale * (g_inv_sqrt @ circle)`,

    "m3_2": `import numpy as np
from scipy.integrate import solve_ivp

def sphere_christoffels(theta):
    """Computes Christoffel symbols Gamma^k_ij for S^2 in spherical coordinates."""
    cot_t = 1.0 / np.tan(theta) if np.sin(theta) != 0 else 0.0
    gamma = np.zeros((2, 2, 2))
    
    gamma[0, 1, 1] = -np.sin(theta) * np.cos(theta)  # Gamma^theta_phiphi
    gamma[1, 0, 1] = cot_t                           # Gamma^phi_thetaphi
    gamma[1, 1, 0] = cot_t                           # Gamma^phi_phitheta
    return gamma

def parallel_transport_ode(t, V, path_func, dpath_func):
    """
    Differential equation for parallel transport:
    dV^k/dt = - Gamma^k_ij * V^i * (dpath^j/dt)
    """
    theta, phi = path_func(t)
    dtheta, dphi = dpath_func(t)
    
    gamma = sphere_christoffels(theta)
    
    dV = np.zeros(2)
    for k in range(2):
        sum_val = 0.0
        for i in range(2):
            for j in range(2):
                val_j = dtheta if j == 0 else dphi
                sum_val += gamma[k, i, j] * V[i] * val_j
        dV[k] = -sum_val
    return dV`,

    "m3_3": `import numpy as np

def compute_levicivita_christoffels(g_func, u, v, h=1e-5):
    """
    Derives Christoffel symbols purely from the metric tensor components
    and their numerical derivatives (Fundamental Theorem of Riemannian Geometry).
    """
    # Evaluate metric and its inverse
    g = g_func(u, v)
    g_inv = np.linalg.inv(g)
    
    # Numerical derivatives of metric w.r.t coordinates
    dg_du = (g_func(u + h, v) - g_func(u - h, v)) / (2 * h)
    dg_dv = (g_func(u, v + h) - g_func(u, v - h)) / (2 * h)
    dg = [dg_du, dg_dv] # dg[0] = dg/du, dg[1] = dg/dv
    
    gamma = np.zeros((2,2,2))
    for k in range(2):
        for i in range(2):
            for j in range(2):
                val = 0.0
                for l in range(2):
                    # Formula: 0.5 * g^kl * (d_i g_jl + d_j g_il - d_l g_ij)
                    d_i_g_jl = dg[i][j, l]
                    d_j_g_il = dg[j][i, l]
                    d_l_g_ij = dg[l][i, j]
                    val += g_inv[k, l] * (d_i_g_jl + d_j_g_il - d_l_g_ij)
                gamma[k, i, j] = 0.5 * val
    return gamma`,

    "m3_4": `import numpy as np
from scipy.integrate import solve_ivp

def torus_geodesic_ode(t, state, R=2.0, r=0.6):
    """
    Geodesic geodesic ODE system for a Torus:
    d^2x^k/dt^2 + Gamma^k_ij (dx^i/dt)(dx^j/dt) = 0
    state = [u, v, du/dt, dv/dt]
    """
    u, v, du, dv = state
    denom = R + r * np.cos(v)
    
    # Torus non-zero Christoffel symbols:
    # Gamma^u_uv = -r*sin(v)/(R + r*cos(v))
    # Gamma^v_uu = (R + r*cos(v))*sin(v)/r
    
    d2u = (2 * r * np.sin(v) / denom) * du * dv
    d2v = - ((denom * np.sin(v)) / r) * du**2
    
    return [du, dv, d2u, d2v]

# Run geodesic solver integration
state_0 = [0.0, 0.5, 0.5, 2.0]  # Initial coords & velocities
t_span = (0, 10)
sol = solve_ivp(torus_geodesic_ode, t_span, state_0, t_eval=np.linspace(0, 10, 200))`,

    "m3_5": `import numpy as np

def normal_dist_fisher_metric(mu, sigma):
    """Fisher Information Metric of 1D Normal distribution."""
    # ds^2 = dmu^2 / sigma^2 + 2 * dsigma^2 / sigma^2
    g = np.array([
        [1.0 / (sigma**2), 0.0],
        [0.0, 2.0 / (sigma**2)]
    ])
    return g

def compute_normal_geodesic(mu1, sigma1, mu2, sigma2, steps=100):
    """
    Computes shortest path (geodesic) between two normal distributions.
    By mapping x = mu, y = sqrt(2)*sigma, FIM maps to Poincare Half-Plane:
    ds^2 = (dx^2 + dy^2) / y^2. Geodesics are semicircles perpendicular to y=0.
    """
    x1, y1 = mu1, np.sqrt(2.0) * sigma1
    x2, y2 = mu2, np.sqrt(2.0) * sigma2
    
    if np.abs(x1 - x2) < 1e-6:
        # Vertical line geodesic
        y_vals = np.linspace(y1, y2, steps)
        x_vals = np.full(steps, x1)
    else:
        # Semicircle center xc on boundary y=0
        xc = ((x2**2 - x1**2) + (y2**2 - y1**2)) / (2.0 * (x2 - x1))
        R = np.sqrt((x1 - xc)**2 + y1**2)
        
        theta1 = np.arctan2(y1, x1 - xc)
        theta2 = np.arctan2(y2, x2 - xc)
        thetas = np.linspace(theta1, theta2, steps)
        
        x_vals = xc + R * np.cos(thetas)
        y_vals = R * np.sin(thetas)
        
    mu_geodesic = x_vals
    sigma_geodesic = y_vals / np.sqrt(2.0)
    return mu_geodesic, sigma_geodesic`
};

// Export to window object if running in browser
if (typeof window !== 'undefined') {
    window.numpySnippets = numpySnippets;
}
