import React, { useState, useEffect, useRef } from 'react';
import { Save, Plus, Trash2, Download, Upload, X } from 'lucide-react';
import { Question, registry } from '../utils/questionUtils';

interface OperatorPanelProps {
  onClose: () => void;
  musicVolume: number;
  setMusicVolume: (v: number) => void;
  sfxVolume: number;
  setSfxVolume: (v: number) => void;
}

export const OperatorPanel: React.FC<OperatorPanelProps> = ({ 
  onClose,
  musicVolume,
  setMusicVolume,
  sfxVolume,
  setSfxVolume
}) => {
  const [activeTab, setActiveTab] = useState<'questions' | 'settings'>('settings');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Question>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuestions([...registry.getAll()]);
  }, []);

  const handleSave = () => {
    if (editingId && editForm.id) {
      // Update existing
      registry.update(editingId, editForm);
    } else if (editForm.id && editForm.text) {
      // Add new
      registry.add(editForm as Question);
    }
    setQuestions([...registry.getAll()]);
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (id: string) => {
    registry.delete(id);
    setQuestions([...registry.getAll()]);
    if (editingId === id) {
      setEditingId(null);
      setEditForm({});
    }
  };

  const startEdit = (q: Question) => {
    setEditingId(q.id);
    setEditForm({ ...q });
  };

  const startNew = () => {
    setEditingId('new');
    setEditForm({
      id: `q${Date.now()}`,
      text: '',
      options: ['', ''],
      answer: '',
      type: 'choice',
      category: 'General'
    });
  };

  const downloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "questions.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target?.result as string);
        if (Array.isArray(data)) {
          registry.setAll(data);
          setQuestions(data);
          alert("Questions imported successfully!");
        } else {
          alert("Invalid JSON format: Expected an array of questions.");
        }
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-600 w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900 rounded-t-xl">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
              <Save className="w-5 h-5" /> Operator Panel
            </h2>
            <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
              <button 
                onClick={() => setActiveTab('settings')}
                className={`px-3 py-1 rounded text-sm font-bold transition-colors ${activeTab === 'settings' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Settings
              </button>
              <button 
                onClick={() => setActiveTab('questions')}
                className={`px-3 py-1 rounded text-sm font-bold transition-colors ${activeTab === 'questions' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Questions
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            {activeTab === 'questions' && (
              <>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImport} 
                  className="hidden" 
                  accept=".json"
                />
                <button onClick={() => fileInputRef.current?.click()} className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-white text-sm flex items-center gap-1">
                  <Upload className="w-4 h-4" /> Import JSON
                </button>
                <button onClick={downloadJson} className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-white text-sm flex items-center gap-1">
                  <Download className="w-4 h-4" /> Download JSON
                </button>
              </>
            )}
            <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded text-slate-400">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {activeTab === 'settings' ? (
            <div className="p-8 w-full max-w-2xl mx-auto space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white border-b border-slate-700 pb-2">Audio Settings</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-slate-300 text-sm">
                    <span>Music Volume</span>
                    <span>{Math.round(musicVolume * 100)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05" 
                    value={musicVolume} 
                    onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-slate-300 text-sm">
                    <span>Sound Effects Volume</span>
                    <span>{Math.round(sfxVolume * 100)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05" 
                    value={sfxVolume} 
                    onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* List */}
              <div className="w-1/3 border-r border-slate-700 overflow-y-auto p-2 space-y-2 bg-slate-800/50">
            <button onClick={startNew} className="w-full py-2 bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/50 rounded text-cyan-300 flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add New Question
            </button>
            {questions.map(q => (
              <div 
                key={q.id} 
                onClick={() => startEdit(q)}
                className={`p-3 rounded cursor-pointer border transition-colors ${editingId === q.id ? 'bg-cyan-900/30 border-cyan-500' : 'bg-slate-700/30 border-transparent hover:bg-slate-700'}`}
              >
                <div className="font-mono text-xs text-slate-400 mb-1">{q.id} • {q.category}</div>
                <div className="text-sm text-slate-200 line-clamp-2">{q.text}</div>
              </div>
            ))}
          </div>

          {/* Editor */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-900/50">
            {editingId ? (
              <div className="space-y-4 max-w-lg mx-auto">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {editingId === 'new' ? 'New Question' : 'Edit Question'}
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">ID</label>
                    <input 
                      value={editForm.id || ''} 
                      onChange={e => setEditForm({...editForm, id: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Category</label>
                    <select 
                      value={editForm.category || 'General'} 
                      onChange={e => setEditForm({...editForm, category: e.target.value as any})}
                      className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white text-sm"
                    >
                      <option>Math</option>
                      <option>Science</option>
                      <option>Geography</option>
                      <option>General</option>
                      <option>Social</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Question Text</label>
                  <textarea 
                    value={editForm.text || ''} 
                    onChange={e => setEditForm({...editForm, text: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white text-sm h-24"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Type</label>
                  <select 
                    value={editForm.type || 'choice'} 
                    onChange={e => setEditForm({...editForm, type: e.target.value as any})}
                    className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white text-sm"
                  >
                    <option value="choice">Multiple Choice</option>
                    <option value="boolean">True/False</option>
                    <option value="multi">Multi-Select</option>
                    <option value="sort">Sort Order</option>
                    <option value="short_answer">Short Answer</option>
                    <option value="image">Image ID</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Options (comma separated for simple edit)</label>
                  <input 
                    value={editForm.options?.join(',') || ''} 
                    onChange={e => setEditForm({...editForm, options: e.target.value.split(',')})}
                    className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white text-sm"
                    placeholder="Option A,Option B"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Correct Answer</label>
                  <input 
                    value={editForm.answer || ''} 
                    onChange={e => setEditForm({...editForm, answer: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white text-sm"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button onClick={handleSave} className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-semibold">
                    Save Changes
                  </button>
                  {editingId !== 'new' && (
                    <button onClick={() => handleDelete(editingId)} className="px-4 py-2 bg-red-900/50 hover:bg-red-900 border border-red-700 rounded text-red-200">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                Select a question to edit or create new
              </div>
            )}
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
};
