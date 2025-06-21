from flask import Blueprint, request, jsonify
from .model import predict_haircut,get_haircut
import cv2
import numpy as np
import base64
# Initialize Blueprint for ai_services
ai_services_haircut_recommendation_bp = Blueprint('ai_services_haircut_recommendation_bp', __name__)

@ai_services_haircut_recommendation_bp.route('/haircut_recommendation', methods=['POST'])
def haircut_prediction():
    try:
        # Get the JSON data from the request
        input_data = request.get_json()

        # Ensure data is present
        if not input_data:
            return jsonify({"error": "No input data provided"}), 400

        # Ensure all necessary fields are in the request data
        required_fields = ['Gender',  'Hair Type', 'Face Shape', 'Look Type', 'Occasion', 'image']
        missing_fields = [field for field in required_fields if field not in input_data]
        
        if missing_fields:
            return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

        # Call the prediction function
        result = predict_haircut(input_data)

        return jsonify(result),200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
