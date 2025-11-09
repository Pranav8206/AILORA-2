from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import google.generativeai as genai
from dotenv import load_dotenv
import os
import json

load_dotenv()

GEMINI_API_KEY = os.getenv("API_KEY")

if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        GENAI_AVAILABLE = True
    except Exception:
        GENAI_AVAILABLE = False

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})


def load_artifacts():
    try:
        loaded_model = joblib.load("latest_model.pkl")
        loaded_vectorizer = joblib.load("latest_vectorizer.pkl")
        loaded_label_encoder = joblib.load("new_latest_encoder.pkl")
        return loaded_model, loaded_vectorizer, loaded_label_encoder
    except Exception as exc:
        raise RuntimeError(f"Failed to load model artifacts: {exc}")


# Load your trained ML model files
model, vectorizer, label_encoder = load_artifacts()

def get_gemini_explanation(diseases, symptoms, user_profile=""):
    if not GENAI_AVAILABLE:
        return [{
            "symptoms": symptoms,
            "response": "LLM explanation is unavailable right now. Below are the likely conditions based on your symptoms."
        }]

    diseases_text = ", ".join(diseases)
    
    # Build profile context
    profile_context = ""
    if user_profile:
        profile_context = f"""
        User Profile:
        - Age: {user_profile.get('age', 'Not specified')}
        - Gender: {user_profile.get('gender', 'Not specified')}
        - Allergies: {user_profile.get('allergies', 'None')}
        - Chronic Medical  Conditions: {user_profile.get('chronic_conditions', 'None')}
        - Lifestyle Habits: {user_profile.get('habits', 'None')}
        """
    
    prompt = f"""
    You are a reliable medical assistant AI. Provide information in English.

    Input symptoms from user: "{symptoms}"
    Possible predicted diseases: {diseases_text}
    {profile_context}

    1. First, determine if the input symptoms are medically meaningful.
       If the input is random, incomplete, or non-medical (e.g. gibberish, emotional words, jokes, etc.),
       respond with this exact JSON:
       [
         {{
           "symptoms": "{symptoms}",
           "has_valid_symptoms": false,
           }}
       ]

    2. If the symptoms are medically meaningful, respond ONLY with valid JSON array of objects including all possible predicted diseases in this exact format:
       [
         {{
           "Disease Name": "string",
           "Description": "short medical description",
           "Treatment": "common treatment or management steps",
           "Prevention": "preventive measures",
           "Home Remedies": "safe home remedies or first-aid steps",
           "Specialist Recommendation": "type of specialist to consult (e.g., General Practitioner, Cardiologist, Dermatologist, etc.)",
           "Severity": "low|moderate|high",
           "Urgency": "Consult within days|weeks|immediate attention needed"
         }}
       ]

    Do not include any extra text or commentary outside the JSON. Consider the user profile when making recommendations.
    """

    model_gemini = genai.GenerativeModel("models/gemini-pro-latest")
    response = model_gemini.generate_content(prompt)
    response_text = getattr(response, "text", str(response))
    
    try:
        if "```json" in response_text:
            start = response_text.find("```json") + 7
            end = response_text.find("```", start)
            response_text = response_text[start:end].strip()
        elif "```" in response_text:
            start = response_text.find("```") + 3
            end = response_text.find("```", start)
            response_text = response_text[start:end].strip()
        
        parsed_json = json.loads(response_text)
        return parsed_json
    except (json.JSONDecodeError, ValueError) as e:
        return [{
            "symptoms": symptoms,
            "response": response_text if response_text else "Unable to process the explanation."
        }]

@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "AILORA API",
        "version": "2.0"
    })

@app.route("/api/predict", methods=["POST"])
def predict():    
    try:
        data = request.get_json()
        symptoms_text = data.get("symptoms", "").strip()
        user_profile=data.get("user_profile" , "")

        if not symptoms_text or len(symptoms_text) < 3:
            return jsonify({
                "error": "Please enter meaningful symptoms (at least 3 characters)."
            }), 400

        # Model expects direct symptoms text
        input_data = vectorizer.transform([symptoms_text])
        proba = model.predict_proba(input_data)[0]
        
        top_indices = proba.argsort()[-5:][::-1]
        top_diseases = label_encoder.inverse_transform(top_indices)
        top_probabilities = [float(proba[i]) for i in top_indices]

        try:
            explanation = get_gemini_explanation(top_diseases, symptoms_text, user_profile)
        except Exception as e:
            explanation = [{
                "Disease Name": disease,
                "Description": "Consult a healthcare provider for detailed information.",
                "Treatment": "Please see a medical professional.",
                "Prevention": "Maintain good hygiene and healthy lifestyle.",
                "Home Remedies": "Rest and stay hydrated",
                "Specialist Recommendation": "General Practitioner",
                "Severity": "moderate",
                "Urgency": "Consult within days"
            } for disease in top_diseases]
        
        return jsonify({
            "success": True,
            "symptoms": symptoms_text,
            "predictions": [
                {
                    "disease": disease,
                    "confidence": float(prob)
                }
                for disease, prob in zip(top_diseases[:5], top_probabilities[:5])
            ],
            "detailed_analysis": explanation,
            "user_profile": user_profile,
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Prediction failed: {str(e)}"
        }), 500

