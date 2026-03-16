import { LocalShop, LocalAd, ShoppingItem, Apartment, Lead } from './types';

// 성남시 중원구 일대 아파트 mock 데이터 (실제 좌표 기반)
export const apartments: Apartment[] = [
  { id: 'apt1', name: '산성역 포레스티아', address: '성남시 중원구 산성대로 345', lat: 37.4425, lng: 127.1377, households: 1824, appInstalls: 1243, activeUsers: 876 },
  { id: 'apt2', name: '신흥역 하늘채', address: '성남시 중원구 광명로 20', lat: 37.4401, lng: 127.1515, households: 956, appInstalls: 612, activeUsers: 405 },
  { id: 'apt3', name: '위례신도시 A1블록', address: '성남시 수정구 위례광장로 20', lat: 37.4780, lng: 127.1430, households: 2100, appInstalls: 1680, activeUsers: 1120 },
  { id: 'apt4', name: '모란역 센트럴타운', address: '성남시 중원구 성남대로 1126', lat: 37.4320, lng: 127.1290, households: 780, appInstalls: 489, activeUsers: 312 },
  { id: 'apt5', name: '야탑역 한솔마을', address: '성남시 분당구 야탑로 69', lat: 37.4115, lng: 127.1275, households: 1200, appInstalls: 840, activeUsers: 590 },
  { id: 'apt6', name: '서현역 시범단지', address: '성남시 분당구 서현로 210', lat: 37.3845, lng: 127.1235, households: 1540, appInstalls: 1078, activeUsers: 756 },
  { id: 'apt7', name: '판교 알파리움', address: '성남시 분당구 판교역로 146', lat: 37.3950, lng: 127.1110, households: 890, appInstalls: 623, activeUsers: 445 },
  { id: 'apt8', name: '단대오거리 현대', address: '성남시 중원구 단대로 170', lat: 37.4450, lng: 127.1570, households: 640, appInstalls: 384, activeUsers: 245 },
  { id: 'apt9', name: '수진역 두산위브', address: '성남시 수정구 수진로 100', lat: 37.4375, lng: 127.1430, households: 720, appInstalls: 468, activeUsers: 310 },
  { id: 'apt10', name: '오리역 래미안', address: '성남시 분당구 오리로 30', lat: 37.3390, lng: 127.1090, households: 1100, appInstalls: 715, activeUsers: 490 },
  { id: 'apt11', name: '정자역 아이파크', address: '성남시 분당구 정자로 50', lat: 37.3660, lng: 127.1080, households: 1350, appInstalls: 945, activeUsers: 672 },
  { id: 'apt12', name: '복정역 센트레빌', address: '성남시 수정구 복정로 80', lat: 37.4695, lng: 127.1265, households: 920, appInstalls: 598, activeUsers: 389 },
];

export const initialShops: LocalShop[] = [
  { id: 'shop1', name: '맛있는피자', category: '음식점', icon: 'pizza', tagline: '매일 점심 세트 20% 할인!', phone: '031-123-4567', address: '성남시 중원구 갈마치로 288-14 1층', lat: 37.4410, lng: 127.1400, weight: 10, isHomeVisible: true, createdAt: '2026-03-01', expiresAt: '', targetApartments: ['apt1', 'apt2', 'apt4'] },
  { id: 'shop2', name: '헤어살롱M', category: '미용실', icon: 'content-cut', tagline: '3월 컷+펌 패키지 50,000원', phone: '031-234-5678', address: '성남시 중원구 갈마치로 290 2층', lat: 37.4412, lng: 127.1405, weight: 8, isHomeVisible: true, createdAt: '2026-03-01', expiresAt: '', targetApartments: ['apt1', 'apt2'] },
  { id: 'shop3', name: '피트니스24', category: '헬스장', icon: 'dumbbell', tagline: '봄맞이 3개월 등록 시 1개월 무료', phone: '031-345-6789', address: '성남시 중원구 갈마치로 292 지하1층', lat: 37.4414, lng: 127.1408, weight: 5, isHomeVisible: true, createdAt: '2026-02-28', expiresAt: '', targetApartments: ['apt1'] },
  { id: 'shop4', name: '꽃보다카페', category: '카페', icon: 'coffee-outline', tagline: '아메리카노 2,500원 — 입주민 할인', phone: '031-567-8901', address: '', lat: 37.4400, lng: 127.1395, weight: 6, isHomeVisible: true, createdAt: '2026-03-02', expiresAt: '', targetApartments: ['apt1', 'apt4', 'apt8'] },
  { id: 'shop5', name: '행복약국', category: '약국', icon: 'hospital-box-outline', tagline: '건강기능식품 20% 할인 · 야간영업', phone: '031-678-9012', address: '성남시 중원구 갈마치로 294 1층', lat: 37.4416, lng: 127.1412, weight: 7, isHomeVisible: true, createdAt: '2026-03-02', expiresAt: '', targetApartments: ['apt1', 'apt2'] },
  { id: 'shop6', name: '싱싱마트', category: '마트', icon: 'cart-outline', tagline: '신선한 과일·채소 산지직송 — 입주민 무료배달', phone: '031-789-0123', address: '성남시 중원구 갈마치로 296 1층', lat: 37.4418, lng: 127.1415, weight: 9, isHomeVisible: true, createdAt: '2026-03-03', expiresAt: '', targetApartments: ['apt1', 'apt2', 'apt4'] },
  { id: 'shop7', name: '동네세탁소', category: '세탁소', icon: 'tshirt-crew-outline', tagline: '이불 세탁 당일 수거/배달', phone: '031-456-7890', address: '', lat: 37.4405, lng: 127.1390, weight: 3, isHomeVisible: true, createdAt: '2026-02-25', expiresAt: '', targetApartments: ['apt1'] },
  { id: 'shop8', name: '수학잘하는학원', category: '학원', icon: 'school-outline', tagline: '초등·중등 수학 전문 — 무료 레벨테스트', phone: '031-890-1234', address: '성남시 중원구 갈마치로 298 3층', lat: 37.4420, lng: 127.1418, weight: 4, isHomeVisible: true, createdAt: '2026-03-01', expiresAt: '', targetApartments: ['apt1', 'apt9'] },
];

