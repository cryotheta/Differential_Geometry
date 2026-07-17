/**
 * Algebra Workbench — Interactive Computation Visualizer
 * Renders step-by-step tensor/matrix computations with auto-play animation.
 * 
 * Supports rendering types:
 *   - matrix           : Single matrix display
 *   - formula_eval     : Line-by-line formula evaluation (for nonlinear maps)
 *   - mat_vec_mul      : Matrix × Vector = Vector with row-product expansion
 *   - mat_mat_mul      : Matrix × Matrix = Matrix
 *   - triple_product   : A × B × C = D
 *   - dot_product      : Scalar result from dot product
 *   - matrix_pair      : Two matrices side by side (g and g^{-1})
 *   - derivative_matrices : Partial derivative matrices
 *   - christoffel_table : Christoffel symbols at sample points
 *   - christoffel_derivation : Full derivation from metric
 *   - ode_breakdown    : ODE computation at sample points
 *   - norm_check       : Norm preservation bar chart
 *   - verification     : Invariance check (pass/fail)
 */

const WorkbenchRenderer = (() => {
    // Auto-play state
    let autoPlayTimer = null;
    let currentStepIndex = 0;
    let totalSteps = 0;
    const STEP_DELAY = 1200; // ms between auto-play steps

    // =============================================
    // Utility: Format number with sign coloring
    // =============================================
    function fmtNum(val, decimals = 3) {
        const v = parseFloat(val);
        if (isNaN(v)) return '<span class="wb-matrix-cell zero">—</span>';
        const cls = Math.abs(v) < 1e-6 ? 'zero' : (v > 0 ? 'positive' : 'negative');
        return `<span class="wb-matrix-cell ${cls}">${v.toFixed(decimals)}</span>`;
    }

    function fmtInline(val, decimals = 3) {
        const v = parseFloat(val);
        if (isNaN(v)) return '<span class="wb-val-inline">—</span>';
        const cls = v < 0 ? 'neg' : '';
        return `<span class="wb-val-inline ${cls}">${v.toFixed(decimals)}</span>`;
    }

    // =============================================
    // Matrix rendering
    // =============================================
    function renderMatrixHTML(matrix, label) {
        let rows = matrix.map(row => {
            const cells = row.map(v => fmtNum(v));
            return `<div class="wb-matrix-row">${cells.join('')}</div>`;
        }).join('');
        
        let html = '<div class="wb-matrix-container">';
        if (label) html += `<div class="wb-matrix-label">${label}</div>`;
        html += `<div class="wb-matrix">${rows}</div>`;
        html += '</div>';
        return html;
    }

    function renderVectorHTML(vec, label, orientation = 'col') {
        if (orientation === 'col') {
            const cells = vec.map(v => `<div class="wb-vector-cell ${Math.abs(v) < 1e-6 ? 'zero' : (v > 0 ? 'positive' : 'negative')}">${parseFloat(v).toFixed(3)}</div>`);
            let html = '<div class="wb-vector-container">';
            if (label) html += `<div class="wb-matrix-label">${label}</div>`;
            html += `<div class="wb-vector">${cells.join('')}</div>`;
            html += '</div>';
            return html;
        }
        // Row orientation
        const cells = vec.map(v => fmtNum(v)).join(' ');
        let html = '<div class="wb-vector-container">';
        if (label) html += `<div class="wb-matrix-label">${label}</div>`;
        html += `<div class="wb-matrix"><div class="wb-matrix-row">${cells}</div></div>`;
        html += '</div>';
        return html;
    }

    // =============================================
    // Step type renderers
    // =============================================

    function renderStepMatrix(step) {
        return renderMatrixHTML(step.matrix, '');
    }

    function renderStepFormulaEval(step) {
        let html = '';
        if (step.lines && step.lines.length > 0) {
            html += '<div class="wb-row-expansion">';
            step.lines.forEach(line => {
                html += `<div class="wb-row-line">${line.expr} = <span class="wb-row-result">${parseFloat(line.value).toFixed(4)}</span></div>`;
            });
            html += '</div>';
        }
        if (step.note) {
            html += `<div class="wb-step-desc" style="margin-top: 8px; font-style: italic;">${step.note}</div>`;
        }
        return html;
    }

    function renderStepMatVecMul(step) {
        let html = '<div class="wb-operation">';
        html += renderMatrixHTML(step.matrix, step.mat_label || '');
        html += '<span class="wb-op-symbol">·</span>';
        html += renderVectorHTML(step.vector, step.vec_label || '');
        html += '<span class="wb-equals">=</span>';
        html += renderVectorHTML(step.result, step.res_label || '');
        html += '</div>';

        // Row product expansion
        if (step.row_products) {
            html += '<div class="wb-row-expansion">';
            step.row_products.forEach((row, idx) => {
                const terms = row.map((t, c) => {
                    const matVal = step.matrix[idx][c];
                    const vecVal = step.vector[c];
                    const cls = t < 0 ? 'neg' : '';
                    return `${fmtInline(matVal)} × ${fmtInline(vecVal)}`;
                }).join(' + ');
                const res = step.result[idx];
                html += `<div class="wb-row-line">row ${idx + 1}: ${terms} = <span class="wb-row-result">${parseFloat(res).toFixed(3)}</span></div>`;
            });
            html += '</div>';
        }
        return html;
    }

    function renderStepMatMatMul(step) {
        let html = '<div class="wb-operation">';
        html += renderMatrixHTML(step.A, step.labels ? step.labels[0] : '');
        html += '<span class="wb-op-symbol">·</span>';
        html += renderMatrixHTML(step.B, step.labels ? step.labels[1] : '');
        html += '<span class="wb-equals">=</span>';
        html += renderMatrixHTML(step.result, step.labels ? step.labels[2] : '');
        html += '</div>';
        return html;
    }

    function renderStepTripleProduct(step) {
        let html = '<div class="wb-triple-product">';
        html += renderMatrixHTML(step.A, step.labels[0]);
        html += '<span class="wb-op-symbol">·</span>';
        html += renderMatrixHTML(step.B, step.labels[1]);
        html += '<span class="wb-op-symbol">·</span>';
        html += renderMatrixHTML(step.C, step.labels[2]);
        html += '<span class="wb-equals">=</span>';
        html += renderMatrixHTML(step.result, step.labels[3]);
        html += '</div>';
        return html;
    }

    function renderStepDotProduct(step) {
        let html = '<div class="wb-operation">';
        html += renderVectorHTML(step.left, step.left_label || '', 'row');
        html += '<span class="wb-op-symbol">·</span>';
        html += renderVectorHTML(step.right, step.right_label || '', 'col');
        html += '</div>';

        // Term breakdown
        if (step.terms) {
            html += '<div class="wb-row-expansion">';
            step.terms.forEach((t, idx) => {
                html += `<div class="wb-row-line">${fmtInline(step.left[idx])} × ${fmtInline(step.right[idx])} = <span class="wb-term ${t < 0 ? 'neg' : ''}">${parseFloat(t).toFixed(3)}</span></div>`;
            });
            html += '</div>';
        }

        html += `<div class="wb-scalar-result">
            <span class="wb-scalar-label">Result</span>
            <span class="wb-scalar-value">${parseFloat(step.result).toFixed(4)}</span>
        </div>`;
        return html;
    }

    function renderStepMatrixPair(step) {
        let html = '<div class="wb-matrix-pair">';
        html += '<div class="wb-matrix-group">';
        html += `<div class="wb-matrix-group-label">${step.labels[0]}</div>`;
        html += renderMatrixHTML(step.g, '');
        html += '</div>';
        html += '<div class="wb-matrix-group">';
        html += `<div class="wb-matrix-group-label">${step.labels[1]}</div>`;
        html += renderMatrixHTML(step.g_inv, '');
        html += '</div>';
        html += '</div>';
        if (step.det !== undefined) {
            html += `<div class="wb-det-badge">det(g) = <span class="wb-val">${parseFloat(step.det).toFixed(4)}</span></div>`;
        }
        return html;
    }

    function renderStepDerivativeMatrices(step) {
        const labels = step.coord_labels || ['u', 'v'];
        let html = '<div class="wb-matrix-pair">';
        html += '<div class="wb-matrix-group">';
        html += `<div class="wb-matrix-group-label">∂g/∂${labels[0]}</div>`;
        html += renderMatrixHTML(step.dg_du, '');
        html += '</div>';
        html += '<div class="wb-matrix-group">';
        html += `<div class="wb-matrix-group-label">∂g/∂${labels[1]}</div>`;
        html += renderMatrixHTML(step.dg_dv, '');
        html += '</div>';
        html += '</div>';
        return html;
    }

    function renderStepChristoffelTable(step) {
        if (!step.samples || step.samples.length === 0) return '<div class="wb-empty">No sample data</div>';
        
        let html = '<table class="wb-christoffel-table">';
        html += '<tr><th>t</th><th>θ</th><th>φ</th>';
        const symKeys = Object.keys(step.samples[0].christoffels);
        symKeys.forEach(k => {
            html += `<th class="wb-sym-name">${k}</th>`;
        });
        html += '</tr>';
        
        step.samples.forEach((s, idx) => {
            const cls = idx === 0 ? 'active-row' : '';
            html += `<tr class="${cls}">`;
            html += `<td>${parseFloat(s.t).toFixed(2)}</td>`;
            html += `<td>${parseFloat(s.theta).toFixed(3)}</td>`;
            html += `<td>${parseFloat(s.phi).toFixed(3)}</td>`;
            symKeys.forEach(k => {
                const v = s.christoffels[k];
                html += `<td>${fmtInline(v)}</td>`;
            });
            html += '</tr>';
        });
        html += '</table>';
        return html;
    }

    function renderStepChristoffelDerivation(step) {
        if (!step.derivations || step.derivations.length === 0) {
            return '<div class="wb-empty"><span class="wb-empty-icon">∅</span>All Christoffel symbols vanish at this point</div>';
        }
        
        let html = '';
        step.derivations.forEach(d => {
            html += '<div class="wb-derivation">';
            html += `<div class="wb-deriv-symbol">${d.symbol} <span class="wb-deriv-result">= ${parseFloat(d.result).toFixed(4)}</span></div>`;
            
            if (d.l_terms && d.l_terms.length > 0) {
                html += '<div class="wb-deriv-terms">';
                d.l_terms.forEach(lt => {
                    html += `<span class="wb-deriv-term">`;
                    html += `<span class="wb-formula-ref">l=${lt.l}</span> `;
                    html += `½ × ${fmtInline(lt.g_inv_kl)} × (${fmtInline(lt.d_i_g_jl)} + ${fmtInline(lt.d_j_g_il)} − ${fmtInline(lt.d_l_g_ij)})`;
                    html += ` = ${fmtInline(lt.contribution)}`;
                    html += '</span>';
                });
                html += '</div>';
            }
            html += '</div>';
        });
        return html;
    }

    function renderStepODEBreakdown(step) {
        if (!step.samples || step.samples.length === 0) return '';
        
        // Show the first sample point's detailed ODE computation
        const s = step.samples[0];
        let html = '';
        
        html += `<div style="font-size: 10px; color: var(--terminal-dim); margin-bottom: 8px;">
            Showing at t=${parseFloat(s.t).toFixed(2)}, V = [${parseFloat(s.V[0]).toFixed(3)}, ${parseFloat(s.V[1]).toFixed(3)}]
        </div>`;
        
        const coordNames = ['θ', 'φ'];
        coordNames.forEach(k => {
            const terms = s.dV_terms[k];
            if (!terms || terms.length === 0) {
                html += `<div class="wb-ode-block">
                    <div class="wb-ode-lhs">dV^${k}/dt</div>
                    <div class="wb-ode-result">= 0 (no non-zero Γ terms)</div>
                </div>`;
                return;
            }
            
            html += '<div class="wb-ode-block">';
            html += `<div class="wb-ode-lhs">dV^${k}/dt = −Σ Γ^${k}_ij · V^i · dγ^j/dt</div>`;
            html += '<div class="wb-ode-terms">';
            
            let totalDV = 0;
            terms.forEach(term => {
                totalDV -= term.product;
                html += `<span class="wb-ode-term active">
                    −${term.symbol} × V^i × dγ^j/dt = −(${fmtInline(term.gamma)}) × (${fmtInline(term.V_i)}) × (${fmtInline(term.dg_j)}) = ${fmtInline(-term.product)}
                </span>`;
            });
            
            html += '</div>';
            html += `<div class="wb-ode-result">= ${fmtInline(totalDV)}</div>`;
            html += '</div>';
        });
        
        return html;
    }

    function renderStepNormCheck(step) {
        if (!step.norms || step.norms.length === 0) return '';
        
        const maxNorm = Math.max(...step.norms.map(n => n.norm_sq));
        let html = '<div class="wb-norm-bars">';
        
        step.norms.forEach(n => {
            const pct = maxNorm > 0 ? (n.norm_sq / maxNorm) * 100 : 0;
            html += `<div class="wb-norm-bar">
                <span class="wb-norm-bar-label">t=${parseFloat(n.t).toFixed(2)}</span>
                <div class="wb-norm-bar-track">
                    <div class="wb-norm-bar-fill" style="width: ${pct.toFixed(1)}%"></div>
                </div>
                <span class="wb-norm-bar-value">${parseFloat(n.norm_sq).toFixed(4)}</span>
            </div>`;
        });
        
        html += '</div>';
        
        const statusCls = step.passed ? 'passed' : 'failed';
        const statusIcon = step.passed ? '✓' : '✗';
        html += `<div class="wb-check ${statusCls}">
            <span class="wb-check-icon">${statusIcon}</span>
            <span class="wb-check-label">Norm is ${step.passed ? 'preserved' : 'NOT preserved'}</span>
        </div>`;
        
        return html;
    }

    function renderStepVerification(step) {
        if (!step.checks) return '';
        
        let html = '';
        step.checks.forEach(chk => {
            const cls = chk.passed ? 'passed' : 'failed';
            const icon = chk.passed ? '✓' : '≠';
            const unit = chk.unit || '';
            html += `<div class="wb-check ${cls}">
                <span class="wb-check-icon">${icon}</span>
                <span class="wb-check-label">${chk.label}</span>
                <span class="wb-check-values">
                    <span class="wb-val">${parseFloat(chk.lhs).toFixed(4)}${unit}</span>
                    ${chk.passed ? '=' : '≠'}
                    <span class="wb-val">${parseFloat(chk.rhs).toFixed(4)}${unit}</span>
                </span>
            </div>`;
        });
        return html;
    }

    // =============================================
    // Step dispatcher
    // =============================================
    function renderStepBody(step) {
        switch (step.type) {
            case 'matrix':              return renderStepMatrix(step);
            case 'formula_eval':        return renderStepFormulaEval(step);
            case 'mat_vec_mul':         return renderStepMatVecMul(step);
            case 'mat_mat_mul':         return renderStepMatMatMul(step);
            case 'triple_product':      return renderStepTripleProduct(step);
            case 'dot_product':         return renderStepDotProduct(step);
            case 'matrix_pair':         return renderStepMatrixPair(step);
            case 'derivative_matrices': return renderStepDerivativeMatrices(step);
            case 'christoffel_table':   return renderStepChristoffelTable(step);
            case 'christoffel_derivation': return renderStepChristoffelDerivation(step);
            case 'ode_breakdown':       return renderStepODEBreakdown(step);
            case 'norm_check':          return renderStepNormCheck(step);
            case 'verification':        return renderStepVerification(step);
            default:                    return `<div class="wb-empty">Unknown step type: ${step.type}</div>`;
        }
    }

    // =============================================
    // Auto-play animation controller
    // =============================================
    function startAutoPlay() {
        stopAutoPlay();
        currentStepIndex = 0;
        
        const allSteps = document.querySelectorAll('#workbench-container .wb-step');
        totalSteps = allSteps.length;
        
        if (totalSteps === 0) return;

        // Update progress bar
        const progressFill = document.querySelector('.wb-progress-fill');
        
        function revealNextStep() {
            if (currentStepIndex >= totalSteps) {
                // All steps revealed, mark as complete
                if (progressFill) progressFill.style.width = '100%';
                stopAutoPlay();
                return;
            }
            
            const step = allSteps[currentStepIndex];
            step.classList.add('visible');
            step.classList.add('active');
            
            // Remove active from previous step
            if (currentStepIndex > 0) {
                allSteps[currentStepIndex - 1].classList.remove('active');
            }
            
            // Update progress
            if (progressFill) {
                const pct = ((currentStepIndex + 1) / totalSteps) * 100;
                progressFill.style.width = pct + '%';
            }
            
            currentStepIndex++;
            autoPlayTimer = setTimeout(revealNextStep, STEP_DELAY);
        }
        
        revealNextStep();
    }

    function stopAutoPlay() {
        if (autoPlayTimer) {
            clearTimeout(autoPlayTimer);
            autoPlayTimer = null;
        }
    }

    // =============================================
    // Main render entry point
    // =============================================
    function render(moduleId, data) {
        const container = document.getElementById('workbench-container');
        if (!container) return;

        // Check if workbench data exists
        let workbench = null;
        
        if (data.workbench) {
            workbench = data.workbench;
        } else if (data.transport_data && data.transport_data.workbench) {
            // For parallel transport, workbench might be nested
            workbench = data.transport_data.workbench;
        }
        
        // Only render for modules with workbench data
        const supportedModules = ['m2_1', 'm2_2', 'm2_3', 'm2_4', 'm3_2', 'm3_3'];
        if (!supportedModules.includes(moduleId) || !workbench) {
            container.innerHTML = `<div class="wb-empty">
                <span class="wb-empty-icon">∂</span>
                Algebra workbench not yet available for this module.
            </div>`;
            return;
        }

        stopAutoPlay();

        // Build step cards
        let html = '<div class="wb-progress-bar"><div class="wb-progress-fill"></div></div>';
        
        workbench.steps.forEach((step, idx) => {
            html += `<div class="wb-step" data-step="${idx}">`;
            html += `<div class="wb-step-header">
                <span class="wb-step-number">${idx + 1}</span>
                <span class="wb-step-title">${step.title}</span>
            </div>`;
            if (step.desc) {
                html += `<div class="wb-step-desc">${step.desc}</div>`;
            }
            html += `<div class="wb-step-body">${renderStepBody(step)}</div>`;
            html += '</div>';
        });

        container.innerHTML = html;

        // Start auto-play animation
        requestAnimationFrame(() => {
            startAutoPlay();
        });
    }

    // Public API
    return { render, stopAutoPlay };
})();

// Export to window
if (typeof window !== 'undefined') {
    window.WorkbenchRenderer = WorkbenchRenderer;
}
