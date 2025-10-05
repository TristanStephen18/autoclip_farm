// server/src/routes/ytClipRoute.ts
import { Router } from "express";
import path from "path";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const router = Router();
if (ffmpegPath) ffmpeg.setFfmpegPath(ffmpegPath);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

const publicPath = path.join(process.cwd(), "./server/public");
const videosPath = path.join(publicPath, "videos");
if (!fs.existsSync(videosPath)) fs.mkdirSync(videosPath, { recursive: true });

// Helper to call Gemini safely
async function callGemini(promptForGemini: string) {
  try {
    const response = await model.generateContent(promptForGemini);
    const text = response.response.text().trim();

    try {
      return JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      return match ? JSON.parse(match[0]) : null;
    }
  } catch (err) {
    console.error("❌ Gemini call failed:", err);
    return null;
  }
}

router.post("/clip", async (req, res) => {
  console.log("🎬 Clipping request received");

  try {
    let {
      prompt,
      videoPath,
      captions,
      range = [10, 30],
      variations = 1,
      number_clips = 1,
    } = req.body;

    if (!prompt || !videoPath)
      return res.status(400).json({ error: "Missing prompt or videoPath" });

    if (!Array.isArray(range) || range.length !== 2)
      throw new Error("Range must be [min, max] array");

    const [minRange, maxRange] = range.map(Number);
    const expectedTotal = number_clips * variations;

    const filename = path.basename(videoPath);
    const baseName = filename.replace(/\.[^/.]+$/, "");

    const captionText = captions.captions
      .map(
        (c: { start: number; end: number; text: string }) =>
          `[${c.start.toFixed(2)}s - ${c.end.toFixed(2)}s] ${c.text}`
      )
      .join("\n");

    // 🧠 Stronger + Smarter prompt
    const promptForGemini = `
You are an expert AI video editor.
Your task: find ${number_clips} * ${variations} = ${expectedTotal} timestamped clips from the transcript that best match the user's intent:
"${prompt}"

**Rules:**
- Each clip MUST be between ${minRange} and ${maxRange} seconds long.
- Whenever possible, aim for the **upper part of that range** (closer to ${maxRange}s) so the clip captures full context.
- Only make it shorter than ${maxRange}s if the speaker clearly finishes a sentence or topic earlier.
- Avoid cutting speech mid-sentence.
- Each variation should adjust timing slightly but remain natural and contextually relevant.
- Provide a short "reason" describing why that segment matches the prompt.
- Ensure all timestamps are numeric (in seconds) and sequentially valid.
- Respond **ONLY with valid JSON** — no Markdown, no commentary.

**Transcript:**
${captionText}

Return JSON strictly in this format:
{
  "clips": [
    {
      "clip_id": 1,
      "variations": [
        { "start": <float>, "end": <float>, "reason": "<string>" }
      ]
    }
  ]
}
`;

    console.log("💬 Sending to Gemini...");
    let parsed = await callGemini(promptForGemini);

    if (!parsed?.clips || !Array.isArray(parsed.clips)) {
      throw new Error("Invalid response structure from Gemini");
    }

    // Flatten all clips into single list
    let flatVariations = parsed.clips.flatMap((clip: any) =>
      clip.variations.map((v: any) => ({
        start: v.start,
        end: v.end,
        reason: v.reason,
        clip_id: clip.clip_id,
      }))
    );

    // 🔁 Retry logic for missing/out-of-range clips
    const regenerateClips = async (needed: number) => {
      console.log(
        `🔄 Regenerating ${needed} clips to fill missing or invalid results...`
      );
      const subPrompt = `
From the same transcript, find ${needed} additional unique segments related to:
"${prompt}"

Rules:
- Each segment must be between ${minRange} and ${maxRange} seconds long.
- Do not repeat earlier timestamps.
- Return valid JSON: 
{ "clips": [ { "start": <float>, "end": <float>, "reason": "<string>" } ] }
`;
      const regen = await callGemini(subPrompt);
      if (regen?.clips && Array.isArray(regen.clips)) {
        return regen.clips;
      }
      return [];
    };

    const cleanAndValidate = async () => {
      let validClips = flatVariations.filter(
        (v: any) =>
          typeof v.start === "number" &&
          typeof v.end === "number" &&
          v.end - v.start >= minRange &&
          v.end - v.start <= maxRange
      );

      // Retry missing if not enough valid
      let retries = 0;
      while (validClips.length < expectedTotal && retries < 2) {
        retries++;
        const needed = expectedTotal - validClips.length;
        const regen = await regenerateClips(needed);
        validClips.push(...regen);
      }

      // If still missing, auto-fill random fallback clips
      while (validClips.length < expectedTotal) {
        const randomStart = Math.random() * 200; // placeholder, could derive from video duration
        const randomDur = Math.random() * (maxRange - minRange) + minRange;
        validClips.push({
          start: randomStart,
          end: randomStart + randomDur,
          reason: "Fallback auto-generated clip to fill gap.",
        });
      }

      return validClips.slice(0, expectedTotal);
    };

    const finalClips = await cleanAndValidate();

    // 🎞️ FFmpeg clip creation
    const results: any[] = [];
    for (let i = 0; i < finalClips.length; i++) {
      const { start, end, reason } = finalClips[i];
      const duration = Math.max(1, end - start);

      const clipFilename = `${baseName}_clip_${
        i + 1
      }_${Date.now()}_${Math.floor(Math.random() * 10000)}.mp4`;
      const clipPath = path.join(videosPath, clipFilename);

      await new Promise<void>((resolve, reject) => {
        ffmpeg(path.join(videosPath, filename))
          .setStartTime(start)
          .setDuration(duration)
          .output(clipPath)
          .outputOptions(["-c copy", "-avoid_negative_ts make_zero"])
          .on("start", (cmd) => console.log("▶️ ffmpeg:", cmd))
          .on("end", () => {
            console.log(`✅ Clip ${i + 1}/${expectedTotal} created.`);
            results.push({
              clipUrl: `/videos/${clipFilename}`,
              start,
              end,
              reason,
            });
            resolve();
          })
          .on("error", (err) => {
            console.error("❌ ffmpeg error:", err);
            reject(err);
          })
          .run();
      });
    }

    res.json({
      success: true,
      total: results.length,
      expected: expectedTotal,
      clips: results,
    });
  } catch (err) {
    console.error("❌ Clip route error:", err);
    res
      .status(500)
      .json({ error: "Clip generation failed", details: String(err) });
  }
});

export default router;
