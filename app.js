const API_DIRECT = "https://www.safetydata.go.kr/V2/api/DSSP-IF-00247";
const API_PROXY = "/api/messages";
const SERVICE_KEY = "79TC865LX2RE904U";
const PAGE_SIZE = 100;
const MAX_GEOCODE_PER_PAGE = 8;
const MAX_RANGE_DAYS = 7;
const DEFAULT_MAP_CENTER = [36.35, 127.85];
const DEFAULT_MAP_ZOOM = 7;

const DISASTER_TYPES = [
  { key: "AI", label: "AI", icon: "syringe", color: "#8b5cf6", aliases: ["조류인플루엔자"] },
  { key: "가뭄", label: "가뭄", icon: "sun", color: "#c28a1b", aliases: [] },
  { key: "가축질병", label: "가축질병", icon: "stethoscope", color: "#9b5e31", aliases: [] },
  { key: "강풍", label: "강풍", icon: "wind", color: "#27a66b", aliases: [] },
  { key: "건조", label: "건조", icon: "sun", color: "#e08a1e", aliases: [] },
  { key: "교통", label: "교통", icon: "car", color: "#346fd6", aliases: [] },
  { key: "교통사고", label: "교통사고", icon: "triangle-alert", color: "#f97316", aliases: [] },
  { key: "교통통제", label: "교통통제", icon: "traffic-cone", color: "#f59e0b", aliases: [] },
  { key: "금융", label: "금융", icon: "landmark", color: "#0f766e", aliases: [] },
  { key: "기타", label: "기타", icon: "more-horizontal", color: "#64748b", aliases: [] },
  { key: "대설", label: "대설", icon: "cloud-snow", color: "#168fca", aliases: ["눈"] },
  { key: "미세먼지", label: "미세먼지", icon: "cloud-fog", color: "#64748b", aliases: [] },
  { key: "민방공", label: "민방공", icon: "shield-alert", color: "#475569", aliases: [] },
  { key: "붕괴", label: "붕괴", icon: "building-2", color: "#7c3aed", aliases: [] },
  { key: "산불", label: "산불", icon: "flame", color: "#e64943", aliases: [] },
  { key: "산사태", label: "산사태", icon: "mountain", color: "#9a6b2f", aliases: [] },
  { key: "수도", label: "수도", icon: "droplets", color: "#0ea5e9", aliases: [] },
  { key: "안개", label: "안개", icon: "cloud-fog", color: "#a8b2c1", aliases: [] },
  { key: "에너지", label: "에너지", icon: "battery-charging", color: "#10b981", aliases: [] },
  { key: "전염병", label: "전염병", icon: "virus", color: "#b91c1c", aliases: ["감염병"] },
  { key: "정전", label: "정전", icon: "zap-off", color: "#f59e0b", aliases: [] },
  { key: "지진해일", label: "지진해일", icon: "waves", color: "#0284c7", aliases: [] },
  { key: "지진", label: "지진", icon: "activity", color: "#7557d8", aliases: [] },
  { key: "태풍", label: "태풍", icon: "tornado", color: "#0d9488", aliases: [] },
  { key: "테러", label: "테러", icon: "siren", color: "#be123c", aliases: [] },
  { key: "통신", label: "통신", icon: "radio-tower", color: "#2563eb", aliases: [] },
  { key: "폭발", label: "폭발", icon: "bomb", color: "#dc2626", aliases: [] },
  { key: "폭염", label: "폭염", icon: "thermometer-sun", color: "#f38b21", aliases: ["고온"] },
  { key: "풍랑", label: "풍랑", icon: "waves", color: "#0891b2", aliases: [] },
  { key: "한파", label: "한파", icon: "snowflake", color: "#168fca", aliases: [] },
  { key: "호우", label: "호우", icon: "cloud-rain", color: "#2f76e8", aliases: ["강우"] },
  { key: "홍수", label: "홍수", icon: "waves", color: "#1d4ed8", aliases: [] },
  { key: "화재", label: "화재", icon: "flame", color: "#e64943", aliases: [] },
  { key: "환경오염사고", label: "환경오염사고", icon: "biohazard", color: "#16a34a", aliases: ["환경오염사고"] },
  { key: "황사", label: "황사", icon: "cloud-sun", color: "#d97706", aliases: [] },
];

const SEVERITY_LEGEND = [
  { label: "안전", className: "is-advisory", color: "#94a3b8" },
  { label: "긴급", className: "is-urgent", color: "#f59e0b" },
  { label: "위급", className: "is-critical", color: "#e11d48" },
];

const REGION_POINTS = [
  { key: "서울", names: ["서울", "서울특별시"], lat: 37.5665, lng: 126.978, zoom: 11 },
  { key: "부산", names: ["부산", "부산광역시"], lat: 35.1796, lng: 129.0756, zoom: 11 },
  { key: "대구", names: ["대구", "대구광역시"], lat: 35.8714, lng: 128.6014, zoom: 11 },
  { key: "인천", names: ["인천", "인천광역시"], lat: 37.4563, lng: 126.7052, zoom: 11 },
  { key: "광주", names: ["광주", "광주광역시"], lat: 35.1595, lng: 126.8526, zoom: 11 },
  { key: "대전", names: ["대전", "대전광역시"], lat: 36.3504, lng: 127.3845, zoom: 11 },
  { key: "울산", names: ["울산", "울산광역시"], lat: 35.5384, lng: 129.3114, zoom: 11 },
  { key: "세종", names: ["세종", "세종특별자치시"], lat: 36.4801, lng: 127.289, zoom: 11 },
  { key: "경기", names: ["경기", "경기도"], lat: 37.4138, lng: 127.5183, zoom: 9 },
  { key: "강원", names: ["강원", "강원도", "강원특별자치도"], lat: 37.8228, lng: 128.1555, zoom: 9 },
  { key: "충북", names: ["충북", "충청북도"], lat: 36.6357, lng: 127.4917, zoom: 9 },
  { key: "충남", names: ["충남", "충청남도"], lat: 36.5184, lng: 126.8, zoom: 9 },
  { key: "전북", names: ["전북", "전라북도", "전북특별자치도"], lat: 35.7175, lng: 127.153, zoom: 9 },
  { key: "전남", names: ["전남", "전라남도"], lat: 34.8679, lng: 126.991, zoom: 9 },
  { key: "경북", names: ["경북", "경상북도"], lat: 36.4919, lng: 128.8889, zoom: 9 },
  { key: "경남", names: ["경남", "경상남도"], lat: 35.4606, lng: 128.2132, zoom: 9 },
  { key: "제주", names: ["제주", "제주도", "제주특별자치도"], lat: 33.4996, lng: 126.5312, zoom: 10 },
];

const PROVINCE_DEFS = [
  { label: "서울", canonical: "서울특별시", level: "metro", names: ["서울특별시", "서울"] },
  { label: "부산", canonical: "부산광역시", level: "metro", names: ["부산광역시", "부산"] },
  { label: "대구", canonical: "대구광역시", level: "metro", names: ["대구광역시", "대구"] },
  { label: "인천", canonical: "인천광역시", level: "metro", names: ["인천광역시", "인천"] },
  { label: "광주", canonical: "광주광역시", level: "metro", names: ["광주광역시", "광주"] },
  { label: "대전", canonical: "대전광역시", level: "metro", names: ["대전광역시", "대전"] },
  { label: "울산", canonical: "울산광역시", level: "metro", names: ["울산광역시", "울산"] },
  { label: "세종", canonical: "세종특별자치시", level: "metro", names: ["세종특별자치시", "세종"] },
  { label: "경기", canonical: "경기도", level: "province", names: ["경기도", "경기"] },
  { label: "강원", canonical: "강원특별자치도", level: "province", names: ["강원특별자치도", "강원도", "강원"] },
  { label: "충북", canonical: "충청북도", level: "province", names: ["충청북도", "충북"] },
  { label: "충남", canonical: "충청남도", level: "province", names: ["충청남도", "충남"] },
  { label: "전북", canonical: "전북특별자치도", level: "province", names: ["전북특별자치도", "전라북도", "전북"] },
  { label: "전남", canonical: "전라남도", level: "province", names: ["전라남도", "전남"] },
  { label: "경북", canonical: "경상북도", level: "province", names: ["경상북도", "경북"] },
  { label: "경남", canonical: "경상남도", level: "province", names: ["경상남도", "경남"] },
  { label: "제주", canonical: "제주특별자치도", level: "province", names: ["제주특별자치도", "제주도", "제주"] },
];

