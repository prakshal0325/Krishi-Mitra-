'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useI18n } from '@/lib/i18n';
import { useTextToSpeech } from '@/lib/hooks/useTextToSpeech';
import type { ChatMessage } from '@/lib/types';

const sampleResponses: Record<string, { response: string; actions: { type: 'do_today' | 'avoid' | 'check'; title: string; description: string }[] }> = {
  default: {
    response: 'मैं आपका कृषि मित्र हूँ। मैं मौसम, फसल, मंडी भाव, रोग, मिट्टी, और सरकारी योजनाओं के बारे में मदद कर सकता हूँ। बताइए, आज क्या जानना चाहते हैं?\n\nI am your Krishi Mitra. I can help with weather, crops, market prices, diseases, soil, and government schemes. What would you like to know today?',
    actions: [],
  },
  rain: {
    response: '🌧️ **कल बारिश की संभावना है।**\n\nIMD अनुसार, आपके क्षेत्र में कल 15mm बारिश हो सकती है। नमी 82% तक बढ़ सकती है।\n\n**Tomorrow light-moderate rain is expected.** IMD forecasts ~15mm rainfall with humidity rising to 82%.\n\n📊 Source: IMD Agromet Advisory',
    actions: [
      { type: 'avoid', title: 'Do NOT spray today', description: 'Rain will wash away pesticide. Waste of money.' },
      { type: 'do_today', title: 'Clear drainage channels', description: 'Remove blockages before rain arrives.' },
      { type: 'avoid', title: 'Skip irrigation', description: 'Rain will provide natural watering.' },
    ],
  },
  price: {
    response: '💰 **आज के टमाटर भाव:**\n\n• आज़ादपुर मंडी (दिल्ली): ₹2,000/क्विंटल ↑12.5%\n• मदनपल्ले (AP): ₹1,300/क्विंटल ↓8.2%\n\n**Tomato prices today:**\n- Azadpur Mandi (Delhi): ₹2,000/quintal ↑12.5%\n- Madanapalle (AP): ₹1,300/quintal ↓8.2%\n\nPrices are trending upward in North India. Consider selling if transport cost is reasonable.\n\n📊 Source: AGMARKNET, e-NAM',
    actions: [
      { type: 'do_today', title: 'Consider selling to Azadpur', description: 'Prices are 12.5% higher than last week.' },
      { type: 'check', title: 'Check transport cost', description: 'Distance affects net profit. Calculate before deciding.' },
    ],
  },
  disease: {
    response: '🔍 **कपास में सफेद धब्बे** कई कारणों से हो सकते हैं:\n\n1. **पाउडरी मिल्ड्यू** — सबसे संभावित (70%)\n   - लक्षण: पत्तों पर सफेद पाउडर\n   - उपचार: कैराथेन 1ml/L पानी में छिड़काव\n\n2. **मीली बग** — कम संभावना (20%)\n   - लक्षण: सफेद रूई जैसा जमाव\n   - उपचार: प्रोफेनोफॉस 2ml/L\n\n⚠️ यह AI सुझाव है। गंभीर मामले में कृषि विशेषज्ञ से मिलें।\n\n📊 Source: ICAR, State Agri University',
    actions: [
      { type: 'do_today', title: 'Inspect affected area closely', description: 'Take close-up photos and check spread pattern.' },
      { type: 'check', title: 'Monitor for 2-3 days', description: 'If spreading, spray recommended fungicide.' },
    ],
  },
  fertilizer: {
    response: '🧪 **गेहूँ के लिए उर्वरक (1 एकड़):**\n\n• **बुवाई के समय:**\n  - DAP: 50 kg\n  - MOP: 20 kg\n  - ज़िंक सल्फेट: 10 kg\n\n• **पहली सिंचाई (21 दिन):**\n  - यूरिया: 35 kg\n\n• **दूसरी सिंचाई (45 दिन):**\n  - यूरिया: 30 kg\n\n**Wheat fertilizer per acre:**\nBasal: 50kg DAP + 20kg MOP + 10kg Zinc Sulphate\n1st irrigation: 35kg Urea\n2nd irrigation: 30kg Urea\n\n⚠️ Adjust based on soil test report.\n\n📊 Source: PAU Ludhiana, ICAR',
    actions: [
      { type: 'do_today', title: 'Get soil tested first', description: 'Apply fertilizer based on soil health card values.' },
    ],
  },
};

