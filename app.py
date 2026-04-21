"""
AlgoLab Backend - Flask API
Provides sorting algorithm analysis and list vs set comparison endpoints.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import time
from algorithms.sorting import run_algorithm
from algorithms.list_vs_set import (
    membership_check,
    duplicate_removal,
    common_elements_comparison
)

app = Flask(__name__)
CORS(app)


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "message": "AlgoLab API running"})


@app.route('/sort', methods=['POST'])
def sort():
    """
    Sort an array using one or two selected algorithms.
    Input: { array: [...], algorithms: ["bubble", "merge"] }
    Output: { results: { algo_name: { time_ms, comparisons, swaps } } }
    """
    data = request.get_json()

    if not data or 'array' not in data or 'algorithms' not in data:
        return jsonify({"error": "Missing 'array' or 'algorithms' in request body"}), 400

    arr = data['array']
    algorithms = data['algorithms']

    if not isinstance(arr, list) or len(arr) == 0:
        return jsonify({"error": "Array must be a non-empty list"}), 400

    if not all(isinstance(x, (int, float)) for x in arr):
        return jsonify({"error": "Array must contain only numbers"}), 400

    if len(arr) > 500:
        return jsonify({"error": "Array size must not exceed 500"}), 400

    if not isinstance(algorithms, list) or len(algorithms) == 0:
        return jsonify({"error": "At least one algorithm must be specified"}), 400

    valid_algorithms = ["bubble", "selection", "insertion", "merge", "quick", "heap", "radix"]
    for algo in algorithms:
        if algo not in valid_algorithms:
            return jsonify({"error": f"Unknown algorithm: '{algo}'"}), 400

    results = {}
    for algo in algorithms:
        result = run_algorithm(algo, arr.copy())
        results[algo] = result

    return jsonify({"results": results})


@app.route('/list-vs-set', methods=['POST'])
def list_vs_set():
    """
    Perform list vs set analysis operations.
    Input: { operation: "membership"|"duplicates"|"common", data: {...} }
    Output: depends on operation
    """
    data = request.get_json()

    if not data or 'operation' not in data or 'data' not in data:
        return jsonify({"error": "Missing 'operation' or 'data' in request body"}), 400

    operation = data['operation']
    op_data = data['data']

    if operation == 'membership':
        lst = op_data.get('list', [])
        target = op_data.get('target')
        if not lst or target is None:
            return jsonify({"error": "Provide 'list' and 'target'"}), 400
        result = membership_check(lst, target)

    elif operation == 'duplicates':
        lst = op_data.get('list', [])
        if not lst:
            return jsonify({"error": "Provide 'list'"}), 400
        result = duplicate_removal(lst)

    elif operation == 'common':
        list_a = op_data.get('list_a', [])
        list_b = op_data.get('list_b', [])
        if not list_a or not list_b:
            return jsonify({"error": "Provide 'list_a' and 'list_b'"}), 400
        result = common_elements_comparison(list_a, list_b)

    else:
        return jsonify({"error": f"Unknown operation: '{operation}'"}), 400

    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
