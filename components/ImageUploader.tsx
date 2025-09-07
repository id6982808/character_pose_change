import React, { useRef, useCallback } from 'react';

interface ImageUploaderProps {
  title: string;
  onImageUpload: (file: File) => void;
  imageUrl: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ title, onImageUpload, imageUrl }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };
  
  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  return (
    <div className="flex flex-col space-y-3">
      <h2 className="text-xl font-semibold text-indigo-300">{title}</h2>
      <label
        className={`relative flex flex-col items-center justify-center w-full h-80 rounded-2xl border-2 border-dashed border-gray-600 hover:border-indigo-500 transition-colors duration-300 cursor-pointer bg-gray-800/50 group ${imageUrl ? '' : 'p-6 text-center'}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />
        {imageUrl ? (
          <img src={imageUrl} alt="Upload preview" className="object-contain w-full h-full rounded-xl" />
        ) : (
          <>
            <svg className="w-12 h-12 mb-4 text-gray-500 group-hover:text-indigo-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-gray-400 group-hover:text-gray-300">
              <span className="font-semibold">クリックしてアップロード</span> またはドラッグ＆ドロップ
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP</p>
          </>
        )}
      </label>
    </div>
  );
};

export default ImageUploader;