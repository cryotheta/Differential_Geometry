// Module data (lecture notes, tasks, controls, stats) lives in js/content.js,
// loaded before this file. This file is UI logic only.


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

// Render KaTeX inside an element. Retries briefly in case the deferred
// KaTeX CDN script has not finished loading when content is injected.
function renderMath(el, attempt = 0) {
    if (!el) return;
    if (window.renderMathInElement) {
        window.renderMathInElement(el, {
            delimiters: [
                {left: "$$", right: "$$", display: true},
                {left: "$", right: "$", display: false}
            ]
        });
    } else if (attempt < 10) {
        setTimeout(() => renderMath(el, attempt + 1), 300);
    }
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
            const rightPane = document.querySelector('.pane-right');
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

        // Append a toggle button only for sections that carry a simulation
        if (sections.length > 1 && sec.apiPath) {
            html += `
            <div style="margin-top: 20px;">
                <button class="btn btn-outline" style="width: 100%; border-color: var(--primary); color: var(--primary);" onclick="activateSectionById('${sec.id}')">
                    ▶ Load Simulation: ${sec.title || sec.id}
                </button>
            </div>`;
        }

        secDiv.innerHTML = html;
        theoryDiv.appendChild(secDiv);
    });

    renderMath(theoryDiv);

    // Inject Python/NumPy Code Snippet once per module (or could be per section later)
    const codeSnippet = document.getElementById("code-snippet");
    if (window.numpySnippets && window.numpySnippets[modId]) {
        codeSnippet.textContent = window.numpySnippets[modId];
    } else {
        codeSnippet.textContent = "# Code snippet coming soon...";
    }
    
    // Activate the first section that carries a simulation (reading-only
    // sections still show their theory in the left pane)
    const firstSim = sections.find(s => s.apiPath) || sections[0];
    if (firstSim) {
        document.getElementById(`section-${firstSim.id}`).classList.add('active');
        activateSection(firstSim.id, firstSim);
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
        taskMission.innerHTML = sectionData.task.mission;
        taskQuestion.innerHTML = sectionData.task.guiding_question;
        taskHint.innerHTML = sectionData.task.hint || "";
        taskHint.style.display = "none";
        taskHintBtn.textContent = "Show Hint";
        taskHintBtn.style.display = sectionData.task.hint ? "inline-block" : "none";
        document.querySelector(".task-card").style.display = "block";
        renderMath(document.querySelector(".task-card"));
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
        renderMath(controlsContainer);
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
    renderMath(document.getElementById("controls-container"));
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

    // Reading-only sections have no simulation attached
    if (!sectionData.apiPath) return;

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
        // covectors / differential sections receive server-formatted stats
        if (activeSectionId === "lie_bracket" && data.gap) {
            document.getElementById("stat-gap_dist").innerText = data.gap_dist.toFixed(4);
        } else if (activeSectionId === "tangent_basis" && data.tangent_data) {
            const p = data.tangent_data.p;
            document.getElementById("stat-p_coords").innerText = `(${p[0].toFixed(2)}, ${p[1].toFixed(2)}, ${p[2].toFixed(2)})`;
            document.getElementById("stat-basis_lengths").innerText = `|∂u|=${data.tangent_data.len_eu.toFixed(2)}, |∂v|=${data.tangent_data.len_ev.toFixed(2)}`;
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
            const uN = parseFloat(document.getElementById("u_n").value);
            const vN = parseFloat(document.getElementById("v_n").value);

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

            // Mapped point on South Chart (absent when outside the overlap)
            if (!data.transition.domain_error) {
                traces.push({
                    type: 'scatter', mode: 'markers',
                    x: [data.transition.u_S], y: [data.transition.v_S],
                    marker: { color: '#d97706', size: 12, symbol: 'x' }, name: 'South Coord (u_S, v_S)'
                });
            }

            const layout_2d = {
                paper_bgcolor: '#0a0e06', plot_bgcolor: '#0a0e06',
                margin: { l: 20, r: 20, b: 20, t: 20 }, showlegend: true,
                legend: { font: { color: '#b8f7a8' } },
                xaxis: { range: [-3, 3], gridcolor: '#1a2414', zerolinecolor: '#4a6a40' },
                yaxis: { range: [-3, 3], scaleanchor: 'x', scaleratio: 1, gridcolor: '#1a2414', zerolinecolor: '#4a6a40' }
            };
            Plotly.newPlot('plotly-div', traces, layout_2d);

        } else if (activeSectionId === "spherical_transition" && data.spherical) {
            // Sphere + projection ray from N through p to the equatorial plane
            const sp = data.spherical;
            const s = data.sphere_mesh;

            traces.push({
                type: 'surface', x: s.x, y: s.y, z: s.z,
                opacity: 0.18, showscale: false,
                colorscale: [[0, '#0e2010'], [1, '#1a4020']]
            });
            // Equatorial projection plane
            traces.push({
                type: 'surface', x: sp.plane.x, y: sp.plane.y, z: sp.plane.z,
                opacity: 0.15, showscale: false,
                colorscale: [[0, '#0a1a2a'], [1, '#0e7490']]
            });
            // North pole (projection center)
            traces.push({
                type: 'scatter3d', mode: 'markers',
                x: [0], y: [0], z: [1],
                marker: { color: '#d97706', size: 6, symbol: 'diamond' }, name: 'N'
            });
            // Point p on sphere
            traces.push({
                type: 'scatter3d', mode: 'markers',
                x: [sp.p_3d[0]], y: [sp.p_3d[1]], z: [sp.p_3d[2]],
                marker: { color: '#a3e635', size: 7 }, name: 'p'
            });
            // Stereographic image on the plane
            traces.push({
                type: 'scatter3d', mode: 'markers',
                x: [sp.u], y: [sp.v], z: [0],
                marker: { color: '#0e7490', size: 7, symbol: 'x' }, name: 'φ_N(p)'
            });
            // Projection ray N → p → plane
            traces.push({
                type: 'scatter3d', mode: 'lines',
                x: [0, sp.p_3d[0], sp.u], y: [0, sp.p_3d[1], sp.v], z: [1, sp.p_3d[2], 0],
                line: { color: '#d97706', width: 4, dash: 'dash' }
            });
            Plotly.newPlot('plotly-div', traces, layout_base);

        } else if (activeSectionId === "mobius" && data.mobius_mesh) {
            // Möbius band with the two overlap components shaded differently
            const m = data.mobius_mesh;
            const mob = data.mobius;

            traces.push({
                type: 'surface', x: m.x, y: m.y, z: m.z,
                surfacecolor: m.c, cmin: 0, cmax: 1,
                opacity: 0.75, showscale: false,
                colorscale: [[0, '#14532d'], [1, '#0e4a6a']]
            });
            // Seam u = 0 ~ 2π, where the identification (u+2π, w) ~ (u, −w) acts
            traces.push({
                type: 'scatter3d', mode: 'lines',
                x: mob.seam.x, y: mob.seam.y, z: mob.seam.z,
                line: { color: '#d97706', width: 8 }
            });
            // Marker at the chosen point
            traces.push({
                type: 'scatter3d', mode: 'markers',
                x: [mob.p_3d[0]], y: [mob.p_3d[1]], z: [mob.p_3d[2]],
                marker: { color: '#a3e635', size: 7 }
            });
            Plotly.newPlot('plotly-div', traces, layout_base);

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
        if (activeSectionId === "lie_bracket" && data.gap) {
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
            
        } else if (activeSectionId === "covectors" && data.covector) {
            // df as a stack of level lines inside the tangent plane at p
            const e = data.ellipsoid_mesh;
            const cv = data.covector;
            traces.push({ type: 'surface', x: e.x, y: e.y, z: e.z, opacity: 0.2, showscale: false, colorscale: [[0, '#0e2010'], [1, '#2a5030']] });
            traces.push({ type: 'surface', x: cv.plane_x, y: cv.plane_y, z: cv.plane_z, opacity: 0.35, showscale: false, colorscale: [[0, '#0a1a2a'], [1, '#0e4a6a']] });
            cv.lines.forEach(l => {
                traces.push({
                    type: 'scatter3d', mode: 'lines',
                    x: l.x, y: l.y, z: l.z,
                    line: { color: '#0e7490', width: l.k === 0 ? 6 : 3 }
                });
            });
            traces.push({ type: 'scatter3d', mode: 'markers', x: [cv.p[0]], y: [cv.p[1]], z: [cv.p[2]], marker: { color: '#a3e635', size: 7 } });
            traces.push({ type: 'scatter3d', mode: 'lines', x: [cv.p[0], cv.p[0] + cv.v_3d[0]], y: [cv.p[1], cv.p[1] + cv.v_3d[1]], z: [cv.p[2], cv.p[2] + cv.v_3d[2]], line: { color: '#d97706', width: 6 } });
            Plotly.newPlot('plotly-div', traces, layout_base);

        } else if (activeSectionId === "differential" && data.invariance) {
            // Chart invariance: the 3D picture is chart-independent by design
            const e = data.ellipsoid_mesh;
            const inv = data.invariance;
            traces.push({ type: 'surface', x: e.x, y: e.y, z: e.z, opacity: 0.25, showscale: false, colorscale: [[0, '#0e2010'], [1, '#2a5030']] });
            // v-coordinate curve through p — the same curve in both charts
            traces.push({
                type: 'scatter3d', mode: 'lines',
                x: inv.curve.map(q => q[0]), y: inv.curve.map(q => q[1]), z: inv.curve.map(q => q[2]),
                line: { color: '#0e7490', width: 4, dash: 'dot' }
            });
            traces.push({ type: 'scatter3d', mode: 'markers', x: [inv.p[0]], y: [inv.p[1]], z: [inv.p[2]], marker: { color: '#a3e635', size: 7 } });
            traces.push({ type: 'scatter3d', mode: 'lines', x: [inv.p[0], inv.p[0] + inv.v_3d[0]], y: [inv.p[1], inv.p[1] + inv.v_3d[1]], z: [inv.p[2], inv.p[2] + inv.v_3d[2]], line: { color: '#d97706', width: 6 } });
            Plotly.newPlot('plotly-div', traces, layout_base);
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
            document.getElementById("plotly-div").innerHTML = "<div style='color: #4a6a40; text-align: center; margin-top: 100px; font-size: 1.2rem;'><span style='font-size: 3rem; margin-bottom: 20px; display: block;'>∑</span>See Algebra Workbench below for step-by-step Duality proof.</div>";
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
