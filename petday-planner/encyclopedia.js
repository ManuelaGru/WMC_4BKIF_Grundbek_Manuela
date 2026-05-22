// ════════════════════════════════════════
// encyclopedia.js – Tier-Lexikon Logik
// Neue Version: Rassen lokal gespeichert +
// Bilder von der Dog CEO API (kein Key!)
// ════════════════════════════════════════

// ── Favoriten aus localStorage laden ──
let favoriten = JSON.parse(localStorage.getItem('petday_favoriten') || '[]');

// ════════════════════════════════════════
// RASSEN-DATENBANK (lokal gespeichert)
// Kein API-Key nötig für die Info!
// Bilder kommen von der Dog CEO API
// ════════════════════════════════════════

// Array von Hunderassen-Objekten
const hundeRassen = [
  { id: 'labrador',     name: 'Labrador Retriever', herkunft: 'Kanada',       groesse: 'Groß',    gewicht: '25–36 kg', leben: '10–12 Jahre', charakter: ['Freundlich', 'Aktiv', 'Sanft'],       beschreibung: 'Einer der beliebtesten Familienhunde weltweit. Sehr lernwillig und kinderlieb.', apiName: 'labrador' },
  { id: 'golden',       name: 'Golden Retriever',   herkunft: 'Schottland',   groesse: 'Groß',    gewicht: '25–34 kg', leben: '10–12 Jahre', charakter: ['Geduldig', 'Zuverlässig', 'Intelligent'], beschreibung: 'Sanfter Familienfreund mit goldenem Fell. Ideal als Therapie- und Blindenhund.', apiName: 'retriever/golden' },
  { id: 'bulldog',      name: 'Bulldogge',          herkunft: 'England',      groesse: 'Mittel',  gewicht: '18–25 kg', leben: '8–10 Jahre',  charakter: ['Ruhig', 'Mutig', 'Freundlich'],       beschreibung: 'Trotz rauem Aussehen sehr sanft und liebevoll. Perfekt für ruhigere Haushalte.', apiName: 'bulldog/english' },
  { id: 'beagle',       name: 'Beagle',             herkunft: 'England',      groesse: 'Klein',   gewicht: '9–11 kg',  leben: '12–15 Jahre', charakter: ['Neugierig', 'Fröhlich', 'Sturköpfig'], beschreibung: 'Kleiner Jagdhund mit großer Nase. Sehr gesellig, braucht viel Bewegung.', apiName: 'beagle' },
  { id: 'poodle',       name: 'Pudel',              herkunft: 'Deutschland',  groesse: 'Variabel',gewicht: '3–30 kg',  leben: '12–15 Jahre', charakter: ['Intelligent', 'Aktiv', 'Stolz'],       beschreibung: 'Einer der intelligentesten Hunde. Hypoallergen und sehr lernfreudig.', apiName: 'poodle' },
  { id: 'husky',        name: 'Siberian Husky',     herkunft: 'Sibirien',     groesse: 'Mittel',  gewicht: '16–27 kg', leben: '12–14 Jahre', charakter: ['Energisch', 'Freundlich', 'Unabhängig'], beschreibung: 'Ausdauernder Schlittenhund mit Wolfsoptik. Braucht sehr viel Bewegung.', apiName: 'husky' },
  { id: 'shephrd',      name: 'Deutscher Schäfer',  herkunft: 'Deutschland',  groesse: 'Groß',    gewicht: '22–40 kg', leben: '9–13 Jahre',  charakter: ['Loyal', 'Mutig', 'Intelligent'],       beschreibung: 'Vielseitiger Arbeitshund. Ideal als Polizei-, Rettungs- und Familienhund.', apiName: 'germanshepherd' },
  { id: 'boxer',        name: 'Boxer',              herkunft: 'Deutschland',  groesse: 'Groß',    gewicht: '25–32 kg', leben: '10–12 Jahre', charakter: ['Verspielt', 'Treu', 'Energisch'],      beschreibung: 'Lebhafter und verspielter Hund. Sehr kinderlieb und schutzinstinktiv.', apiName: 'boxer' },
  { id: 'dachshund',    name: 'Dackel',             herkunft: 'Deutschland',  groesse: 'Klein',   gewicht: '4–9 kg',   leben: '12–16 Jahre', charakter: ['Mutig', 'Neugierig', 'Sturköpfig'],   beschreibung: 'Der typisch deutsche Hund. Klein aber mutig – bekannt für seinen langen Körper.', apiName: 'dachshund' },
  { id: 'chihuahua',    name: 'Chihuahua',          herkunft: 'Mexiko',       groesse: 'Sehr klein', gewicht: '1–3 kg', leben: '14–16 Jahre', charakter: ['Lebhaft', 'Anhänglich', 'Alert'],   beschreibung: 'Kleinste Hunderasse der Welt. Sehr anhänglich und temperamentvoll.', apiName: 'chihuahua' },
  { id: 'pug',          name: 'Mops',               herkunft: 'China',        groesse: 'Klein',   gewicht: '6–9 kg',   leben: '12–15 Jahre', charakter: ['Verspielt', 'Charmant', 'Ruhig'],     beschreibung: 'Geselliger Stubenhund mit faltigem Gesicht. Liebt Menschen und Kuscheln.', apiName: 'pug' },
  { id: 'bordercollie', name: 'Border Collie',      herkunft: 'Schottland',   groesse: 'Mittel',  gewicht: '14–20 kg', leben: '12–15 Jahre', charakter: ['Intelligent', 'Energisch', 'Loyal'],  beschreibung: 'Gilt als intelligenteste Hunderasse. Braucht viel geistige und körperliche Auslastung.', apiName: 'collie/border' },
];

