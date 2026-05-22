// ════════════════════════════════════════
// weather.js – Wetter & Aktivitäten Logik
// Verwendet die kostenlose Open-Meteo API
// (kein API-Key nötig!)
// ════════════════════════════════════════

// ── Globale Variable für aktuelle Temperatur ──
// "let" weil sie sich ändern kann
let aktuelleTemp = null;      // Temperatur in °C (Original)
let istFahrenheit = false;    // Ist °F aktiv?

// ── Aktivitäten-Arrays ──
// Arrays = Listen von Aktivitäten, je nach Wetterlage

// Draußen-Aktivitäten (warm & schön)
const aktivitaetenDraussen = [
  { titel: "Spaziergang im Park",       emoji: "🌳", beschreibung: "Frische Luft schnappen und die Natur genießen!" },
  { titel: "Fetch spielen",             emoji: "🎾", beschreibung: "Ball werfen und apportieren lassen – klassischer Spaß!" },
  { titel: "Agility-Training",          emoji: "🏃", beschreibung: "Hindernisse aufbauen und die Koordination trainieren." },
  { titel: "Hundepark besuchen",        emoji: "🐕", beschreibung: "Neue Freunde kennenlernen und toben lassen!" },
  { titel: "Fahrrad-Begleitung",        emoji: "🚲", beschreibung: "Gemütlich mit dem Fahrrad fahren, Tier läuft daneben." },
  { titel: "Versteckspiel draußen",     emoji: "🙈", beschreibung: "Im Garten oder Park verstecken und suchen lassen." },
  { titel: "Schnüffelwiese",            emoji: "👃", beschreibung: "Leckerbissen im Gras verstecken – mentale Beschäftigung!" },
  { titel: "Swimming / Planschen",      emoji: "🏊", beschreibung: "Wenn es sehr warm ist: ab ins kühle Wasser!" },
];

// Drinnen-Aktivitäten (kalt, Regen, Schnee)
const aktivitaetenDrinnen = [
  { titel: "Intelligenzspielzeug",      emoji: "🧩", beschreibung: "Futterpuzzles und Denksport halten das Tier fit." },
  { titel: "Nasenarbeit drinnen",       emoji: "👃", beschreibung: "Leckerlis unter Tassen verstecken – suchen lassen!" },
  { titel: "Neue Tricks lernen",        emoji: "🎓", beschreibung: "Sitz, Platz, Pfote – oder etwas ganz Neues üben!" },
  { titel: "Kuschelzeit",               emoji: "🥰", beschreibung: "Einfach kuscheln und gemeinsam entspannen." },
  { titel: "DIY Spielzeug basteln",     emoji: "🎨", beschreibung: "Aus alten Socken oder Flaschen Spielzeug basteln." },
  { titel: "Indoor-Parcours",           emoji: "🏠", beschreibung: "Mit Kissen und Decken einen Mini-Parcours aufbauen." },
  { titel: "Massage & Pflege",          emoji: "💆", beschreibung: "Fell bürsten, Krallen kontrollieren – Wellness-Tag!" },
  { titel: "Lern-Video schauen",        emoji: "📺", beschreibung: "Zusammen ein Tier-Video anschauen – manche Tiere lieben das!" },
];

// Aktivitäten bei Regen speziell
const aktivitaetenRegen = [
  { titel: "Regenmantl anziehen & raus",emoji: "🌧️", beschreibung: "Mit Regenmantel kurze Runde drehen – Abenteuer!" },
  { titel: "Pfoten-Spa nach dem Regen", emoji: "🐾", beschreibung: "Pfoten abwaschen und eincremen nach dem Spaziergang." },
  { titel: "Versteckspiel im Haus",     emoji: "🙈", beschreibung: "Im ganzen Haus verstecken – wer wird gefunden?" },
  { titel: "Leckerlis backen",          emoji: "🍪", beschreibung: "Selbstgemachte Tier-Snacks backen – gesund & lecker!" },
  { titel: "Fotoshooting",              emoji: "📸", beschreibung: "Lustiges Fotoshooting mit dem Tier zu Hause." },
];

