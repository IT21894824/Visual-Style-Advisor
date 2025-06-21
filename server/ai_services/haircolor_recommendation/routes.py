# server/ai_services/haircolor_recommendation/routes.py

from flask import Blueprint, request, jsonify
import pandas as pd
from .model import predict_hair_color,evaluate

# Initialize Blueprint for ai_services
ai_services_haircolor_recommendation_bp = Blueprint('ai_services_haircolor_recommendation_bp', __name__)


hair_color_mapping = {
    "Soft Brown": "soft_brown",
    "Dark Brown": "dark_brown",
    "Light Blonde": "light_blonde",
    "Golden Blonde": "golden_blonde",
    "Copper Red": "copper_red",
    "Honey Brown": "honey_brown",
    "Ash Blonde": "ash_blonde",
    "Platinum Blonde": "platinum_blonde",
    "Silver": "silver",
    "Turquoise Blue": "turquoise_blue",
    "Neon Pink": "neon_pink",
    "Violet Purple": "violet_purple",
    "Caramel Ombre": "caramel_ombre",
    "Sunset Highlights": "sunset_highlights",
    "Icy Platinum Ombre": "icy_platinum_ombre"
}

@ai_services_haircolor_recommendation_bp.route('/haircolor_recommendation', methods=['POST'])
def haircolor_recommendation():
    try:
        # Convert input data to a DataFrame for a single entry (ensure it remains in the proper format)
        input_data = request.get_json()

        # Ensure data is present
        if not input_data:
            return jsonify({"error": "No input data provided"}), 400

        required_fields = ['eye_color',  'gender', 'hair_type', 'occasion', 'skin_color', 'image']
        missing_fields = [field for field in required_fields if field not in input_data]
        if missing_fields:
            return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

        # Predict hair color using the model
        results = predict_hair_color(input_data)

        return jsonify(results), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500




@ai_services_haircolor_recommendation_bp.route('/get_haircolor', methods=['POST'])
def get_haircolor():
    try:
        input_data = request.get_json()
        hair_color_name = input_data['Predicted Hair Color']
        image_base64 = input_data['Image']
        mapped_hair_color = hair_color_mapping.get(hair_color_name, "soft_brown")  # Default to 'soft_brown'
        # Convert input data to a DataFrame for a single entry (ensure it remains in the proper format)
        image = evaluate(input_path=None, input_base64=image_base64, mode=[mapped_hair_color])
        combined_response = {
            "image": image
        }


        return jsonify(combined_response), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    