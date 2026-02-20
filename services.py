import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

class GeminiService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')

    async def get_response(self, prompt: str, system_instruction: str = None):
        try:
            if system_instruction:
                full_prompt = f"System: {system_instruction}\n\nUser: {prompt}"
            else:
                full_prompt = prompt
            
            response = await self.model.generate_content_async(full_prompt)
            if not response or not response.text:
                raise ValueError("Empty response from Gemini")
            return response.text
        except Exception as e:
            print(f"Gemini Error: {str(e)}")
            raise e

    async def ask_question(self, question: str):
        system_instruction = (
            "You are EduGenie, a helpful AI academic assistant. "
            "Provide clear, concise, and accurate answers to academic questions. "
            "Use markdown formatting for better readability. "
            "For mathematical or chemical formulas, use standard LaTeX notation (e.g., $E=mc^2$ or $\text{H}_2\text{O}$) as it will be rendered."
        )
        return await self.get_response(question, system_instruction)

    async def explain_concept(self, topic: str, level: str = "Beginner"):
        system_instruction = (
            f"Explain the following topic for a {level} level student: {topic}. "
            "Break down complex concepts into simple steps, use real-life examples, "
            "and keep the language easy to understand. Use markdown."
        )
        return await self.get_response(f"Explain {topic}", system_instruction)

    async def generate_quiz(self, topic: str, difficulty: str = "Medium"):
        system_instruction = (
            f"Generate a quiz on the topic: {topic} with {difficulty} difficulty. "
            "The output MUST be a valid JSON array of objects. "
            "Each object must have: 'question', 'options' (list of 4 strings), 'answer' (the correct option string). "
            "Generate at least 5 questions."
        )
        # We need to ensure the response is strictly JSON. 
        # Using Gemini's forced JSON output would be better, but let's try prompt engineering first.
        response_text = await self.get_response(f"Generate quiz for {topic}", system_instruction)
        # Basic cleanup in case Gemini adds markdown backticks
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
             response_text = response_text.split("```")[1].split("```")[0].strip()
        return response_text

    async def summarize_content(self, text: str, mode: str = "Bullet points"):
        system_instruction = (
            f"Summarize the following text in {mode} mode. "
            "Highlight key terms and keep it concise. Use markdown."
        )
        return await self.get_response(f"Summarize this: {text}", system_instruction)

gemini_service = GeminiService()
