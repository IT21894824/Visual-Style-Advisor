# Machine learning based visual style advisor for personalized fashion and beauty recommendations​

**Project ID**: 24-25J-155  
**Developed By**: Prasadi S.A.D.T. IT21894824, Shaakir J.H.M.​ IT21322280​, Vikasitha M.K.I. IT21180798​, Senarathne D.R.​ IT21213144​  

## Welcome
This project is dedicated to creating a highly personalized fashion and beauty recommendation system, tailored for the young generation. Our innovative mobile app harnesses the power of machine learning to address the challenges individuals face in selecting hairstyles, hair colors, makeup, and clothing recommendations. We aim to redefine how users explore and discover their unique style.

---

## Table of Contents

- [Research Question](#research-question)
- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Technologies Used](#tools--technologies)
- [System Requirements](#system-requirements)
- [Setup Instructions](#setup-instructions)
- [License](#license)
- [Git repository Link](#git-repository-link)
  

---

## Research Question

How can a machine learning-based mobile application effectively provide personalized fashion and beauty recommendations, including hairstyle transformation, hair color selection, clothing fit, and makeup suggestions, through facial feature and body type analysis?

---

## About the Project

### Purpose
To develop a machine learning-based mobile application that offers personalized fashion and beauty recommendations tailored to individual preferences, body types and facial features. This system aims to address the challenges individuals face when selecting hairstyles, hair colors, clothing, and makeup by providing realistic simulations and interactive tools. By integrating advanced algorithms, the application seeks to enhance user confidence and decision-making in exploring new styles, ultimately redefining the way individuals approach personal styling and fashion.


### Objectives
1. **Main Objective**  
   Develop an innovative machine learning-based mobile application that provides personalized fashion and beauty recommendations for the young generation.
   
3. **Specific Objectives**  
   - Hair Style Transformation and Realistic Simulation for Personalized Recommendations
   - Personalized Hair Color Recommendation Using Deep Learning
   - Clothing Recommendation Based on Body Type and Skin Tone
   - Makeup Recommendation Through Nose Structure and Cheekbone Identification

---

## Key Features

### Hair Style Transformation and Realistic Simulation for Personalized Recommendations. - Vikasitha M.K.I. IT21180798
- Analyze facial features and preferences to recommend personalized hairstyles, simulate real-time virtual hairstyle transformations, and provide culturally diverse and trend-based options for enhanced user styling decisions.

### Personalized Hair Color Recommendation Using Deep Learning. - Prasadi S.A.D.T. IT21894824
- Leverage deep learning and image processing to provide real-time, tailored hair color suggestions based on unique user features such as skin tone, eye color, and natural hair color, while considering lifestyle, preferences, and professional trends for enhanced user satisfaction and customization.

### Clothing Recommendation Based on Body Type and Skin Tone - Shaakir J.H.M.​ IT21322280
- Provides personalized clothing recommendations based on user-uploaded images. Extracts features from the image using the VGG-16 model and classifies them with a Random Forest Classifier. The system predicts the best clothing options tailored to the user's gender, skin tone, and body type.

### Makeup Recommendation Through Nose Structure and Cheekbone Identification - Senarathne D.R.​ IT21213144​
- Analyze facial features, focusing on the nose structure and cheekbones, to provide personalized makeup recommendations that enhance facial symmetry, define contours, and highlight features, offering a more precise and tailored approach compared to traditional generalized methods.

### User Dashboard 
- A centralized interface for accessing personalized fashion and beauty recommendations.
- Visualize real-time hairstyle, hair color, makeup transformations, and clothing recommendations.
- Insights based on facial features, preferences, and trends.
- Customize and save style preferences for future use.

---

## System Architecture

### Components
1. **Frontend**  
   - User-friendly mobile application interface.
   
2. **Backend**  
   - FastAPI for seamless communication.
   - Machine learning models for predictions.
   
3. **Data Analysis**
   - Facial feature analysis using image processing and deep learning techniques.
   - Skin tone, eye color, facial features and body measurements analysis for personalized recommendations.

4. **Recommendation Engine**
   - Deep learning models for hairstyle, hair color, makeup, and clothing predictions.
   - Algorithms tailored to user preferences, facial features, and fashion trends.

6. **Database**
   - Centralized storage for user profiles, preferences, and styling history.
   - Dynamic updates for style trends and user customization options.
     
8. **Integration**
   - APIs to seamlessly connect the mobile app with machine learning models and database storage.
   - Continuous learning and improvement pipeline based on user feedback and interaction data.


### Workflow
1. Upload a photo or capture a real-time selfie via the mobile app.
2. Analyzes facial features and body type using advanced image processing and deep learning models.
3. Machine learning algorithms generate personalized recommendations for hairstyle, hair color, makeup, and clothing.
4. The final recommendations, along with actionable insights and trends, are displayed on the user dashboard for an interactive and customized experience.

### Diagram

![White drawio](https://github.com/user-attachments/assets/5ff814f3-9ca1-4505-8887-8638c52fe72e)


---

## Tools & Technologies

### Frontend
- **React Native**: Used for cross-platform UI development, primarily on Android (using Android Studio).

### Backend
- **Python (FastAPI)**: Primary backend framework for building RESTful APIs to manage requests and responses.
- **Node.js**: Potentially used for additional non-Python microservices or integration purposes.

### Database
- **MongoDB**: NoSQL database for securely storing and managing user data, preferences, and styling history.


## Machine Learning & Deep Learning Models
- **VGG-16**
- **Random Forest Classifier**
- **Convolutional Neural Networks (CNNs)**
- **Random Forest**
- **Support Vector Machines (SVM)**
- **K-Nearest Neighbors (KNN)**


## Libraries

### Python
#### Machine Learning and Deep Learning
- TensorFlow
- PyTorch
- Scikit-learn
- Keras

#### Image Processing
- OpenCV (Facial feature detection and analysis)
- Pillow (Image processing)

#### Data Processing and Visualization
- Pandas
- NumPy
- Matplotlib
- Seaborn

#### Model Persistence
- Joblib

#### Utilities
- Pillow (Image processing)

### JavaScript/Node.js
- elevant libraries as needed, such as Express.js, for backend integrations if required.


## Tools

### Development
- Google Colab (For data science and ML model development)
- PyCharm
- VS Code
- Android Studio

### Version Control
- Git

### API Testing
- Postman

### Deployment
- Uvicorn (ASGI server for FastAPI applications)

### Dataset Management
- CSV files for handling data input and output

### Package Management
- pip (Python)
- npm (Node.js)

---

## System Requirements

### Functional
- Accept user images to analyze facial features and body types.
- Generate personalized recommendations for hairstyles, hair colors, makeup, and clothing.
- Provide real-time visualization through a virtual fit-on interface.

### Non-Functional
- Ensure high accuracy in recommendation generation.
- Deliver fast response times for user interactions.
- Maintain an intuitive and user-friendly interface.

---

## Setup Instructions

### Prerequisites
- Node.js and npm
- Python 3.x
- Google Firestore account
- React Native environment setup
- Android Studio
- Git

--- 

## License


---

## Git repository Link

Git repository Link : https://github.com/IT21894824/Visual-Style-Advisor

---
