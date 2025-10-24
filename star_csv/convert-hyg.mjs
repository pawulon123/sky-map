// convert-hyg.js
import fs from 'fs';
import { csvParse } from 'd3-dsv';

// 🔹 Pomocnicza funkcja do konwersji tekst -> liczba
function toNum(v) {
  if (v === '' || v == null) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

// 🔹 Ścieżki
const INPUT_CSV = './hyg_v42.csv';       // <- zmień jeśli masz inny plik (np. hyg_v42.csv)
const OUTPUT_JSON = './hyg-stars.json';     // <- wynikowy plik

console.log('⏳ Wczytywanie CSV...');
const text = fs.readFileSync(INPUT_CSV, 'utf8');

// 🔹 Parsowanie CSV
const rows = csvParse(text);
console.log(`📄 Wczytano ${rows.length.toLocaleString()} rekordów`);

// 🔹 Mapa wierszy -> obiekty Star
const stars = [];
for (const r of rows) {
  const ra = toNum(r['ra']);
  const dec = toNum(r['dec']);
  if (ra == null || dec == null) continue;

  const s = {
    id: toNum(r['hip']) ?? toNum(r['hd']) ?? toNum(r['hr']) ?? toNum(r['id']),
    ra,
    ra_deg: ra * 15,
    dec,
    mag: toNum(r['mag']),
    dist_pc: toNum(r['dist']),
    name: (r['proper'] || '').trim() || undefined,
    spect: (r['spect'] || '').trim() || undefined,
    ci: toNum(r['ci']),
    hip: toNum(r['hip']),
    hd: toNum(r['hd']),
    hr: toNum(r['hr']),
    bayer: (r['bayer'] || '').trim() || undefined,
    flam: toNum(r['flam']),
    con: (r['con'] || '').trim() || undefined,
  };

  // opcjonalnie filtruj gwiazdy tylko do mag <= 6
  if (s.mag != null && s.mag > 6) continue;

  stars.push(s);
}

// 🔹 Tworzymy strukturę zgodną z Twoim Angularowym StarsData
const starsData = {
  meta: { name: 'HYG Database v3/v4', source: 'Astronexus', epoch: 'J2000' },
  stars,
};

console.log(`✨ Zapisuję ${stars.length.toLocaleString()} gwiazd do JSON...`);
fs.writeFileSync(OUTPUT_JSON, JSON.stringify(starsData, null, 2), 'utf8');

console.log('✅ Gotowe! Wynik zapisany w', OUTPUT_JSON);
