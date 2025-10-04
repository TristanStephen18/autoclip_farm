from fastapi import FastAPI, UploadFile, File
from faster_whisper import WhisperModel
import os
import shutil

app = FastAPI()

# Load a better model for speech detection
model = WhisperModel("base", device="cpu")

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    print("🚀 Starting transcription...")

    # First attempt: with VAD filtering
    segments, info = model.transcribe(
        temp_path,
        beam_size=5,
        word_timestamps=True,
        vad_filter=True,
        vad_parameters=dict(
            min_silence_duration_ms=300,  # tolerate short pauses
            speech_pad_ms=100,             # pad slightly before/after speech
        ),
        no_speech_threshold=0.6,  # more lenient
    )

    results = []

    for segment in segments:
        if segment.words and len(segment.words) > 0:
            start_time = segment.words[0].start
            end_time = segment.words[-1].end
        else:
            start_time = segment.start
            end_time = segment.end

        results.append({
            "start": round(start_time, 2),
            "end": round(end_time, 2),
            "text": segment.text.strip()
        })

    # 🧩 Fallback: if VAD filtered everything, retry without VAD
    if len(results) == 0:
        print("⚠️ No captions detected — retrying without VAD...")
        segments, info = model.transcribe(
            temp_path,
            beam_size=5,
            word_timestamps=True,
            vad_filter=False
        )
        for segment in segments:
            if segment.words and len(segment.words) > 0:
                start_time = segment.words[0].start
                end_time = segment.words[-1].end
            else:
                start_time = segment.start
                end_time = segment.end

            results.append({
                "start": round(start_time, 2),
                "end": round(end_time, 2),
                "text": segment.text.strip()
            })

    os.remove(temp_path)

    print(f"✅ Transcription complete: {len(results)} segments")

    return {
        "language": info.language,
        "duration": info.duration,
        "captions": results
    }
