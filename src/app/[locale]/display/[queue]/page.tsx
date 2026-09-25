'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Volume2, Clock } from 'lucide-react';

export default function TvDisplayPage({ params }: { params: { queue: string } }) {
  const [currentServing, setCurrentServing] = useState({ token: 'A-014', doctor: 'Dr. Suresh Kumar Sharma', room: 'Room 102 (1st Floor)' });
  const [nextTokens, setNextTokens] = useState(['A-015', 'A-016', 'A-017']);
  const [speechEnabled, setSpeechEnabled] = useState(true);

  const announceToken = (token: string) => {
    if ('speechSynthesis' in window && speechEnabled) {
      window.speechSynthesis.cancel();
      const text = `टोकन नंबर ${token}, कृपया डॉक्टर के कक्ष नंबर 102 में आएं। Token number ${token}, please report to Consultation Room 102.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 sm:p-12 flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-6">
        <div className="flex items-center space-x-4">
          <div className="bg-primary p-3 rounded-2xl text-white">
            <Eye className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-cyan-400 tracking-tight">
              प्रयाग आई केयर एवं लेजर सेंटर
            </h1>
            <span className="text-base sm:text-xl text-gray-400 font-semibold block mt-1">
              Prayag Eye Care & Laser Centre — Live Digital Token Board
            </span>
          </div>
        </div>

        <button
          onClick={() => announceToken(currentServing.token)}
          className="bg-accent text-black font-extrabold px-6 py-3 rounded-2xl text-sm flex items-center shadow hover:bg-teal-400 transition"
        >
          <Volume2 className="w-6 h-6 mr-2" />
          Announce Token (आवाज)
        </button>
      </div>

      {/* Main Grid Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto">
        {/* CURRENTLY SERVING (Giant Font) */}
        <div className="lg:col-span-8 bg-gradient-to-br from-blue-950 to-slate-900 border-4 border-primary rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <span className="text-xl sm:text-3xl font-extrabold text-amber-400 uppercase tracking-widest block">
            वर्तमान में देखा जा रहा है / NOW SERVING
          </span>

          <div className="text-7xl sm:text-9xl font-extrabold font-mono text-cyan-300 tracking-wider">
            {currentServing.token}
          </div>

          <div className="space-y-2 pt-4 border-t border-gray-800">
            <div className="text-2xl sm:text-4xl font-bold text-white">{currentServing.doctor}</div>
            <div className="text-lg sm:text-2xl font-bold text-emerald-400 font-mono">{currentServing.room}</div>
          </div>
        </div>

        {/* NEXT TOKENS LIST */}
        <div className="lg:col-span-4 bg-gray-900 border-2 border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-amber-400 uppercase border-b border-gray-800 pb-3 tracking-wider">
              अगले टोकन / NEXT IN QUEUE
            </h2>

            <div className="space-y-4 pt-4">
              {nextTokens.map((tok, idx) => (
                <div key={tok} className="bg-black/60 p-4 rounded-2xl border border-gray-800 flex justify-between items-center">
                  <span className="text-xs text-gray-400 font-bold">Position #{idx + 1}</span>
                  <span className="text-3xl font-extrabold font-mono text-amber-300">{tok}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/80 p-4 rounded-2xl text-xs text-gray-300 space-y-1">
            <span className="text-cyan-400 font-bold block flex items-center">
              <Clock className="w-4 h-4 mr-1" /> Notice:
            </span>
            <p>कृपया अपना टोकन नंबर आने पर अपने काउंटर/कमरा नंबर में उपस्थित हों।</p>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="text-center text-xs text-gray-500 border-t border-gray-800 pt-4">
        Prayag Eye Hospital Live Queue System • Automated Real-time Sync
      </div>
    </div>
  );
}
