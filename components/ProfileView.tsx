import React from 'react';
import { User } from 'lucide-react';
import { ProfileVisibility } from '../types';

interface ProfileViewProps {
  profileImage: string | null;
  profileVisibility: ProfileVisibility;
  setProfileVisibility: React.Dispatch<React.SetStateAction<ProfileVisibility>>;
  savedDraftsCount: number;
  activeProjectsCount: number;
}

const Toggle = ({ isEnabled, onToggle }: { isEnabled: boolean, onToggle: () => void }) => (
    <button onClick={onToggle} className={`relative w-12 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-orange-500 ${isEnabled ? 'bg-orange-500' : 'bg-gray-300'}`}>
      <span className="sr-only">Toggle Visibility</span>
      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-lg transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);


const ProfileView: React.FC<ProfileViewProps> = ({ profileImage, profileVisibility, setProfileVisibility, savedDraftsCount, activeProjectsCount }) => {
    
    const toggleVisibility = (field: keyof ProfileVisibility) => {
        setProfileVisibility(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const inputClasses = "w-full px-4 py-3 rounded-xl transition-all duration-300 bg-gray-100 border-2 border-gray-200 text-black placeholder-gray-500 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none";
    
    return (
        <div className="min-h-screen pb-20 bg-gray-50">
            <div className="p-4 md:p-6 max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-black flex items-center gap-3">
                    <User size={32} />プロフィール
                </h2>
                <div className="space-y-6">
                    <div className="rounded-2xl p-6 border border-gray-200 bg-white shadow-sm">
                        <h3 className="text-xl font-bold text-black mb-6">基本情報</h3>
                        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden border-4 border-gray-200 bg-gray-100">
                                    {profileImage ? (<img src={profileImage} alt="Profile" className="w-full h-full object-cover" />) : (<User size={40} className="text-gray-400" />)}
                                </div>
                                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 text-orange-600 hover:bg-orange-500/30 transition-colors">
                                    <span className="text-lg">📷</span>
                                </button>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-lg font-bold text-black mb-1">プロフィール画像</h4>
                                <p className="text-sm text-gray-600">ブランドロゴまたは代表者の写真</p>
                            </div>
                        </div>
                        
                        <div className="space-y-8">
                            {/* ブランド情報 */}
                            <div className="space-y-6">
                                <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">ブランド情報</h4>
                                
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-semibold text-gray-700">ブランド名</label>
                                        <Toggle isEnabled={profileVisibility.brandName} onToggle={() => toggleVisibility('brandName')} />
                                    </div>
                                    <input type="text" placeholder="例: TOKYO APPAREL" defaultValue="TOKYO APPAREL" className={inputClasses} />
                                </div>
                                
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-semibold text-gray-700">ブランドコンセプト</label>
                                        <Toggle isEnabled={profileVisibility.brandConcept} onToggle={() => toggleVisibility('brandConcept')} />
                                    </div>
                                    <textarea placeholder="ブランドの目指す世界観やコンセプト..." defaultValue="「都市生活に寄り添う、持続可能な日常着」をテーマに、機能性とデザイン性を両立したアイテムを展開。" rows={3} className={inputClasses}></textarea>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-semibold text-gray-700">ウェブサイト</label>
                                        <Toggle isEnabled={profileVisibility.website} onToggle={() => toggleVisibility('website')} />
                                    </div>
                                    <input type="url" placeholder="https://example.com" defaultValue="https://tokyoapparel.com" className={inputClasses} />
                                </div>
                            </div>

                            {/* 運営者情報 */}
                            <div className="space-y-6">
                                <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">運営者情報</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-semibold text-gray-700">事業形態</label>
                                            <Toggle isEnabled={profileVisibility.entityType} onToggle={() => toggleVisibility('entityType')} />
                                        </div>
                                        <select className={inputClasses}>
                                            <option>法人</option>
                                            <option>個人事業主</option>
                                        </select>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-semibold text-gray-700">設立/開始年</label>
                                            <Toggle isEnabled={profileVisibility.establishedYear} onToggle={() => toggleVisibility('establishedYear')} />
                                        </div>
                                        <input type="number" placeholder="例: 2022" defaultValue="2022" className={inputClasses} />
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-semibold text-gray-700">担当者名</label>
                                        <Toggle isEnabled={profileVisibility.contactName} onToggle={() => toggleVisibility('contactName')} />
                                    </div>
                                    <input type="text" placeholder="例: 山田 太郎" defaultValue="山田 太郎" className={inputClasses} />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-semibold text-gray-700">メールアドレス</label>
                                        <Toggle isEnabled={profileVisibility.email} onToggle={() => toggleVisibility('email')} />
                                    </div>
                                    <input type="email" placeholder="example@example.com" defaultValue="yamada@tokyoapparel.com" className={inputClasses} />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-semibold text-gray-700">所在地</label>
                                            <Toggle isEnabled={profileVisibility.location} onToggle={() => toggleVisibility('location')} />
                                        </div>
                                        <input type="text" placeholder="例: 東京都渋谷区" defaultValue="東京都渋谷区" className={inputClasses} />
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-semibold text-gray-700">事業予算 (使えるお金)</label>
                                            <Toggle isEnabled={profileVisibility.capital} onToggle={() => toggleVisibility('capital')} />
                                        </div>
                                        <select className={inputClasses}>
                                            <option>選択してください</option>
                                            <option>10万円未満</option>
                                            <option selected>10万円〜30万円</option>
                                            <option>30万円〜100万円</option>
                                            <option>100万円以上</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button className="w-full mt-8 px-6 py-3 rounded-xl font-bold bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 text-orange-600 hover:bg-orange-500/30 transition-all duration-300">変更を保存</button>
                    </div>
                    <div className="rounded-2xl p-6 border border-gray-200 bg-white shadow-sm">
                        <h3 className="text-xl font-bold text-black mb-4">利用統計</h3>
                        <p className="text-sm text-gray-600 mb-6">あなたのStitchify利用状況</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[{ label: '総プロジェクト数', value: activeProjectsCount + 5 }, { label: '完了プロジェクト', value: 5 }, { label: '下書き', value: savedDraftsCount }, { label: '取引工場数', value: 3 }].map((stat, idx) => (
                                <div key={idx} className="p-4 rounded-xl text-center bg-gray-100 border border-gray-200">
                                    <p className="text-3xl font-bold text-black mb-1">{stat.value}</p>
                                    <p className="text-xs text-gray-600">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button onClick={() => { if (window.confirm('ログアウトしますか？')) { alert('ログアウトしました'); } }} className="w-full px-6 py-3 rounded-xl font-bold bg-black/5 backdrop-blur-sm border border-black/10 text-gray-700 hover:bg-black/10 transition-all duration-300">
                        ログアウト
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;