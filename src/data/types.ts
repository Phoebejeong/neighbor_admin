export interface LocalShop {
  id: string;
  name: string;
  category: string;
  icon: string;
  tagline: string;
  phone: string;
  address: string;
  lat: number;
  lng: number;
  weight: number;
  isHomeVisible: boolean;
  createdAt: string;
  expiresAt: string;
  targetApartments: string[];
}

export interface Apartment {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  households: number;
  appInstalls?: number;
  activeUsers?: number;
}

export interface LocalAd {
  id: string;
  title: string;
  description: string;
  advertiser: string;
  period: string;
  startDate: string;
  endDate: string;
  contact: string;
  address: string;
  amount: number;
  paymentStatus: 'paid' | 'unpaid';
  viewCount: number;
  createdAt: string;
  targetApartments: string[]; // apartment ids
}

export interface ShoppingItem {
  id: string;
  name: string;
  price: number;
  discountRate: number;
  shopName: string;
  amount: number;
  paymentStatus: 'paid' | 'unpaid';
  viewCount: number;
  createdAt: string;
  targetApartments: string[]; // apartment ids
}

export type AdStatus = { label: string; cls: string };

export const CATEGORIES = ['음식점', '카페', '미용실', '헬스장', '약국', '마트', '학원', '세탁소', '병원', '부동산', '기타'];

/** 영업 리드 (미가입 상가) */
export interface Lead {
  id: string;
  shopName: string;
  category: string;
  ownerName: string;
  phone: string;
  address: string;
  lat: number;
  lng: number;
  status: 'new' | 'contacted' | 'interested' | 'registered' | 'rejected';
  contactLogs: ContactLog[];
  createdAt: string;
}

export interface ContactLog {
  date: string;
  method: 'phone' | 'visit' | 'email';
  note: string;
  result: 'no-answer' | 'callback' | 'interested' | 'rejected';
}

export const ICONS: Record<string, string> = {
  '음식점': 'pizza', '카페': 'coffee-outline', '미용실': 'content-cut',
  '헬스장': 'dumbbell', '약국': 'hospital-box-outline', '마트': 'cart-outline',
  '학원': 'school-outline', '세탁소': 'tshirt-crew-outline', '병원': 'hospital-box',
  '부동산': 'home-outline', '기타': 'store-outline',
};
