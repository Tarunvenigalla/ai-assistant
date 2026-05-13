from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import requests
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_URL = "http://localhost:11434/api/chat"

chat_history = {}

class ChatRequest(BaseModel):
    session_id: str
    message: str

@app.post("/chat")
async def chat(request: ChatRequest):

    # Create session with system prompt
    if request.session_id not in chat_history:

        chat_history[request.session_id] = [

            {
                "role": "system",
                "content": """
            You are a conversational AI assistant.

            IMPORTANT RULES:
            - Reply ONLY to what the user asks.
            - Keep responses short and natural.
            - Do NOT generate examples, exercises, stories, lessons, or extra content unless explicitly requested.
            - Do NOT continue conversations on your own.
            - Do NOT generate code unless user explicitly asks for code.
            - For greetings like 'hello', respond briefly.
            - If user says their name, simply acknowledge it politely.
            - Behave like ChatGPT.
            """
            }

        ]

    # Add user message
    chat_history[request.session_id].append({
        "role": "user",
        "content": request.message
    })

    payload = {
        "model": "llama3.2:3b",
        "messages": chat_history[request.session_id],
        "stream": True,
        "options": {
            "num_ctx": 1024,
            "num_predict": 256,
            "temperature": 0.7
        }
    }

    def generate():

        response = requests.post(
            OLLAMA_URL,
            json=payload,
            stream=True
        )

        full_response = ""

        for line in response.iter_lines():

            if line:

                try:

                    data = json.loads(
                        line.decode("utf-8")
                    )

                    if "message" in data:

                        content = data["message"].get(
                            "content", ""
                        )

                        if content:

                            full_response += content

                            yield content

                except Exception as e:
                    print("Streaming error:", e)

        # Save assistant response
        chat_history[request.session_id].append({
            "role": "assistant",
            "content": full_response
        })

    return StreamingResponse(
        generate(),
        media_type="text/plain"
    )

@app.post("/generate-title")
async def generate_title(request: ChatRequest):

    prompt = f"""
Generate a very short chat title (max 4 words)
for this message:

{request.message}

Only return the title.
"""

    payload = {
        "model": "phi3",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "stream": False,
        "options": {
            "num_predict": 20
        }
    }

    response = requests.post(
        OLLAMA_URL,
        json=payload
    )

    data = response.json()

    title = data["message"]["content"].strip()

    return {
        "title": title
    }