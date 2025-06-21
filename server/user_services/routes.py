 
from flask import Blueprint, request, jsonify
from .models import db, User

user_services_bp = Blueprint('user_services', __name__)

@user_services_bp.route('/create', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = User(**data)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created successfully"}), 201

@user_services_bp.route('/get_all_users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    
    # Convert SQLAlchemy objects to dictionaries excluding `_sa_instance_state`
    user_list = []
    for user in users:
        user_dict = user.__dict__.copy()
        user_dict.pop('_sa_instance_state', None)  # Remove non-serializable field
        user_dict['colors'] = user.colors.split(',') if user.colors else []  # Convert colors to list
        user_list.append(user_dict)

    return jsonify(user_list), 200

@user_services_bp.route('/get_user/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.get(id)
    if user:
        user_dict = user.__dict__.copy()
        user_dict.pop('_sa_instance_state', None)  # Remove non-serializable field
        user_dict['colors'] = user.colors.split(',') if user.colors else []  # Convert colors to list
        return jsonify(user_dict), 200
    return jsonify({"error": "User not found"}), 404

@user_services_bp.route('/update/<int:id>', methods=['POST'])
def update_user(id):
    user = User.query.get(id)
    if user:
        data = request.get_json()
        for key, value in data.items():
            setattr(user, key, value)
        db.session.commit()
        return jsonify({"message": "User updated successfully"})
    return jsonify({"error": "User not found"}), 404

@user_services_bp.route('/delete/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get(id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"})
    return jsonify({"error": "User not found"}), 404

@user_services_bp.route('/request_login', methods=['POST'])
def request_login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email'], password=data['password']).first()
    if user:
        return jsonify({"message": "Login successful",
                        "user_id": user.id})
    return jsonify({"error": "Invalid credentials"}), 401
