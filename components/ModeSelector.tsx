
import React from 'react';
import { GenerationMode } from '../types';

interface ModeSelectorProps {
  selectedMode: GenerationMode;
  onModeChange: (mode: GenerationMode) => void;
}

const ModeButton: React.FC<{
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
}> = ({ onClick, isActive, children }) => {
  const baseClasses = "w-full text-center px-4 py-3 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800";
  const activeClasses = "bg-indigo-600 text-white shadow-lg";
  const inactiveClasses = "bg-gray-700 hover:bg-gray-600 text-gray-300";
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {children}
    </button>
  );
};

const ModeSelector: React.FC<ModeSelectorProps> = ({ selectedMode, onModeChange }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <ModeButton
        onClick={() => onModeChange(GenerationMode.CLOTHES)}
        isActive={selectedMode === GenerationMode.CLOTHES}
      >
        服装を着せ替える
      </ModeButton>
      <ModeButton
        onClick={() => onModeChange(GenerationMode.POSE)}
        isActive={selectedMode === GenerationMode.POSE}
      >
        ポーズを真似る
      </ModeButton>
    </div>
  );
};

export default ModeSelector;