export const initialAds: LocalAd[] = [
  { id: 'ad1', title: '봄맞이 인테리어 대전', description: '전국 인테리어 업체 최대 30% 할인 이벤트.', advertiser: '리빙플러스', period: '2026.03.01 ~ 03.31', startDate: '2026-03-01', endDate: '2026-03-31', contact: '1588-1234', address: '', amount: 500000, paymentStatus: 'paid', viewCount: 342, createdAt: '2026-03-01', targetApartments: ['apt1', 'apt2', 'apt4'] },
  { id: 'ad2', title: '전기차 보조금 안내', description: '2026년 전기차 보조금 신청 방법 총정리.', advertiser: '에코모빌리티', period: '2026.03.01 ~ 04.30', startDate: '2026-03-01', endDate: '2026-04-30', contact: '', address: '', amount: 300000, paymentStatus: 'paid', viewCount: 128, createdAt: '2026-03-02', targetApartments: ['apt1', 'apt2'] },
  { id: 'ad3', title: '반려동물 건강검진 50% 할인', description: '봄철 반려동물 건강검진 프로모션.', advertiser: '해피펫병원', period: '2026.03.10 ~ 03.31', startDate: '2026-03-10', endDate: '2026-03-31', contact: '031-555-1234', address: '', amount: 200000, paymentStatus: 'paid', viewCount: 89, createdAt: '2026-03-03', targetApartments: ['apt1'] },
  { id: 'ad4', title: '입주민 전용 세차 서비스', description: '방문 세차 서비스 오픈!', advertiser: '클린카워시', period: '2026.03.05 ~ 04.05', startDate: '2026-03-05', endDate: '2026-04-05', contact: '010-1234-5678', address: '', amount: 150000, paymentStatus: 'unpaid', viewCount: 215, createdAt: '2026-03-04', targetApartments: ['apt1', 'apt2', 'apt4', 'apt8'] },
  { id: 'ad5', title: '키즈 수영교실 봄학기 모집', description: '4세~10세 대상 수영교실.', advertiser: '아쿠아키즈', period: '2026.03.15 ~ 06.15', startDate: '2026-03-15', endDate: '2026-06-15', contact: '031-777-8888', address: '', amount: 400000, paymentStatus: 'paid', viewCount: 67, createdAt: '2026-03-04', targetApartments: ['apt1', 'apt3'] },
  { id: 'ad6', title: '아파트 정수기 렌탈 특가', description: '코웨이 정수기 월 19,900원!', advertiser: '코웨이 성남지점', period: '2026.03.01 ~ 03.31', startDate: '2026-03-01', endDate: '2026-03-31', contact: '1588-5678', address: '', amount: 600000, paymentStatus: 'paid', viewCount: 156, createdAt: '2026-03-02', targetApartments: ['apt1', 'apt2', 'apt8', 'apt9'] },
];