const KNOWN_LOCAL_POINTS = [
  { key: "서울 서대문구", label: "서대문구", names: ["서울특별시 서대문구", "서울 서대문구"], lat: 37.5791, lng: 126.9368, zoom: 13 },
  { key: "서울 성북구", label: "성북구", names: ["서울특별시 성북구", "서울 성북구"], lat: 37.5894, lng: 127.0167, zoom: 13 },
  { key: "서울 강남구", label: "강남구", names: ["서울특별시 강남구", "서울 강남구"], lat: 37.5172, lng: 127.0473, zoom: 13 },
  { key: "인천 서구", label: "서구", names: ["인천광역시 서구", "인천 서구"], lat: 37.5454, lng: 126.6759, zoom: 13 },
  { key: "인천 강화군", label: "강화군", names: ["인천광역시 강화군", "인천 강화군"], lat: 37.7465, lng: 126.4879, zoom: 12 },
  { key: "대구 남구", label: "남구", names: ["대구광역시 남구", "대구 남구"], lat: 35.846, lng: 128.5975, zoom: 13 },
  { key: "대구 달서구", label: "달서구", names: ["대구광역시 달서구", "대구 달서구"], lat: 35.8299, lng: 128.5327, zoom: 13 },
  { key: "대구 북구", label: "북구", names: ["대구광역시 북구", "대구 북구"], lat: 35.8857, lng: 128.5828, zoom: 13 },
  { key: "대구 수성구", label: "수성구", names: ["대구광역시 수성구", "대구 수성구"], lat: 35.8582, lng: 128.6306, zoom: 13 },
  { key: "대전 동구", label: "동구", names: ["대전광역시 동구", "대전 동구"], lat: 36.3122, lng: 127.4549, zoom: 13 },
  { key: "대전 중구", label: "중구", names: ["대전광역시 중구", "대전 중구"], lat: 36.3254, lng: 127.4213, zoom: 13 },
  { key: "대전 서구", label: "서구", names: ["대전광역시 서구", "대전 서구"], lat: 36.3555, lng: 127.3838, zoom: 13 },
  { key: "대전 유성구", label: "유성구", names: ["대전광역시 유성구", "대전 유성구"], lat: 36.3622, lng: 127.3562, zoom: 13 },
  { key: "대전 대덕구", label: "대덕구", names: ["대전광역시 대덕구", "대전 대덕구"], lat: 36.3467, lng: 127.4155, zoom: 13 },
  { key: "경기 광주시", label: "광주시", names: ["경기도 광주시", "경기 광주시"], lat: 37.4294, lng: 127.2551, zoom: 12 },
  { key: "경기 남양주시", label: "남양주시", names: ["경기도 남양주시", "경기 남양주시"], lat: 37.636, lng: 127.2165, zoom: 12 },
  { key: "충북 증평군", label: "증평군", names: ["충청북도 증평군", "충북 증평군"], lat: 36.7853, lng: 127.5816, zoom: 12 },
  { key: "충남 아산시", label: "아산시", names: ["충청남도 아산시", "충남 아산시"], lat: 36.7898, lng: 127.0018, zoom: 12 },
  { key: "충남 공주시", label: "공주시", names: ["충청남도 공주시", "충남 공주시"], lat: 36.4466, lng: 127.119, zoom: 12 },
  { key: "전남 완도군", label: "완도군", names: ["전라남도 완도군", "전남 완도군"], lat: 34.311, lng: 126.7551, zoom: 12 },
  { key: "전남 진도군", label: "진도군", names: ["전라남도 진도군", "전남 진도군"], lat: 34.4868, lng: 126.2635, zoom: 12 },
  { key: "전남 신안군", label: "신안군", names: ["전라남도 신안군", "전남 신안군"], lat: 34.8335, lng: 126.3517, zoom: 11 },
  { key: "경북 김천시", label: "김천시", names: ["경상북도 김천시", "경북 김천시"], lat: 36.1398, lng: 128.1136, zoom: 12 },
  { key: "경북 경주시", label: "경주시", names: ["경상북도 경주시", "경북 경주시"], lat: 35.8562, lng: 129.2247, zoom: 12 },
  { key: "경북 고령군", label: "고령군", names: ["경상북도 고령군", "경북 고령군"], lat: 35.7262, lng: 128.2629, zoom: 12 },
  { key: "경북 포항시", label: "포항시", names: ["경상북도 포항시", "경북 포항시"], lat: 36.019, lng: 129.3435, zoom: 12 },
  { key: "경북 울진군", label: "울진군", names: ["경상북도 울진군", "경북 울진군"], lat: 36.9931, lng: 129.4006, zoom: 12 },
  { key: "경기 김포시", label: "김포시", names: ["경기도 김포시", "경기 김포시"], lat: 37.6153, lng: 126.7156, zoom: 12 },
  { key: "경기 안양시", label: "안양시", names: ["경기도 안양시", "경기 안양시"], lat: 37.3943, lng: 126.9568, zoom: 12 },
  { key: "경기 군포시", label: "군포시", names: ["경기도 군포시", "경기 군포시"], lat: 37.3616, lng: 126.9352, zoom: 12 },
  { key: "경기 평택시", label: "평택시", names: ["경기도 평택시", "경기 평택시"], lat: 36.9921, lng: 127.1127, zoom: 12 },
  { key: "경기 용인시", label: "용인시", names: ["경기도 용인시", "경기 용인시"], lat: 37.2411, lng: 127.1776, zoom: 12 },
  { key: "경기 이천시", label: "이천시", names: ["경기도 이천시", "경기 이천시"], lat: 37.272, lng: 127.435, zoom: 12 },
  { key: "경기 안성시", label: "안성시", names: ["경기도 안성시", "경기 안성시"], lat: 37.008, lng: 127.2798, zoom: 12 },
  { key: "경기 부천시", label: "부천시", names: ["경기도 부천시", "경기 부천시"], lat: 37.5035, lng: 126.766, zoom: 12 },
  { key: "강원 속초시", label: "속초시", names: ["강원특별자치도 속초시", "강원도 속초시", "강원 속초시"], lat: 38.207, lng: 128.5918, zoom: 12 },
  { key: "강원 강릉시", label: "강릉시", names: ["강원특별자치도 강릉시", "강원도 강릉시", "강원 강릉시"], lat: 37.7519, lng: 128.8761, zoom: 12 },
  { key: "강원 양양군", label: "양양군", names: ["강원특별자치도 양양군", "강원도 양양군", "강원 양양군"], lat: 38.0754, lng: 128.619, zoom: 12 },
  { key: "강원 동해시", label: "동해시", names: ["강원특별자치도 동해시", "강원도 동해시", "강원 동해시"], lat: 37.5248, lng: 129.1143, zoom: 12 },
  { key: "충북 청주시", label: "청주시", names: ["충청북도 청주시", "충북 청주시"], lat: 36.6424, lng: 127.489, zoom: 12 },
  { key: "충남 천안시", label: "천안시", names: ["충청남도 천안시", "충남 천안시"], lat: 36.8151, lng: 127.1139, zoom: 12 },
  { key: "충남 당진시", label: "당진시", names: ["충청남도 당진시", "충남 당진시"], lat: 36.8899, lng: 126.6458, zoom: 12 },
  { key: "충남 부여군", label: "부여군", names: ["충청남도 부여군", "충남 부여군"], lat: 36.2757, lng: 126.9098, zoom: 12 },
  { key: "충남 홍성군", label: "홍성군", names: ["충청남도 홍성군", "충남 홍성군"], lat: 36.6013, lng: 126.6608, zoom: 12 },
  { key: "충남 청양군", label: "청양군", names: ["충청남도 청양군", "충남 청양군"], lat: 36.4592, lng: 126.8022, zoom: 12 },
  { key: "충남 보령시", label: "보령시", names: ["충청남도 보령시", "충남 보령시"], lat: 36.3335, lng: 126.6129, zoom: 12 },
  { key: "충남 논산시", label: "논산시", names: ["충청남도 논산시", "충남 논산시"], lat: 36.1871, lng: 127.0987, zoom: 12 },
  { key: "충남 금산군", label: "금산군", names: ["충청남도 금산군", "충남 금산군"], lat: 36.1089, lng: 127.4882, zoom: 12 },
  { key: "충남 예산군", label: "예산군", names: ["충청남도 예산군", "충남 예산군"], lat: 36.6828, lng: 126.8488, zoom: 12 },
  { key: "전북 익산시", label: "익산시", names: ["전북특별자치도 익산시", "전라북도 익산시", "전북 익산시"], lat: 35.9483, lng: 126.9576, zoom: 12 },
  { key: "전북 임실군", label: "임실군", names: ["전북특별자치도 임실군", "전라북도 임실군", "전북 임실군"], lat: 35.6179, lng: 127.289, zoom: 12 },
  { key: "경남 통영시", label: "통영시", names: ["경상남도 통영시", "경남 통영시"], lat: 34.8544, lng: 128.4332, zoom: 12 },
  { key: "경남 사천시", label: "사천시", names: ["경상남도 사천시", "경남 사천시"], lat: 35.0038, lng: 128.0642, zoom: 12 },
  { key: "경남 산청군", label: "산청군", names: ["경상남도 산청군", "경남 산청군"], lat: 35.4156, lng: 127.8735, zoom: 12 },
  { key: "경남 남해군", label: "남해군", names: ["경상남도 남해군", "경남 남해군"], lat: 34.8377, lng: 127.8925, zoom: 12 },
  { key: "경남 창원시", label: "창원시", names: ["경상남도 창원시", "경남 창원시"], lat: 35.2278, lng: 128.6819, zoom: 12 },
  { key: "경남 거제시", label: "거제시", names: ["경상남도 거제시", "경남 거제시"], lat: 34.8806, lng: 128.6211, zoom: 12 },
  { key: "경남 김해시", label: "김해시", names: ["경상남도 김해시", "경남 김해시"], lat: 35.2285, lng: 128.8894, zoom: 12 },
  { key: "경남 창녕군", label: "창녕군", names: ["경상남도 창녕군", "경남 창녕군"], lat: 35.5446, lng: 128.4924, zoom: 12 },
  { key: "부산 부산진구", label: "부산진구", names: ["부산광역시 부산진구", "부산 부산진구"], lat: 35.1629, lng: 129.0532, zoom: 13 },
  { key: "부산 사상구", label: "사상구", names: ["부산광역시 사상구", "부산 사상구"], lat: 35.1526, lng: 128.9913, zoom: 13 },
  { key: "부산 동래구", label: "동래구", names: ["부산광역시 동래구", "부산 동래구"], lat: 35.2055, lng: 129.0838, zoom: 13 },
  { key: "부산 연제구", label: "연제구", names: ["부산광역시 연제구", "부산 연제구"], lat: 35.1763, lng: 129.0798, zoom: 13 },
  { key: "부산 북구", label: "북구", names: ["부산광역시 북구", "부산 북구"], lat: 35.1972, lng: 128.9903, zoom: 13 },
  { key: "인천 계양구", label: "계양구", names: ["인천광역시 계양구", "인천 계양구"], lat: 37.5374, lng: 126.7378, zoom: 13 },
  { key: "서울 도봉구", label: "도봉구", names: ["서울특별시 도봉구", "서울 도봉구"], lat: 37.6688, lng: 127.0471, zoom: 13 },
  { key: "서울 동작구", label: "동작구", names: ["서울특별시 동작구", "서울 동작구"], lat: 37.5124, lng: 126.9393, zoom: 13 },
  { key: "광주 동구", label: "동구", names: ["광주광역시 동구", "광주 동구"], lat: 35.1461, lng: 126.9231, zoom: 13 },
  { key: "광주 북구", label: "북구", names: ["광주광역시 북구", "광주 북구"], lat: 35.1741, lng: 126.9119, zoom: 13 },
  { key: "광주 광산구", label: "광산구", names: ["광주광역시 광산구", "광주 광산구"], lat: 35.1395, lng: 126.7937, zoom: 13 },
  { key: "대구 달성군", label: "달성군", names: ["대구광역시 달성군", "대구 달성군"], lat: 35.7747, lng: 128.4313, zoom: 13 },
  { key: "제주 제주시", label: "제주시", names: ["제주특별자치도 제주시", "제주도 제주시", "제주 제주시"], lat: 33.4996, lng: 126.5312, zoom: 12 },
  { key: "제주 서귀포시", label: "서귀포시", names: ["제주특별자치도 서귀포시", "제주도 서귀포시", "제주 서귀포시"], lat: 33.2539, lng: 126.559, zoom: 12 },
];

