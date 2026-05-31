import numpy as np
import matplotlib.pyplot as plt

def normal_pdf(x, mu, sigma):
    return np.exp(-0.5 * ((x - mu) / sigma) ** 2) / (np.sqrt(2 * np.pi) * sigma)

def compute_fisher_geodesic(mu1, sigma1, mu2, sigma2, steps=100):
    """
    Computes the geodesic in the 1D Normal distribution manifold.
    The Fisher metric: ds^2 = (dmu^2 + 2 * dsigma^2) / sigma^2
    Isomorphism to Poincare Half-Plane: x = mu, y = sqrt(2)*sigma.
    """
    x1, y1 = mu1, np.sqrt(2.0) * sigma1
    x2, y2 = mu2, np.sqrt(2.0) * sigma2
    
    if np.abs(x1 - x2) < 1e-6:
        # Vertical geodesic line
        y_vals = np.linspace(y1, y2, steps)
        x_vals = np.full(steps, x1)
    else:
        # Semicircular geodesic line centered on y=0
        xc = ((x2**2 - x1**2) + (y2**2 - y1**2)) / (2.0 * (x2 - x1))
        R = np.sqrt((x1 - xc)**2 + y1**2)
        
        theta1 = np.arctan2(y1, x1 - xc)
        theta2 = np.arctan2(y2, x2 - xc)
        thetas = np.linspace(theta1, theta2, steps)
        
        x_vals = xc + R * np.cos(thetas)
        y_vals = R * np.sin(thetas)
        
    mu_geodesic = x_vals
    sigma_geodesic = y_vals / np.sqrt(2.0)
    return mu_geodesic, sigma_geodesic

def plot_and_save():
    print("=" * 60)
    print("INFORMATION GEODESIC ON THE STATISTICAL MANIFOLD")
    print("=" * 60)
    
    # Define start and end distributions
    mu1, sigma1 = -1.5, 0.6
    mu2, sigma2 = 1.5, 1.8
    
    print(f"Start distribution: N(mu={mu1}, sigma={sigma1})")
    print(f"End distribution:   N(mu={mu2}, sigma={sigma2})")
    
    # Compute geodesic
    mu_geo, sigma_geo = compute_fisher_geodesic(mu1, sigma1, mu2, sigma2)
    
    # Create plot
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
    
    # 1. Parameter space plot (Poincare Half-Plane geometry)
    ax1.plot(mu_geo, sigma_geo, 'indigo', lw=3, label="Fisher Geodesic")
    ax1.scatter([mu1, mu2], [sigma1, sigma2], color='crimson', s=100, zorder=5, label="Endpoints")
    
    # Sample distributions along the geodesic
    sample_indices = np.linspace(0, len(mu_geo)-1, 5, dtype=int)
    colors = plt.cm.viridis(np.linspace(0, 1, 5))
    
    for idx, col in zip(sample_indices, colors):
        m = mu_geo[idx]
        s = sigma_geo[idx]
        ax1.scatter([m], [s], color=col, s=60, zorder=4)
        ax1.text(m + 0.1, s + 0.05, f"d{idx+1}", fontsize=10, fontweight='bold')
        
    ax1.set_title("Geodesic in Parameter Space (H^2)", fontsize=14)
    ax1.set_xlabel("Mean (mu)", fontsize=12)
    ax1.set_ylabel("Standard Deviation (sigma)", fontsize=12)
    ax1.grid(True, linestyle='--', alpha=0.6)
    ax1.legend(fontsize=11)
    
    # 2. Morphing PDFs plot
    x_range = np.linspace(-4.5, 6.5, 300)
    for idx, col in zip(sample_indices, colors):
        m = mu_geo[idx]
        s = sigma_geo[idx]
        y_pdf = normal_pdf(x_range, m, s)
        ax2.plot(x_range, y_pdf, color=col, lw=2.5, label=f"d{idx+1}: N({m:.2f}, {s:.2f})")
        ax2.fill_between(x_range, 0, y_pdf, color=col, alpha=0.08)
        
    ax2.set_title("Probability Density Functions Morphing along Geodesic", fontsize=14)
    ax2.set_xlabel("X", fontsize=12)
    ax2.set_ylabel("Probability Density", fontsize=12)
    ax2.grid(True, linestyle='--', alpha=0.6)
    ax2.legend(fontsize=10)
    
    plt.tight_layout()
    plot_path = "information_geodesic_demo.png"
    plt.savefig(plot_path, dpi=150)
    print(f"\nPlot successfully saved to: {plot_path}")
    print("\nObserve how the geodesic does not follow a straight line in parameter space.")
    print("Instead, it arches upward to larger standard deviations. This 'goes around'")
    print("by increasing variance, which reduces Kullback-Leibler distance during the transition!")

if __name__ == "__main__":
    plot_and_save()
