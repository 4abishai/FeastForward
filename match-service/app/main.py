from flask import Flask, request, jsonify
from app.service.llm_service import get_best_match

app = Flask(__name__)

@app.route("/match/getBest", methods=["POST"])
def get_best():
    """API endpoint to get the best recipient match"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        result = get_best_match(data)

        if "error" in result:
            return jsonify(result), 400

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def handle_root():
    return jsonify(True), 200
