from fastapi import FastAPI, Request as FastAPIRequest
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi import FastAPI, Request as FastAPIRequest, Query
from agent import  get_summary_and_notes_with_status
from pydantic import BaseModel
import asyncio
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Request(BaseModel):
    url: str

# @app.post("/summaryandnotes")
# async def get_summary_and_notes(request: Request):
#     summary = get_summary_from_url(request.url)
#     notes = get_notes_from_url(request.url)
#     return {"summary": summary, "notes": notes}

@app.post("/summaryandnotes/stream")
async def stream_summary_and_notes_post(request: Request):
    async def event_generator():
        async for status, data in get_summary_and_notes_with_status(request.url):
            yield f"data: {json.dumps({'status': status, 'data': data})}\n\n"
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream"
    )

# In backend/app/main.py, update the GET endpoint:


# Then update the GET endpoint function:
@app.get("/summaryandnotes/stream")
async def stream_summary_and_notes_get(url: str = Query(...)):
    async def event_generator():
        async for status, data in get_summary_and_notes_with_status(url):
            yield f"data: {json.dumps({'status': status, 'data': data})}\n\n"
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream"
    )




