import { Language, Notification, FactoryChat, Project, PastProduct, Factory, Campaign, Draft, Specification } from './types';

export const LANGUAGES: Language[] = [
  { code: 'ja', label: '日本語', shortCode: 'JP' },
  { code: 'en', label: 'English', shortCode: 'EN' },
  { code: 'zh', label: '中文', shortCode: 'ZH' }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 'notif1', type: 'feature', emoji: '🎉', title: '新機能リリース！', content: 'AI仕様書作成機能が大幅にアップデート。対話形式でより詳細な仕様書が作成できるようになりました。', timestamp: '2時間前', isRead: false },
  { id: 'notif2', type: 'template', emoji: '✨', title: '人気テンプレート', content: '今月最も使われているテンプレートをチェック。オーガニックコットンTシャツのテンプレートが人気です。', timestamp: '5時間前', isRead: false },
  { id: 'notif3', type: 'project', emoji: '📦', title: 'プロジェクト更新', content: '「オーガニックTシャツ製作」が裁断・縫製工程に入りました。', timestamp: '昨日', isRead: false },
  { id: 'notif4', type: 'message', emoji: '💬', title: '東京アパレル製作所からメッセージ', content: '裁断が完了しました。縫製工程に入ります。', timestamp: '昨日', isRead: true }
];

export const INITIAL_FACTORY_CHATS: FactoryChat[] = [
  {
    id: 'fc1', factoryId: 'f1', factoryName: '東京アパレル製作所', projectName: 'オーガニックTシャツ製作', lastMessage: '裁断が完了しました。縫製工程に入ります。', lastMessageTime: '10:30', unreadCount: 1, isPinned: true, category: 'active',
    messages: [
      { id: 'm1', sender: 'factory', senderName: '東京アパレル製作所', content: 'プロジェクトのご依頼ありがとうございます。仕様書を確認いたしました。', time: '昨日 14:20', isRead: true },
      { id: 'm2', sender: 'user', senderName: 'あなた', content: 'よろしくお願いします。納期は守れそうでしょうか？', time: '昨日 14:35', isRead: true },
      { id: 'm3', sender: 'factory', senderName: '東京アパレル製作所', content: 'はい、10月15日の納期で問題ございません。素材の手配を開始いたします。', time: '昨日 15:10', isRead: true },
      { id: 'm4', sender: 'user', senderName: 'あなた', content: '承知しました。進捗があればご連絡ください。', time: '昨日 15:15', isRead: true },
      { id: 'm5', sender: 'factory', senderName: '東京アパレル製作所', content: '裁断が完了しました。縫製工程に入ります。', time: '10:30', isRead: false }
    ]
  },
  {
    id: 'fc2', factoryId: 'f2', factoryName: '関西縫製工房', projectName: '見積もり相談', lastMessage: 'ロット数が30着以上であれば対応可能です。', lastMessageTime: '昨日', unreadCount: 0, isPinned: false, category: 'inquiry',
    messages: [
      { id: 'm1', sender: 'user', senderName: 'あなた', content: 'パンツの製作についてお見積もりをお願いできますでしょうか？', time: '2日前 16:00', isRead: true },
      { id: 'm2', sender: 'factory', senderName: '関西縫製工房', content: 'お問い合わせありがとうございます。詳しい仕様を教えていただけますか？', time: '2日前 16:45', isRead: true },
      { id: 'm3', sender: 'user', senderName: 'あなた', content: 'デニムパンツで、ロット数は50着を予定しています。', time: '昨日 10:00', isRead: true },
      { id: 'm4', sender: 'factory', senderName: '関西縫製工房', content: 'ロット数が30着以上であれば対応可能です。お見積もりを作成してお送りいたします。', time: '昨日 11:20', isRead: true }
    ]
  }
];

export const ACTIVE_PROJECTS: Project[] = [
  {
    id: 'p1', title: 'オーガニックTシャツ製作', factoryName: '東京アパレル製作所', currentStage: 3,
    stages: [
      { name: '仕様確認', completed: true }, { name: '素材調達', completed: true }, { name: '裁断・縫製', completed: true, current: true }, { name: '加工・プリント', completed: false }, { name: '検品', completed: false }, { name: '発送', completed: false }
    ],
    itemType: 'Tシャツ', lotSize: 100, expectedDelivery: '2025-10-15', notifications: [{ id: 'n1', unread: true }],
    messages: [
      { id: 'm1', sender: '東京アパレル製作所', content: '裁断が完了しました。縫製工程に入ります。', time: '10:30', unread: true },
      { id: 'm2', sender: 'あなた', content: '進捗ありがとうございます！', time: '昨日', unread: false }
    ]
  },
  {
    id: 'p2', title: 'プレミアムパーカー製作', factoryName: '東京アパレル製作所', currentStage: 1,
    stages: [
      { name: '仕様確認', completed: true }, { name: '素材調達', completed: true, current: true }, { name: '裁断・縫製', completed: false }, { name: '加工・プリント', completed: false }, { name: '検品', completed: false }, { name: '発送', completed: false }
    ],
    itemType: 'パーカー', lotSize: 150, expectedDelivery: '2025-11-20', notifications: [],
    messages: [
      { id: 'm1', sender: '東京アパレル製作所', content: '仕様書を確認しました。素材の手配を開始します。', time: '昨日 15:00', unread: false }
    ]
  },
  {
    id: 'p3', title: 'デニムジャケット製作', factoryName: '関西縫製工房', currentStage: 4,
    stages: [
      { name: '仕様確認', completed: true }, { name: '素材調達', completed: true }, { name: '裁断・縫製', completed: true }, { name: '加工・プリント', completed: true }, { name: '検品', completed: true, current: true }, { name: '発送', completed: false }
    ],
    itemType: 'ジャケット', lotSize: 80, expectedDelivery: '2025-10-10', notifications: [{ id: 'n1', unread: true }],
    messages: [
      { id: 'm1', sender: '関西縫製工房', content: '検品が完了しました。発送準備に入ります。', time: '14:20', unread: true }
    ]
  }
];

