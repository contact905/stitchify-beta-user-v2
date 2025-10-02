import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, FileText, Send, Download, UploadCloud, Users } from 'lucide-react';
import { ChatMessage, Specification } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

const primaryButtonClasses = "bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 text-orange-600 rounded-xl px-4 py-2 font-semibold hover:bg-orange-500/30 transition-all duration-300 text-center";
const secondaryButtonClasses = "bg-black/5 backdrop-blur-sm border border-black/10 text-gray-700 rounded-xl px-4 py-2 font-semibold hover:bg-black/10 transition-all duration-300 text-center";

// Helper components defined inside ChatView to avoid creating new files.
const ButtonSelector = ({ options, onSelect }: { options: { label: string; value: any, description?: string }[], onSelect: (value: any, label: string) => void }) => (
    <div className="flex flex-col gap-2 mt-4">
        {options.map(option => (
            <button key={option.value} onClick={() => onSelect(option.value, option.label)} className={`${secondaryButtonClasses} w-full text-left`}>
                <span className="block">{option.label}</span>
                {option.description && <span className="block text-xs text-gray-600 mt-1 font-normal">{option.description}</span>}
            </button>
        ))}
    </div>
);

const QuantityAndDateForm = ({ onSave, initialSpec }: { onSave: (data: { quantities: { s: number, m: number, l: number }, deliveryDate: string }) => void, initialSpec: Specification }) => {
    const [s, setS] = useState(initialSpec.quantities.s);
    const [m, setM] = useState(initialSpec.quantities.m);
    const [l, setL] = useState(initialSpec.quantities.l);
    const [deliveryDate, setDeliveryDate] = useState(initialSpec.deliveryDate || '');
    const total = s + m + l;

    const handleSave = () => {
        onSave({ quantities: { s, m, l }, deliveryDate });
    };

    return (
        <div className="mt-2 space-y-4 p-4 rounded-lg bg-white">
            <div>
                <label className="text-sm font-semibold text-gray-800 mb-2 block">生産枚数</label>
                <div className="grid grid-cols-3 gap-3">
                    <div>
                        <label className="text-xs text-gray-500">S</label>
                        <input type="number" value={s} onChange={(e) => setS(parseInt(e.target.value) || 0)} className="w-full mt-1 p-2 rounded bg-gray-100 border border-gray-300 text-black" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">M</label>
                        <input type="number" value={m} onChange={(e) => setM(parseInt(e.target.value) || 0)} className="w-full mt-1 p-2 rounded bg-gray-100 border border-gray-300 text-black" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">L</label>
                        <input type="number" value={l} onChange={(e) => setL(parseInt(e.target.value) || 0)} className="w-full mt-1 p-2 rounded bg-gray-100 border border-gray-300 text-black" />
                    </div>
                </div>
                <div className="text-right text-black font-bold mt-2">合計: {total}枚</div>
            </div>
            <div>
                 <label className="text-sm font-semibold text-gray-800 mb-2 block">希望納期</label>
                 <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="w-full p-2 rounded bg-gray-100 border border-gray-300 text-black" />
            </div>
            <button onClick={handleSave} className={`${primaryButtonClasses} w-full`}>
                決定
            </button>
        </div>
    );
};

const RemarksInput = ({ onSave, initialValue }: { onSave: (remarks: string) => void, initialValue: string | null }) => {
    const [remarks, setRemarks] = useState(initialValue || '');
    
    return (
        <div className="mt-2 space-y-3 p-4 rounded-lg bg-white">
            <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={4}
                placeholder="特記事項やこだわりなど..."
                className="w-full p-2 rounded bg-gray-100 border border-gray-300 text-black placeholder-gray-500"
            />
            <button onClick={() => onSave(remarks)} className={`${primaryButtonClasses} w-full`}>
                備考を保存
            </button>
        </div>
    )
};

