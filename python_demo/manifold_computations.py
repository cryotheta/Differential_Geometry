import sympy as sp
import numpy as np

def symbolic_sphere_geometry():
    print("=" * 60)
    print("SYMBOLIC COMPUTATION OF SPHERE MANIFOLD GEOMETRY")
    print("=" * 60)
    
    # 1. Define symbolic coordinates and variables
    theta, phi = sp.symbols('theta phi', real=True)
    R = sp.symbols('R', positive=True)
    
    # Coordinates list
    coords = [theta, phi]
    n = len(coords)
    
    # 2. Define the metric tensor g_ij for a sphere of radius R:
    # ds^2 = R^2 dtheta^2 + R^2 sin^2(theta) dphi^2
    g = sp.Matrix([
        [R**2, 0],
        [0, R**2 * sp.sin(theta)**2]
    ])
    
    print("\nMetric Tensor g_ij:")
    sp.pprint(g)
    
    # 3. Compute the inverse metric tensor g^ij
    g_inv = g.inv()
    print("\nInverse Metric Tensor g^ij:")
    sp.pprint(g_inv)
    
    # 4. Compute Christoffel symbols of the second kind:
    # Gamma^k_ij = 0.5 * g^kl * (d_i g_jl + d_j g_il - d_l g_ij)
    # We will represent it as a 3D dictionary of lists
    gamma = {}
    for k in range(n):
        for i in range(n):
            for j in range(n):
                val = 0
                for l in range(n):
                    # Partial derivatives of metric components
                    dg_jl_di = sp.diff(g[j, l], coords[i])
                    dg_il_dj = sp.diff(g[i, l], coords[j])
                    dg_ij_dl = sp.diff(g[i, j], coords[l])
                    
                    val += 0.5 * g_inv[k, l] * (dg_jl_di + dg_il_dj - dg_ij_dl)
                
                # Simplify expression
                val = sp.simplify(val)
                if val != 0:
                    gamma[(k, i, j)] = val
                    
    print("\nNon-zero Christoffel Symbols Gamma^k_ij:")
    for key, val in gamma.items():
        k_idx, i_idx, j_idx = key
        # Map indices to symbols for printing
        k_sym = coords[k_idx]
        i_sym = coords[i_idx]
        j_sym = coords[j_idx]
        print(f"Gamma^{k_sym}_{i_sym}{j_sym} = ", end="")
        sp.pprint(val)

def numerical_evaluation():
    print("\n" + "=" * 60)
    print("NUMERICAL EVALUATION USING NUMPY")
    print("=" * 60)
    
    # Let's evaluate at theta = pi/4 (45 degrees), phi = 0, R = 1.0
    theta_val = np.pi / 4.0
    R_val = 1.0
    
    # Metric tensor
    g_num = np.array([
        [R_val**2, 0.0],
        [0.0, (R_val**2) * (np.sin(theta_val)**2)]
    ])
    
    print(f"At theta = {theta_val:.4f} (~pi/4), R = {R_val}:")
    print("\ng_ij (numerical) =")
    print(g_num)
    
    # Non-zero Christoffels:
    # Gamma^theta_phiphi = -sin(theta)*cos(theta)
    # Gamma^phi_thetaphi = cot(theta)
    gamma_theta_phiphi = -np.sin(theta_val) * np.cos(theta_val)
    gamma_phi_thetaphi = 1.0 / np.tan(theta_val)
    
    print(f"\nGamma^theta_phiphi = {gamma_theta_phiphi:.4f} (analytical: -sin(theta)cos(theta) = -0.5000)")
    print(f"Gamma^phi_thetaphi = {gamma_phi_thetaphi:.4f} (analytical: cot(theta) = 1.0000)")

if __name__ == "__main__":
    symbolic_sphere_geometry()
    numerical_evaluation()
