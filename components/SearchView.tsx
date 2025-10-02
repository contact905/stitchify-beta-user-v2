import React, { useState } from 'react';
import { Clock, Building2, Star } from 'lucide-react';
import { Factory, Campaign } from '../types';

interface SearchViewProps {
  factories: Factory[];
  campaigns: Campaign[];
}

const SearchView: React.FC<SearchViewProps> = ({ factories, campaigns }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('全て');
    const [selectedLocation, setSelectedLocation] = useState('全国');

    const primaryButtonGlass = "bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 text-orange-600 font-semibold hover:bg-orange-500/30 transition-all duration-300";
    const secondaryButtonGlass = "bg-black/5 backdrop-blur-sm border border-black/10 text-gray-700 font-semibold hover:bg-black/10 transition-all duration-300";

    const filteredFactories = factories.filter(factory => {
        const matchesCategory = selectedCategory === '全て' || factory.specialtyItems.includes(selectedCategory);
        const matchesLocation = selectedLocation === '全国' || factory.location === selectedLocation;
        const matchesSearch = factory.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesLocation && matchesSearch;
    });

    const filteredCampaigns = campaigns.filter(campaign => selectedCategory === '全て' || campaign.category === selectedCategory || campaign.category === '全アイテム');
    
    return (
        <div className="min-h-screen pb-20 bg-white">
            <div className="p-6 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-black">工場検索</h2>
                <div className="mb-8 space-y-4">
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="工場名で検索..." className="w-full px-6 py-4 rounded-full text-lg bg-gray-100 border-2 border-gray-200 text-black placeholder-gray-500" />
                    <div className="flex gap-4 flex-wrap">
                        <div>
                            <p className="text-gray-600 text-sm mb-2">カテゴリー</p>
                            <div className="flex gap-2 flex-wrap">
                                {['全て', 'Tシャツ', 'パーカー', 'パンツ', 'ジャケット', 'ニット'].map(cat => (
                                    <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-semibold ${selectedCategory === cat ? primaryButtonGlass : secondaryButtonGlass}`}>
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm mb-2">地域</p>
                            <div className="flex gap-2 flex-wrap">
                                {['全国', '東京都', '大阪府', '新潟県', '愛知県'].map(loc => (
                                    <button key={loc} onClick={() => setSelectedLocation(loc)} className={`px-4 py-2 rounded-full text-sm font-semibold ${selectedLocation === loc ? primaryButtonGlass : secondaryButtonGlass}`}>
                                        {loc}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {filteredCampaigns.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-xl font-bold mb-4 text-black flex items-center gap-2">
                            🔥 実施中のキャンペーン<span className="text-sm font-normal text-gray-500">({filteredCampaigns.length}件)</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {filteredCampaigns.map((campaign) => (
                                <div key={campaign.id} className="rounded-xl border border-gray-200 hover:border-orange-400 transition-all duration-300 group cursor-pointer overflow-hidden bg-white shadow-sm">
                                    <div className="flex">
                                        <div className="relative w-40 flex-shrink-0 overflow-hidden">
                                            <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                                            <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                                                <div className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500 text-white">{campaign.badge}</div>
                                                <div className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500 text-white">{campaign.discount} OFF</div>
                                            </div>
                                        </div>
                                        <div className="flex-1 p-4">
                                            <div className="mb-2">
                                                <div className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500 text-white">{campaign.category}</div>
                                            </div>
                                            <h3 className="text-base font-bold text-black mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors leading-snug">{campaign.title}</h3>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Building2 size={14} className="text-gray-500 flex-shrink-0" />
                                                <span className="text-xs text-gray-600 truncate">{campaign.factoryName}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{campaign.description}</p>
                                            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                    <Clock size={13} />
                                                    <span>期限: {campaign.deadline}</span>
                                                </div>
                                                <div className="text-xs font-bold text-orange-600">最小 {campaign.minLot}着</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="mb-4">
                    <h3 className="text-2xl font-bold mb-4 text-black">
                        工場一覧<span className="text-sm font-normal text-gray-500 ml-2">({filteredFactories.length}件)</span>
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFactories.map(factory => (
                        <div key={factory.id} className="rounded-2xl overflow-hidden border border-gray-200 hover:border-orange-400 transition-all duration-300 bg-white shadow-sm">
                            <div className="aspect-video overflow-hidden">
                                <img src={factory.image} alt={factory.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-5">
                                <h3 className="text-xl font-bold text-black mb-2">{factory.name}</h3>
                                <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                                    <Building2 size={16} />{factory.location}
                                </p>
                                <div className="mb-3">
                                    <p className="text-xs text-gray-500 mb-1">得意アイテム</p>
                                    <div className="flex gap-1 flex-wrap">
                                        {factory.specialtyItems.slice(0, 3).map(item => (<span key={item} className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">{item}</span>))}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-1">
                                        <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                        <span className="text-sm font-bold text-black">{factory.rating}</span>
                                    </div>
                                    <span className="text-xs text-gray-600">{factory.completedProjects}件の実績</span>
                                </div>
                                <button className={`${secondaryButtonGlass} w-full py-3 rounded-xl font-bold`}>詳細を見る</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchView;