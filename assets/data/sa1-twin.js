/* NAITRO Digital Twin — local fallback data for SA1 (Bergvlei Grains, Free State). */
window.NAITRO_TWIN_DATA = window.NAITRO_TWIN_DATA || {};
window.NAITRO_TWIN_DATA.sa1 = {
  id: 'sa1',
  base: 2025,
  title: '1 m³ soil block · Bergvlei Grains',
  subtitle: 'Paddock-level model · Free State pH correction & biological transition',
  accent: '#B5711A',
  inputAccent: '#B5711A',
  outputAccent: '#185FA5',
  bandPast: '2020 — pH 5.1 critical era',
  bandFuture: '2035 — biological recovery',
  emptyDetailBody: 'Click any card on the left or right to explore how that variable connects to the soil biology and what decisions can change it.',
  primingLabels: { high: 'High priming risk', medium: 'Medium priming risk', low: 'Low priming risk' },

  scenarios: [
    { id: 'baseline', label: 'Current farm' },
    { id: 'lime', label: 'Lime correction' },
    { id: 'cover', label: 'Cover crops' },
    { id: 'full', label: 'Full regenerative' },
  ],

  scens: {
    baseline: { lan: 145, lime: 0, soc: 1.8, ph: 5.1, zn: 0.6, bnf: 22, comp: 62, macro: 28, infilt: 4, erosion: 75 },
    lime: { lan: 130, lime: 2.5, soc: 2.0, ph: 5.8, zn: 0.8, bnf: 28, comp: 55, macro: 34, infilt: 7, erosion: 55 },
    cover: { lan: 100, lime: 2.5, soc: 2.6, ph: 6.1, zn: 1.0, bnf: 38, comp: 40, macro: 48, infilt: 14, erosion: 30 },
    full: { lan: 60, lime: 2.0, soc: 3.5, ph: 6.3, zn: 1.2, bnf: 55, comp: 18, macro: 65, infilt: 24, erosion: 12 },
  },
  mods: {
    baseline: { soc: [-.4, 0, .6], bnf: [-5, 0, 3], comp: [8, 0, -5], lan: [20, 0, -10] },
    lime: { soc: [-.3, 0, .9], bnf: [-4, 0, 10], comp: [6, 0, -12], lan: [15, 0, -30] },
    cover: { soc: [-.2, 0, 1.4], bnf: [-3, 0, 18], comp: [4, 0, -20], lan: [10, 0, -40] },
    full: { soc: [-.1, 0, 2.0], bnf: [-2, 0, 25], comp: [3, 0, -28], lan: [8, 0, -50] },
  },

  inputs: [
    { id: 'sun', icon: 'ti-sun', name: 'Sunlight', key: null, unit: 'kJ/m²/day', desc: 'Free State receives 2,900–3,100 sunshine hours/year — among the highest globally. Ideal for maize photosynthesis when soil biology can support it.', stats: [{ l: 'Annual sunshine', v: '3,050 hrs' }, { l: 'Summer peak', v: 'Oct–Feb' }], alert: null },
    { id: 'rain', icon: 'ti-cloud-rain', name: 'Rainfall', key: null, unit: 'mm/season', desc: 'Summer rainfall (450–550 mm) comes in high-intensity events that overwhelm compacted soil. Low SOC means water runs off rather than infiltrating.', stats: [{ l: 'Annual rainfall', v: '510 mm' }, { l: 'Intensity risk', v: 'High — compaction' }], alert: { t: 'warn', m: 'Current infiltration rate of 4 mm/hr means over 60% of summer rainfall is lost as runoff, carrying topsoil and nutrients.' } },
    { id: 'lan', icon: 'ti-flask', name: 'LAN applied', key: 'lan', unit: 'kg N/ha/yr', fmt: v => Math.round(v) + ' kg N/ha', desc: 'Limestone ammonium nitrate at 145 kg N/ha on pH 5.1 soil is significantly less efficient than target. Acid soils acidify further with repeated LAN applications, creating a downward spiral.', stats: [{ l: 'Current rate', v: null }, { l: 'Optimal rate', v: '100–110 kg N/ha' }], alert: { t: 'warn', m: 'LAN is acidifying the soil further with each application. Switching to urea or liquid N reduces acidification rate by 60%.' } },
    { id: 'lime', icon: 'ti-droplet', name: 'Lime applied', key: 'lime', unit: 't/ha', fmt: v => v.toFixed(1) + ' t/ha', desc: 'Dolomitic lime corrects pH and adds calcium and magnesium — both critical for maize root development and chlorophyll synthesis.', stats: [{ l: 'Last lime app', v: '4 years ago' }, { l: 'Current pH', v: '5.1 — critical' }], alert: { t: 'warn', m: 'pH has dropped 0.3 units since last lime application. Immediate re-liming required.' } },
    { id: 'min', icon: 'ti-atom', name: 'Trace minerals', key: 'zn', unit: 'Zn / S / B', fmt: v => v.toFixed(1) + ' mg/kg', desc: 'Zinc deficiency is widespread in SA Highveld soils. Critical for maize pollen viability and grain fill. Sulphur deficiency limits protein synthesis.', stats: [{ l: 'Zinc level', v: null }, { l: 'Sufficiency', v: '>1.0 mg/kg' }], alert: { t: 'warn', m: 'Zinc at 0.6 mg/kg is below sufficiency. Maize yield loss from Zn deficiency estimated at 0.8–1.2 t/ha.' } },
  ],
  outputs: [
    { id: 'yield', icon: 'ti-bread', name: 'Maize yield', key: null, unit: 't/ha', desc: 'Current yield of 6.8 t/ha vs a biological potential of 9–11 t/ha on this soil type with correct pH and soil biology.', stats: [{ l: 'Current yield', v: '6.8 t/ha' }, { l: 'Soil potential', v: '9–11 t/ha' }], alert: { t: 'warn', m: 'Yield gap of 2–4 t/ha is directly attributable to pH, compaction, and low SOC. No additional inputs needed — only soil correction.' } },
    { id: 'bnf', icon: 'ti-test-pipe', name: 'N fixation', key: 'bnf', unit: '% of N', fmt: v => Math.round(v) + '% of N', desc: 'Soya bean rotation with rhizobia inoculation is the most cost-effective N source available. Currently contributing only 22% of N due to low pH inhibiting rhizobia activity.', stats: [{ l: 'BNF contribution', v: null }, { l: 'Potential at pH 6.2', v: '55–65% of N' }], alert: null },
    { id: 'erosion', icon: 'ti-wind', name: 'Erosion risk', key: 'erosion', unit: '% risk', fmt: v => Math.round(v) + '%', desc: 'Low SOC + compaction + bare winter fallow = active wind and water erosion. The Free State loses an estimated 8–12 t/ha/yr of topsoil under conventional bare-till maize.', stats: [{ l: 'Erosion risk', v: null }, { l: 'Acceptable', v: '<20%' }], alert: { t: 'warn', m: 'At current erosion rate, the farm is losing approximately R650/ha/yr in topsoil fertility value that cannot be replaced with fertiliser.' } },
    { id: 'infilt', icon: 'ti-ripple', name: 'Water use', key: 'infilt', unit: 'mm/hr', fmt: v => v.toFixed(1) + ' mm/hr', desc: 'Water infiltration determines how much of summer rainfall is captured vs lost as runoff. Target for clay-loam ferralsol is >15 mm/hr.', stats: [{ l: 'Infiltration rate', v: null }, { l: 'Target', v: '>15 mm/hr' }], alert: { t: 'warn', m: 'At 4 mm/hr, the soil is shedding water in every rain event. No-till and cover crops can restore infiltration to >15 mm/hr within 2 seasons.' } },
    { id: 'nue', icon: 'ti-bolt', name: 'NUE', key: null, unit: 'N use efficiency', desc: 'Nutrient use efficiency — N in grain divided by N applied. Currently at 38% due to low pH, leaching, and poor timing. Target is 55–65%.', stats: [{ l: 'Current NUE', v: '38%' }, { l: 'Target NUE', v: '55–65%' }], alert: null },
  ],
  layers: [
    { name: 'SOC', key: 'soc', max: 6, color: '#8B6340' },
    { name: 'Macropores', key: 'macro', max: 100, color: '#6B8B40' },
    { name: 'BNF', key: 'bnf', max: 100, color: '#185FA5' },
    { name: 'Compaction', key: 'comp', max: 100, color: '#D85A30' },
  ],

  health(ctx) {
    const soc = ctx.gv('soc'), bnf = ctx.gv('bnf'), comp = ctx.gv('comp'), ph = ctx.scen.ph;
    return Math.round(Math.min(soc / 5, 1) * 25 + bnf / 100 * 25 + (1 - comp / 100) * 25 + Math.min((ph - 4.5) / 2, 1) * 25);
  },
  priming(ctx) {
    const soc = ctx.gv('soc'), lan = ctx.gv('lan'), ph = ctx.scen.ph;
    let s = 0;
    s += soc < 2 ? 3 : soc < 3 ? 2 : 1;
    s += lan > 130 ? 3 : lan > 90 ? 2 : 1;
    s += ph < 5.5 ? 3 : ph < 6.0 ? 2 : 1;
    return s;
  },
};