// ════════════════════════════════════════
// FUNKTION: Wetter laden (per Stadtname)
// ════════════════════════════════════════
async function wetterLaden() {
  // Eingabe aus dem Textfeld holen
  const stadt = document.getElementById('stadt-eingabe').value.trim();

  // Wenn nichts eingegeben wurde → abbrechen
  if (!stadt) {
    alert('Bitte eine Stadt eingeben! 🏙️');
    return;
  }

  // Ladeanimation anzeigen
  document.getElementById('wetter-bereich').innerHTML = `
    <div class="leer-zustand karte">
      <div class="lade-spinner"></div>
      <p>Wetterdaten werden geladen...</p>
    </div>
  `;

  try {
    // SCHRITT 1: Stadtname → Koordinaten umwandeln (Geocoding API)
    // fetch() macht eine HTTP-Anfrage an eine URL und wartet auf die Antwort
    const geoAntwort = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(stadt)}&count=1&language=de`
    );

    // Antwort in JSON umwandeln (JSON = strukturiertes Datenformat)
    const geoDaten = await geoAntwort.json();

    // Wenn keine Stadt gefunden wurde
    if (!geoDaten.results || geoDaten.results.length === 0) {
      document.getElementById('wetter-bereich').innerHTML = `
        <div class="leer-zustand karte">
          <span class="emoji">😕</span>
          <p>Stadt nicht gefunden. Versuche es mit einem anderen Namen!</p>
        </div>
      `;
      return;
    }

    // Koordinaten aus den Ergebnissen holen
    const { latitude, longitude, name, country } = geoDaten.results[0];

    // SCHRITT 2: Wetterdaten für diese Koordinaten holen
    await wetterMitKoordinatenLaden(latitude, longitude, name, country);

  } catch (fehler) {
    // Bei einem Netzwerkfehler
    console.error('Fehler beim Laden:', fehler);
    document.getElementById('wetter-bereich').innerHTML = `
      <div class="leer-zustand karte">
        <span class="emoji">❌</span>
        <p>Fehler beim Laden. Bitte Internetverbindung prüfen.</p>
      </div>
    `;
  }
}

// ════════════════════════════════════════
// FUNKTION: GPS-Standort ermitteln
// ════════════════════════════════════════
function standortErmitteln() {
  // Browser-Geolocation API verwenden
  if (!navigator.geolocation) {
    alert('Dein Browser unterstützt keine Standort-Ermittlung.');
    return;
  }

  // Ladeanimation
  document.getElementById('wetter-bereich').innerHTML = `
    <div class="leer-zustand karte">
      <div class="lade-spinner"></div>
      <p>Standort wird ermittelt...</p>
    </div>
  `;

  // Standort anfragen (Browser fragt den User um Erlaubnis)
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      // Erfolg: Koordinaten verwenden
      const { latitude, longitude } = position.coords;
      await wetterMitKoordinatenLaden(latitude, longitude, 'Mein Standort', '');
    },
    (fehler) => {
      // Fehler: z.B. User hat abgelehnt
      document.getElementById('wetter-bereich').innerHTML = `
        <div class="leer-zustand karte">
          <span class="emoji">📍</span>
          <p>Standort konnte nicht ermittelt werden. Bitte Stadt manuell eingeben.</p>
        </div>
      `;
    }
  );
}

// ════════════════════════════════════════
// FUNKTION: Wetter mit Koordinaten laden
// ════════════════════════════════════════
async function wetterMitKoordinatenLaden(lat, lon, stadtName, land) {
  try {
    // Open-Meteo API Anfrage
    // Wir fragen nach: Temperatur, Windgeschwindigkeit, Wettercode, Regen
    const wetterAntwort = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,windspeed_10m,weathercode,precipitation` +
      `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum` +
      `&timezone=auto&forecast_days=7`
    );

    const wetterDaten = await wetterAntwort.json();

    // Aktuelle Wetterwerte aus der Antwort holen
    const temp       = wetterDaten.current.temperature_2m;       // Temperatur in °C
    const wind       = wetterDaten.current.windspeed_10m;         // Wind in km/h
    const wetterCode = wetterDaten.current.weathercode;           // Wettercode (0-99)
    const niederschlag = wetterDaten.current.precipitation;       // Regen in mm

    // In globaler Variable speichern (für °C/°F Umrechnung)
    aktuelleTemp = temp;

    // Wetter-Beschreibung und Emoji aus dem Code ermitteln
    const { beschreibung, emoji, farbe } = wetterCodeZuBeschreibung(wetterCode);

    // Anzuzeigende Temperatur (je nach Toggle)
    const anzeigeTemp = istFahrenheit ? celsiusZuFahrenheit(temp) : temp;
    const einheit = istFahrenheit ? '°F' : '°C';

    // 7-Tage Vorhersage als HTML erzeugen
    const vorhersageHTML = erzeuge7TageVorhersage(wetterDaten.daily, istFahrenheit);

    // Wetter-HTML erstellen und in die Seite einfügen (DOM-Manipulation)
    document.getElementById('wetter-bereich').innerHTML = `
      <div class="karte animiert" style="border-top: 5px solid ${farbe}; background: linear-gradient(135deg, white, ${farbe}15);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">

          <!-- Linke Seite: Hauptwetter -->
          <div style="display: flex; align-items: center; gap: 1.5rem;">
            <div style="font-size: 5rem; line-height: 1;">${emoji}</div>
            <div>
              <div style="font-family: 'Fredoka One', cursive; font-size: 3.5rem; line-height: 1; color: ${farbe};">
                ${Math.round(anzeigeTemp)}${einheit}
              </div>
              <div style="font-size: 1.1rem; font-weight: 700;">${beschreibung}</div>
              <div style="color: #888; margin-top: 0.3rem;">📍 ${stadtName}${land ? ', ' + land : ''}</div>
            </div>
          </div>

          <!-- Rechte Seite: Details -->
          <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
            <div style="text-align: center;">
              <div style="font-size: 1.5rem;">💨</div>
              <div style="font-weight: 700;">${wind} km/h</div>
              <div style="color: #888; font-size: 0.85rem;">Wind</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 1.5rem;">🌧️</div>
              <div style="font-weight: 700;">${niederschlag} mm</div>
              <div style="color: #888; font-size: 0.85rem;">Niederschlag</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 1.5rem;">🌡️</div>
              <div style="font-weight: 700;">${Math.round(istFahrenheit ? celsiusZuFahrenheit(wetterDaten.daily.temperature_2m_max[0]) : wetterDaten.daily.temperature_2m_max[0])}${einheit}</div>
              <div style="color: #888; font-size: 0.85rem;">Max heute</div>
            </div>
          </div>
        </div>

        <!-- 7-Tage Vorhersage -->
        <div style="margin-top: 1.5rem; border-top: 2px dashed #eee; padding-top: 1.2rem;">
          <div style="font-weight: 700; margin-bottom: 0.8rem; color: #888;">📅 7-Tage Vorhersage</div>
          <div style="display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.5rem;">
            ${vorhersageHTML}
          </div>
        </div>
      </div>
    `;

    // Aktivitäten anzeigen basierend auf Temperatur und Wetter
    aktivitaetenAnzeigen(temp, wetterCode);

  } catch (fehler) {
    console.error('Wetterfehler:', fehler);
    document.getElementById('wetter-bereich').innerHTML = `
      <div class="leer-zustand karte">
        <span class="emoji">❌</span>
        <p>Wetterdaten konnten nicht geladen werden.</p>
      </div>
    `;
  }
}

