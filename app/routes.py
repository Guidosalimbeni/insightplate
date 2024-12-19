from flask import render_template, request, jsonify
from app import app, db
from app.models.business import Business
from app.services.insights_service import InsightsService

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/business', methods=['POST'])
def create_business():
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
