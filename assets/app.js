(function(){'use strict';
/* ================= SHARED DATA (used by the browser app AND the build script) ================= */
// n = display name, tz = IANA zone, cc = country code, k = extra search keywords
let CITY_DB = [
  {n:'New York', tz:'America/New_York', cc:'US', k:'est edt eastern et boston miami washington atlanta'},
  {n:'Chicago', tz:'America/Chicago', cc:'US', k:'cst cdt central ct dallas houston'},
  {n:'Denver', tz:'America/Denver', cc:'US', k:'mst mdt mountain mt'},
  {n:'Los Angeles', tz:'America/Los_Angeles', cc:'US', k:'pst pdt pacific pt san francisco seattle california'},
  {n:'Phoenix', tz:'America/Phoenix', cc:'US', k:'arizona mst'},
  {n:'Anchorage', tz:'America/Anchorage', cc:'US', k:'alaska akst akdt'},
  {n:'Honolulu', tz:'Pacific/Honolulu', cc:'US', k:'hawaii hst'},
  {n:'Toronto', tz:'America/Toronto', cc:'CA', k:'est edt ottawa montreal canada'},
  {n:'Vancouver', tz:'America/Vancouver', cc:'CA', k:'pst pdt canada'},
  {n:'Mexico City', tz:'America/Mexico_City', cc:'MX', k:'mexico'},
  {n:'Bogota', tz:'America/Bogota', cc:'CO', k:'colombia'},
  {n:'Lima', tz:'America/Lima', cc:'PE', k:'peru'},
  {n:'Santiago', tz:'America/Santiago', cc:'CL', k:'chile'},
  {n:'Sao Paulo', tz:'America/Sao_Paulo', cc:'BR', k:'brazil brt'},
  {n:'Buenos Aires', tz:'America/Argentina/Buenos_Aires', cc:'AR', k:'argentina'},
  {n:'London', tz:'Europe/London', cc:'GB', k:'gmt bst uk england britain'},
  {n:'Dublin', tz:'Europe/Dublin', cc:'IE', k:'ireland'},
  {n:'Lisbon', tz:'Europe/Lisbon', cc:'PT', k:'portugal'},
  {n:'Madrid', tz:'Europe/Madrid', cc:'ES', k:'cet cest spain'},
  {n:'Paris', tz:'Europe/Paris', cc:'FR', k:'cet cest france'},
  {n:'Berlin', tz:'Europe/Berlin', cc:'DE', k:'cet cest germany'},
  {n:'Amsterdam', tz:'Europe/Amsterdam', cc:'NL', k:'netherlands cet'},
  {n:'Rome', tz:'Europe/Rome', cc:'IT', k:'italy cet'},
  {n:'Zurich', tz:'Europe/Zurich', cc:'CH', k:'switzerland cet'},
  {n:'Stockholm', tz:'Europe/Stockholm', cc:'SE', k:'sweden cet'},
  {n:'Warsaw', tz:'Europe/Warsaw', cc:'PL', k:'poland cet'},
  {n:'Athens', tz:'Europe/Athens', cc:'GR', k:'greece eet eest'},
  {n:'Kyiv', tz:'Europe/Kyiv', cc:'UA', k:'ukraine kiev'},
  {n:'Istanbul', tz:'Europe/Istanbul', cc:'TR', k:'turkey'},
  {n:'Moscow', tz:'Europe/Moscow', cc:'RU', k:'russia msk'},
  {n:'Lagos', tz:'Africa/Lagos', cc:'NG', k:'wat nigeria'},
  {n:'Accra', tz:'Africa/Accra', cc:'GH', k:'ghana'},
  {n:'Nairobi', tz:'Africa/Nairobi', cc:'KE', k:'eat kenya'},
  {n:'Addis Ababa', tz:'Africa/Addis_Ababa', cc:'ET', k:'ethiopia'},
  {n:'Cairo', tz:'Africa/Cairo', cc:'EG', k:'egypt'},
  {n:'Johannesburg', tz:'Africa/Johannesburg', cc:'ZA', k:'sast south africa'},
  {n:'Casablanca', tz:'Africa/Casablanca', cc:'MA', k:'morocco'},
  {n:'Dubai', tz:'Asia/Dubai', cc:'AE', k:'gst uae abu dhabi emirates'},
  {n:'Riyadh', tz:'Asia/Riyadh', cc:'SA', k:'saudi arabia'},
  {n:'Doha', tz:'Asia/Qatar', cc:'QA', k:'qatar'},
  {n:'Tel Aviv', tz:'Asia/Jerusalem', cc:'IL', k:'israel jerusalem'},
  {n:'Tehran', tz:'Asia/Tehran', cc:'IR', k:'iran'},
  {n:'Karachi', tz:'Asia/Karachi', cc:'PK', k:'pkt pakistan lahore islamabad'},
  {n:'Mumbai / Delhi', tz:'Asia/Kolkata', cc:'IN', k:'ist india kolkata bangalore chennai'},
  {n:'Kathmandu', tz:'Asia/Kathmandu', cc:'NP', k:'npt nepal'},
  {n:'Dhaka', tz:'Asia/Dhaka', cc:'BD', k:'bangladesh'},
  {n:'Colombo', tz:'Asia/Colombo', cc:'LK', k:'sri lanka'},
  {n:'Bangkok', tz:'Asia/Bangkok', cc:'TH', k:'thailand'},
  {n:'Ho Chi Minh City', tz:'Asia/Ho_Chi_Minh', cc:'VN', k:'vietnam saigon'},
  {n:'Jakarta', tz:'Asia/Jakarta', cc:'ID', k:'indonesia wib'},
  {n:'Singapore', tz:'Asia/Singapore', cc:'SG', k:'sgt'},
  {n:'Kuala Lumpur', tz:'Asia/Kuala_Lumpur', cc:'MY', k:'malaysia'},
  {n:'Manila', tz:'Asia/Manila', cc:'PH', k:'philippines'},
  {n:'Hong Kong', tz:'Asia/Hong_Kong', cc:'HK', k:'hkt'},
  {n:'Shanghai / Beijing', tz:'Asia/Shanghai', cc:'CN', k:'china'},
  {n:'Taipei', tz:'Asia/Taipei', cc:'TW', k:'taiwan'},
  {n:'Seoul', tz:'Asia/Seoul', cc:'KR', k:'kst korea'},
  {n:'Tokyo', tz:'Asia/Tokyo', cc:'JP', k:'jst japan'},
  {n:'Perth', tz:'Australia/Perth', cc:'AU', k:'awst australia'},
  {n:'Adelaide', tz:'Australia/Adelaide', cc:'AU', k:'australia'},
  {n:'Brisbane', tz:'Australia/Brisbane', cc:'AU', k:'aest australia'},
  {n:'Sydney', tz:'Australia/Sydney', cc:'AU', k:'aest aedt australia canberra'},
  {n:'Melbourne', tz:'Australia/Melbourne', cc:'AU', k:'aest aedt australia'},
  {n:'Auckland', tz:'Pacific/Auckland', cc:'NZ', k:'nzst nzdt new zealand'},
  {n:'UTC', tz:'UTC', cc:'', k:'utc gmt coordinated universal time'}
];

const TZ_ALIAS = {'Asia/Calcutta':'Asia/Kolkata','Asia/Katmandu':'Asia/Kathmandu','Asia/Saigon':'Asia/Ho_Chi_Minh','Europe/Kiev':'Europe/Kyiv','Asia/Rangoon':'Asia/Yangon'};
const normTz = tz => TZ_ALIAS[tz] || tz;

const ABBR_FIXED = {
  'Asia/Kathmandu':'NPT','Asia/Kolkata':'IST','Asia/Dubai':'GST','Asia/Tokyo':'JST','Asia/Seoul':'KST',
  'Asia/Singapore':'SGT','Asia/Hong_Kong':'HKT','Asia/Karachi':'PKT','Asia/Dhaka':'BDT','Asia/Manila':'PHT',
  'Asia/Jakarta':'WIB','Africa/Lagos':'WAT','Africa/Nairobi':'EAT','Africa/Johannesburg':'SAST','UTC':'UTC'
};

const PRESETS = [
  {label:'Remote team',        tzs:['America/New_York','Europe/London','Europe/Berlin','Asia/Dubai','Asia/Kathmandu','Australia/Sydney']},
  {label:'Traders',            tzs:['America/New_York','Europe/London','Asia/Dubai','Asia/Tokyo','Australia/Sydney']},
  {label:'US and South Asia',  tzs:['America/Los_Angeles','America/New_York','Asia/Kolkata','Asia/Kathmandu']},
  {label:'EST to IST',         tzs:['America/New_York','Asia/Kolkata']},
  {label:'PST to NPT',         tzs:['America/Los_Angeles','Asia/Kathmandu']},
  {label:'London to Sydney',   tzs:['Europe/London','Australia/Sydney']}
];
const DEFAULT_TZS = ['America/New_York','Europe/London','Asia/Tokyo','Australia/Sydney','Asia/Kathmandu'];
const MAX_CITIES = 10;

/* Stock exchanges. sessions = [open, close] minutes after local midnight.
   Holiday lists are best-effort. REFRESH THEM EVERY YEAR (format YYYY-MM-DD). */
const MARKETS = [
  { id:'nyse', slug:'nyse-trading-hours', name:'New York Stock Exchange', short:'NYSE', tz:'America/New_York',
    sessions:[[570, 960]],
    early:{'2026-11-27':780,'2026-12-24':780},
    holidays:['2026-01-01','2026-01-19','2026-02-16','2026-04-03','2026-05-25','2026-06-19','2026-07-03','2026-09-07','2026-11-26','2026-12-25',
              '2027-01-01','2027-01-18','2027-02-15','2027-03-26','2027-05-31','2027-06-18','2027-07-05','2027-09-06','2027-11-25','2027-12-24']},
  { id:'lse', slug:'lse-trading-hours', name:'London Stock Exchange', short:'LSE', tz:'Europe/London',
    sessions:[[480, 990]],
    early:{'2026-12-24':750,'2026-12-31':750},
    holidays:['2026-01-01','2026-04-03','2026-04-06','2026-05-04','2026-05-25','2026-08-31','2026-12-25','2026-12-28',
              '2027-01-01','2027-03-26','2027-03-29','2027-05-03','2027-05-31','2027-08-30','2027-12-27','2027-12-28']},
  { id:'tse', slug:'tokyo-stock-exchange-hours', name:'Tokyo Stock Exchange', short:'TSE', tz:'Asia/Tokyo',
    sessions:[[540, 690], [750, 930]],
    early:{},
    holidays:['2026-01-01','2026-01-02','2026-01-12','2026-02-11','2026-02-23','2026-03-20','2026-04-29','2026-05-04','2026-05-05','2026-05-06',
              '2026-07-20','2026-08-11','2026-09-21','2026-09-22','2026-09-23','2026-10-12','2026-11-03','2026-11-23','2026-12-31']}
];

/* Words people type in the Quick convert box */
const ABBR_TO_TZ = {
  est:'America/New_York', edt:'America/New_York', et:'America/New_York', eastern:'America/New_York',
  cst:'America/Chicago', cdt:'America/Chicago', ct:'America/Chicago',
  mst:'Etc/GMT+7', mdt:'America/Denver', mt:'America/Denver',
  pst:'America/Los_Angeles', pdt:'America/Los_Angeles', pt:'America/Los_Angeles', pacific:'America/Los_Angeles',
  akst:'America/Anchorage', akdt:'America/Anchorage', hst:'Pacific/Honolulu',
  gmt:'UTC', bst:'Europe/London', utc:'UTC', z:'UTC', cet:'Europe/Berlin', cest:'Europe/Berlin',
  eet:'Europe/Athens', eest:'Europe/Athens', msk:'Europe/Moscow',
  ist:'Asia/Kolkata', npt:'Asia/Kathmandu', pkt:'Asia/Karachi', bdt:'Asia/Dhaka', jst:'Asia/Tokyo', kst:'Asia/Seoul',
  sgt:'Asia/Singapore', hkt:'Asia/Hong_Kong', pht:'Asia/Manila', wib:'Asia/Jakarta', gst:'Asia/Dubai',
  aest:'Australia/Sydney', aedt:'Australia/Sydney', acst:'Australia/Adelaide', awst:'Australia/Perth',
  nzst:'Pacific/Auckland', nzdt:'Pacific/Auckland', sast:'Africa/Johannesburg', wat:'Africa/Lagos', eat:'Africa/Nairobi', brt:'America/Sao_Paulo'
};
const COUNTRY_TZ = {
  australia:'Australia/Sydney', usa:'America/New_York', us:'America/New_York', america:'America/New_York', canada:'America/Toronto',
  china:'Asia/Shanghai', russia:'Europe/Moscow', brazil:'America/Sao_Paulo', uk:'Europe/London', england:'Europe/London', britain:'Europe/London',
  uae:'Asia/Dubai', korea:'Asia/Seoul', japan:'Asia/Tokyo', germany:'Europe/Berlin', france:'Europe/Paris', nepal:'Asia/Kathmandu', india:'Asia/Kolkata'
};

/* Abbreviations that mean different places. The Quick convert box asks the visitor instead of guessing. */
const AMBIGUOUS = {
  ist: [['India (IST, UTC+5:30)', 'Asia/Kolkata'], ['Ireland (IST in summer, UTC+1)', 'Europe/Dublin'], ['Israel (IST, UTC+2 or +3)', 'Asia/Jerusalem']],
  cst: [['US and Canada Central (CST)', 'America/Chicago'], ['China (CST, UTC+8)', 'Asia/Shanghai'], ['Cuba (CST)', 'America/Havana']],
  bst: [['British Summer Time (UTC+1)', 'Europe/London'], ['Bangladesh Standard Time (UTC+6)', 'Asia/Dhaka']],
  est: [['US and Canada Eastern (EST)', 'America/New_York'], ['Australian Eastern (EST)', 'Australia/Sydney']],
  pst: [['US and Canada Pacific (PST)', 'America/Los_Angeles'], ['Philippine Standard Time (PST, UTC+8)', 'Asia/Manila']],
  gst: [['Gulf Standard Time (UAE, UTC+4)', 'Asia/Dubai'], ['South Georgia (GST, UTC-2)', 'Atlantic/South_Georgia']],
  ast: [['Atlantic Time (Canada and Caribbean)', 'America/Halifax'], ['Arabia Standard Time (Saudi Arabia, UTC+3)', 'Asia/Riyadh' ]],
  gmt: [['Fixed GMT / UTC (UTC+0)', 'UTC'], ['United Kingdom local time (GMT in winter, BST in summer)', 'Europe/London']],
  mst: [['Fixed Mountain Standard Time (UTC−7)', 'Etc/GMT+7'], ['US/Canada Mountain Time (DST-aware)', 'America/Denver']]
};
const COUNTRY_NAMES = {US:'United States',CA:'Canada',MX:'Mexico',CO:'Colombia',PE:'Peru',CL:'Chile',BR:'Brazil',AR:'Argentina',GB:'United Kingdom',IE:'Ireland',PT:'Portugal',ES:'Spain',FR:'France',DE:'Germany',NL:'Netherlands',IT:'Italy',CH:'Switzerland',SE:'Sweden',PL:'Poland',GR:'Greece',UA:'Ukraine',TR:'Turkey',RU:'Russia',NG:'Nigeria',GH:'Ghana',KE:'Kenya',ET:'Ethiopia',EG:'Egypt',ZA:'South Africa',MA:'Morocco',AE:'United Arab Emirates',SA:'Saudi Arabia',QA:'Qatar',IL:'Israel',IR:'Iran',PK:'Pakistan',IN:'India',NP:'Nepal',BD:'Bangladesh',LK:'Sri Lanka',TH:'Thailand',VN:'Vietnam',ID:'Indonesia',SG:'Singapore',MY:'Malaysia',PH:'Philippines',HK:'Hong Kong',CN:'China',TW:'Taiwan',KR:'South Korea',JP:'Japan',AU:'Australia',NZ:'New Zealand'};
/* Weekend days (0 = Sunday ... 6 = Saturday) where they are not Saturday and Sunday */
const WEEKEND_BY_TZ = {'Asia/Riyadh':[5,6],'Asia/Qatar':[5,6],'Asia/Jerusalem':[5,6],'Africa/Cairo':[5,6],'Asia/Dhaka':[5,6],'Asia/Kathmandu':[6]};

/* ================= TIME ZONE MATH (pure functions, Intl only) ================= */
const fmtCache = new Map();
function cached(key, make) { let f = fmtCache.get(key); if (!f) { f = make(); fmtCache.set(key, f); } return f; }
const pad = n => String(n).padStart(2, '0');

function isValidTz(tz) { try { new Intl.DateTimeFormat('en-US', {timeZone: tz}); return true; } catch (e) { return false; } }
CITY_DB = CITY_DB.filter(c => isValidTz(c.tz));

function partsInTz(ms, tz) {
  const f = cached('p|' + tz, () => new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric'
  }));
  const o = {};
  for (const p of f.formatToParts(ms)) o[p.type] = p.value;
  return {y: +o.year, mo: +o.month, d: +o.day, h: (+o.hour) % 24, mi: +o.minute, s: +o.second};
}
function tzOffsetMs(ms, tz) {
  const p = partsInTz(ms, tz);
  return Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi, p.s) - Math.floor(ms / 1000) * 1000;
}
/*
 * Resolve a wall-clock time in an IANA zone without silently mishandling DST.
 * unique: one matching instant; ambiguous: repeated local time (earliest first);
 * gap: nonexistent local time, adjusted forward to the first valid minute.
 */
