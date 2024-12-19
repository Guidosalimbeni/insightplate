document.getElementById('businessForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
    
    const businessData = {
        name: document.getElementById('name').value,
        business_type: document.getElementById('type').value,
        location: document.getElementById('location').value,
        description: document.getElementById('description').value
    };

    try {
        // Create business
        const response = await fetch('/api/business', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(businessData)
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const business = await response.json();
        
        // Get insights
        const insightsResponse = await fetch(`/api/insights/${business.id}`);
        if (!insightsResponse.ok) {
            throw new Error('Failed to fetch insights');
        }
        
        const insights = await insightsResponse.json();
        displayInsights(insights);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('insightsPanel').innerHTML = `
            <div class="alert alert-danger" role="alert">
                <i class="bi bi-exclamation-triangle-fill"></i>
                An error occurred while fetching insights. Please try again.
            </div>
        `;
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="bi bi-search"></i> Get Insights';
    }
});

function displayInsights(insights) {
    const insightsPanel = document.getElementById('insightsPanel');
    
    const html = `
        <div class="insight-section">
            <div class="insight-card">
                <h6 class="insight-title"><i class="bi bi-people-fill"></i> Demographics</h6>
                <div class="row">
                    <div class="col-md-6">
                        <p class="mb-2"><strong>Age Distribution:</strong></p>
                        <ul class="list-unstyled">
                            ${Object.entries(insights.demographics.age_distribution).map(([age, percent]) => 
                                `<li><small>${age}: ${percent}</small></li>`).join('')}
                        </ul>
                    </div>
                    <div class="col-md-6">
                        <p class="mb-2"><strong>Household Types:</strong></p>
                        <ul class="list-unstyled">
                            ${Object.entries(insights.demographics.household_composition).map(([type, percent]) => 
                                `<li><small>${type.replace(/_/g, ' ')}: ${percent}</small></li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="mt-2">
                    <strong>Average Income:</strong> ${insights.demographics.income_levels.average}
                </div>
            </div>

            <div class="insight-card">
                <h6 class="insight-title"><i class="bi bi-person-check-fill"></i> Customer Profiles</h6>
                <ul class="mb-0">
                    ${insights.customer_profiles.map(profile => 
                        `<li class="insight-value">${profile}</li>`).join('')}
                </ul>
            </div>

            <div class="insight-card">
                <h6 class="insight-title"><i class="bi bi-megaphone-fill"></i> Recommended Campaigns</h6>
                ${insights.campaigns.campaigns.map(campaign => `
                    <div class="mb-3">
                        <h6 class="mb-1">${campaign.type}</h6>
                        <p class="mb-1 insight-value">${campaign.description}</p>
                        <small class="text-success">
                            <i class="bi bi-graph-up-arrow"></i> ${campaign.estimated_impact}
                        </small>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    insightsPanel.innerHTML = html;
}
