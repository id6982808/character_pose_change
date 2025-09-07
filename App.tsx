
import React, { useState } from 'react';
import { GenerationMode, ImageFile } from './types';
import { generateImage } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import ModeSelector from './components/ModeSelector';
import ResultDisplay from './components/ResultDisplay';
import ActionButton from './components/ActionButton';

const App: React.FC = () => {
  const [baseImage, setBaseImage] = useState<ImageFile | null>(null);
  const [referenceImage, setReferenceImage] = useState<ImageFile | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [mode, setMode] = useState<GenerationMode>(GenerationMode.CLOTHES);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (setter: React.Dispatch<React.SetStateAction<ImageFile | null>>) => (file: File) => {
    setter({
      file,
      previewUrl: URL.createObjectURL(file),
    });
  };

  const handleGenerate = async () => {
    if (!baseImage || !referenceImage) {
      setError("キャラクター画像と参照画像を両方アップロードしてください。");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const resultBase64 = await generateImage(baseImage.file, referenceImage.file, mode);
      if (resultBase64) {
        setGeneratedImage(`data:image/png;base64,${resultBase64}`);
      } else {
          setError("AIからの画像生成に失敗しました。レスポンスに画像データが含まれていません。");
      }
    } catch (err) {
      console.error(err);
      setError(`エラーが発生しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const isGenerateDisabled = !baseImage || !referenceImage || isLoading;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
            AI Character Customizer
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            キャラクターの服装やポーズをAIで変化させよう
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            <ImageUploader 
              title="1. ベースキャラクター" 
              onImageUpload={handleImageUpload(setBaseImage)}
              imageUrl={baseImage?.previewUrl ?? null}
            />
            <ImageUploader 
              title="2. 服装・ポーズの参照"
              onImageUpload={handleImageUpload(setReferenceImage)}
              imageUrl={referenceImage?.previewUrl ?? null}
            />
          </div>

          {/* Controls and Result Section */}
          <div className="bg-gray-800/50 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-2xl shadow-indigo-900/20">
            <div className="space-y-6">
              <div>
                 <h2 className="text-xl font-semibold mb-3 text-indigo-300">3. モード選択</h2>
                 <ModeSelector selectedMode={mode} onModeChange={setMode} />
              </div>
              <ActionButton 
                onClick={handleGenerate} 
                disabled={isGenerateDisabled}
              >
                {isLoading ? '生成中...' : '4. 画像を生成'}
              </ActionButton>
            </div>
            
            <div className="flex-grow flex items-center justify-center">
                <ResultDisplay
                    isLoading={isLoading}
                    error={error}
                    generatedImage={generatedImage}
                />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
