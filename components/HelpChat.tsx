import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { ChatMessage } from '../types';

interface HelpChatProps {
  setShowHelpChat: (show: boolean) => void;
}

const HelpChat: React.FC<HelpChatProps> = ({ setShowHelpChat }) => {
    const [helpChatMessages, setHelpChatMessages] = useState<ChatMessage[]>([
        { id: Date.now(), type: 'bot', content: 'こんにちは！Stitchifyサポートボットです🎨\n\nStitchifyに関することなんでもお尋ねください。使い方、機能、プロジェクト管理など、お手伝いいたします！' }
    ]);
    const [helpInput, setHelpInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [helpChatMessages]);

    const sendHelpMessage = () => {
        if (!helpInput.trim()) return;
        const userMessage = helpInput.trim().toLowerCase();
        setHelpChatMessages(prev => [...prev, { id: Date.now(), type: 'user', content: helpInput }]);
        setTimeout(() => {
            let botResponse = '';
            if (userMessage.includes('使い方') || userMessage.includes('始め方')) {
                botResponse = '📝 Stitchifyの使い方\n\n1. トップページから作りたいアイテムのカテゴリーを選択\n2. AIアシスタント「コネクトくん」が仕様書作成をサポート\n3. 仕様書完成後、最適な工場を自動マッチング\n4. 進捗管理画面で製作状況をリアルタイム確認\n\n何か具体的にお困りのことはありますか？';
            } else if (userMessage.includes('進捗') || userMessage.includes('プロジェクト')) {
                botResponse = '📊 進捗管理について\n\n進行中のプロジェクトは、ダッシュボードと「進捗管理」タブで確認できます。\n\n・現在の製作段階\n・納期情報\n・工場からの新着メッセージ\n\nなどをリアルタイムで把握できます。詳細を見るボタンから、より詳しい情報も確認できますよ！';
            } else if (userMessage.includes('工場') || userMessage.includes('マッチング')) {
                botResponse = '🏭 工場マッチングについて\n\n仕様書を完成させると、以下の条件で最適な工場を自動推薦します：\n\n・アイテム種別\n・ロット数\n・加工方法\n・納期\n\nまた、検索機能から条件を指定して工場を探すこともできます。';
            } else {
                botResponse = 'ご質問ありがとうございます！\n\n以下のトピックについてお答えできます：\n\n📝 使い方・始め方\n📊 進捗管理\n🏭 工場マッチング\n\n具体的にどのようなことが知りたいですか？';
            }
            setHelpChatMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', content: botResponse }]);
        }, 800);
        setHelpInput('');
    };

    return (
        <div className="fixed bottom-44 right-6 w-96 rounded-2xl bg-white border border-gray-200 overflow-hidden z-50 flex flex-col shadow-xl" style={{ height: '600px', maxHeight: '70vh' }}>
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-black">Stitchifyサポート</h3>
                    <p className="text-xs text-gray-600">何でもお尋ねください</p>
                </div>
                <button onClick={() => setShowHelpChat(false)} className="text-gray-500 hover:text-black">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {helpChatMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] px-4 py-3 rounded-2xl ${message.type === 'user' ? 'bg-orange-100 text-black' : 'bg-gray-200 text-black'}`}>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            <div className="p-3 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                    <input type="text" value={helpInput} onChange={(e) => setHelpInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendHelpMessage()} placeholder="質問を入力..." className="flex-1 px-4 py-2 rounded-full bg-gray-100 border-2 border-gray-200 text-black text-sm" />
                    <button onClick={sendHelpMessage} className="px-4 py-2 rounded-full bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 text-orange-600 hover:bg-orange-500/30 transition-all duration-300">
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelpChat;