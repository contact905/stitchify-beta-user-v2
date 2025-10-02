import React from 'react';
import { FileText, Sparkles, Clock } from 'lucide-react';
import { Draft } from '../types';

interface DraftsViewProps {
  savedDrafts: Draft[];
  startChat: (category: string, draftId: string | null) => void;
  deleteDraft: (draftId: string) => void;
}

const DraftsView: React.FC<DraftsViewProps> = ({ savedDrafts, startChat, deleteDraft }) => {
  const primaryButtonGlass = "bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 text-orange-600 font-semibold hover:bg-orange-500/30 transition-all duration-300";

  return (
    <div className="min-h-screen pb-20 bg-white">
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-black flex items-center gap-3">
            <FileText size={32} />下書き
          </h2>
          <button onClick={() => startChat('', null)} className={`${primaryButtonGlass} px-4 py-2 rounded-xl font-semibold flex items-center gap-2`}>
            <Sparkles size={18} />新規作成
          </button>
        </div>
        {savedDrafts.length === 0 ? (
          <div className="text-center py-16">
            <FileText size={64} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">保存された下書きはありません</p>
            <button onClick={() => startChat('', null)} className={`${primaryButtonGlass} px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2`}>
              <Sparkles size={20} />仕様書を作成する
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedDrafts.map((draft) => (
              <div key={draft.id} className="rounded-2xl p-5 border border-gray-200 hover:border-orange-400 transition-all duration-300 group bg-white shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500 text-white">{draft.category}</div>
                  <button onClick={() => deleteDraft(draft.id)} className="text-gray-400 hover:text-red-500 transition-colors">✕</button>
                </div>
                <h3 className="text-lg font-bold text-black mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">{draft.title}</h3>
                <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                  <Clock size={14} />
                  <span>最終編集: {draft.lastEdited}</span>
                </div>
                <div className="mb-4 p-3 rounded-xl bg-gray-100">
                  <p className="text-xs text-gray-600 line-clamp-2">{draft.messages[draft.messages.length - 1]?.content || ''}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startChat('', draft.id)} className={`${primaryButtonGlass} flex-1 px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2`}>
                    <Sparkles size={16} />続きを編集
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DraftsView;