const SpecSummary = ({ spec, onStartMatching }: { spec: Specification; onStartMatching: (spec: Specification) => void; }) => (
    <div className="mt-2 space-y-3 p-4 rounded-lg bg-white border border-gray-200 text-sm">
        <h4 className="text-lg font-bold text-black mb-3">仕様書サマリー</h4>
        <div className="space-y-2 text-black">
            <p><strong className="text-gray-600">制作タイプ:</strong> {spec.productionType === 'original' ? 'オリジナル' : '既存ボディ'}</p>
            <p><strong className="text-gray-600">アイテム:</strong> {spec.itemType}</p>
             <p><strong className="text-gray-600">シルエット:</strong> {spec.silhouette === 'slim' ? 'ピタッと細め' : spec.silhouette === 'regular' ? '普通' : 'ブカっとゆったり'}</p>
             <p><strong className="text-gray-600">丈感:</strong> {spec.fit_length === 'short' ? '短め' : spec.fit_length === 'regular' ? '普通' : '長め'}</p>
            <p><strong className="text-gray-600">生地の厚み:</strong> {spec.fabricThickness === 'thin' ? '薄め' : spec.fabricThickness === 'medium' ? '普通' : '厚め'}</p>
            <p><strong className="text-gray-600">素材:</strong> {spec.material}</p>
            <p><strong className="text-gray-600">加工:</strong> {spec.processing === 'print' ? 'プリント' : spec.processing === 'embroidery' ? '刺繍' : '布の縫い付け'}</p>
            <p><strong className="text-gray-600">サンプル作成:</strong> {spec.sample === 'yes' ? 'あり' : 'なし'}</p>
            <p><strong className="text-gray-600">合計枚数:</strong> {spec.quantities.s + spec.quantities.m + spec.quantities.l}枚 (S:{spec.quantities.s}, M:{spec.quantities.m}, L:{spec.quantities.l})</p>
            <p><strong className="text-gray-600">希望納期:</strong> {spec.deliveryDate || '未定'}</p>
            {spec.remarks && <p><strong className="text-gray-600">備考:</strong> {spec.remarks}</p>}
        </div>
        <div className="flex flex-col md:flex-row gap-2 mt-4">
            <button onClick={() => alert('PDFをダウンロードします。')} className={`${secondaryButtonClasses} flex-1 flex items-center justify-center gap-2`}>
                <Download size={16} /> PDFダウンロード
            </button>
            <button onClick={() => onStartMatching(spec)} className={`${primaryButtonClasses} flex-1 flex items-center justify-center gap-2`}>
                <Users size={16} /> マッチングに進む
            </button>
        </div>
    </div>
);