// Array von Katzenrassen-Objekten
const katzenRassen = [
  { id: 'perser',      name: 'Perser',           herkunft: 'Iran',        groesse: 'Mittel',  gewicht: '3–7 kg',   leben: '12–17 Jahre', charakter: ['Ruhig', 'Sanft', 'Anhänglich'],        beschreibung: 'Ruhige und würdevolle Katze mit langem Fell. Liebt entspannte Wohnungen.' },
  { id: 'maine',       name: 'Maine Coon',       herkunft: 'USA',         groesse: 'Groß',    gewicht: '4–11 kg',  leben: '12–15 Jahre', charakter: ['Freundlich', 'Verspielt', 'Intelligent'], beschreibung: 'Größte Hauskatzenrasse. Sehr sozial, versteht sich gut mit Kindern und Hunden.' },
  { id: 'siamese',     name: 'Siamkatze',        herkunft: 'Thailand',    groesse: 'Mittel',  gewicht: '3–5 kg',   leben: '15–20 Jahre', charakter: ['Gesprächig', 'Sozial', 'Intelligent'],  beschreibung: 'Sehr kommunikative Katze. Liebt Gesellschaft und "unterhält sich" mit ihrem Menschen.' },
  { id: 'ragdoll',     name: 'Ragdoll',          herkunft: 'USA',         groesse: 'Groß',    gewicht: '4–9 kg',   leben: '12–15 Jahre', charakter: ['Sanft', 'Entspannt', 'Anhänglich'],    beschreibung: 'Wird beim Hochnehmen schlaff wie eine Puppe. Extrem sanft und menschenbezogen.' },
  { id: 'british',     name: 'Britisch Kurzhaar',herkunft: 'England',     groesse: 'Mittel',  gewicht: '4–8 kg',   leben: '14–20 Jahre', charakter: ['Ruhig', 'Ausgeglichen', 'Selbständig'], beschreibung: 'Plüschige Katze mit runden Augen. Ruhig und pflegeleicht, gut für Wohnungen.' },
  { id: 'bengal',      name: 'Bengalkatze',      herkunft: 'USA',         groesse: 'Mittel',  gewicht: '3–7 kg',   leben: '12–16 Jahre', charakter: ['Aktiv', 'Verspielt', 'Neugierig'],     beschreibung: 'Wildkatzen-Look mit Hauskatzen-Charakter. Sehr aktiv und klettert gerne.' },
  { id: 'scottish',    name: 'Scottish Fold',    herkunft: 'Schottland',  groesse: 'Mittel',  gewicht: '3–6 kg',   leben: '11–14 Jahre', charakter: ['Ruhig', 'Anpassungsfähig', 'Sanft'],   beschreibung: 'Erkennbar an den gefalteten Ohren. Sehr anpassungsfähig und familienfreundlich.' },
  { id: 'abyssinian', name: 'Abessinier',        herkunft: 'Äthiopien',   groesse: 'Mittel',  gewicht: '3–5 kg',   leben: '14–17 Jahre', charakter: ['Aktiv', 'Neugierig', 'Verspielt'],     beschreibung: 'Eine der ältesten Katzenrassen. Sehr aktiv, klug und braucht viel Beschäftigung.' },
  { id: 'sphynx',      name: 'Sphynx',           herkunft: 'Kanada',      groesse: 'Mittel',  gewicht: '3–5 kg',   leben: '13–15 Jahre', charakter: ['Energisch', 'Anhänglich', 'Neugierig'], beschreibung: 'Die haarlose Katze. Sehr wärmeliebend und anhänglich – sucht immer Körperkontakt.' },
  { id: 'norwegisch',  name: 'Norwegische Waldkatze', herkunft: 'Norwegen', groesse: 'Groß', gewicht: '4–9 kg',   leben: '14–16 Jahre', charakter: ['Selbständig', 'Aktiv', 'Freundlich'],  beschreibung: 'Robuste Katze für kalte Klimata. Liebt Klettern und hat ein dichtes Fell.' },
];

