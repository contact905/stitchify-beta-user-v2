import React, { useState } from 'react';
import { Home, User, TrendingUp, Search, MessageSquare, FileText, CheckCircle, Clock, Package, Building2, Star, Send, Sparkles, ArrowRight, Shirt, Box, ShoppingBag, HelpCircle, Bell } from 'lucide-react';
import { Project, PastProduct, Campaign } from '../types';

interface DashboardProps {
    activeProjects: Project[];
    pastProducts: PastProduct[];
    campaigns: Campaign[];
    handleCategoryClick: (category: string) => void;
    startChat: (category?: string, draftId?: string | null) => void;
    setCurrentView: (view: string) => void;
    setSelectedProgressProject: (projectId: string) => void;
}

const secondaryButtonGlass = "bg-black/5 backdrop-blur-sm border border-black/10 text-gray-700 font-semibold hover:bg-black/10 transition-all duration-300";

const Dashboard: React.FC<DashboardProps> = ({ activeProjects, pastProducts, campaigns, handleCategoryClick, startChat, setCurrentView, setSelectedProgressProject }) => {
    const [quickSearchValue, setQuickSearchValue] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);

    const handleQuickSearch = () => {
        if (quickSearchValue.trim()) {
            startChat(quickSearchValue);
        }
    };
    
    return (
        <div className="min-h-screen bg-white">
          <style>{`
            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
          <div className="bg-white">
            <div className="p-6 md:p-12">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 mt-8">
                  <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
                    さあ、何をデザインしましょう？
                  </h1>
                </div>
                <div className="mb-12">
                  <div className="max-w-4xl mx-auto">
                    <div className={`flex items-center gap-3 px-6 py-4 rounded-full border-2 transition-all duration-300 ${searchFocused ? 'border-orange-500' : 'border-gray-300'}`}>
                      <input type="text" value={quickSearchValue} onChange={(e) => setQuickSearchValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleQuickSearch()} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} placeholder="あなたのアイディアを教えてください" className="flex-1 bg-transparent border-0 outline-none text-lg text-black placeholder-gray-500" />
                      <button onClick={handleQuickSearch} className="flex-shrink-0 p-2.5 rounded-full bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 text-orange-600 hover:bg-orange-500/30 transition-all duration-300">
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mb-8">
                  <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex gap-4 pb-2">
                      {[{ name: 'Tシャツ', icon: Shirt }, { name: 'パーカー', icon: Shirt }, { name: 'パンツ', icon: Box }, { name: 'アウター', icon: Package }, { name: '小物', icon: ShoppingBag }, { name: 'その他', icon: Box }].map((category) => (
                        <button key={category.name} onClick={() => handleCategoryClick(category.name)} className="flex-shrink-0 group">
                          <div className="w-16 h-16 rounded-full bg-black/5 backdrop-blur-sm border border-black/10 flex items-center justify-center mb-2 transition-all duration-300 group-hover:bg-black/10">
                            <category.icon size={24} className="text-gray-600 group-hover:text-orange-500 transition-all duration-300" strokeWidth={2} />
                          </div>
                          <p className="text-gray-700 font-semibold text-center text-xs">{category.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {activeProjects.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 flex items-center gap-2">
                      <Package size={28} />進行中のプロジェクト<span className="text-sm font-normal text-gray-500">({activeProjects.length}件)</span>
                    </h2>
                    <div className="space-y-4">
                      {activeProjects.slice(0, 1).map(project => {
                        const progress = Math.round((project.currentStage / 5) * 100);
                        const unreadCount = project.notifications?.filter(n => n.unread).length || 0;
                        return (
                          <div key={project.id} className="rounded-2xl overflow-hidden border border-gray-200 bg-white p-4 md:p-5 shadow-sm">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-base md:text-lg font-bold text-black mb-2">{project.title}</h3>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs text-gray-600">{project.factoryName}</span>
                                  <span className="text-gray-400">•</span>
                                  <span className="text-xs text-gray-600">{project.itemType} {project.lotSize}着</span>
                                </div>
                              </div>
                              {unreadCount > 0 && (
                                <div className="flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 bg-orange-500 text-white">
                                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                  <span>{unreadCount}</span>
                                </div>
                              )}
                            </div>
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-xs text-gray-500 font-semibold">制作ステージ</span>
                                <span className="text-xs text-gray-600 font-bold">{progress}%完了</span>
                              </div>
                              <div className="overflow-x-auto scrollbar-hide -mx-1 px-1">
                                <div className="flex items-center gap-2 min-w-max pb-2">
                                  {project.stages.map((stage, idx) => (
                                    <div key={idx} className="flex items-center">
                                      <div className="flex flex-col items-center gap-1">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${stage.completed ? 'bg-orange-500 border-orange-500' : stage.current ? 'bg-yellow-500 border-yellow-500' : 'bg-gray-200 border-gray-300'}`}>
                                          {stage.completed ? (<CheckCircle size={20} className="text-white" strokeWidth={2.5} />) : stage.current ? (<Clock size={20} className="text-white animate-pulse" strokeWidth={2.5} />) : (<div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>)}
                                        </div>
                                        <span className={`text-[10px] font-semibold text-center whitespace-nowrap ${stage.completed ? 'text-orange-600' : stage.current ? 'text-yellow-600' : 'text-gray-500'}`}>{stage.name}</span>
                                      </div>
                                      {idx < project.stages.length - 1 && (<div className={`h-0.5 w-8 mx-1 transition-all duration-300 ${stage.completed ? 'bg-orange-500' : 'bg-gray-300'}`} />)}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mb-4 p-3 rounded-xl bg-gray-100">
                              <div className="flex items-center gap-2">
                                <Clock size={14} className="text-gray-500" />
                                <span className="text-xs text-gray-600">納期</span>
                              </div>
                              <span className="text-sm font-bold text-black">{project.expectedDelivery}</span>
                            </div>
                            <button onClick={() => { setSelectedProgressProject(project.id); setCurrentView('progress'); }} className={`${secondaryButtonGlass} w-full px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2`}>
                              詳細を確認する<ArrowRight size={18} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    {activeProjects.length > 1 && (
                      <button onClick={() => setCurrentView('progress')} className={`${secondaryButtonGlass} w-full mt-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2`}>
                        すべてのプロジェクトを見る ({activeProjects.length}件)<ArrowRight size={18} />
                      </button>
                    )}
                  </div>
                )}
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-black flex items-center gap-2">
                      🔥 期間限定キャンペーン
                    </h2>
                    <button onClick={() => setCurrentView('search')} className="text-sm text-orange-600 hover:text-orange-700 transition-colors font-semibold flex items-center gap-1">
                      すべて見る<ArrowRight size={16} />
                    </button>
                  </div>
                  <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
                    <div className="flex gap-4 pb-2">
                      {campaigns.slice(0, 3).map((campaign) => (
                        <div key={campaign.id} className="flex-shrink-0 w-80 rounded-2xl overflow-hidden border border-gray-200 hover:border-orange-400 transition-all duration-300 group cursor-pointer bg-white shadow-sm">
                          <div className="relative h-40 overflow-hidden">
                            <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                            <div className="absolute top-3 left-3 flex gap-2">
                              <div className="px-3 py-1 rounded-full text-xs font-bold border bg-orange-500 text-white">{campaign.badge}</div>
                              <div className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500 text-white">{campaign.discount} OFF</div>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="text-base font-bold text-black mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">{campaign.title}</h3>
                            <div className="flex items-center gap-2 mb-3">
                              <Building2 size={14} className="text-gray-500" />
                              <span className="text-xs text-gray-600">{campaign.factoryName}</span>
                            </div>
                            <p className="text-xs text-gray-600 mb-3 line-clamp-2">{campaign.description}</p>
                            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock size={12} />
                                <span>〜 {campaign.deadline}</span>
                              </div>
                              <div className="text-xs font-bold text-orange-600">最小ロット: {campaign.minLot}着</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 pt-16">
              <div className="rounded-t-3xl border-t-2 border-gray-200">
                <div className="p-6 md:p-12 max-w-7xl mx-auto">
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[{ label: '進行中', value: activeProjects.length }, { label: 'マッチング成立', value: 5 }, { label: '作成済み仕様書', value: 8 }].map((stat, idx) => (
                      <div key={idx} className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
                        <h3 className="text-sm font-semibold mb-2 text-gray-600">{stat.label}</h3>
                        <p className="text-4xl font-bold text-black">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                    <div className="p-6 md:p-8 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-black">
                            <Star size={28} className="md:w-8 md:h-8" />過去の制作実績
                          </h3>
                          <p className="text-xs md:text-sm text-gray-600 mt-2 font-medium">同じ仕様で簡単に再発注できます</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 md:p-8">
                      <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
                        <div className="flex gap-3 md:gap-4 pb-2">
                          {pastProducts.map(product => (
                            <div key={product.id} className="flex-shrink-0 w-48 md:w-64 border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:border-orange-400 group bg-white">
                              <div className="relative aspect-square overflow-hidden">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                                <div className="absolute top-2 right-2 bg-white/70 backdrop-blur px-2 py-1 rounded-full text-[10px] font-bold border border-gray-200 text-black">{product.category}</div>
                              </div>
                              <div className="p-3">
                                <h4 className="font-bold text-sm mb-2 line-clamp-2 text-black">{product.name}</h4>
                                <div className="space-y-1 mb-3">
                                  <p className="text-[10px] text-gray-600 truncate"><span className="font-semibold">🏭</span> {product.factoryName}</p>
                                  <p className="text-[10px] text-gray-600"><span className="font-semibold">📦</span> {product.lotSize}着</p>
                                  <p className="text-base font-bold text-black">{product.price}</p>
                                </div>
                                <button onClick={() => alert(`「${product.name}」を再注文します`)} className={`${secondaryButtonGlass} w-full px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5`}>
                                  <Package size={14} />再注文
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 p-3 rounded-xl text-center bg-orange-100">
                        <p className="text-xs text-orange-700">← スワイプして全ての実績を確認 →</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
};

export default Dashboard;