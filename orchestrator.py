from agents.symptom_analyzer import run_symptom_analyzer
from agents.literature_agent import literature_agent
from agents.case_matcher import case_matcher_agent
from agents.treatment_recommender import treatment_recommender_agent
from agents.summarizer import summarizer_agent

import json


def run_orchestrator(symptoms: list[str], duration: str, history: list[str]) -> dict:
    """
    Orchestrates the full multi-agent pipeline.
    Args:
        symptoms (list[str]): List of patient symptoms
        duration (str): Symptom duration
        history (list[str]): Patient history details
    Returns:
        dict: Combined agent outputs
    """

    # Convert structured input to text (for agents expecting free text)
    patient_text = (
        f"Symptoms: {', '.join(symptoms)}. "
        f"Duration: {duration}. "
        f"History: {', '.join(history)}."
    )

    # Step 1: Run Symptom Analyzer
    try:
        analysis = run_symptom_analyzer(patient_text)
    except Exception as e:
        analysis = {"error": f"Symptom analyzer failed: {str(e)}"}

    # Step 2: Extract possible diseases
    diseases = [d["disease"] for d in analysis.get("possible_diseases", [])] if isinstance(analysis, dict) else []

    # Step 3: Case matching
    try:
        case_matches = case_matcher_agent(patient_text, analysis.get("symptoms", []))
    except Exception as e:
        case_matches = {"error": f"Case matcher failed: {str(e)}"}

    # Step 4: PubMed literature
    literature_results = {}
    for disease in diseases:
        try:
            lit = literature_agent(disease, retmax=3)
            literature_results[disease] = lit.get("results", [])
        except Exception as e:
            literature_results[disease] = {"error": str(e)}

    # Step 5: Treatment recommender
    try:
        treatment_recommendations = treatment_recommender_agent(patient_text, diseases)
    except Exception as e:
        treatment_recommendations = {"error": f"Treatment recommender failed: {str(e)}"}

    # Step 6: Summarizer
    all_data = {
        "analysis": analysis,
        "literature": literature_results,
        "case_matches": case_matches,
        "treatments": treatment_recommendations,
    }

    try:
        summary = summarizer_agent(all_data)
    except Exception as e:
        summary = {"error": f"Summarizer failed: {str(e)}"}

    # Combine results
    return {
        "analysis": analysis,
        "literature": literature_results,
        "case_matches": case_matches,
        "treatments": treatment_recommendations,
        "summary": summary,
    }


if __name__ == "__main__":
    sample_input = {
        "symptoms": ["high fever", "persistent cough", "chest discomfort"],
        "duration": "2 days",
        "history": ["age 21"]
    }
    result = run_orchestrator(
        symptoms=sample_input["symptoms"],
        duration=sample_input["duration"],
        history=sample_input["history"]
    )
    print(json.dumps(result, indent=2))
