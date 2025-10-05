import React, { useState } from "react";
import {
  Upload,
  Sparkles,
  Hash,
  Type,
  Mic,
  Zap,
  Volume2,
  Save,
  Play,
  Clock,
  Download,
  FileText,
  BarChart3,
  Film,
  X,
  Pause,
} from "lucide-react";
type JobStatus = "processing" | "queued" | "completed";

type JobCardProps = {
  status: JobStatus;
  time: string;
  title: string;
  videoInfo: string;
  variations: string;
  progress?: number;
};

const JobCard: React.FC<JobCardProps> = ({
  status,
  time,
  title,
  videoInfo,
  variations,
  progress,
}) => {
  const statusStyles: Record<JobStatus, string> = {
    processing: "bg-purple-100 text-purple-700",
    queued: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
  };

  const isProcessing = status === "processing";
  const isQueued = status === "queued";
  const isCompleted = status === "completed";

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 space-y-3">
      {/* Header Row */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        {/* Left side: status + time */}
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded-full capitalize font-medium ${statusStyles[status]}`}
          >
            {status}
          </span>
          <span>{time}</span>
        </div>

        {/* Right side: action (if any) + close */}
        <div className="flex items-center gap-2">
          {isQueued && (
            <button className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded-md hover:bg-purple-700 transition">
              <Play size={12} /> Start Now
            </button>
          )}
          {isCompleted && (
            <button className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 transition">
              <Download size={12} /> Download ZIP
            </button>
          )}
          <button className="text-gray-400 hover:text-gray-600">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-gray-800">{title}</h3>
      <p className="text-xs text-gray-500">
        {videoInfo} • {variations}
      </p>

      {/* Job actions */}
      <div className="flex items-center gap-6 text-xs text-gray-600 font-medium">
        <button className="flex items-center gap-1 hover:text-purple-600 transition">
          <Download size={13} /> Download
        </button>
        <button className="flex items-center gap-1 hover:text-purple-600 transition">
          <FileText size={13} /> Transcribe
        </button>
        <button className="flex items-center gap-1 hover:text-purple-600 transition">
          <BarChart3 size={13} /> Analyze
        </button>
        <button className="flex items-center gap-1 hover:text-purple-600 transition">
          <Film size={13} /> Render
        </button>
      </div>

      {/* Progress Bar (Processing Only) */}
      {isProcessing && progress !== undefined && (
        <div className="pt-1">
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="h-2 bg-purple-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {progress}% complete{" "}
            <span className="text-gray-400">— ~20 minutes remaining</span>
          </p>
        </div>
      )}
    </div>
  );
};

const CreateJobPanel: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-8">
      {/* Header */}
      <h2 className="text-xl font-semibold text-gray-800">
        Create New Clip Generation Job
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-15">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Video Sources
          </label>

          <div className="flex mb-3  max-w-md">
            <input
              type="text"
              placeholder="Paste YouTube URL"
              className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <button className="bg-purple-600 text-white px-5 rounded-r-md text-sm font-medium hover:bg-purple-700">
              Add
            </button>
          </div>

          {/* Upload box */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-sm text-gray-500 cursor-pointer hover:bg-gray-50 transition">
            <Upload className="mx-auto mb-2 text-gray-400" size={24} />
            Upload MP4/MOV files
            <p className="text-xs text-gray-400 mt-1">
              Drag & drop or click to browse
            </p>
          </div>

          {/* Rights confirmation */}
          <div className="flex items-start gap-2 text-xs text-gray-600 border rounded-md p-3 bg-yellow-50 border-yellow-200 mt-5 leading-snug">
            <input type="checkbox" className="mt-0.5 accent-purple-600" />
            <span>
              <strong>Content Rights Confirmation</strong> — I confirm that I
              have the rights to reuse these videos for clip generation.
            </span>
          </div>
        </div>

        {/* Right: AI Instructions */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            AI Instructions
          </label>
          <textarea
            placeholder={`What do you want from these videos? (e.g., "Find every tip about negotiating salary", "Extract the funniest moments", "Get all product demonstrations")`}
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none min-h-[100px]"
          />

          {/* Suggestion tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {[
              "Extract key insights",
              "Find funny moments",
              "Get best quotes",
              "Viral-worthy clips",
            ].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700 cursor-pointer hover:bg-purple-100 hover:text-purple-700 transition"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Info Box */}
          <div className="bg-green-50 border border-green-200 rounded-md p-3 text-xs text-green-800 leading-relaxed mt-5">
            <strong className="block text-sm mb-1">
              UNLIMITED AI EXTRACTION
            </strong>
            Our AI analyzes your entire video content and extracts ALL segments
            that match your instructions. No “clips per video” limit!
            <br />
            <br />
            1hr course: 50+ clips • 3hr interview: 200+ clips • 6hr conference:
            500+ clips
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-200" />

      {/* Content Enhancement Options */}
      <div>
        <h3 className="text-sm font-semibold text-purple-700 flex items-center gap-1 mb-3">
          <Sparkles size={16} className="text-purple-600" />
          Content Enhancement Options
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          {[
            {
              label: "Emoji Enhancement",
              desc: "Add relevant emojis to emphasize key moments",
              icon: "😊",
            },
            {
              label: "Auto Hashtags",
              desc: "Generate trending hashtags automatically",
              icon: <Hash size={14} className="text-blue-500" />,
            },
            {
              label: "Title Cards",
              desc: "Add engaging title cards at the beginning",
              icon: <Type size={14} className="text-green-500" />,
            },
            {
              label: "Karaoke Captions",
              desc: "Word-by-word synchronized highlighting",
              icon: <Mic size={14} className="text-red-500" />,
            },
            {
              label: "Viral Effects",
              desc: "Add trending visual effects and transitions",
              icon: <Zap size={14} className="text-yellow-500" />,
            },
            {
              label: "Sound Effects",
              desc: "Add impact sounds and audio enhancements",
              icon: <Volume2 size={14} className="text-indigo-500" />,
            },
          ].map((opt) => (
            <label
              key={opt.label}
              className="flex items-start gap-2 border border-gray-200 rounded-md p-3 cursor-pointer hover:border-purple-400 transition"
            >
              <input
                type="radio"
                name="enhancement"
                className="mt-1 accent-purple-600"
              />
              <div>
                <p className="font-medium text-gray-800 flex items-center gap-1">
                  {opt.icon} {opt.label}
                </p>
                <p className="text-xs text-gray-500">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Advanced Enhancements */}
      <div>
        <h3 className="text-sm font-semibold text-purple-700 flex items-center gap-1 mb-3">
          <Sparkles size={16} className="text-purple-600" />
          Advanced Enhancements
        </h3>
        <div className="space-y-3 text-sm">
          {[
            {
              label: "Engagement Boost",
              desc: "Add hooks, questions, and call-to-actions",
            },
            {
              label: "AI Style Transfer",
              desc: "Apply trending visual styles automatically",
            },
          ].map((adv) => (
            <label
              key={adv.label}
              className="flex items-start gap-2 border border-gray-200 rounded-md p-3 cursor-pointer hover:border-purple-400 transition"
            >
              <input
                type="radio"
                name="advanced"
                className="mt-1 accent-purple-600"
              />
              <div>
                <p className="font-medium text-gray-800">{adv.label}</p>
                <p className="text-xs text-gray-500">{adv.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center text-xs text-gray-500">
          <Clock size={14} className="mr-1" />
          Processing time: 2–5 minutes per video
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-1 border border-gray-300 rounded-md text-xs font-medium hover:bg-gray-50 flex items-center gap-1 transition">
            <Save size={14} /> Save as Template
          </button>
          <button className="px-4 py-1 bg-purple-600 text-white rounded-md text-xs font-medium flex items-center gap-1 hover:bg-purple-700 transition">
            <Play size={14} /> Create Job
          </button>
        </div>
      </div>
    </div>
  );
};

const ActiveJobsPanel: React.FC = () => {
  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Active Jobs</h1>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded-md text-xs font-medium hover:bg-gray-50 flex items-center gap-1">
            <Pause size={12} /> Pause All
          </button>
          <button className="px-3 py-1 bg-green-600 text-white rounded-md text-xs font-medium flex items-center gap-1 hover:bg-green-700">
            <Download size={12} /> Download All
          </button>
        </div>
      </div>

      {/* Job Cards */}
      <JobCard
        status="processing"
        time="6:33:04 AM"
        title="Extract all segments about machine learning and AI from this tech podcast"
        videoInfo="1 video • 10 clips each"
        variations="3 variations"
        progress={65}
      />
      <JobCard
        status="queued"
        time="6:32:04 AM"
        title="Extract all segments about machine learning and AI from this tech podcast"
        videoInfo="1 video • 10 clips each"
        variations="3 variations"
      />
      <JobCard
      status="processing"
      time="6:33:04 AM"
      title="Extract all segments about machine learning and AI from this tech podcast"
      videoInfo="1 video • 10 clips"
      variations="3 variations"
      progress={65}
    />
    <JobCard
      status="queued"
      time="6:32:04 AM"
      title="Extract all segments about machine learning and AI from this tech podcast"
      videoInfo="1 video • 10 clips"
      variations="3 variations"
    />
    <JobCard
      status="completed"
      time="6:28:04 AM"
      title="Extract all segments about machine learning and AI from this tech podcast"
      videoInfo="1 video • 10 clips"
      variations="3 variations"
    />
    </div>
  );
};

export const JobSection: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const [activeTab, setActiveTab] = useState<"create" | "jobs">("create");

  if (isMobile) {
    return (
      <div className="mt-6">
        <div className="flex mb-4 border-b">
          <button
            onClick={() => setActiveTab("create")}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === "create"
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-gray-500"
            }`}
          >
            Create Job
          </button>
          <button
            onClick={() => setActiveTab("jobs")}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === "jobs"
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-gray-500"
            }`}
          >
            Active Jobs
          </button>
        </div>

        {activeTab === "create" ? <CreateJobPanel /> : <ActiveJobsPanel />}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <CreateJobPanel />
      <ActiveJobsPanel />
    </div>
  );
};
