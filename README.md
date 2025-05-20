# YouTube Video Summarizer

An intelligent web application that generates comprehensive summaries and timestamp-based notes from YouTube videos. Simply paste a YouTube video link, and the application will analyze the content, providing you with a detailed summary and key points with timestamps.

## 🚀 Features

- YouTube video content analysis
- AI-powered video summarization
- Timestamp-based notes generation
- Clean and intuitive user interface
- Real-time processing status updates

## 🛠️ Tech Stack

### Frontend
- Next.js 15.3.2
- React 19
- TypeScript
- Tailwind CSS
- Shadcn UI Components

### Backend
- FastAPI
- Python 3.x
- LangChain for AI/ML processing
- YouTube Transcript API for video content extraction
- Google AI Generative Language API for content analysis

## 📋 Prerequisites

- Node.js (Latest LTS version)
- Python 3.x
- pip (Python package manager)
- Git
- Google AI API key

## 🚀 Getting Started

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file and add your environment variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm run dev
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file and add your environment variables:
```env
GOOGLE_API_KEY=your_google_api_key
```

5. Start the backend server:
```bash
uvicorn app.main:app --reload
```

## 🔧 Environment Variables

### Frontend
- `NEXT_PUBLIC_API_URL`: Backend API URL

### Backend
- `GOOGLE_API_KEY`: Google AI API key for content analysis

## 💡 How to Use

1. Open the application in your web browser
2. Paste a YouTube video URL in the input field
3. Click "Generate Summary"
4. Wait for the processing to complete
5. View the generated summary and timestamp-based notes
