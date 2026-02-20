# ✨ EduGenie AI Assistant

**EduGenie** is a state-of-the-art, AI-powered learning assistant designed to ignite curiosity and streamline academic workflows. Powered by Google Gemini 2.5 Flash, it offers a premium, localized learning experience with a focus on both aesthetics and functionality.

![EduGenie Hero]

## 🎨 Premium Theme: Soft Neutral & Muted Pastel
EduGenie features a custom-designed **Soft Neutral + Muted Pastel** aesthetic, providing a calm, focused environment for students and educators.
- **Glassmorphism**: Elegant blur effects and translucent layers.
- **Micro-Animations**: Smooth transitions and pulsing status indicators.
- **Responsive Design**: Optimized for desktops and mobile devices.

## 🚀 Key Features

- **🧠 Smart Q&A**: Get instant, formatted answers to any academic question.
- **🎓 Concept Explainer**: Simplify complex topics into Beginner, Intermediate, or Advanced levels.
- **📝 Automated Quiz**: Generate interactive multiple-choice quizzes on any topic with instant feedback.
- **📑 Content Summarizer**: Convert lengthy texts into concise bullet points or structured summaries.
- **🧪 Formula Rendering**: Full support for Mathematical and Chemical formulas using KaTeX.

## 🛠️ Tech Stack

- **Backend**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **AI**: [Google Gemini 2.5 Flash](https://ai.google.dev/)
- **Frontend**: Vanilla HTML5, CSS3 (Custom Variables), JavaScript (ES6+)
- **Libraries**: `marked.js` (Markdown), `KaTeX` (Math), `google-generativeai` (API)

## 🏁 Getting Started

### 1. Prerequisites
- Python 3.9+
- A Google Gemini API Key ([Get one here](https://aistudio.google.com/))

### 2. Installation
```powershell
# Clone the repository
git clone https://github.com/tasneem38/edu-genie.git
cd edu-genie

# Setup virtual environment
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configuration
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_api_key_here
```

### 4. Running the App
```powershell
python main.py
```
Visit `http://127.0.0.1:8000` in your browser.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Created with ✨ by [tasneem38](https://github.com/tasneem38)
