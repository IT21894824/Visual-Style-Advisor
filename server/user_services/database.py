 
from .models import db
from flask import current_app

def init_db(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()
