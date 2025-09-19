from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from orchestrator import run_orchestrator

app = FastAPI(title="Meds Multi-Agent AI", version="1.0")


# Define the expected input schema
class PatientInput(BaseModel):
    name: str
    age: int
    gender: str
    symptoms: List[str]
    duration: str
    history: List[str]


@app.get("/")
def root():
    return {"message": "Meds Multi-Agent AI is running 🚀"}


@app.post("/analyze")
def analyze_patient(data: PatientInput):
    """
    Run the orchestrator pipeline with structured patient input.
    """
    result = run_orchestrator(
        symptoms=data.symptoms,
        duration=data.duration,
        history=data.history,
    )
    return {
        "patient": {"name": data.name, "age": data.age, "gender": data.gender},
        "result": result,
    }
