# InsightPlate - Local Business Analytics

A simple web application that helps small businesses understand their local customer base and create targeted marketing strategies.

## Features

- Business profile management
- Local demographic insights
- Customer profile generation
- Marketing campaign recommendations
- Simple analytics dashboard

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
python app.py
```

## Project Structure

- `/app` - Main application directory
  - `/static` - CSS, JavaScript, and other static files
  - `/templates` - HTML templates
  - `/models` - Database models
  - `/services` - Business logic and external API integrations
- `app.py` - Application entry point
- `config.py` - Configuration settings
