"use client";

import { useMemo } from "react";

interface HeatmapProps {
  streak?: number;
}

const getLevelColor = (level: number) => {
  switch (level) {
    case 1: return "bg-emerald-200";
    case 2: return "bg-emerald-400";
    case 3: return "bg-emerald-500";
    case 4: return "bg-emerald-600";
    default: return "bg-slate-100";
  }
};

export default function Heatmap({ streak = 12 }: HeatmapProps) {
  const weeks = 15; // Number of columns
  const daysPerWeek = 7;
  const totalBoxes = weeks * daysPerWeek;

  const data = useMemo(() => {
    const grid = [];
    let boxIndex = 0;
    const startGreenIndex = totalBoxes - streak;

    for (let col = 0; col < weeks; col++) {
      const week = [];
      for (let row = 0; row < daysPerWeek; row++) {
        if (boxIndex >= startGreenIndex) {
          // Part of the streak, color it green
          const rand = Math.random();
          let level = 1;
          if (rand > 0.8) level = 4;
          else if (rand > 0.5) level = 3;
          else if (rand > 0.2) level = 2;
          week.push(level);
        } else {
          // Not part of the streak, make it gray
          week.push(0);
        }
        boxIndex++;
      }
      grid.push(week);
    }
    return grid;
  }, [streak]);

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col">
      <div className="flex justify-between items-end mb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-800">{streak} Submissions</h2>
          <p className="text-[10px] font-medium text-slate-500">in the past year</p>
        </div>
        <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
          <span>Less</span>
          <div className="flex gap-0.5 mx-1">
            <div className="w-2.5 h-2.5 rounded-[2px] bg-slate-100" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-200" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-400" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-600" />
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-1 scrollbar-hide">
        <div className="flex gap-1" style={{ minWidth: "max-content" }}>
          {data.map((week, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-1">
              {week.map((level, rowIndex) => (
                <div 
                  key={`${colIndex}-${rowIndex}`} 
                  className={`w-3 h-3 rounded-[3px] ${getLevelColor(level)} transition-colors hover:ring-2 hover:ring-slate-300 hover:ring-offset-1`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <p className="text-[10px] font-bold text-emerald-600 mt-3 flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        Current Streak: {streak} Days
      </p>
    </div>
  );
}
