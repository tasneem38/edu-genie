from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from pydantic import BaseModel
from services import gemini_service
import os

app = FastAPI(title="EduGenie API")

# Get absolute path for static directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")

# Mount static files
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

class QuestionRequest(BaseModel):
    question: str

class ExplainRequest(BaseModel):
    topic: str
    level: str = "Beginner"

class QuizRequest(BaseModel):
    topic: str
    difficulty: str = "Medium"

class SummarizeRequest(BaseModel):
    text: str
    mode: str = "Bullet points"

@app.get("/", response_class=FileResponse)
async def read_root():
    index_path = os.path.join(STATIC_DIR, "index.html")
    if not os.path.exists(index_path):
        raise HTTPException(status_code=404, detail="index.html not found")
    return FileResponse(index_path)

@app.post("/api/ask")
async def ask_question(request: QuestionRequest):
    try:
        response = await gemini_service.ask_question(request.question)
        return {"response": response}
    except Exception as e:
        print(f"Error in /api/ask: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/explain")
async def explain_concept(request: ExplainRequest):
    try:
        response = await gemini_service.explain_concept(request.topic, request.level)
        return {"response": response}
    except Exception as e:
        print(f"Error in /api/explain: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/quiz")
async def generate_quiz(request: QuizRequest):
    try:
        response_text = await gemini_service.generate_quiz(request.topic, request.difficulty)
        try:
            import json
            quiz_data = json.loads(response_text)
            return {"quiz": quiz_data}
        except Exception as e:
            print(f"Quiz JSON Parse Error: {str(e)}")
            return {"error": "Failed to generate structured quiz", "raw_response": response_text}
    except Exception as e:
        print(f"Error in /api/quiz: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/summarize")
async def summarize_content(request: SummarizeRequest):
    try:
        response = await gemini_service.summarize_content(request.text, request.mode)
        return {"response": response}
    except Exception as e:
        print(f"Error in /api/summarize: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
