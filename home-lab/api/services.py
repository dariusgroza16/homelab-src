import json

def handler(request):
    data = {
        "services": ["Grafana", "Node-RED", "Internal registry", "Personal site", "Prometheus"]
    }
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json; charset=utf-8"},
        "body": json.dumps(data),
    }
