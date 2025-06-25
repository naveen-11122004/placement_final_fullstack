
import { Droplet } from "lucide-react";

interface WaterProgressProps {
  current: number;
  goal: number;
  percentage: number;
}

const WaterProgress = ({ current, goal, percentage }: WaterProgressProps) => {
  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* Outer ring */}
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-gray-200"
        />
        
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="url(#gradient)"
          strokeWidth="8"
          fill="none"
          strokeDasharray={`${2 * Math.PI * 45}`}
          strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
          className="transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#0891B2" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Droplet 
              className={`w-12 h-12 mx-auto transition-colors duration-500 ${
                percentage >= 100 ? 'text-green-500' : 'text-blue-500'
              }`}
              fill="currentColor"
            />
            {percentage >= 100 && (
              <div className="absolute -top-1 -right-1">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
            )}
          </div>
          <p className="text-sm font-semibold text-gray-700 mt-2">
            {Math.round(percentage)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default WaterProgress;
