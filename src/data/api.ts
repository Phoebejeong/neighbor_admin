// API 아파트 검색 (eyevacs5-user-app 동일 엔드포인트)
const API_BASE = 'https://user-dev.api.eyevacs.com';

export interface ApiApartment {
  id: number;
  name: string;
  address: string;
  oldAddress: string | null;
  siteType: 'APARTMENT' | 'OFFICE' | null;
  group: string;
  keyword: string | null;
  phone: string | null;
  fax: string | null;
  email: string | null;
  zipCode: string | null;
  alias: string | null;
}

export async function searchApartments(keyword: string): Promise<ApiApartment[]> {
  try {
    const res = await fetch(`${API_BASE}/apartment/apartments?search=${encodeURIComponent(keyword)}`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.apartments || [];
  } catch {
    return [];
  }
}
