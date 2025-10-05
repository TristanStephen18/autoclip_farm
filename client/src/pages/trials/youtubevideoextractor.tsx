import React, { useRef, useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

/* 🔄 Fullscreen Loader Overlay */
const LoaderOverlay: React.FC<{ text?: string }> = ({ text }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-md z-30">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 mb-4"></div>
    <p className="text-gray-700 font-semibold text-lg">{text || "Processing..."}</p>
  </div>
);

const YouTubeExtractor: React.FC = () => {
  const [url, setUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [range, setRange] = useState<[number, number]>([10, 30]);
  const [variations, setVariations] = useState(1);
  const [numberClips, setNumberClips] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  /* 🎬 Convert Mutation */
  const convertMutation = useMutation({
    mutationFn: async (ytUrl: string) => {
      const res = await axios.post("http://localhost:3000/yt/convert", { url: ytUrl });
      return res.data;
    },
  });

  /* ✂️ Clip Mutation */
  const clipMutation = useMutation({
    mutationFn: async () => {
      if (!convertMutation.data?.url) throw new Error("No video available to clip.");

      const res = await axios.post("http://localhost:3000/ai/clip", {
        prompt,
        videoPath: convertMutation.data.url,
        captions: convertMutation.data.captions,
        range,
        variations,
        number_clips: numberClips,
      });
      return res.data;
    },
  });

  /* Auto-set video volume */
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = 1.0;
    }
  }, [convertMutation.data?.url]);

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    convertMutation.mutate(url);
  };

  const handleClip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    clipMutation.mutate();
  };

  /* 🧠 Layout */
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex flex-col overflow-hidden">
      {/* 🔝 Header */}
      <header className="bg-white shadow-md flex justify-between items-center px-6 py-3 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">
          🎬 YouTube AI Clip Generator
        </h1>
        <div className="text-xs text-gray-500">
          ⚡ yt-dlp • ffmpeg • Gemini API • React Query
        </div>
      </header>

      {/* 🌍 Main Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        {(convertMutation.isPending || clipMutation.isPending) && (
          <LoaderOverlay
            text={
              convertMutation.isPending
                ? "Downloading and processing video..."
                : "Analyzing transcript and generating clips..."
            }
          />
        )}

        {/* 🎥 LEFT PANEL */}
        <section className="w-[40%] bg-white border-r border-gray-200 flex flex-col p-6 overflow-hidden">
          {/* URL Input */}
          <form onSubmit={handleConvert} className="flex gap-3 mb-5">
            <input
              type="text"
              placeholder="Paste YouTube link..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!url || convertMutation.isPending}
              className="bg-red-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
            >
              {convertMutation.isPending ? "Converting..." : "Convert"}
            </button>
          </form>

          {/* Video Player */}
          {convertMutation.isSuccess && (
            <>
              <div className="sticky top-0 bg-white pb-3 z-10 border-b border-gray-100">
                <video
                  ref={videoRef}
                  controls
                  className="w-full rounded-xl shadow-md"
                  src={`http://localhost:3000${convertMutation.data.url}`}
                />
                <p className="mt-2 text-center text-gray-600 text-sm font-medium truncate">
                  🎥 {convertMutation.data.title}
                </p>

                {/* Toggle Transcript */}
                <button
                  onClick={() => setShowTranscript((s) => !s)}
                  className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700 underline transition"
                >
                  {showTranscript ? "Hide Transcript" : "Show Transcript"}
                </button>
              </div>

              {/* Transcript Section */}
              {showTranscript && (
                <div className="mt-3 overflow-y-auto flex-1 pr-2">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    🗒️ Transcript
                  </h4>
                  <div className="space-y-1 text-xs leading-relaxed text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {convertMutation.data.captions?.captions.map(
                      (c: { start: number; end: number; text: string }, i: number) => (
                        <p key={i} className="hover:bg-gray-100 rounded-md px-2 py-1 cursor-default">
                          <span className="text-blue-500 font-semibold mr-1">
                            [{c.start.toFixed(1)}s - {c.end.toFixed(1)}s]
                          </span>
                          {c.text}
                        </p>
                      )
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {/* ⚙️ RIGHT PANEL */}
        <section className="flex-1 flex flex-col bg-gray-50">
          {/* Controls */}
          <div className="p-6 border-b border-gray-200 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">
              ✨ AI Clip Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Prompt */}
              <input
                type="text"
                placeholder='e.g. "Find when he talks about AI"'
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none col-span-2"
              />

              {/* Range */}
              <div className="flex flex-col items-center">
                <label className="text-xs font-medium text-gray-600 mb-1">
                  Range (sec)
                </label>
                <div className="flex gap-1 items-center">
                  <input
                    type="number"
                    min={1}
                    value={range[0]}
                    onChange={(e) =>
                      setRange([Math.min(Number(e.target.value), range[1] - 1), range[1]])
                    }
                    className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-center text-sm"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    min={range[0] + 1}
                    value={range[1]}
                    onChange={(e) =>
                      setRange([range[0], Math.max(Number(e.target.value), range[0] + 1)])
                    }
                    className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-center text-sm"
                  />
                </div>
              </div>

              {/* Variations */}
              <div className="flex flex-col items-center">
                <label className="text-xs font-medium text-gray-600 mb-1">Variations</label>
                <input
                  type="number"
                  min={1}
                  value={variations}
                  onChange={(e) => setVariations(Number(e.target.value))}
                  className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-center text-sm"
                />
              </div>

              {/* # Clips */}
              <div className="flex flex-col items-center">
                <label className="text-xs font-medium text-gray-600 mb-1"># Clips</label>
                <input
                  type="number"
                  min={1}
                  value={numberClips}
                  onChange={(e) => setNumberClips(Number(e.target.value))}
                  className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-center text-sm"
                />
              </div>

              {/* Submit */}
              <div className="flex items-center justify-center col-span-full">
                <button
                  onClick={handleClip}
                  disabled={clipMutation.isPending}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 w-full md:w-auto"
                >
                  {clipMutation.isPending ? "Generating Clips..." : "Generate Clips"}
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto p-6">
            {clipMutation.isSuccess && clipMutation.data && (
              <>
                <h4 className="text-lg font-semibold text-gray-700 mb-4">
                  🎞️ Generated Clips ({clipMutation.data.total})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {clipMutation.data.clips.map((clip: any, i: number) => (
                    <div
                      key={i}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition"
                    >
                      <video
                        controls
                        className="w-full aspect-video object-cover"
                        src={`http://localhost:3000${clip.clipUrl}`}
                      />
                      <div className="p-3 text-xs text-gray-700">
                        <p className="font-medium">
                          ⏱️ {clip.start.toFixed(1)}s → {clip.end.toFixed(1)}s
                        </p>
                        <p className="text-gray-600 mt-1 line-clamp-2">💬 {clip.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default YouTubeExtractor;
