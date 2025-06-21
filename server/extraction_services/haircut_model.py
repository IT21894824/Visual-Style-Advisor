import cv2
import numpy as np
import mediapipe as mp
from flask import request, jsonify
import base64

# Initialize Mediapipe FaceMesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1, refine_landmarks=True)


def decode_base64_image(base64_string):
    # Decode the base64 string into bytes
    image_bytes = base64.b64decode(base64_string)
    
    # Convert the byte data into a NumPy array
    image_array = np.frombuffer(image_bytes, dtype=np.uint8)
    
    # Decode the NumPy array into an image
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    
    # Return the image
    return image


# Refined face shape extraction function using more landmarks and additional logic
def detect_face_shape(landmarks, w, h):
    # Extract key landmark coordinates for face shape estimation
    jaw_width = abs(landmarks[234].x - landmarks[454].x) * w  # Jaw width
    face_height = abs(landmarks[152].y - landmarks[9].y) * h  # Face height (chin to forehead)
    cheekbone_width = abs(landmarks[93].x - landmarks[323].x) * w  # Cheekbone width
    forehead_width = abs(landmarks[10].x - landmarks[338].x) * w  # Forehead width

    # More granular classification based on ratios
    jaw_to_face_ratio = jaw_width / face_height
    cheekbone_to_face_ratio = cheekbone_width / face_height
    forehead_to_face_ratio = forehead_width / face_height

    # Classify face shape based on these refined ratios
    if jaw_to_face_ratio > 0.85 and cheekbone_to_face_ratio > 0.7:
        return "Round"
    elif 0.75 <= jaw_to_face_ratio <= 0.85 and 0.55 <= cheekbone_to_face_ratio <= 0.65:
        return "Oval"
    elif jaw_to_face_ratio > 0.9 and cheekbone_to_face_ratio < 0.7:
        return "Square"
    elif cheekbone_to_face_ratio > forehead_to_face_ratio and jaw_to_face_ratio < 0.75:
        return "Heart"
    elif cheekbone_to_face_ratio > jaw_to_face_ratio and cheekbone_to_face_ratio > forehead_to_face_ratio:
        return "Diamond"
    else:
        return "Round"  # If no clear shape can be classified


def extract_haircut():
    try:
        # Retrieve the incoming request data
        data = request.json
        if 'image' not in data:
            return jsonify({"error": "No image data provided"}), 400

        # Decode the image from base64 format
        image_base64 = data['image']
        image = decode_base64_image(image_base64)

        if image is None:
            return jsonify({"error": "Invalid image"}), 400

        # Resize the image for consistent processing
        h, w, _ = image.shape
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # Process the image using Mediapipe FaceMesh
        results = face_mesh.process(rgb_image)
        if not results.multi_face_landmarks:
            return jsonify({"error": "No face detected"}), 400

        # Extract landmarks for the first face (assuming only one face)
        face_landmarks = results.multi_face_landmarks[0]

        # Compute the face shape classification
        face_shape = detect_face_shape(face_landmarks.landmark, w, h)

        # Return the result as a JSON response
        response = {"face_shape": face_shape}
        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
