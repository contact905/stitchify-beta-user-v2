import React, { useState } from 'react';
import { Building2, MessageSquare, Send } from 'lucide-react';
import { FactoryChat } from '../types';

interface MessagesViewProps {
  factoryChats: FactoryChat[];
  setFactoryChats: React.Dispatch<React.SetStateAction<FactoryChat[]>>;
  selectedFactory: string | null;
  setSelectedFactory: (id: string | null) => void;
  currentLanguage: string;
}

const MessagesView: React.FC<MessagesViewProps> = ({ factoryChats, setFactoryChats, selectedFactory, setSelectedFactory, currentLanguage }) => {
    const [messageTab, setMessageTab] = useState('all');
    const [autoTranslate, setAutoTranslate] = useState(false);
    const [factoryMessageInput, setFactoryMessageInput] = useState('');

    const primaryButtonGlass = "bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 text-orange-600 font-semibold hover:bg-orange-500/30 transition-all duration-300";
    const secondaryButtonGlass = "bg-black/5 backdrop-blur-sm border border-black/10 text-gray-700 font-semibold hover:bg-black/10 transition-all duration-300";

    const togglePinChat = (chatId: string) => {
        setFactoryChats(prev => prev.map(chat => chat.id === chatId ? { ...chat, isPinned: !chat.isPinned } : chat));
    };

    const translateText = (text: string) => {
        if (!autoTranslate || currentLanguage === 'ja') return text;
        if (currentLanguage === 'en') {
            const translations: { [key: string]: string } = {
                'プロジェクトのご依頼ありがとうございます。仕様書を確認いたしました。': 'Thank you for your project request. We have confirmed the specifications.',
                '裁断が完了しました。縫製工程に入ります。': 'Cutting has been completed. We are moving to the sewing process.',
                'よろしくお願いします。納期は守れそうでしょうか？': 'Thank you. Will you be able to meet the deadline?',
                'はい、10月15日の納期で問題ございません。素材の手配を開始いたします。': 'Yes, the October 15th deadline is fine. We will start arranging materials.',
                '承知しました。進捗があればご連絡ください。': 'Understood. Please contact us with any progress updates.'
            };
            return translations[text] || text;
        }
        return text;
    };

    const sendFactoryMessage = () => {
        if (!factoryMessageInput.trim() || !selectedFactory) return;
        const newMessage = { id: `m${Date.now()}`, sender: 'user' as const, senderName: 'あなた', content: factoryMessageInput, time: '今', isRead: true };
        setFactoryChats(prev => prev.map(chat => {
            if (chat.id === selectedFactory) {
                return { ...chat, messages: [...chat.messages, newMessage], lastMessage: factoryMessageInput, lastMessageTime: '今' };
            }
            return chat;
        }));
        setFactoryMessageInput('');
        setTimeout(() => {
            const autoReply = { id: `m${Date.now() + 1}`, sender: 'factory' as const, senderName: factoryChats.find(c => c.id === selectedFactory)?.factoryName || '', content: 'メッセージを確認いたしました。担当者より改めてご連絡させていただきます。', time: '今', isRead: false };
            setFactoryChats(prev => prev.map(chat => {
                if (chat.id === selectedFactory) {
                    return { ...chat, messages: [...chat.messages, autoReply], lastMessage: autoReply.content, lastMessageTime: '今', unreadCount: 1 };
                }
                return chat;
            }));
        }, 2000);
    };

    const markChatAsRead = (chatId: string) => {
        setFactoryChats(prev => prev.map(chat => {
            if (chat.id === chatId) {
                return { ...chat, unreadCount: 0, messages: chat.messages.map(msg => ({ ...msg, isRead: true })) };
            }
            return chat;
        }));
    };
    
    const currentChat = factoryChats.find(chat => chat.id === selectedFactory);
    
    return (
        <div className="flex h-screen bg-white overflow-hidden pb-20 md:pb-0">
          <div className={`w-full md:w-96 border-r border-gray-200 flex flex-col ${selectedFactory ? 'hidden md:flex' : 'flex'} bg-gray-50`}>
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-100">
              <h2 className="text-2xl font-bold text-black">メッセージ</h2>
              <p className="text-sm text-gray-600 mt-1">工場とのやり取り</p>
              <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide">
                {[{ id: 'all', label: 'すべて', count: factoryChats.length }, { id: 'pinned', label: 'ピン留め', count: factoryChats.filter(c => c.isPinned).length }, { id: 'active', label: '進行中', count: factoryChats.filter(c => c.category === 'active').length }, { id: 'inquiry', label: '相談', count: factoryChats.filter(c => c.category === 'inquiry').length }].map(tab => (
                  <button key={tab.id} onClick={() => setMessageTab(tab.id)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${messageTab === tab.id ? primaryButtonGlass : secondaryButtonGlass}`}>
                    {tab.label}{tab.count > 0 && (<span className="ml-1.5 px-1.5 rounded-full bg-black/10">{tab.count}</span>)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {factoryChats.filter(chat => {
                if (messageTab === 'all') return true;
                if (messageTab === 'pinned') return chat.isPinned;
                return chat.category === messageTab;
              }).sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)).map(chat => (
                <button key={chat.id} onClick={() => { setSelectedFactory(chat.id); markChatAsRead(chat.id); }} className={`w-full p-4 border-b border-gray-200 transition-all duration-200 text-left relative ${selectedFactory === chat.id ? 'bg-orange-100' : 'hover:bg-gray-100'}`}>
                  {chat.isPinned && (<div className="absolute top-2 right-2"><div className="text-orange-500">📌</div></div>)}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0 pr-8">
                      <h3 className="font-bold text-black truncate">{chat.factoryName}</h3>
                      <p className="text-xs text-gray-500 truncate">{chat.projectName}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 ml-2">
                      <span className="text-xs text-gray-500 whitespace-nowrap">{chat.lastMessageTime}</span>
                      {chat.unreadCount > 0 && (<div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-orange-500">{chat.unreadCount}</div>)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 truncate">{chat.lastMessage}</p>
                </button>
              ))}
            </div>
          </div>
          {currentChat ? (
            <div className="flex-1 flex flex-col bg-white">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedFactory(null)} className="md:hidden text-gray-500 hover:text-black transition-colors">←</button>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100 border-2 border-gray-200">
                    <Building2 size={24} className="text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-black">{currentChat.factoryName}</h3>
                    <p className="text-xs text-gray-500">{currentChat.projectName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setAutoTranslate(!autoTranslate)} className={`px-3 py-2 rounded-lg text-xs flex items-center gap-2 ${autoTranslate ? primaryButtonGlass : secondaryButtonGlass}`}>
                    🌐 翻訳
                  </button>
                  <button onClick={() => togglePinChat(selectedFactory!)} className={`${secondaryButtonGlass} p-2 rounded-lg text-xl hover:scale-110`}>
                    {currentChat.isPinned ? '📌' : '📍'}
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {currentChat.messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] ${message.sender === 'factory' ? 'flex gap-3' : ''}`}>
                      {message.sender === 'factory' && (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-200 border-2 border-gray-300">
                          <Building2 size={16} className="text-gray-500" />
                        </div>
                      )}
                      <div>
                        <div className={`px-4 py-3 rounded-2xl ${message.sender === 'user' ? 'bg-orange-100 text-black' : 'bg-white text-black border border-gray-200'}`}>
                          <p className="text-sm whitespace-pre-wrap">{translateText(message.content)}</p>
                          {autoTranslate && currentLanguage !== 'ja' && message.sender === 'factory' && (<p className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">原文: {message.content}</p>)}
                        </div>
                        <p className={`text-xs text-gray-500 mt-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>{message.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-3">
                  <input type="text" value={factoryMessageInput} onChange={(e) => setFactoryMessageInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendFactoryMessage()} placeholder="メッセージを入力..." className="flex-1 px-4 py-3 rounded-xl transition-all duration-300 bg-gray-100 border-2 border-gray-200 text-black placeholder-gray-500" />
                  <button onClick={sendFactoryMessage} className={`${primaryButtonGlass} px-6 py-3 rounded-xl font-bold flex items-center gap-2 text-white`}>
                    <Send size={20} />送信
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center bg-white">
              <div className="text-center">
                <MessageSquare size={64} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">チャットを選択してください</p>
              </div>
            </div>
          )}
        </div>
    );
};

export default MessagesView;