export const PAST_PRODUCTS: PastProduct[] = [
  { id: 'prod1', name: 'オーガニックコットンTシャツ', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', category: 'Tシャツ', lotSize: 100, factoryName: '東京アパレル製作所', price: '¥1,200/着' },
  { id: 'prod2', name: 'プレミアムパーカー', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', category: 'パーカー', lotSize: 150, factoryName: '東京アパレル製作所', price: '¥2,800/着' },
  { id: 'prod3', name: 'スタイリッシュジャケット', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', category: 'ジャケット', lotSize: 80, factoryName: '関西縫製工房', price: '¥4,500/着' },
  { id: 'prod4', name: 'カジュアルスウェット', image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500', category: 'スウェット', lotSize: 120, factoryName: '東京アパレル製作所', price: '¥1,800/着' }
];

export const MOCK_FACTORIES: Factory[] = [
  { id: 'f1', name: '東京アパレル製作所', location: '東京都', specialtyItems: ['Tシャツ', 'パーカー', 'スウェット'], specialtyProcessing: ['刺繍', 'シルクプリント', '昇華プリント'], minLot: 50, maxLot: 1000, rating: 4.8, completedProjects: 150, image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400' },
  { id: 'f2', name: '関西縫製工房', location: '大阪府', specialtyItems: ['パンツ', 'ジャケット', 'コート'], specialtyProcessing: ['特殊縫製', '立体裁断', '手仕上げ'], minLot: 30, maxLot: 500, rating: 5.0, completedProjects: 98, image: 'https://images.unsplash.com/photo-1558769132-cb1aea3c5c6e?w=400' },
  { id: 'f3', name: 'ニット専門工場 K社', location: '新潟県', specialtyItems: ['ニット', 'カーディガン', 'セーター'], specialtyProcessing: ['ホールガーメント', '手編み'], minLot: 20, maxLot: 400, rating: 4.9, completedProjects: 75, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400' }
];

export const CAMPAIGNS: Campaign[] = [
  { id: 'camp1', title: '新春キャンペーン - Tシャツ製作20%OFF', factoryName: '東京アパレル製作所', factoryId: 'f1', discount: '20%', category: 'Tシャツ', description: '100着以上のオーガニックコットンTシャツ製作で20%OFF。高品質な刺繍加工も特別価格で提供中。', deadline: '2025-10-31', minLot: 100, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', badge: '期間限定' },
  { id: 'camp2', title: '初回限定 - 製作費10%OFF', factoryName: '関西縫製工房', factoryId: 'f2', discount: '10%', category: '全アイテム', description: '初めてのお客様限定。全アイテム製作費から10%OFF。小ロットから対応可能です。', deadline: '2025-11-30', minLot: 30, image: 'https://images.unsplash.com/photo-1558769132-cb1aea3c5c6e?w=500', badge: '初回限定' },
  { id: 'camp3', title: '冬物応援 - ニット製作特別価格', factoryName: 'ニット専門工場 K社', factoryId: 'f3', discount: '15%', category: 'ニット', description: '秋冬シーズン向けニット製品を特別価格で。ホールガーメント技術による高品質な仕上がり。', deadline: '2025-10-20', minLot: 50, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', badge: '秋冬限定' },
  { id: 'camp4', title: 'パーカー大量発注割引', factoryName: '東京アパレル製作所', factoryId: 'f1', discount: '25%', category: 'パーカー', description: '200着以上のパーカー製作で25%OFFの大幅割引。チーム、イベント、企業向けに最適。', deadline: '2025-11-15', minLot: 200, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', badge: '大口割引' }
];

export const EMPTY_SPEC: Specification = {
  productionType: null,
  itemType: null,
  material: null,
  silhouette: null,
  fit_length: null,
  fabricThickness: null,
  designFeatures: null,
  uploadedGraphic: null,
  processing: null,
  sample: null,
  quantities: { s: 0, m: 0, l: 0 },
  deliveryDate: null,
  remarks: null,
};


export const INITIAL_DRAFTS: Draft[] = [
  {
    id: 'draft1', title: 'オーガニックTシャツの仕様書', category: 'Tシャツ', lastEdited: '2025-10-01',
    spec: {
      ...EMPTY_SPEC,
      productionType: 'original',
      itemType: 'Tシャツ',
      material: 'オーガニックコットン',
      quantities: { s: 0, m: 100, l: 0 },
    },
    messages: [
      { id: 1, type: 'bot', content: '「Tシャツ」についての仕様書を作成しますね！' },
      { id: 2, type: 'user', content: 'オーガニックコットンのTシャツを作りたいです' },
      { id: 3, type: 'bot', content: 'オーガニックコットンのTシャツですね。ロット数はどのくらいを予定していますか？' },
      { id: 4, type: 'user', content: '100着くらいです' }
    ],
    completed: false
  },
  {
    id: 'draft2', title: 'プレミアムパーカー企画', category: 'パーカー', lastEdited: '2025-09-28',
    spec: {
      ...EMPTY_SPEC,
      productionType: 'original',
      itemType: 'パーカー',
    },
    messages: [
      { id: 1, type: 'bot', content: '「パーカー」についての仕様書を作成しますね！' },
      { id: 2, type: 'user', content: '高品質なパーカーを作りたい' }
    ],
    completed: false
  }
];