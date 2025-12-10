
import React, { useState, useEffect, useRef } from 'react';
import { ExplainerData } from '../types';
import { X, Sparkles, ArrowRight, Bot, User, Send } from 'lucide-react';
import { generateExplanation } from '../services/geminiService';

interface InteractiveExplainerProps {
    isOpen: boolean;
    onClose: () => void;
    data: ExplainerData | null;
}

interface Message {
    id: string;
    role: 'ai' | 'user';
    content: string;
}

const InteractiveExplainer: React.FC<InteractiveExplainerProps> = ({ isOpen, onClose, data }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && data) {
            setMessages([]);
            loadExplanation();
        } else {
            setMessages([]);
            setChatInput('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, data]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadExplanation = async () => {
        if (!data) return;
        setIsLoading(true);
        try {
            const result = await generateExplanation(data.title, data.context);
            setMessages([{ id: 'init', role: 'ai', content: result }]);
        } catch (e) {
            setMessages([{ id: 'error', role: 'ai', content: "I'm having trouble connecting to the network right now." }]);
        }
        setIsLoading(false);
    };

    const handleChatSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!chatInput.trim() || isLoading) return;
        
        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: chatInput };
        setMessages(prev => [...prev, userMsg]);
        setChatInput('');
        setIsLoading(true);

        const contextHistory = messages.map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`).join('\n');
        const currentContext = `
            Previous conversation:\n${contextHistory}\n
            User's new question: ${userMsg.content}
        `;

        try {
            const result = await generateExplanation(data?.title || 'Unknown', currentContext);
            setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'ai', content: result }]);
        } catch (error) {
             setMessages(prev => [...prev, { id: 'err', role: 'ai', content: "Sorry, I couldn't process that request." }]);
        }
        setIsLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300">
            <div className="w-full max-w-md h-full bg-holo-card/95 backdrop-blur-2xl border-l border-holo-border flex flex-col transform transition-transform duration-300 animate-slide-up shadow-2xl">
                
                {/* Header */}
                <div className="p-5 border-b border-holo-border flex items-center justify-between z-10 bg-holo-card/50 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-holo-primary to-holo-accent flex items-center justify-center shadow-[0_0_15px_rgba(204,255,0,0.2)]">
                             <Sparkles className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <h2 className="text-holo-text font-bold text-base leading-none">AI Insights</h2>
                            <p className="text-[10px] text-holo-muted uppercase tracking-wider mt-1">Powered by Gemini 2.5</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-holo-muted hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content / Chat Area */}
                <div className="flex-1 overflow-y-auto p-5 scroll-smooth custom-scrollbar space-y-6">
                    {data && messages.length === 0 && isLoading && (
                         <div className="mb-8 animate-pulse">
                            <h3 className="text-2xl font-bold text-holo-text mb-4 leading-tight">{data.title}</h3>
                            <div className="space-y-3">
                                <div className="h-4 bg-white/10 rounded w-full"></div>
                                <div className="h-4 bg-white/10 rounded w-5/6"></div>
                                <div className="h-4 bg-white/10 rounded w-4/6"></div>
                            </div>
                        </div>
                    )}

                    {data && messages.length > 0 && messages[0].role === 'ai' && (
                        <div className="mb-6 animate-fade-in">
                            <h3 className="text-2xl font-bold text-holo-text mb-3 leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                                {data.title}
                            </h3>
                            <div className="h-1 w-20 bg-gradient-to-r from-holo-primary to-transparent rounded-full mb-6"></div>
                        </div>
                    )}

                    {messages.map((msg, idx) => (
                        <div 
                            key={msg.id} 
                            className={`flex flex-col animate-slide-up ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            {msg.role === 'user' ? (
                                <div className="bg-holo-primary/10 border border-holo-primary/20 text-holo-text rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] text-sm shadow-[0_0_10px_rgba(204,255,0,0.05)]">
                                    {msg.content}
                                </div>
                            ) : (
                                <div className="prose prose-invert prose-sm max-w-none text-holo-text/90 leading-relaxed font-light">
                                    {msg.content.split('\n').map((line, i) => (
                                        <p key={i} className="mb-3 last:mb-0">{line}</p>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && messages.length > 0 && (
                        <div className="flex items-center gap-2 text-holo-muted text-xs animate-pulse pl-1">
                            <Bot className="w-3 h-3" />
                            <span>Thinking...</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-holo-card/80 backdrop-blur-xl border-t border-white/5 relative z-20">
                    {/* Prompt Suggestions */}
                    {messages.length < 3 && data?.promptSuggestions && (
                        <div className="mb-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide mask-fade-right">
                            {data.promptSuggestions.map((suggestion, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setChatInput(suggestion)}
                                    className="whitespace-nowrap px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-holo-primary/30 rounded-full text-[10px] text-holo-muted hover:text-holo-text transition-all uppercase tracking-wider font-bold shadow-sm"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleChatSubmit} className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-holo-primary/20 to-holo-accent/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Ask a follow-up question..."
                            className="w-full bg-black/40 text-holo-text rounded-xl pl-4 pr-12 py-3.5 border border-white/10 focus:border-holo-primary/50 focus:ring-1 focus:ring-holo-primary/50 focus:outline-none transition-all placeholder-white/30 text-sm relative z-10 backdrop-blur-sm"
                        />
                        <button 
                            type="submit" 
                            disabled={isLoading || !chatInput.trim()}
                            className="absolute right-2 top-2 p-1.5 bg-holo-primary text-black rounded-lg hover:opacity-90 disabled:opacity-50 disabled:bg-white/10 disabled:text-white/30 transition-all shadow-lg shadow-lime-500/20 z-20"
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </button>
                    </form>
                </div>
            </div>
            
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                .mask-fade-right {
                    mask-image: linear-gradient(to right, black 90%, transparent 100%);
                }
            `}</style>
        </div>
    );
};

export default InteractiveExplainer;