const LOCAL_POINT_INDEX = new Map();
const LOCAL_ALIAS_INDEX = new Map();
const AMBIGUOUS_LOCAL_LABELS = new Set(["서구", "동구", "중구", "남구", "북구", "광주시"]);
const NON_ADMIN_REGION_PATTERN = /(바다|해상|해역|해협|먼바다|앞바다|남쪽|북쪽|동쪽|서쪽|산지|산간|평지|연안|해안|전해상)/;
KNOWN_LOCAL_POINTS.forEach((point) => {
  point.displayName = point.displayName || point.key;
  point.canonicalKey = normalizeRegionText(point.key);
  point.names.forEach((name) => LOCAL_POINT_INDEX.set(normalizeRegionText(name), point));
  LOCAL_POINT_INDEX.set(point.canonicalKey, point);
  LOCAL_ALIAS_INDEX.set(normalizeRegionText(point.label), [...(LOCAL_ALIAS_INDEX.get(normalizeRegionText(point.label)) || []), point]);
});

const SAMPLE_DATA = [
  {
    SN: "SAMPLE-1",
    CRT_DT: "2026/06/16 02:37:59",
    MSG_CN: "공장 화재 발생. 인근 주민은 안전에 유의하고 차량은 주변 도로를 우회해 주시기 바랍니다.",
    RCPTN_RGN_NM: "인천광역시 서구",
    EMRG_STEP_NM: "안전안내",
    DST_SE_NM: "화재",
    REG_YMD: "2026/06/16",
  },
  {
    SN: "SAMPLE-2",
    CRT_DT: "2026/06/16 02:10:12",
    MSG_CN: "호우경보 발효. 하천변 산책로와 저지대 주차장 이용을 자제해 주시기 바랍니다.",
    RCPTN_RGN_NM: "경기도 남양주시",
    EMRG_STEP_NM: "안전안내",
    DST_SE_NM: "호우",
    REG_YMD: "2026/06/16",
  },
  {
    SN: "SAMPLE-3",
    CRT_DT: "2026/06/16 01:45:33",
    MSG_CN: "폭염주의보 발효. 야외활동을 줄이고 충분한 수분을 섭취해 주시기 바랍니다.",
    RCPTN_RGN_NM: "서울특별시 강남구",
    EMRG_STEP_NM: "안전안내",
    DST_SE_NM: "폭염",
    REG_YMD: "2026/06/16",
  },
  {
    SN: "SAMPLE-4",
    CRT_DT: "2026/06/16 01:30:22",
    MSG_CN: "강풍주의보 발효. 간판, 현수막 등 낙하물에 주의해 주시기 바랍니다.",
    RCPTN_RGN_NM: "강원특별자치도 속초시",
    EMRG_STEP_NM: "안전안내",
    DST_SE_NM: "강풍",
    REG_YMD: "2026/06/16",
  },
  {
    SN: "SAMPLE-5",
    CRT_DT: "2026/06/16 01:12:05",
    MSG_CN: "지진 발생 안내. 흔들림을 느낀 경우 책상 아래로 대피하고 안내 방송을 확인해 주시기 바랍니다.",
    RCPTN_RGN_NM: "경상북도 경주시",
    EMRG_STEP_NM: "위급재난",
    DST_SE_NM: "지진",
    REG_YMD: "2026/06/16",
  },
  {
    SN: "SAMPLE-6",
    CRT_DT: "2026/06/16 00:40:41",
    MSG_CN: "대설 예비특보. 결빙 구간이 예상되니 감속 운행해 주시기 바랍니다.",
    RCPTN_RGN_NM: "제주특별자치도 제주시",
    EMRG_STEP_NM: "안전안내",
    DST_SE_NM: "대설",
    REG_YMD: "2026/06/16",
  },
];

