# server/ai_services/haircolor_recommendation/model.py

import joblib
import pandas as pd
import xgboost as xgb
import numpy as np
import os
import sqlite3
from .model_files.model import BiSeNet
import torch
import os.path as osp
from PIL import Image
import torchvision.transforms as transforms
import cv2
import base64
# Load the trained model, label encoders, and scaler
model = joblib.load("ai_services/haircolor_recommendation/model_files/hair_color_model_xgb.pkl")
label_encoders = joblib.load("ai_services/haircolor_recommendation/model_files/label_encoders.pkl")
scaler = joblib.load("ai_services/haircolor_recommendation/model_files/scaler.pkl")

# Hair color mapping dictionary
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

def get_haircolor_details_from_db(predicted_class_id, image_base64):
    try:
        # Connect to the SQLite database
        db_path = "instance/users.db"
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Query to fetch hair color details
        query = """SELECT hair_color_name, description FROM haircolor_model WHERE id = ?"""
        cursor.execute(query, (predicted_class_id,))
        result = cursor.fetchone()

        if result:
            hair_color_name, description = result
            # Check if the hair color is in the mapping dictionary
            if hair_color_name not in hair_color_mapping:
                print(f"Warning: '{hair_color_name}' not found in mapping. Defaulting to 'soft_brown'.")
                mapped_hair_color = "soft_brown"  # Default to soft_brown if not found
            else:
                mapped_hair_color = hair_color_mapping[hair_color_name]
            
            # Apply the hair color transformation
            image = evaluate(input_path=None, input_base64=image_base64, mode=[mapped_hair_color])
            # Return the details
            hair_color_details = {
                "hair_color_name": hair_color_name,
                "description": description,
                "image": image,  # Base64 of processed image
            }
            return hair_color_details
        else:
            print(f"No result found for predicted_class_id: {predicted_class_id}")
            return {"error": "Hair color details not found."}
    except Exception as e:
        print(f"Error during DB query: {e}")
        return {"error": "Error fetching hair color details from the database."}
    finally:
        conn.close()




def predict_hair_color(json_data):
    """
    Preprocess input data, make prediction, and return the result for a single input.
    """
    # Extract the image from json_data and store it for further processing
    image_base64 = json_data.pop("image", None)  # Remove image from json_data and store it in image_base64

    # Convert the remaining JSON input (without the image) to a single-row DataFrame
    input_data = pd.DataFrame([json_data])  

    try:
        # Encode categorical features using the saved label encoders
        for column in input_data.columns:
            if column in label_encoders:  # Ensure the column is in the label encoders
                input_data[column] = input_data[column].map(
                    lambda s: label_encoders[column].classes_.tolist().index(s) 
                    if s in label_encoders[column].classes_ else 0
                )  # 0 as default for unseen values

        # Feature Engineering: Adding interaction feature 'Skin_Hair_Type'
        input_data['Skin_Hair_Type'] = input_data['skin_color'].astype(str) + "_" + input_data['hair_type'].astype(str)

        # Encode the interaction feature 'Skin_Hair_Type' if encoder exists
        if 'Skin_Hair_Type' in label_encoders:
            input_data['Skin_Hair_Type'] = label_encoders['Skin_Hair_Type'].transform(input_data['Skin_Hair_Type'].values)
        else:
            print("Warning: No encoder found for 'Skin_Hair_Type'")

        # Prepare the features for prediction
        X_test = input_data.copy()

        # Scale the features using the saved scaler
        X_test_scaled = scaler.transform(X_test)

        # Prepare the data for XGBoost (DMatrix format)
        dtest = xgb.DMatrix(X_test_scaled)

        # Make predictions
        y_pred = model.predict(dtest)

        # Decode the predicted Hair Color ID back to its original label
        predicted_class_id = int(y_pred[0])
        # Get the hair color details from the database (Optional)
        hair_color_details = get_haircolor_details_from_db(predicted_class_id, image_base64)

        # Prepare the response with the predicted hair color details
        result = {
            "Predicted Hair Color": hair_color_details["hair_color_name"],  # Correct reference to 'hair_color_name'
            "Description": hair_color_details["description"],
            "Image": hair_color_details["image"]
        }

        return result
    except Exception as e:
        print(f"Error during prediction: {e}")
        return {"error": "Error making prediction."}



