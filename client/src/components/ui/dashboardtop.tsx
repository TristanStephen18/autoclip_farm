import React from "react";
import { PlayCircle, Download, Clock, TrendingUp } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
};

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon }) => {
  return (
    <div className="flex-1 bg-white rounded-lg p-4 flex items-center justify-between shadow-sm">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-2xl font-semibold">{value}</h2>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
      <div className="text-purple-600 bg-purple-50 p-2 rounded-lg">{icon}</div>
    </div>
  );
};

export const DashboardTop: React.FC = () => {
  return (
    <div className="w-full space-y-6">
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-semibold">Free Trial - 14 days remaining</h1>
          <p className="text-sm">
            Create unlimited AI video clips and export in HD quality. Upgrade to
            Pro for 4K exports and advanced features.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button className="px-4 py-2 bg-white/20 rounded-md text-sm hover:bg-white/30">
            Learn More
          </button>
          <button className="px-4 py-2 bg-white text-purple-600 rounded-md text-sm font-semibold hover:bg-gray-100">
            Upgrade Now
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Jobs"
            value="0"
            subtitle="Jobs created"
            icon={<PlayCircle size={24} />}
          />
          <StatCard
            title="Total Clips"
            value="4"
            subtitle="Clips generated"
            icon={<Download size={24} />}
          />
          <StatCard
            title="Active Jobs"
            value="0"
            subtitle="Currently processing"
            icon={<Clock size={24} />}
          />
          <StatCard
            title="Success Rate"
            value="0%"
            subtitle="Completion rate"
            icon={<TrendingUp size={24} />}
          />
        </div>
      </div>
    </div>
  );
};
