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
    
    return image

# Function to detect lip shape
def detect_lip_shape(landmarks, w, h):
    # Using more points around the lips for more accurate shape detection
    lip_width = abs(landmarks[61].x - landmarks[291].x) * w  # Corner of the lips
    lip_height = abs(landmarks[13].y - landmarks[14].y) * h  # Center height of the lips
    upper_lip_height = abs(landmarks[0].y - landmarks[13].y) * h
    lower_lip_height = abs(landmarks[14].y - landmarks[17].y) * h

    lip_ratio = lip_height / lip_width
    upper_to_lower_ratio = upper_lip_height / lower_lip_height

    # Lip shape classification
    if lip_ratio > 0.4:
        return "Full Lips"
    elif lip_ratio <= 0.25:
        return "Thin Lips"
    elif 0.25 < lip_ratio <= 0.35 and upper_to_lower_ratio > 1.0:
        return "Round"
    elif lip_width > 0.5 and lip_ratio <= 0.3:
        return "Wide"
    else:
        return "Full Lips"

# Function to detect eyebrow shape
def detect_eyebrow_shape(landmarks, w, h):
    # Detecting features based on both eyebrows
    left_eyebrow_width = abs(landmarks[70].x - landmarks[55].x) * w
    right_eyebrow_width = abs(landmarks[300].x - landmarks[295].x) * w
    eyebrow_height = abs(landmarks[105].y - landmarks[66].y) * h
    eyebrow_symmetry = abs(left_eyebrow_width - right_eyebrow_width) / max(left_eyebrow_width, right_eyebrow_width)

    # Refined eyebrow classification based on symmetry and width
    if eyebrow_height > 0.25:
        return "Thick Eyebrows"
    elif eyebrow_height <= 0.15:
        return "Thin Eyebrows"
    elif eyebrow_height > 0.15 and eyebrow_height <= 0.25:
        return "Arched"
    else:
        return "Flat"

# Function to extract makeup features (eyebrow and lip shape)
def extract_makeup():
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

        # Resize the image and get the dimensions
        h, w, _ = image.shape
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # Process the image with Mediapipe FaceMesh
        results = face_mesh.process(rgb_image)
        if not results.multi_face_landmarks:
            return jsonify({"error": "No face detected"}), 400

        # Extract the landmarks for the first detected face
        face_landmarks = results.multi_face_landmarks[0]

        # Extract the lip and eyebrow shapes
        lip_shape = detect_lip_shape(face_landmarks.landmark, w, h)
        eyebrow_shape = detect_eyebrow_shape(face_landmarks.landmark, w, h)

        # Return the extracted shapes as a simplified output
        response = {
            "lip_shape": lip_shape,  # Only the string classification
            "eyebrow_shape": eyebrow_shape  # Only the string classification
        }
        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