# Similarity function remains unchanged
def similar(G1, B1, R1, G2, B2, R2):
    ar = []
    if G2 > 30:
        ar.append(1000. * G1 / G2)
    if B2 > 30:
        ar.append(1000. * B1 / B2)
    if R2 > 30:
        ar.append(1000. * R1 / R2)
    if len(ar) < 1:
        return False
    if min(ar) == 0:
        return False
    br = max(R1, G1, B1) / max(G2, B2, R2)
    return max(ar) / min(ar) < 1.55 and br > 0.7 and br < 1.4

# CFAR function remains unchanged
def CFAR(G, B, R, g, b, r, pro, bri):
    ar = []
    if g > 30:
        ar.append(G / g)
    if b > 30:
        ar.append(B / b)
    if r > 30:
        ar.append(R / r)
    if len(ar) == 0:
        return True
    if bri > 120:
        return max(ar) / min(ar) < 2
    if bri < 70:
        return max(ar) / min(ar) < 1.7
    if pro < 0.35:
        return max(ar) / min(ar) < 1.6 and max(ar) > 0.8
    else:
        return max(ar) / min(ar) < 1.7 and max(ar) > 0.65

# Color dictionary with new colors added
color_dict = {
    'black': (100, 110, 125),           # Already correct
    'soft_brown': (110, 100, 198),        # Soft Brown  (Correct)
    'dark_brown': (100, 100, 198),         # Dark Brown  (Correct)
    'light_blonde': (250, 240, 190),    # Light Blonde  (correct)
    'golden_blonde': (0, 215 * 0.8, 255 * 0.8),     # Golden Blonde  (Correct)
    'copper_red': (50, 80, 255),        # Copper Red  (Correct)
    'honey_brown': (176, 199, 198),      # Honey Brown (Correct)
    'ash_blonde': (178, 178, 179),      # Ash Blonde  (correct)
    'platinum_blonde': (228, 226, 223), # Platinum Blonde  (correct)
    'silver': (192, 192, 192),         # Silver (correct)
    'turquoise_blue': (139, 69, 19),   # Turquoise Blue (Correct)
    'neon_pink': (255, 110, 199),       # Neon Pink  (correct)
    'violet_purple': (155, 77, 255),    # Violet Purple  (Correct)
    'caramel_ombre': (176, 196, 222),    # Caramel Ombre  (Correct)
    'sunset_highlights': (48, 213, 200), # Sunset Highlights  (Correct)
    'icy_platinum_ombre': (139, 90, 80), # Icy Platinum Ombre  (Correct)
}

def vis_parsing_maps(im, origin, parsing_anno, stride, save_im=False, save_path=None, mod_colors=None):
    im = np.array(im)  # Convert input image to a NumPy array
    vis_im = im.copy().astype(np.uint8)  # Create a copy for visualization
    vis_parsing_anno = parsing_anno.copy().astype(np.uint8)  # Copy annotation map
    vis_parsing_anno = cv2.resize(vis_parsing_anno, None, fx=stride, fy=stride, interpolation=cv2.INTER_NEAREST)  # Resize annotation map

    num_of_class = np.max(vis_parsing_anno)  # Get max class value in annotation

    SB, SR, SG, cnt, total, brigh = 0, 0, 0, 0, 0, 0  # Initialize skin color and brightness variables
    FB, FR, FG, FN = 0, 0, 0, 0  # Initialize face color values

    # Compute the average face color
    for x in range(origin.shape[0]):
        for y in range(origin.shape[1]):
            _x = int(x * 512 / origin.shape[0])  # Scale x-coordinate
            _y = int(y * 512 / origin.shape[1])  # Scale y-coordinate
            if vis_parsing_anno[_x][_y] == 1:  # If pixel belongs to the face class
                FB += int(origin[x][y][0])
                FG += int(origin[x][y][1])
                FR += int(origin[x][y][2])
                FN += 1
    FB, FG, FR = int(FB / FN), int(FG / FN), int(FR / FN)  # Compute face color average

    # Compute the average skin color excluding face
    for x in range(origin.shape[0]):
        for y in range(origin.shape[1]):
            _x = int(x * 512 / origin.shape[0])
            _y = int(y * 512 / origin.shape[1])
            if vis_parsing_anno[_x][_y] == 17:  # If pixel belongs to skin class
                OB, OG, OR = map(int, origin[x][y])  # Extract original pixel values
                if similar(OB, OG, OR, FB, FG, FR):  # Skip if similar to face color
                    continue
                SB, SG, SR = SB + OB, SG + OG, SR + OR  # Sum up skin pixel values
                cnt += 1  # Count skin pixels
                brigh += OR + OG + OB  # Sum brightness values
            if vis_parsing_anno[_x][_y] <= 17:
                total += 1  # Count total relevant pixels
    
    pro = cnt / total  # Compute proportion of skin pixels
    SB, SG, SR = int(SB / cnt), int(SG / cnt), int(SR / cnt)  # Compute skin color average
    brigh = brigh / cnt / 3  # Compute average brightness

    # Loop through all selected colors
    for mod in mod_colors:
        GB, GG, GR = color_dict.get(mod, color_dict['black'])  # Get color values or default to gold

        for x in range(origin.shape[0]):
            for y in range(origin.shape[1]):
                _x = int(x * 512 / origin.shape[0])
                _y = int(y * 512 / origin.shape[1])
                if vis_parsing_anno[_x][_y] == 17:  # If pixel belongs to skin class
                    OB, OG, OR = map(int, origin[x][y])
                    if similar(OB, OG, OR, FB, FG, FR):  # Skip if similar to face color
                        continue
                    cur = origin[x][y]  # Get current pixel
                    sum_val = sum(cur)  # Compute brightness sum
                    
                    # Brightness adjustment factor
                    if brigh > 120:
                        param = 20
                        p = (sum_val + param) ** 2 / (brigh + param) ** 2 / 20
                    elif brigh < 80:
                        p = sum_val * 70 / 520 / brigh
                    else:
                        p = sum_val / 520
                    
                    # Apply color transformation if skin tone differs significantly
                    if CFAR(SB, SG, SR, cur[0], cur[1], cur[2], pro, brigh):
                        cur[0] = min(255, int(GB * p))  # Adjust blue channel
                        cur[1] = min(255, int(GG * p))  # Adjust green channel
                        cur[2] = min(255, int(GR * p))  # Adjust red channel

    if save_im:
        cv2.imwrite(save_path, origin, [int(cv2.IMWRITE_JPEG_QUALITY), 100])  # Save modified image




