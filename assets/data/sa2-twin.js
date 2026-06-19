/* NAITRO Digital Twin — local fallback data for SA2 (Umfolozi Cane, KwaZulu-Natal). */
window.NAITRO_TWIN_DATA = window.NAITRO_TWIN_DATA || {};
window.NAITRO_TWIN_DATA.sa2 = {
  id: 'sa2',
  base: 2025,
  title: '1 m³ soil block · Umfolozi Cane Estate',
  subtitle: 'Paddock-level model · KZN green cane & biological transition',
  accent: '#2E8B1A',
  inputAccent: '#2E8B1A',
  outputAccent: '#185FA5',
  bandPast: '2020 — 100% trash burning era',
  bandFuture: '2035 — biological recovery',
  emptyDetailBody: 'Click any card to explore how that variable connects to the sugarcane soil system.',
  primingLabels: { high: 'Critical priming risk', medium: 'Medium priming risk', low: 'Low priming risk' },

  scenarios: [
    { id: 'baseline', label: 'Current farm' },
    { id: 'noburn', label: 'No-burn / green cane' },
    { id: 'fertig', label: 'Fertigation' },
    { id: 'full', label: 'Full CTF + biological' },
  ],

  scens: {
    baseline: { n: 220, burn: 100, soc: 1.4, si: 18, comp: 78, macro: 18, infilt: 3, ratoon: 68, bnf: 12 },
    noburn: { n: 200, burn: 0, soc: 1.8, si: 20, comp: 70, macro: 25, infilt: 6, ratoon: 72, bnf: 15 },
    fertig: { n: 130, burn: 0, soc: 2.4, si: 24, comp: 55, macro: 40, infilt: 12, ratoon: 82, bnf: 22 },
    full: { n: 80, burn: 0, soc: 3.2, si: 30, comp: 22, macro: 62, infilt: 22, ratoon: 96, bnf: 38 },
  },
  mods: {
    baseline: { soc: [-.5, 0, .3], bnf: [-4, 0, 2], comp: [8, 0, -3], n: [30, 0, -10] },
    noburn: { soc: [-.3, 0, .8], bnf: [-3, 0, 6], comp: [6, 0, -10], n: [20, 0, -20] },
    fertig: { soc: [-.2, 0, 1.2], bnf: [-2, 0, 12], comp: [4, 0, -20], n: [15, 0, -40] },
    full: { soc: [-.1, 0, 1.8], bnf: [-1, 0, 20], comp: [2, 0, -30], n: [10, 0, -55] },
  },

  inputs: [
    { id: 'sun', icon: 'ti-sun', name: 'Sunlight', key: null, unit: 'kJ/m²/day', desc: 'KZN coastal receives 2,600–2,800 sunshine hours/year. Sugarcane is one of the most efficient C4 photosynthesisers — the biology is not the constraint. Soil health is.', stats: [{ l: 'Growing season', v: 'Oct–Jun' }, { l: 'Sunshine hours', v: '2,700/yr' }], alert: null },
    { id: 'rain', icon: 'ti-cloud-rain', name: 'Rainfall', key: null, unit: 'mm/yr', desc: '900–1,100 mm annual rainfall, concentrated Nov–Mar. High-intensity rainfall on compacted soil creates massive runoff and leaches N applied as broadcast urea before the crop can access it.', stats: [{ l: 'Annual rainfall', v: '980 mm' }, { l: 'Leaching risk', v: 'Very high' }], alert: { t: 'warn', m: 'At 78% compaction, >70% of rainfall events create surface runoff rather than infiltration — carrying 15–20 kg N/ha per major event.' } },
    { id: 'n', icon: 'ti-flask', name: 'N applied', key: 'n', unit: 'kg N/ha/yr', fmt: v => Math.round(v) + ' kg N/ha/yr', desc: '220 kg N/ha broadcast applied is the highest rate on the NAITRO platform. Combined with trash burning and compaction, NUE is estimated at only 28% — meaning 158 kg of every 220 kg is wasted.', stats: [{ l: 'Current rate', v: null }, { l: 'SASRI recommended', v: '130–150 kg N/ha' }], alert: { t: 'warn', m: 'At 28% NUE, R5,200/ha in fertiliser is wasted annually. Splitting via fertigation would immediately recover R3,500–4,800/ha.' } },
    { id: 'burn', icon: 'ti-flame', name: 'Trash burning', key: 'burn', unit: '%', fmt: v => Math.round(v) + '% area burned', desc: '100% trash burning is the single biggest driver of SOC decline in this system. Each burn destroys 8–12 t/ha of potential soil organic matter, releasing CO₂ and killing the soil biology that makes nutrients available.', stats: [{ l: 'Trash burned', v: '100%' }, { l: 'SOC loss from burning', v: '0.25%/yr' }], alert: { t: 'warn', m: 'Trash burning is destroying the equivalent of R1,800/ha/yr in soil fertility that cannot be replaced with fertiliser.' } },
    { id: 'si', icon: 'ti-atom', name: 'Silicon (Si)', key: 'si', unit: 'mg/kg', fmt: v => Math.round(v) + ' mg/kg', desc: 'Silicon is the most important trace element for sugarcane, strengthening cell walls against pests and drought stress. KZN soils are naturally Si-deficient and continuous cropping depletes Si faster than weathering replenishes it.', stats: [{ l: 'Si level', v: null }, { l: 'Sufficiency', v: '>30 mg/kg' }], alert: { t: 'warn', m: 'Si below 20 mg/kg significantly increases susceptibility to eldana borer and leaf scald disease — two of the major profitability threats in KZN.' } },
  ],
  outputs: [
    { id: 'ratoon', icon: 'ti-bread', name: 'Cane yield', key: 'ratoon', unit: 't/ha', fmt: v => Math.round(v) + ' t/ha', desc: 'Current 68 t/ha ratoon yield vs a biological potential of 100–110 t/ha on these soil types with healthy soil biology.', stats: [{ l: 'Current yield', v: null }, { l: 'Soil potential', v: '100–110 t/ha' }], alert: { t: 'warn', m: 'The 40 t/ha yield gap is worth approximately R24,000/ha/yr at current cane prices — entirely recoverable through soil management.' } },
    { id: 'bnf', icon: 'ti-test-pipe', name: 'Bio N fixation', key: 'bnf', unit: '% of N', fmt: v => Math.round(v) + '% of N', desc: 'Gluconacetobacter diazotrophicus is an endophytic N-fixer naturally present in healthy sugarcane. It thrives when soil biology is intact and synthetic N is not excessive.', stats: [{ l: 'BNF contribution', v: null }, { l: 'Potential at low N', v: '25–40% of N' }], alert: { t: 'ok', m: 'Reducing N application to <130 kg/ha will allow Gluconacetobacter populations to increase, delivering 25–40 kg N/ha from biological fixation.' } },
    { id: 'nleach', icon: 'ti-droplet', name: 'N leaching', key: null, unit: 'kg N/ha/yr', desc: 'N leaching into the Umdloti and Mhlali river systems is causing algal blooms and breaching DWS freshwater quality standards.', stats: [{ l: 'Est. N leaching', v: '72 kg/ha/yr' }, { l: 'DWS threshold', v: '<20 kg/ha/yr' }], alert: { t: 'warn', m: 'N leaching is 3.6× above the Department of Water and Sanitation threshold. This represents regulatory risk as well as a large financial loss.' } },
    { id: 'infilt', icon: 'ti-ripple', name: 'Water infiltration', key: 'infilt', unit: 'mm/hr', fmt: v => v.toFixed(1) + ' mm/hr', desc: 'Current infiltration rate of 3 mm/hr on compacted vertic clay means irrigation water also runs off before infiltrating. Irrigation efficiency is estimated at 35%.', stats: [{ l: 'Infiltration', v: null }, { l: 'Target', v: '>18 mm/hr' }], alert: { t: 'warn', m: 'At 3 mm/hr infiltration, 65% of irrigation water is wasted. CTF and biological treatment of compaction could save R2,400/ha/yr in irrigation costs.' } },
    { id: 'co2', icon: 'ti-bolt', name: 'Carbon balance', key: 'soc', unit: '%', fmt: v => v.toFixed(1) + '%', desc: 'The farm is currently a net carbon emitter due to trash burning (5 t CO₂/ha) and SOC depletion. Green cane + SOC recovery converts it to a net carbon sink within 4–6 years.', stats: [{ l: 'SOC level', v: null }, { l: 'Target', v: '>2.5% SOC' }], alert: null },
  ],
  layers: [
    { name: 'SOC', key: 'soc', max: 5, color: '#5A3A1A' },
    { name: 'Macropores', key: 'macro', max: 100, color: '#2E8B1A' },
    { name: 'BNF', key: 'bnf', max: 100, color: '#185FA5' },
    { name: 'Compaction', key: 'comp', max: 100, color: '#D85A30' },
  ],

  health(ctx) {
    const soc = ctx.gv('soc'), bnf = ctx.gv('bnf'), comp = ctx.gv('comp'), burn = ctx.scen.burn;
    return Math.round(Math.min(soc / 4, 1) * 25 + bnf / 100 * 25 + (1 - comp / 100) * 25 + (1 - burn / 100) * 25);
  },
  priming(ctx) {
    const soc = ctx.gv('soc'), n = ctx.gv('n'), burn = ctx.scen.burn;
    let s = 0;
    s += soc < 1.5 ? 3 : soc < 2.5 ? 2 : 1;
    s += n > 180 ? 3 : n > 120 ? 2 : 1;
    s += burn > 50 ? 3 : burn > 0 ? 2 : 1;
    return s;
  },
};