function getAIResponse(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes('rain') || lower.includes('बारिश') || lower.includes('barish') || lower.includes('mausam') || lower.includes('weather')) return sampleResponses.rain;
  if (lower.includes('price') || lower.includes('bhav') || lower.includes('भाव') || lower.includes('mandi') || lower.includes('मंडी') || lower.includes('sell') || lower.includes('बेच')) return sampleResponses.price;
  if (lower.includes('disease') || lower.includes('रोग') || lower.includes('spot') || lower.includes('धब्ब') || lower.includes('kira') || lower.includes('pest') || lower.includes('कीड़')) return sampleResponses.disease;
  if (lower.includes('fertilizer') || lower.includes('urea') || lower.includes('उर्वरक') || lower.includes('खाद') || lower.includes('dap')) return sampleResponses.fertilizer;
  return sampleResponses.default;
}

export default function AssistantScreen() {
  const { t, language } = useI18n();
  const tts = useTextToSpeech(language);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0', role: 'assistant', content: sampleResponses.default.response,
      timestamp: new Date(), language, type: 'text', sources: ['Krishi Mitra AI'],
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isVoiceInput, setIsVoiceInput] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-speak new AI messages
  const speakMessage = useCallback((msgId: string, content: string) => {
    setSpeakingMsgId(msgId);
    tts.speak(content, language);
  }, [tts, language]);

  // Track when TTS stops
  useEffect(() => {
    if (!tts.isSpeaking && speakingMsgId) {
      // Small delay to avoid flicker
      const timer = setTimeout(() => {
        if (!tts.isSpeaking) {
          setSpeakingMsgId(null);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [tts.isSpeaking, speakingMsgId]);

  const handleStopSpeaking = () => {
    tts.stop();
    setSpeakingMsgId(null);
  };

  // Voice input handler
  const handleVoiceInput = () => {
    if (isVoiceInput) return;
    setIsVoiceInput(true);

    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognitionCtor = (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionCtor();
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'pa' ? 'pa-IN' : language === 'te' ? 'te-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.continuous = false;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          sendMessage(transcript);
        }
      };

      recognition.onend = () => setIsVoiceInput(false);
      recognition.onerror = () => setIsVoiceInput(false);
      recognition.start();
    } else {
      // Demo fallback
      setTimeout(() => {
        const demoQ = language === 'hi' ? 'क्या कल बारिश होगी?' : 'Will it rain tomorrow?';
        sendMessage(demoQ);
        setIsVoiceInput(false);
      }, 2000);
    }
  };

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    // Stop any current speech before new message
    tts.stop();
    setSpeakingMsgId(null);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user', content: text.trim(),
      timestamp: new Date(), language, type: 'text',
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    setTimeout(() => {
      const aiResult = getAIResponse(text);
      const aiMsgId = (Date.now() + 1).toString();
      const aiMsg: ChatMessage = {
        id: aiMsgId,
        role: 'assistant', content: aiResult.response,
        timestamp: new Date(), language, type: 'text',
        sources: ['ICAR', 'IMD', 'AGMARKNET'],
        confidence: 82,
        actions: aiResult.actions.map(a => ({ ...a, icon: a.type === 'do_today' ? '✅' : a.type === 'avoid' ? '🚫' : '🔍', priority: 'medium' as const })),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsThinking(false);

      // Auto-speak the AI response
      if (autoSpeak) {
        // Small delay to let the message render first
        setTimeout(() => {
          speakMessage(aiMsgId, aiResult.response);
        }, 400);
      }
    }, 1500 + Math.random() * 1000);
  }, [language, tts, autoSpeak, speakMessage]);

  const quickQuestions = [
    language === 'hi' ? 'क्या कल बारिश होगी?' : 'Will it rain tomorrow?',
    language === 'hi' ? 'आज टमाटर का भाव?' : "Today's tomato price?",
    language === 'hi' ? 'कपास में सफेद धब्बे' : 'White spots on cotton',
    language === 'hi' ? 'गेहूँ में कितना खाद?' : 'Wheat fertilizer dose?',
  ];

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 180px)' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-surface-800 flex items-center gap-2">
          <span>🤖</span> {t.chatTitle}
        </h2>

        {/* Auto-speak toggle + Speed control */}
        <div className="flex items-center gap-2">
          {/* Speed control */}
          <div className="flex items-center bg-surface-100 rounded-full px-2 py-1">
            <button
              onClick={() => tts.setRate(Math.max(0.5, tts.rate - 0.2))}
              className="w-7 h-7 rounded-full flex items-center justify-center text-surface-600 hover:bg-surface-200 transition-colors text-xs font-bold"
              title="Slower"
            >
              🐢
            </button>
            <span className="text-[10px] text-surface-500 w-8 text-center font-medium">{tts.rate.toFixed(1)}x</span>
            <button
              onClick={() => tts.setRate(Math.min(1.5, tts.rate + 0.2))}
              className="w-7 h-7 rounded-full flex items-center justify-center text-surface-600 hover:bg-surface-200 transition-colors text-xs font-bold"
              title="Faster"
            >
              🐇
            </button>
          </div>

          {/* Auto-speak toggle */}
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              autoSpeak
                ? 'bg-primary-100 text-primary-700 border border-primary-200'
                : 'bg-surface-100 text-surface-500 border border-surface-200'
            }`}
            title={autoSpeak ? 'Auto-speak ON' : 'Auto-speak OFF'}
          >
            {autoSpeak ? '🔊' : '🔇'}
            <span className="hidden sm:inline">{autoSpeak ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => sendMessage(q)}
              className="bg-primary-50 text-primary-700 px-3 py-2 rounded-full text-sm font-medium border border-primary-200 hover:bg-primary-100 transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 space-y-4 mb-4 overflow-y-auto">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 ${
              msg.role === 'user'
                ? 'bg-primary-500 text-white rounded-br-md'
                : 'bg-white shadow-sm border border-surface-100 rounded-bl-md'
            }`}>
              {/* Speaking indicator for this message */}
              {speakingMsgId === msg.id && tts.isSpeaking && (
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-primary-100">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div
                        key={i}
                        className="w-1 bg-primary-500 rounded-full animate-pulse"
                        style={{
                          height: `${8 + Math.random() * 12}px`,
                          animationDelay: `${i * 0.1}s`,
                          animationDuration: `${0.3 + Math.random() * 0.4}s`,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-primary-600 font-medium">
                    {language === 'hi' ? 'बोल रहा हूँ...' : 'Speaking...'}
                  </span>
                </div>
              )}

              <div className={`text-sm whitespace-pre-wrap leading-relaxed ${msg.role === 'user' ? 'text-white' : 'text-surface-700'}`}>
                {msg.content}
              </div>

              {/* Action Cards */}
              {msg.actions && msg.actions.length > 0 && (
                <div className="mt-3 space-y-2">
                  {msg.actions.map((action, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border text-sm ${
                        action.type === 'do_today' ? 'bg-green-50 border-green-200 text-green-800' :
                        action.type === 'avoid' ? 'bg-red-50 border-red-200 text-red-800' :
                        'bg-amber-50 border-amber-200 text-amber-800'
                      }`}
                    >
                      <span className="font-semibold">{action.icon} {action.title}</span>
                      <p className="text-xs mt-0.5 opacity-80">{action.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Voice Controls + Sources for AI messages */}
              {msg.role === 'assistant' && (
                <div className="mt-3 pt-2 border-t border-surface-100">
                  {/* Voice playback controls */}
                  <div className="flex items-center gap-1.5 mb-2">
                    {speakingMsgId === msg.id && tts.isSpeaking ? (
                      <>
                        {/* Pause / Stop while speaking */}
                        <button
                          onClick={() => tts.isPaused ? tts.resume() : tts.pause()}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200 hover:bg-amber-100 transition-all active:scale-95"
                        >
                          {tts.isPaused ? '▶️' : '⏸️'} {tts.isPaused ? (language === 'hi' ? 'जारी रखें' : 'Resume') : (language === 'hi' ? 'रुकें' : 'Pause')}
                        </button>
                        <button
                          onClick={handleStopSpeaking}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-medium border border-red-200 hover:bg-red-100 transition-all active:scale-95"
                        >
                          ⏹️ {language === 'hi' ? 'बंद करें' : 'Stop'}
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Play / Replay button */}
                        <button
                          onClick={() => speakMessage(msg.id, msg.content)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-xs font-medium border border-primary-200 hover:bg-primary-100 transition-all active:scale-95"
                        >
                          🔊 {language === 'hi' ? 'सुनें' : language === 'pa' ? 'ਸੁਣੋ' : language === 'te' ? 'వినండి' : 'Listen'}
                        </button>
                        <button
                          onClick={() => { tts.setRate(0.7); speakMessage(msg.id, msg.content); }}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-50 text-surface-600 text-xs font-medium border border-surface-200 hover:bg-surface-100 transition-all active:scale-95"
                        >
                          🐢 {language === 'hi' ? 'धीमे' : 'Slow'}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Sources & Confidence */}
                  {msg.sources && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {msg.confidence && (
                        <span className="text-[10px] bg-surface-100 text-surface-500 px-2 py-0.5 rounded-full">
                          🎯 {msg.confidence}% {t.cropDoctorConfidence}
                        </span>
                      )}
                      {msg.sources.map((src, i) => (
                        <span key={i} className="text-[10px] bg-surface-100 text-surface-500 px-2 py-0.5 rounded-full">
                          📄 {src}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Thinking indicator */}
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-white shadow-sm border border-surface-100 rounded-2xl rounded-bl-md p-4">
              <div className="flex items-center gap-2 text-surface-500">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
                <span className="text-sm">{t.chatThinking}</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Global speaking indicator bar */}
      {tts.isSpeaking && (
        <div className="bg-primary-50 border border-primary-200 rounded-xl px-4 py-2 mb-2 flex items-center justify-between animate-slide-up">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className="w-1 bg-primary-500 rounded-full animate-pulse"
                  style={{ height: `${6 + Math.random() * 10}px`, animationDelay: `${i * 0.12}s` }}
                />
              ))}
            </div>
            <span className="text-xs text-primary-700 font-medium">
              {language === 'hi' ? '🔊 बोल रहा हूँ...' : language === 'pa' ? '🔊 ਬੋਲ ਰਿਹਾ ਹਾਂ...' : language === 'te' ? '🔊 చెబుతున్నాను...' : '🔊 Speaking...'}
            </span>
          </div>
          <button
            onClick={handleStopSpeaking}
            className="text-xs text-red-600 font-medium px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
          >
            ⏹ {language === 'hi' ? 'बंद' : 'Stop'}
          </button>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-[10px] text-surface-400 text-center mb-2 italic">{t.chatDisclaimer}</p>

      {/* Input Bar */}
      <div className="flex items-center gap-2 bg-white rounded-xl border border-surface-200 p-2 shadow-sm sticky bottom-20">
        {/* Voice input button */}
        <button
          onClick={handleVoiceInput}
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all active:scale-95 flex-shrink-0 ${
            isVoiceInput
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-primary-50 text-primary-600 hover:bg-primary-100 border border-primary-200'
          }`}
          aria-label={t.chatVoice}
        >
          🎙️
        </button>

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
          placeholder={t.chatPlaceholder}
          className="flex-1 px-3 py-3 text-base bg-transparent outline-none"
        />

        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isThinking}
          className="bg-primary-500 text-white w-12 h-12 rounded-xl flex items-center justify-center text-xl disabled:opacity-50 hover:bg-primary-600 transition-colors active:scale-95 flex-shrink-0"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
