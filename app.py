import os
import json
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

LEASES_FILE = 'leases.json'

def load_leases():
    if not os.path.exists(LEASES_FILE):
        return []
    with open(LEASES_FILE, 'r') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

def save_leases(leases):
    with open(LEASES_FILE, 'w') as f:
        json.dump(leases, f, indent=4)


@app.route('/')
def index():
	return render_template('index.html')


@app.route('/contact')
def contact():
    return render_template('contactus.html')


@app.route('/about')
def about():
	return render_template('aboutus.html')


@app.route('/blog')
def blog():
    return render_template('blog.html')


@app.route('/map')
def map():
    return render_template('map.html')


@app.route('/api/leases', methods=['GET', 'POST'])
def api_leases():
    if request.method == 'GET':
        return jsonify(load_leases())
    
    if request.method == 'POST':
        data = request.json
        leases = load_leases()
        leases.append(data)
        save_leases(leases)
        return jsonify({"status": "success", "lease": data}), 201


if __name__ == '__main__':
	app.run(debug=True)

