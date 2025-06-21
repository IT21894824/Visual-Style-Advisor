from flask import Blueprint, request,Response, jsonify
from .haircolor_model import extract_haircolor
from .haircut_model import extract_haircut
from .makeup_model import extract_makeup

extraction_services_bp = Blueprint('extraction_services', __name__)

@extraction_services_bp.route('/image_extract/haircolor_model', methods=['POST'])
def haircolor_model():
    return extract_haircolor()

@extraction_services_bp.route('/image_extract/haircut_model', methods=['POST'])
def haircut_model():
    return extract_haircut()

@extraction_services_bp.route('/image_extract/makeup_model', methods=['POST'])
def makeup_model():
    return extract_makeup()


@extraction_services_bp.route('/image_extract', methods=['POST'])
def extract_all_models():
    try:
        # Extract hair color
        haircolor_response = extract_haircolor()
        if isinstance(haircolor_response, tuple):
            haircolor_response = haircolor_response[0]  # Extract data if returned as a tuple
        # Ensure the response is in JSON format
        if isinstance(haircolor_response, Response):
            haircolor_response = haircolor_response.get_json()

        # Extract face shape (haircut)
        haircut_response = extract_haircut()
        if isinstance(haircut_response, tuple):
            haircut_response = haircut_response[0]
        if isinstance(haircut_response, Response):
            haircut_response = haircut_response.get_json()

        # Extract makeup details (eyebrow and lip shape)
        makeup_response = extract_makeup()
        if isinstance(makeup_response, tuple):
            makeup_response = makeup_response[0]
        if isinstance(makeup_response, Response):
            makeup_response = makeup_response.get_json()

        data = request.json
        if 'image' not in data:
            return jsonify({"error": "No image data provided"}), 400

        # Decode the image from base64 format
        image_base64 = data['image']
        # Combine all results into one response
        combined_response = {
            "haircolor": haircolor_response,
            "haircut": haircut_response,
            "makeup": makeup_response,
            "image": image_base64
        }

        # Return the combined response
        return jsonify(combined_response), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