// ════════════════════════════════════════
// FUNKTION: Tab wechseln
// ════════════════════════════════════════
function tabWechseln(tab) {
  const bereiche = ['hunde', 'katzen', 'favoriten', 'karte'];
  bereiche.forEach(b => {
    document.getElementById(`bereich-${b}`).style.display = 'none';
    const btn = document.getElementById(`tab-${b}`);
    if (btn) {
      btn.className = 'btn btn-grau';
    }
  });

  document.getElementById(`bereich-${tab}`).style.display = 'block';
  const tabBtn = document.getElementById(`tab-${tab}`);
  if (tab === 'hunde')     tabBtn.className = 'btn btn-orange';
  if (tab === 'katzen')    tabBtn.className = 'btn btn-pink';
  if (tab === 'favoriten') { tabBtn.className = 'btn btn-lila'; favoritenAnzeigen(); }
  if (tab === 'karte')     { tabBtn.className = 'btn btn-blau'; karteInitialisieren(); }
}

// ════════════════════════════════════════
// FUNKTION: Hunderasse suchen
// Filtert das lokale Array nach dem Suchbegriff
// ════════════════════════════════════════
async function hundeRasseSuchen() {
  const suche = document.getElementById('rasse-suche-hund').value.trim().toLowerCase();
  if (!suche) { alert('Bitte eine Rasse eingeben!'); return; }

  ladeanimationZeigen('hund-ergebnis');

  // Array filtern: name enthält den Suchbegriff (toLowerCase = Groß/Klein egal)
  const gefunden = hundeRassen.filter(r =>
    r.name.toLowerCase().includes(suche) ||
    r.herkunft.toLowerCase().includes(suche) ||
    r.charakter.some(c => c.toLowerCase().includes(suche))
  );

  if (gefunden.length === 0) {
    document.getElementById('hund-ergebnis').innerHTML = `
      <div class="leer-zustand karte">
        <span class="emoji">😕</span>
        <p>Keine Rasse gefunden. Versuche z.B.: Labrador, Husky, Beagle, Dackel, Mops...</p>
      </div>`;
    return;
  }

  // Bilder für die gefundenen Rassen laden
  await rassenMitBildernAnzeigen(gefunden, 'hund', 'hund-ergebnis');
}

// ════════════════════════════════════════
// FUNKTION: Zufällige Hunderassen zeigen
// ════════════════════════════════════════
async function zufaelligeHunderasse() {
  ladeanimationZeigen('hund-ergebnis');
  // Array mischen und 6 zufällige nehmen
  const gemischt = [...hundeRassen].sort(() => Math.random() - 0.5).slice(0, 6);
  await rassenMitBildernAnzeigen(gemischt, 'hund', 'hund-ergebnis');
}