# Evaluate function for hair segmentation and recoloring
def evaluate(cp='ai_services/haircolor_recommendation/model_files/model.pth', input_path=None, input_base64=None, mode=None):
    """
    Evaluate function for hair segmentation and recoloring.
    
    - If `input_base64` is provided, it will be decoded instead of using `input_path`.
    - Returns the final modified image as a Base64 string.
    """
    valid_colors = list(hair_color_mapping.values())
    if mode is None or not all(color in valid_colors for color in mode):
        raise ValueError("Invalid hair color provided. Please provide a valid color from the mapped options.")
    
    # Load model
    n_classes = 19
    net = BiSeNet(n_classes=n_classes)
    net.cpu()
    save_pth = osp.join('', cp)
    net.load_state_dict(torch.load(save_pth, map_location=torch.device('cpu')))
    net.eval()

    # Define transformation
    to_tensor = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225)),
    ])

    # Read input image
    if input_base64:
        # Decode Base64 string to image
        img_data = base64.b64decode(input_base64)
        np_arr = np.frombuffer(img_data, np.uint8)
        origin = cv2.imdecode(np_arr, cv2.IMREAD_UNCHANGED)
    elif input_path:
        # Read image from file
        origin = cv2.imread(input_path, cv2.IMREAD_UNCHANGED)
    else:
        raise ValueError("Either `input_path` or `input_base64` must be provided.")

    if origin is None:
        raise ValueError("Failed to load image.")

    # Convert OpenCV image to PIL format for processing
    image = Image.fromarray(cv2.cvtColor(origin, cv2.COLOR_BGR2RGB))

    # Resize to 512x512
    image = image.resize((512, 512))

    # Convert to tensor
    img = to_tensor(image)
    img = torch.unsqueeze(img, 0).cpu()

    # Predict segmentation mask
    with torch.no_grad():
        out = net(img)[0]
        parsing = out.squeeze(0).cpu().numpy().argmax(0)

    # Apply hair color modifications
    vis_parsing_maps(image, origin, parsing, stride=1, save_im=True, mod_colors=mode, save_path='temp_colored_image.jpg')

    # Read the newly saved image back into OpenCV
    colored_image = cv2.imread('temp_colored_image.jpg', cv2.IMREAD_UNCHANGED)

    # Convert the processed image back to Base64
    _, buffer = cv2.imencode('.png', colored_image)
    base64_result_image = base64.b64encode(buffer).decode('utf-8')

    # Clean up temporary file
    os.remove('temp_colored_image.jpg')

    return base64_result_image
