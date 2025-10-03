import React, { useRef, useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const YouTubeExtractor: React.FC = () => {
  const [url, setUrl] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const convertMutation = useMutation({
    mutationFn: async (ytUrl: string) => {
      const res = await axios.post("http://localhost:3000/yt/convert", {
        url: ytUrl,
      });
      return res.data; 
    },
  });

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    convertMutation.mutate(url);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = 1.0;
    }
  }, [convertMutation.data?.url]);

  const handleCaptionClick = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center p-6">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4 text-center">
          🎥 YouTube Video Converter
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Paste a YouTube link and we’ll convert it to a 720p MP4 for playback
          and captions.
        </p>

        <form onSubmit={handleConvert} className="flex gap-2 mb-8">
          <input
            type="text"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!url || convertMutation.isPending}
            className="bg-red-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
          >
            {convertMutation.isPending ? "Converting..." : "Convert"}
          </button>
        </form>

        {convertMutation.isError && (
          <p className="text-red-500 text-center">
            ❌ Error: {(convertMutation.error as Error).message}
          </p>
        )}

        {convertMutation.isSuccess && convertMutation.data && (
          <div className="space-y-6">
            <div className="flex gap-4 items-center">
              <img
                src={convertMutation.data.thumbnail}
                alt="Thumbnail"
                className="w-40 h-24 rounded-lg object-cover shadow-md"
              />
              <div className="flex-1">
                <h2 className="font-bold text-lg text-gray-800 line-clamp-2">
                  {convertMutation.data.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  ✅ Your video is ready below
                </p>
              </div>
            </div>

            {/* Video Player */}
            <video
              ref={videoRef}
              controls
              className="w-full rounded-lg shadow-md"
              src={`http://localhost:3000${convertMutation.data.url}`}
            />

            {/* Captions */}
            {convertMutation.data.captions &&
              Array.isArray(convertMutation.data.captions.captions) && (
                <div className="bg-gray-100 p-4 rounded-lg max-h-60 overflow-y-auto">
                  <h3 className="font-semibold text-gray-700 mb-2">
                    📝 Captions
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {convertMutation.data.captions.captions.map(
                      (
                        c: { start: number; end: number; text: string },
                        i: number
                      ) => (
                        <li
                          key={i}
                          className="cursor-pointer hover:bg-gray-200 px-2 py-1 rounded"
                          onClick={() => handleCaptionClick(c.start)}
                        >
                          [{c.start.toFixed(1)}s → {c.end.toFixed(1)}s] {c.text}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
          </div>
        )}
      </div>

      <p className="mt-6 text-xs text-gray-400">
        ⚡ Powered by yt-dlp + ffmpeg + faster-whisper — for demo purposes only
      </p>
    </div>
  );
};

export default YouTubeExtractor;