interface ChatViewProps {
  initialMessages: ChatMessage[];
  initialSpec: Specification | null;
  initialUserPrompt?: string;
  saveDraft: (spec: Specification, messages: ChatMessage[]) => void;
  setCurrentView: (view: string) => void;
  onStartMatching: (spec: Specification) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ initialMessages, initialSpec, initialUserPrompt, saveDraft, setCurrentView, onStartMatching }) => {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [spec, setSpec] = useState<Specification>(initialSpec!);
    const [currentInput, setCurrentInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);
    const ai = useRef<GoogleGenAI | null>(null);
    const isProcessing = useRef(false);

    const addMessage = useCallback((message: Omit<ChatMessage, 'id'>) => {
        setMessages(prev => [...prev.filter(m => m.id !== 'loading'), { ...message, id: Date.now() + Math.random() }]);
    }, []);
    
    const progressConversation = useCallback(() => {
        if (isProcessing.current) return;
        
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.type === 'bot' && lastMessage.payload && lastMessage.payload.type !== 'summary') {
            return;
        }

        if (messages.some(m => m.payload?.type === 'summary')) {
            return;
        }

        isProcessing.current = true;

        setTimeout(() => {
            if (spec.productionType === null) {
                addMessage({ type: 'bot', content: 'アパレル制作を始めましょう！まず、制作タイプを選んでください。\nこれは製品の作り方を根本から決める最も重要な選択です。', payload: { key: 'productionType', type: 'buttons', options: [
                    { label: '【お手軽】既存ボディを使う', value: 'existing', description: 'コストを抑え、早く製品を作りたい方向け。小ロットからでも始めやすいのが強みです。' }, 
                    { label: '【こだわり】オリジナルでパターンから作る', value: 'original', description: 'ブランドだけの完全オリジナルな形を一から作ります。デザインの自由度が非常に高いです。' }
                ] } });
            } else if (spec.itemType === null) {
                addMessage({ type: 'bot', content: 'どのアイテムを作りますか？', payload: { key: 'itemType', type: 'buttons', options: [{ label: 'Tシャツ', value: 'Tシャツ' }, { label: 'パーカー', value: 'パーカー' }, { label: 'パンツ', value: 'パンツ' }] } });
            } else if (spec.silhouette === null) {
                addMessage({ type: 'bot', content: 'どんなシルエットがいいですか？', payload: { key: 'silhouette', type: 'buttons', options: [
                    { label: 'ピタッと細め', value: 'slim' },
                    { label: '普通', value: 'regular' },
                    { label: 'ブカっとゆったり', value: 'loose' },
                ]}});
            } else if (spec.fit_length === null) {
                addMessage({ type: 'bot', content: '丈感はどれくらいがいいですか？', payload: { key: 'fit_length', type: 'buttons', options: [
                    { label: '短め（お腹あたり）', value: 'short' },
                    { label: '普通（腰あたり）', value: 'regular' },
                    { label: '長め（お尻が隠れるくらい）', value: 'long' },
                ]}});
            } else if (spec.fabricThickness === null) {
                addMessage({ type: 'bot', content: '生地の厚みはどうしますか？', payload: { key: 'fabricThickness', type: 'buttons', options: [
                    { label: '薄め', value: 'thin' },
                    { label: '普通', value: 'medium' },
                    { label: '厚め', value: 'thick' },
                ]}});
            } else if (spec.material === null) {
                 addMessage({ type: 'bot', content: '希望の素材を教えてください。\n素材は製品の着心地や見た目を決める重要な要素です。', payload: { key: 'material', type: 'buttons', options: [
                    { label: 'コットン', value: 'コットン', description: '肌触りが良く、吸湿性に優れています。' }, 
                    { label: 'ポリエステル', value: 'ポリエステル', description: '速乾性があり、シワになりにくいです。' }, 
                    { label: 'ブレンド', value: 'ブレンド', description: 'コットンとポリエステルの良い点を両立します。' }
                ] } });
            } else if (spec.uploadedGraphic === null) {
                 addMessage({ type: 'bot', content: 'デザインデータをアップロード、または作成方法を選択してください。', payload: { key: 'uploadedGraphic', type: 'buttons', options: [
                    { label: 'デザインをアップロード', value: 'upload'}, 
                    { label: 'デザインがないので作成したい (開発中)', value: 'create_new'}
                ]}});
            } else if (spec.processing === null) {
                addMessage({ type: 'bot', content: 'プリントや刺繍などの加工方法を選んでください。', payload: { key: 'processing', type: 'buttons', options: [
                    { label: 'シルクプリント', value: 'print' }, 
                    { label: '刺繍', value: 'embroidery' },
                    { label: '布の縫い付け', value: 'fabric_sewing'}
                ] } });
            } else if (spec.sample === null) {
                addMessage({ type: 'bot', content: '本生産の前にサンプルを作成しますか？\n事前に試作品を確認することで、イメージ通りの製品を作る成功率が格段に上がります。', payload: { key: 'sample', type: 'buttons', options: [{ label: 'はい (推奨)', value: 'yes' }, { label: 'いいえ', value: 'no' }] } });
            } else if (spec.deliveryDate === null) { // Use deliveryDate to check if the form was filled
                addMessage({ type: 'bot', content: 'サイズごとの生産枚数と希望納期を入力してください。', payload: { type: 'quantity-date-form' } });
            } else if (spec.remarks === null) {
                addMessage({ type: 'bot', content: 'その他、特記事項やこだわりがあればご記入ください。(なければ空欄でOK)', payload: { type: 'remarks-form' } });
            } else {
                addMessage({ type: 'bot', content: 'ありがとうございます！仕様書が完成しました。', payload: { type: 'summary' } });
                addMessage({ type: 'bot', content: 'その他、何か質問はありますか？あれば自由に入力してください。' });
            }
            isProcessing.current = false;
        }, 500);
    }, [spec, messages, addMessage]);


    useEffect(() => {
        ai.current = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

        const startFlow = async () => {
            if (initialUserPrompt && ai.current) {
                addMessage({ type: 'user', content: initialUserPrompt });
                setMessages(prev => [...prev, { id: 'loading', type: 'bot', content: '解析中...' }]);
                
                try {
                    const response = await ai.current.models.generateContent({
                        model: "gemini-2.5-flash",
                        contents: `ユーザーのアパレル制作に関するリクエスト「${initialUserPrompt}」から、以下の情報をJSON形式で抽出してください。ユーザーの感覚的な表現（例：「ピタッと」→ 'slim'）を構造化データに変換してください。`,
                        config: {
                            responseMimeType: "application/json",
                            responseSchema: {
                                type: Type.OBJECT,
                                properties: {
                                    itemType: { type: Type.STRING, description: 'アイテムの種類 (例: Tシャツ, パーカー, パンツ)。見つからなければnull。' },
                                    material: { type: Type.STRING, description: '希望する素材 (例: オーガニックコットン, ポリエステル)。見つからなければnull。' },
                                    designFeatures: { type: Type.STRING, description: 'デザインの特徴 (例: ワンポイントロゴ, 全面プリント)。見つからなければnull。' },
                                    silhouette: { type: Type.STRING, description: "シルエットの感覚的表現。'slim', 'regular', 'loose'のいずれかに分類。見つからなければnull。" },
                                    fit_length: { type: Type.STRING, description: "丈感の感覚的表現。'short', 'regular', 'long'のいずれかに分類。見つからなければnull。" },
                                    fabricThickness: { type: Type.STRING, description: "生地の厚みの感覚的表現。'thin', 'medium', 'thick'のいずれかに分類。見つからなければnull。" },
                                }
                            }
                        }
                    });
                    
                    const jsonStr = response.text.trim();
                    const extractedData = JSON.parse(jsonStr) as Partial<Specification>;
                    
                    const detailsFound = [];
                    if (extractedData.itemType) detailsFound.push(`アイテム: ${extractedData.itemType}`);
                    if (extractedData.material) detailsFound.push(`素材: ${extractedData.material}`);
                    if (extractedData.designFeatures) detailsFound.push(`デザイン: ${extractedData.designFeatures}`);

                    const confirmationMessage = detailsFound.length > 0 
                        ? `承知いたしました。\n${detailsFound.join('、')}についてですね。\n詳細を詰めていきましょう！`
                        : 'はじめまして！どのようなアイテムを作りますか？';
                    
                    addMessage({ type: 'bot', content: confirmationMessage });
                    setSpec(prev => ({...prev, ...extractedData}));

                } catch (error) {
                    console.error("Error processing initial prompt:", error);
                    addMessage({ type: 'bot', content: '申し訳ありません、リクエストの解析中にエラーが発生しました。手順に沿って進めていきましょう。' });
                    setSpec(initialSpec!);
                }
            } else if (spec) {
                if (spec.itemType && messages.length === 0) {
                    addMessage({ type: 'bot', content: `「${spec.itemType}」の仕様書作成を始めますね！` });
                } else if (messages.length === 0) {
                     addMessage({ type: 'bot', content: `はじめまして！仕様書作成を始めましょう。` });
                }
                 // The useEffect watching spec will trigger progressConversation
            }
        };

        startFlow();
    }, []);

    useEffect(() => {
        progressConversation();
    }, [spec, progressConversation]);
    
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSelection = (key: keyof Specification, value: any, label: string) => {
        addMessage({ type: 'user', content: label });
        
        if (key === 'uploadedGraphic') {
            if (value === 'upload') {
                addMessage({ type: 'bot', content: 'デザインデータをアップロードしてください。（シミュレーション）', payload: { key: 'uploadedGraphic', type: 'image-upload' } });
                return;
            } else {
                alert("デザイン作成機能は現在開発中です。");
                setSpec(prev => ({ ...prev, uploadedGraphic: 'created_in_app' }));
            }
        } else {
            setSpec(prev => ({ ...prev, [key]: value }));
        }
    };

    const handleFormSave = (data: any, label: string) => {
        addMessage({ type: 'user', content: label });
        setSpec(prev => ({ ...prev, ...data }));
    }
    
    const handleImageUpload = (fileData: string, fileName: string) => {
        addMessage({ type: 'user', content: `${fileName}をアップロードしました` });
        setSpec(prev => ({ ...prev, uploadedGraphic: fileData }));
    };
    
    const handleSaveDraft = () => {
        saveDraft(spec, messages);
    };

    const handleFinalQuestion = async (question: string) => {
        if (!question.trim() || !ai.current) return;
        addMessage({ type: 'user', content: question });
        setCurrentInput('');
        // FIX: Replaced `addMessage` with `setMessages` to correctly add the loading message without a TypeScript error.
        setMessages(prev => [...prev, { id: 'loading', type: 'bot', content: '...' }]);

        try {
            const response = await ai.current.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: question,
                config: {
                    systemInstruction: `あなたはアパレル制作のアシスタントです。ユーザーの質問に回答してください。ただし、以下のFAQ情報のみを参考にし、情報がない場合は「申し訳ありません、その質問にはお答えできません。担当者から追って連絡いたします。」とだけ返答してください。\n\nFAQ:\n- サンプル作成費用: 1点5,000円から。仕様により変動。\n- 納期: 仕様確定から約30日〜45日。\n- 支払い方法: 銀行振込、クレジットカード。`
                }
            });
            addMessage({ type: 'bot', content: response.text });
        } catch (error) {
            console.error(error);
            addMessage({ type: 'bot', content: 'エラーが発生しました。もう一度お試しください。' });
        }
    };

    const isConversationDone = messages.some(m => m.payload?.type === 'summary');

    return (
        <div className="flex flex-col h-full bg-white">
             <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200 bg-white flex-shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 flex-shrink-0">
                        <Sparkles size={18} className="text-orange-500" />
                    </div>
                    <h2 className="text-base font-bold text-black whitespace-nowrap">仕様書作成アシスタント</h2>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleSaveDraft} className="px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 text-orange-600 hover:bg-orange-500/30">
                        <FileText size={16} />
                        <span>保存</span>
                    </button>
                    <button onClick={() => setCurrentView('dashboard')} className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-black/5 backdrop-blur-sm border border-black/10 text-gray-700 hover:bg-black/10">
                        閉じる
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                <div className="max-w-3xl mx-auto space-y-4">
                    {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] px-5 py-3 rounded-2xl ${message.type === 'user' ? 'bg-orange-100 text-black' : 'bg-white text-black border border-gray-200'}`}>
                                <p className="whitespace-pre-wrap">{message.content}</p>
                                {message.payload?.type === 'buttons' && <ButtonSelector options={message.payload.options!} onSelect={(value, label) => handleSelection(message.payload.key!, value, label)} />}
                                {message.payload?.type === 'quantity-date-form' && <QuantityAndDateForm onSave={(data) => handleFormSave(data, `生産枚数と納期を決定しました`)} initialSpec={spec} />}
                                {message.payload?.type === 'remarks-form' && <RemarksInput onSave={(remarks) => handleFormSave({ remarks }, remarks || '特記事項なし')} initialValue={spec.remarks} />}
                                {message.payload?.type === 'image-upload' && <button onClick={() => handleImageUpload('placeholder.jpg', 'design.png')} className={`${secondaryButtonClasses} w-full flex items-center justify-center gap-2 mt-4`}><UploadCloud size={16}/> アップロード</button>}
                                {message.payload?.type === 'summary' && <SpecSummary spec={spec} onStartMatching={onStartMatching} />}
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0 pb-24 md:pb-4">
                <div className="max-w-3xl mx-auto flex gap-3">
                    <input 
                      type="text" 
                      value={currentInput} 
                      onChange={(e) => setCurrentInput(e.target.value)} 
                      onKeyPress={(e) => e.key === 'Enter' && handleFinalQuestion(currentInput)} 
                      placeholder={isConversationDone ? "質問を入力..." : "選択肢から選んでください"} 
                      disabled={!isConversationDone}
                      className="flex-1 px-4 py-3 rounded-xl transition-all duration-300 bg-gray-100 border-2 border-gray-200 text-black disabled:bg-gray-100/50" 
                    />
                    <button 
                      onClick={() => handleFinalQuestion(currentInput)} 
                      disabled={!isConversationDone}
                      className={`${primaryButtonClasses} px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatView;
