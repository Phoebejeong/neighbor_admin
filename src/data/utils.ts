import { LocalAd, AdStatus, Apartment } from './types';

export function getAdStatus(ad: LocalAd): AdStatus {
  if (!ad.startDate || !ad.endDate) return { label: '기간미정', cls: 'border border-stone-300 text-stone-500 px-2 py-0.5 rounded-full' };
  const today = new Date().toISOString().slice(0, 10);
  if (today < ad.startDate) return { label: '예정', cls: 'border border-amber-400 text-amber-600 px-2 py-0.5 rounded-full' };
  if (today > ad.endDate) return { label: '종료', cls: 'border border-red-400 text-red-500 px-2 py-0.5 rounded-full' };
  return { label: '진행중', cls: 'border border-emerald-400 text-emerald-500 px-2 py-0.5 rounded-full' };
}

export function formatMoney(n: number): string {
  return n.toLocaleString('ko-KR');
}

export function genId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

/** Haversine 거리 계산 (km) */
export function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/** 반경 내 아파트 필터 + 거리순 정렬 */
export function getNearbyApartments(
  lat: number,
  lng: number,
  allApartments: Apartment[],
  radiusKm: number = 5
): (Apartment & { distance: number })[] {
  return allApartments
    .map(apt => ({ ...apt, distance: getDistanceKm(lat, lng, apt.lat, apt.lng) }))
    .filter(apt => apt.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
}
