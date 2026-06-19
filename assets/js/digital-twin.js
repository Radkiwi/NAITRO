/* ════════════════════════════════════════════════════════════
   NAITRO Digital Twin — shared rendering component
   One module powers the soil-block visualisation on every farm
   page (nz1, sa1, sa2, sa3). Each farm supplies a config object
   (scenarios, inputs/outputs, layers, health()/priming() scoring)
   — usually sourced via AirtableCMS with a local fallback — and
   this module does the rest: markup, state, interactivity.

   Usage:
     NaitroTwin.mount('#view-tw', config);

   Config shape — see /assets/data/*.js for real examples:
     {
       id, base, title, subtitle, accent,
       bandPast, bandFuture, emptyDetailTitle, emptyDetailBody,
       scenarios: [{id,label}],
       scens:  { scenarioId: { key: value, ... }, ... },
       mods:   { scenarioId: { key: [pastDelta, 0, futureDelta] } },
       inputs:  [{id,icon,name,key,unit,desc,stats,alert,fmt(v)}],
       outputs: [{id,icon,name,key,unit,desc,stats,alert,fmt(v)}],
       layers:  [{name,key,max,color}],
       health(ctx)  -> 0-100 integer
       priming(ctx) -> 0-9 integer
     }
   ════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  function mount(rootSelector, config) {
    const root = typeof rootSelector === 'string' ? document.querySelector(rootSelector) : rootSelector;
    if (!root) { console.error('NaitroTwin.mount: target not found', rootSelector); return null; }
    if (config.accent) root.style.setProperty('--twin-accent', config.accent);

    // ── private state, scoped per mount (supports >1 twin per page) ──
    let tTime = -5;
    let tScen = (config.scenarios && config.scenarios[0] && config.scenarios[0].id) || 'baseline';
    let tSel = null;

    root.innerHTML = renderShell(config);

    const $ = (sel) => root.querySelector(sel);

    function gv(key) {
      const s = config.scens[tScen];
      const m = config.mods[tScen] ? config.mods[tScen][key] : null;
      if (!m) return s[key];
      const f = tTime / 10;
      return Math.max(0, tTime < 0 ? s[key] + m[0] * (-f) : s[key] + m[2] * f);
    }

    function ctx() { return { gv, scen: config.scens[tScen], tTime, tScen }; }

    function fmtVal(item, raw) {
      if (raw === null || raw === undefined) return item.unit;
      return item.fmt ? item.fmt(raw) : (Math.round(raw * 10) / 10) + '';
    }

    function renderLayers() {
      const el = $('.lbars'); if (!el) return;
      el.innerHTML = config.layers.map(l => {
        const raw = gv(l.key);
        const pct = Math.min(100, l.max ? (raw / l.max * 100) : raw);
        const display = (raw < 10 && l.max && l.max <= 10) ? raw.toFixed(1) + (l.unitSuffix || '%') : Math.round(raw) + '%';
        return `<div class="lbar-row"><span class="lb-name">${l.name}</span><div class="lb-track"><div class="lb-fill" style="width:${Math.round(pct)}%;background:${l.color}70;border-right:2px solid ${l.color}"></div></div><span class="lb-pct">${display}</span></div>`;
      }).join('');
    }

    function renderScore() {
      const sc = config.health(ctx());
      const pr = config.priming(ctx());
      const scoreEl = $('.tw-score'); if (scoreEl) scoreEl.textContent = sc;
      const cls = pr >= 7 ? 'rp-h' : pr >= 5 ? 'rp-m' : 'rp-l';
      const lbl = pr >= 7 ? (config.primingLabels?.high || 'High priming risk')
                : pr >= 5 ? (config.primingLabels?.medium || 'Medium priming risk')
                : (config.primingLabels?.low || 'Low priming risk');
      const riskEl = $('.tw-risk');
      if (riskEl) {
        riskEl.className = `risk-pill ${cls}`;
        riskEl.innerHTML = `<i class="ti ti-${pr >= 5 ? 'alert-triangle' : 'circle-check'}"></i> ${lbl} (${pr}/9)`;
      }
    }

    function buildPanels() {
      const ip = $('.inp-panel');
      if (ip) {
        ip.innerHTML = `<div class="io-label" style="color:${config.inputAccent || '#B5711A'}"><i class="ti ti-arrow-right"></i> inputs</div>`;
        config.inputs.forEach(inp => {
          const raw = inp.key ? gv(inp.key) : null;
          const v = fmtVal(inp, raw);
          const d = document.createElement('div');
          d.className = 'io-card' + (tSel === inp.id ? ' sel' : '');
          d.innerHTML = `<div class="io-top"><i class="ti ${inp.icon}"></i><span class="io-name">${inp.name}</span></div><div class="io-val">${v}</div>`;
          d.onclick = () => { tSel = tSel === inp.id ? null : inp.id; buildPanels(); renderDetail(); };
          ip.appendChild(d);
        });
      }
      const op = $('.out-panel');
      if (op) {
        op.innerHTML = `<div class="io-label" style="color:${config.outputAccent || '#185FA5'}"><i class="ti ti-arrow-right"></i> outputs</div>`;
        config.outputs.forEach(out => {
          const raw = out.key ? gv(out.key) : null;
          const v = fmtVal(out, raw);
          const d = document.createElement('div');
          d.className = 'io-card' + (tSel === out.id ? ' sel' : '');
          d.innerHTML = `<div class="io-top"><i class="ti ${out.icon}"></i><span class="io-name">${out.name}</span></div><div class="io-val">${v}</div>`;
          d.onclick = () => { tSel = tSel === out.id ? null : out.id; buildPanels(); renderDetail(); };
          op.appendChild(d);
        });
      }
    }

    function renderDetail() {
      const nameEl = $('.td-name'), bodyEl = $('.td-body'), gridEl = $('.td-grid'), alertEl = $('.td-alert');
      if (!nameEl) return;
      if (!tSel) {
        nameEl.textContent = config.emptyDetailTitle || 'Select an input or output above';
        bodyEl.textContent = config.emptyDetailBody || 'Click any card on the left or right to explore how that variable connects to the soil biology and what decisions can change it.';
        gridEl.innerHTML = '';
        alertEl.innerHTML = '';
        return;
      }
      const all = [...config.inputs, ...config.outputs];
      const item = all.find(x => x.id === tSel);
      if (!item) return;
      nameEl.innerHTML = `<i class="ti ${item.icon}"></i> ${item.name}`;
      bodyEl.textContent = item.desc;
      gridEl.innerHTML = item.stats.map(s => {
        let val = s.v;
        if (!val && item.key) val = fmtVal(item, gv(item.key));
        return `<div class="td-stat"><div class="td-stat-l">${s.l}</div><div class="td-stat-v">${val || '—'}</div></div>`;
      }).join('');
      alertEl.innerHTML = '';
      if (item.alert) {
        const cls = item.alert.t === 'warn' ? 'ta-warn' : 'ta-ok';
        alertEl.innerHTML = `<div class="td-alert ${cls}"><i class="ti ti-${item.alert.t === 'warn' ? 'alert-triangle' : 'circle-check'}"></i><span>${item.alert.m}</span></div>`;
      }
    }

    function renderAll() { renderScore(); renderLayers(); buildPanels(); renderDetail(); }

    function onTime(v) {
      tTime = parseInt(v, 10);
      $('.yr-lbl').textContent = config.base + tTime;
      root.querySelectorAll('.pb').forEach(b => {
        b.classList.remove('active');
        if (tTime < -1 && b.dataset.ph === 'past') b.classList.add('active');
        else if (tTime > 1 && b.dataset.ph === 'future') b.classList.add('active');
        else if (Math.abs(tTime) <= 1 && b.dataset.ph === 'present') b.classList.add('active');
      });
      renderAll();
    }

    function setPhase(p, btn) {
      root.querySelectorAll('.pb').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const sl = $('.tSlider');
      tTime = p === 'past' ? -5 : p === 'present' ? 0 : 5;
      sl.value = tTime;
      $('.yr-lbl').textContent = config.base + tTime;
      renderAll();
    }

    function setScen(sc, btn) {
      tScen = sc;
      root.querySelectorAll('.s-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderAll();
    }

    // wire static controls
    root.querySelectorAll('.pb').forEach(b => b.addEventListener('click', () => setPhase(b.dataset.ph, b)));
    root.querySelectorAll('.s-btn').forEach(b => b.addEventListener('click', () => setScen(b.dataset.sc, b)));
    const slider = $('.tSlider');
    if (slider) slider.addEventListener('input', (e) => onTime(e.target.value));
    const backBtn = $('.twin-back-btn');
    if (backBtn && config.onBack) backBtn.addEventListener('click', config.onBack);

    renderAll();

    return { renderAll, setScen, setPhase, getState: () => ({ tTime, tScen, tSel }) };
  }

  function renderShell(config) {
    const scenarioBtns = (config.scenarios || []).map((s, i) =>
      `<button class="s-btn${i === 0 ? ' active' : ''}" data-sc="${s.id}">${s.label}</button>`
    ).join('');

    return `
      <div class="twin-header">
        <div>
          <div class="twin-title">${config.title}</div>
          <div class="twin-subtitle">${config.subtitle}</div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="risk-pill rp-m tw-risk"><i class="ti ti-alert-triangle"></i> Medium priming risk</span>
          ${config.onBack ? '<button class="back-btn twin-back-btn"><i class="ti ti-arrow-left"></i> Back to overview</button>' : ''}
        </div>
      </div>

      <div class="time-rail">
        <div class="tr-top">
          <span class="tr-label"><i class="ti ti-clock"></i> time horizon</span>
          <div class="phase-btns">
            <button class="pb active" data-ph="past">Past</button>
            <button class="pb" data-ph="present">Present</button>
            <button class="pb" data-ph="future">Future</button>
          </div>
        </div>
        <div class="tr-slider">
          <span style="font-size:10px;color:var(--color-text-tertiary)">−10 yr</span>
          <input type="range" class="tSlider" min="-10" max="10" value="-5" step="1">
          <span style="font-size:10px;color:var(--color-text-tertiary)">+10 yr</span>
        </div>
        <div class="tr-bands">
          <span>${config.bandPast}</span>
          <span class="yr-lbl" style="font-weight:500;color:var(--color-text-primary)">${config.base - 5}</span>
          <span>${config.bandFuture}</span>
        </div>
      </div>

      <div class="twin-grid">
        <div class="io-panel inp-panel"></div>
        <div class="twin-cube-col">
          ${SOIL_CUBE_SVG('tw-score')}
          <div class="lbars"></div>
        </div>
        <div class="io-panel out-panel"></div>
      </div>

      <div class="twin-detail">
        <div class="td-title"><i class="ti ti-info-circle"></i><span class="td-name">Select an input or output above</span></div>
        <div class="td-body">Click any card on the left or right to explore how that variable connects to the soil biology and what decisions can change it.</div>
        <div class="td-grid"></div>
        <div class="td-alert"></div>
      </div>

      <div class="scen-bar">
        <span style="font-size:11px;color:var(--color-text-tertiary);align-self:center">Scenario:</span>
        ${scenarioBtns}
      </div>
    `;
  }

  function SOIL_CUBE_SVG(scoreClass) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <polygon points="100,8 192,58 192,142 100,192 8,142 8,58" fill="#A0785A" opacity=".85"/>
      <polygon points="100,8 192,58 100,108 8,58" fill="#B8906A" opacity=".95"/>
      <polygon points="8,58 100,108 100,192 8,142" fill="#7A5C42" opacity=".9"/>
      <polygon points="192,58 100,108 100,192 192,142" fill="#8C6A4E" opacity=".9"/>
      <polygon points="100,8 192,58 100,108 8,58" fill="none" stroke="#5C3D22" stroke-width="1.5"/>
      <polygon points="8,58 100,108 100,192 8,142" fill="none" stroke="#5C3D22" stroke-width="1.5"/>
      <polygon points="192,58 100,108 100,192 192,142" fill="none" stroke="#5C3D22" stroke-width="1.5"/>
      <line x1="8" y1="142" x2="192" y2="142" stroke="#5C3D22" stroke-width="1.5"/>
      <polyline points="92,108 88,132 84,158 82,172" fill="none" stroke="#4a7c3f" stroke-width="2" opacity=".8"/>
      <polyline points="92,108 78,122 72,138 68,158" fill="none" stroke="#4a7c3f" stroke-width="1.5" opacity=".6"/>
      <polyline points="92,108 106,124 110,142 108,164" fill="none" stroke="#4a7c3f" stroke-width="1.5" opacity=".6"/>
      <ellipse cx="92" cy="106" rx="11" ry="5" fill="#5a9e4a" opacity=".9"/>
      <ellipse cx="85" cy="99" rx="8" ry="4" fill="#6aaa58" opacity=".8"/>
      <ellipse cx="100" cy="101" rx="7" ry="3.5" fill="#5a9e4a" opacity=".8"/>
      <text class="${scoreClass}" x="100" y="138" text-anchor="middle" font-size="20" font-weight="500" fill="#FFF" opacity=".9">--</text>
      <text x="100" y="151" text-anchor="middle" font-size="8" fill="#FFF" opacity=".6">health score</text>
    </svg>`;
  }

  global.NaitroTwin = { mount };
})(window);
