from flask import Flask, render_template
from flask import jsonify, redirect, url_for

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")


@app.route('/api/services')
def services():
    data = {
        'services': ['Grafana', 'Node-RED', 'Internal registry', 'Personal site', 'Prometheus']
    }
    return jsonify(data)


# Redirect legacy or direct /cards path back to root to keep URLs clean
@app.route('/cards')
def cards_redirect():
    return redirect(url_for('home'))

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 3000))
    app.run(debug=True, host="0.0.0.0", port=port)