import http.server
import socketserver
import json
import urllib.parse
import geometry

PORT = 8099

class GeometryRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Allow cross-origin requests for easier development and testing
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        # Handle CORS preflight requests
        self.send_response(200, "OK")
        self.end_headers()

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        query_params = urllib.parse.parse_qs(parsed_url.query)

        # Intercept API calls
        if path.startswith('/api/'):
            self.handle_api(path, query_params)
        else:
            # Fallback to serving static files
            super().do_GET()

    def handle_api(self, path, params):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()

        response_data = {"error": "Endpoint not found"}

        try:
            if path == '/api/hausdorff':
                radius_a = float(params.get('radius_a', [1.0])[0])
                radius_b = float(params.get('radius_b', [1.0])[0])
                h_data = geometry.compute_hausdorff(radius_a, radius_b)
                response_data = {
                    "hausdorff": h_data,
                    "stats": {
                        "haus_status": h_data["status"]
                    }
                }
                
            elif path == '/api/locally_euclidean':
                cap_radius = float(params.get('cap_radius', [1.0])[0])
                le_data = geometry.compute_locally_euclidean(cap_radius)
                response_data = {
                    "locally_euclidean": le_data,
                    "stats": {
                        "max_deviation": f"{le_data['max_deviation']:.4f}"
                    }
                }
                
            elif path == '/api/transition_maps':
                u_n = float(params.get('u_n', [0.5])[0])
                v_n = float(params.get('v_n', [0.5])[0])
                tm_data = geometry.compute_charts_workbench(u_n, v_n)
                response_data = {
                    "transition": tm_data,
                    "workbench": tm_data.get("workbench"),
                    "stats": {
                        "trans_point": f"({tm_data['u_S']:.2f}, {tm_data['v_S']:.2f})"
                    }
                }

            elif path == '/api/charts':
                chart_type = params.get('chart_type', ['north'])[0]
                limit = float(params.get('limit', [3.0])[0])
                # Return standard sphere mesh for background and chart projection grid
                sx, sy, sz = geometry.get_sphere_mesh()
                grid_data = geometry.get_stereographic_grid(chart_type, limit=limit)
                response_data = {
                    "sphere_mesh": {"x": sx, "y": sy, "z": sz},
                    "grid_mesh": grid_data
                }
                # Add workbench data: compute transition map at a sample point
                # Use center of grid as the sample point
                sample_u = limit * 0.5
                sample_v = limit * 0.5
                if sample_u != 0 or sample_v != 0:
                    wb_data = geometry.compute_charts_workbench(sample_u, sample_v)
                    response_data["workbench"] = wb_data.get("workbench")

            elif path == '/api/lie_bracket':
                eps = float(params.get('epsilon', [0.8])[0])
                response_data = geometry.compute_lie_bracket(eps)

            elif path == '/api/tangent_space':
                u = float(params.get('u', [0.785])[0])  # ~pi/4
                v = float(params.get('v', [0.5])[0])
                vx = float(params.get('vx', [0.5])[0])
                vy = float(params.get('vy', [-0.4])[0])
                
                ex, ey, ez = geometry.get_ellipsoid_mesh()
                tangent_data = geometry.compute_tangent_space(u, v, vx, vy)
                
                response_data = {
                    "ellipsoid_mesh": {"x": ex, "y": ey, "z": ez},
                    "tangent_data": tangent_data
                }

            elif path == '/api/covector_planes':
                alpha = float(params.get('alpha', [1.5])[0])
                vx = float(params.get('vx', [1.0])[0])
                vy = float(params.get('vy', [1.0])[0])
                response_data = geometry.compute_covector_planes(alpha, vx, vy)

            elif path == '/api/differential':
                vx = float(params.get('vx', [0.8])[0])
                vy = float(params.get('vy', [0.3])[0])
                response_data = geometry.compute_differential(vx, vy)

            elif path == '/api/pushforward_map':
                u = float(params.get('u', [1.5])[0])
                v = float(params.get('v', [0.8])[0])
                du = float(params.get('du', [0.6])[0])
                dv = float(params.get('dv', [0.4])[0])
                
                tx, ty, tz = geometry.get_torus_mesh()
                pf_data = geometry.compute_pushforward_map(u, v, du, dv)
                
                response_data = {
                    "torus_mesh": {"x": tx, "y": ty, "z": tz},
                    "pushforward": pf_data
                }

            elif path == '/api/pullback_map':
                u = float(params.get('u', [1.5])[0])
                v = float(params.get('v', [0.8])[0])
                
                tx, ty, tz = geometry.get_torus_mesh()
                pb_data = geometry.compute_pullback_map(u, v)
                
                response_data = {
                    "torus_mesh": {"x": tx, "y": ty, "z": tz},
                    "pullback": pb_data
                }

            elif path == '/api/pushforward':
                u = float(params.get('u', [1.5])[0])
                v = float(params.get('v', [0.8])[0])
                du = float(params.get('du', [0.6])[0])
                dv = float(params.get('dv', [0.4])[0])
                
                duality_data = geometry.compute_duality(u, v, du, dv)
                response_data = duality_data

            elif path == '/api/tensor_transform':
                alpha = float(params.get('alpha', [0.0])[0]) # rotation angle
                theta = float(params.get('theta', [0.5])[0]) # initial ellipse orientation
                a = float(params.get('a', [2.0])[0])
                b = float(params.get('b', [0.8])[0])
                
                transform_data = geometry.compute_tensor_transform(alpha, a, b, theta)
                response_data = transform_data

            elif path == '/api/metric':
                manifold = params.get('manifold', ['sphere'])[0]
                u = float(params.get('u', [1.0])[0])
                v = float(params.get('v', [1.0])[0])
                
                # We return metric details at (u,v) + Tissot indicatrix coordinates
                g, g_inv = geometry.get_metric_details(manifold, u, v)
                ellipse_u, ellipse_v = geometry.get_indicatrix_ellipse(manifold, u, v)
                
                # Get background surface mesh to plot on
                mesh = None
                if manifold == 'sphere':
                    mx, my, mz = geometry.get_sphere_mesh()
                    mesh = {"x": mx, "y": my, "z": mz}
                elif manifold == 'torus':
                    mx, my, mz = geometry.get_torus_mesh()
                    mesh = {"x": mx, "y": my, "z": mz}
                
                response_data = {
                    "g": g.tolist(),
                    "g_inv": g_inv.tolist(),
                    "ellipse_u": ellipse_u,
                    "ellipse_v": ellipse_v,
                    "mesh": mesh
                }

            elif path == '/api/parallel_transport':
                path_type = params.get('path_type', ['triangle'])[0]
                steps = int(params.get('steps', [80])[0])
                
                sx, sy, sz = geometry.get_sphere_mesh()
                transport_data = geometry.run_parallel_transport(path_type, steps)
                
                response_data = {
                    "sphere_mesh": {"x": sx, "y": sy, "z": sz},
                    "transport_data": transport_data
                }

            elif path == '/api/geodesic':
                manifold = params.get('manifold', ['sphere'])[0]
                start_u = float(params.get('start_u', [1.5])[0])
                start_v = float(params.get('start_v', [0.1])[0])
                vel_u = float(params.get('vel_u', [0.0])[0])
                vel_v = float(params.get('vel_v', [1.5])[0])
                t_max = float(params.get('t_max', [4.0])[0])
                
                # Background mesh
                mesh = None
                if manifold == 'sphere':
                    mx, my, mz = geometry.get_sphere_mesh()
                    mesh = {"x": mx, "y": my, "z": mz}
                else:
                    mx, my, mz = geometry.get_torus_mesh()
                    mesh = {"x": mx, "y": my, "z": mz}
                    
                geo_data = geometry.run_geodesic(manifold, [start_u, start_v], [vel_u, vel_v], t_max)
                
                response_data = {
                    "mesh": mesh,
                    "geodesic": geo_data
                }

            elif path == '/api/statistical_manifold':
                mu1 = float(params.get('mu1', [0.0])[0])
                sigma1 = float(params.get('sigma1', [1.0])[0])
                mu2 = float(params.get('mu2', [3.0])[0])
                sigma2 = float(params.get('sigma2', [2.0])[0])
                
                stat_data = geometry.run_statistical_manifold(mu1, sigma1, mu2, sigma2)
                response_data = stat_data

            elif path == '/api/levicivita':
                manifold = params.get('manifold', ['sphere'])[0]
                u = float(params.get('u', [1.0])[0])
                v = float(params.get('v', [1.5])[0])
                
                # Background mesh
                mesh = None
                if manifold == 'sphere':
                    mx, my, mz = geometry.get_sphere_mesh()
                    mesh = {"x": mx, "y": my, "z": mz}
                elif manifold == 'torus':
                    mx, my, mz = geometry.get_torus_mesh()
                    mesh = {"x": mx, "y": my, "z": mz}
                
                lc_data = geometry.compute_levicivita_workbench(manifold, u, v)
                lc_data["mesh"] = mesh
                response_data = lc_data

        except Exception as e:
            response_data = {"error": str(e)}

        self.wfile.write(json.dumps(response_data).encode('utf-8'))

if __name__ == '__main__':
    # Force socket reuse so we don't get "address already in use" errors during quick restarts
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), GeometryRequestHandler) as httpd:
        print(f"Serving Differential Geometry Course at http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
