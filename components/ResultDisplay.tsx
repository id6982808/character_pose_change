
import React from 'react';
import ActionButton from './ActionButton';

interface ResultDisplayProps {
    isLoading: boolean;
    error: string | null;
    generatedImage: string | null;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-400"></div>
        <p className="mt-4 text-lg font-semibold text-gray-300">AIが画像を生成中...</p>
        <p className="text-sm text-gray-500">これには数秒かかる場合があります</p>
    </div>
);

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, error, generatedImage }) => {
  
  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'generated-character.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
    
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-red-900/50 border border-red-700 rounded-lg">
        <p className="font-semibold text-red-300">エラー</p>
        <p className="text-sm text-red-400 mt-1">{error}</p>
      </div>
    );
  }

  if (generatedImage) {
    return (
      <div className="w-full flex flex-col items-center space-y-4">
        <h2 className="text-xl font-semibold text-indigo-300">生成結果</h2>
        <div className="w-full h-80 bg-black/30 rounded-xl overflow-hidden p-2">
            <img src={generatedImage} alt="Generated result" className="object-contain w-full h-full" />
        </div>
        <ActionButton onClick={handleDownload}>
            ダウンロード
        </ActionButton>
      </div>
    );
  }

  return (
    <div className="text-center text-gray-500">
      <p>生成された画像がここに表示されます</p>
    </div>
  );
};

export default ResultDisplay;
