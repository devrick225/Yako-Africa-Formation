"""Application de formation locale, sans donnees personnelles ni persistance."""
import json
import os
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse
from pathlib import Path

WEB = Path(__file__).with_name("web")
VERSION = os.getenv("APP_VERSION", "dev")
SERVICES = json.loads(Path(__file__).with_name("catalogue.json").read_text(encoding="utf-8"))

def response_for(path, fail=False):
    if path == "/api/info":
        return 200, {"version": VERSION, "environment": os.getenv("APP_ENV", "local"), "name": "YAKO AFRICA"}
    if path == "/health":
        return 200, {"status": "ok", "version": VERSION}
    if path == "/api/services":
        if fail:
            return 503, {"error": "incident pedagogique", "version": VERSION}
        return 200, {"services": SERVICES, "version": VERSION}
    return 404, {"error": "not found", "version": VERSION}

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        start = time.perf_counter()
        path = urlparse(self.path).path
        assets = {"/": ("index.html", "text/html; charset=utf-8"),
                  "/app.css": ("app.css", "text/css; charset=utf-8"),
                  "/app.js": ("app.js", "text/javascript; charset=utf-8")}
        if path in assets:
            filename, content_type = assets[path]
            body = (WEB / filename).read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(body)
            return
        status, payload = response_for(path, os.getenv("FAIL_BUSINESS", "0") == "1")
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
        print(json.dumps({"time": time.time(), "path": path, "status": status,
                          "duration_ms": round((time.perf_counter()-start)*1000, 2),
                          "version": VERSION}), flush=True)
    def log_message(self, format, *args):
        pass

if __name__ == "__main__":
    ThreadingHTTPServer((os.getenv("BIND_HOST", "127.0.0.1"),
                         int(os.getenv("PORT", "8000"))), Handler).serve_forever()