// ════════════════════════════════════════
// FUNKTION: 7-Tage Vorhersage HTML erzeugen
// ════════════════════════════════════════
function erzeuge7TageVorhersage(daily, fahrenheit) {
  // Wochentag-Namen
  const tage = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

  // Mit map() jeden Tag in ein HTML-Element umwandeln
  return daily.temperature_2m_max.map((maxTemp, index) => {
    const datum = new Date();
    datum.setDate(datum.getDate() + index); // Datum für jeden Tag berechnen
    const tagName = index === 0 ? 'Heute' : tage[datum.getDay()];

    const anzeigMax = fahrenheit ? celsiusZuFahrenheit(maxTemp) : maxTemp;
    const anzeigMin = fahrenheit ? celsiusZuFahrenheit(daily.temperature_2m_min[index]) : daily.temperature_2m_min[index];
    const einheit = fahrenheit ? '°F' : '°C';

    return `
      <div style="min-width: 70px; text-align: center; background: white; border-radius: 12px; padding: 0.6rem 0.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
        <div style="font-size: 0.8rem; font-weight: 700; color: #888;">${tagName}</div>
        <div style="font-size: 1.3rem; margin: 0.3rem 0;">☀️</div>
        <div style="font-size: 0.85rem; font-weight: 800;">${Math.round(anzeigMax)}${einheit}</div>
        <div style="font-size: 0.75rem; color: #aaa;">${Math.round(anzeigMin)}${einheit}</div>
      </div>
    `;
  }).join(''); // Array zu einem HTML-String zusammenfügen
}

