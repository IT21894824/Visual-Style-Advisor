from flask import Blueprint, request, jsonify
from .model import predict_makeup

# Initialize Blueprint for ai_services
ai_services_makeup_recommendation_bp = Blueprint('ai_services_makeup_recommendation_bp', __name__)

@ai_services_makeup_recommendation_bp.route('/makeup_recommendation', methods=['POST'])
def makeup_prediction():
    try:
        # Get the JSON data from the request
        input_data = request.get_json()

        # Ensure data is present
        if not input_data:
            return jsonify({"error": "No input data provided"}), 400

        # Ensure all necessary fields are in the request data
        required_fields = [
            'eye_color',
            'gender',  
            'hair_type', 
            'look_type',
            'multi_tonal',  
            'occasion',
            'eyebrow_shape',
            'face_shape', 
            'lip_shape', 
            'skin_color'
        ]        
        missing_fields = [field for field in required_fields if field not in input_data]
        
        if missing_fields:
            return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

        # Call the prediction function
        result = predict_makeup(input_data)

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