export const initialShopping: ShoppingItem[] = [
  { id: 'item1', name: '프리미엄 공기청정기 필터', price: 29900, discountRate: 30, shopName: '클린에어몰', amount: 50000, paymentStatus: 'paid', viewCount: 892, createdAt: '2026-03-01', targetApartments: ['apt1', 'apt2'] },
  { id: 'item2', name: '무선 로봇청소기', price: 199000, discountRate: 15, shopName: '스마트홈샵', amount: 80000, paymentStatus: 'paid', viewCount: 1243, createdAt: '2026-03-02', targetApartments: ['apt1'] },
  { id: 'item3', name: '유기농 쌀 10kg', price: 35000, discountRate: 0, shopName: '농부마켓', amount: 30000, paymentStatus: 'unpaid', viewCount: 0, createdAt: '2026-03-01', targetApartments: ['apt1', 'apt4'] },
  { id: 'item4', name: '입주민 전용 생수 2L x 12', price: 8900, discountRate: 20, shopName: '아이박스몰', amount: 20000, paymentStatus: 'paid', viewCount: 567, createdAt: '2026-03-03', targetApartments: ['apt1', 'apt2', 'apt8'] },
];

export const initialLeads: Lead[] = [
  { id: 'lead1', shopName: '골든치킨', category: '음식점', ownerName: '김영수', phone: '010-1111-2222', address: '성남시 중원구 갈마치로 300 1층', lat: 37.4422, lng: 127.1420, status: 'interested', createdAt: '2026-02-20', contactLogs: [
    { date: '2026-02-20', method: 'phone', note: '전화 연결, 관심 있다고 함', result: 'interested' },
    { date: '2026-02-25', method: 'visit', note: '직접 방문, 서비스 설명', result: 'interested' },
  ]},
  { id: 'lead2', shopName: '뷰티랩', category: '미용실', ownerName: '박지은', phone: '010-2222-3333', address: '성남시 중원구 산성대로 350 2층', lat: 37.4430, lng: 127.1385, status: 'contacted', createdAt: '2026-02-22', contactLogs: [
    { date: '2026-02-22', method: 'phone', note: '부재중', result: 'no-answer' },
    { date: '2026-02-24', method: 'phone', note: '다음 주에 다시 연락 요청', result: 'callback' },
  ]},
  { id: 'lead3', shopName: '해피동물병원', category: '병원', ownerName: '최동훈', phone: '010-3333-4444', address: '성남시 중원구 광명로 25 1층', lat: 37.4405, lng: 127.1510, status: 'new', createdAt: '2026-03-01', contactLogs: [] },
  { id: 'lead4', shopName: '스타벅스 산성점', category: '카페', ownerName: '이민정', phone: '010-4444-5555', address: '성남시 중원구 산성대로 360', lat: 37.4435, lng: 127.1390, status: 'rejected', createdAt: '2026-02-15', contactLogs: [
    { date: '2026-02-15', method: 'phone', note: '본사 정책상 참여 불가', result: 'rejected' },
  ]},
  { id: 'lead5', shopName: '청담필라테스', category: '헬스장', ownerName: '한수진', phone: '010-5555-6666', address: '성남시 중원구 갈마치로 310 3층', lat: 37.4428, lng: 127.1425, status: 'interested', createdAt: '2026-03-05', contactLogs: [
    { date: '2026-03-05', method: 'visit', note: '직접 방문, 가격 문의', result: 'interested' },
  ]},
  { id: 'lead6', shopName: '오가닉마켓', category: '마트', ownerName: '정혜선', phone: '010-6666-7777', address: '성남시 분당구 야탑로 75 1층', lat: 37.4120, lng: 127.1280, status: 'new', createdAt: '2026-03-10', contactLogs: [] },
  { id: 'lead7', shopName: '수학의정석학원', category: '학원', ownerName: '이준호', phone: '010-7777-8888', address: '성남시 분당구 서현로 215 4층', lat: 37.3850, lng: 127.1240, status: 'contacted', createdAt: '2026-03-02', contactLogs: [
    { date: '2026-03-02', method: 'email', note: '이메일 발송, 자료 첨부', result: 'callback' },
  ]},
  { id: 'lead8', shopName: '모란꽃집', category: '기타', ownerName: '김화영', phone: '010-8888-9999', address: '성남시 중원구 성남대로 1130', lat: 37.4325, lng: 127.1295, status: 'registered', createdAt: '2026-02-10', contactLogs: [
    { date: '2026-02-10', method: 'phone', note: '관심 표현', result: 'interested' },
    { date: '2026-02-15', method: 'visit', note: '가입 완료', result: 'interested' },
  ]},
  { id: 'lead9', shopName: '왕짜장', category: '음식점', ownerName: '왕대인', phone: '010-9999-0000', address: '성남시 수정구 위례광장로 25', lat: 37.4785, lng: 127.1435, status: 'new', createdAt: '2026-03-12', contactLogs: [] },
  { id: 'lead10', shopName: '세브란스약국', category: '약국', ownerName: '배상훈', phone: '010-1234-5678', address: '성남시 수정구 복정로 85', lat: 37.4700, lng: 127.1270, status: 'contacted', createdAt: '2026-03-08', contactLogs: [
    { date: '2026-03-08', method: 'phone', note: '다음달 오픈 예정, 관심 있음', result: 'callback' },
  ]},
];