const state = {
  pageNo: 1,
  currentDate: new Date(),
  activeTypes: new Set(DISASTER_TYPES.map((type) => type.key)),
  allItems: [],
  filteredItems: [],
  selectedItem: null,
  listLimit: 20,
  searchTerm: "",
  sortBy: "latest",
  serverTotal: 0,
  activeRegionFilter: null,
  rangeStart: "",
  rangeEnd: "",
  usedFallback: false,
  map: null,
  mapResizeObserver: null,
  markers: L.layerGroup(),
};

const els = {
  updatedAt: document.querySelector("#updatedAt"),
  refreshBtn: document.querySelector("#refreshBtn"),
  resetBtn: document.querySelector("#resetBtn"),
  startDateInput: document.querySelector("#startDateInput"),
  endDateInput: document.querySelector("#endDateInput"),
  queryBtn: document.querySelector("#queryBtn"),
  typeFilter: document.querySelector("#typeFilter"),
  selectAllTypes: document.querySelector("#selectAllTypes"),
  totalCount: document.querySelector("#totalCount"),
  summaryPeriod: document.querySelector("#summaryPeriod"),
  summaryRegion: document.querySelector("#summaryRegion"),
  summaryList: document.querySelector("#summaryList"),
  regionSearch: document.querySelector("#regionSearch"),
  mapLegend: document.querySelector("#mapLegend"),
  statusToast: document.querySelector("#statusToast"),
  listTitle: document.querySelector("#listTitle"),
  messageList: document.querySelector("#messageList"),
  loadMoreBtn: document.querySelector("#loadMoreBtn"),
  sortSelect: document.querySelector("#sortSelect"),
  clearRegionFilter: document.querySelector("#clearRegionFilter"),
  detailSection: document.querySelector(".detail-section"),
  detailContent: document.querySelector("#detailContent"),
  closeDetailBtn: document.querySelector("#closeDetailBtn"),
};

document.addEventListener("DOMContentLoaded", () => {
  setupIcons();
  setupMap();
  setupFilters();
  bindEvents();
  setDateRange(new Date(), new Date());
  fetchMessages();
});

function setupIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function setupMap() {
  state.map = L.map("map", {
    zoomControl: false,
    attributionControl: false,
    wheelDebounceTime: 80,
    wheelPxPerZoomLevel: 90,
  }).setView(DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    subdomains: "abc",
    className: "readable-map-layer",
  }).addTo(state.map);

  L.control.zoom({ position: "bottomright" }).addTo(state.map);
  state.markers.addTo(state.map);

  state.map.whenReady(() => stabilizeMapLayout());
  window.addEventListener("load", () => stabilizeMapLayout());
  window.addEventListener("resize", () => stabilizeMapLayout());

  if ("ResizeObserver" in window) {
    state.mapResizeObserver = new ResizeObserver(() => stabilizeMapLayout());
    state.mapResizeObserver.observe(document.querySelector(".map-stage"));
    state.mapResizeObserver.observe(document.querySelector("#map"));
  }
}

function stabilizeMapLayout() {
  if (!state.map) return;

  const refresh = () => {
    if (!state.map) return;
    state.map.invalidateSize({ pan: false, animate: false });
  };

  requestAnimationFrame(() => {
    refresh();
    window.setTimeout(refresh, 80);
    window.setTimeout(refresh, 250);
    window.setTimeout(refresh, 650);
  });
}

function setupFilters() {
  renderTypeFilters([]);
  renderMapLegend([]);
}

function bindEvents() {
  els.refreshBtn.addEventListener("click", () => fetchMessages());
  els.resetBtn.addEventListener("click", resetDashboard);
  els.queryBtn.addEventListener("click", () => fetchMessages());
  els.startDateInput.addEventListener("change", () => enforceDateRange());
  els.endDateInput.addEventListener("change", () => enforceDateRange());

  document.querySelectorAll(".range-button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".range-button").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      const days = Number(button.dataset.days);
      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - Math.max(0, days - 1));
      setDateRange(startDate, endDate);
    });
  });

  els.typeFilter.addEventListener("click", (event) => {
    const button = event.target.closest("[data-type]");
    if (!button) return;
    const type = button.dataset.type;
    if (state.activeTypes.has(type)) {
      state.activeTypes.delete(type);
      button.classList.remove("is-active");
    } else {
      state.activeTypes.add(type);
      button.classList.add("is-active");
    }
    applyFilters();
  });

  els.selectAllTypes.addEventListener("click", () => {
    const visibleTypes = getVisibleTypeKeys();
    const allSelected = visibleTypes.length > 0 && visibleTypes.every((type) => state.activeTypes.has(type));
    state.activeTypes = new Set(allSelected ? [] : visibleTypes);
    document.querySelectorAll(".type-button").forEach((button) => {
      button.classList.toggle("is-active", !allSelected);
    });
    applyFilters();
  });

  els.regionSearch.addEventListener("input", (event) => {
    state.searchTerm = event.target.value.trim();
    applyFilters();
  });

  els.regionSearch.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    const point = findRegionPoint(state.searchTerm);
    if (point) {
      state.map.flyTo([point.lat, point.lng], point.zoom, { duration: 0.6 });
    }
    state.pageNo = 1;
    state.listLimit = 20;
    fetchMessages();
  });

  els.sortSelect.addEventListener("change", (event) => {
    state.sortBy = event.target.value;
    applyFilters();
  });

  els.messageList.addEventListener("click", (event) => {
    const card = event.target.closest(".message-card");
    if (!card) return;
    const item = getListItems().find((entry) => entry.id === card.dataset.id);
    if (!item) return;
    selectMessage(item, { moveMap: false, scrollDetail: true });
  });

  els.clearRegionFilter.addEventListener("click", () => {
    state.activeRegionFilter = null;
    state.listLimit = 20;
    renderList();
  });

  els.loadMoreBtn.addEventListener("click", () => {
    const listItems = getListItems();
    if (state.listLimit < listItems.length) {
      state.listLimit += 20;
      renderList();
      return;
    }

    if (!state.activeRegionFilter && state.allItems.length < state.serverTotal) {
      state.pageNo += 1;
      fetchMessages({ append: true });
    }
  });

  els.closeDetailBtn.addEventListener("click", () => {
    state.selectedItem = null;
    renderDetail();
    renderList();
  });
}

