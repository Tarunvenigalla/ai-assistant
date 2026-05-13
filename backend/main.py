from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_URL = "http://localhost:11434/api/chat"

# Store conversations
chat_history = {}

class ChatRequest(BaseModel):
    session_id: str
    message: str

@app.post("/chat")
async def chat(request: ChatRequest):

    # Create session if not exists
    if request.session_id not in chat_history:
        chat_history[request.session_id] = []

    # Add user message
    chat_history[request.session_id].append({
        "role": "user",
        "content": request.message
    })

    payload = {
        "model": "llama3",
        "messages": chat_history[request.session_id],
        "stream": False
    }

    response = requests.post(
        OLLAMA_URL,
        json=payload
    )

    data = response.json()

    assistant_reply = data["message"]["content"]

    # Save assistant response
    chat_history[request.session_id].append({
        "role": "assistant",
        "content": assistant_reply
    })

    return {
        "response": assistant_reply
    }