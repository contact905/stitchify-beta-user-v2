import React, { useState, useEffect } from 'react';
import { Specification, Factory, MatchedFactory } from '../types';
import { ChevronLeft, Star, Building2, Zap, Settings, Package, Scissors, Send, Info } from 'lucide-react';

const getScore = (spec: Specification, factory: Factory): number => {
    let score = 0;
    const totalLot = (spec.quantities.s || 0) + (spec.quantities.m || 0) + (spec.quantities.l || 0);

    // Item Type Match (40 points)
    if (spec.itemType && factory.specialtyItems.some(item => spec.itemType && item.includes(spec.itemType))) {
        score += 40;
    }

    // Processing Match (30 points)
    const processingMap: { [key: string]: string[] } = {
        'print': ['シルクプリント', '昇華プリント'],
        'embroidery': ['刺繍'],
        'fabric_sewing': ['特殊縫製', '手仕上げ'],
    };
    if (spec.processing && processingMap[spec.processing]?.some(p => factory.specialtyProcessing.includes(p))) {
        score += 30;
    }
    
    // Capacity/Lot Match (20 points)
    if (totalLot === 0) { // If user hasn't specified lot size, give a neutral score
        score += 10;
    } else if (totalLot >= factory.minLot) {
        score += 20;
    } else {
        // For demo, give a very low score instead of 0 so it still appears
        score += 1; 
    }


    // Rating/実績 Match (10 points)
    const ratingScore = (factory.rating / 5) * 5; // max 5
    const projectScore = (Math.min(factory.completedProjects, 200) / 200) * 5; // max 5
    score += (ratingScore + projectScore);
    
    return Math.min(Math.round(score), 100);
};

interface MatchingViewProps {
    spec: Specification;
    factories: Factory[];
    setCurrentView: (view: string) => void;
    setSelectedFactory: (id: string | null) => void;
}

