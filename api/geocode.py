import json
from http.server import BaseHTTPRequestHandler
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, urlencode, urlparse
from urllib.request import Request, urlopen


GEOCODE_BASE = "https://nominatim.openstreetmap.org/search"
GEOCODE_CACHE = {}


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        incoming = parse_qs(parsed.query)
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
                    "User-Agent": "disaster-dashboard/1.0 (vercel)",
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
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
