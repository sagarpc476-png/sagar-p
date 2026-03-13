import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Settings2, 
  Copy, 
  Download, 
  RefreshCw, 
  ArrowLeft, 
  Moon, 
  Sun,
  ChevronRight,
  Type,
  Users,
  Languages,
  FileText,
  Check,
  Edit3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateScript, improveScript } from './services/gemini';
import { ScriptParams, ImproveParams, WritingStyle, Language } from './types';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [view, setView] = useState<'home' | 'generate' | 'improve' | 'result'>('home');
  const [loading, setLoading] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Form States
  const [scriptParams, setScriptParams] = useState<ScriptParams>({
    topic: '',
    audience: '',
    wordCount: 1500,
    style: 'Storytelling',
    language: 'English',
    referenceScript: ''
  });

  const [improveParams, setImproveParams] = useState<ImproveParams>({
    roughDraft: '',
    referenceScript: ''
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleGenerate = async () => {
    if (!scriptParams.topic) return;
    setLoading(true);
    try {
      const result = await generateScript(scriptParams);
      setGeneratedScript(result);
      setView('result');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImprove = async () => {
    if (!improveParams.roughDraft) return;
    setLoading(true);
    try {
      const result = await improveScript(improveParams);
      setGeneratedScript(result);
      setView('result');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedScript);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const downloadScript = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedScript], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `StoryScript_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  const handleRegenerate = () => {
    if (view === 'result') {
      if (scriptParams.topic) handleGenerate();
      else if (improveParams.roughDraft) handleImprove();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => setView('home')}
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">StoryScript <span className="text-indigo-600">AI</span></span>
        </div>
        
        <button 
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </nav>

      <main className="pt-24 pb-12 px-6 max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                Create Viral <span className="gradient-text">Storytelling</span> Scripts
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
                Generate deep, human-like scripts that keep your viewers hooked from beginning to end.
              </p>

              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <button 
                  onClick={() => setView('generate')}
                  className="group relative p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all text-left shadow-sm hover:shadow-xl"
                >
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Wand2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Generate Full Script</h3>
                  <p className="text-zinc-500 dark:text-zinc-400">Start from a topic and let AI craft a complete storytelling masterpiece.</p>
                  <ChevronRight className="absolute bottom-8 right-8 w-6 h-6 text-zinc-300 dark:text-zinc-700 group-hover:text-indigo-500 transition-colors" />
                </button>

                <button 
                  onClick={() => setView('improve')}
                  className="group relative p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all text-left shadow-sm hover:shadow-xl"
                >
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <RefreshCw className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Improve My Script</h3>
                  <p className="text-zinc-500 dark:text-zinc-400">Paste your rough ideas and transform them into a polished, emotional script.</p>
                  <ChevronRight className="absolute bottom-8 right-8 w-6 h-6 text-zinc-300 dark:text-zinc-700 group-hover:text-purple-500 transition-colors" />
                </button>
              </div>
            </motion.div>
          )}

          {(view === 'generate' || view === 'improve') && (
            <motion.div 
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-3xl mx-auto"
            >
              <button 
                onClick={() => setView('home')}
                className="flex items-center gap-2 text-zinc-500 hover:text-indigo-500 mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </button>

              <div className="glass-card p-8 rounded-3xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${view === 'generate' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'}`}>
                    {view === 'generate' ? <Wand2 className="w-5 h-5" /> : <RefreshCw className="w-5 h-5" />}
                  </div>
                  <h2 className="text-3xl font-bold">{view === 'generate' ? 'Script Generator' : 'Script Improver'}</h2>
                </div>

                {view === 'generate' ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Type className="w-4 h-4" /> Video Topic or Title
                      </label>
                      <input 
                        type="text"
                        placeholder="e.g. The Secret History of the Internet"
                        className="w-full p-4 bg-zinc-100 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        value={scriptParams.topic}
                        onChange={(e) => setScriptParams({...scriptParams, topic: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Users className="w-4 h-4" /> Target Audience (Optional)
                      </label>
                      <input 
                        type="text"
                        placeholder="e.g. Tech enthusiasts, History buffs"
                        className="w-full p-4 bg-zinc-100 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        value={scriptParams.audience}
                        onChange={(e) => setScriptParams({...scriptParams, audience: e.target.value})}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Settings2 className="w-4 h-4" /> Writing Style
                        </label>
                        <select 
                          className="w-full p-4 bg-zinc-100 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
                          value={scriptParams.style}
                          onChange={(e) => setScriptParams({...scriptParams, style: e.target.value as WritingStyle})}
                        >
                          <option>Storytelling</option>
                          <option>Educational</option>
                          <option>Motivational</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Languages className="w-4 h-4" /> Language
                        </label>
                        <select 
                          className="w-full p-4 bg-zinc-100 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
                          value={scriptParams.language}
                          onChange={(e) => setScriptParams({...scriptParams, language: e.target.value as Language})}
                        >
                          <option>English</option>
                          <option>Hinglish</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <FileText className="w-4 h-4" /> Word Count
                        </label>
                        <span className="text-indigo-600 font-bold">{scriptParams.wordCount} words</span>
                      </div>
                      <input 
                        type="range"
                        min="500"
                        max="5000"
                        step="100"
                        className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        value={scriptParams.wordCount}
                        onChange={(e) => setScriptParams({...scriptParams, wordCount: parseInt(e.target.value)})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" /> Flow Reference (Optional)
                      </label>
                      <textarea 
                        placeholder="Paste an example script to mimic its structure and tone..."
                        className="w-full p-4 bg-zinc-100 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[120px]"
                        value={scriptParams.referenceScript}
                        onChange={(e) => setScriptParams({...scriptParams, referenceScript: e.target.value})}
                      />
                    </div>

                    <button 
                      onClick={handleGenerate}
                      disabled={loading || !scriptParams.topic}
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                    >
                      {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                      {loading ? 'Generating Script...' : 'Generate Full Script'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Edit3 className="w-4 h-4" /> Your Rough Script / Ideas
                      </label>
                      <textarea 
                        placeholder="Paste your rough lines or incomplete script here..."
                        className="w-full p-4 bg-zinc-100 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition-all min-h-[300px]"
                        value={improveParams.roughDraft}
                        onChange={(e) => setImproveParams({...improveParams, roughDraft: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" /> Flow Reference (Optional)
                      </label>
                      <textarea 
                        placeholder="Paste an example script to mimic its structure and tone..."
                        className="w-full p-4 bg-zinc-100 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition-all min-h-[120px]"
                        value={improveParams.referenceScript}
                        onChange={(e) => setImproveParams({...improveParams, referenceScript: e.target.value})}
                      />
                    </div>

                    <button 
                      onClick={handleImprove}
                      disabled={loading || !improveParams.roughDraft}
                      className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                    >
                      {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                      {loading ? 'Improving Script...' : 'Improve My Script'}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {view === 'result' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <button 
                  onClick={() => setView(scriptParams.topic ? 'generate' : 'improve')}
                  className="flex items-center gap-2 text-zinc-500 hover:text-indigo-500 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Settings
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={handleRegenerate}
                    disabled={loading}
                    className="p-3 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                    title="Regenerate"
                  >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={`p-3 rounded-xl transition-colors ${isEditing ? 'bg-indigo-600 text-white' : 'bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700'}`}
                    title="Edit Script"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={copyToClipboard}
                    className="p-3 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2"
                    title="Copy to Clipboard"
                  >
                    {copySuccess ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    <span className="hidden md:inline text-sm font-medium">{copySuccess ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <button 
                    onClick={downloadScript}
                    className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center gap-2"
                    title="Download Script"
                  >
                    <Download className="w-5 h-5" />
                    <span className="hidden md:inline text-sm font-medium">Download</span>
                  </button>
                </div>
              </div>

              <div className="glass-card rounded-3xl overflow-hidden min-h-[600px] flex flex-col">
                <div className="bg-zinc-100 dark:bg-zinc-800/50 px-8 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                  <span className="text-sm font-medium text-zinc-500 uppercase tracking-widest">Generated Script</span>
                  <span className="text-xs text-zinc-400">{generatedScript.split(/\s+/).length} words</span>
                </div>
                
                {isEditing ? (
                  <textarea 
                    className="flex-1 w-full p-8 bg-transparent outline-none resize-none font-serif text-lg leading-relaxed"
                    value={generatedScript}
                    onChange={(e) => setGeneratedScript(e.target.value)}
                  />
                ) : (
                  <div className="flex-1 p-8 md:p-12 font-serif text-lg md:text-xl leading-relaxed whitespace-pre-wrap selection:bg-indigo-500/30">
                    {generatedScript}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-200 dark:border-zinc-800 text-center text-zinc-500 text-sm">
        <p>© 2026 StoryScript AI. Built for Creators.</p>
      </footer>
    </div>
  );
}
