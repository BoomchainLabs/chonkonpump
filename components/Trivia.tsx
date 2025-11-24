
import React, { useState, useEffect } from 'react';
import { generateTriviaQuestions } from '../services/geminiService';
import { TriviaQuestion } from '../types';
import { TRIVIA_REWARD_PER_QUESTION } from '../constants';

interface TriviaProps {
  onClaimReward: (amount: number) => void;
}

const Trivia: React.FC<TriviaProps> = ({ onClaimReward }) => {
  const [gameState, setGameState] = useState<'intro' | 'loading' | 'playing' | 'result'>('intro');
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const startGame = async () => {
    setGameState('loading');
    setScore(0);
    setCurrentIndex(0);
    setClaimed(false);
    
    try {
      const q = await generateTriviaQuestions();
      setQuestions(q);
      setGameState('playing');
    } catch (e) {
      console.error(e);
      // Fallback to intro if failure, though service handles fallback data
      setGameState('intro'); 
    }
  };

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return; // Prevent changing answer
    setSelectedOption(index);
    setShowExplanation(true);
    
    if (index === questions[currentIndex].correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setGameState('result');
    }
  };

  const handleClaim = () => {
    setIsClaiming(true);
    // Simulate blockchain transaction processing time
    setTimeout(() => {
        const totalEarnings = score * TRIVIA_REWARD_PER_QUESTION;
        onClaimReward(totalEarnings);
        setIsClaiming(false);
        setClaimed(true);
    }, 1500);
  };

  const renderIntro = () => (
    <div className="text-center space-y-8 py-10">
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-violet-500 blur-3xl opacity-20 rounded-full"></div>
        <i className="fa-solid fa-gamepad text-8xl text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500 relative z-10 animate-float"></i>
      </div>
      
      <div>
        <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-4 tracking-tight">CHONKPUMP 9000 TRIVIA</h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
          Prove your knowledge of meme culture, crypto, and chonky animals. 
          Earn <span className="font-bold text-violet-500">{TRIVIA_REWARD_PER_QUESTION} CHONK</span> per correct answer!
        </p>
      </div>

      <button
        onClick={startGame}
        className="px-10 py-5 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black text-xl shadow-xl shadow-violet-500/30 hover:scale-105 active:scale-95 transition-all duration-300 group"
      >
        <i className="fa-solid fa-play mr-3 group-hover:animate-pulse"></i>
        START GAME
      </button>
    </div>
  );

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center h-[400px]">
      <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-6"></div>
      <p className="font-bold text-violet-500 animate-pulse text-lg">Generating Questions...</p>
      <p className="text-xs text-slate-400 mt-2">Consulting the Oracle</p>
    </div>
  );

  const renderPlaying = () => {
    const currentQ = questions[currentIndex];
    const isCorrect = selectedOption === currentQ.correctAnswerIndex;

    return (
      <div className="max-w-2xl mx-auto py-4">
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full mb-8 overflow-hidden">
          <div 
            className="bg-violet-500 h-full transition-all duration-500"
            style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question */}
        <div className="bg-white/50 dark:bg-black/20 p-6 rounded-3xl mb-8 border border-white/20">
          <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white text-center">
            {currentQ.question}
          </h3>
        </div>

        {/* Options */}
        <div className="grid gap-4 mb-8">
          {currentQ.options.map((opt, idx) => {
            let btnClass = "p-4 rounded-xl font-bold text-lg transition-all transform active:scale-[0.98] border-2 ";
            
            if (selectedOption === null) {
              btnClass += "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-violet-400 dark:hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200";
            } else {
              if (idx === currentQ.correctAnswerIndex) {
                btnClass += "bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/30";
              } else if (idx === selectedOption) {
                btnClass += "bg-red-500 border-red-500 text-white opacity-80";
              } else {
                btnClass += "bg-slate-100 dark:bg-slate-800 border-transparent opacity-50 text-slate-500 cursor-not-allowed";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={selectedOption !== null}
                className={btnClass}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Feedback / Next */}
        {showExplanation && (
          <div className="animate-[slideUp_0.3s_ease-out]">
            <div className={`p-4 rounded-2xl mb-6 flex items-start gap-3 ${isCorrect ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'}`}>
              <i className={`fa-solid ${isCorrect ? 'fa-circle-check' : 'fa-circle-xmark'} text-xl mt-0.5`}></i>
              <div>
                <p className="font-bold">{isCorrect ? 'CORRECT!' : 'OOF! WRONG CHONK.'}</p>
                <p className="text-sm opacity-90">{currentQ.explanation}</p>
              </div>
            </div>
            <button
              onClick={nextQuestion}
              className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-lg shadow-lg hover:opacity-90 transition-opacity"
            >
              {currentIndex === questions.length - 1 ? 'FINISH GAME' : 'NEXT QUESTION'}
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderResult = () => {
    const totalEarnings = score * TRIVIA_REWARD_PER_QUESTION;

    return (
      <div className="text-center py-8 animate-[fadeIn_0.5s_ease-out]">
         <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">GAME OVER</h2>
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-violet-500 to-fuchsia-600 mb-4">
                {score} / {questions.length}
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Correct Answers</p>
         </div>

         <div className="bg-gradient-to-br from-slate-800 to-black dark:from-slate-900 dark:to-slate-950 p-8 rounded-3xl max-w-md mx-auto text-white shadow-2xl relative overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 animate-pulse"></div>
            <div className="relative z-10">
                <p className="text-violet-300 font-bold uppercase tracking-wider text-sm mb-2">Total Earnings</p>
                <div className="text-4xl font-black mb-1">{totalEarnings.toLocaleString()}</div>
                <div className="text-sm font-bold opacity-60">CHONKPUMP TOKENS</div>
            </div>
         </div>

         {!claimed ? (
            <button
                onClick={handleClaim}
                disabled={isClaiming || score === 0}
                className="w-full max-w-sm py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black text-xl shadow-lg shadow-green-500/30 transform transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isClaiming ? (
                    <span><i className="fa-solid fa-spinner fa-spin mr-2"></i> CLAIMING...</span>
                ) : (
                    <span><i className="fa-solid fa-gift mr-2"></i> CLAIM TOKENS</span>
                )}
            </button>
         ) : (
             <div className="w-full max-w-sm mx-auto bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 py-4 rounded-xl font-bold border border-green-200 dark:border-green-800 animate-[bounce_0.5s]">
                 <i className="fa-solid fa-check mr-2"></i> CLAIMED SUCCESSFULLY!
             </div>
         )}

         <button 
           onClick={startGame}
           className="block w-full max-w-sm mx-auto mt-4 py-3 text-slate-500 dark:text-slate-400 font-bold hover:text-violet-500 dark:hover:text-violet-400 transition"
         >
            Play Again
         </button>
      </div>
    );
  };

  return (
    <div className="glass-panel p-6 md:p-8 rounded-3xl transition-colors duration-300 min-h-[500px]">
      {gameState === 'intro' && renderIntro()}
      {gameState === 'loading' && renderLoading()}
      {gameState === 'playing' && renderPlaying()}
      {gameState === 'result' && renderResult()}
    </div>
  );
};

export default Trivia;
