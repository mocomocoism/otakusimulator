const $ = id => document.getElementById(id);
    const yen = value => `¥${value.toLocaleString()}`;

    const OPTION_GROUPS = {
      transport: {
        target: 'transportModeGroup', dataKey: 'mode', setter: 'setTransportMode',
        className: 'h-full min-h-[78px] border border-slate-200 rounded-xl p-3 text-left transition flex items-start gap-2.5',
        items: [
          ['shinkansen', 'fa-train-subway', '新幹線優先', '本州・九州は新幹線、<br>遠距離のみ飛行機'],
          ['lcc', 'fa-plane-up', '飛行機（LCC）優先', '空港路線がある都市は<br>最安LCCを活用'],
          ['fsc', 'fa-plane', '大手航空会社優先', 'ANA・JAL等の<br>一般便を利用'],
          ['bus', 'fa-bus', '夜行・高速バス優先', '交通費を極限まで<br>抑える節約ルート']
        ]
      },
      booking: {
        target: 'bookingStyleGroup', dataKey: 'style', setter: 'setBookingStyle',
        className: 'h-full min-h-[64px] border border-slate-200 rounded-xl py-2 px-2 text-center text-xs transition flex flex-col items-center justify-center',
        items: [
          ['regular', '', '通常・単体予約', '定価・変更自由'],
          ['early', '', '早割フル活用', 'トクだ値・早特等'],
          ['pack', '', '交通＋宿パック', 'セット割 (約12%減)']
        ]
      },
      hotel: {
        target: 'hotelGradeGroup', dataKey: 'grade', setter: 'setHotelGrade',
        className: 'h-full min-h-[72px] border border-slate-200 rounded-xl p-3 text-left transition flex flex-col justify-between',
        items: [
          ['netcafe', 'fa-desktop text-slate-400', 'ネカフェ・漫画喫茶', '目安: 3,500円 / 泊'],
          ['capsule', 'fa-bed text-slate-400', 'カプセル・ドミトリー', '目安: 5,500円 / 泊'],
          ['business', 'fa-hotel theme-text', 'ビジネスホテル', '目安: 11,000円 / 泊'],
          ['resort', 'fa-spa text-amber-500', 'シティ・リゾート', '目安: 20,000円 / 泊']
        ]
      }
    };

    const CITIES = [
      { id: 'hokkaido', name: '北海道(札幌)', region: 'hokkaido' },
      { id: 'miyagi',   name: '宮城(仙台)',   region: 'tohoku' },
      { id: 'niigata',  name: '新潟',         region: 'chubu' },
      { id: 'saitama',  name: '埼玉',         region: 'kanto' },
      { id: 'chiba',    name: '千葉',         region: 'kanto' },
      { id: 'tokyo',    name: '東京',         region: 'kanto' },
      { id: 'kanagawa', name: '神奈川(横浜)', region: 'kanto' },
      { id: 'shizuoka', name: '静岡',         region: 'tokai' },
      { id: 'aichi',    name: '愛知(名古屋)', region: 'tokai' },
      { id: 'osaka',    name: '大阪',         region: 'kansai' },
      { id: 'hyogo',    name: '兵庫(神戸)',   region: 'kansai' },
      { id: 'hiroshima',name: '広島',         region: 'chugoku' },
      { id: 'fukuoka',  name: '福岡',         region: 'kyushu' }
    ];

    const CITY_MAP = Object.fromEntries(CITIES.map(city => [city.id, city]));

    const ORIGINS = {
      tokyo:     { name: '東京都',   region: 'kanto' },
      kanagawa:  { name: '神奈川県', region: 'kanto' },
      chiba:     { name: '千葉県',   region: 'kanto' },
      saitama:   { name: '埼玉県',   region: 'kanto' },
      osaka:     { name: '大阪府',   region: 'kansai' },
      aichi:     { name: '愛知県',   region: 'tokai' },
      fukuoka:   { name: '福岡県',   region: 'kyushu' },
      hokkaido:  { name: '北海道',   region: 'hokkaido' },
      miyagi:    { name: '宮城県',   region: 'tohoku' },
      hiroshima: { name: '広島県',   region: 'chugoku' }
    };

    const HOTEL_BASE = {
      netcafe:  { name: 'ネカフェ',         price: 3500 },
      capsule:  { name: 'カプセル',         price: 5500 },
      business: { name: 'ビジネスホテル',   price: 11000 },
      resort:   { name: 'シティ・リゾート', price: 20000 }
    };

    const KANTO_ROUTES = {
      hokkaido:  { shinkansen: 47000, lcc: 24000, fsc: 36000, bus: null },
      miyagi:    { shinkansen: 25000, lcc: null,  fsc: null,  bus: 9000 },
      niigata:   { shinkansen: 23000, lcc: null,  fsc: null,  bus: 8500 },
      saitama:   { local: 1800 },
      chiba:     { local: 1800 },
      tokyo:     { local: 1600 },
      kanagawa:  { local: 2000 },
      shizuoka:  { shinkansen: 14500, lcc: null,  fsc: null,  bus: 6500 },
      aichi:     { shinkansen: 24200, lcc: null,  fsc: null,  bus: 10000 },
      osaka:     { shinkansen: 31200, lcc: 19000, fsc: 29000, bus: 13000 },
      hyogo:     { shinkansen: 32400, lcc: 20000, fsc: 28000, bus: 13500 },
      hiroshima: { shinkansen: 40000, lcc: 23000, fsc: 33000, bus: 16000 },
      fukuoka:   { shinkansen: 48000, lcc: 26000, fsc: 38000, bus: 22000 }
    };

    const KANSAI_ROUTES = {
      hokkaido:  { shinkansen: null,  lcc: 25000, fsc: 38000, bus: null },
      miyagi:    { shinkansen: 44000, lcc: 22000, fsc: 32000, bus: 17000 },
      niigata:   { shinkansen: 36000, lcc: 21000, fsc: 30000, bus: 14000 },
      saitama:   { shinkansen: 31800, lcc: 20000, fsc: 29500, bus: 13000 },
      chiba:     { shinkansen: 32200, lcc: 19500, fsc: 29500, bus: 13500 },
      tokyo:     { shinkansen: 31200, lcc: 19500, fsc: 29000, bus: 13000 },
      kanagawa:  { shinkansen: 30600, lcc: 20000, fsc: 29000, bus: 12500 },
      shizuoka:  { shinkansen: 21500, lcc: null,  fsc: null,  bus: 8500 },
      aichi:     { shinkansen: 14200, lcc: null,  fsc: null,  bus: 6000 },
      osaka:     { local: 1200 },
      hyogo:     { local: 1800 },
      hiroshima: { shinkansen: 22800, lcc: null,  fsc: null,  bus: 9000 },
      fukuoka:   { shinkansen: 32800, lcc: 16500, fsc: 26000, bus: 12000 }
    };

    const DRINK_FEE_UNIT = 600;

    const createInitialState = () => ({
      origin: 'tokyo', selectedCities: new Set(), transportMode: '', bookingStyle: '',
      enableStay: false, includeDrink: false, enableSaving: false, hotelGrade: '',
      themeColor: '#8b5cf6', themeLight: '#f3e8ff', overrides: {}
    });
    let state = createInitialState();

    let barChart = null;
    let pieChart = null;


    function bindStaticEvents() {
      $('resetButton')?.addEventListener('click', resetAll);
      $('openSummaryButton')?.addEventListener('click', openSummaryModal);
      $('copyShareTextButton')?.addEventListener('click', copyShareText);
      $('copyShareUrlButton')?.addEventListener('click', copyShareUrl);
      $('summaryCloseButton')?.addEventListener('click', closeSummaryModal);
      $('shareOnXButton')?.addEventListener('click', shareOnX);
      $('downloadCardImageButton')?.addEventListener('click', downloadCardImage);
      $('modalCopyShareTextButton')?.addEventListener('click', copyShareText);
      $('resetCityOverridesButton')?.addEventListener('click', resetCityOverrides);

      document.querySelectorAll('[data-theme-color][data-theme-light]').forEach(button => {
        button.addEventListener('click', () => setTheme(button.dataset.themeColor, button.dataset.themeLight));
      });
      document.querySelectorAll('[data-preset]').forEach(button => {
        button.addEventListener('click', () => selectPreset(button.dataset.preset));
      });

      $('originSelect')?.addEventListener('change', onOriginChange);
      $('drinkFeeToggle')?.addEventListener('change', onDrinkToggle);
      $('enableStayToggle')?.addEventListener('change', toggleAllStays);
      $('enableSavingToggle')?.addEventListener('change', onSavingToggle);
      $('savingMonths')?.addEventListener('change', scheduleRecalc);

      ['tourTitle', 'ticketPrice', 'hotelOffset', 'goodsBudget', 'foodPerTrip'].forEach(id => {
        $(id)?.addEventListener('input', scheduleRecalc);
      });

      $('cityTableBody')?.addEventListener('change', event => {
        const control = event.target.closest('[data-override-field][data-city-id]');
        if (!control) return;
        const field = control.dataset.overrideField;
        const value = field === 'peak'
          ? control.checked
          : (['ticketPrice', 'shows', 'nights'].includes(field) ? Number(control.value) : control.value);
        updateOverride(control.dataset.cityId, field, value);
      });
    }

    window.addEventListener('DOMContentLoaded', () => {
      bindStaticEvents();
      renderOptionGroups();
      loadFromUrlParams();
      renderCityGrid();
      recalc();
    });

    function resetAll() {
      state = createInitialState();
      setTheme('#8b5cf6', '#f3e8ff');
      $('tourTitle').value = '';
      $('originSelect').value = 'tokyo';
      $('ticketPrice').value = '10000';
      $('drinkFeeToggle').checked = false;
      $('enableStayToggle').checked = false;
      $('enableSavingToggle').checked = false;
      $('savingSection').classList.add('hidden');
      $('hotelOffset').value = 0;
      $('goodsBudget').value = '';
      $('foodPerTrip').value = '';
      $('savingMonths').value = '6';

      document.querySelectorAll('.option-card').forEach(el => el.classList.remove('active'));
      $('hotelGradeSection').classList.add('opacity-40', 'pointer-events-none');

      if (window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      renderCityGrid();
      recalc();
      showToast('すべての項目をリセットしました');
    }

    function setTheme(color, light, recalculate = true) {
      state.themeColor = color;
      state.themeLight = light;
      document.documentElement.style.setProperty('--theme-color', color);
      document.documentElement.style.setProperty('--theme-light', light);
      document.documentElement.style.backgroundColor = color;

      // iPad Safari等のURLバー（theme-color）を確実に更新するためのメタタグ再生成処理
      const oldMeta = $('metaThemeColor');
      if (oldMeta) oldMeta.remove();
      const newMeta = document.createElement('meta');
      newMeta.name = 'theme-color';
      newMeta.content = color;
      newMeta.id = 'metaThemeColor';
      document.head.appendChild(newMeta);

      // 棒グラフはテーマ変更時に一度破棄して再生成する。
      // Chart.js の内部スタイルキャッシュに左右されず、2回目以降も確実に色を反映できる。
      if (barChart) {
        barChart.destroy();
        barChart = null;
      }

      // URL復元中は全設定の読み込み完了後に一度だけ recalc() する。
      if (recalculate) recalc();
    }

    function renderOptionGroups() {
      Object.values(OPTION_GROUPS).forEach(group => {
        $(group.target).innerHTML = group.items.map(([value, icon, title, desc]) => {
          const iconHtml = icon ? `<i class="fa-solid ${icon} text-xs mt-0.5 shrink-0"></i>` : '';
          const body = group.dataKey === 'grade'
            ? `<div class="flex items-start gap-1.5">${iconHtml}<span class="text-xs font-bold text-slate-800 leading-snug">${title}</span></div><div class="text-[11px] text-slate-500 mt-1">${desc}</div>`
            : `${iconHtml}<div class="${group.dataKey === 'mode' ? 'flex flex-col justify-between h-full' : ''}"><div class="font-bold text-slate-800 leading-tight">${title}</div><div class="text-[${group.dataKey === 'mode' ? '11' : '10'}px] text-slate-500 leading-tight mt-1">${desc}</div></div>`;
          return `<button type="button" data-${group.dataKey}="${value}" class="option-card ${group.className}">${body}</button>`;
        }).join('');

        const container = $(group.target);
        container.querySelectorAll('.option-card').forEach(button => {
          button.addEventListener('click', () => {
            const value = button.dataset[group.dataKey];
            if (group.dataKey === 'mode') setTransportMode(value);
            if (group.dataKey === 'style') setBookingStyle(value);
            if (group.dataKey === 'grade') setHotelGrade(value);
          });
        });
      });
    }

    function renderCityGrid() {
      const grid = $('cityGrid');
      grid.innerHTML = '';
      CITIES.forEach(c => {
        const active = state.selectedCities.has(c.id);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'city-chip border border-slate-200 rounded-xl py-2 px-2 text-xs font-bold transition flex items-center justify-between ' + (active ? 'active' : 'bg-slate-50 text-slate-600 hover:bg-slate-100');

        const span = document.createElement('span');
        span.textContent = c.name;

        const icon = document.createElement('i');
        icon.className = 'fa-solid ' + (active ? 'fa-check' : 'fa-plus text-slate-400') + ' text-[10px]';

        btn.appendChild(span);
        btn.appendChild(icon);
        btn.onclick = () => toggleCity(c.id);
        grid.appendChild(btn);
      });
    }

    function toggleCity(cityId) {
      if (state.selectedCities.has(cityId)) {
        state.selectedCities.delete(cityId);
      } else {
        state.selectedCities.add(cityId);
      }
      renderCityGrid();
      recalc();
    }

    function selectPreset(type) {
      if (type === '5dome') {
        state.selectedCities = new Set(['hokkaido', 'tokyo', 'aichi', 'osaka', 'fukuoka']);
      } else if (type === '8city') {
        state.selectedCities = new Set(['hokkaido', 'miyagi', 'saitama', 'tokyo', 'kanagawa', 'aichi', 'osaka', 'fukuoka']);
      } else if (type === 'clear') {
        state.selectedCities = new Set();
      }
      renderCityGrid();
      recalc();
    }

    function onOriginChange() {
      state.origin = $('originSelect').value;
      Object.keys(state.overrides).forEach(k => {
        delete state.overrides[k].nights;
        delete state.overrides[k].mode;
      });
      recalc();
    }

    function onDrinkToggle() {
      state.includeDrink = $('drinkFeeToggle').checked;
      recalc();
    }

    function onSavingToggle() {
      state.enableSaving = $('enableSavingToggle').checked;
      $('savingSection').classList.toggle('hidden', !state.enableSaving);
      recalc();
    }

    function selectOption(groupId, dataKey, stateKey, value) {
      state[stateKey] = value;
      document.querySelectorAll(`#${groupId} .option-card`).forEach(el =>
        el.classList.toggle('active', el.dataset[dataKey] === value)
      );
      recalc();
    }

    function setTransportMode(mode) {
      Object.keys(state.overrides).forEach(k => delete state.overrides[k].mode);
      selectOption('transportModeGroup', 'mode', 'transportMode', mode);
    }
    const setBookingStyle = style => selectOption('bookingStyleGroup', 'style', 'bookingStyle', style);

    function toggleAllStays() {
      state.enableStay = $('enableStayToggle').checked;
      $('hotelGradeSection').classList.toggle('opacity-40', !state.enableStay);
      $('hotelGradeSection').classList.toggle('pointer-events-none', !state.enableStay);
      if (state.enableStay && !state.hotelGrade) setHotelGrade('business');
      Object.keys(state.overrides).forEach(k => delete state.overrides[k].nights);
      recalc();
    }

    const setHotelGrade = grade => selectOption('hotelGradeGroup', 'grade', 'hotelGrade', grade);

    function resetCityOverrides() {
      state.overrides = {};
      recalc();
    }

    function getRouteOptionsForCity(originId, destId) {
      if (!originId || !ORIGINS[originId]) {
        return { isLocal: false, options: { shinkansen: 0, lcc: 0, fsc: 0, bus: 0 } };
      }

      const originObj = ORIGINS[originId];
      const destObj = CITY_MAP[destId];

      if (originId === destId) {
        return { isLocal: true, options: { local: 1200 } };
      }
      if (originObj.region === 'kanto' && destObj.region === 'kanto') {
        const base = KANTO_ROUTES[destId]?.local || 2000;
        return { isLocal: true, options: { local: base } };
      }
      if (originObj.region === 'kansai' && destObj.region === 'kansai') {
        return { isLocal: true, options: { local: 1800 } };
      }

      if (originObj.region === 'kanto') {
        return { isLocal: false, options: { ...KANTO_ROUTES[destId] } };
      }

      if (originObj.region === 'kansai') {
        return { isLocal: false, options: { ...KANSAI_ROUTES[destId] } };
      }

      return computeRegionalRoute(originId, destId);
    }

    const REGIONAL_ROUTES = {
      aichi: {
        dest: { shizuoka: { shinkansen: 13000, bus: 5500 }, hiroshima: { shinkansen: 28000, bus: 12000 }, miyagi: { shinkansen: 42000, lcc: 22000, fsc: 32000, bus: 16000 }, fukuoka: { shinkansen: 38000, lcc: 20000, fsc: 30000, bus: 15000 }, hokkaido: { lcc: 24000, fsc: 36000 } },
        region: { kansai: { shinkansen: 14500, bus: 6000 }, kanto: { shinkansen: 24200, bus: 10000 } }
      },
      fukuoka: {
        dest: { hiroshima: { shinkansen: 19000, bus: 8000 } },
        region: { kansai: { shinkansen: 32800, lcc: 16500, fsc: 26000, bus: 12000 }, tokai: { shinkansen: 38000, lcc: 20000, fsc: 30000, bus: 15000 }, kanto: { shinkansen: 48000, lcc: 25000, fsc: 38000, bus: 22000 } },
        fallback: { lcc: 28000, fsc: 42000 }
      },
      hokkaido: { dest: { miyagi: { shinkansen: 42000, lcc: 19000, fsc: 29000 } }, region: { kanto: { shinkansen: 47000, lcc: 24000, fsc: 36000 } }, fallback: { lcc: 27000, fsc: 40000 } },
      miyagi: { dest: { hokkaido: { shinkansen: 42000, lcc: 19000, fsc: 29000 } }, region: { kanto: { shinkansen: 25000, bus: 9000 }, kansai: { shinkansen: 44000, lcc: 22000, fsc: 32000, bus: 17000 } }, fallback: { shinkansen: 38000, fsc: 34000, bus: 15000 } }
    };
    const DEFAULT_REGIONAL_ROUTE = { shinkansen: 32000, lcc: 22000, fsc: 33000, bus: 13000 };
    const MODE_PRIORITY = {
      lcc: ['lcc', 'shinkansen', 'fsc'],
      fsc: ['fsc', 'shinkansen', 'lcc'],
      bus: ['bus', 'lcc', 'shinkansen']
    };

    function computeRegionalRoute(originId, destId) {
      const rule = REGIONAL_ROUTES[originId];
      const region = CITY_MAP[destId]?.region;
      return { isLocal: false, options: rule?.dest?.[destId] || rule?.region?.[region] || rule?.fallback || DEFAULT_REGIONAL_ROUTE };
    }

    function pickBestMode(options, preferredMode, isLocal) {
      if (isLocal) return 'local';
      const pref = preferredMode || 'shinkansen';
      if (pref === 'shinkansen') {
        if (options.shinkansen && options.shinkansen <= 45000) return 'shinkansen';
        return ['fsc', 'lcc', 'shinkansen'].find(m => options[m]);
      }
      return (MODE_PRIORITY[pref] || Object.keys(options)).find(m => options[m] != null);
    }

    const MODE_LABELS = {
      local: '在来線(日帰り)',
      shinkansen: '新幹線(指定席)',
      lcc: '飛行機(LCC)',
      fsc: '飛行機(大手)',
      bus: '夜行/高速バス'
    };

    function debounce(fn, wait = 180) {
      let timer = null;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), wait);
      };
    }

    const scheduleRecalc = debounce(recalc, 180);

    function safeNumber(value, { min = 0, max = Number.MAX_SAFE_INTEGER, fallback = 0, integer = false } = {}) {
      const n = Number(value);
      if (!Number.isFinite(n)) return fallback;
      const normalized = integer ? Math.round(n) : n;
      return Math.min(max, Math.max(min, normalized));
    }

    const safeMoney = value => safeNumber(value, { min: 0, max: 100000000, fallback: 0, integer: true });

    function calculateTotals() {
      const warningVisible = !state.origin && state.selectedCities.size > 0;

      const baseTicketUnit = safeMoney($('ticketPrice').value);
      const drinkUnit = state.includeDrink ? DRINK_FEE_UNIT : 0;
      const hotelOffset = safeNumber($('hotelOffset').value, { min: -3000, max: 8000, fallback: 0, integer: true });
      const goodsBudget = safeMoney($('goodsBudget').value);
      const foodPerTrip = safeMoney($('foodPerTrip').value);
      const savingMonths = safeNumber($('savingMonths').value, { min: 1, max: 120, fallback: 6, integer: true });
      const tourTitle = $('tourTitle').value.trim() || '推し活 遠征プラン';

      const gradeKey = state.hotelGrade || 'business';
      const baseHotelRate = Math.max(1500, HOTEL_BASE[gradeKey].price + hotelOffset);
      const activeStyle = state.bookingStyle || 'regular';

      let totalTransport = 0;
      let totalHotel = 0;
      let totalTickets = 0;
      let totalShows = 0;
      let totalNights = 0;
      const rowsData = [];

      CITIES.forEach(city => {
        if (!state.selectedCities.has(city.id)) return;

        const routeInfo = getRouteOptionsForCity(state.origin, city.id);
        const ov = state.overrides[city.id] || {};
        const availableModes = Object.keys(routeInfo.options).filter(k => routeInfo.options[k] != null);
        const chosenMode = (ov.mode && availableModes.includes(ov.mode))
          ? ov.mode
          : pickBestMode(routeInfo.options, state.transportMode, routeInfo.isLocal);

        const defaultNights = routeInfo.isLocal ? 0 : (state.enableStay ? (chosenMode === 'bus' ? 0 : 1) : 0);
        const nights = (ov.nights !== undefined) ? safeNumber(ov.nights, { min: 0, max: 3, fallback: defaultNights, integer: true }) : defaultNights;
        const shows = (ov.shows !== undefined) ? safeNumber(ov.shows, { min: 1, max: 4, fallback: 1, integer: true }) : 1;
        const cityTicketUnit = (ov.ticketPrice !== undefined) ? safeMoney(ov.ticketPrice) : baseTicketUnit;
        const effectiveCityTicketUnit = cityTicketUnit + drinkUnit;
        const isPeak = !!ov.peak;

        let transportCost = state.origin ? (routeInfo.options[chosenMode] || 0) : 0;
        if (state.origin && !routeInfo.isLocal) {
          if (activeStyle === 'early') {
            if (chosenMode === 'shinkansen') transportCost = Math.round(transportCost * 0.87);
            if (chosenMode === 'lcc') transportCost = Math.round(transportCost * 0.82);
            if (chosenMode === 'fsc') transportCost = Math.round(transportCost * 0.78);
          } else if (activeStyle === 'pack' && nights > 0) {
            transportCost = Math.round(transportCost * 0.88);
          }
          if (isPeak) {
            if (chosenMode === 'shinkansen') transportCost += 1200;
            if (chosenMode === 'lcc' || chosenMode === 'fsc') transportCost = Math.round(transportCost * 1.45);
            if (chosenMode === 'bus') transportCost = Math.round(transportCost * 1.3);
          }
        }

        let cityHotelUnit = baseHotelRate;
        if (city.id === 'tokyo' || city.id === 'osaka' || city.id === 'fukuoka') cityHotelUnit += 1000;
        if (activeStyle === 'early') {
          cityHotelUnit = Math.round(cityHotelUnit * 0.9);
        } else if (activeStyle === 'pack') {
          cityHotelUnit = Math.round(cityHotelUnit * 0.88);
        }
        if (isPeak) cityHotelUnit = Math.round(cityHotelUnit * 1.5);

        const hotelCost = nights * cityHotelUnit;
        const ticketCost = shows * effectiveCityTicketUnit;
        const subtotal = transportCost + hotelCost + ticketCost;

        totalTransport += transportCost;
        totalHotel += hotelCost;
        totalTickets += ticketCost;
        totalShows += shows;
        totalNights += nights;

        rowsData.push({
          city,
          availableModes,
          chosenMode,
          shows,
          nights,
          cityTicketUnit,
          effectiveCityTicketUnit,
          isPeak,
          transportCost,
          hotelCost,
          ticketCost,
          subtotal
        });
      });

      const cityCount = rowsData.length;
      const citySubtotalSum = totalTransport + totalHotel + totalTickets;
      const totalFood = foodPerTrip * cityCount;
      const totalExtra = goodsBudget + totalFood;
      const grandTotal = citySubtotalSum + totalExtra;
      const monthlySaving = Math.ceil(grandTotal / savingMonths);
      const dailySaving = Math.ceil(grandTotal / (savingMonths * 30));
      const originLabel = state.origin ? ORIGINS[state.origin].name + '発' : '出発地未選択';

      return {
        warningVisible,
        hotelOffset,
        tourTitle,
        savingMonths,
        rowsData,
        cityCount,
        citySubtotalSum,
        totalTransport,
        totalHotel,
        totalTickets,
        totalShows,
        totalNights,
        goodsBudget,
        foodPerTrip,
        totalExtra,
        grandTotal,
        monthlySaving,
        dailySaving,
        originLabel
      };
    }

    function renderTotals(data) {
      $('originWarningAlert').classList.toggle('hidden', !data.warningVisible);
      $('hotelOffsetLabel').textContent = (data.hotelOffset >= 0 ? '+' + data.hotelOffset.toLocaleString() + '円' : data.hotelOffset.toLocaleString() + '円');
      $('displayTourTitle').textContent = data.tourTitle;

      $('summaryBadge').textContent = data.cityCount > 0
        ? data.originLabel + '・全' + data.cityCount + '都市・' + data.totalShows + '公演・計' + data.totalNights + '泊'
        : data.originLabel + '・参戦都市を選択してください';

      const conditionItems = [
        state.transportMode ? MODE_LABELS[state.transportMode] : '移動手段：自動',
        state.bookingStyle === 'early' ? '早割活用' : state.bookingStyle === 'pack' ? '交通＋宿パック' : '通常予約',
        state.enableStay ? (state.hotelGrade ? HOTEL_BASE[state.hotelGrade].name : '宿泊あり') : '宿泊なし'
      ];
      if (state.includeDrink) conditionItems.push('ワンドリンク代込');
      $('conditionSummary').innerHTML = conditionItems.map(item =>
        '<span class="bg-slate-100 text-slate-600 px-2 py-1 rounded-full whitespace-nowrap">' + item + '</span>'
      ).join('');

      $('grandTotalDisplay').textContent = yen(data.grandTotal);
      $('transportTotalDisplay').textContent = yen(data.totalTransport);
      $('hotelTotalDisplay').textContent = yen(data.totalHotel);
      $('hotelSubDisplay').textContent = state.hotelGrade
        ? '計' + data.totalNights + '泊 (' + HOTEL_BASE[state.hotelGrade].name + ')'
        : '計' + data.totalNights + '泊';
      $('ticketTotalDisplay').textContent = yen(data.totalTickets);
      $('ticketSubDisplay').textContent = state.includeDrink
        ? '計' + data.totalShows + '公演 (D代¥600込)'
        : '計' + data.totalShows + '公演';
      $('extraTotalDisplay').textContent = yen(data.totalExtra);
      $('extraSubDisplay').textContent = `グッズ ${yen(data.goodsBudget)} / 食費他 ${yen(data.foodPerTrip * data.cityCount)}`;
      $('monthlySavingDisplay').textContent = yen(data.monthlySaving) + ' / 月';
      $('dailySavingDisplay').textContent = '（1日約¥' + data.dailySaving.toLocaleString() + '）';

      renderTable(data);
      updateCharts(data);
      updateModalContent(data);
    }

    function recalc() {
      renderTotals(calculateTotals());
    }

    function renderTable(data) {
      const { rowsData, totalTransport, totalHotel, totalTickets, citySubtotalSum, goodsBudget, foodPerTrip, cityCount, totalExtra, grandTotal } = data;
      const tbody = $('cityTableBody');
      const summaryArea = $('tableSummaryArea');
      tbody.innerHTML = '';

      if (rowsData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="py-8 text-center text-slate-400">参戦する公演都市を選択すると、ここに都市別の明細が表示されます</td></tr>';
        summaryArea.classList.add('hidden');
        return;
      }

      summaryArea.classList.remove('hidden');

      rowsData.forEach(r => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50/80 transition';

        const modeOptionsHtml = r.availableModes.map(m =>
          '<option value="' + m + '" ' + (m === r.chosenMode ? 'selected' : '') + '>' + MODE_LABELS[m] + '</option>'
        ).join('');

        const showsOptionsHtml = [1, 2, 3, 4].map(n =>
          '<option value="' + n + '" ' + (n === r.shows ? 'selected' : '') + '>' + n + '公演</option>'
        ).join('');

        const nightsOptionsHtml = [0, 1, 2, 3].map(n =>
          '<option value="' + n + '" ' + (n === r.nights ? 'selected' : '') + '>' + (n === 0 ? '日帰り' : n + '泊') + '</option>'
        ).join('');

        tr.innerHTML =
          '<td class="py-2.5 px-3 font-bold text-slate-800 whitespace-nowrap sticky-col shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">' + r.city.name + '</td>' +
          '<td class="py-2.5 px-2 text-center">' +
            '<input type="number" value="' + r.cityTicketUnit + '" step="500" min="0" data-city-id="' + r.city.id + '" data-override-field="ticketPrice" class="w-20 border border-slate-200 rounded px-1.5 py-1 text-xs text-right bg-white">' +
          '</td>' +
          '<td class="py-2.5 px-2">' +
            '<select data-city-id="' + r.city.id + '" data-override-field="mode" class="border border-slate-200 rounded px-1.5 py-1 text-xs bg-white">' +
              modeOptionsHtml +
            '</select>' +
          '</td>' +
          '<td class="py-2.5 px-2 text-center">' +
            '<select data-city-id="' + r.city.id + '" data-override-field="shows" class="border border-slate-200 rounded px-1.5 py-1 text-xs bg-white">' +
              showsOptionsHtml +
            '</select>' +
          '</td>' +
          '<td class="py-2.5 px-2 text-center">' +
            '<select data-city-id="' + r.city.id + '" data-override-field="nights" class="border border-slate-200 rounded px-1.5 py-1 text-xs bg-white">' +
              nightsOptionsHtml +
            '</select>' +
          '</td>' +
          '<td class="py-2.5 px-2 text-center">' +
            '<input type="checkbox" ' + (r.isPeak ? 'checked' : '') + ' data-city-id="' + r.city.id + '" data-override-field="peak" class="w-4 h-4 rounded cursor-pointer accent-amber-500">' +
          '</td>' +
          '<td class="py-2.5 px-2.5 text-right font-semibold text-pink-600 whitespace-nowrap">¥' + r.ticketCost.toLocaleString() + '</td>' +
          '<td class="py-2.5 px-2.5 text-right font-semibold text-blue-600 whitespace-nowrap">¥' + r.transportCost.toLocaleString() + '</td>' +
          '<td class="py-2.5 px-2.5 text-right font-semibold text-amber-600 whitespace-nowrap">¥' + r.hotelCost.toLocaleString() + '</td>' +
          '<td class="py-2.5 px-3 text-right whitespace-nowrap"><span class="inline-block theme-light-bg theme-text font-black px-2 py-1 rounded-lg">¥' + r.subtotal.toLocaleString() + '</span></td>';

        tbody.appendChild(tr);
      });

      // 集計サマリーエリアへの値反映
      $('footTicketSum').textContent = yen(totalTickets);
      $('footTransportSum').textContent = yen(totalTransport);
      $('footHotelSum').textContent = yen(totalHotel);
      $('footCitySubtotal').textContent = yen(citySubtotalSum);

      $('footExtraDetail').textContent =
        '（グッズ代 ¥' + goodsBudget.toLocaleString() + ' ＋ 食費・雑費 ¥' + foodPerTrip.toLocaleString() + ' × ' + cityCount + '都市）';
      $('footExtraSum').textContent = yen(totalExtra);
      $('footGrandTotal').textContent = yen(grandTotal);
    }

    function updateOverride(cityId, key, val) {
      if (!state.overrides[cityId]) state.overrides[cityId] = {};
      if (key === 'ticketPrice') val = safeMoney(val);
      if (key === 'shows') val = safeNumber(val, { min: 1, max: 4, fallback: 1, integer: true });
      if (key === 'nights') val = safeNumber(val, { min: 0, max: 3, fallback: 0, integer: true });
      if (key === 'peak') val = !!val;
      state.overrides[cityId][key] = val;
      recalc();
    }

    function updateCharts(data) {
      const { rowsData, totalTransport, totalHotel, totalTickets, totalExtra } = data;
      const emptyEl = $('chartEmptyState');
      const containerEl = $('chartContainer');

      if (rowsData.length === 0) {
        emptyEl.classList.remove('hidden');
        containerEl.classList.add('hidden');
        containerEl.classList.remove('grid');
        return;
      }

      emptyEl.classList.add('hidden');
      containerEl.classList.remove('hidden');
      containerEl.classList.add('grid');

      const labels = rowsData.map(r => r.city.name.replace(/\(.*\)/, ''));
      const transportData = rowsData.map(r => r.transportCost);
      const hotelData = rowsData.map(r => r.hotelCost);
      const ticketData = rowsData.map(r => r.ticketCost);

      const ctxBar = $('cityBarChart').getContext('2d');
      if (!barChart) {
        barChart = new Chart(ctxBar, {
          type: 'bar',
          data: {
            labels,
            datasets: [
              { label: '交通費', data: transportData, backgroundColor: '#3b5ccc', borderRadius: 4 },
              { label: '宿泊費', data: hotelData, backgroundColor: '#f59e0b', borderRadius: 4 },
              { label: 'チケット代', data: ticketData, backgroundColor: state.themeColor, borderRadius: 4 }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: { stacked: true, grid: { display: false } },
              y: {
                stacked: true,
                ticks: { callback: v => '¥' + (v / 1000) + 'k' }
              }
            },
            plugins: {
              legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } },
              tooltip: {
                callbacks: {
                  label: ctx => ctx.dataset.label + ': ¥' + ctx.parsed.y.toLocaleString()
                }
              }
            }
          }
        });
      } else {
        barChart.data.labels = labels;
        barChart.data.datasets[0].data = transportData;
        barChart.data.datasets[1].data = hotelData;
        barChart.data.datasets[2].data = ticketData;
        barChart.data.datasets[2].backgroundColor = state.themeColor;
        barChart.update('none');
      }

      const ctxPie = $('costPieChart').getContext('2d');
      if (!pieChart) {
        pieChart = new Chart(ctxPie, {
          type: 'doughnut',
          data: {
            labels: ['交通費', '宿泊費', 'チケット代', 'グッズ・他'],
            datasets: [{
              data: [totalTransport, totalHotel, totalTickets, totalExtra],
              backgroundColor: ['#3b5ccc', '#f59e0b', state.themeColor, '#10b981'],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '62%',
            plugins: {
              legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } },
              title: { display: true, text: '費目別内訳', font: { size: 11 } },
              tooltip: {
                callbacks: {
                  label: ctx => yen(ctx.parsed)
                }
              }
            }
          }
        });
      } else {
        pieChart.data.datasets[0].data = [totalTransport, totalHotel, totalTickets, totalExtra];
        pieChart.data.datasets[0].backgroundColor = ['#3b5ccc', '#f59e0b', state.themeColor, '#10b981'];
        pieChart.update('none');
      }
    }

    function updateModalContent(data) {
      const { tourTitle: title, originLabel, cityCount, totalShows, totalNights, grandTotal, totalTransport: transport, totalHotel: hotel, savingMonths, monthlySaving, rowsData } = data;
      const ticketOther = data.totalTickets + data.totalExtra;
      $('modalTourTitle').textContent = title;
      $('modalOriginLine').textContent = originLabel;
      $('modalStatsLine').textContent = cityCount > 0
        ? '全' + cityCount + '都市・' + totalShows + '公演・計' + totalNights + '泊'
        : '都市未選択';
      $('modalGrandTotal').textContent = yen(grandTotal);
      $('modalTransport').textContent = yen(transport);
      $('modalHotel').textContent = yen(hotel);
      $('modalTicketOther').textContent = yen(ticketOther);

      const savingBox = $('modalSavingBox');
      if (state.enableSaving) {
        savingBox.classList.remove('hidden');
        $('modalSavingLabel').textContent = savingMonths + 'ヶ月貯金プラン';
        $('modalSavingValue').textContent = '月々 ¥' + monthlySaving.toLocaleString();
      } else {
        savingBox.classList.add('hidden');
      }

      const listEl = $('modalCityList');
      if (rowsData.length === 0) {
        listEl.innerHTML = '<div class="py-4 text-center text-xs text-slate-400">公演都市が選択されていません</div>';
      } else {
        listEl.innerHTML = rowsData.map(r =>
          '<div class="py-1.5 flex items-center justify-between text-xs">' +
            '<div>' +
              '<span class="font-bold text-slate-800">' + r.city.name + '</span>' +
              '<span class="text-[10px] text-slate-400 ml-1">' + MODE_LABELS[r.chosenMode] + ' / ' + (r.nights === 0 ? '日帰り' : r.nights + '泊') + ' / ' + r.shows + '公演</span>' +
            '</div>' +
            '<span class="font-bold text-slate-700">¥' + r.subtotal.toLocaleString() + '</span>' +
          '</div>'
        ).join('');
      }

      const hotelLabel = state.enableStay && state.hotelGrade ? HOTEL_BASE[state.hotelGrade].name : '宿泊なし';
      const styleLabel = state.bookingStyle === 'early' ? '早割活用' : (state.bookingStyle === 'pack' ? 'パック割' : '通常予約');
      const drinkLabel = state.includeDrink ? ' / ワンドリンク代込' : '';
      $('modalConditions').textContent = '条件: ' + hotelLabel + ' / ' + styleLabel + drinkLabel;
    }

    function openSummaryModal() {
      const m = $('summaryModal');
      m.classList.remove('hidden');
      m.classList.add('flex');
    }

    function closeSummaryModal() {
      const m = $('summaryModal');
      m.classList.add('hidden');
      m.classList.remove('flex');
    }

    async function downloadCardImage() {
      const card = $('summaryCardContainer');
      const cityList = $('modalCityList');
      const actionBtns = $('modalActionButtons');
      const closeBtn = $('summaryCloseButton');

      const prev = {
        closeDisplay: closeBtn?.style.display || '',
        actionDisplay: actionBtns?.style.display || '',
        listMaxHeight: cityList.style.maxHeight,
        listOverflow: cityList.style.overflow
      };

      if (closeBtn) closeBtn.style.display = 'none';
      if (actionBtns) actionBtns.style.display = 'none';
      cityList.style.maxHeight = 'none';
      cityList.style.overflow = 'visible';

      try {
        // 展開後のレイアウトを確定させてから、カード全体を画像化する
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const canvas = await html2canvas(card, {
          scale: 2,
          backgroundColor: '#ffffff',
          useCORS: true,
          width: card.scrollWidth,
          height: card.scrollHeight
        });
        const link = document.createElement('a');
        link.download = 'oshikatsu-estimate.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToast('カード画像をダウンロードしました！');
      } catch (e) {
        showToast('画像の保存に失敗しました');
      } finally {
        if (closeBtn) closeBtn.style.display = prev.closeDisplay;
        if (actionBtns) actionBtns.style.display = prev.actionDisplay;
        cityList.style.maxHeight = prev.listMaxHeight;
        cityList.style.overflow = prev.listOverflow;
      }
    }

    function showToast(msg) {
      const t = $('toast');
      $('toastMsg').textContent = msg;
      t.classList.remove('translate-y-20', 'opacity-0');
      setTimeout(() => {
        t.classList.add('translate-y-20', 'opacity-0');
      }, 2600);
    }

    function buildShareText() {
      const title = $('tourTitle').value.trim() || '推し活 遠征プラン';
      const badge = $('summaryBadge').textContent;
      const grand = $('grandTotalDisplay').textContent;
      const trans = $('transportTotalDisplay').textContent;
      const hotel = $('hotelTotalDisplay').textContent;
      const tick  = $('ticketTotalDisplay').textContent;

      let text = '【' + title + ' 遠征費試算】\n' +
                 '📍 ' + badge + '\n' +
                 '💰 総額：' + grand + '\n' +
                 '（交通費 ' + trans + ' / 宿泊費 ' + hotel + ' / チケット ' + tick + '）\n';

      if (state.enableSaving) {
        const months = $('savingMonths').value;
        const monthly = $('monthlySavingDisplay').textContent;
        text += '🐷 ' + months + 'ヶ月貯金なら：' + monthly + '\n';
      }

      text += '#推し活遠征シミュレーター';

      if (location.protocol.startsWith('http')) {
        text += '\n' + location.origin + location.pathname;
      }
      return text;
    }

    function copyShareText() {
      const text = buildShareText();
      navigator.clipboard.writeText(text).then(() => {
        showToast('SNS共有用のテキストをコピーしました！');
      });
    }

    function shareOnX() {
      const text = buildShareText();
      const intentUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text);
      window.open(intentUrl, '_blank', 'noopener,noreferrer');
    }

    const MODE_CODES = { shinkansen: 's', lcc: 'l', fsc: 'f', bus: 'b' };
    const MODE_FROM_CODE = Object.fromEntries(Object.entries(MODE_CODES).map(([key, value]) => [value, key]));
    const BOOKING_CODES = { regular: 'r', early: 'e', pack: 'p' };
    const BOOKING_FROM_CODE = Object.fromEntries(Object.entries(BOOKING_CODES).map(([key, value]) => [value, key]));
    const HOTEL_CODES = { netcafe: 'n', capsule: 'c', business: 'b', resort: 'r' };
    const HOTEL_FROM_CODE = Object.fromEntries(Object.entries(HOTEL_CODES).map(([key, value]) => [value, key]));
    const COLOR_CODES = {
      '#10b981': 'g', '#06b6d4': 'c', '#3b82f6': 'b', '#8b5cf6': 'v',
      '#ec4899': 'p', '#ef4444': 'r', '#f97316': 'o', '#eab308': 'y'
    };
    const COLOR_FROM_CODE = Object.fromEntries(Object.entries(COLOR_CODES).map(([key, value]) => [value, key]));
    const CITY_CODES = {
      hokkaido: 'h', miyagi: 'm', niigata: 'n', saitama: 's', chiba: 'c', tokyo: 't',
      kanagawa: 'k', shizuoka: 'z', aichi: 'a', osaka: 'o', hyogo: 'y', hiroshima: 'r', fukuoka: 'f'
    };
    const CITY_FROM_CODE = Object.fromEntries(Object.entries(CITY_CODES).map(([id, code]) => [code, id]));
    const ORIGIN_CODES = { tokyo: 't', kanagawa: 'k', chiba: 'c', saitama: 's', osaka: 'o', aichi: 'a', fukuoka: 'f', hokkaido: 'h', miyagi: 'm', hiroshima: 'r' };
    const ORIGIN_FROM_CODE = Object.fromEntries(Object.entries(ORIGIN_CODES).map(([id, code]) => [code, id]));

    function getDefaultCitySettings(cityId, modeOverride = '') {
      const routeInfo = getRouteOptionsForCity(state.origin, cityId);
      const availableModes = Object.keys(routeInfo.options).filter(k => routeInfo.options[k] != null);
      const autoMode = pickBestMode(routeInfo.options, state.transportMode, routeInfo.isLocal);
      const mode = modeOverride && availableModes.includes(modeOverride) ? modeOverride : autoMode;
      const nights = routeInfo.isLocal ? 0 : (state.enableStay ? (mode === 'bus' ? 0 : 1) : 0);
      return { mode, autoMode, nights, availableModes };
    }

    function encodeOverrides() {
      const baseTicket = safeMoney($('ticketPrice').value);
      const chunks = [];

      Object.entries(state.overrides).forEach(([cityId, ov]) => {
        if (!CITY_MAP[cityId]) return;
        const fields = [];
        const initial = getDefaultCitySettings(cityId);
        const overrideMode = ov.mode && initial.availableModes.includes(ov.mode) ? ov.mode : '';
        const effectiveMode = overrideMode || initial.autoMode;
        const defaults = getDefaultCitySettings(cityId, effectiveMode);

        const ticket = ov.ticketPrice === undefined ? baseTicket : safeMoney(ov.ticketPrice);
        const shows = ov.shows === undefined ? 1 : safeNumber(ov.shows, { min: 1, max: 4, fallback: 1, integer: true });
        const nights = ov.nights === undefined ? defaults.nights : safeNumber(ov.nights, { min: 0, max: 3, fallback: defaults.nights, integer: true });

        if (ticket !== baseTicket) fields.push('t' + ticket);
        if (shows !== 1) fields.push('s' + shows);
        if (overrideMode && overrideMode !== initial.autoMode) fields.push('m' + MODE_CODES[overrideMode]);
        if (nights !== defaults.nights) fields.push('n' + nights);
        if (ov.peak) fields.push('p1');

        if (fields.length) chunks.push((CITY_CODES[cityId] || cityId) + '.' + fields.join('.'));
      });

      return chunks.join('-');
    }

    function decodeOverrides(raw) {
      if (!raw) return {};

      // 旧共有URL（JSON形式）も読み込めるようにしておく
      if (raw.trim().startsWith('{')) {
        try {
          const legacy = JSON.parse(raw);
          const cleaned = {};
          Object.entries(legacy).forEach(([cityId, ov]) => {
            if (!CITY_MAP[cityId] || !ov || typeof ov !== 'object') return;
            cleaned[cityId] = {};
            if (ov.ticketPrice !== undefined) cleaned[cityId].ticketPrice = safeMoney(ov.ticketPrice);
            if (ov.shows !== undefined) cleaned[cityId].shows = safeNumber(ov.shows, { min: 1, max: 4, fallback: 1, integer: true });
            if (ov.nights !== undefined) cleaned[cityId].nights = safeNumber(ov.nights, { min: 0, max: 3, fallback: 0, integer: true });
            if (ov.peak) cleaned[cityId].peak = true;
            if (MODE_LABELS[ov.mode]) cleaned[cityId].mode = ov.mode;
            if (!Object.keys(cleaned[cityId]).length) delete cleaned[cityId];
          });
          return cleaned;
        } catch {
          return {};
        }
      }

      const decoded = {};
      raw.split('-').forEach(chunk => {
        const [cityToken, ...parts] = chunk.split('.');
        const cityId = CITY_FROM_CODE[cityToken] || cityToken;
        if (!CITY_MAP[cityId] || !parts.length) return;
        const ov = {};

        parts.forEach(part => {
          const key = part[0];
          const value = part.slice(1);
          if (key === 't') ov.ticketPrice = safeMoney(value);
          if (key === 's') ov.shows = safeNumber(value, { min: 1, max: 4, fallback: 1, integer: true });
          if (key === 'n') ov.nights = safeNumber(value, { min: 0, max: 3, fallback: 0, integer: true });
          if (key === 'p' && value === '1') ov.peak = true;
          if (key === 'm' && MODE_FROM_CODE[value]) ov.mode = MODE_FROM_CODE[value];
        });

        if (Object.keys(ov).length) decoded[cityId] = ov;
      });
      return decoded;
    }

    function copyShareUrl() {
      const params = new URLSearchParams();

      // デフォルトと違う設定だけ、1文字キー＋短縮コードで保存する
      if (state.origin && state.origin !== 'tokyo') params.set('o', ORIGIN_CODES[state.origin] || state.origin);
      if (state.transportMode && state.transportMode !== 'shinkansen') params.set('m', MODE_CODES[state.transportMode]);
      if (state.bookingStyle && state.bookingStyle !== 'regular') params.set('r', BOOKING_CODES[state.bookingStyle]);
      if (state.selectedCities.size) {
        const cityCodes = [...state.selectedCities].map(id => CITY_CODES[id]).filter(Boolean).join('');
        if (cityCodes) params.set('c', cityCodes);
      }

      const flags = (state.enableStay ? 1 : 0) | (state.includeDrink ? 2 : 0) | (state.enableSaving ? 4 : 0);
      if (flags) params.set('f', flags);
      if (state.enableStay && state.hotelGrade && state.hotelGrade !== 'business') params.set('h', HOTEL_CODES[state.hotelGrade]);
      if (state.themeColor !== '#8b5cf6') params.set('x', COLOR_CODES[state.themeColor]);

      const ticket = safeMoney($('ticketPrice').value);
      const hotelOffset = safeNumber($('hotelOffset').value, { min: -3000, max: 8000, fallback: 0, integer: true });
      const savingMonths = safeNumber($('savingMonths').value, { min: 1, max: 120, fallback: 6, integer: true });
      const title = $('tourTitle').value.trim();
      const goods = safeMoney($('goodsBudget').value);
      const food = safeMoney($('foodPerTrip').value);

      if (ticket !== 10000) params.set('t', ticket);
      if (hotelOffset !== 0) params.set('u', hotelOffset);
      if (savingMonths !== 6) params.set('n', savingMonths);
      if (title) params.set('q', title.slice(0, 120));
      if (goods > 0) params.set('g', goods);
      if (food > 0) params.set('d', food);

      const encodedOverrides = encodeOverrides();
      if (encodedOverrides) params.set('v', encodedOverrides);

      const query = params.toString();
      navigator.clipboard.writeText(location.origin + location.pathname + (query ? '?' + query : '')).then(() => showToast('現在の設定URLをコピーしました！'));
    }

    function loadFromUrlParams() {
      const params = new URLSearchParams(location.search);
      const lightMap = { '#10b981': '#d1fae5', '#06b6d4': '#cffafe', '#3b82f6': '#dbeafe', '#8b5cf6': '#f3e8ff', '#ec4899': '#fce7f3', '#ef4444': '#fee2e2', '#f97316': '#ffedd5', '#eab308': '#fef9c3' };

      // 新形式を優先しつつ、旧共有URLも読み込めるようにする
      const legacyUrl = ['stay', 'sav', 'col', 'goods', 'food', 'ov', 'sm', 'title'].some(key => params.has(key));
      const originRaw = params.get('o');
      const origin = ORIGIN_FROM_CODE[originRaw] || originRaw;
      if (origin && ORIGINS[origin]) {
        state.origin = origin;
        $('originSelect').value = origin;
      }

      if (params.get('c')) {
        const rawCities = params.get('c');
        const cityIds = rawCities.includes(',')
          ? rawCities.split(',').map(token => CITY_FROM_CODE[token] || token).filter(id => CITY_MAP[id])
          : [...rawCities].map(code => CITY_FROM_CODE[code]).filter(Boolean);
        state.selectedCities = new Set(cityIds);
      }

      const transportRaw = params.get('m');
      const transportMode = MODE_FROM_CODE[transportRaw] || transportRaw;
      state.transportMode = ['shinkansen', 'lcc', 'fsc', 'bus'].includes(transportMode) ? transportMode : '';

      // 新形式は r、旧形式は s
      const bookingRaw = params.get('r') ?? params.get('s');
      const bookingStyle = BOOKING_FROM_CODE[bookingRaw] || bookingRaw;
      state.bookingStyle = ['regular', 'early', 'pack'].includes(bookingStyle) ? bookingStyle : '';

      if (params.has('f')) {
        const flags = safeNumber(params.get('f'), { min: 0, max: 7, fallback: 0, integer: true });
        state.enableStay = !!(flags & 1);
        state.includeDrink = !!(flags & 2);
        state.enableSaving = !!(flags & 4);
      } else {
        state.enableStay = params.get('stay') === '1';
        state.includeDrink = params.get('d') === '1';
        state.enableSaving = params.get('sav') === '1';
      }

      const hotelRaw = params.get('h') ?? (legacyUrl ? params.get('g') : null);
      const hotelGrade = HOTEL_FROM_CODE[hotelRaw] || hotelRaw;
      state.hotelGrade = state.enableStay && HOTEL_BASE[hotelGrade] ? hotelGrade : (state.enableStay ? 'business' : '');

      $('enableStayToggle').checked = state.enableStay;
      $('drinkFeeToggle').checked = state.includeDrink;
      $('enableSavingToggle').checked = state.enableSaving;
      $('savingSection').classList.toggle('hidden', !state.enableSaving);
      $('hotelGradeSection').classList.toggle('opacity-40', !state.enableStay);
      $('hotelGradeSection').classList.toggle('pointer-events-none', !state.enableStay);

      [
        ['transportModeGroup', 'mode', state.transportMode],
        ['bookingStyleGroup', 'style', state.bookingStyle],
        ['hotelGradeGroup', 'grade', state.hotelGrade]
      ].forEach(([groupId, dataKey, value]) => {
        document.querySelectorAll(`#${groupId} .option-card`).forEach(el =>
          el.classList.toggle('active', !!value && el.dataset[dataKey] === value)
        );
      });

      if (params.has('t')) $('ticketPrice').value = safeMoney(params.get('t'));
      if (params.has('u')) $('hotelOffset').value = safeNumber(params.get('u'), { min: -3000, max: 8000, fallback: 0, integer: true });
      const monthsRaw = params.get('n') ?? params.get('sm');
      if (monthsRaw !== null) {
        const allowedMonths = [1, 2, 3, 4, 5, 6, 8, 10, 12];
        const months = safeNumber(monthsRaw, { min: 1, max: 12, fallback: 6, integer: true });
        $('savingMonths').value = allowedMonths.includes(months) ? String(months) : '6';
      }
      const titleRaw = params.get('q') ?? params.get('title');
      if (titleRaw !== null) $('tourTitle').value = titleRaw.slice(0, 120);
      const goodsRaw = legacyUrl ? params.get('goods') : params.get('g');
      if (goodsRaw !== null) $('goodsBudget').value = safeMoney(goodsRaw) || '';
      const foodRaw = legacyUrl ? params.get('food') : params.get('d');
      if (foodRaw !== null) $('foodPerTrip').value = safeMoney(foodRaw) || '';

      state.overrides = decodeOverrides(params.get('v') ?? params.get('ov'));

      const colorRaw = params.get('x') ?? params.get('col');
      const color = COLOR_FROM_CODE[colorRaw] || colorRaw;
      if (color && lightMap[color]) setTheme(color, lightMap[color], false);
    }
