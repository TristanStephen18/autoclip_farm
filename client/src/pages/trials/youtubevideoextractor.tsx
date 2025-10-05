import React, { useRef, useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

/* 🔄 Loader Overlay */
const LoaderOverlay: React.FC<{ text?: string }> = ({ text }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md z-30">
    <div className="relative">
      <div className="h-14 w-14 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
      <div className="absolute inset-0 rounded-full border border-blue-300/40 animate-pulse"></div>
    </div>
    <p className="text-blue-100 font-semibold text-lg mt-4 drop-shadow-md">
      {text || "Processing..."}
    </p>
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

  const convertMutation = useMutation({
    mutationFn: async (ytUrl: string) => {
      const res = await axios.post("http://localhost:3000/yt/convert", { url: ytUrl });
      return res.data;
    },
  });

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

  return (
    <div className="relative w-screen h-screen overflow-hidden text-gray-200 font-inter">
      {/* 🌌 Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] animate-gradient-x"></div>
      <div className="absolute -top-1/3 -left-1/3 w-[60rem] h-[60rem] bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-cyan-400/10 rounded-full blur-3xl animate-pulse-slower"></div>

      {/* ⚙️ Header */}
      <header className="relative z-10 flex justify-between items-center px-8 py-4 bg-white/10 backdrop-blur-md border-b border-white/10 shadow-sm">
        <h1 className="text-2xl font-bold tracking-wide text-white drop-shadow-md">
          <span className="text-blue-400">AI</span> Clip Studio
        </h1>
        <p className="text-xs text-gray-300 tracking-wider">
          ⚡ Powered by yt-dlp • ffmpeg • Gemini • React Query
        </p>
      </header>

      {/* 🧩 Main Workspace */}
      <main className="relative flex flex-1 z-10 backdrop-blur-sm">
        {(convertMutation.isPending || clipMutation.isPending) && (
          <LoaderOverlay
            text={
              convertMutation.isPending
                ? "Downloading and analyzing video..."
                : "Generating clips with AI magic..."
            }
          />
        )}

        {/* 🎥 LEFT PANEL */}
        <section className="w-[40%] border-r border-white/10 bg-white/5 backdrop-blur-md p-6 flex flex-col overflow-hidden">
          {/* YouTube input */}
          <form onSubmit={handleConvert} className="flex gap-2 mb-5">
            <input
              type="text"
              placeholder="Paste YouTube link..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!url || convertMutation.isPending}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold shadow-md hover:opacity-90 transition disabled:opacity-50"
            >
              {convertMutation.isPending ? "Processing..." : "Convert"}
            </button>
          </form>

          {/* Video Player + Transcript */}
          {convertMutation.isSuccess && (
            <>
              <video
                ref={videoRef}
                controls
                className="w-full rounded-xl shadow-lg border border-white/20 mb-3"
                src={`http://localhost:3000${convertMutation.data.url}`}
              />
              <p className="text-sm text-center text-gray-300 font-medium truncate mb-2">
                🎞️ {convertMutation.data.title}
              </p>
              <button
                onClick={() => setShowTranscript((s) => !s)}
                className="text-xs font-medium text-blue-400 hover:text-cyan-300 transition mb-3"
              >
                {showTranscript ? "Hide Transcript" : "Show Transcript"}
              </button>

              {showTranscript && (
                <div className="overflow-y-auto flex-1 pr-2 bg-black/20 rounded-lg border border-white/10 p-3">
                  <h4 className="text-sm font-semibold text-blue-300 mb-2">
                    🗒 Transcript
                  </h4>
                  <div className="space-y-1 text-xs text-gray-200 leading-relaxed">
                    {convertMutation.data.captions?.captions.map(
                      (c: { start: number; end: number; text: string }, i: number) => (
                        <p
                          key={i}
                          className="hover:bg-white/10 rounded-md px-2 py-1 transition cursor-default"
                        >
                          <span className="text-cyan-400 font-semibold mr-1">
                            [{c.start.toFixed(1)}s – {c.end.toFixed(1)}s]
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
        <section className="flex-1 flex flex-col bg-white/5 backdrop-blur-md p-6">
          {/* Controls */}
          <div className="p-6 bg-black/20 rounded-xl border border-white/10 shadow-lg mb-4">
            <h3 className="text-lg font-semibold text-blue-300 text-center mb-4">
              ✨ AI Clip Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <input
                type="text"
                placeholder='e.g. "Find moments about AI ethics"'
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="col-span-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />

              {/* Range */}
              <div className="flex flex-col items-center">
                <label className="text-xs text-gray-400 mb-1">Range (sec)</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={1}
                    value={range[0]}
                    onChange={(e) =>
                      setRange([Math.min(Number(e.target.value), range[1] - 1), range[1]])
                    }
                    className="w-16 bg-white/10 border border-white/20 rounded px-2 py-1 text-center text-white"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    min={range[0] + 1}
                    value={range[1]}
                    onChange={(e) =>
                      setRange([range[0], Math.max(Number(e.target.value), range[0] + 1)])
                    }
                    className="w-16 bg-white/10 border border-white/20 rounded px-2 py-1 text-center text-white"
                  />
                </div>
              </div>

              {/* Variations */}
              <div className="flex flex-col items-center">
                <label className="text-xs text-gray-400 mb-1">Variations</label>
                <input
                  type="number"
                  min={1}
                  value={variations}
                  onChange={(e) => setVariations(Number(e.target.value))}
                  className="w-16 bg-white/10 border border-white/20 rounded px-2 py-1 text-center text-white"
                />
              </div>

              {/* # Clips */}
              <div className="flex flex-col items-center">
                <label className="text-xs text-gray-400 mb-1"># Clips</label>
                <input
                  type="number"
                  min={1}
                  value={numberClips}
                  onChange={(e) => setNumberClips(Number(e.target.value))}
                  className="w-16 bg-white/10 border border-white/20 rounded px-2 py-1 text-center text-white"
                />
              </div>

              <div className="col-span-full flex justify-center mt-2">
                <button
                  onClick={handleClip}
                  disabled={clipMutation.isPending}
                  className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-8 py-2 rounded-lg font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-50"
                >
                  {clipMutation.isPending ? "Generating..." : "Generate Clips"}
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {clipMutation.isSuccess &&
              clipMutation.data?.clips?.map((clip: any, i: number) => (
                <div
                  key={i}
                  className="bg-white/10 border border-white/20 rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:border-blue-400/50 transition-all group"
                >
                  <video
                    controls
                    className="w-full aspect-video object-cover group-hover:opacity-90 transition"
                    src={`http://localhost:3000${clip.clipUrl}`}
                  />
                  <div className="p-3 text-xs text-gray-200">
                    <p className="font-medium text-blue-300">
                      ⏱ {clip.start.toFixed(1)}s → {clip.end.toFixed(1)}s
                    </p>
                    <p className="text-gray-400 mt-1 line-clamp-2">
                      💬 {clip.reason}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default YouTubeExtractor;