async function fetchMessages({ append = false } = {}) {
  const range = enforceDateRange();
  if (!range) return;

  state.pageNo = append ? state.pageNo : 1;
  if (!append) {
    state.activeRegionFilter = null;
  }
  state.rangeStart = range.start;
  state.rangeEnd = range.end;
  state.usedFallback = false;
  setLoading(true);
  showToast(`${formatDateLabel(range.start)} ~ ${formatDateLabel(range.end)} 재난문자를 불러오는 중입니다.`);

  try {
    const { items, pageNo, serverTotal } = await requestMessagePages(range, { append });
    const incomingItems = await enrichItemsWithPoints(normalizeItems(items), serverTotal);
    state.allItems = append ? mergeItems(state.allItems, incomingItems) : incomingItems;
    state.serverTotal = append ? serverTotal || state.allItems.length : state.allItems.length;
    state.pageNo = pageNo;
    state.selectedItem = append ? state.selectedItem : null;
    if (!append) {
      selectAllAvailableTypes();
    }
    showToast(
      state.allItems.length < state.serverTotal
        ? `${formatNumber(state.allItems.length)}건을 먼저 표시했습니다. 더보기로 추가 조회할 수 있습니다.`
        : `${formatNumber(state.allItems.length)}건의 재난문자를 표시했습니다.`,
    );
  } catch (error) {
    console.error(error);
    state.allItems = await enrichItemsWithPoints(normalizeItems(SAMPLE_DATA));
    state.selectedItem = null;
    state.serverTotal = state.allItems.length;
    state.usedFallback = true;
    selectAllAvailableTypes();
    showToast("API 연결 실패로 예시 데이터 6건을 표시합니다. 로컬 서버 주소로 접속했는지 확인하세요.");
  } finally {
    applyFilters();
    setLoading(false);
    updateTime();
  }
}

async function requestMessagePages(range, { append = false } = {}) {
  const items = [];
  let pageNo = append ? state.pageNo : 1;
  let serverTotal = 0;

  while (true) {
    const params = createMessageParams(range, pageNo);
    const data = await requestMessages(params);
    if (data?.header?.resultCode && data.header.resultCode !== "00") {
      throw new Error(data.header.errorMsg || data.header.resultMsg || "API 응답 오류");
    }

    serverTotal = Number(data?.totalCount || serverTotal || 0);
    const pageItems = normalizeBody(data?.body);
    items.push(...pageItems);

    const loadedCount = append ? state.allItems.length + items.length : items.length;
    if (!append && serverTotal > PAGE_SIZE) {
      showToast(`${formatNumber(Math.min(loadedCount, serverTotal))}/${formatNumber(serverTotal)}건을 불러오는 중입니다.`);
    }

    if (append || !pageItems.length || !serverTotal || items.length >= serverTotal) {
      break;
    }

    pageNo += 1;
    await nextFrame();
  }

  return { items, pageNo, serverTotal: serverTotal || items.length };
}

function createMessageParams(range, pageNo) {
  const params = new URLSearchParams({
    serviceKey: SERVICE_KEY,
    numOfRows: String(PAGE_SIZE),
    pageNo: String(pageNo),
    returnType: "json",
    crtDt: toCompactDate(range.start),
  });

  if (state.searchTerm) {
    params.set("rgnNm", state.searchTerm);
  }

  return params;
}

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

function normalizeBody(body) {
  if (!body) return [];
  return Array.isArray(body) ? body : [body];
}

function mergeItems(currentItems, incomingItems) {
  const merged = new Map(currentItems.map((item) => [item.id, item]));
  incomingItems.forEach((item) => merged.set(item.id, item));
  return Array.from(merged.values());
}

async function requestMessages(params) {
  const query = params.toString();
  const urls = window.location.protocol.startsWith("http")
    ? [`${API_PROXY}?${query}`, `${API_DIRECT}?${query}`]
    : [`${API_DIRECT}?${query}`];

  let lastError = null;
  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("API 요청 실패");
}

function normalizeItems(items) {
  return items.map((item, index) => {
    const id = item.SN != null ? String(item.SN) : `${item.CRT_DT || "NO_DATE"}-${index}`;
    const type = resolveType(item.DST_SE_NM || item.MSG_CN || "");
    const regionRefs = extractRegionRefs(item.RCPTN_RGN_NM || "");
    const points = resolvePointsFromRefs(regionRefs, item.RCPTN_RGN_NM || "");
    const dateKey = parseDateKey(item.CRT_DT || item.REG_YMD);
    return {
      id,
      sn: item.SN != null ? String(item.SN) : "-",
      createdAt: item.CRT_DT || "-",
      message: item.MSG_CN || "",
      region: item.RCPTN_RGN_NM || "지역 미상",
      step: item.EMRG_STEP_NM || "안내",
      disaster: item.DST_SE_NM || "기타",
      regDate: item.REG_YMD || "-",
      type,
      regionRefs,
      points,
      point: points[0] || null,
      dateKey,
      timestamp: parseDateTime(item.CRT_DT),
    };
  });
}

async function enrichItemsWithPoints(items, serverTotal = items.length) {
  const refsToGeocode = new Map();
  items.forEach((item) => {
    item.regionRefs.forEach((ref) => {
      if (!ref.isLocal || resolveKnownLocalPoint(ref)) return;
      if (!ref.hasProvince && AMBIGUOUS_LOCAL_LABELS.has(ref.label)) return;
      refsToGeocode.set(ref.normalizedQuery, ref);
    });
  });

  const geocodeLimit = serverTotal > 500 ? Math.min(3, MAX_GEOCODE_PER_PAGE) : MAX_GEOCODE_PER_PAGE;
  await Promise.all(
    Array.from(refsToGeocode.values()).slice(0, geocodeLimit).map(async (ref) => {
      const point = await geocodeLocalRegion(ref);
      if (point) {
        LOCAL_POINT_INDEX.set(ref.normalizedQuery, point);
      }
    }),
  );

  return items.map((item) => {
    const points = resolvePointsFromRefs(item.regionRefs, item.region);
    return {
      ...item,
      points,
      point: points[0] || null,
    };
  });
}

