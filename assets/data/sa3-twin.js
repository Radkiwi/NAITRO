/* NAITRO Digital Twin — local fallback data for SA3 (Kaapzicht Estate, Stellenbosch). */
window.NAITRO_TWIN_DATA = window.NAITRO_TWIN_DATA || {};
window.NAITRO_TWIN_DATA.sa3 = {
  id: 'sa3',
  base: 2025,
  title: '1 m³ soil block · Kaapzicht Estate',
  subtitle: 'Paddock-level model · Cape granitic viticulture transition',
  accent: '#6B2D8B',
  inputAccent: '#6B2D8B',
  outputAccent: '#185FA5',
  bandPast: '2020 — biodynamic baseline',
  bandFuture: '2035 — premium AMF network',
  emptyDetailBody: 'Click any card to explore how that variable connects to the Cape granitic soil system and wine quality outcomes.',
  primingLabels: { high: 'High priming risk', medium: 'Medium priming risk', low: 'Low priming risk' },

  scenarios: [
    { id: 'baseline', label: 'Current farm' },
    { id: 'rdi', label: 'Deficit irrigation' },
    { id: 'myco', label: 'AMF cover crops' },
    { id: 'full', label: 'Full carbon + premium' },
  ],

  scens: {
    baseline: { n: 48, water: 320, soc: 2.9, myco: 62, comp: 22, macro: 58, infilt: 18, quality: 91, carbon: 28 },
    rdi: { n: 45, water: 240, soc: 3.1, myco: 65, comp: 20, macro: 62, infilt: 20, quality: 93, carbon: 32 },
    myco: { n: 40, water: 270, soc: 3.5, myco: 78, comp: 18, macro: 68, infilt: 24, quality: 95, carbon: 38 },
    full: { n: 32, water: 210, soc: 4.2, myco: 88, comp: 12, macro: 78, infilt: 30, quality: 98, carbon: 52 },
  },
  mods: {
    baseline: { soc: [-.2, 0, .5], myco: [-8, 0, 10], comp: [4, 0, -5], n: [10, 0, -8] },
    rdi: { soc: [-.1, 0, .7], myco: [-6, 0, 12], comp: [3, 0, -8], n: [8, 0, -12] },
    myco: { soc: [-.1, 0, 1.0], myco: [-5, 0, 15], comp: [2, 0, -10], n: [6, 0, -15] },
    full: { soc: [-.05, 0, 1.5], myco: [-3, 0, 20], comp: [1, 0, -14], n: [4, 0, -20] },
  },

  inputs: [
    { id: 'sun', icon: 'ti-sun', name: 'Sunlight', key: null, unit: 'kJ/m²/day', desc: 'Stellenbosch averages 3,100 sunshine hours/year — near-ideal for premium viticulture. Sunlight drives phenolic compound synthesis in the berry skin, the primary driver of wine quality.', stats: [{ l: 'Sunshine hours', v: '3,100/yr' }, { l: 'Optimal ripening', v: 'Feb–Apr' }], alert: null },
    { id: 'rain', icon: 'ti-cloud-rain', name: 'Rainfall', key: null, unit: 'mm/yr', desc: 'Mediterranean winter rainfall averaging 680 mm — declining 15% over 10 years per Cape Climate data. Deficit irrigation bridges the dry summer growing season.', stats: [{ l: 'Annual rainfall', v: '680 mm' }, { l: '10-yr trend', v: '−15% declining' }], alert: { t: 'warn', m: 'Cape Climate projections show a further 10–20% rainfall reduction by 2035. Soil health improvements (SOC, AMF) reduce irrigation need by 20–30%.' } },
    { id: 'n', icon: 'ti-flask', name: 'N applied', key: 'n', unit: 'kg N/ha/yr', fmt: v => Math.round(v) + ' kg N/ha', desc: '48 kg N/ha is 40% below the Cape winelands average — a direct result of the biodynamic transition. Lower N reduces vegetative vigour and concentrates berry flavour compounds.', stats: [{ l: 'Current rate', v: null }, { l: 'Biodynamic target', v: '30–45 kg N/ha' }], alert: { t: 'ok', m: 'N application is already near-optimal. Further reductions to 30–35 kg/ha should be phased as mycorrhizal network develops — the AMF network will supplement mineral N access.' } },
    { id: 'water', icon: 'ti-droplet', name: 'Irrigation', key: 'water', unit: 'mm/yr', fmt: v => Math.round(v) + ' mm/yr', desc: '320 mm/yr deficit irrigation is at the DWS licence limit. Regulated deficit irrigation (RDI) can reduce water use by 25% while improving berry quality through controlled stress.', stats: [{ l: 'Current use', v: null }, { l: 'DWS licence limit', v: '320 mm/yr' }], alert: { t: 'warn', m: 'DWS is reviewing irrigation allocations across the Western Cape — proactive reduction now protects licence continuity under future water cuts.' } },
    { id: 'myco', icon: 'ti-atom', name: 'Mycorrhizae', key: 'myco', unit: '% AMF', fmt: v => Math.round(v) + '% AMF', desc: 'Arbuscular mycorrhizal fungi (AMF) colonisation is the most important indicator for Cape granite viticulture. AMF extend the effective root radius 10–100×, accessing phosphorus and water unavailable to roots alone.', stats: [{ l: 'AMF colonisation', v: null }, { l: 'Premium estate target', v: '>80% colonisation' }], alert: null },
  ],
  outputs: [
    { id: 'quality', icon: 'ti-wine', name: 'Wine quality', key: 'quality', unit: 'pts', fmt: v => Math.round(v) + ' pts', desc: 'Robert Parker / Wine Spectator 100-pt score correlates directly with soil health in granitic terroir. AMF density, SOC, and low N are the three primary predictors of premium score.', stats: [{ l: 'Current score', v: null }, { l: 'EU premium threshold', v: '94+ points' }], alert: { t: 'ok', m: 'At 91 points, the estate is 3 points below the EU Green Deal premium import tier. Mycorrhizal enhancement is the most direct path to closing this gap.' } },
    { id: 'soc', icon: 'ti-leaf', name: 'Soil carbon', key: 'soc', unit: '%', fmt: v => v.toFixed(1) + '%', desc: 'SOC at 2.9% is good for granitic soil but has significant upside. Each 0.1% SOC increase on 185 ha represents 88 tonnes of CO₂ equivalent sequestered.', stats: [{ l: 'Current SOC', v: null }, { l: 'Target SOC', v: '>4% by 2035' }], alert: null },
    { id: 'carbon', icon: 'ti-cloud', name: 'Carbon credits', key: 'carbon', unit: 't CO₂/yr', fmt: v => Math.round(v) + ' t CO₂/yr', desc: 'Annual carbon sequestration eligible for Verra VCS or Gold Standard credits. NAITRO MRV provides the IoT-verified measurement data required for registration without external auditing.', stats: [{ l: 'Credits/yr', v: null }, { l: 'Market price', v: '$18–22/t CO₂' }], alert: { t: 'ok', m: 'At 28 t CO₂/yr and $20/t average, carbon credit income is R9,000–11,000/yr. Full biodynamic scenario delivers 52 t CO₂/yr = R17,000–21,000/yr.' } },
    { id: 'water2', icon: 'ti-ripple', name: 'Water efficiency', key: 'infilt', unit: 'mm/hr', fmt: v => v.toFixed(1) + ' mm/hr', desc: 'Healthy granitic soil with high AMF and SOC absorbs and holds rainfall far more efficiently, reducing irrigation demand by reducing drainage losses and improving soil water retention.', stats: [{ l: 'Infiltration rate', v: null }, { l: 'Water held/ha', v: '680 t/ha per 1% SOC' }], alert: null },
    { id: 'myco2', icon: 'ti-test-pipe', name: 'AMF network', key: 'myco', unit: '% AMF', fmt: v => Math.round(v) + '% AMF', desc: 'Mycorrhizal colonisation drives wine quality through phosphorus uptake efficiency, drought resilience, and flavour compound precursor biosynthesis in the berry.', stats: [{ l: 'AMF colonisation', v: null }, { l: 'Premium threshold', v: '>80%' }], alert: null },
  ],
  layers: [
    { name: 'SOC', key: 'soc', max: 6, color: '#6B2D8B' },
    { name: 'Mycorrhizae', key: 'myco', max: 100, color: '#185FA5' },
    { name: 'Macropores', key: 'macro', max: 100, color: '#1A7A5A' },
    { name: 'Compaction', key: 'comp', max: 100, color: '#D85A30' },
  ],

  health(ctx) {
    const soc = ctx.gv('soc'), myco = ctx.gv('myco'), comp = ctx.gv('comp'), n = ctx.gv('n');
    return Math.round(Math.min(soc / 5, 1) * 25 + myco / 100 * 30 + (1 - comp / 100) * 25 + Math.min((80 - n) / 80, 1) * 20);
  },
  priming(ctx) {
    const soc = ctx.gv('soc'), n = ctx.gv('n'), comp = ctx.gv('comp');
    let s = 0;
    s += soc < 2 ? 3 : soc < 3.5 ? 2 : 1;
    s += n > 80 ? 3 : n > 50 ? 2 : 1;
    s += comp > 50 ? 3 : comp > 25 ? 2 : 1;
    return s;
  },
};
