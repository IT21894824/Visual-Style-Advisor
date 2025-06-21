import os
import sqlite3
import pandas as pd
import joblib
import base64

# Load the model and label encoders
model = joblib.load("ai_services/makeup_recommendation/model_files/makeup_recommendation_model.pkl")
label_encoders = joblib.load("ai_services/makeup_recommendation/model_files/makeup_recommendation_label_encoders.pkl")

def get_makeup_details_from_db(predicted_class):
    try:
        # Connect to the SQLite database
        db_path = f"instance/users.db"
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Query to fetch all columns for the given style_name
        query = """SELECT style_name, foundation, nose_makeup, cheekbone_makeup, 
                          eyeshadow, eyeliner, lips, description, image 
                   FROM makeup_model WHERE style_name = ?"""
        cursor.execute(query, (predicted_class,))
        result = cursor.fetchone()

        if result:
            #  Step 1: Extract BLOB data
            image_blob = result[8]  # BLOB data stored in DB
            
            if image_blob:
                #  Step 2: Save BLOB to a temporary file
                temp_file_path = "temp_base64.txt"
                with open(temp_file_path, "wb") as temp_file:
                    temp_file.write(image_blob)  # Save BLOB as a file

                #  Step 3: Read file content to extract actual Base64
                with open(temp_file_path, "r", encoding="utf-8") as temp_file:
                    base64_data = temp_file.read().strip()  # Extract actual Base64 content
                
                # Cleanup: Remove the temporary file
                os.remove(temp_file_path)
            else:
                base64_data = None  # No image available

            #  Step 4: Return makeup details with correct Base64
            makeup_details = {
                "style_name": result[0],
                "foundation": result[1],
                "nose_makeup": result[2],
                "cheekbone_makeup": result[3],
                "eyeshadow": result[4],
                "eyeliner": result[5],
                "lips": result[6],
                "description": result[7],
                "image": base64_data  #  this contains only the Base64 string
            }
            return makeup_details
        else:
            return {"error": "Style not found in database."}

    except Exception as e:
        print(f"Error during DB query: {e}")
        return {"error": "Error fetching style from database."}
    finally:
        # Close the database connection
        conn.close()


# Function to predict makeup style
def predict_makeup(json_data):
    try:
        # Create a DataFrame for the new data input
        new_data_df = pd.DataFrame([json_data])
    
        # Encode the string values to numeric values using the saved label encoders
        for column in new_data_df.columns:
            if column in label_encoders:
                le = label_encoders[column]
                new_data_df[column] = le.transform(new_data_df[column])
            else:
                print(f"Column '{column}' not found in saved encoders!")

        # Predict the makeup recommendation
        prediction = model.predict(new_data_df)
    
        # Classes for makeup recommendations
        makeup_classes = ['Bold Glam', 'Classic Professional', 'Edgy Look', 'Evening Elegance', 
                          'Minimalist Beauty', 'Natural Look', 'Party Glam', 'Romantic Glow', 
                          'Smokey Eye Makeup', 'Sporty Chic']
    
        # Get the predicted makeup recommendation (numeric value from model)
        predicted_value = prediction[0]  # Prediction is in numeric form (e.g., [2])
    
        # Get the corresponding makeup class name
        predicted_class = makeup_classes[predicted_value]
    
        # Get all makeup details from the database
        makeup_details = get_makeup_details_from_db(predicted_class)

        return {
            "Makeup Recommendation": predicted_class,
            "Makeup Details": makeup_details
        }

    except Exception as e:
        # Handle exceptions and return error message
        print(f"Error during prediction: {e}")
        return {"error": str(e)}