async function geocodeLocalRegion(ref) {
  if (!window.location.protocol.startsWith("http")) return null;

  try {
    const response = await fetch(`/api/geocode?region=${encodeURIComponent(ref.query)}`);
    if (!response.ok) return null;
    const data = await response.json();
    const lat = Number(data.lat);
    const lng = Number(data.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    if (!isReasonableKoreaCoordinate(lat, lng) || !isNearProvince(lat, lng, ref)) return null;
    return {
      key: ref.displayName,
      canonicalKey: ref.normalizedQuery,
      label: ref.label,
      displayName: ref.displayName,
      names: [ref.query],
      lat,
      lng,
      zoom: 12,
      source: "geocode",
    };
  } catch (error) {
    console.warn("지역 좌표 조회 실패", ref.query, error);
    return null;
  }
}

function applyFilters() {
  const keyword = state.searchTerm.toLowerCase();
  const dateFilteredItems = getDateFilteredItems();
  const availableTypes = getAvailableTypeEntries(dateFilteredItems);
  syncActiveTypesWithAvailable(availableTypes.map((type) => type.key));
  renderTypeFilters(availableTypes);

  state.filteredItems = dateFilteredItems
    .filter((item) => state.activeTypes.has(item.type.key))
    .filter((item) => {
      if (!keyword) return true;
      return `${item.region} ${item.message} ${item.disaster}`.toLowerCase().includes(keyword);
    })
    .sort(sortItems);

  if (state.selectedItem && !state.filteredItems.some((item) => item.id === state.selectedItem.id)) {
    state.selectedItem = state.filteredItems[0] || null;
  }

  renderAll();
}

function getDateFilteredItems() {
  const startKey = toCompactDate(state.rangeStart || els.startDateInput.value || new Date());
  const endKey = toCompactDate(state.rangeEnd || els.endDateInput.value || new Date());
  return state.allItems.filter((item) => !item.dateKey || (item.dateKey >= startKey && item.dateKey <= endKey));
}

function getAvailableTypeEntries(items = getDateFilteredItems()) {
  const counts = new Map();
  items.forEach((item) => counts.set(item.type.key, (counts.get(item.type.key) || 0) + 1));
  return DISASTER_TYPES.filter((type) => counts.has(type.key)).map((type) => ({
    ...type,
    count: counts.get(type.key) || 0,
  }));
}

function selectAllAvailableTypes() {
  state.activeTypes = new Set(getAvailableTypeEntries().map((type) => type.key));
}

function syncActiveTypesWithAvailable(typeKeys) {
  const availableTypes = new Set(typeKeys);
  state.activeTypes = new Set(Array.from(state.activeTypes).filter((type) => availableTypes.has(type)));
}

function getVisibleTypeKeys() {
  return Array.from(els.typeFilter.querySelectorAll("[data-type]")).map((button) => button.dataset.type);
}

function renderTypeFilters(types) {
  if (!types.length) {
    els.typeFilter.innerHTML = `<div class="type-empty">조회 결과의 재해구분이 표시됩니다.</div>`;
    return;
  }

  els.typeFilter.innerHTML = types
    .map(
      (type) => `
        <button class="type-button ${state.activeTypes.has(type.key) ? "is-active" : ""}" type="button" data-type="${type.key}" style="--type-color:${type.color}" title="${type.label} ${formatNumber(type.count)}건">
          <i data-lucide="${type.icon}"></i>
          <span>${type.label}</span>
        </button>
      `,
    )
    .join("");
  setupIcons();
}

function sortItems(a, b) {
  if (state.sortBy === "region") {
    return a.region.localeCompare(b.region, "ko");
  }

  if (state.sortBy === "severity") {
    return severityScore(b.step) - severityScore(a.step) || b.timestamp - a.timestamp;
  }

  return b.timestamp - a.timestamp;
}

function renderAll() {
  renderSummary();
  renderMarkers();
  renderList();
  renderDetail();
  stabilizeMapLayout();
}

function renderSummary() {
  const total = state.filteredItems.length;
  const summary = countByType(state.filteredItems);
  const visibleSummary = summary.filter(([, count]) => count > 0);
  els.totalCount.textContent = formatNumber(total);
  els.summaryPeriod.textContent = `${formatDateLabel(state.rangeStart || els.startDateInput.value)} ~ ${formatDateLabel(state.rangeEnd || els.endDateInput.value)}`;
  const loadedText = state.serverTotal > state.allItems.length ? `${formatNumber(state.allItems.length)}/${formatNumber(state.serverTotal)}건 로드` : `${formatNumber(state.allItems.length)}건 로드`;
  els.summaryRegion.textContent = state.usedFallback
    ? "예시 데이터 표시 중"
    : state.searchTerm
      ? `${state.searchTerm} 검색 결과 · ${loadedText}`
      : `전국 재난문자 · ${loadedText}`;

  els.summaryList.innerHTML = visibleSummary
    .slice(0, 5)
    .map(
      ([typeKey, count]) => {
        const type = DISASTER_TYPES.find((item) => item.key === typeKey) || DISASTER_TYPES.at(-1);
        return `
          <li>
            <span class="summary-dot" style="--dot-color:${type.color}"></span>
            <span>${type.label}</span>
            <strong>${formatNumber(count)}</strong>
          </li>
        `;
      },
    )
    .join("");
  renderMapLegend(visibleSummary);
}

function renderMapLegend(summary) {
  const legendTypes = summary.length
    ? summary.slice(0, 6).map(([typeKey]) => DISASTER_TYPES.find((type) => type.key === typeKey)).filter(Boolean)
    : DISASTER_TYPES.filter((type) => state.activeTypes.has(type.key)).slice(0, 6);

  const typeLegend = legendTypes
    .map(
      (type) => `
        <span class="legend-chip" style="--legend-color:${type.color}">
          <i></i>${type.label}
        </span>
      `,
    )
    .join("");
  const severityLegend = SEVERITY_LEGEND.map(
    (severity) => `
      <span class="legend-chip severity-chip ${severity.className}" style="--legend-color:${severity.color}">
        <i></i>${severity.label}
      </span>
    `,
  ).join("");

  els.mapLegend.innerHTML = `${typeLegend}<span class="legend-divider"></span>${severityLegend}`;
}

function renderMarkers() {
  state.markers.clearLayers();
  const regionGroups = groupByRegion(state.filteredItems);

  regionGroups.forEach((group) => {
    const mainType = topType(group.items);
    const markerMix = typeMix(group.items);
    const markerSeverity = topSeverity(group.items);
    const latestItem = latestMessage(group.items);
    const sizeClass = group.items.length >= 20 ? "is-large" : group.items.length <= 3 ? "is-small" : "";
    const markerClass = ["cluster-marker", sizeClass, markerSeverity.className, markerMix.isMixed ? "is-mixed" : ""]
      .filter(Boolean)
      .join(" ");
    const icon = L.divIcon({
      className: `cluster-marker-shell ${markerSeverity.className}`,
      html: `
        <div class="marker-stack" style="--severity-color:${markerSeverity.color}" title="${escapeHtml(markerMix.label)} ${formatNumber(group.items.length)}건">
          <div class="${markerClass}" style="--marker-color:${mainType.color}" aria-label="${escapeHtml(markerMix.label)} ${formatNumber(group.items.length)}건">
            ${
              markerMix.isMixed
                ? `<span class="marker-mix">${markerMix.types
                    .slice(0, 3)
                    .map((type) => `<i style="--mix-color:${type.color}" title="${escapeHtml(type.label)}"></i>`)
                    .join("")}</span>`
                : `<span class="marker-symbol"><i data-lucide="${mainType.icon}"></i></span>`
            }
          </div>
          <span class="marker-count">${formatNumber(group.items.length)}</span>
          ${markerSeverity.badge ? `<span class="marker-alert">!</span>` : ""}
        </div>
      `,
      iconSize: [64, 64],
      iconAnchor: [32, 32],
    });

    const marker = L.marker([group.point.lat, group.point.lng], { icon })
      .addTo(state.markers)
      .bindPopup(
        `
          <div class="popup-title">
            <span>${escapeHtml(group.region)}</span>
            <span class="popup-count">${formatNumber(group.items.length)}건</span>
          </div>
          <span class="popup-step ${markerSeverity.className}" style="--severity-color:${markerSeverity.color}">${escapeHtml(markerSeverity.label)}</span>
          ${markerMix.isMixed ? `<div class="popup-types">${markerMix.types.map((type) => `<span style="--type-color:${type.color}">${escapeHtml(type.label)}</span>`).join("")}</div>` : ""}
          ${latestItem ? `
            <div class="popup-latest">
              <div class="popup-meta">
                <strong>${escapeHtml(latestItem.disaster || latestItem.type.label)}</strong>
                <span>${escapeHtml(latestItem.createdAt)}</span>
              </div>
              <p class="popup-text">${escapeHtml(latestItem.message)}</p>
            </div>
          ` : ""}
        `,
        { className: "custom-popup" },
      );

    marker.on("click", () => {
      selectRegionGroup(group);
    });
  });
  setupIcons();
}

function renderList() {
  const listItems = getListItems();
  const visibleItems = listItems.slice(0, state.listLimit);
  els.listTitle.textContent = state.activeRegionFilter
    ? `${state.activeRegionFilter.name} 재난문자`
    : "재난문자 목록";
  els.clearRegionFilter.hidden = !state.activeRegionFilter;

  if (!visibleItems.length) {
    els.messageList.innerHTML = `<div class="empty-state">${state.activeRegionFilter ? "선택한 지역의 재난문자가 없습니다." : "조건에 맞는 재난문자가 없습니다."}</div>`;
    els.loadMoreBtn.disabled = true;
    els.loadMoreBtn.textContent = "더보기";
    return;
  }

  els.messageList.innerHTML = visibleItems
    .map(
      (item) => `
        <button class="message-card ${state.selectedItem?.id === item.id ? "is-selected" : ""}" type="button" data-id="${escapeHtml(item.id)}" style="--accent:${item.type.color}" aria-pressed="${state.selectedItem?.id === item.id ? "true" : "false"}">
          <span class="message-icon"><i data-lucide="${item.type.icon}"></i></span>
          <span class="message-body">
            <span class="message-topline">
              <span class="message-title">${escapeHtml(item.disaster || item.type.label)}</span>
              <span class="step-badge">${escapeHtml(item.step)}</span>
            </span>
            <span class="message-time">${escapeHtml(item.createdAt)}</span>
            <span class="message-region">${escapeHtml(item.region)}</span>
            <span class="message-snippet">${escapeHtml(item.message)}</span>
          </span>
        </button>
      `,
    )
    .join("");

  els.loadMoreBtn.disabled = state.filteredItems.length <= state.listLimit;
  if (listItems.length > state.listLimit) {
    els.loadMoreBtn.disabled = false;
    els.loadMoreBtn.textContent = `더보기 (${listItems.length - state.listLimit}건)`;
  } else if (!state.activeRegionFilter && state.allItems.length < state.serverTotal) {
    els.loadMoreBtn.disabled = false;
    els.loadMoreBtn.textContent = "다음 페이지 불러오기";
  } else if (state.activeRegionFilter) {
    els.loadMoreBtn.disabled = true;
    els.loadMoreBtn.textContent = `${formatNumber(listItems.length)}건 표시 중`;
  } else {
    els.loadMoreBtn.disabled = true;
    els.loadMoreBtn.textContent = "모두 표시됨";
  }
  setupIcons();
}

function getListItems() {
  if (!state.activeRegionFilter) return state.filteredItems;

  const group = groupByRegion(state.filteredItems).find((entry) => entry.key === state.activeRegionFilter.key);
  if (!group) {
    state.activeRegionFilter = null;
    return state.filteredItems;
  }
  return group.items;
}

function renderDetail() {
  const item = state.selectedItem;
  els.detailSection.classList.toggle("has-selection", Boolean(item));
  if (!item) {
    els.detailContent.innerHTML = `<div class="empty-state">목록에서 재난문자를 선택하면 상세 정보가 표시됩니다.</div>`;
    return;
  }

  els.detailContent.innerHTML = `
    <span class="detail-alert" style="--accent:${item.type.color}">${escapeHtml(item.step)}</span>
    <h3 class="detail-title">${escapeHtml(item.disaster || item.type.label)} 안내</h3>
    <dl class="detail-table">
      <div class="detail-row">
        <dt>발령일시</dt>
        <dd>${escapeHtml(item.createdAt)}</dd>
      </div>
      <div class="detail-row">
        <dt>재해구분</dt>
        <dd>${escapeHtml(item.disaster)}</dd>
      </div>
      <div class="detail-row">
        <dt>수신지역</dt>
        <dd>${escapeHtml(item.region)}</dd>
      </div>
      <div class="detail-row">
        <dt>내용</dt>
        <dd>${escapeHtml(item.message)}</dd>
      </div>
      <div class="detail-row">
        <dt>등록일자</dt>
        <dd>${escapeHtml(item.regDate)}</dd>
      </div>
    </dl>
  `;
}

function selectMessage(item, { moveMap = true, scrollDetail = false } = {}) {
  state.selectedItem = item;
  const targetPoint = state.activeRegionFilter
    ? groupByRegion(state.filteredItems).find((entry) => entry.key === state.activeRegionFilter.key)?.point
    : item.point;
  if (moveMap && targetPoint) {
    state.map.flyTo([targetPoint.lat, targetPoint.lng], targetPoint.zoom, { duration: 0.55 });
  }
  renderList();
  renderDetail();

  if (scrollDetail && window.matchMedia("(max-width: 980px)").matches) {
    els.detailSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function selectRegionGroup(group) {
  state.activeRegionFilter = { key: group.key, name: group.region };
  state.listLimit = Math.max(20, Math.min(group.items.length, 50));
  state.selectedItem = group.items[0] || null;
  renderList();
  renderDetail();
  showToast(`${group.region} 재난문자 ${formatNumber(group.items.length)}건을 목록에 표시했습니다.`);
}

function resetDashboard() {
  state.activeTypes = new Set(DISASTER_TYPES.map((type) => type.key));
  state.searchTerm = "";
  state.sortBy = "latest";
  state.listLimit = 20;
  state.activeRegionFilter = null;
  els.regionSearch.value = "";
  els.sortSelect.value = "latest";
  setDateRange(new Date(), new Date());
  document.querySelectorAll(".range-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.days === "0");
  });
  document.querySelectorAll(".type-button").forEach((button) => button.classList.add("is-active"));
  state.map.flyTo(DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, { duration: 0.55 });
  fetchMessages();
}

function groupByRegion(items) {
  const groups = new Map();
  items.forEach((item) => {
    const itemPoints = item.points?.length ? item.points : item.point ? [item.point] : [];
    uniquePoints(itemPoints).forEach((point) => {
      const key = point.canonicalKey || normalizeRegionText(point.key);
      if (!groups.has(key)) {
        groups.set(key, { key, region: point.displayName || point.key, point, items: [] });
      }
      groups.get(key).items.push(item);
    });
  });
  return Array.from(groups.values());
}

function uniquePoints(points) {
  const seen = new Set();
  return points.filter((point) => {
    if (!point) return false;
    const key = point.canonicalKey || point.key || `${point.lat},${point.lng}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function topType(items) {
  const counts = new Map();
  items.forEach((item) => counts.set(item.type.key, (counts.get(item.type.key) || 0) + 1));
  const [key] = Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0] || ["기타"];
  return DISASTER_TYPES.find((type) => type.key === key) || DISASTER_TYPES.at(-1);
}

function typeMix(items) {
  const counts = new Map();
  items.forEach((item) => counts.set(item.type.key, (counts.get(item.type.key) || 0) + 1));
  const types = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => {
      const type = DISASTER_TYPES.find((entry) => entry.key === key) || DISASTER_TYPES.at(-1);
      return { ...type, count };
    });

  return {
    isMixed: types.length > 1,
    label: types.length > 1 ? `혼합 ${types.map((type) => type.label).join(", ")}` : types[0]?.label || "기타",
    types,
  };
}

function latestMessage(items) {
  return items.slice().sort((a, b) => b.timestamp - a.timestamp)[0] || null;
}

function topSeverity(items) {
  const topItem = items.slice().sort((a, b) => severityScore(b.step) - severityScore(a.step))[0];
  return markerSeverity(topItem?.step);
}

function markerSeverity(step) {
  const value = String(step || "");
  if (value.includes("위급")) {
    return { key: "critical", label: "위급재난", className: "is-critical", color: "#e11d48", badge: true };
  }
  if (value.includes("긴급")) {
    return { key: "urgent", label: "긴급재난", className: "is-urgent", color: "#f59e0b", badge: true };
  }
  return { key: "advisory", label: value || "안전안내", className: "is-advisory", color: "#94a3b8", badge: false };
}

function countByType(items) {
  const counts = new Map(DISASTER_TYPES.map((type) => [type.key, 0]));
  items.forEach((item) => counts.set(item.type.key, (counts.get(item.type.key) || 0) + 1));
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
}

function resolveType(value) {
  const normalized = normalizeTypeText(value);
  const fallbackType = DISASTER_TYPES.find((type) => type.key === "기타") || DISASTER_TYPES.at(-1);
  if (!normalized) return fallbackType;

  const exactType = DISASTER_TYPES.find(
    (type) => normalizeTypeText(type.key) === normalized || normalizeTypeText(type.label) === normalized,
  );
  if (exactType) return exactType;

  const keyMatches = DISASTER_TYPES.filter((type) => normalized.includes(normalizeTypeText(type.key))).sort(
    (a, b) => normalizeTypeText(b.key).length - normalizeTypeText(a.key).length,
  );
  if (keyMatches.length) return keyMatches[0];

  const aliasMatches = DISASTER_TYPES.map((type) => {
    const alias = type.aliases
      .map((item) => normalizeTypeText(item))
      .filter(Boolean)
      .find((item) => normalized.includes(item));
    return alias ? { type, length: alias.length } : null;
  })
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  return aliasMatches[0]?.type || fallbackType;
}

function normalizeTypeText(value) {
  return String(value || "").replace(/\s/g, "").toLowerCase();
}

function extractRegionRefs(regionName) {
  const raw = String(regionName || "").trim();
  if (!raw) return [];

  const refs = raw
    .split(/\s*[,，]\s*/)
    .map((segment) => buildRegionRef(segment))
    .filter(Boolean);

  return refs.length ? refs : [buildRegionRef(raw)].filter(Boolean);
}

function buildRegionRef(segment) {
  const clean = segment.replace(/\s+/g, " ").trim();
  if (!clean) return null;
  if (isNonAdministrativeRegion(clean)) return null;

  const province = findProvince(clean);
  const basic = findBasicLocalName(clean, province);
  const query = basic ? `${province?.canonical || ""} ${basic}`.trim() : province?.canonical || clean;
  const displayName = basic && province ? `${province.label} ${basic}` : basic || province?.label || clean;

  return {
    key: normalizeRegionText(query),
    query,
    label: basic || province?.label || clean,
    displayName,
    normalizedQuery: normalizeRegionText(query),
    isLocal: Boolean(basic),
    hasProvince: Boolean(province),
  };
}

function findProvince(value) {
  const normalized = normalizeRegionText(value);
  return (
    PROVINCE_DEFS.find((province) =>
      province.names
        .slice()
        .sort((a, b) => b.length - a.length)
        .some((name) => normalized.startsWith(normalizeRegionText(name))),
    ) || null
  );
}

function findBasicLocalName(value, province) {
  const compact = value.replace(/\s+/g, " ").trim();
  const afterProvince = province
    ? compact.replace(new RegExp(province.names.map(escapeRegExp).join("|")), "").trim()
    : compact;
  const tokens = afterProvince.split(/\s+/).filter(Boolean);

  if (province?.level === "metro") {
    const metroUnit = tokens.find((token) => /[구군]$/.test(token));
    if (metroUnit) return metroUnit;
  }

  const provinceUnit = tokens.find((token) => /[시군]$/.test(token));
  if (provinceUnit) return provinceUnit;

  return tokens.find((token) => /[시군구]$/.test(token)) || null;
}

function resolvePointsFromRefs(refs, originalRegionName) {
  if (!refs.length) return [];

  const points = refs.map((ref) => resolveKnownLocalPoint(ref)).filter(Boolean);
  if (points.length) return uniquePoints(points);

  if (refs.some((ref) => ref.isLocal)) return [];

  const provincePoint = resolveProvincePoint(originalRegionName || refs[0]?.query || "");
  return provincePoint ? [provincePoint] : [];
}

function resolveKnownLocalPoint(ref) {
  if (!ref?.normalizedQuery) return null;
  const exactPoint = LOCAL_POINT_INDEX.get(ref.normalizedQuery);
  if (exactPoint) return exactPoint;

  if (ref.hasProvince) return null;
  if (AMBIGUOUS_LOCAL_LABELS.has(ref.label)) return null;

  const aliasMatches = LOCAL_ALIAS_INDEX.get(normalizeRegionText(ref.label)) || [];
  return aliasMatches.length === 1 ? aliasMatches[0] : null;
}

function resolveProvincePoint(regionName) {
  const normalized = normalizeRegionText(regionName);
  return (
    REGION_POINTS.find((point) => point.names.some((name) => normalized.includes(normalizeRegionText(name)))) ||
    REGION_POINTS.find((point) => normalized.includes(normalizeRegionText(point.key))) ||
    null
  );
}

function findRegionPoint(regionName) {
  const refs = extractRegionRefs(regionName);
  return resolvePointsFromRefs(refs, regionName)[0] || null;
}

function isNonAdministrativeRegion(regionName) {
  const normalized = normalizeRegionText(regionName);
  return NON_ADMIN_REGION_PATTERN.test(normalized);
}

function isReasonableKoreaCoordinate(lat, lng) {
  return lat >= 33 && lat <= 39.6 && lng >= 124 && lng <= 132;
}

function isNearProvince(lat, lng, ref) {
  const province = findProvince(ref?.query || "");
  if (!province) return true;

  const center = resolveProvincePoint(province.canonical);
  if (!center) return true;

  const maxDistanceKm = province.label === "제주" ? 95 : 240;
  return distanceKm(lat, lng, center.lat, center.lng) <= maxDistanceKm;
}

function distanceKm(lat1, lng1, lat2, lng2) {
  const radiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * radiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function normalizeRegionText(value) {
  return String(value || "").replace(/\s/g, "");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseDateTime(value) {
  if (!value) return 0;
  const normalized = String(value).replace(/\//g, "-");
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function parseDateKey(value) {
  const match = String(value || "").match(/^(\d{4})[/-](\d{2})[/-](\d{2})/);
  return match ? `${match[1]}${match[2]}${match[3]}` : "";
}

function toCompactDate(date) {
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date.replaceAll("-", "");
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function toInputDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function setDateRange(startDate, endDate) {
  els.startDateInput.value = toInputDate(startDate);
  els.endDateInput.value = toInputDate(endDate);
  enforceDateRange({ silent: true });
}

function enforceDateRange({ silent = false } = {}) {
  let start = parseInputDate(els.startDateInput.value) || new Date();
  let end = parseInputDate(els.endDateInput.value) || new Date();

  if (start > end) {
    [start, end] = [end, start];
  }

  const rangeDays = Math.floor((stripTime(end) - stripTime(start)) / 86400000) + 1;
  if (rangeDays > MAX_RANGE_DAYS) {
    start = new Date(end);
    start.setDate(start.getDate() - (MAX_RANGE_DAYS - 1));
    if (!silent) {
      showToast("최대 7일까지만 조회할 수 있어 시작일을 자동 조정했습니다.");
    }
  }

  els.startDateInput.value = toInputDate(start);
  els.endDateInput.value = toInputDate(end);
  state.rangeStart = els.startDateInput.value;
  state.rangeEnd = els.endDateInput.value;

  return { start: state.rangeStart, end: state.rangeEnd };
}

function parseInputDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function stripTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatDateLabel(value) {
  if (!value) return "-";
  return String(value).replaceAll("-", ".");
}

function updateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const date = `${year}-${month}-${day}`;
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  els.updatedAt.textContent = `${date} ${time} 기준`;
}

function severityScore(step) {
  const value = String(step);
  if (value.includes("위급")) return 4;
  if (value.includes("긴급")) return 3;
  if (value.includes("경보")) return 2;
  return 1;
}

function formatNumber(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return String(value ?? "-");
  return number.toLocaleString("ko-KR");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function setLoading(isLoading) {
  document.querySelector(".dashboard").classList.toggle("loading", isLoading);
}

function showToast(message) {
  els.statusToast.textContent = message;
  els.statusToast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    els.statusToast.classList.remove("is-visible");
  }, 2600);
}
