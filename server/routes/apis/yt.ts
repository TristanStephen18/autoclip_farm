import { Router } from "express";
import path from "path";
import fs from "fs";
import ytdlp from "yt-dlp-exec";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import ffprobePath from "ffprobe-static";
import axios from "axios";
import FormData from "form-data";

const router = Router();

if (ffmpegPath) ffmpeg.setFfmpegPath(ffmpegPath);
if (ffprobePath.path) ffmpeg.setFfprobePath(ffprobePath.path);

const publicPath = path.join(process.cwd(), "./server/public");
const videosPath = path.join(publicPath, "videos");

if (!fs.existsSync(videosPath)) {
  fs.mkdirSync(videosPath, { recursive: true });
}

router.post("/convert", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "No URL provided" });

  try {
    const timestamp = Date.now();

    const videoFile = path.join(videosPath, `video_${timestamp}.mp4`);
    const audioFile = path.join(videosPath, `audio_${timestamp}.m4a`);
    const finalFilename = `video_${timestamp}_final.mp4`;
    const finalFilepath = path.join(videosPath, finalFilename);

    console.log("📥 Downloading video stream...");
    await ytdlp(url, {
      format: "bestvideo[height<=720][ext=mp4]",
      output: videoFile,
      noWarnings: true,
      noPart: true,
    });

    console.log("📥 Downloading audio stream...");
    await ytdlp(url, {
      format: "bestaudio[ext=m4a]",
      output: audioFile,
      noWarnings: true,
      noPart: true,
    });

    console.log("🎬 Merging video + audio with ffmpeg...");
    await new Promise<void>((resolve, reject) => {
      ffmpeg()
        .input(videoFile)
        .input(audioFile)
        .videoCodec("copy")
        .audioCodec("aac")
        .outputOptions(["-shortest", "-movflags +faststart"])
        .on("end", () => {
          console.log("✅ Merge complete:", finalFilepath);
          if (fs.existsSync(videoFile)) fs.unlinkSync(videoFile);
          if (fs.existsSync(audioFile)) fs.unlinkSync(audioFile);
          resolve();
        })
        .on("error", reject)
        .save(finalFilepath);
    });

    // 👉 Step 2: Send the merged file to caption-service
    console.log("📝 Sending file to caption-service for transcription...");
    const formData = new FormData();
    formData.append("file", fs.createReadStream(finalFilepath));

    const captionRes = await axios.post("http://localhost:8000/transcribe", formData, {
      headers: formData.getHeaders(),
    });

    const captions = captionRes.data; // Faster-Whisper output

    const info: any = await ytdlp(url, {
      dumpSingleJson: true,
      noWarnings: true,
      youtubeSkipDashManifest: true,
    });

    res.json({
      success: true,
      title: info.title,
      thumbnail: info.thumbnail,
      url: `/videos/${finalFilename}`,
      captions, // return transcription results along with video
    });
  } catch (err) {
    console.error("❌ Convert error:", err);
    res.status(500).json({ error: "Conversion failed", details: String(err) });
  }
});

export default router;
