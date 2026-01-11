from pathlib import Path
import json

def handler(request):
    """Serve the main HTML page."""
    base = Path(__file__).resolve().parent.parent
    html_path = base / "templates" / "index.html"
    if not html_path.exists():
        return {"statusCode": 500, "body": "index.html not found"}
    html = html_path.read_text(encoding="utf-8")
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "text/html; charset=utf-8"},
        "body": html,
    }