// ════════════════════════════════════════
// FUNKTION: Aktivitäten anzeigen
// ════════════════════════════════════════
function aktivitaetenAnzeigen(temp, wetterCode) {
  const bereich = document.getElementById('aktivitaeten-bereich');
  const liste = document.getElementById('aktivitaeten-liste');
  const hinweis = document.getElementById('aktivitaet-hinweis');
  const emoji = document.getElementById('aktivitaet-emoji');

  bereich.style.display = 'block';

  // Je nach Wetter das passende Array wählen
  let aktivitaeten;
  let hinweisText;

  if (wetterCode >= 51 && wetterCode <= 67 || wetterCode >= 80 && wetterCode <= 82) {
    // Regen (Wettercode 51-67 = Regen, 80-82 = Schauer)
    aktivitaeten = aktivitaetenRegen;
    hinweisText = '🌧️ Bei Regen – aber trotzdem Spaß haben!';
    emoji.textContent = '🌧️';
  } else if (temp < 5 || wetterCode >= 71) {
    // Sehr kalt oder Schnee → Drinnen-Aktivitäten
    aktivitaeten = aktivitaetenDrinnen;
    hinweisText = '🥶 Es ist kalt draußen – besser drinnen bleiben!';
    emoji.textContent = '🏠';
  } else if (temp >= 5 && temp < 15) {
    // Etwas kühler → Mix aus drinnen/draußen
    // Mit spread (...) beide Arrays kombinieren und zufällig mischen
    aktivitaeten = [...aktivitaetenDrinnen, ...aktivitaetenDraussen];
    hinweisText = '🧥 Etwas kühl – mit Jacke raus oder drinnen bleiben!';
    emoji.textContent = '🧥';
  } else {
    // Schönes Wetter → Draußen-Aktivitäten
    aktivitaeten = aktivitaetenDraussen;
    hinweisText = '☀️ Perfektes Wetter für draußen!';
    emoji.textContent = '🎾';
  }

  hinweis.textContent = hinweisText;

  // Array mischen (Fisher-Yates Shuffle Algorithmus)
  const gemischt = aktivitaetMischen([...aktivitaeten]);

  // Nur die ersten 6 Aktivitäten anzeigen
  const auswahl = gemischt.slice(0, 6);

  // DOM leeren und neu befüllen
  liste.innerHTML = '';

  // Für jede Aktivität eine Karte erstellen (forEach = für jedes Element)
  auswahl.forEach((aktivitaet, index) => {
    const karte = document.createElement('div'); // Neues div-Element erstellen
    karte.className = 'karte animiert';
    karte.style.animationDelay = `${index * 0.08}s`; // Versetztes Einblenden
    karte.innerHTML = `
      <div style="font-size: 2rem; margin-bottom: 0.5rem;">${aktivitaet.emoji}</div>
      <div style="font-weight: 800; margin-bottom: 0.3rem;">${aktivitaet.titel}</div>
      <div style="color: #888; font-size: 0.9rem;">${aktivitaet.beschreibung}</div>
    `;
    liste.appendChild(karte); // Karte in die Liste einfügen
  });
}

