import os
import requests
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json

app = FastAPI()

api_key = "9ae395caf6e544f5a3da917672b72625"
base_url = "https://api.aimlapi.com/v1"

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins or specify allowed domains
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

dummy_data_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "dummyData.json")

# Load dummy data
with open(dummy_data_path, "r") as f:
    DUMMY_DATA = json.load(f)

@app.get("/api/data")
def get_data():
    """
    Returns dummy data (e.g., list of users).
    """
    return DUMMY_DATA

@app.post("/api/ai")
async def ai_endpoint(request: Request):
    """
    Accepts a user question and returns an AI response using the GPT-4o-Mini model from AIML API.
    """
    body = await request.json()
    user_question = body.get("question", "")
    
    if not user_question:
        return {"error": "Please provide a valid question."}

    try:
        # Create the API payload for GPT-4o-Mini model
        payload = {
            "model": "gpt-4o-mini",  # Specify the GPT-4o-Mini model as per AIML API
            "messages": [
                {"role": "user", "content": user_question}
            ],
            "temperature": 0.7,  # You can adjust the randomness (creativity) of the output
            "max_tokens": 256  # Adjust the maximum token length as needed
        }

        # Set headers for the API request
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        # Send POST request to the AIML API
        response = requests.post(
            f"{base_url}/chat/completions",
            json=payload,
            headers=headers
        )

        # Check if the request was successful
        response.raise_for_status()

        # Parse the response data
        data = response.json()

        # Ensure that the response contains the expected data
        if "choices" in data and len(data["choices"]) > 0:
            ai_answer = data["choices"][0]["message"]["content"]
            return {"answer": ai_answer}
        else:
            return {"error": "No valid response from AIML API."}

    except requests.exceptions.RequestException as e:
        return {"error": f"Error while fetching AI response: {str(e)}"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
