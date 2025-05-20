from youtube_transcript_api import YouTubeTranscriptApi

def get_transcript_in_english(video_id):
    # Try to get English or translate from any language to English
    try:
        transcript = YouTubeTranscriptApi.list_transcripts(video_id)
        for t in transcript:
            if t.language_code != "en":
                return t.translate('en').fetch()
            else:
                return t.fetch()
    except Exception as e:
        return {"error": str(e)}
    
def get_video_id_from_url(url):
    return url.split("v=")[1]