function resolveZonedTime(y, mo, d, h, mi, tz) {
  if (!isValidTz(tz)) return {status: 'invalid-zone', candidates: [], adjustedMs: NaN};
  const wall = Date.UTC(y, mo - 1, d, h, mi);
  const offsets = new Set();
  const addOffsetAt = ms => offsets.add(tzOffsetMs(ms, tz));
  const findCandidates = wallMs => {
    const found = [];
    for (const off of offsets) {
      const candidate = wallMs - off, p = partsInTz(candidate, tz);
      if (Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi) === wallMs) found.push(candidate);
    }
    return [...new Set(found)].sort((a, b) => a - b);
  };

  // Fast path: most local times are ordinary and need only nearby offsets.
  addOffsetAt(wall);
  const firstGuess = wall - [...offsets][0];
  addOffsetAt(firstGuess - 6 * 3600000);
  addOffsetAt(firstGuess + 6 * 3600000);
  addOffsetAt(firstGuess - 24 * 3600000);
  addOffsetAt(firstGuess + 24 * 3600000);
  let candidates = findCandidates(wall);
  if (candidates.length === 1) return {status: 'unique', candidates, adjustedMs: candidates[0]};
  if (candidates.length > 1) return {status: 'ambiguous', candidates, adjustedMs: candidates[0]};

  // Expand the offset sample around the requested wall time for unusual
  // transitions and spring-forward gaps.
  for (const delta of [-48, -36, -12, -6, 6, 12, 36, 48]) addOffsetAt(wall + delta * 3600000);
  candidates = findCandidates(wall);
  if (candidates.length === 1) return {status: 'unique', candidates, adjustedMs: candidates[0]};
  if (candidates.length > 1) return {status: 'ambiguous', candidates, adjustedMs: candidates[0]};

  // A spring-forward gap: advance to the first valid wall-clock minute.
  for (let minute = 1; minute <= 180; minute++) {
    const next = findCandidates(wall + minute * 60000);
    if (next.length) {
      const q = partsInTz(next[0], tz);
      return {status: 'gap', candidates: [], adjustedMs: next[0], adjusted: {y:q.y, mo:q.mo, d:q.d, h:q.h, mi:q.mi}};
    }
  }
  return {status: 'unresolvable', candidates: [], adjustedMs: NaN};
}
function zonedToUtc(y, mo, d, h, mi, tz) {
  // Repeated times consistently choose the earlier occurrence. Generic callers
  // move nonexistent wall times forward; explicit conversion UI explains it.
  return resolveZonedTime(y, mo, d, h, mi, tz).adjustedMs;
}
function offLabel(offMs) {
  const m = Math.round(offMs / 60000);
  const sign = m < 0 ? '-' : '+', a = Math.abs(m);
  const h = Math.floor(a / 60), mm = a % 60;
  return 'UTC' + sign + h + (mm ? ':' + pad(mm) : '');
}
function offsetLabel(ms, tz) { return offLabel(tzOffsetMs(ms, tz)); }
function tzAbbr(ms, tz) {
  if (ABBR_FIXED[tz]) return ABBR_FIXED[tz];
  for (const loc of ['en-US', 'en-GB', 'en-AU']) {
    const f = cached('a|' + loc + '|' + tz, () => new Intl.DateTimeFormat(loc, {timeZone: tz, timeZoneName: 'short'}));
    const part = f.formatToParts(ms).find(p => p.type === 'timeZoneName');
    if (part && /^[A-Z]{2,5}$/.test(part.value)) return part.value;
  }
  return offsetLabel(ms, tz);
}
/* Offset changes (daylight saving etc.) of one zone within the next N days, found by daily scan + bisection */
function findOffsetChanges(tz, fromMs, days) {
  const out = [];
  let prev = tzOffsetMs(fromMs, tz);
  for (let i = 1; i <= days; i++) {
    const t = fromMs + i * 864e5, o = tzOffsetMs(t, tz);
    if (o !== prev) {
      let lo = t - 864e5, hi = t;
      for (let k = 0; k < 12; k++) { const mid = Math.floor((lo + hi) / 2); if (tzOffsetMs(mid, tz) === prev) lo = mid; else hi = mid; }
      out.push({tz: tz, at: hi, from: prev, to: o});
      prev = o;
    }
  }
  return out;
}

/* ================= INLINE SVG ICONS (no CDN, so they always render) ================= */
const ICON_PATHS = {
  moon:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  radio:'<circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/>',
  clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  crosshair:'<circle cx="12" cy="12" r="10"/><path d="M22 12h-4M6 12H2M12 6V2M12 22v-4"/>',
  sort:'<path d="m3 16 4 4 4-4M7 20V4m14 4-4-4-4 4m4-4v16"/>',
  reset:'<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  copy:'<rect x="8" y="8" width="14" height="14" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  calplus:'<path d="M8 2v4M16 2v4M3 10h18M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8M19 16v6M16 19h6"/>',
  download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  pin:'<path d="M12 17v5M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  up:'<path d="m18 15-6-6-6 6"/>',
  down:'<path d="m6 9 6 6 6-6"/>',
  alert:'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4M12 17h.01"/>'
};
function ico(name, cls) {
  return '<svg class="' + (cls || 'icon') + '" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (ICON_PATHS[name] || '') + '</svg>';
}

/* ================= PURE LOGIC: fuzzy search + Fair Meeting Time Finder (no DOM) ================= */
function stripAccents(s) { return s.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
function editDist1(a, b) {                       // true when a and b differ by at most one edit
  if (a === b) return true;
  const la = a.length, lb = b.length;
  if (Math.abs(la - lb) > 1) return false;
  let i = 0, j = 0, edits = 0;
  while (i < la && j < lb) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++edits > 1) return false;
    if (la > lb) i++; else if (lb > la) j++; else { i++; j++; }
  }
  return edits + (la - i) + (lb - j) <= 1;
}
function fuzzyMatch(query, text) {               // forgiving search: prefixes, substrings and one typo
  const q = stripAccents(String(query).toLowerCase()).split(/[^a-z0-9]+/).filter(Boolean);
  if (!q.length) return true;
  const t = stripAccents(String(text).toLowerCase()).split(/[^a-z0-9]+/).filter(Boolean);
  return q.every(qt => t.some(tt => tt.indexOf(qt) === 0 || (qt.length >= 4 && (tt.indexOf(qt) > -1 ||
    editDist1(qt, tt) || editDist1(qt, tt.slice(0, qt.length)) || editDist1(qt, tt.slice(0, qt.length + 1)) || editDist1(qt, tt.slice(0, qt.length - 1))))));
}