@app.route("/api/extract-symptoms", methods=["POST"])
def extract_symptoms():
    data = request.get_json()
    condition_text = data.get("condition", "").strip()

    if not condition_text:
        return jsonify({"error": "Please describe your condition."}), 400

    # Step 1: Send user text to Gemini for symptom extraction
    prompt = f"""
    You are a medical assistant AI. Extract clear, medically relevant symptoms from this user input and respond ONLY with valid JSON.

    Input: "{condition_text}"

    Respond in this exact JSON format:
    {{ 
      "has_valid_symptoms": true or false,
      "extracted_symptoms": ["symptom1", "symptom2", ...,]
    }}
    """
    
    model_gemini = genai.GenerativeModel("models/gemini-pro-latest")
    response = model_gemini.generate_content(prompt)
    response_text = getattr(response, "text", str(response))

    # Parse the JSON safely
    try:
        start = response_text.find("{")
        end = response_text.rfind("}") + 1
        parsed = json.loads(response_text[start:end])
        extracted_symptoms = parsed.get("extracted_symptoms")
        has_valid_symptoms = parsed.get("has_valid_symptoms")
    except Exception:
        return jsonify({
            "error": "Failed to extract symptoms from user description.",
            "has_valid_symptoms": False
        }), 500

    return jsonify({
        "success": True,
        "has_valid_symptoms": has_valid_symptoms,
        "extracted_symptoms": extracted_symptoms,
    })

@app.route("/api/change-lang", methods=["POST"])
def change_lang():
    data = request.get_json()
    analysis_data = data.get("detailed_analysis")
    target_lang = data.get("language", "").strip().lower()
    if not analysis_data or not target_lang:
        return jsonify({"error": "Both 'detailed_analysis' and 'language' are required."}), 400

    prompt = f"""
    You are a professional medical translator.
    Translate the following JSON into **{target_lang}**,
    but strictly keep the same JSON structure and keys unchanged.
    Only translate the **values**, not the keys or formatting.

    Example:
    Input:
    {{
        "Disease Name": "Flu",
        "Description": "A common viral infection."
    }}

    Output (in Hindi):
    {{
        "Disease Name": "Flu(फ्लू)",
        "Description": "एक सामान्य वायरल संक्रमण।"
    }}
    Respond in this exact JSON format
    Here is the actual JSON to translate:
    {json.dumps(analysis_data, ensure_ascii=False, indent=2)}
    """
    try:
        model_gemini = genai.GenerativeModel("models/gemini-pro-latest")
        response = model_gemini.generate_content(prompt)
        response_text = getattr(response, "text", str(response))
        # Extract valid JSON from Gemini output
        start = response_text.find("{")
        end = response_text.rfind("}") + 1
        translated_json = json.loads(response_text[start:end])
        return jsonify({
            "success": True,
            "language": target_lang,
            "translated_analysis": translated_json
        })

    except Exception as e:
        return jsonify({
            "error": "Failed to translate analysis.",
            "details": str(e),
            "raw_response": response_text if 'response_text' in locals() else None
        }), 500

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    input_text = data.get("input", "").strip()
    messages = data.get("messages", [])

    if not input_text:
        return jsonify({"error": "'input' is required."}), 400

    conversation_history = "\n".join(
        f"{msg['sender'].capitalize()}: {msg['text']}" for msg in messages
    )

    prompt = f"""
    You are AILORA, an AI doctor.
    Chat so far:
    {conversation_history}
    User: {input_text}

    Task: First ask 5 diagnostic questions (short). Then provide likely causes, possible treatments, and immediate advice.
    - Be conversational but factual.
    - Avoid greetings and long disclaimers.
    - Keep the entire reply under 800 characters.
    - Return plain text (not JSON).
    """

    try:
        model_gemini = genai.GenerativeModel("models/gemini-pro-latest")
        response = model_gemini.generate_content(prompt)
        print(response)
        response_text = getattr(response, "text", str(response)).strip()
        return jsonify({"message": response_text})

    except Exception as e:
        return jsonify({
            "error": "Failed to generate response.",
            "details": str(e),
            "raw_response": response_text if 'response_text' in locals() else None
        }), 500


if __name__ == "__main__":
    app.run(debug=True)