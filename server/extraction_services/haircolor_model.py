import cv2
import numpy as np
import mediapipe as mp
from flask import request, jsonify
from sklearn.cluster import KMeans
import base64
from sklearn.mixture import GaussianMixture
from skimage import color

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1, refine_landmarks=True)

# Extend landmarks for more precise detection
left_eye_indices = [33, 133, 160, 158, 159, 144, 385, 386]  # Adding more to capture the iris area
skin_indices = [10, 152, 234, 454, 323, 93, 61, 291]  # Extended area to capture more skin tones

def decode_base64_image(base64_string):
    image_bytes = base64.b64decode(base64_string)
    image_array = np.frombuffer(image_bytes, dtype=np.uint8)
    return cv2.imdecode(image_array, cv2.IMREAD_COLOR)

def get_dominant_color(image, landmarks, indices, w, h):
    pixels = [image[int(landmarks[idx].y * h), int(landmarks[idx].x * w)] for idx in indices]
    pixels = np.array(pixels)
    kmeans = KMeans(n_clusters=1, random_state=0).fit(pixels)
    return kmeans.cluster_centers_[0]

def categorize_eye_color(rgb):
    r, g, b = rgb
    if r < 50 and g < 50 and b < 50:
        return "Black"
    elif r > 100 and g > 80 and b < 60:
        return "Brown"
    elif r < 100 and g > 100 and b > 90:
        return "Green"
    elif r > 100 and g < 80 and b > 90:
        return "Blue"
    elif (r > 90 and g > 70 and b > 50) and (r < 160 and g < 140 and b < 100):
        return "Hazel"
    return "Black"

def categorize_skin_color(rgb):
    # Convert to HSV for better skin tone classification
    hsv = cv2.cvtColor(np.uint8([[rgb]]), cv2.COLOR_RGB2HSV)[0][0]
    h, s, v = hsv

    if v > 180 and s > 70:
        return "Fair"
    elif v > 150 and s > 60:
        return "Medium"
    elif v > 120 and s > 50:
        return "Tan"
    else:
        return "Dark"

def extract_haircolor():
    try:
        data = request.json
        if 'image' not in data:
            return jsonify({"error": "No image data provided"}), 400

        # Decode the image from base64
        image_base64 = data['image']
        image = decode_base64_image(image_base64)

        if image is None:
            return jsonify({"error": "Invalid image"}), 400

        # Convert to RGB for processing
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = face_mesh.process(rgb_image)

        if not results.multi_face_landmarks:
            return jsonify({"error": "No face detected"}), 400

        face_landmarks = results.multi_face_landmarks[0]
        h, w, _ = rgb_image.shape

        # Extract dominant color
        eye_color = get_dominant_color(rgb_image, face_landmarks.landmark, left_eye_indices, w, h)
        skin_color = get_dominant_color(rgb_image, face_landmarks.landmark, skin_indices, w, h)

        # Return the extracted colors as a JSON response
        return jsonify({
            "eye_color": categorize_eye_color(eye_color),
            "skin_color": categorize_skin_color(skin_color)
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
