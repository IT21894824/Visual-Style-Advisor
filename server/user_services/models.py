from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.String(10))
    occupation = db.Column(db.String(50))
    occasion = db.Column(db.String(50))
    hair_type = db.Column(db.String(50))
    skin_color = db.Column(db.String(50))
    eye_color = db.Column(db.String(50))
    look_type = db.Column(db.String(50))
    colors = db.Column(db.String(255))
    factors = db.Column(db.String(255))
    restrictions = db.Column(db.String(255))
    multi_tonal = db.Column(db.String(10))

# Haircolor Model Table
class HaircolorModel(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    hair_color_name = db.Column(db.String(255), nullable=False)  # Hair color name (e.g., "Soft Brown")
    description = db.Column(db.Text)  # Description of the hair color

# Haircut Model Table
class HaircutModel(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    gender = db.Column(db.String(10))
    haircut_name = db.Column(db.String(255), nullable=False)  # Name of the haircut
    description = db.Column(db.Text)  # Description of the haircut

# Makeup Model Table
class MakeupModel(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    style_name = db.Column(db.String(255), nullable=False)  # Name of the makeup style
    foundation = db.Column(db.String(255))  # Description of foundation used
    nose_makeup = db.Column(db.String(255))  # Description of nose makeup
    cheekbone_makeup = db.Column(db.String(255))  # Description of cheekbone makeup
    eyeshadow = db.Column(db.String(255))  # Description of eyeshadow used
    eyeliner = db.Column(db.String(255))  # Description of eyeliner used
    lips = db.Column(db.String(255))  # Description of lip makeup
    description = db.Column(db.Text)  # Detailed description of the makeup style
    image = db.Column(db.LargeBinary)  # Base64 stored as BLOB for makeup style representation