/* ---- scoring: every number here is shown to the visitor in the "How the score works" box ---- */
const PENALTY = {early: 2, evening: 2, night: 6, weekend: 4};
function minutePenalty(mins, ws, we) {           // mins = minutes after local midnight
  const h = mins / 60;
  if (h >= ws && h < we) return {v: 0, t: 'inside working hours'};
  if (h >= 6 && h < ws) return {v: PENALTY.early, t: 'early morning'};
  if (h >= we && h < 22) return {v: PENALTY.evening, t: 'evening'};
  return {v: PENALTY.night, t: 'night'};
}
function localMinutesAndDow(ms, tz, cache) {     // fast local clock using a cached UTC offset per 15 minutes
  const bucket = Math.floor(ms / 900000), key = tz + '|' + bucket;
  let off = cache.get(key);
  if (off === undefined) { off = tzOffsetMs(bucket * 900000, tz); cache.set(key, off); }
  const t = ms + off, day = Math.floor(t / 864e5);
  return {mins: Math.floor((t - day * 864e5) / 60000), dow: (((day + 4) % 7) + 7) % 7};
}
/* parts: [{tz, name, ws, we, weekend:[days]}]. Returns the best non-overlapping slots, fairest first. */
function rankSlots(o) {
  const cache = new Map(), cands = [], dur = o.dur, parts = o.parts;
  for (let d = 0; d < o.days; d++) {
    for (let m = 0; m < 1440; m += 30) {
      const start = zonedToUtc(o.y, o.mo, o.d + d, 0, m, o.baseTz);
      let max = 0, sum = 0; const per = [];
      for (const p of parts) {
        let worst = {v: -1, t: 'inside working hours', weekend: false};
        for (let s = 0; s < dur; s += 15) {
          const li = localMinutesAndDow(start + s * 60000, p.tz, cache);
          const mp = minutePenalty(li.mins, p.ws, p.we);
          const wk = o.weekendsOff && (p.weekend || [0, 6]).indexOf(li.dow) > -1;
          const v = mp.v + (wk ? PENALTY.weekend : 0);
          if (v > worst.v) worst = {v: v, t: mp.t, weekend: wk};
        }
        per.push({tz: p.tz, name: p.name, penalty: worst.v, type: worst.t, weekend: worst.weekend});
        if (worst.v > max) max = worst.v;
        sum += worst.v;
      }
      cands.push({start: start, end: start + dur * 60000, max: max, sum: sum, per: per});
    }
  }
  cands.sort((a, b) => a.max - b.max || a.sum - b.sum || a.start - b.start);
  const picked = [], gap = (dur + (o.sepMin || 120)) * 60000;
  for (const c of cands) {
    if (picked.every(p => Math.abs(p.start - c.start) >= gap)) picked.push(c);
    if (picked.length >= (o.top || 5)) break;
  }
  return picked;
}
function fairnessLabel(max) {
  if (max === 0) return 'Good: everyone is inside working hours';
  if (max <= 3) return 'Fair: a small stretch for someone';
  if (max <= 5) return 'Weak: someone is on a weekend or outside hours';
  return 'Poor: someone is meeting at night';
}
function explainSlot(slot) {
  const out = slot.per.filter(p => p.penalty > 0).map(p => p.name + ' (' + (p.weekend ? 'weekend' + (p.type !== 'inside working hours' ? ', ' + p.type : '') : p.type) + ')');
  return out.length ? 'Outside normal hours for: ' + out.join(', ') + '.' : 'Nobody is outside their working hours.';
}
/* If this slot repeats weekly at the same time in the base city, does anyone's local time move? */
function weeklyDrift(slot, parts, baseTz, weeks) {
  const b = partsInTz(slot.start, baseTz), first = parts.map(p => { const q = partsInTz(slot.start, p.tz); return q.h * 60 + q.mi; });
  const hits = [];
  for (let k = 1; k <= weeks; k++) {
    const ms = zonedToUtc(b.y, b.mo, b.d + 7 * k, b.h, b.mi, baseTz);
    parts.forEach((p, i) => {
      const q = partsInTz(ms, p.tz), mins = q.h * 60 + q.mi;
      if (mins !== first[i] && !hits.some(h => h.name === p.name)) hits.push({name: p.name, from: first[i], to: mins, ms: ms});
    });
  }
  return hits;
}

/* ================= GLOBAL CLOCKSYNC APP (vanilla JS) ================= */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clean = s => s.replace(/[\u202f\u00a0]/g, ' ');
const unique = a => Array.from(new Set(a));
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};

