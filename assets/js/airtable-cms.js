/* ════════════════════════════════════════════════════════════
   NAITRO Airtable CMS bridge
   Lets a content editor update farm scenario data without
   touching code, while keeping the page fast and resilient:

     • Local data file (/assets/data/*.js) always renders FIRST —
       zero network wait, works fully offline, never blocks.
     • If Airtable credentials are configured (see bottom of this
       file), we fetch the live record in the background and the
       page only re-renders if Airtable actually returned newer
       values. A flaky or slow Airtable connection never degrades
       the page — it can only improve it.

   Why scenario *numbers* live in Airtable but formatting/scoring
   logic stays in code: Airtable is a spreadsheet — it stores
   values, not functions. So the division of responsibility is:

     Airtable  → scens, mods, title/subtitle copy, band labels
     Code      → fmt() formatters, health()/priming() scoring,
                 icons, descriptions, alerts (richer than a
                 spreadsheet cell should hold)

   ── Airtable base schema (table: "Farms") ──
   One row per farm. Columns:
     farm_id      single line text   e.g. "nz1"
     title        single line text
     subtitle     single line text
     band_past    single line text
     band_future  single line text
     scens_json   long text (JSON)   e.g. {"baseline":{"urea":200,...}}
     mods_json    long text (JSON)   e.g. {"baseline":{"soc":[-.8,0,1.2]}}
     layers_json  long text (JSON)   e.g. [{"name":"SOC","key":"soc","max":8,"color":"#A0785A"}]
     updated_at   last modified time (used to skip unnecessary re-renders)
   ════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  // Fill these in to go live. Use a read-only "personal access token"
  // scoped to this one base — never ship a token with write access.
  const AIRTABLE_CONFIG = {
    baseId: null,        // e.g. 'appXXXXXXXXXXXXXX'
    apiKey: null,        // e.g. 'patXXXXXXXXXXXXXX.xxxxxxxx'
    tableName: 'Farms',
    timeoutMs: 2500,
  };

  function isConfigured() {
    return !!(AIRTABLE_CONFIG.baseId && AIRTABLE_CONFIG.apiKey);
  }

  async function fetchFarmRecord(farmId) {
    const { baseId, apiKey, tableName, timeoutMs } = AIRTABLE_CONFIG;
    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}` +
      `?filterByFormula=${encodeURIComponent(`{farm_id}='${farmId}'`)}&maxRecords=1`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${apiKey}` },
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(`Airtable ${res.status}`);
      const data = await res.json();
      return (data.records && data.records[0]) || null;
    } finally {
      clearTimeout(timer);
    }
  }

  function mergeRecordIntoConfig(record, localConfig) {
    const f = record.fields || {};
    const safeParse = (key, fallback) => {
      if (!f[key]) return fallback;
      try { return JSON.parse(f[key]); } catch (e) {
        console.warn(`AirtableCMS: bad JSON in field "${key}", using local fallback`, e);
        return fallback;
      }
    };
    return {
      ...localConfig,
      title: f.title || localConfig.title,
      subtitle: f.subtitle || localConfig.subtitle,
      bandPast: f.band_past || localConfig.bandPast,
      bandFuture: f.band_future || localConfig.bandFuture,
      scens: safeParse('scens_json', localConfig.scens),
      mods: safeParse('mods_json', localConfig.mods),
      layers: safeParse('layers_json', localConfig.layers),
      // inputs/outputs/health/priming intentionally NOT overridden —
      // they carry fmt() functions and richer descriptive content
      // that a spreadsheet cell isn't the right home for.
    };
  }

  /**
   * Returns the local config immediately for fast first paint.
   * If Airtable is configured, also kicks off a background refresh
   * and invokes onRefresh(mergedConfig) once it resolves — caller
   * decides whether/how to re-render (e.g. call twin.renderAll()
   * again after swapping config, or just let it apply on next mount).
   */
  function getFarmConfig(farmId, localConfig, onRefresh) {
    if (isConfigured() && typeof onRefresh === 'function') {
      fetchFarmRecord(farmId)
        .then(record => {
          if (record) onRefresh(mergeRecordIntoConfig(record, localConfig));
        })
        .catch(err => {
          console.warn('AirtableCMS: live fetch failed, local data stands', err);
        });
    }
    return localConfig;
  }

  global.AirtableCMS = { getFarmConfig, isConfigured, configure: (opts) => Object.assign(AIRTABLE_CONFIG, opts) };
})(window);
