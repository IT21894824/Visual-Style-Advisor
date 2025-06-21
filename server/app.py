from flask import Flask
from user_services.routes import user_services_bp
from user_services.database import db, init_db
from extraction_services.routes import extraction_services_bp
from ai_services.haircolor_recommendation.routes import ai_services_haircolor_recommendation_bp
from ai_services.haircut_recommendation.routes import ai_services_haircut_recommendation_bp
from ai_services.makeup_recommendation.routes import ai_services_makeup_recommendation_bp
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object('config.Config')
CORS(app)
# Initialize database
init_db(app)

# Register blueprints
app.register_blueprint(user_services_bp, url_prefix='/user_services')
app.register_blueprint(extraction_services_bp, url_prefix='/extraction_services')
app.register_blueprint(ai_services_haircolor_recommendation_bp, url_prefix='/ai_services')
app.register_blueprint(ai_services_haircut_recommendation_bp, url_prefix='/ai_services')
app.register_blueprint(ai_services_makeup_recommendation_bp, url_prefix='/ai_services')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
