from http.server import BaseHTTPRequestHandler
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, urlencode, urlparse
from urllib.request import Request, urlopen


API_BASE = "https://www.safetydata.go.kr/V2/api/DSSP-IF-00247"
DEFAULT_SERVICE_KEY = "79TC865LX2RE904U"


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
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)
