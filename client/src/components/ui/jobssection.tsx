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
  const statusColors: Record<JobStatus, string> = {
    processing: "bg-purple-100 text-purple-700",
    queued: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 space-y-2">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}
        >
          {status}
        </span>
        <span>{time}</span>
      </div>

      <h3 className="font-medium text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500">
        {videoInfo} • {variations}
      </p>

      {status === "processing" && progress !== undefined && (
        <div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-green-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-1">{progress}% complete</p>
        </div>
      )}

      <div className="flex gap-3 text-sm mt-2">
        {status === "queued" && (
          <button className="px-4 py-1 bg-purple-600 text-white rounded-sm text-xs font-medium">
            Start Now
          </button>
        )}
        {status === "completed" && (
          <button className="px-4 py-1 bg-green-600 text-white rounded-sm text-xs font-medium flex items-center gap-1">
            <Download size={14} /> Download ZIP
          </button>
        )}
      </div>
    </div>
  );
};


const CreateJobPanel: React.FC = () => (
  <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
    <h2 className="text-lg font-semibold">Create New Clip Generation Job</h2>

    <div>
      <label className="block text-sm font-medium mb-2">Video Sources</label>
      <div className="flex mb-3">
        <input
          type="text"
          placeholder="Paste YouTube URL"
          className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
        />
        <button className="bg-purple-600 text-white px-5 rounded-r-md text-sm font-medium hover:bg-purple-700">
          Add
        </button>
      </div>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-sm text-gray-500 cursor-pointer hover:bg-gray-50">
        <Upload className="mx-auto mb-2 text-gray-400" size={24} />
        Upload MP4/MOV files
      </div>
    </div>

    {/* AI Instructions */}
    <div>
      <label className="block text-sm font-medium mb-2">AI Instructions</label>
      <textarea
        placeholder="What do you want from these videos? (e.g., 'Find funny moments', 'Extract the key insights')"
        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
        rows={3}
      />
      <div className="flex flex-wrap gap-2 mt-3">
        <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">
          Extract key insights
        </span>
        <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">
          Find funny moments
        </span>
        <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">
          Get best quotes
        </span>
        <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">
          Viral-worthy clips
        </span>
      </div>
    </div>

    {/* Disclaimer */}
    <div className="flex items-start gap-2 text-xs text-gray-600 border rounded-md p-3 bg-yellow-50 border-yellow-200">
      <input type="checkbox" className="mt-0.5" />
      <span>
        Content Rights Confirmation — I confirm that I have the rights to use
        these videos for clip generation.
      </span>
    </div>

    {/* Unlimited Extraction */}
    <div className="bg-green-50 border border-green-200 rounded-md p-3 text-xs text-green-800 leading-relaxed">
      <strong className="block text-sm mb-1">UNLIMITED AI EXTRACTION</strong>
      Our AI analyzes your entire video content and extracts ALL segments that
      match your instructions. No “clips per video” limit!
      <br />
      <br />
      1hr course: 50+ clips • 3hr interview: 200+ clips • 6hr conference: 500+
      clips
    </div>

    {/* Content Enhancements */}
    <div>
      <h3 className="text-sm font-semibold text-purple-700 flex items-center gap-1 mb-3">
        <Sparkles size={16} className="text-purple-600" />
        Content Enhancement Options
      </h3>
      <div className="grid grid-cols-2 gap-3 text-sm">
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
            className="flex items-start gap-2 border border-gray-200 rounded-md p-3 cursor-pointer hover:border-purple-400"
          >
            <input type="radio" name="enhancement" className="mt-1" />
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
        <label className="flex items-start gap-2 border border-gray-200 rounded-md p-3 cursor-pointer hover:border-purple-400">
          <input type="radio" name="advanced" className="mt-1" />
          <div>
            <p className="font-medium text-gray-800">Engagement Boost</p>
            <p className="text-xs text-gray-500">
              Add hooks, questions, and call-to-actions
            </p>
          </div>
        </label>

        <label className="flex items-start gap-2 border border-gray-200 rounded-md p-3 cursor-pointer hover:border-purple-400">
          <input type="radio" name="advanced" className="mt-1" />
          <div>
            <p className="font-medium text-gray-800">AI Style Transfer</p>
            <p className="text-xs text-gray-500">
              Apply trending visual styles automatically
            </p>
          </div>
        </label>
      </div>
    </div>

    {/* Footer Action Bar */}
    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
      <div className="flex items-center text-xs text-gray-500">
        <Clock size={14} className="mr-1" />
        Processing time: 2–5 minutes per video
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-1 border border-gray-300 rounded-md text-xs font-medium hover:bg-gray-50 flex items-center gap-1">
          <Save size={14} /> Save as Template
        </button>
        <button className="px-4 py-1 bg-purple-600 text-white rounded-md text-xs font-medium flex items-center gap-1 hover:bg-purple-700">
          <Play size={14} /> Create Job
        </button>
      </div>
    </div>
  </div>
);


const ActiveJobsPanel: React.FC = () => (
  <div className="p-3 space-y-5">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-bold">Active Jobs</h2>
      <div className="flex gap-2">
        <button className="px-4 py-1 border rounded-sm text-xs hover:bg-gray-50 font-medium">
          Pause All
        </button>
        <button className="px-4 py-1 bg-green-600 text-white rounded-sm text-xs font-medium flex items-center gap-1">
          <Download size={14} /> Download All
        </button>
      </div>
    </div>

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