// ════════════════════════════════════════
// FUNKTION: Katzenrasse suchen
// ════════════════════════════════════════
async function katzenRasseSuchen() {
  const suche = document.getElementById('rasse-suche-katze').value.trim().toLowerCase();
  if (!suche) { alert('Bitte eine Rasse eingeben!'); return; }

  ladeanimationZeigen('katze-ergebnis');

  const gefunden = katzenRassen.filter(r =>
    r.name.toLowerCase().includes(suche) ||
    r.herkunft.toLowerCase().includes(suche) ||
    r.charakter.some(c => c.toLowerCase().includes(suche))
  );

  if (gefunden.length === 0) {
    document.getElementById('katze-ergebnis').innerHTML = `
      <div class="leer-zustand karte">
        <span class="emoji">😕</span>
        <p>Keine Rasse gefunden. Versuche z.B.: Perser, Maine Coon, Siamese, Bengal...</p>
      </div>`;
    return;
  }

  await rassenMitBildernAnzeigen(gefunden, 'katze', 'katze-ergebnis');
}

// ════════════════════════════════════════
// FUNKTION: Zufällige Katzenrassen
// ════════════════════════════════════════
async function zufaelligeKatzenrasse() {
  ladeanimationZeigen('katze-ergebnis');
  const gemischt = [...katzenRassen].sort(() => Math.random() - 0.5).slice(0, 6);
  await rassenMitBildernAnzeigen(gemischt, 'katze', 'katze-ergebnis');
}

// ════════════════════════════════════════
// FUNKTION: Rassen mit Bildern anzeigen
// Bilder: Dog CEO API für Hunde (kein Key!)
//         Placeholder für Katzen
// ════════════════════════════════════════
async function rassenMitBildernAnzeigen(rassen, tierart, zielId) {
  const ziel = document.getElementById(zielId);
  ziel.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'grid-3';
  ziel.appendChild(grid);

  // Für jede Rasse Karte erstellen
  for (let i = 0; i < rassen.length; i++) {
    const rasse = rassen[i];
    let bildUrl = '';

    // Bild von Dog CEO API holen (nur für Hunde, völlig kostenlos!)
    if (tierart === 'hund' && rasse.apiName) {
      try {
        const bildAntwort = await fetch(
          `https://dog.ceo/api/breed/${rasse.apiName}/images/random`
        );
        const bildDaten = await bildAntwort.json();
        if (bildDaten.status === 'success') {
          bildUrl = bildDaten.message; // Die Bild-URL
        }
      } catch (e) {
        bildUrl = ''; // Kein Bild wenn Fehler
      }
    }

    // Charakter-Badges aus dem Array erstellen
    const charakterBadges = rasse.charakter
      .map(c => `<span class="badge badge-${tierart === 'hund' ? 'orange' : 'pink'}">${c}</span>`)
      .join(' ');

    // DOM-Element erstellen
    const karte = document.createElement('div');
    karte.className = 'karte favorit-karte animiert';
    karte.style.animationDelay = `${i * 0.1}s`;
    karte.innerHTML = `
      <!-- Bild oder Emoji-Platzhalter -->
      ${bildUrl
        ? `<img src="${bildUrl}" alt="${rasse.name}" loading="lazy" />`
        : `<div style="height:160px; background: linear-gradient(135deg, var(--grau), #e8e4d8); border-radius:var(--radius-sm); display:flex; align-items:center; justify-content:center; font-size:4rem; margin-bottom:0.7rem;">${tierart === 'hund' ? '🐶' : '🐱'}</div>`
      }

      <!-- Name + Favorit-Button -->
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.4rem;">
        <h3 style="font-family:'Fredoka One',cursive; font-size:1.15rem;">${rasse.name}</h3>
        <button
          onclick="favoritToggle(${JSON.stringify({id: rasse.id, name: rasse.name, bild: bildUrl, tierart}).replace(/"/g,'&quot;')})"
          id="fav-btn-${rasse.id}"
          style="background:none; border:none; font-size:1.4rem; cursor:pointer; padding:0;"
        >${istFavorit(rasse.id) ? '❤️' : '🤍'}</button>
      </div>

      <!-- Info-Zeilen -->
      <div style="color:#888; font-size:0.85rem; margin-bottom:0.4rem;">📍 ${rasse.herkunft} · ${rasse.groesse}</div>
      <div style="color:#888; font-size:0.85rem; margin-bottom:0.6rem;">⚖️ ${rasse.gewicht} · ⏳ ${rasse.leben}</div>

      <!-- Beschreibung -->
      <div style="color:#666; font-size:0.88rem; margin-bottom:0.7rem; line-height:1.5;">${rasse.beschreibung}</div>

      <!-- Charakter-Badges -->
      <div style="display:flex; flex-wrap:wrap; gap:0.3rem;">${charakterBadges}</div>
    `;

    grid.appendChild(karte);
  }
}

