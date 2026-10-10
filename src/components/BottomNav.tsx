import React from 'react';
import { ScreenId } from '../types';

interface BottomNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  isWorkoutActive?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  isWorkoutActive
}) => {
  const tabs: { id: ScreenId; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'grid_view' },
    { id: 'tracker', label: 'Tracker', icon: 'play_circle' },
    { id: 'routines', label: 'Routines', icon: 'fitness_center' },
    { id: 'progress', label: 'Progress', icon: 'monitoring' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 w-full z-50 pb-safe bg-[#111417]/90 backdrop-blur-xl border-t border-[#1d2023] shadow-[0_-2px_12px_rgba(0,0,0,0.4)]">
      <div className="h-16 px-4 flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = currentScreen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`group relative flex flex-col items-center justify-center min-w-[56px] h-12 transition-all ${
                isActive ? 'text-[#c3f400]' : 'text-[#c4c9ac] hover:text-[#e1e2e7]'
              }`}
            >
              <div
                className={`flex items-center justify-center w-10 h-7 rounded-full transition-all duration-200 relative ${
                  isActive ? 'bg-[#c3f400]/15' : 'group-hover:bg-[#1d2023]'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">
                  {tab.icon}
                </span>
                {tab.id === 'tracker' && isWorkoutActive && !isActive && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#c3f400] animate-ping" />
                )}
              </div>
              <span className="font-label-sm text-[10px] uppercase tracking-wider mt-0.5">
                {tab.label}
              </span>
              <span
                className={`w-1 h-1 rounded-full bg-[#c3f400] transition-opacity duration-200 mt-0.5 ${
                  isActive ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
};