/* Page configuration written by the build script */
const CFG = (() => { try { const el = document.getElementById('cs-config'); return el ? JSON.parse(el.textContent) : {}; } catch (e) { return {}; } })();
const ROOT = CFG.root || './';
const hasPlanner = !!$('#planner');
const hasMarkets = !!$('#marketGrid');
const localTz = (() => { try { return normTz(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'); } catch (e) { return 'UTC'; } })();

const state = {
  cities: [], baseTz: localTz, date: '', minutes: 0, live: true,
  fmt24: false, workStart: 9, workEnd: 17, duration: 60,
  recurFixed: null, recurEvery: 7, recurCount: 8, hours: {}
};

/* ---------- Formatters (respect the 12h / 24h switch) ---------- */
function fmtClock(ms, tz) {
  const f = state.fmt24
    ? cached('t24|' + tz, () => new Intl.DateTimeFormat('en-GB', {timeZone: tz, hour: '2-digit', minute: '2-digit', hourCycle: 'h23'}))
    : cached('t12|' + tz, () => new Intl.DateTimeFormat('en-US', {timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: true}));
  return clean(f.format(ms));
}
function fmtInviteTime(ms, tz) {
  const f = state.fmt24
    ? cached('i24|' + tz, () => new Intl.DateTimeFormat('en-GB', {timeZone: tz, hour: '2-digit', minute: '2-digit', hourCycle: 'h23'}))
    : cached('i12|' + tz, () => new Intl.DateTimeFormat('en-US', {timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: true}));
  return clean(f.format(ms));
}
const fmtMonthDay = (ms, tz) => cached('md|' + tz, () => new Intl.DateTimeFormat('en-US', {timeZone: tz, month: 'short', day: 'numeric'})).format(ms);
const fmtDateLong = (ms, tz) => cached('dl|' + tz, () => new Intl.DateTimeFormat('en-US', {timeZone: tz, weekday: 'short', month: 'short', day: 'numeric'})).format(ms);
function fmtHMS(ms, tz) {
  return clean(cached('hms|' + tz + state.fmt24, () => new Intl.DateTimeFormat(state.fmt24 ? 'en-GB' : 'en-US',
    {timeZone: tz, hour: state.fmt24 ? '2-digit' : 'numeric', minute: '2-digit', second: '2-digit', hourCycle: state.fmt24 ? 'h23' : 'h12'})).format(ms));
}
function fmtMinutes(m) {
  const h = Math.floor(m / 60) % 24, mi = m % 60;
  if (state.fmt24) return pad(h) + ':' + pad(mi);
  return (h % 12 || 12) + ':' + pad(mi) + ' ' + (h < 12 ? 'AM' : 'PM');
}
function hourLabel(h) {
  if (state.fmt24) return pad(h % 24) + ':00';
  return (h % 12 || 12) + ' ' + ((h % 24) < 12 ? 'AM' : 'PM');
}

/* ---------- State: URL hash > page config > saved settings > defaults ---------- */
function parseHash() {
  const out = {};
  const h = location.hash.replace(/^#/, '');
  if (!h) return out;
  h.split('&').forEach(kv => {
    const i = kv.indexOf('=');
    if (i < 1) return;
    try { out[kv.slice(0, i)] = decodeURIComponent(kv.slice(i + 1)); } catch (e) {}
  });
  if (out.c) out.c = out.c.split(',').map(s => s.trim()).filter(Boolean).slice(0, MAX_CITIES);
  if (out.d && !/^\d{4}-\d{2}-\d{2}$/.test(out.d)) delete out.d;
  if (out.t !== undefined) out.t = Math.max(0, Math.min(1439, parseInt(out.t, 10) || 0));
  ['ws', 'we'].forEach(k => { if (out[k] !== undefined) out[k] = Math.max(0, Math.min(24, parseInt(out[k], 10))); });
  return out;
}
function cityFromTz(tz) {
  tz = normTz(tz);
  const f = CITY_DB.find(c => c.tz === tz);
  if (f) return {name: f.n, tz: tz, cc: f.cc};
  const eg = /^Etc\/GMT([+-])(\d+)$/.exec(tz);
  if (eg) return {name: 'UTC' + (eg[1] === '-' ? '+' : '-') + eg[2], tz: tz, cc: ''};
  return {name: tz.split('/').pop().replace(/_/g, ' '), tz: tz, cc: ''};
}
function nowInBase() {
  const p = partsInTz(Date.now(), state.baseTz);
  state.date = p.y + '-' + pad(p.mo) + '-' + pad(p.d);
  state.minutes = p.h * 60 + p.mi;
}
function dateParts() { const [y, mo, d] = state.date.split('-').map(Number); return {y, mo, d}; }
function instant() { const {y, mo, d} = dateParts(); return zonedToUtc(y, mo, d, 0, state.minutes, state.baseTz); }

function initState() {
  const saved = LS.get('cs_state', null) || {};
  const hash = parseHash();
  const pinned = !!(CFG.cities && CFG.cities.length);   // landing pages keep their own city pair
  let tzs;
  if (hash.c && hash.c.length) tzs = hash.c;
  else if (pinned) tzs = CFG.cities;
  else if (saved.tzs && saved.tzs.length) tzs = saved.tzs;
  else tzs = [localTz].concat(DEFAULT_TZS);
  tzs = unique(tzs.map(normTz).filter(isValidTz)).slice(0, MAX_CITIES);
  if (!tzs.length) tzs = [localTz];
  state.cities = tzs.map(cityFromTz);
  let base = normTz(hash.b || (pinned ? tzs[0] : saved.base) || localTz);
  if (!tzs.includes(base)) base = tzs[0];
  state.baseTz = base;
  state.workStart = hash.ws !== undefined ? hash.ws : (saved.ws !== undefined ? saved.ws : 9);
  state.workEnd   = hash.we !== undefined ? hash.we : (saved.we !== undefined ? saved.we : 17);
  if (state.workEnd <= state.workStart) { state.workStart = 9; state.workEnd = 17; }
  state.fmt24 = hash.f ? hash.f === '24' : !!saved.fmt24;
  state.duration = saved.dur || 60;
  if (hash.d && hash.t !== undefined) { state.date = hash.d; state.minutes = hash.t; state.live = false; }
  else { state.live = true; nowInBase(); }
}
function persist() {
  const prev = LS.get('cs_state', null) || {};
  const pinned = !!(CFG.cities && CFG.cities.length);
  LS.set('cs_state', {
    tzs: pinned ? prev.tzs : state.cities.map(c => c.tz), base: pinned ? prev.base : state.baseTz,
    ws: state.workStart, we: state.workEnd, fmt24: state.fmt24, dur: state.duration
  });
}

/* ---------- Stock market status ---------- */
const dateKey = (y, mo, d) => y + '-' + pad(mo) + '-' + pad(d);
const dowOf = (y, mo, d) => new Date(Date.UTC(y, mo - 1, d)).getUTCDay();
function sessionsFor(m, key, dow) {
  if (dow === 0 || dow === 6 || m.holidays.includes(key)) return [];
  let s = m.sessions.map(x => x.slice());
  const early = m.early[key];
  if (early != null) s = s.map(x => [x[0], Math.min(x[1], early)]).filter(x => x[1] > x[0]);
  return s;
}
function marketState(m, now) {
  const p = partsInTz(now, m.tz);
  const key = dateKey(p.y, p.mo, p.d), dow = dowOf(p.y, p.mo, p.d);
  const minNow = p.h * 60 + p.mi + p.s / 60;
  const sess = sessionsFor(m, key, dow);
  for (let i = 0; i < sess.length; i++) {
    const a = sess[i][0], b = sess[i][1];
    if (minNow >= a && minNow < b) {
      const last = i === sess.length - 1;
      return {st: 'open', label: last ? (m.early[key] != null ? 'Early close in' : 'Closes in') : 'Lunch break in', target: zonedToUtc(p.y, p.mo, p.d, 0, b, m.tz)};
    }
    if (minNow < a) {
      const target = zonedToUtc(p.y, p.mo, p.d, 0, a, m.tz);
      return i > 0 ? {st: 'break', label: 'Reopens in', target} : {st: 'closed', label: 'Opens in', target};
    }
  }
  const why = (dow === 0 || dow === 6) ? 'Weekend, opens in' : (m.holidays.includes(key) ? 'Market holiday, opens in' : 'Opens in');
  for (let k = 1; k <= 14; k++) {
    const dt = new Date(Date.UTC(p.y, p.mo - 1, p.d + k));
    const yy = dt.getUTCFullYear(), mm = dt.getUTCMonth() + 1, dd = dt.getUTCDate(), wd = dt.getUTCDay();
    const ss = sessionsFor(m, dateKey(yy, mm, dd), wd);
    if (ss.length) return {st: 'closed', label: why, target: zonedToUtc(yy, mm, dd, 0, ss[0][0], m.tz)};
  }
  return {st: 'closed', label: 'Opens in', target: now};
}
function fmtCountdown(ms) {
  let s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400); s -= d * 86400;
  const h = Math.floor(s / 3600); s -= h * 3600;
  const m = Math.floor(s / 60); s -= m * 60;
  return (d ? d + 'd ' : '') + pad(h) + ':' + pad(m) + ':' + pad(s);
}
function renderMarkets() {
  $('#marketGrid').innerHTML = MARKETS.map(m => `
    <article class="card p-4" data-m="${m.id}">
      <div class="flex items-start justify-between gap-2">
        <div>
          <h3 class="font-display font-bold leading-tight"><a href="${ROOT}${m.slug}/" class="hover:underline">${esc(m.name)}</a></h3>
          <p class="text-xs muted mt-0.5">${m.short} / <span data-zone></span></p>
        </div>
        <span class="badge badge-closed" data-badge><span class="dot"></span><span data-badge-text>CLOSED</span></span>
      </div>
      <div class="mt-3">
        <p class="text-xs muted" data-label>&nbsp;</p>
        <p class="font-display font-bold tab-num text-2xl sm:text-3xl" data-count>--:--:--</p>
      </div>
      <dl class="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div><dt class="muted">Exchange time</dt><dd class="font-semibold tab-num" data-clock></dd></div>
        <div><dt class="muted">Hours in your time</dt><dd class="font-semibold tab-num" data-hours></dd></div>
      </dl>
    </article>`).join('');
}
function tickMarkets() {
  const now = Date.now();
  MARKETS.forEach(m => {
    const el = $('[data-m="' + m.id + '"]');
    if (!el) return;
    const s = marketState(m, now);
    const badge = $('[data-badge]', el);
    badge.className = 'badge ' + (s.st === 'open' ? 'badge-open' : s.st === 'break' ? 'badge-break' : 'badge-closed');
    $('[data-badge-text]', badge).textContent = s.st === 'open' ? 'OPEN' : s.st === 'break' ? 'LUNCH BREAK' : 'CLOSED';
    $('[data-label]', el).textContent = s.label;
    $('[data-count]', el).textContent = fmtCountdown(s.target - now);
    $('[data-zone]', el).textContent = tzAbbr(now, m.tz);
    $('[data-clock]', el).textContent = fmtHMS(now, m.tz);
    const p = partsInTz(now, m.tz);
    const first = m.sessions[0][0], last = m.sessions[m.sessions.length - 1][1];
    const st = zonedToUtc(p.y, p.mo, p.d, 0, first, m.tz), en = zonedToUtc(p.y, p.mo, p.d, 0, last, m.tz);
    const a = partsInTz(st, localTz), b = partsInTz(en, localTz);
    const dayShift = Math.round((Date.UTC(b.y, b.mo - 1, b.d) - Date.UTC(a.y, a.mo - 1, a.d)) / 864e5);
    $('[data-hours]', el).textContent = fmtClock(st, localTz) + ' to ' + fmtClock(en, localTz) + (dayShift > 0 ? ' (+1 day)' : '');
  });
}

/* ---------- Timeline ---------- */
function hourClass(h) {
  if (h >= state.workStart && h < state.workEnd) return 'c-work';
  if (h >= 22 || h < 6) return 'c-night';
  return 'c-shoulder';
}
const statusText = cls => cls === 'c-work' ? 'In working hours' : cls === 'c-night' ? 'Night time' : 'Early or late';
const statusColor = cls => cls === 'c-work' ? 'var(--open)' : cls === 'c-night' ? 'var(--night-ink)' : 'var(--break)';

function renderRows() {
  const {y, mo, d} = dateParts();
  const baseInst = [];
  for (let h = 0; h < 24; h++) baseInst.push(zonedToUtc(y, mo, d, h, 0, state.baseTz));
  $('#rows').innerHTML = state.cities.map((c, ci) => {
    const isBase = c.tz === state.baseTz;
    let cells = '', prevDay = null;
    for (let h = 0; h < 24; h++) {
      const p = partsInTz(baseInst[h], c.tz);
      const day = p.y * 10000 + p.mo * 100 + p.d;
      const newDay = prevDay !== null && day !== prevDay;
      prevDay = day;
      const lbl = state.fmt24 ? pad(p.h) : (p.h % 12 || 12);
      const sub = p.mi ? ':' + pad(p.mi) : (state.fmt24 ? '' : (p.h < 12 ? 'am' : 'pm'));
      const tip = fmtDateLong(baseInst[h], c.tz) + ', ' + fmtClock(baseInst[h], c.tz);
      cells += `<div class="cell ${hourClass(p.h)}${newDay ? ' cell-day' : ''}${h % 3 ? ' skip' : ''}" title="${esc(tip)}"><span class="cl-h">${lbl}</span><span class="cl-s">${sub}</span></div>`;
    }
    return `
    <div class="row" data-tz="${esc(c.tz)}">
      <div class="info p-3 md:p-4 flex items-start justify-between gap-3">
        <div class="min-w-0">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="font-semibold">${esc(c.name)}</span>
            ${isBase ? '<span class="tag">Base</span>' : ''}
            ${c.tz === localTz ? '<span class="tag-you">You</span>' : ''}
          </div>
          <div class="text-xs muted"><span data-abbr></span>, <span data-off></span></div>
          <div class="mt-1 text-xs flex items-center gap-1.5"><span class="dot" data-dot></span><span data-status></span></div>
          <div class="mt-2 flex gap-1.5 flex-wrap">
            ${isBase ? '' : '<button class="mini" type="button" data-act="base">' + ico('pin') + 'Set as base</button>'}
            ${ci > 0 ? '<button class="mini" type="button" data-act="up" aria-label="Move ' + esc(c.name) + ' up">' + ico('up') + 'Up</button>' : ''}
            ${ci < state.cities.length - 1 ? '<button class="mini" type="button" data-act="down" aria-label="Move ' + esc(c.name) + ' down">' + ico('down') + 'Down</button>' : ''}
            <button class="mini" type="button" data-act="remove" ${state.cities.length < 2 ? 'disabled style="opacity:.4;cursor:not-allowed"' : ''}>${ico('x')}Remove</button>
          </div>
        </div>
        <div class="text-right shrink-0">
          <div class="font-display font-bold tab-num text-2xl md:text-3xl leading-none" data-time></div>
          <div class="text-xs muted mt-1" data-date></div>
          <div class="text-xs muted" data-diff></div>
        </div>
      </div>
      <div class="strip" data-strip>${cells}<div class="cursor"></div></div>
    </div>`;
  }).join('');
  $('#axis').innerHTML = Array.from({length: 24}, (_, h) =>
    `<span class="${h % 3 ? 'skip' : ''}">${state.fmt24 ? pad(h) : (h % 12 || 12) + (h < 12 ? 'a' : 'p')}</span>`).join('');
  const bc = state.cities.find(c => c.tz === state.baseTz);
  $('#axisLabel').textContent = 'Hours in ' + (bc ? bc.name : 'base city');
  $('#sliderTicks').innerHTML = [0, 360, 720, 1080, 1439].map(m => `<span>${fmtMinutes(m)}</span>`).join('');
}

function computeOverlap() {
  const {y, mo, d} = dateParts();
  const N = state.cities.length, slots = [];
  for (let k = 0; k < 48; k++) {
    const ms = zonedToUtc(y, mo, d, 0, k * 30, state.baseTz);
    let cnt = 0;
    for (const c of state.cities) {
      const p = partsInTz(ms, c.tz), hr = p.h + p.mi / 60;
      if (hr >= state.workStart && hr < state.workEnd) cnt++;
    }
    slots.push(cnt);
  }
  const max = Math.max.apply(null, slots);
  let best = {len: 0, start: 0}, i = 0;
  while (i < 48) {
    if (slots[i] === max) { let j = i; while (j < 48 && slots[j] === max) j++; if (j - i > best.len) best = {len: j - i, start: i}; i = j; }
    else i++;
  }
  return {slots, max, N, best};
}
let overlap = null;
function renderOverlap() {
  overlap = computeOverlap();
  const {slots, max, N, best} = overlap;
  $('#ovBand').innerHTML = slots.map(c => {
    const op = c === N ? 1 : c === 0 ? 0 : (0.15 + 0.35 * (c / N));
    return `<span style="opacity:${op}"></span>`;
  }).join('');
  $('#ovCount').textContent = N + (N === 1 ? ' city' : ' cities');
  const bc = state.cities.find(c => c.tz === state.baseTz);
  const baseName = bc ? bc.name : 'base city';
  const wh = hourLabel(state.workStart) + ' to ' + hourLabel(state.workEnd);
  const range = fmtMinutes(best.start * 30) + ' to ' + fmtMinutes(((best.start + best.len) * 30) % 1440);
  const jump = $('#jumpBtn');
  let msg;
  if (N < 2) { msg = 'Add a second city to find overlapping working hours.'; jump.disabled = true; }
  else if (max === N) { msg = `All ${N} cities are inside working hours (${wh}) from ${range}, ${baseName} time.`; jump.disabled = false; }
  else if (max === 0) { msg = `On this date no city is inside working hours (${wh}). Try widening the working day.`; jump.disabled = true; }
  else { msg = `No time works for all ${N} cities. The best coverage is ${max} of ${N} cities from ${range}, ${baseName} time.`; jump.disabled = false; }
  jump.style.opacity = jump.disabled ? '.5' : '1';
  $('#ovSummary').textContent = msg;
}

/* ---------- Daylight saving watch: the #1 cause of "wrong hour" meetings ---------- */
function gapText(diffMin) {
  const a = Math.abs(diffMin), h = Math.floor(a / 60), m = a % 60;
  return h + 'h' + (m ? ' ' + m + 'm' : '');
}
function renderDst() {
  const box = $('#dstBox');
  if (!box) return;
  const now = Date.now(), DAYS = 60;
  const changes = [];
  state.cities.forEach(c => findOffsetChanges(c.tz, now, DAYS).forEach(ch => changes.push(Object.assign({name: c.name}, ch))));
  if (!changes.length) { box.hidden = true; box.innerHTML = ''; return; }
  changes.sort((a, b) => a.at - b.at);
  const items = changes.map(ch => {
    const delta = Math.round((ch.to - ch.from) / 60000);
    return `<li><strong>${esc(ch.name)}</strong> clocks go ${delta > 0 ? 'forward' : 'back'} ${gapText(delta)} on ${fmtDateLong(ch.at, ch.tz)} (${offLabel(ch.from)} to ${offLabel(ch.to)}).</li>`;
  });
  // How the gap between the base city and every other city shifts
  const base = state.cities.find(c => c.tz === state.baseTz) || state.cities[0];
  const gapItems = [];
  state.cities.forEach(c => {
    if (c.tz === base.tz) return;
    const times = changes.filter(ch => ch.tz === c.tz || ch.tz === base.tz).map(ch => ch.at);
    let prev = (tzOffsetMs(now, c.tz) - tzOffsetMs(now, base.tz)) / 60000;
    unique(times).sort((a, b) => a - b).forEach(t => {
      const g = (tzOffsetMs(t + 1000, c.tz) - tzOffsetMs(t + 1000, base.tz)) / 60000;
      if (g !== prev) {
        gapItems.push(`From ${fmtDateLong(t, base.tz)}, ${esc(c.name)} is ${g === 0 ? 'at the same time as' : gapText(g) + ' ' + (g > 0 ? 'ahead of' : 'behind')} ${esc(base.name)} (before: ${prev === 0 ? 'the same time' : gapText(prev)}). Re-check recurring meetings.`);
        prev = g;
      }
    });
  });
  box.hidden = false;
  box.innerHTML = `<div class="flex items-start gap-3">${ico('alert', 'icon dst-ic')}<div class="min-w-0">
    <h3 class="font-display font-bold">Clock changes in the next ${DAYS} days</h3>
    <ul class="mt-1 text-sm space-y-1 list-disc pl-5">${items.join('')}</ul>
    ${gapItems.length ? '<p class="mt-2 text-sm font-semibold">Effect on your meetings</p><ul class="mt-1 text-sm space-y-1 list-disc pl-5">' + gapItems.map(g => '<li>' + g + '</li>').join('') + '</ul>' : ''}
  </div></div>`;
}

function updateTimes() {
  const ms = instant();
  const bp = partsInTz(ms, state.baseTz), baseOff = tzOffsetMs(ms, state.baseTz);
  $$('#rows .row').forEach(row => {
    const tz = row.dataset.tz, p = partsInTz(ms, tz), off = tzOffsetMs(ms, tz);
    $('[data-time]', row).textContent = fmtClock(ms, tz);
    $('[data-date]', row).textContent = fmtDateLong(ms, tz);
    $('[data-abbr]', row).textContent = tzAbbr(ms, tz);
    $('[data-off]', row).textContent = offsetLabel(ms, tz);
    const dd = Math.round((Date.UTC(p.y, p.mo - 1, p.d) - Date.UTC(bp.y, bp.mo - 1, bp.d)) / 864e5);
    const diffMin = Math.round((off - baseOff) / 60000);
    const dayTxt = dd === 0 ? 'Same day' : dd > 0 ? 'Next day' : 'Previous day';
    $('[data-diff]', row).textContent = tz === state.baseTz ? 'Base time' : dayTxt + ', ' + (diffMin >= 0 ? '+' : '-') + gapText(diffMin);
    const cls = hourClass(p.h);
    $('[data-status]', row).textContent = statusText(cls);
    $('[data-dot]', row).style.color = statusColor(cls);
  });
  const pct = (state.minutes / 1440 * 100) + '%';
  $$('#timeline .cursor').forEach(c => { c.style.left = pct; });
  $('#slider').value = state.minutes;
  $('#timeInput').value = pad(Math.floor(state.minutes / 60)) + ':' + pad(state.minutes % 60);
  $('#dateInput').value = state.date;
  const bc = state.cities.find(c => c.tz === state.baseTz);
  $('#baseRead').textContent = (bc ? bc.name : '') + ' (' + tzAbbr(ms, state.baseTz) + '): ' + fmtClock(ms, state.baseTz) + ', ' + fmtDateLong(ms, state.baseTz);
  updateInvite();
  renderRecurring();
}

/* ---------- Meeting invite ---------- */
function shareLink() {
  const base = location.href.split('#')[0];
  return base + '#c=' + state.cities.map(c => c.tz).join(',') + '&b=' + state.baseTz + '&d=' + state.date +
         '&t=' + state.minutes + '&ws=' + state.workStart + '&we=' + state.workEnd + '&f=' + (state.fmt24 ? 24 : 12);
}
function buildInviteText() {
  const ms = instant();
  const title = $('#titleInput').value.trim();
  const lines = ['\uD83D\uDCC5 Proposed Meeting Time:'];
  if (title) lines.push('\uD83D\uDCCC ' + title);
  state.cities.forEach(c => lines.push('- ' + c.name + ' (' + tzAbbr(ms, c.tz) + '): ' + fmtMonthDay(ms, c.tz) + ', ' + fmtInviteTime(ms, c.tz)));
  lines.push('\u23F1 Duration: ' + (state.duration >= 60 && state.duration % 60 === 0 ? (state.duration / 60) + (state.duration === 60 ? ' hour' : ' hours') : state.duration + ' minutes'));
  if ($('#linkCheck').checked) lines.push('\uD83D\uDD17 See it in your local time: ' + shareLink());
  return lines.join('\n');
}
const icsDate = ms => new Date(ms).toISOString().replace(/[-:]|\.\d{3}/g, '');
function updateInvite() {
  const text = buildInviteText();
  $('#invitePreview').textContent = text;
  const s = instant(), e = s + state.duration * 60000, title = $('#titleInput').value.trim() || 'Meeting';
  $('#gcalBtn').href = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(title) +
    '&dates=' + icsDate(s) + '/' + icsDate(e) + '&details=' + encodeURIComponent(text);
}
function buildICS() {
  const s = instant(), e = s + state.duration * 60000, title = $('#titleInput').value.trim() || 'Meeting';
  const escI = t => t.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Global ClockSync//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
    'UID:' + Date.now() + '@global-clocksync', 'DTSTAMP:' + icsDate(Date.now()), 'DTSTART:' + icsDate(s), 'DTEND:' + icsDate(e),
    'SUMMARY:' + escI(title), 'DESCRIPTION:' + escI(buildInviteText()), 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
}
async function copyText(t) {
  try { await navigator.clipboard.writeText(t); return true; }
  catch (e) {
    const ta = document.createElement('textarea');
    ta.value = t; ta.style.cssText = 'position:fixed;opacity:0;left:-9999px';
    document.body.appendChild(ta); ta.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch (_) {}
    ta.remove(); return ok;
  }
}
let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 1800);
}

/* ---------- Render pipeline + actions ---------- */
function setLiveIcon(live) {
  const svg = $('#nowBtn svg');
  if (svg) svg.outerHTML = ico(live ? 'radio' : 'clock');
}
function renderControls() {
  const opts = (from, to) => { let s = ''; for (let h = from; h <= to; h++) s += `<option value="${h}">${hourLabel(h)}</option>`; return s; };
  $('#wsSelect').innerHTML = opts(0, 23); $('#wsSelect').value = state.workStart;
  $('#weSelect').innerHTML = opts(1, 24); $('#weSelect').value = state.workEnd;
  $('#durSelect').value = String(state.duration);
  $('#nowLabel').textContent = state.live ? 'Live' : 'Reset to now';
  setLiveIcon(state.live);
}
function renderControlsLive() {
  const want = state.live ? 'Live' : 'Reset to now';
  if ($('#nowLabel').textContent !== want) { $('#nowLabel').textContent = want; setLiveIcon(state.live); }
}
function syncFmtButton() {
  const b = $('#fmtToggle');
  b.textContent = state.fmt24 ? '24h' : '12h';
  b.setAttribute('aria-pressed', String(state.fmt24));
}
function renderAll() {
  syncFmtButton();
  if (hasPlanner) { renderControls(); renderRows(); renderOverlap(); renderDst(); renderFinderParts(); updateTimes(); }
  persist();
}
function changeBase(tz) {
  const ms = instant();
  state.baseTz = tz;
  if (state.live) nowInBase();
  else { const p = partsInTz(ms, tz); state.date = p.y + '-' + pad(p.mo) + '-' + pad(p.d); state.minutes = p.h * 60 + p.mi; }
  renderAll();
}
function addCity(c) {
  if (state.cities.some(x => x.tz === c.tz)) { toast('Already on your list'); return; }
  if (state.cities.length >= MAX_CITIES) { toast('You can compare up to ' + MAX_CITIES + ' cities'); return; }
  state.cities.push({name: c.name, tz: c.tz, cc: c.cc || ''});
  renderAll();
}
function moveCity(tz, dir) {
  const i = state.cities.findIndex(c => c.tz === tz), j = i + dir;
  if (i < 0 || j < 0 || j >= state.cities.length) return;
  const t = state.cities[i]; state.cities[i] = state.cities[j]; state.cities[j] = t;
  renderAll();
}
function removeCity(tz) {
  if (state.cities.length < 2) return;
  state.cities = state.cities.filter(c => c.tz !== tz);
  if (!state.cities.some(c => c.tz === state.baseTz)) changeBase(state.cities[0].tz); else renderAll();
}
function applyPreset(tzs) {
  const list = unique([localTz].concat(tzs)).filter(isValidTz).slice(0, MAX_CITIES);
  state.cities = list.map(cityFromTz);
  state.baseTz = localTz;
  if (state.live) nowInBase(); else changeBase(localTz);
  renderAll();
}
function resetAll() {
  const pinned = !!(CFG.cities && CFG.cities.length);
  const tzs = pinned ? CFG.cities : [localTz].concat(DEFAULT_TZS);
  state.cities = unique(tzs).filter(isValidTz).slice(0, 6).map(cityFromTz);
  state.baseTz = state.cities[0].tz; state.workStart = 9; state.workEnd = 17; state.live = true;
  nowInBase(); renderAll();
  toast('Reset to defaults');
}

/* City search: forgiving (typos, country names, abbreviations) and reusable for several boxes */
function searchCities(q, have) {
  have = have || new Set(state.cities.map(c => c.tz));
  q = q.trim();
  let res = [];
  if (!have.has(localTz) && (!q || fuzzyMatch(q, 'your time zone local my'))) { const lc = cityFromTz(localTz); res.push({name: lc.name, tz: lc.tz, cc: lc.cc, mine: true}); }
  res = res.concat(CITY_DB.filter(c => !have.has(c.tz) && c.tz !== localTz && (!q || fuzzyMatch(q, c.n + ' ' + (COUNTRY_NAMES[c.cc] || '') + ' ' + c.cc + ' ' + c.tz + ' ' + c.k)))
                   .map(c => ({name: c.n, tz: c.tz, cc: c.cc})));
  if (q && res.length < 8 && Intl.supportedValuesOf) {
    const known = new Set(CITY_DB.map(c => c.tz)), ql = q.toLowerCase();
    try {
      Intl.supportedValuesOf('timeZone').forEach(tz => {
        if (res.length < 8 && !have.has(tz) && !known.has(tz) && tz.toLowerCase().replace(/_/g, ' ').indexOf(ql) > -1)
          res.push({name: tz.split('/').pop().replace(/_/g, ' '), tz: tz, cc: ''});
      });
    } catch (e) {}
  }
  return res.slice(0, 8);
}
function makeCombo(inp, list, getHave, onPick) {
  let idx = -1;
  const show = () => {
    const items = searchCities(inp.value, getHave()), now = Date.now();
    list.innerHTML = items.length
      ? items.map(c => `<li role="option"><button type="button" class="opt" data-add="${esc(c.tz)}" data-name="${esc(c.name)}" data-cc="${esc(c.cc)}"><span>${esc(c.name)}${c.mine ? ' <span class="tag-you">Your time zone</span>' : ' <span class="muted text-xs">' + esc(c.cc ? (COUNTRY_NAMES[c.cc] || c.cc) : c.tz) + '</span>'}</span><span class="muted text-xs tab-num">${offsetLabel(now, c.tz)}</span></button></li>`).join('')
      : '<li class="px-3 py-2 text-sm muted">No match. Try a city, a country or an abbreviation like IST.</li>';
    list.hidden = false; idx = -1; inp.setAttribute('aria-expanded', 'true');
  };
  const hide = () => { list.hidden = true; inp.setAttribute('aria-expanded', 'false'); };
  const pick = el => { onPick({name: el.dataset.name, tz: el.dataset.add, cc: el.dataset.cc}); inp.value = ''; hide(); };
  inp.addEventListener('input', show);
  inp.addEventListener('focus', show);
  inp.addEventListener('keydown', e => {
    const opts = $$('.opt', list);
    if (e.key === 'ArrowDown') { e.preventDefault(); if (list.hidden) show(); idx = Math.min(opts.length - 1, idx + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); idx = Math.max(0, idx - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); const t = opts[Math.max(idx, 0)]; if (t) pick(t); return; }
    else if (e.key === 'Escape') { hide(); return; }
    else return;
    opts.forEach((o, i) => o.classList.toggle('active', i === idx));
    if (opts[idx]) opts[idx].scrollIntoView({block: 'nearest'});
  });
  list.addEventListener('click', e => { const b = e.target.closest('[data-add]'); if (b) pick(b); });
  document.addEventListener('click', e => { if (!inp.parentElement.contains(e.target)) hide(); });
}

/* ---------- Quick convert: type it the way you would say it ("3pm EST to IST, Tokyo") ---------- */
const MONTHS = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
const WDS = ['sun','mon','tue','wed','thu','fri','sat'];
function resolveZone(raw, forced) {
  const q = String(raw).trim().toLowerCase().replace(/[.,]/g, '').replace(/\s+/g, ' ');
  if (!q) return null;
  if (forced && forced[q]) return forced[q];
  if (AMBIGUOUS[q]) return {ambiguous: q};          // IST, CST, EST... mean several places: ask, do not guess
  if (q === 'local' || q === 'me' || q === 'here') return localTz;
  if (ABBR_TO_TZ[q]) return ABBR_TO_TZ[q];
  if (COUNTRY_TZ[q]) return COUNTRY_TZ[q];
  const off = /^(?:utc|gmt)\s*([+-])\s*(\d{1,2})$/.exec(q);          // UTC+5 style (whole hours)
  if (off) { const h = +off[2]; if (h === 0) return 'UTC'; if (h <= 14) { const z = 'Etc/GMT' + (off[1] === '+' ? '-' : '+') + h; return isValidTz(z) ? z : null; } }
  if (raw.indexOf('/') > -1 && isValidTz(raw.trim())) return normTz(raw.trim());
  let hit = CITY_DB.find(c => c.n.toLowerCase() === q) || CITY_DB.find(c => c.n.toLowerCase().split(' / ').indexOf(q) > -1);
  if (!hit) hit = CITY_DB.find(c => c.k.split(' ').indexOf(q) > -1);
  if (!hit && q.indexOf(' ') > -1) hit = CITY_DB.find(c => (' ' + c.k + ' ').indexOf(' ' + q + ' ') > -1);
  if (!hit && q.length >= 3) hit = CITY_DB.find(c => c.n.toLowerCase().indexOf(q) === 0);
  if (hit) return hit.tz;
  if (q.length >= 4 && Intl.supportedValuesOf) {
    try { const z = Intl.supportedValuesOf('timeZone').find(t => t.split('/').pop().toLowerCase().replace(/_/g, ' ') === q); if (z) return z; } catch (e) {}
  }
  return null;
}
function parseQuick(text, forced) {
  let s = ' ' + String(text).toLowerCase().replace(/\u2192|\u279c|=>|->/g, ' to ').replace(/[?!]/g, ' ').replace(/\s+/g, ' ') + ' ';
  const out = {date: null, rel: null, wd: null, mins: null, src: null, targets: []};
  let m;
  if ((m = /\b(\d{4})-(\d{1,2})-(\d{1,2})\b/.exec(s))) { out.date = {y: +m[1], mo: +m[2], d: +m[3]}; s = s.replace(m[0], ' '); }
  if (!out.date && (m = new RegExp('\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(' + MONTHS.join('|') + ')[a-z]*\\b').exec(s))) { out.date = {mo: MONTHS.indexOf(m[2]) + 1, d: +m[1]}; s = s.replace(m[0], ' '); }
  if (!out.date && (m = new RegExp('\\b(' + MONTHS.join('|') + ')[a-z]*\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?\\b').exec(s))) { out.date = {mo: MONTHS.indexOf(m[1]) + 1, d: +m[2]}; s = s.replace(m[0], ' '); }
  if ((m = /\b(today|tomorrow|tmrw|yesterday)\b/.exec(s))) { out.rel = m[1] === 'tmrw' ? 'tomorrow' : m[1]; s = s.replace(m[0], ' '); }
  if (!out.date && !out.rel && (m = /\b(?:next\s+)?(sunday|monday|tuesday|wednesday|thursday|friday|saturday|sun|mon|tues?|wed|thur?s?|fri|sat)\b/.exec(s))) { out.wd = WDS.indexOf(m[1].slice(0, 3)); s = s.replace(m[0], ' '); }
  // time of day
  if ((m = /\b(\d{1,2})(?:[:.](\d{2}))?\s*(a\.?m\.?|p\.?m\.?)(?=\s|$|[^a-z])/.exec(s))) {
    let h = +m[1]; const mi = +(m[2] || 0);
    if (h < 1 || h > 12 || mi > 59) return {error: 'That time does not look right. Try "3pm EST to IST".'};
    h = (h % 12) + (m[3][0] === 'p' ? 12 : 0); out.mins = h * 60 + mi; s = s.replace(m[0], ' ');
  } else if ((m = /\b(\d{1,2}):(\d{2})\b/.exec(s))) {
    const h = +m[1], mi = +m[2];
    if (h > 23 || mi > 59) return {error: 'That time does not look right. Try "14:30 London to Tokyo".'};
    out.mins = h * 60 + mi; s = s.replace(m[0], ' ');
  } else if (/\bnoon\b/.test(s)) { out.mins = 720; s = s.replace(/\bnoon\b/, ' '); }
  else if (/\bmidnight\b/.test(s)) { out.mins = 0; s = s.replace(/\bmidnight\b/, ' '); }
  else if ((m = /\bat\s+(\d{1,2})\b/.exec(s))) { if (+m[1] > 23) return {error: 'That time does not look right.'}; out.mins = +m[1] * 60; s = s.replace(m[0], ' '); }
  if (out.mins === null) return {error: 'I could not find a time. Try "3pm EST to IST" or "14:30 London to Tokyo, Sydney".'};
  s = s.replace(/\b(my time zone|my timezone|my time|local time)\b/g, ' local ').replace(/\b(convert|what|when|is|it|the|at|on|from|time|please)\b/g, ' ').replace(/\s+/g, ' ');
  const parts = (' ' + s + ' ').split(/\s(?:to|in|into|vs|versus)\s/).map(x => x.trim());
  const srcPhrase = parts[0], tgtPhrase = parts.slice(1).join(',');
  if (srcPhrase) { out.src = resolveZone(srcPhrase, forced); if (out.src && out.src.ambiguous) return {ambiguous: out.src.ambiguous}; if (!out.src) return {error: 'I do not know the place "' + srcPhrase + '". Try a city or an abbreviation like IST.'}; }
  else out.src = localTz;
  if (tgtPhrase) {
    for (const t of tgtPhrase.split(/\s*(?:,|&|\band\b)\s*|\s\+\s/).filter(Boolean)) {
      const z = resolveZone(t, forced);
      if (z && z.ambiguous) return {ambiguous: z.ambiguous};
      if (!z) return {error: 'I do not know the place "' + t.trim() + '". Try a city or an abbreviation like IST.'};
      if (out.targets.indexOf(z) < 0 && z !== out.src) out.targets.push(z);
    }
  }
  return out;
}
let nlPending = null;
function applyQuick(text, forced) {
  const msg = $('#nlMsg'), choices = $('#nlChoices');
  const r = parseQuick(text, forced);
  choices.innerHTML = ''; nlPending = null;
  if (r.ambiguous) {
    msg.style.color = '';
    msg.textContent = r.ambiguous.toUpperCase() + ' can mean more than one place. Which one do you mean?';
    choices.innerHTML = AMBIGUOUS[r.ambiguous].map(o => `<button type="button" class="chip" data-pick="${esc(r.ambiguous)}" data-tz="${esc(o[1])}">${esc(o[0])}</button>`).join('');
    nlPending = {text: text, forced: forced || {}};
    return false;
  }
  if (r.error) { msg.textContent = r.error; msg.style.color = 'var(--closed)'; return false; }
  const tzs = unique([r.src].concat(r.targets.length ? r.targets : state.cities.map(c => c.tz))).filter(isValidTz).slice(0, MAX_CITIES);
  state.cities = tzs.map(cityFromTz); state.baseTz = r.src;
  const now = Date.now(), p = partsInTz(now, r.src);
  let y = p.y, mo = p.mo, d = p.d;
  if (r.date) {
    mo = r.date.mo; d = r.date.d;
    y = r.date.y || p.y;
    if (!r.date.y && Date.UTC(y, mo - 1, d) < Date.UTC(p.y, p.mo - 1, p.d)) y += 1;
  } else if (r.rel) d += {today: 0, tomorrow: 1, yesterday: -1}[r.rel];
  else if (r.wd !== null) { const cur = new Date(Date.UTC(p.y, p.mo - 1, p.d)).getUTCDay(); let add = (r.wd - cur + 7) % 7; if (add === 0) add = 7; d += add; }
  const dt = new Date(Date.UTC(y, mo - 1, d));
  state.date = dt.getUTCFullYear() + '-' + pad(dt.getUTCMonth() + 1) + '-' + pad(dt.getUTCDate());
  const resolution = resolveZonedTime(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate(), Math.floor(r.mins / 60), r.mins % 60, r.src);
  let resolutionNote = '';
  if (resolution.status === 'gap') {
    const adjusted = resolution.adjusted;
    state.minutes = adjusted.h * 60 + adjusted.mi;
    resolutionNote = ' That local time does not exist because clocks move forward for daylight saving time, so it was moved to the next valid time (' + fmtMinutes(state.minutes) + ').';
  } else {
    state.minutes = r.mins;
    if (resolution.status === 'ambiguous') resolutionNote = ' This local time occurs twice because clocks move back; the earlier occurrence was selected (' + offsetLabel(resolution.candidates[0], r.src) + ').';
  }
  state.live = false;
  renderAll();
  const ms = instant(), sp = partsInTz(ms, r.src);
  const lines = state.cities.filter(c => c.tz !== r.src).map(c => {
    const q = partsInTz(ms, c.tz);
    const dd = Math.round((Date.UTC(q.y, q.mo - 1, q.d) - Date.UTC(sp.y, sp.mo - 1, sp.d)) / 864e5);
    return fmtClock(ms, c.tz) + (dd ? (dd > 0 ? ' (next day)' : ' (previous day)') : '') + ' in ' + c.name;
  });
  const srcCity = state.cities.find(c => c.tz === r.src);
  msg.style.color = '';
  msg.textContent = fmtClock(ms, r.src) + ' ' + tzAbbr(ms, r.src) + ' in ' + srcCity.name + (lines.length ? ' = ' + lines.join('; ') : '') + resolutionNote;
  return true;
}

/* ---------- Recurring meeting check: will the time drift after clocks change? ---------- */
function renderRecurring() {
  const box = $('#recurring');
  if (!box) return;
  const cities = state.cities;
  if (cities.length < 2) { box.hidden = true; return; }
  box.hidden = false;
  const key = cities.map(c => c.tz).join('|');
  const sel = $('#recurFixed');
  if (sel.dataset.key !== key) { sel.innerHTML = cities.map(c => `<option value="${esc(c.tz)}">${esc(c.name)}</option>`).join(''); sel.dataset.key = key; }
  const fixed = cities.some(c => c.tz === state.recurFixed) ? state.recurFixed : state.baseTz;
  sel.value = fixed;
  $('#recurEvery').value = String(state.recurEvery); $('#recurCount').value = String(state.recurCount);
  const ms0 = instant(), p0 = partsInTz(ms0, fixed);
  const rows = [];
  for (let k = 0; k < state.recurCount; k++) {
    const ms = zonedToUtc(p0.y, p0.mo, p0.d + k * state.recurEvery, p0.h, p0.mi, fixed);
    const fp = partsInTz(ms, fixed);
    rows.push({ms, fday: Date.UTC(fp.y, fp.mo - 1, fp.d), cells: cities.map(c => { const q = partsInTz(ms, c.tz); return {mins: q.h * 60 + q.mi, day: Date.UTC(q.y, q.mo - 1, q.d)}; })});
  }
  const changes = [];
  let html = '<thead><tr><th scope="col">Date (' + esc(cities.find(c => c.tz === fixed).name) + ')</th>' + cities.map(c => `<th scope="col">${esc(c.name)}</th>`).join('') + '</tr></thead><tbody>';
  rows.forEach((r, i) => {
    html += `<tr><th scope="row">${esc(fmtDateLong(r.ms, fixed))}</th>`;
    r.cells.forEach((cell, j) => {
      let cls = '', note = '';
      if (i > 0) {
        const delta = ((cell.mins - rows[i - 1].cells[j].mins + 1440 + 720) % 1440) - 720;
        if (delta !== 0) {
          cls = ' class="shift"'; note = ' <span class="day">' + (delta > 0 ? '+' : '-') + gapText(delta) + '</span>';
          changes.push(`${cities[j].name} moves ${delta < 0 ? 'earlier' : 'later'} by ${gapText(delta)} from ${fmtDateLong(r.ms, fixed)} (${fmtClock(rows[i - 1].ms, cities[j].tz)} to ${fmtClock(r.ms, cities[j].tz)}).`);
        }
      }
      const dd = Math.round((cell.day - r.fday) / 864e5);
      html += `<td${cls}>${esc(fmtClock(r.ms, cities[j].tz))}${dd ? ' <span class="day">' + (dd > 0 ? '+1d' : '-1d') + '</span>' : ''}${note}</td>`;
    });
    html += '</tr>';
  });
  $('#recurTable').innerHTML = html + '</tbody>';
  const fname = cities.find(c => c.tz === fixed).name;
  $('#recurSummary').innerHTML = changes.length
    ? '<strong>Heads up:</strong> with the meeting fixed to ' + esc(fname) + ' time, ' + changes.map(esc).join(' ')
    : 'Good news: with the meeting fixed to ' + esc(fname) + ' time, every date below keeps the same local time in every city.';
}


/* ---------- Fair Meeting Time Finder: transparent scoring, see the "How the score works" box ---------- */
const WEEKEND_CHOICES = [
  {value:'0,6', label:'Sat + Sun'}, {value:'5,6', label:'Fri + Sat'},
  {value:'6', label:'Saturday only'}, {value:'0', label:'Sunday only'}, {value:'', label:'No weekend days'}
];
function weekendLabel(days) { return WEEKEND_CHOICES.find(x => x.value === (days || []).join(','))?.label || 'Custom'; }
function finderParts() {
  return state.cities.map(c => {
    const h = state.hours[c.tz];
    const row = Array.from($('#fdParts').querySelectorAll('[data-fp]')).find(el => el.getAttribute('data-fp') === c.tz);
    const selected = row && row.querySelector('[data-weekend]');
    const weekend = selected ? selected.value.split(',').filter(Boolean).map(Number) : (WEEKEND_BY_TZ[c.tz] || [0, 6]);
    return {tz: c.tz, name: c.name, ws: h ? h[0] : state.workStart, we: h ? h[1] : state.workEnd, weekend};
  });
}
function renderFinderParts() {
  const box = $('#fdParts');
  if (!box) return;
  const opts = (from, to, sel) => { let o = ''; for (let h = from; h <= to; h++) o += `<option value="${h}"${h === sel ? ' selected' : ''}>${hourLabel(h)}</option>`; return o; };
  box.innerHTML = state.cities.map((c, i) => {
    const h = state.hours[c.tz] || [state.workStart, state.workEnd];
    const weekend = WEEKEND_BY_TZ[c.tz] || [0, 6], weekendValue = weekend.join(',');
    const weekendOptions = WEEKEND_CHOICES.map(x => `<option value="${x.value}"${x.value === weekendValue ? ' selected' : ''}>${x.label}</option>`).join('');
    return `<div class="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2" data-fp="${esc(c.tz)}">
      <span class="text-sm font-semibold truncate">${esc(c.name)} <span class="muted text-xs weekend-summary">(${esc(weekendLabel(weekend))})</span></span>
      <label class="sr-only" for="fps${i}">${esc(c.name)} working day starts</label><select id="fps${i}" class="field" data-fs>${opts(0, 23, h[0])}</select>
      <label class="sr-only" for="fpe${i}">${esc(c.name)} working day ends</label><select id="fpe${i}" class="field" data-fe>${opts(1, 24, h[1])}</select>
      <label class="sr-only" for="fpw${i}">${esc(c.name)} weekend days</label><select id="fpw${i}" class="field" style="grid-column:1 / -1" data-weekend aria-label="${esc(c.name)} weekend days">${weekendOptions}</select>
    </div>`;
  }).join('');
}
function runFinder() {
  const out = $('#fdOut');
  const dv = ($('#fdDate').value || state.date).split('-').map(Number);
  const days = +$('#fdDays').value, dur = +$('#fdDur').value, weekendsOff = $('#fdWeekend').checked;
  const parts = finderParts();
  if (parts.length < 2) { out.innerHTML = '<p class="text-sm font-semibold">Add at least two cities to find a fair time.</p>'; return; }
  const slots = rankSlots({parts: parts, baseTz: state.baseTz, y: dv[0], mo: dv[1], d: dv[2], days: days, dur: dur, weekendsOff: weekendsOff, top: 5});
  const best = slots[0];
  let html = '';
  if (best.max >= 6) html += '<p class="text-sm font-semibold" style="color:var(--closed)">No comfortable overlap in this range. Even the best options below put someone at night. Try more days, wider working hours or a shorter meeting.</p>';
  else if (best.max > 0) html += '<p class="text-sm font-semibold">No slot keeps everyone inside working hours. These options keep the worst inconvenience as small as possible.</p>';
  else html += '<p class="text-sm font-semibold">These options keep everyone inside their working hours.</p>';
  html += '<ol class="mt-3 space-y-3">' + slots.map((sl, i) => {
    const base = state.cities.find(c => c.tz === state.baseTz) || state.cities[0];
    const lines = sl.per.map(p => `<li><strong>${esc(p.name)}</strong>: ${esc(fmtDateLong(sl.start, p.tz))}, ${esc(fmtClock(sl.start, p.tz))} to ${esc(fmtClock(sl.end, p.tz))} <span class="muted">(${p.penalty === 0 ? 'inside working hours' : esc((p.weekend ? 'weekend, ' : '') + p.type)})</span></li>`).join('');
    const drift = weeklyDrift(sl, parts, state.baseTz, 8).map(h => `<li>If this repeats weekly, ${esc(h.name)}'s local time moves from ${esc(fmtMinutes(h.from))} to ${esc(fmtMinutes(h.to))} from ${esc(fmtDateLong(h.ms, state.baseTz))}.</li>`).join('');
    return `<li class="card p-3"><div class="flex flex-wrap items-start justify-between gap-2">
      <div><p class="font-semibold">Option ${i + 1}: ${esc(fmtDateLong(sl.start, base.tz))}, ${esc(fmtClock(sl.start, base.tz))} ${esc(base.name)} time</p>
      <p class="text-xs muted">${esc(fairnessLabel(sl.max))}</p></div>
      <button class="btn" type="button" data-use="${sl.start}">Use this time</button></div>
      <ul class="mt-2 text-sm space-y-1">${lines}</ul>
      <p class="text-xs muted mt-2">${esc(explainSlot(sl))}</p>
      ${drift ? '<ul class="mt-1 text-xs list-disc pl-5" style="color:var(--break)">' + drift + '</ul>' : ''}</li>`;
  }).join('') + '</ol>';
  const avg = parts.map((p, j) => esc(p.name) + ' ' + (slots.reduce((t, sl) => t + sl.per[j].penalty, 0) / slots.length).toFixed(1)).join(', ');
  html += `<p class="mt-3 text-xs muted">Average inconvenience across these options (0 is best): ${avg}. If one city is always highest, alternate who takes the awkward slot.</p>`;
  out.innerHTML = html;
}
function bindFinder() {
  if (!$('#finder')) return;
  $('#fdParts').addEventListener('change', e => {
    if (!e.target.matches('[data-weekend]')) return;
    const row = e.target.closest('[data-fp]');
    const summary = row && row.querySelector('.weekend-summary');
    if (summary) summary.textContent = '(' + (WEEKEND_CHOICES.find(x => x.value === e.target.value)?.label || 'Custom') + ')';
  });
  $('#fdDate').value = state.date;
  const fd = $('#fdDur'); if ([...fd.options].some(o => +o.value === state.duration)) fd.value = String(state.duration);
  $('#fdParts').addEventListener('change', e => {
    const row = e.target.closest('[data-fp]');
    if (!row) return;
    let a = +$('[data-fs]', row).value, b = +$('[data-fe]', row).value;
    if (b <= a) { if (e.target.hasAttribute('data-fs')) b = Math.min(24, a + 1); else a = Math.max(0, b - 1); }
    state.hours[row.dataset.fp] = [a, b];
    renderFinderParts();
  });
  $('#fdGo').addEventListener('click', runFinder);
  $('#fdOut').addEventListener('click', e => {
    const b = e.target.closest('[data-use]');
    if (!b) return;
    const ms = +b.dataset.use, p = partsInTz(ms, state.baseTz);
    state.date = p.y + '-' + pad(p.mo) + '-' + pad(p.d); state.minutes = p.h * 60 + p.mi; state.live = false;
    renderAll();
    $('#timeline').scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start'});
  });
}

/* ---------- World clock: live seconds, favourites saved only on this device, shareable link ---------- */
const WC_DEFAULT = ['America/New_York', 'Europe/London', 'America/Los_Angeles', 'America/Toronto', 'Australia/Sydney', 'Asia/Tokyo', 'Asia/Dubai', 'Asia/Singapore', 'Europe/Paris', 'Europe/Berlin', 'Asia/Kathmandu'];
let wcList = [], wcShared = false, wcTimeout = null, wcFull = false;
function wcLoad() {
  const h = parseHash();
  if (h.wc) { const l = unique(h.wc.split(',').map(x => normTz(x.trim())).filter(isValidTz)).slice(0, 24); if (l.length) { wcShared = true; return l; } }
  const saved = LS.get('cs_wc', null);
  if (saved && saved.length) return unique(saved.map(normTz).filter(isValidTz)).slice(0, 24);
  return unique([localTz].concat(WC_DEFAULT)).slice(0, 12);
}
function wcSave() { LS.set('cs_wc', wcList); }
function wcRender() {
  const grid = $('#wcGrid');
  const list = wcFull ? wcList : wcList.slice(0, 6);
  grid.innerHTML = list.map((tz, i) => {
    const c = cityFromTz(tz);
    return `<article class="card p-3" data-wc="${esc(tz)}">
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0"><h3 class="font-semibold truncate">${esc(c.name)}</h3><p class="text-xs muted truncate">${esc(c.cc ? (COUNTRY_NAMES[c.cc] || c.cc) + ', ' : '')}${esc(tz)}</p></div>
        ${wcFull ? `<div class="flex gap-1 shrink-0">${i > 0 ? `<button class="mini" type="button" data-wcact="up" aria-label="Move ${esc(c.name)} up">${ico('up')}</button>` : ''}${i < list.length - 1 ? `<button class="mini" type="button" data-wcact="down" aria-label="Move ${esc(c.name)} down">${ico('down')}</button>` : ''}<button class="mini" type="button" data-wcact="remove" aria-label="Remove ${esc(c.name)}">${ico('x')}</button></div>` : ''}
      </div>
      <p class="font-display font-bold tab-num text-3xl mt-2" data-wc-time>--:--:--</p>
      <p class="text-xs muted" data-wc-date></p>
      <p class="text-xs mt-1 flex items-center gap-1.5"><span data-wc-dn class="inline-flex items-center gap-1"></span><span class="muted" data-wc-off></span></p>
    </article>`;
  }).join('');
  wcTick(true);
}
function wcTick(force) {
  const ms = Date.now();
  $$('#wcGrid [data-wc]').forEach(el => {
    const tz = el.dataset.wc, p = partsInTz(ms, tz);
    const t = $('[data-wc-time]', el), txt = fmtHMS(ms, tz);
    if (t.textContent !== txt) t.textContent = txt;
    const dt = $('[data-wc-date]', el), dtx = fmtDateLong(ms, tz);
    if (dt.textContent !== dtx) dt.textContent = dtx;
    const dn = p.h >= 6 && p.h < 18 ? 'day' : 'night', dnEl = $('[data-wc-dn]', el);
    if (force || dnEl.dataset.v !== dn) { dnEl.dataset.v = dn; dnEl.innerHTML = ico(dn === 'day' ? 'sun' : 'moon') + (dn === 'day' ? 'Day' : 'Night'); }
    const off = $('[data-wc-off]', el), otx = ', ' + tzAbbr(ms, tz) + ', ' + offsetLabel(ms, tz);
    if (off.textContent !== otx) off.textContent = otx;
  });
}
function wcLoop() { wcTick(false); wcTimeout = setTimeout(wcLoop, 1000 - (Date.now() % 1000) + 5); }
function initWorldClock() {
  const root = $('#wc');
  if (!root) return;
  wcFull = root.dataset.mode !== 'compact';
  wcList = wcLoad();
  wcRender();
  if (wcFull) {
    const changed = () => { if (!wcShared) wcSave(); wcRender(); };
    $('#wcGrid').addEventListener('click', e => {
      const b = e.target.closest('[data-wcact]');
      if (!b) return;
      const tz = b.closest('[data-wc]').dataset.wc, i = wcList.indexOf(tz);
      if (b.dataset.wcact === 'remove') wcList.splice(i, 1);
      else { const j = i + (b.dataset.wcact === 'up' ? -1 : 1); if (j >= 0 && j < wcList.length) { const t = wcList[i]; wcList[i] = wcList[j]; wcList[j] = t; } }
      changed();
    });
    makeCombo($('#wcInput'), $('#wcList'), () => new Set(wcList), c => {
      if (wcList.indexOf(c.tz) > -1) { toast('Already on your list'); return; }
      if (wcList.length >= 24) { toast('You can keep up to 24 clocks'); return; }
      wcList.push(c.tz); changed();
    });
    $('#wcShare').addEventListener('click', async () => {
      const link = location.origin + location.pathname + '#wc=' + wcList.join(',');
      toast((await copyText(link)) ? 'Copied!' : 'Copy failed');
    });
    $('#wcReset').addEventListener('click', () => { wcList = unique([localTz].concat(WC_DEFAULT)).slice(0, 12); wcShared = false; wcSave(); $('#wcSharedBox').hidden = true; wcRender(); toast('Reset to the default list'); });
    if (wcShared) {
      $('#wcSharedBox').hidden = false;
      $('#wcKeep').addEventListener('click', () => { wcShared = false; wcSave(); $('#wcSharedBox').hidden = true; toast('Saved on this device'); });
    }
  }
  clearTimeout(wcTimeout); wcLoop();
  document.addEventListener('visibilitychange', () => { clearTimeout(wcTimeout); if (!document.hidden) wcLoop(); });   // no work while the tab is hidden
}

/* ---------- Time zone directory (search + live local times) ---------- */
let dirRows = [];
function initDirectory() {
  const tbl = $('#dirTable');
  if (!tbl) return;
  dirRows = $$('tbody tr', tbl);
  const inp = $('#dirSearch'), count = $('#dirCount');
  const filter = () => {
    let n = 0;
    dirRows.forEach(r => { const show = fuzzyMatch(inp.value, r.dataset.search); r.hidden = !show; if (show) n++; });
    count.textContent = n === dirRows.length ? dirRows.length + ' places' : n + ' of ' + dirRows.length + ' places match';
    $('#dirNone').hidden = n > 0;
  };
  inp.addEventListener('input', filter);
  filter(); dirTick();
}
function dirTick() {
  const ms = Date.now();
  dirRows.forEach(r => { if (r.hidden) return; const c = $('[data-dir-time]', r), t = fmtHMS(ms, r.dataset.tz); if (c.textContent !== t) c.textContent = t; });
}

/* ---------- "Clock changes for my cities" box on the daylight saving page ---------- */
function initDstMine() {
  const el = $('#dstMine');
  if (!el) return;
  const saved = LS.get('cs_wc', null);
  const list = unique((saved && saved.length ? saved : [localTz].concat(WC_DEFAULT)).map(normTz).filter(isValidTz)).slice(0, 14), now = Date.now(), rows = [];
  list.forEach(tz => findOffsetChanges(tz, now, 200).forEach(ch => rows.push(Object.assign({name: cityFromTz(tz).name}, ch))));
  rows.sort((a, b) => a.at - b.at);
  el.innerHTML = rows.length
    ? '<ul class="space-y-1.5 list-disc pl-5 text-sm">' + rows.map(ch => { const d = Math.round((ch.to - ch.from) / 60000); return `<li><strong>${esc(ch.name)}</strong>: clocks go ${d > 0 ? 'forward' : 'back'} ${gapText(d)} on ${esc(fmtDateLong(ch.at, ch.tz))} (${offLabel(ch.from)} to ${offLabel(ch.to)}).</li>`; }).join('') + '</ul>'
    : '<p class="text-sm">None of your saved cities change their clocks in the next 200 days.</p>';
  $('#dstMineNote').textContent = 'Based on the cities in your world clock (' + list.length + ' cities).';
}

/* ---------- Ads + consent (ads load only when allowed) ---------- */
const NEEDS_EXPLICIT_CONSENT = (/^Europe\//.test(localTz) && !/Moscow|Istanbul|Minsk|Kyiv|Volgograd|Samara|Kaliningrad|Simferopol|Astrakhan|Saratov|Ulyanovsk|Kirov/.test(localTz)) || /^Atlantic\/(Reykjavik|Azores|Madeira|Canary|Faroe)/.test(localTz);
let adsStarted = false;
function injectHTML(el, html) {
  const t = document.createElement('template');
  t.innerHTML = html;
  const nodes = Array.from(t.content.childNodes);
  (function next() {
    const n = nodes.shift();
    if (!n) return;
    if (n.nodeName === 'SCRIPT') {
      const s = document.createElement('script');
      Array.from(n.attributes).forEach(a => s.setAttribute(a.name, a.value));
      s.text = n.textContent;
      if (n.getAttribute('src')) { s.onload = s.onerror = next; el.appendChild(s); }
      else { el.appendChild(s); next(); }
    } else { el.appendChild(document.importNode(n, true)); next(); }
  })();
}
function startAds() {
  if (adsStarted) return;
  adsStarted = true;
  const cfg = window.CLOCKSYNC_ADS || {};
  const map = {top: 'top', inpage: 'inpage', global: 'global'};
  Object.keys(map).forEach(key => {
    const html = (cfg[key] || '').trim();
    if (!html) return;
    const slot = $('[data-ad="' + key + '"]');
    if (key === 'global') { injectHTML(document.body, html); return; }
    if (!slot) return;
    slot.hidden = false;
    injectHTML($('.ad-body', slot), html);
  });
}
function consentInit() {
  const consent = LS.get('cs_consent', null);
  const notice = $('#notice');
  if (consent === 'yes' || (consent !== 'no' && !NEEDS_EXPLICIT_CONSENT)) startAds();
  if (consent === null) notice.hidden = false;
  $('#consentYes').addEventListener('click', () => { LS.set('cs_consent', 'yes'); notice.hidden = true; startAds(); });
  $('#consentNo').addEventListener('click', () => { LS.set('cs_consent', 'no'); notice.hidden = true; });
  $$('[data-consent-open]').forEach(b => b.addEventListener('click', () => { notice.hidden = false; }));
}

/* ---------- Events ---------- */
function bindPlanner() {
  $('#slider').addEventListener('input', e => { state.live = false; state.minutes = +e.target.value; renderControlsLive(); updateTimes(); });
  $('#timeInput').addEventListener('input', e => {
    const m = /^(\d{1,2}):(\d{2})/.exec(e.target.value);
    if (!m) return;
    state.live = false; state.minutes = Math.min(1439, (+m[1]) * 60 + (+m[2]));
    renderControlsLive(); updateTimes();
  });
  $('#dateInput').addEventListener('change', e => { if (!e.target.value) return; state.live = false; state.date = e.target.value; renderAll(); });
  $('#nowBtn').addEventListener('click', () => { state.live = true; nowInBase(); renderAll(); });


  const nlGo = () => { const v = $('#nlInput').value.trim(); if (v) applyQuick(v, {}); };
  $('#nlChoices').addEventListener('click', e => {
    const b = e.target.closest('[data-pick]');
    if (!b || !nlPending) return;
    const f = Object.assign({}, nlPending.forced); f[b.dataset.pick] = b.dataset.tz;
    applyQuick(nlPending.text, f);
  });
  $('#nlBtn').addEventListener('click', nlGo);
  $('#nlInput').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); nlGo(); } });
  $('#nlExamples').addEventListener('click', e => { const b = e.target.closest('[data-nl]'); if (b) { $('#nlInput').value = b.dataset.nl; nlGo(); } });
  bindFinder();
  $('#recurFixed').addEventListener('change', e => { state.recurFixed = e.target.value; renderRecurring(); });
  $('#recurEvery').addEventListener('change', e => { state.recurEvery = +e.target.value; renderRecurring(); });
  $('#recurCount').addEventListener('change', e => { state.recurCount = +e.target.value; renderRecurring(); });

  const timeline = $('#timeline');
  let drag = null;
  function setFromPointer(e, st) {
    const r = st.getBoundingClientRect();
    const f = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
    state.live = false;
    state.minutes = Math.min(1435, Math.round(f * 1440 / 5) * 5);
    renderControlsLive(); updateTimes();
  }
  timeline.addEventListener('pointerdown', e => {
    const st = e.target.closest('[data-strip]');
    if (!st) return;
    drag = st;
    try { st.setPointerCapture(e.pointerId); } catch (_) {}
    setFromPointer(e, st);
  });
  timeline.addEventListener('pointermove', e => { if (drag) setFromPointer(e, drag); });
  ['pointerup', 'pointercancel'].forEach(t => timeline.addEventListener(t, () => { drag = null; }));

  $('#rows').addEventListener('click', e => {
    const b = e.target.closest('[data-act]');
    if (!b || b.disabled) return;
    const tz = b.closest('.row').dataset.tz;
    if (b.dataset.act === 'base') changeBase(tz);
    if (b.dataset.act === 'remove') removeCity(tz);
    if (b.dataset.act === 'up') moveCity(tz, -1);
    if (b.dataset.act === 'down') moveCity(tz, 1);
  });
  $('#wsSelect').addEventListener('change', e => {
    state.workStart = +e.target.value;
    if (state.workEnd <= state.workStart) state.workEnd = Math.min(24, state.workStart + 1);
    renderAll();
  });
  $('#weSelect').addEventListener('change', e => {
    state.workEnd = +e.target.value;
    if (state.workEnd <= state.workStart) state.workStart = Math.max(0, state.workEnd - 1);
    renderAll();
  });
  $('#jumpBtn').addEventListener('click', () => { if (!overlap) return; state.live = false; state.minutes = overlap.best.start * 30; renderAll(); });
  $('#sortBtn').addEventListener('click', () => {
    const ms = instant();
    state.cities.sort((a, b) => tzOffsetMs(ms, a.tz) - tzOffsetMs(ms, b.tz));
    renderAll(); toast('Sorted west to east');
  });
  $('#resetBtn').addEventListener('click', resetAll);

  const chips = $('#presetChips');
  if (chips) {
    chips.innerHTML = PRESETS.map((p, i) => `<button type="button" class="chip" data-preset="${i}">${esc(p.label)}</button>`).join('');
    chips.addEventListener('click', e => { const b = e.target.closest('[data-preset]'); if (b) applyPreset(PRESETS[+b.dataset.preset].tzs); });
  }

  makeCombo($('#cityInput'), $('#cityList'), () => new Set(state.cities.map(c => c.tz)), addCity);

  $('#titleInput').addEventListener('input', updateInvite);
  $('#linkCheck').addEventListener('change', updateInvite);
  $('#durSelect').addEventListener('change', e => { state.duration = +e.target.value; persist(); updateInvite(); });
  $('#copyBtn').addEventListener('click', async () => { toast((await copyText(buildInviteText())) ? 'Copied!' : 'Copy failed. Select the preview text instead.'); });
  $('#linkBtn').addEventListener('click', async () => { toast((await copyText(shareLink())) ? 'Copied!' : 'Copy failed'); });
  $('#icsBtn').addEventListener('click', () => {
    const blob = new Blob([buildICS()], {type: 'text/calendar;charset=utf-8'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'meeting.ics';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast('Calendar file downloaded');
  });
}
function bindGlobal() {
  $('#fmtToggle').addEventListener('click', () => { state.fmt24 = !state.fmt24; renderAll(); if (hasMarkets) tickMarkets(); });
  const themeBtn = $('#themeToggle');
  const syncThemeIcon = () => { themeBtn.innerHTML = ico(document.documentElement.classList.contains('dark') ? 'sun' : 'moon'); };
  themeBtn.addEventListener('click', () => {
    const dark = document.documentElement.classList.toggle('dark');
    try { localStorage.setItem('cs_theme', dark ? 'dark' : 'light'); } catch (e) {}
    syncThemeIcon();
  });
  syncThemeIcon();
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
  consentInit();
}

function tick() {
  if (hasMarkets) tickMarkets();
  if (dirRows.length) dirTick();
  if (hasPlanner && state.live) {
    const prevDate = state.date, prevMin = state.minutes;
    nowInBase();
    if (state.date !== prevDate) renderAll();
    else if (state.minutes !== prevMin) updateTimes();
  }
}

/* ---------- Boot ---------- */
initState();
if (hasMarkets) { renderMarkets(); tickMarkets(); }
bindGlobal();
if (hasPlanner) { bindPlanner(); }
renderAll();
initWorldClock();
initDirectory();
initDstMine();
setInterval(tick, 1000);

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', () => { navigator.serviceWorker.register(ROOT + 'sw.js').catch(() => {}); });
}

})();