const MatchingView: React.FC<MatchingViewProps> = ({ spec, factories, setCurrentView, setSelectedFactory }) => {
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState<MatchedFactory[]>([]);
    const [selectedDetail, setSelectedDetail] = useState<MatchedFactory | null>(null);

    const primaryButtonGlass = "bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 text-orange-600 font-semibold hover:bg-orange-500/30 transition-all duration-300";
    const secondaryButtonGlass = "bg-black/5 backdrop-blur-sm border border-black/10 text-gray-700 font-semibold hover:bg-black/10 transition-all duration-300";

    useEffect(() => {
        const timer = setTimeout(() => {
            // Score and Sort all factories without pre-filtering
            const scored = factories.map(f => {
                const score = getScore(spec, f);
                return { ...f, score, matchRate: score };
            }).sort((a, b) => b.score - a.score);

            setResults(scored.slice(0, 3));
            setLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, [spec, factories]);

    const handleSendOffer = (factory: MatchedFactory) => {
        alert(`${factory.name}にオファーを送信しました。メッセージ画面に移動します。`);
        setSelectedFactory(factory.id);
        setCurrentView('messages');
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-screen bg-white text-black">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
                <h2 className="text-2xl font-bold mt-6">仕様書を解析中...</h2>
                <p className="text-gray-600 mt-2">あなたにぴったりのパートナーを探しています</p>
            </div>
        );
    }
    
    if (selectedDetail) {
        // Detail View
        return (
            <div className="min-h-screen bg-white text-black pb-24">
                <div className="p-4 bg-white sticky top-0 z-10 border-b border-gray-200">
                     <button onClick={() => setSelectedDetail(null)} className={`${secondaryButtonGlass} flex items-center gap-2 rounded-lg px-3 py-1.5`}>
                        <ChevronLeft size={20} />
                        <span>結果に戻る</span>
                    </button>
                </div>
                <div className="p-6">
                    <div className="aspect-video rounded-xl overflow-hidden mb-6 bg-gray-100">
                         <img src={selectedDetail.image} alt={selectedDetail.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-3xl font-bold">{selectedDetail.name}</h2>
                        <div className="flex items-center gap-2 text-lg font-bold text-orange-600">
                            <Zap size={20} className="fill-current" />
                            <span>マッチング率 {selectedDetail.matchRate}%</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-6 flex items-center gap-2">
                        <Building2 size={16} />{selectedDetail.location}
                    </p>
                     <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-gray-100 rounded-lg">
                            <div className="flex items-center gap-1 text-yellow-500">
                                <Star size={16} className="fill-current" />
                                <span className="text-2xl font-bold text-black">{selectedDetail.rating}</span>
                            </div>
                            <p className="text-xs text-gray-600">評価</p>
                        </div>
                         <div className="p-4 bg-gray-100 rounded-lg">
                            <p className="text-2xl font-bold text-black">{selectedDetail.completedProjects}</p>
                            <p className="text-xs text-gray-600">完了プロジェクト</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">得意なアイテム</h3>
                            <div className="flex gap-2 flex-wrap">{selectedDetail.specialtyItems.map(item => <span key={item} className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">{item}</span>)}</div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">得意な加工</h3>
                            <div className="flex gap-2 flex-wrap">{selectedDetail.specialtyProcessing.map(item => <span key={item} className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">{item}</span>)}</div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">最小ロット</h3>
                            <p className="text-lg font-semibold text-black">{selectedDetail.minLot}着〜</p>
                        </div>
                    </div>
                </div>
                 <div className="fixed bottom-20 md:bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200">
                    <button onClick={() => handleSendOffer(selectedDetail)} className={`${primaryButtonGlass} w-full max-w-4xl mx-auto py-4 rounded-xl text-lg flex items-center justify-center gap-2`}>
                        オファーを送る
                    </button>
                </div>
            </div>
        );
    }
    
    // Results View
    return (
        <div className="min-h-screen bg-white text-black p-6">
            <h2 className="text-3xl font-bold mb-2 text-center text-black">
                マッチング結果
            </h2>
             <p className="text-center text-gray-600 mb-8">あなたにぴったりのパートナーが{results.length}社見つかりました！</p>
             
            <div className="space-y-6 max-w-4xl mx-auto">
                 {results.map(factory => (
                    <div key={factory.id} className="rounded-2xl overflow-hidden border border-gray-200 bg-white transition-all shadow-sm">
                        <div className="md:flex">
                           <div className="md:w-1/3">
                             <img src={factory.image} alt={factory.name} className="w-full h-48 md:h-full object-cover" />
                           </div>
                           <div className="p-5 md:w-2/3 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-xl text-black">{factory.name}</h3>
                                    <div className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-bold flex items-center gap-1.5 flex-shrink-0">
                                        <Zap size={14} className="fill-current" />
                                        <span>{factory.matchRate}%</span>
                                    </div>
                                </div>

                                <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-4">
                                    <span className="flex items-center gap-1.5"><Building2 size={14} />{factory.location}</span>
                                    <span className="flex items-center gap-1.5 text-yellow-500">
                                        <Star size={14} className="fill-current" />
                                        <strong className="text-black">{factory.rating}</strong>
                                        ({factory.completedProjects}件)
                                    </span>
                                </div>
                                
                                <div className="space-y-3 text-sm mb-5 flex-grow">
                                    <div className="flex items-start gap-2">
                                        <Package size={16} className="text-gray-500 mt-1 flex-shrink-0"/>
                                        <div>
                                            <h4 className="font-semibold text-gray-600">得意なアイテム</h4>
                                            <div className="flex gap-1.5 flex-wrap mt-1">
                                                {factory.specialtyItems.map(item => <span key={item} className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">{item}</span>)}
                                            </div>
                                        </div>
                                    </div>
                                     <div className="flex items-start gap-2">
                                        <Scissors size={16} className="text-gray-500 mt-1 flex-shrink-0"/>
                                        <div>
                                            <h4 className="font-semibold text-gray-600">得意な加工</h4>
                                            <div className="flex gap-1.5 flex-wrap mt-1">
                                                {factory.specialtyProcessing.map(item => <span key={item} className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">{item}</span>)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Settings size={16} className="text-gray-500 mt-1 flex-shrink-0"/>
                                        <div>
                                            <h4 className="font-semibold text-gray-600">最小ロット</h4>
                                            <p className="text-black font-semibold">{factory.minLot}着〜</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                                    <button onClick={() => setSelectedDetail(factory)} className={`${secondaryButtonGlass} w-full py-2.5 rounded-lg font-bold flex items-center justify-center gap-2`}>
                                        <Info size={16} /> 詳細を見る
                                    </button>
                                     <button onClick={() => handleSendOffer(factory)} className={`${primaryButtonGlass} w-full py-2.5 rounded-lg font-bold flex items-center justify-center gap-2`}>
                                        <Send size={16} /> オファーを送る
                                    </button>
                                </div>
                           </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MatchingView;