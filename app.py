from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import os

# Create the Flask application with the correct template folder
template_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'app', 'templates')
static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'app', 'static')
app = Flask(__name__, 
           template_folder=template_dir,
           static_folder=static_dir)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///insightplate.db'
db = SQLAlchemy(app)

# Move routes here to avoid circular imports
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/business', methods=['POST'])
def create_business():
    from app.models.business import Business
    data = request.json
    business = Business(
        name=data['name'],
        business_type=data['business_type'],
        location=data['location'],
        description=data.get('description', '')
    )
    db.session.add(business)
    db.session.commit()
    return jsonify(business.to_dict()), 201

@app.route('/api/insights/<int:business_id>')
def get_insights(business_id):
    from app.models.business import Business
    from app.services.insights_service import InsightsService
    
    business = Business.query.get_or_404(business_id)
    insights_service = InsightsService()
    
    demographics = insights_service.get_demographic_insights(business.location)
    customer_profiles = insights_service.generate_customer_profile(
        business.business_type, 
        business.location
    )
    campaigns = insights_service.suggest_marketing_campaigns(
        business.business_type,
        customer_profiles
    )
    
    return jsonify({
        'demographics': demographics,
        'customer_profiles': customer_profiles,
        'campaigns': campaigns
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
