export interface Language {
  code: string;
  label: string;
  shortCode: string;
}

export interface Notification {
  id: string;
  type: 'feature' | 'template' | 'project' | 'message';
  emoji: string;
  title: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatMessagePayload {
  key?: keyof Specification;
  type: 'buttons' | 'summary' | 'loading' | 'text' | 'image-upload' | 'quantity-date-form' | 'remarks-form';
  options?: { label: string; value: any; description?: string }[];
  fields?: { name: string; label: string; type: string }[];
  data?: Specification;
}

export interface ChatMessage {
  id: string | number;
  type?: 'user' | 'bot';
  sender?: 'user' | 'factory';
  senderName?: string;
  content: string;
  time?: string;
  isRead?: boolean;
  payload?: ChatMessagePayload;
}

export interface FactoryChat {
  id: string;
  factoryId: string;
  factoryName: string;
  projectName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isPinned: boolean;
  category: 'active' | 'inquiry';
  messages: ChatMessage[];
}

export interface Stage {
  name: string;
  completed: boolean;
  current?: boolean;
}

export interface Project {
  id: string;
  title: string;
  factoryName: string;
  currentStage: number;
  stages: Stage[];
  itemType: string;
  lotSize: number;
  expectedDelivery: string;
  notifications: { id: string; unread: boolean }[];
  messages: { id: string; sender: string; content: string; time: string; unread: boolean }[];
}

export interface PastProduct {
  id: string;
  name: string;
  image: string;
  category: string;
  lotSize: number;
  factoryName: string;
  price: string;
}

export interface Factory {
  id: string;
  name: string;
  location: string;
  specialtyItems: string[];
  specialtyProcessing: string[];
  minLot: number;
  maxLot: number;
  rating: number;
  completedProjects: number;
  image: string;
}

export interface Campaign {
  id: string;
  title: string;
  factoryName: string;
  factoryId: string;
  discount: string;
  category: string;
  description: string;
  deadline: string;
  minLot: number;
  image: string;
  badge: string;
}

export interface Specification {
  productionType: 'existing' | 'original' | null;
  itemType: string | null;
  material: string | null;
  silhouette: 'slim' | 'regular' | 'loose' | null;
  fit_length: 'short' | 'regular' | 'long' | null;
  fabricThickness: 'thin' | 'medium' | 'thick' | null;
  designFeatures: string | null;
  uploadedGraphic: string | null;
  processing: 'print' | 'embroidery' | 'fabric_sewing' | null;
  sample: 'yes' | 'no' | null;
  quantities: {
    s: number;
    m: number;
    l: number;
  };
  deliveryDate: string | null;
  remarks: string | null;
}


export interface Draft {
  id: string;
  title: string;
  category: string;
  lastEdited: string;
  messages: ChatMessage[];
  spec: Specification;
  completed: boolean;
}

export interface ProfileVisibility {
  brandName: boolean;
  brandConcept: boolean;
  contactName: boolean;
  email: boolean;
  establishedYear: boolean;
  location: boolean;
  capital: boolean;
  entityType: boolean;
  website: boolean;
}

export interface MatchedFactory extends Factory {
  score: number;
  matchRate: number;
}