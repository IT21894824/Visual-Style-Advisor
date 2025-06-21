import joblib
import pandas as pd
import os
import sqlite3
import cv2
import mediapipe as mp
import numpy as np
import base64
from PIL import Image
import io
import insightface
from insightface.app import FaceAnalysis
import matplotlib.pyplot as plt

# Load the trained model, label encoders, and scaler
loaded_model = joblib.load("ai_services/haircut_recommendation/model_files/haircut_recommendation_model.pkl")
loaded_label_encoders = joblib.load("ai_services/haircut_recommendation/model_files/label_encoders.pkl")

mp_face_mesh = mp.solutions.face_mesh
mp_selfie_segmentation = mp.solutions.selfie_segmentation.SelfieSegmentation(model_selection=1)

# Directory for generated haircuts
HAIR_STYLES_DIR = "hair_styles"
os.makedirs(HAIR_STYLES_DIR, exist_ok=True)

def get_haircut_details_from_db(predicted_class,image_base64):
    try:
        # Connect to the SQLite database
        db_path = f"instance/users.db"
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Query to fetch haircut details based on predicted class
        query = """SELECT gender, haircut_name, description 
                   FROM haircut_model WHERE id = ?"""
        cursor.execute(query, (int(predicted_class),))
        result = cursor.fetchone()
        applied_image = get_haircut(image_base64, result[0], result[1])
        if result:    
            if result[0] == 'M':
            
                base64_image_male = applied_image
            
                base64_image_female = "null"
            
            else:
            
                base64_image_male = "null"
            
                base64_image_female = applied_image

            # Return JSON-serializable haircut details
            haircut_details = {
                "haircut_name": result[1],
                "description": result[2],
                "image_for_male": base64_image_male,
                "image_for_female": base64_image_female
            }
            return haircut_details
        else:
            return {"error": "Haircut details not found."}

    except Exception as e:
        print(f"Error during DB query: {e}")
        return {"error": "Error fetching haircut details from the database."}
    finally:
        conn.close()



def predict_haircut(json_data):
    """
    Accepts single-record JSON input, processes it, and returns a haircut prediction with details from the database.
    """
    try:
        # Extract the image from json_data and store it for further processing
        image_base64 = json_data.pop("image", None)  # Remove image from json_data and store it in image_base64


        # Convert the remaining JSON input (without the image) to a single-row DataFrame
        new_data = pd.DataFrame([json_data])  

        # Apply encoding for categorical features
        for column in new_data.columns:
            if column in loaded_label_encoders:
                le = loaded_label_encoders[column]
                
                # Handle unseen categories by replacing them with the most frequent class
                new_data[column] = new_data[column].apply(lambda x: x if x in le.classes_ else le.classes_[0])
                
                # Transform using saved encoder
                new_data[column] = le.transform(new_data[column])

        # Ensure all features are numeric
        new_data = new_data.astype('float')

        # Predict haircut recommendations using the trained model
        try:
            prediction = loaded_model.predict(new_data)[0]  # Single prediction
        except ValueError as e:
            print(f"Error during prediction: {e}")
            return {"error": f"Prediction error: {str(e)}"}

        # Fetch haircut details from the database based on the prediction
        haircut_details = get_haircut_details_from_db(prediction,image_base64)
        result = {
                "Haircut Name": haircut_details["haircut_name"],
                "Description": haircut_details["description"],
                "Image for Male": haircut_details["image_for_male"],
                "Image for Female": haircut_details["image_for_female"]
            }        
        return result

    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}


    except Exception as e:
        # Handle exceptions and return an error message
        print(f"Error during prediction: {e}")
        return {"error": str(e)}

def initialize_models():
    """Initialize the face analysis app and face swapper model."""
    app = FaceAnalysis(name='buffalo_l')
    app.prepare(ctx_id=0, det_size=(640, 640))
    
    swapper = insightface.model_zoo.get_model('ai_services/haircut_recommendation/model_files/inswapper_128.onnx', 
                                              download=False, 
                                              download_zip=False)
    return app, swapper

def swap_faces(source_img, target_img, app, swapper):
    """Swaps faces between the source and target images and returns the swapped image."""
    
    # Detect faces
    source_faces = app.get(source_img)
    target_faces = app.get(target_img)

    if len(source_faces) == 0 or len(target_faces) == 0:
        raise ValueError("No face detected in one or both images.")

    source_face = source_faces[0]  # Take the first detected face
    target_face = target_faces[0]

    # Swap face from source to target
    swapped_img = swapper.get(target_img.copy(), target_face, source_face, paste_back=True)
    
    return swapped_img

def mainSwap(source_img_base64, target_img_base64):
    """Performs face swapping and returns the swapped image as a Base64 string."""

    # Decode Base64 images
    source_img_data = base64.b64decode(source_img_base64)
    target_img_data = base64.b64decode(target_img_base64)

    source_img_array = np.frombuffer(source_img_data, np.uint8)
    target_img_array = np.frombuffer(target_img_data, np.uint8)

    source_img = cv2.imdecode(source_img_array, cv2.IMREAD_COLOR)
    target_img = cv2.imdecode(target_img_array, cv2.IMREAD_COLOR)

    if source_img is None or target_img is None:
        raise ValueError("Error decoding Base64 images.")

    # Initialize models
    app, swapper = initialize_models()
    
    # Perform face swap
    swapped_img = swap_faces(source_img, target_img, app, swapper)

    # Encode the swapped image back to Base64
    _, buffer = cv2.imencode('.png', swapped_img)
    swapped_img_base64 = base64.b64encode(buffer).decode('utf-8')

    return swapped_img_base64

def get_haircut(base64_image, gender, haircut_name):
    """Applies a haircut by swapping the hair region from a haircut template onto the input image."""
    
    # Load the haircut image (as Base64)
    hair_image_path = f"ai_services/haircut_recommendation/images/{gender}-{haircut_name}.png"
    
    with open(hair_image_path, "rb") as image_file:
        haircut_base64 = base64.b64encode(image_file.read()).decode('utf-8')

    # Perform face swap to apply the haircut
    final_image_base64 = mainSwap(base64_image, haircut_base64)

    print("Haircut applied successfully!")

    return final_image_base64