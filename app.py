from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
from orchestrator import run_orchestrator

app = FastAPI(title="Medical AI API", version="1.0.0")

# Add CORS middleware to allow React frontend to make requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PatientReport(BaseModel):
    patient_report: str

class AnalysisResponse(BaseModel):
    analysis: dict
    literature: dict
    case_matches: dict
    treatments: dict
    summary: dict

def parse_patient_report(text: str) -> dict:
    """Simple parser to extract symptoms, duration, and history from text"""
    text_lower = text.lower()
    
    # Extract symptoms (simple keyword matching)
    symptom_keywords = ['pain', 'fever', 'cough', 'fatigue', 'headache', 'nausea', 'dizziness']
    symptoms = []
    for keyword in symptom_keywords:
        if keyword in text_lower:
            symptoms.append(keyword)
    
    # If no specific symptoms found, extract from context
    if not symptoms:
        symptoms = [text.split('.')[0].strip()]  # Use first sentence as symptom
    
    # Extract duration
    duration = "unknown"
    duration_patterns = ['days', 'day', 'weeks', 'week', 'months', 'month']
    words = text_lower.split()
    for i, word in enumerate(words):
        if any(pattern in word for pattern in duration_patterns):
            if i > 0 and words[i-1].isdigit():
                duration = f"{words[i-1]} {word}"
                break
    
    # Extract age and other history
    history = []
    if 'age' in text_lower:
        age_match = [word for word in words if word.isdigit()]
        if age_match:
            history.append(f"age {age_match[0]}")
    
    return {
        "symptoms": symptoms if symptoms else ["general complaint"],
        "duration": duration,
        "history": history if history else ["no specific history"]
    }

@app.post("/api/analyze", response_model=dict)
async def analyze_symptoms(report: PatientReport):
    try:
        if not report.patient_report.strip():
            raise HTTPException(status_code=400, detail="Patient report is required")
        
        # Parse the patient report into structured format
        parsed_data = parse_patient_report(report.patient_report)
        
        # Run the orchestrator with structured input
        result = run_orchestrator(
            symptoms=parsed_data["symptoms"],
            duration=parsed_data["duration"],
            history=parsed_data["history"]
        )
        
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "Medical AI API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)