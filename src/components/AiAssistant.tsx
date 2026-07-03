import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Bot, Sparkles, AlertCircle, ArrowRight, CornerDownLeft, RefreshCcw } from "lucide-react";
import { Hive } from "../types";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

interface AiAssistantProps {
  hives: Hive[];
  selectedHiveId: string;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ hives, selectedHiveId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentHiveId, setCurrentHiveId] = useState(selectedHiveId || hives[0]?.id || "");
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested pre-prompts
  const suggestions = [
    { text: "Analyser le risque d'essaimage", icon: "🐝" },
    { text: "La température du couvain est-elle stable ?", icon: "🌡️" },
    { text: "Évaluer la tendance du poids", icon: "⚖️" },
    { text: "Diagnostiquer la détresse de la Ruche Gamma", icon: "🚨" },
  ];

  const selectedHive = hives.find(h => h.id === currentHiveId);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Load welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const hiveName = selectedHive ? selectedHive.name : "vos ruches";
      setMessages([
        {
          id: "welcome",
          sender: "ai",
          text: `### 🌿 Diagnostics BeeGuard IA Actifs
 
Bonjour, Apiculteur ! Je suis votre co-pilote expert **BeeGuard AI**. Je me suis synchronisé avec la télémétrie IoT de **${hiveName}** en temps réel.
 
Posez-moi des questions sur :
- **La santé du nid à couvain** (stabilité thermique & de l'humidité)
- **Les préparatifs d'essaimage** ou anomalies sonores
- **Le flux de nectar / gains de poids**
- **Le diagnostic de survie de la reine**
 
*Sélectionnez un raccourci de diagnostic ci-dessous, ou saisissez votre propre demande d'analyse.*`,
          timestamp: new Date()
        }
      ]);
    }
  }, [currentHiveId]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    setError(null);
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          hiveId: currentHiveId,
          userMessage: textToSend
        })
      });

      if (!response.ok) {
        throw new Error("Échec de communication avec le cœur de BeeGuard IA.");
      }

      const data = await response.json();
      
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: data.reply,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      setError("Passerelle de diagnostic IA momentanément encombrée. Veuillez vérifier la configuration de l'API.");
      const aiMsg: Message = {
        id: `ai-err-${Date.now()}`,
        sender: "ai",
        text: `### ⚠️ Liaison Diagnostic en Veille\n\nJ'ai rencontré un problème lors de l'interrogation de l'API Gemini. \n\n**Résumé des diagnostics actuels de la ruche :**\n- **Température :** ${selectedHive?.telemetry.temperature}°C (${selectedHive?.telemetry.temperature! < 32 ? "Grappe thermique sous-optimale" : "Limites du nid à couvain sûres"})\n- **Humidité :** ${selectedHive?.telemetry.humidity}% (Idéal pour les cycles de butinage)\n- **Poids :** ${selectedHive?.telemetry.weight} kg\n- **Niveau d'activité :** ${selectedHive?.telemetry.beeActivity}/100\n\n*Veuillez configurer votre clé GEMINI_API_KEY dans l'onglet Paramètres > Secrets pour activer l'analyse IA personnalisée.*`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const parseMarkdown = (text: string) => {
    // Simple robust markdown parsing helper for visual showcase
    const lines = text.split("\n");
    return lines.map((line, i) => {
      // Headers
      if (line.startsWith("### ")) {
        return <h3 key={i} className="text-lg font-bold text-gray-900 mt-3 mb-1 font-sans">{line.replace("### ", "")}</h3>;
      }
      if (line.startsWith("## ")) {
        return <h2 key={i} className="text-xl font-bold text-gray-900 mt-4 mb-2 font-sans">{line.replace("## ", "")}</h2>;
      }
      if (line.startsWith("# ")) {
        return <h1 key={i} className="text-2xl font-bold text-gray-900 mt-5 mb-3 font-sans">{line.replace("# ", "")}</h1>;
      }
      // Bullet points
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const cleanText = line.trim().substring(2);
        return (
          <li key={i} className="ml-4 list-disc text-sm text-gray-700 leading-relaxed font-sans mb-1">
            {renderInlineMarkdown(cleanText)}
          </li>
        );
      }
      // Paragraph with support for bold **
      return (
        <p key={i} className="text-sm text-gray-700 leading-relaxed font-sans mb-2.5">
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  };

  const renderInlineMarkdown = (text: string) => {
    // Handles simple bold text **something**
    const parts = text.split(/\*\*([^*]+)\*\"/g);
    // Double check normal regex for safety
    const safeParts = text.split(/\*\*([^*]+)\*\*/g);
    return safeParts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-semibold text-gray-900">{part}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA]" id="ai-assistant-panel">
      {/* Target Hive Selector */}
      <div className="bg-white px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm rounded-t-[22px]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 tracking-tight">Cœur de BeeGuard IA</h2>
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Diagnostics en temps réel connectés
            </p>
          </div>
        </div>
        
        {/* Hive dropdown switcher */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-sans font-medium text-gray-400">Cible :</label>
          <select
            value={currentHiveId}
            onChange={(e) => {
              setCurrentHiveId(e.target.value);
              setMessages([]); // reset messages to reload greetings
            }}
            className="text-xs font-semibold bg-gray-50 text-gray-800 py-1.5 px-3 rounded-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {hives.map(hive => (
              <option key={hive.id} value={hive.id}>{hive.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 max-w-[85%] ${
                msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div
                className={`p-1.5 h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                  msg.sender === "user"
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                }`}
              >
                {msg.sender === "user" ? (
                  <span className="text-xs font-bold font-sans">MOI</span>
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              
              <div
                className={`px-4.5 py-3.5 rounded-[18px] text-sm shadow-sm border ${
                  msg.sender === "user"
                    ? "bg-emerald-600 text-white border-emerald-600 rounded-tr-none"
                    : "bg-white text-gray-800 border-gray-100/80 rounded-tl-none"
                }`}
              >
                {msg.sender === "user" ? (
                  <p className="leading-relaxed font-sans">{msg.text}</p>
                ) : (
                  <div className="space-y-1">{parseMarkdown(msg.text)}</div>
                )}
                <span className={`block text-[10px] mt-2 text-right ${
                  msg.sender === "user" ? "text-emerald-200" : "text-gray-400"
                }`}>
                  {msg.timestamp.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3 mr-auto items-center"
            >
              <div className="p-1.5 h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white border border-gray-100 px-4 py-3 rounded-[18px] rounded-tl-none flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-3.5 flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span className="text-xs font-sans font-medium">{error}</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      {messages.length === 1 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100/60 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
          {suggestions.map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSend(sug.text)}
              className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-xs font-semibold text-gray-700 px-3.5 py-2 rounded-full cursor-pointer hover:border-emerald-400 hover:text-emerald-700 transition-all shadow-sm shrink-0"
            >
              <span>{sug.icon}</span>
              <span>{sug.text}</span>
              <ArrowRight className="w-3 h-3 text-gray-400" />
            </button>
          ))}
        </div>
      )}

      {/* Chat Input Deck */}
      <div className="bg-white p-4.5 border-t border-gray-100 rounded-b-[22px] shadow-inner">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputValue);
          }}
          className="relative flex items-center bg-gray-50 border border-gray-200 rounded-[18px] p-1.5 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Demander à BeeGuard AI à propos de ${selectedHive ? selectedHive.name : "vos ruches"}...`}
            className="flex-1 bg-transparent px-3 text-sm text-gray-800 focus:outline-none placeholder-gray-400 font-sans"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl p-2.5 transition disabled:opacity-40 disabled:hover:bg-emerald-600 flex items-center justify-center shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="flex items-center justify-between mt-2.5 px-1.5 text-[10px] text-gray-400 font-sans">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Modèle de diagnostic Gemini 3.5 actif
          </span>
          <span className="flex items-center gap-1">
            Appuyez sur Entrée <CornerDownLeft className="w-2.5 h-2.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
