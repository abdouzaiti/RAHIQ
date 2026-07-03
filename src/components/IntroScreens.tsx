import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Sparkles, Navigation, CloudLightning, Activity, Play, ArrowRight, User, Key, KeyRound, Wifi, Smartphone, Thermometer, RefreshCw } from "lucide-react";

interface SplashProps {
  onComplete: () => void;
}

export const Splash: React.FC<SplashProps> = ({ onComplete }) => {
  React.useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center z-50 p-6 overflow-hidden">
      {/* Premium glowing backdrop */}
      <div className="absolute top-[35%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center text-center relative z-10"
      >
        {/* Animated Custom Vector App Logo */}
        <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="absolute inset-0 border-2 border-emerald-500/25 border-dashed rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="w-16 h-16 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20"
          >
            {/* Minimalist Hive Bee shape */}
            <svg className="w-9.5 h-9.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>

        <motion.h1
          initial={{ letterSpacing: "-0.05em", opacity: 0 }}
          animate={{ letterSpacing: "-0.01em", opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-2xl font-extrabold text-white tracking-tight font-sans"
        >
          BEEGUARD AI
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-xs text-gray-400 font-sans font-medium tracking-wide mt-2"
        >
          CO-PILOTE D'APICULTURE DE PRÉCISION IoT
        </motion.p>
      </motion.div>

      {/* Startup Indicator */}
      <div className="absolute bottom-16 w-32 h-1 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ left: "-100%" }}
          animate={{ left: "100%" }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="absolute top-0 bottom-0 w-16 bg-gradient-to-r from-emerald-500 to-emerald-300"
        />
      </div>
    </div>
  );
};

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: "Tableau de bord de précision",
      subtitle: "Télémétrie en temps réel rapportant la température, l'humidité et le poids du miel collecté 24h/24 et 7j/7.",
      icon: <Activity className="w-10 h-10 text-emerald-500" />,
      image: "📊"
    },
    {
      title: "Noyau de capteurs de pointe",
      subtitle: "L'analyse acoustique en temps réel et les alertes d'accéléromètre détectent instantanément les préparatifs d'essaimage et les intrusions de prédateurs.",
      icon: <Shield className="w-10 h-10 text-emerald-500" />,
      image: "🐝"
    },
    {
      title: "Diagnostics IA Gemini",
      subtitle: "Votre co-pilote automatisé traduit les fréquences complexes des capteurs IoT de la ruche en rapports détaillés rédigés en français.",
      icon: <Sparkles className="w-10 h-10 text-emerald-500" />,
      image: "🤖"
    }
  ];

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-between z-40 p-6 md:p-12">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.4 }}
            className="text-center flex flex-col items-center"
          >
            {/* Visual illustration blob */}
            <div className="w-40 h-40 bg-emerald-50 rounded-[32px] flex items-center justify-center mb-8 relative">
              <span className="text-5xl animate-bounce" style={{ animationDuration: "3s" }}>
                {slides[step].image}
              </span>
              <div className="absolute bottom-3 right-3 p-2.5 bg-white rounded-2xl shadow-sm border border-gray-100">
                {slides[step].icon}
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight font-sans">
              {slides[step].title}
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed font-sans max-w-sm mt-3">
              {slides[step].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Step indicator dots */}
        <div className="flex gap-2.5 mt-8">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setStep(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                step === idx ? "w-6 bg-emerald-600" : "w-2 bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="w-full max-w-md mx-auto flex gap-4 pt-6">
        {step < slides.length - 1 ? (
          <button
            onClick={() => setStep(prev => prev + 1)}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3.5 px-6 rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
          >
            Continuer
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onComplete}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3.5 px-6 rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
          >
            Accéder à la console
            <Play className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

interface AuthProps {
  onSuccess: () => void;
}

export const Authentication: React.FC<AuthProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState("apiary.beekeeper@gmail.com");
  const [password, setPassword] = useState("••••••••");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col justify-center items-center z-40 p-6 overflow-y-auto">
      {/* Visual top border line representing high-end tech logo */}
      <div className="absolute top-[20%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-gray-150 rounded-[28px] p-8 shadow-xl relative z-10"
      >
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-emerald-100/50">
            <Smartphone className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight font-sans">Authentification Apiculteur</h2>
          <p className="text-xs text-gray-400 mt-1">Accédez aux portails d'apiculture sécurisés connectés</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-500 font-sans font-medium mb-1.5">Adresse email de l'apiculteur</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-500 font-sans font-medium mb-1.5">Mot de passe de protection</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <KeyRound className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-sm hover:shadow transition flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Synchronisation des clés de sécurité...
              </>
            ) : (
              "Se connecter à BeeGuard AI"
            )}
          </button>
        </form>

        <div className="text-center mt-5 pt-4 border-t border-gray-100 flex items-center justify-center gap-4 text-[10px] text-gray-400">
          <span className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-emerald-500" /> Chiffrement TLS AES-256
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-200" />
          <span>Compte de démo pré-rempli</span>
        </div>
      </motion.div>
    </div>
  );
};
