from fastapi import FastAPI, UploadFile, File
from faster_whisper import WhisperModel
import os
import shutil

app = FastAPI()

model = WhisperModel("base", device="cpu")

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    segments, info = model.transcribe(temp_path, beam_size=5)

    results = []
    for segment in segments:
        results.append({
            "start": segment.start,
            "end": segment.end,
            "text": segment.text.strip()
        })

    os.remove(temp_path)

    return {
        "language": info.language,
        "duration": info.duration,
        "captions": results
    }

