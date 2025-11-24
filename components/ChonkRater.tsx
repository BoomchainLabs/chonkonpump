import React, { useState, useRef } from 'react';
import { rateChonkImage } from '../services/geminiService';
import { ChonkRating } from '../types';

const ChonkRater: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rating, setRating] = useState<ChonkRating | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File too chonky (large). Limit is 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSelectedImage(base64String);
        setRating(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRate = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setError(null);
    try {
      // Extract base64 data and mime type
      const match = selectedImage.match(/^data:(.*);base64,(.*)$/);
      if (!match) throw new Error("Invalid image data");
      
      const mimeType = match[1];
      const base64Data = match[2];

      const result = await rateChonkImage(base64Data, mimeType);
      setRating(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel p-4 md:p-8 rounded-3xl max-w-2xl mx-auto w-full text-center">
      <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-600 mb-6">
        Rate My Chonk
      </h2>
      
      <div className="space-y-6">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`border-4 border-dashed rounded-2xl h-48 md:h-64 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-white/40 ${selectedImage ? 'border-violet-400' : 'border-gray-300'}`}
        >
          {selectedImage ? (
            <img src={selectedImage} alt="Preview" className="h-full w-full object-contain rounded-xl" />
          ) : (
            <div className="text-gray-500 p-4">
              <i className="fa-solid fa-cloud-arrow-up text-4xl md:text-5xl mb-4 text-violet-300"></i>
              <p className="font-bold text-sm md:text-base">Click to upload your Chonk</p>
              <p className="text-xs md:text-sm opacity-60">Supports JPG, PNG</p>
            </div>
          )}
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />

        {error && <p className="text-red-500 font-bold bg-red-100 p-2 rounded-lg text-sm">{error}</p>}

        <button
          onClick={handleRate}
          disabled={!selectedImage || isLoading}
          className="w-full bg-gradient-to-r from-pink-500 to-orange-400 text-white font-black py-3 md:py-4 rounded-xl text-lg md:text-xl shadow-lg transform transition active:scale-95 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span><i className="fa-solid fa-spinner fa-spin mr-2"></i> Analyzing...</span>
          ) : (
            "JUDGE ME"
          )}
        </button>

        {rating && (
          <div className="mt-8 bg-white rounded-2xl p-4 md:p-6 shadow-xl border-4 border-yellow-300 transform animate-float">
            <div className="flex justify-center mb-4">
              {[...Array(10)].map((_, i) => (
                <i key={i} className={`fa-solid fa-star text-xl md:text-2xl ${i < rating.score ? 'text-yellow-400' : 'text-gray-200'}`}></i>
              ))}
            </div>
            <div className="text-5xl md:text-6xl font-black text-violet-600 mb-2">{rating.score}/10</div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 uppercase">{rating.verdict}</h3>
            <p className="text-base md:text-lg italic text-slate-600 bg-slate-100 p-4 rounded-xl">
              "{rating.humorousTake}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChonkRater;