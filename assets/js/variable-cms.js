/* ════════════════════════════════════════════════════════════
   NAITRO Variable CMS bridge
   Powers /soil-variables/ from the Airtable base:
     https://airtable.com/appcpFBCzVfQgK4zj/tblPQAi77LZNHdzoS/viweYpNHh8z3OPgSu

   Same cache-first pattern as /assets/js/airtable-cms.js:
     • Local data (/assets/data/soil-variables.js) renders FIRST —
       zero network wait, works offline, never blocks the page.
     • If Airtable credentials are configured below AND the base
       has been shared with this integration, a background fetch
       overlays live text + image attachments once it resolves.

   ── Expected Airtable schema (table: tblPQAi77LZNHdzoS) ──
   One row per variable, matching the columns already in the
   NZ_Soil_Health_Platform data model:
     Variable                              single line text  (primary field)
     Category                              single line text
     Unit / Type                           single line text
     Description                           single line text
     NZ-Specific Note                      long text
     High-Medium Threshold                 number
     Medium-Low Threshold                  number
     High: AI Image generation prompt      long text
     Medium: AI Image generation prompt    long text
     Low: AI Image generation prompt       long text
     High image                            attachment   ← pulled into the page
     Medium image                          attachment   ← pulled into the page
     Low image                             attachment   ← pulled into the page

   The three "*: AI Image generation prompt" fields are kept even
   once images exist — they're the regeneration spec if an image
   needs to be redone, and the alt text for the <img> in the page.
   ════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  const AIRTABLE_CONFIG = {
    baseId: 'appcpFBCzVfQgK4zj',
    tableId: 'tblPQAi77LZNHdzoS',
    viewId: 'viweYpNHh8z3OPgSu',
    apiKey: null,          // read-only personal access token, scoped to this base only
    timeoutMs: 3000,
  };

  function isConfigured() {
    return !!(AIRTABLE_CONFIG.baseId && AIRTABLE_CONFIG.apiKey);
  }

  async function fetchAllRecords() {
    const { baseId, tableId, viewId, apiKey, timeoutMs } = AIRTABLE_CONFIG;
    const url = `https://api.airtable.com/v0/${baseId}/${tableId}?view=${viewId}&pageSize=100`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${apiKey}` },
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(`Airtable ${res.status}`);
      const data = await res.json();
      return data.records || [];
    } finally {
      clearTimeout(timer);
    }
  }

  function attachmentUrl(field) {
    return (field && field[0] && field[0].url) || null;
  }

  function mergeRecordIntoVariable(record, localVar) {
    const f = record.fields || {};
    return {
      ...localVar,
      name: f['Variable'] || localVar.name,
      category: f['Category'] || localVar.category,
      unit: f['Unit / Type'] || localVar.unit,
      description: f['Description'] || localVar.description,
      nzNote: f['NZ-Specific Note'] || localVar.nzNote,
      thresholds: {
        highMedium: f['High-Medium Threshold'] ?? localVar.thresholds.highMedium,
        mediumLow: f['Medium-Low Threshold'] ?? localVar.thresholds.mediumLow,
      },
      states: {
        high: {
          label: localVar.states.high.label,
          visual: f['High: AI Image generation prompt'] || localVar.states.high.visual,
          imageUrl: attachmentUrl(f['High image']) || localVar.states.high.imageUrl,
        },
        medium: {
          label: localVar.states.medium.label,
          visual: f['Medium: AI Image generation prompt'] || localVar.states.medium.visual,
          imageUrl: attachmentUrl(f['Medium image']) || localVar.states.medium.imageUrl,
        },
        low: {
          label: localVar.states.low.label,
          visual: f['Low: AI Image generation prompt'] || localVar.states.low.visual,
          imageUrl: attachmentUrl(f['Low image']) || localVar.states.low.imageUrl,
        },
      },
    };
  }

  /**
   * Returns local variables immediately for fast first paint.
   * If Airtable is configured, fetches the live table in the
   * background and calls onRefresh(mergedVariables) once resolved.
   * targetIds: optional array of variable `id`s to keep (others dropped).
   */
  function getVariables(localVariables, targetIds, onRefresh) {
    const filtered = targetIds
      ? localVariables.filter(v => targetIds.includes(v.id))
      : localVariables;

    if (isConfigured() && typeof onRefresh === 'function') {
      fetchAllRecords()
        .then(records => {
          const byName = {};
          records.forEach(r => { if (r.fields && r.fields['Variable']) byName[r.fields['Variable']] = r; });
          const merged = filtered.map(v => byName[v.name] ? mergeRecordIntoVariable(byName[v.name], v) : v);
          onRefresh(merged);
        })
        .catch(err => console.warn('VariableCMS: live fetch failed, local data stands', err));
    }
    return filtered;
  }

  global.VariableCMS = { getVariables, isConfigured, configure: (opts) => Object.assign(AIRTABLE_CONFIG, opts) };
})(window);