// ════════════════════════════════════════
// FAVORITEN-SYSTEM (unverändert)
// ════════════════════════════════════════
function istFavorit(rasseId) {
  return favoriten.some(f => f.id === rasseId);
}

function favoritToggle(rasse) {
  if (istFavorit(rasse.id)) {
    favoriten = favoriten.filter(f => f.id !== rasse.id);
  } else {
    favoriten.push(rasse);
  }
  localStorage.setItem('petday_favoriten', JSON.stringify(favoriten));
  const btn = document.getElementById(`fav-btn-${rasse.id}`);
  if (btn) btn.textContent = istFavorit(rasse.id) ? '❤️' : '🤍';
}

function favoritenAnzeigen() {
  const liste = document.getElementById('favoriten-liste');
  if (favoriten.length === 0) {
    liste.innerHTML = `
      <div class="leer-zustand karte" style="grid-column:1/-1;">
        <span class="emoji">🤍</span>
        <p>Noch keine Favoriten. Suche eine Rasse und klicke auf das Herz!</p>
      </div>`;
    return;
  }
  liste.innerHTML = '';
  favoriten.forEach((fav, index) => {
    const karte = document.createElement('div');
    karte.className = 'karte favorit-karte animiert';
    karte.style.animationDelay = `${index * 0.08}s`;
    karte.innerHTML = `
      ${fav.bild
        ? `<img src="${fav.bild}" alt="${fav.name}" loading="lazy" />`
        : `<div style="height:160px; background:var(--grau); border-radius:var(--radius-sm); display:flex; align-items:center; justify-content:center; font-size:3rem; margin-bottom:0.7rem;">${fav.tierart === 'hund' ? '🐶' : '🐱'}</div>`
      }
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h3 style="font-family:'Fredoka One',cursive; font-size:1.1rem;">${fav.name}</h3>
        <span class="badge ${fav.tierart === 'hund' ? 'badge-orange' : 'badge-pink'}">${fav.tierart === 'hund' ? '🐶 Hund' : '🐱 Katze'}</span>
      </div>
      <button class="btn btn-grau" style="width:100%; margin-top:0.8rem; font-size:0.85rem;"
        onclick="favoritEntfernen('${fav.id}')">🗑️ Entfernen</button>
    `;
    liste.appendChild(karte);
  });
}

function favoritEntfernen(id) {
  favoriten = favoriten.filter(f => f.id !== id);
  localStorage.setItem('petday_favoriten', JSON.stringify(favoriten));
  favoritenAnzeigen();
}

function allesFavoritenLoeschen() {
  if (!confirm('Alle Favoriten löschen?')) return;
  favoriten = [];
  localStorage.setItem('petday_favoriten', JSON.stringify(favoriten));
  favoritenAnzeigen();
}

// ════════════════════════════════════════
// HILFSFUNKTIONEN
// ════════════════════════════════════════
function ladeanimationZeigen(id) {
  document.getElementById(id).innerHTML = `
    <div class="leer-zustand karte">
      <div class="lade-spinner"></div>
      <p>Lade Daten...</p>
    </div>`;
}

function fehlerAnzeigen(id) {
  document.getElementById(id).innerHTML = `
    <div class="leer-zustand karte">
      <span class="emoji">❌</span>
      <p>Fehler beim Laden.</p>
    </div>`;
}

// ENTER-Taste
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('rasse-suche-hund')?.addEventListener('keypress', e => {
    if (e.key === 'Enter') hundeRasseSuchen();
  });
  document.getElementById('rasse-suche-katze')?.addEventListener('keypress', e => {
    if (e.key === 'Enter') katzenRasseSuchen();
  });
});