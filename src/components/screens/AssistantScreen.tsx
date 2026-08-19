'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useI18n } from '@/lib/i18n';
import { useTextToSpeech } from '@/lib/hooks/useTextToSpeech';
import type { ChatMessage } from '@/lib/types';

const WELCOME_MESSAGES: Record<string, string> = {
  hi: 'नमस्ते! 🙏 मैं आपका **कृषि मित्र** हूँ। मैं आपकी हर सवाल का जवाब दे सकता हूँ — मौसम, फसल, मंडी भाव, रोग, खाद, सरकारी योजनाएं, या कुछ भी! बताइए, आज क्या जानना चाहते हैं? 🌾',
  en: 'Namaste! 🙏 I am your **Krishi Mitra** — your AI farming assistant. I can answer any question — weather, crops, market prices, diseases, fertilizers, government schemes, or anything else! What would you like to know today? 🌾',
  pa: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! 🙏 ਮੈਂ ਤੁਹਾਡਾ **ਕ੍ਰਿਸ਼ੀ ਮਿੱਤਰ** ਹਾਂ। ਮੈਂ ਤੁਹਾਡੇ ਕਿਸੇ ਵੀ ਸਵਾਲ ਦਾ ਜਵਾਬ ਦੇ ਸਕਦਾ ਹਾਂ! ਅੱਜ ਕੀ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ? 🌾',
  te: 'నమస్కారం! 🙏 నేను మీ **కృషి మిత్ర** ని. ఏదైనా అడగండి — వాతావరణం, పంటలు, మార్కెట్ ధరలు, వ్యాధులు, ఎరువులు, ప్రభుత్వ పథకాలు! ఈ రోజు ఏమి తెలుసుకోవాలనుకుంటున్నారు? 🌾',
};

export default function AssistantScreen() {
  const { t, language } = useI18n();
  const tts = useTextToSpeech(language);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0', role: 'assistant', content: WELCOME_MESSAGES[language] || WELCOME_MESSAGES.en,
      timestamp: new Date(), language, type: 'text', sources: ['Krishi Mitra AI'],
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isVoiceInput, setIsVoiceInput] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

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

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return;

    // Stop any current speech before new message
    tts.stop();
    setSpeakingMsgId(null);
    setApiError(null);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user', content: text.trim(),
      timestamp: new Date(), language, type: 'text',
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    const aiMsgId = (Date.now() + 1).toString();

    try {
      // Build conversation history for the API
      const chatHistory = [...messages, userMsg]
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }));

      // Cancel any previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory, language }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get response');
      }

      // Start streaming
      setIsThinking(false);
      setIsStreaming(true);

      // Add empty AI message that we'll stream into
      const aiMsg: ChatMessage = {
        id: aiMsgId,
        role: 'assistant', content: '',
        timestamp: new Date(), language, type: 'text',
        sources: ['Gemini AI', 'Krishi Mitra'],
      };
      setMessages(prev => [...prev, aiMsg]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') break;

              try {
                const parsed = JSON.parse(data);
                if (parsed.error) {
                  throw new Error(parsed.error);
                }
                if (parsed.text) {
                  fullResponse += parsed.text;
                  // Update the message content in real-time
                  setMessages(prev =>
                    prev.map(m =>
                      m.id === aiMsgId ? { ...m, content: fullResponse } : m
                    )
                  );
                }
              } catch (parseError) {
                // Skip non-JSON lines
                if (parseError instanceof SyntaxError) continue;
                throw parseError;
              }
            }
          }
        }
      }

      setIsStreaming(false);

      // Auto-speak the AI response after streaming is complete
      if (autoSpeak && fullResponse) {
        setTimeout(() => {
          speakMessage(aiMsgId, fullResponse);
        }, 400);
      }
    } catch (error) {
      setIsThinking(false);
      setIsStreaming(false);

      if (error instanceof Error && error.name === 'AbortError') return;

      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      setApiError(errorMessage);

      // Show error as AI message
      const errorAiMsg: ChatMessage = {
        id: aiMsgId,
        role: 'assistant',
        content: language === 'hi'
          ? `⚠️ माफ़ करें, कुछ गड़बड़ हुई। कृपया दोबारा कोशिश करें।\n\n**Error:** ${errorMessage}`
          : `⚠️ Sorry, something went wrong. Please try again.\n\n**Error:** ${errorMessage}`,
        timestamp: new Date(), language, type: 'text',
      };
      setMessages(prev => {
        // Replace if we already added an empty msg, otherwise add new
        const hasEmptyMsg = prev.some(m => m.id === aiMsgId);
        if (hasEmptyMsg) {
          return prev.map(m => m.id === aiMsgId ? errorAiMsg : m);
        }
        return [...prev, errorAiMsg];
      });
    }
  }, [language, tts, autoSpeak, speakMessage, messages, isStreaming]);

  const quickQuestions = [
    language === 'hi' ? 'क्या कल बारिश होगी?' : 'Will it rain tomorrow?',
    language === 'hi' ? 'आज टमाटर का भाव?' : "Today's tomato price?",
    language === 'hi' ? 'कपास में सफेद धब्बे' : 'White spots on cotton',
    language === 'hi' ? 'गेहूँ में कितना खाद?' : 'Wheat fertilizer dose?',
    language === 'hi' ? 'PM-KISAN योजना क्या है?' : 'What is PM-KISAN scheme?',
    language === 'hi' ? 'जैविक खेती कैसे करें?' : 'How to do organic farming?',
  ];

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 180px)' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-surface-800 flex items-center gap-2">
          <span>🤖</span> {t.chatTitle}
          {isStreaming && (
            <span className="text-xs font-normal text-primary-500 animate-pulse ml-1">● AI typing...</span>
          )}
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

      {/* API Error Banner */}
      {apiError && apiError.includes('API key') && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm text-amber-800">
          <strong>⚙️ Setup Required:</strong> Add your Gemini API key to <code className="bg-amber-100 px-1 rounded">.env.local</code> file.
          Get a free key at <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="underline font-semibold">aistudio.google.com/apikey</a>
        </div>
      )}

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

              {/* Streaming cursor effect */}
              <div className={`text-sm whitespace-pre-wrap leading-relaxed ${msg.role === 'user' ? 'text-white' : 'text-surface-700'}`}>
                {msg.content}
                {isStreaming && msg.id === messages[messages.length - 1]?.id && msg.role === 'assistant' && (
                  <span className="inline-block w-2 h-4 bg-primary-500 animate-pulse ml-0.5 rounded-sm" />
                )}
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
              {msg.role === 'assistant' && !isStreaming && msg.content && (
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
          disabled={isStreaming}
        />

        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isThinking || isStreaming}
          className="bg-primary-500 text-white w-12 h-12 rounded-xl flex items-center justify-center text-xl disabled:opacity-50 hover:bg-primary-600 transition-colors active:scale-95 flex-shrink-0"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
