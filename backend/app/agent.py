from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
import os
import asyncio
from utils import get_transcript_in_english, get_video_id_from_url

load_dotenv()

# def get_summary_from_url(url):
#     video_id = get_video_id_from_url(url)
#     transcript = get_transcript_in_english(video_id)
#     prompt = f"Give a detailed summary of the following transcript which is from a youtube video: {transcript}"
#     chat_model = init_chat_model("gemini-2.0-flash",model_provider="google-genai", api_key=os.getenv("GOOGLE_API_KEY"))
#     response = chat_model.invoke(prompt)
#     return response.content


# def get_notes_from_url(url):
#     video_id = get_video_id_from_url(url)
#     transcript = get_transcript_in_english(video_id)
#     prompt = f"Give me detailed notes with timestamps from the following transcript which is from a youtube video: {transcript}"
#     chat_model = init_chat_model("gemini-2.0-flash",model_provider="google-genai", api_key=os.getenv("GOOGLE_API_KEY"))
#     response = chat_model.invoke(prompt)
#     return response.content

async def get_summary_and_notes_with_status(url):
    # Extracting Video ID
    yield "Extracting Video ID", None
    video_id = get_video_id_from_url(url)
    await asyncio.sleep(0.1)  # Small delay to ensure frontend gets status update
    
    # Generating Transcript
    yield "Generating Transcript", None
    transcript = get_transcript_in_english(video_id)
    await asyncio.sleep(0.1)
    
    # Generating Summary
    yield "Generating Summary", None
    prompt_summary = f"""Please create a comprehensive summary of this YouTube video transcript: {transcript}

1. Begin with a brief overview (2-3 sentences) identifying the video's main topic and purpose.

2. Create a hierarchical outline with:
   - Main topics as level 1 headings (e.g., I, II, III)
   - Subtopics as level 2 headings (e.g., A, B, C)
   - Key points under each subtopic as bullet points
   
3. For each main section, include:
   - Approximate timestamp/point in HH:MM:SS format in the video where discussed
   - Any important quotes, statistics, or specific examples mentioned
   - Key insights or conclusions presented

4. End with a final section highlighting:
   - The video's main takeaways or conclusions
   - Any calls to action or recommended next steps
   - Questions that remained unanswered (if any)

Please focus on capturing all substantive content while omitting filler words, repetitions, and tangential remarks. Aim to make the summary both comprehensive and concise."""
    chat_model = init_chat_model("gemini-2.0-flash",model_provider="google-genai", api_key=os.getenv("GOOGLE_API_KEY"))
    response_summary = chat_model.invoke(prompt_summary)
    summary = response_summary.content
    
    # Send summary once ready
    yield "Summary Ready", summary
    
    # Generating Notes
    yield "Generating Notes", None
    prompt_notes = f"""
Create a comprehensive timestamped summary of this YouTube video transcript: {transcript}

1. Format all timestamps in HH:MM:SS format (e.g., 00:15:32)

2. Organize the notes chronologically with clear timestamp markers at the beginning of each section

3. For each timestamped section:
   - Provide a descriptive heading that captures the main topic
   - Include detailed bullet points of key information, arguments, and insights
   - Explain the topics so that user can understand it easily and improve their knowledge
   - Highlight any important quotes, data points, or examples (use quotation marks for direct quotes)
   - Note any visual demonstrations, graphics, or non-verbal elements mentioned in the transcript

4. Identify transitions between major topics with clearly marked timestamps

5. For technical or specialized content:
   - Define any field-specific terminology
   - Explain complex concepts in plain language
   - Note any formulas, methodologies, or frameworks introduced

6. Conclude with a brief section that identifies:
   - The 3-5 most significant timestamps for viewers with limited time
   - Any resources, references, or external links mentioned in the video

Please maintain the speaker's original meaning while organizing the information in a clear, accessible format."""
    response_notes = chat_model.invoke(prompt_notes)
    notes = response_notes.content
    
    # Send notes once ready
    yield "Notes Ready", notes
    
    # Process complete
    yield "Complete", {"summary": summary, "notes": notes}



