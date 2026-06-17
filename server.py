import json
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, urlencode, urlparse
from urllib.request import Request, urlopen


API_BASE = "https://www.safetydata.go.kr/V2/api/DSSP-IF-00247"
GEOCODE_BASE = "https://nominatim.openstreetmap.org/search"
DEFAULT_SERVICE_KEY = "79TC865LX2RE904U"
HOST = "127.0.0.1"
PORT = 8000
GEOCODE_CACHE = {}


class DisasterDashboardHandler(SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/messages":
            self.proxy_messages(parsed.query)
            return
        if parsed.path == "/api/geocode":
            self.proxy_geocode(parsed.query)
            return
        super().do_GET()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def proxy_messages(self, query):
        incoming = parse_qs(query)
        params = {
            "serviceKey": incoming.get("serviceKey", [DEFAULT_SERVICE_KEY])[0],
            "numOfRows": incoming.get("numOfRows", ["100"])[0],
            "pageNo": incoming.get("pageNo", ["1"])[0],
            "returnType": incoming.get("returnType", ["json"])[0],
            "crtDt": incoming.get("crtDt", [""])[0],
        }
        if incoming.get("rgnNm", [""])[0]:
            params["rgnNm"] = incoming["rgnNm"][0]

        target_url = f"{API_BASE}?{urlencode(params)}"
        request = Request(target_url, headers={"User-Agent": "disaster-dashboard/1.0"})

        try:
            with urlopen(request, timeout=12) as response:
                payload = response.read()
                status = response.status
        except HTTPError as error:
            payload = error.read()
            status = error.code
        except URLError as error:
            payload = f'{{"error":"{str(error.reason)}"}}'.encode("utf-8")
            status = 502

        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def proxy_geocode(self, query):
        incoming = parse_qs(query)
        region = incoming.get("region", [""])[0].strip()
        if not region:
            self.send_json({"error": "region is required"}, 400)
            return

        if region in GEOCODE_CACHE:
            self.send_json(GEOCODE_CACHE[region])
            return

        results = []
        last_error = None
        for candidate in (f"{region}, South Korea", f"{region}, Korea", region):
            params = {
                "format": "jsonv2",
                "limit": "1",
                "countrycodes": "kr",
                "q": candidate,
            }
            target_url = f"{GEOCODE_BASE}?{urlencode(params)}"
            request = Request(
                target_url,
                headers={
                    "User-Agent": "disaster-dashboard/1.0 (local development)",
                    "Accept": "application/json",
                },
            )

            try:
                with urlopen(request, timeout=8) as response:
                    results = json.loads(response.read().decode("utf-8"))
            except (HTTPError, URLError, TimeoutError, json.JSONDecodeError) as error:
                last_error = error
                continue

            if results:
                break

        if not results and last_error:
            self.send_json({"error": str(last_error)}, 502)
            return
        if not results:
            self.send_json({"error": "not found"}, 404)
            return

        first = results[0]
        payload = {
            "region": region,
            "lat": float(first["lat"]),
            "lng": float(first["lon"]),
            "displayName": first.get("display_name", region),
        }
        GEOCODE_CACHE[region] = payload
        self.send_json(payload)

    def send_json(self, payload, status=200):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    server = ThreadingHTTPServer((HOST, PORT), DisasterDashboardHandler)
    print(f"Disaster dashboard running at http://{HOST}:{PORT}")
    server.serve_forever()