// ════════════════════════════════════════
// FUNKTION: Array mischen (zufällige Reihenfolge)
// ════════════════════════════════════════
function aktivitaetMischen(array) {
  // Fisher-Yates Shuffle: von hinten nach vorne tauschen
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Zufälliger Index
    [array[i], array[j]] = [array[j], array[i]];   // Tauschen (Destructuring)
  }
  return array;
}

// ════════════════════════════════════════
// FUNKTION: Wettercode → Text & Emoji
// ════════════════════════════════════════
function wetterCodeZuBeschreibung(code) {
  // Objekt mit allen Wettercodes (von Open-Meteo Dokumentation)
  const codes = {
    0:  { beschreibung: 'Klarer Himmel',         emoji: '☀️',  farbe: '#FFD93D' },
    1:  { beschreibung: 'Überwiegend klar',       emoji: '🌤️', farbe: '#FFD93D' },
    2:  { beschreibung: 'Teilweise bewölkt',      emoji: '⛅',  farbe: '#95D5B2' },
    3:  { beschreibung: 'Bedeckt',                emoji: '☁️',  farbe: '#aab4c4' },
    45: { beschreibung: 'Nebelig',                emoji: '🌫️', farbe: '#aab4c4' },
    48: { beschreibung: 'Gefrierender Nebel',     emoji: '🌫️', farbe: '#aab4c4' },
    51: { beschreibung: 'Leichter Nieselregen',   emoji: '🌦️', farbe: '#4ECDC4' },
    53: { beschreibung: 'Mäßiger Nieselregen',    emoji: '🌦️', farbe: '#4ECDC4' },
    55: { beschreibung: 'Starker Nieselregen',    emoji: '🌧️', farbe: '#4ECDC4' },
    61: { beschreibung: 'Leichter Regen',         emoji: '🌧️', farbe: '#4ECDC4' },
    63: { beschreibung: 'Mäßiger Regen',          emoji: '🌧️', farbe: '#4ECDC4' },
    65: { beschreibung: 'Starker Regen',          emoji: '⛈️', farbe: '#4ECDC4' },
    71: { beschreibung: 'Leichter Schneefall',    emoji: '🌨️', farbe: '#C77DFF' },
    73: { beschreibung: 'Mäßiger Schneefall',     emoji: '❄️',  farbe: '#C77DFF' },
    75: { beschreibung: 'Starker Schneefall',     emoji: '❄️',  farbe: '#C77DFF' },
    80: { beschreibung: 'Leichte Schauer',        emoji: '🌦️', farbe: '#4ECDC4' },
    81: { beschreibung: 'Mäßige Schauer',         emoji: '🌧️', farbe: '#4ECDC4' },
    82: { beschreibung: 'Starke Schauer',         emoji: '⛈️', farbe: '#FF6B35' },
    95: { beschreibung: 'Gewitter',               emoji: '⛈️', farbe: '#FF6B35' },
    99: { beschreibung: 'Schweres Gewitter',      emoji: '🌩️', farbe: '#FF6B35' },
  };

  // Wenn Code bekannt → zurückgeben, sonst Standard
  return codes[code] || { beschreibung: 'Unbekannt', emoji: '🌡️', farbe: '#aaa' };
}

// ════════════════════════════════════════
// FUNKTION: °C → °F umrechnen
// ════════════════════════════════════════
function celsiusZuFahrenheit(celsius) {
  return Math.round((celsius * 9/5) + 32);
}

// ════════════════════════════════════════
// FUNKTION: Einheit wechseln (Toggle)
// ════════════════════════════════════════
function einheitWechseln() {
  istFahrenheit = document.getElementById('einheit-toggle').checked;

  // Wetter neu laden wenn bereits eine Stadt geladen ist
  const stadtEingabe = document.getElementById('stadt-eingabe').value.trim();
  if (stadtEingabe) {
    wetterLaden();
  }
}

// ════════════════════════════════════════
// ENTER-Taste für Suche ermöglichen
// ════════════════════════════════════════
document.getElementById('stadt-eingabe').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    wetterLaden();
  }
});