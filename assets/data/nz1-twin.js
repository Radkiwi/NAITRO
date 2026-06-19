/* NAITRO Digital Twin — local fallback data for NZ1 (Ruakura Dairy Unit).
   Renders instantly; AirtableCMS may refresh scens/mods/copy in the background. */
window.NAITRO_TWIN_DATA = window.NAITRO_TWIN_DATA || {};
window.NAITRO_TWIN_DATA.nz1 = {
  id: 'nz1',
  base: 2025,
  title: '1 m³ soil block · Ruakura Dairy Unit',
  subtitle: 'Paddock-level model · NZ biological farming transition',
  accent: '#1D9E75',
  inputAccent: '#B5711A',
  outputAccent: '#185FA5',
  bandPast: '2015 — heavy urea era',
  bandFuture: '2035 — biological recovery',
  emptyDetailBody: 'Click any card on the left or right to explore how that variable connects to the soil biology and what decisions can change it.',
  primingLabels: { high: 'High priming risk', medium: 'Medium priming risk', low: 'Low priming risk' },

  scenarios: [
    { id: 'baseline', label: 'Current farm' },
    { id: 'stepdown', label: 'Urea step-down' },
    { id: 'herbal', label: 'Herbal ley + trace minerals' },
    { id: 'full', label: 'Full biological transition' },
  ],

  scens: {
    baseline: { urea: 200, legume: 15, soc: 3.2, cn: 14, co: 0.08, bnf: 18, comp: 55, macro: 38, infilt: 6, rot: 21 },
    stepdown: { urea: 120, legume: 18, soc: 3.6, cn: 16, co: 0.08, bnf: 24, comp: 45, macro: 44, infilt: 9, rot: 28 },
    herbal: { urea: 90, legume: 28, soc: 4.1, cn: 19, co: 0.28, bnf: 42, comp: 30, macro: 58, infilt: 15, rot: 35 },
    full: { urea: 40, legume: 38, soc: 5.2, cn: 23, co: 0.35, bnf: 65, comp: 12, macro: 74, infilt: 28, rot: 56 },
  },
  mods: {
    baseline: { soc: [-.8, 0, 1.2], bnf: [-8, 0, 4], comp: [15, 0, -8], urea: [40, 0, -20] },
    stepdown: { soc: [-.5, 0, 1.8], bnf: [-5, 0, 14], comp: [12, 0, -18], urea: [80, 0, -60] },
    herbal: { soc: [-.3, 0, 2.2], bnf: [-4, 0, 22], comp: [10, 0, -25], urea: [60, 0, -70] },
    full: { soc: [-.2, 0, 2.8], bnf: [-3, 0, 30], comp: [8, 0, -30], urea: [50, 0, -38] },
  },

  inputs: [
    { id: 'sun', icon: 'ti-sun', name: 'Sunlight', key: null, unit: 'kJ/m²/day', desc: 'Drives photosynthesis which pumps liquid carbon into the root zone, feeding soil microbes.', stats: [{ l: 'Daily average', v: '14,200 kJ' }, { l: 'Seasonal variation', v: '4× summer vs winter' }], alert: null },
    { id: 'rain', icon: 'ti-cloud-rain', name: 'Rainfall', key: null, unit: 'mm/day', desc: 'Determines leaching risk. High rainfall (>1,200 mm/yr) flushes nitrates before microbes can process them.', stats: [{ l: 'Annual total', v: '1,150 mm' }, { l: 'N leaching risk', v: 'Medium–High' }], alert: { t: 'warn', m: 'At current rainfall and urea rates, estimated N loss to groundwater is 45–65 kg N/ha/yr.' } },
    { id: 'urea', icon: 'ti-flask', name: 'Urea added', key: 'urea', unit: 'kg N/ha/yr', fmt: v => Math.round(v) + ' kg N/ha/yr', desc: 'Synthetic nitrogen input. Excess urea triggers the Priming Effect — microbes consume stored soil carbon to balance their diet, releasing it as CO₂.', stats: [{ l: 'Current rate', v: null }, { l: 'NZ dairy avg', v: '200 kg N/ha/yr' }], alert: { t: 'warn', m: 'High urea rates are depleting soil carbon. C:N ratio below 15 indicates active carbon loss.' } },
    { id: 'co2', icon: 'ti-wind', name: 'Air / CO₂', key: null, unit: 'CO₂ balance', desc: 'Healthy soil sequesters carbon; degraded soil emits it. Macroporosity and biological activity determine whether the block is a carbon sink or source.', stats: [{ l: 'Macroporosity', v: null }, { l: 'Target', v: '>10% macropores' }], alert: null },
    { id: 'min', icon: 'ti-atom', name: 'Trace minerals', key: 'co', unit: 'Co/Cu/Se/Mo', fmt: v => v.toFixed(2) + ' mg/kg', desc: 'NZ soils are naturally deficient in cobalt, copper, selenium, and molybdenum due to young volcanic geology. Essential cofactors for Rhizobia N-fixing bacteria.', stats: [{ l: 'Cobalt level', v: null }, { l: 'Sufficiency', v: '>0.25 mg/kg' }], alert: { t: 'warn', m: 'Cobalt deficiency blocks biological N fixation regardless of legume cover. Address trace minerals first.' } },
  ],
  outputs: [
    { id: 'carbs', icon: 'ti-bread', name: 'Carbohydrates', key: null, unit: 'kg/m²/yr', desc: 'Pasture dry matter yield. Biological systems can match synthetic N yields once established.', stats: [{ l: 'Current DM yield', v: '12.4 t/ha/yr' }, { l: 'Biological potential', v: '13–15 t/ha/yr' }], alert: { t: 'ok', m: 'Herbal ley pastures consistently match ryegrass monocultures within 3–5 years of establishment.' } },
    { id: 'prot', icon: 'ti-test-pipe', name: 'Protein', key: 'bnf', unit: '% of N', fmt: v => Math.round(v) + '% of N', desc: 'Biological nitrogen fixation by Rhizobia directly determines pasture protein content. Higher BNF = more protein without synthetic inputs.', stats: [{ l: 'BNF contribution', v: null }, { l: 'Full BNF potential', v: 'up to 300 kg N/ha/yr' }], alert: null },
    { id: 'nrun', icon: 'ti-droplet', name: 'Nutrient runoff', key: null, unit: 'N, P, K', desc: 'Excess N and P that degraded soil cannot hold leaches into waterways, causing algal blooms and breaching NPS-FM 2020 limits.', stats: [{ l: 'Est. N leaching', v: '38 kg/ha/yr' }, { l: 'NPS-FM target', v: '<30 kg N/ha/yr' }], alert: { t: 'warn', m: 'Current management exceeds NPS-FM 2020 targets. Urea step-down + herbal ley is the most effective compliance path.' } },
    { id: 'wrun', icon: 'ti-ripple', name: 'Water runoff', key: 'infilt', unit: 'mm/hr', fmt: v => v.toFixed(1) + ' mm/hr', desc: 'Compacted soils cannot absorb rainfall. Water runs off carrying topsoil and nutrients. Infiltration rate is the key indicator.', stats: [{ l: 'Infiltration rate', v: null }, { l: 'Healthy target', v: '>25 mm/hr' }], alert: { t: 'warn', m: 'Low infiltration indicates compaction. Herbal ley root systems and rest periods break up compaction naturally.' } },
    { id: 'resp', icon: 'ti-bolt', name: 'Soil respiration', key: 'soc', unit: '%', fmt: v => v.toFixed(1) + '%', desc: 'CO₂ output indicates microbial activity. Under the Priming Effect, excess activity burns through stored soil carbon.', stats: [{ l: 'SOC level', v: null }, { l: 'Target SOC', v: '>5% for resilient pasture' }], alert: null },
  ],
  layers: [
    { name: 'SOC', key: 'soc', max: 8, color: '#A0785A' },
    { name: 'Macropores', key: 'macro', max: 100, color: '#5a9e4a' },
    { name: 'BNF', key: 'bnf', max: 100, color: '#185FA5' },
    { name: 'Compaction', key: 'comp', max: 100, color: '#D85A30' },
  ],

  health(ctx) {
    const soc = ctx.gv('soc'), bnf = ctx.gv('bnf'), comp = ctx.gv('comp'), co = ctx.scen.co;
    return Math.round(Math.min(soc / 6, 1) * 30 + bnf / 100 * 30 + (1 - comp / 100) * 25 + Math.min(co / 0.3, 1) * 15);
  },
  priming(ctx) {
    const cn = ctx.scen.cn, urea = ctx.gv('urea'), soc = ctx.gv('soc');
    let s = 0;
    s += cn < 15 ? 3 : cn < 20 ? 2 : 1;
    s += urea > 200 ? 3 : urea > 100 ? 2 : 1;
    s += soc < 3 ? 3 : soc < 5 ? 2 : 1;
    return s;
  },
};
