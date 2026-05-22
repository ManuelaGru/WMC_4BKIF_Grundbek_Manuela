// ════════════════════════════════════════
// planner.js – Wochenendplan Logik
// Erstellt zufällige Wochenendpläne für
// verschiedene Tierarten
// ════════════════════════════════════════

// ── Globale Variable für aktuellen Plan ──
let aktuellerPlan = null;

// ════════════════════════════════════════
// AKTIVITÄTEN-DATENBANK (Arrays von Objekten)
// Für jede Tierart eigene Aktivitäten
// ════════════════════════════════════════

// Aktivitäten-Objekt: Schlüssel = Tierart, Wert = Array von Aktivitäten
const aktivitaetenDB = {

  hund: [
    { zeit: '08:00', titel: 'Morgenspaziergang',    emoji: '🌅', beschreibung: 'Frischer Start in den Tag mit einer ausgiebigen Runde im Park.' },
    { zeit: '10:00', titel: 'Fetch Training',        emoji: '🎾', beschreibung: 'Ball werfen und apportieren – klassischer Spaß für jeden Hund!' },
    { zeit: '11:00', titel: 'Agility-Parcours',      emoji: '🏃', beschreibung: 'Hindernisse aufbauen und die Koordination verbessern.' },
    { zeit: '14:00', titel: 'Hundepark-Besuch',      emoji: '🐕', beschreibung: 'Neue Hundefreunde kennenlernen und wild toben.' },
    { zeit: '15:00', titel: 'Schnüffelwiese',        emoji: '👃', beschreibung: 'Leckerlis im Gras oder in der Schnüffeldecke verstecken.' },
    { zeit: '16:00', titel: 'Schwimmen',             emoji: '🏊', beschreibung: 'Am See oder Bach planschen – viele Hunde lieben das!' },
    { zeit: '17:00', titel: 'Tricks üben',           emoji: '🎓', beschreibung: 'Neuen Trick lernen: Rolle, Hochfünf, oder Slalom!' },
    { zeit: '19:00', titel: 'Kuschelabend',          emoji: '🥰', beschreibung: 'Zusammen auf der Couch entspannen nach einem aktiven Tag.' },
    { zeit: '20:00', titel: 'Abendspaziergang',      emoji: '🌙', beschreibung: 'Ruhiger Abendspaziergang zum Abschalten.' },
    { zeit: '09:00', titel: 'Nasenarbeit',           emoji: '🔍', beschreibung: 'Geruchsübungen machen Hunde glücklich und müde!' },
    { zeit: '13:00', titel: 'Mittagspause draußen',  emoji: '☀️', beschreibung: 'Im Garten entspannen und die Sonne genießen.' },
  ],

  katze: [
    { zeit: '09:00', titel: 'Interaktives Spielen',  emoji: '🪶', beschreibung: 'Mit Federstab, Laserpunkt oder Knisterpapier toben.' },
    { zeit: '10:30', titel: 'Fenster-Beobachtung',   emoji: '🐦', beschreibung: 'Vogelzufütterung vor dem Fenster aufstellen und beobachten.' },
    { zeit: '11:00', titel: 'Kletterwand erkunden',  emoji: '🧗', beschreibung: 'Neues Katzenmöbel aufstellen oder alte umdekorieren.' },
    { zeit: '14:00', titel: 'Leckerli-Schnitzeljagd',emoji: '🍖', beschreibung: 'Futter in verschiedenen Ecken der Wohnung verstecken.' },
    { zeit: '15:00', titel: 'Wellness & Fellpflege', emoji: '💆', beschreibung: 'Sanft bürsten und streicheln – Spa-Zeit für die Katze!' },
    { zeit: '16:30', titel: 'Kistenberg bauen',      emoji: '📦', beschreibung: 'Aus Kartons eine Burg mit Löchern und Tunnel bauen.' },
    { zeit: '19:00', titel: 'Kuschelzeit',           emoji: '🥰', beschreibung: 'Auf dem Sofa kuscheln – Katzen lieben warme Plätze!' },
    { zeit: '20:00', titel: 'Abendspiel',            emoji: '🌙', beschreibung: 'Katzen sind abends aktiv – perfekte Zeit für wildes Spiel!' },
    { zeit: '10:00', titel: 'Catnip-Spaß',          emoji: '🌿', beschreibung: 'Katzenminze auf ein Spielzeug geben und staunen!' },
    { zeit: '13:00', titel: 'Puzzle-Feeder',         emoji: '🧩', beschreibung: 'Intelligenzspielzeug mit Futter befüllen und grübeln lassen.' },
  ],

  kaninchen: [
    { zeit: '08:00', titel: 'Morgen-Freilauf',       emoji: '🐰', beschreibung: 'Kaninchen brauchen täglich Auslauf – mindestens 3 Stunden!' },
    { zeit: '09:00', titel: 'Frischgemüse vorbereiten',emoji: '🥬', beschreibung: 'Karotten, Petersilie, Fenchel – abwechslungsreicher Speiseplan.' },
    { zeit: '11:00', titel: 'Tunnel-Parcours',       emoji: '🕳️', beschreibung: 'Kartonröhren als Tunnel aufbauen – Kaninchen lieben das!' },
    { zeit: '14:00', titel: 'Graben-Box',            emoji: '⛏️', beschreibung: 'Kiste mit Erde oder Heu – natürliches Grabverhalten ausleben.' },
    { zeit: '15:30', titel: 'Streicheleinheiten',    emoji: '🤲', beschreibung: 'Sanft am Rücken streicheln – ruhige Kuschelzeit.' },
    { zeit: '17:00', titel: 'Abend-Freilauf',        emoji: '🌆', beschreibung: 'Zweite Freilauf-Runde am Abend für genug Bewegung.' },
    { zeit: '19:00', titel: 'Heu-Versteck',          emoji: '🌾', beschreibung: 'Leckerbissen im frischen Heu verstecken – Schnüffelarbeit!' },
  ],

  hamster: [
    { zeit: '18:00', titel: 'Abend-Aktivzeit',       emoji: '🌙', beschreibung: 'Hamster sind Dämmerungstiere – abends sind sie am aktivsten!' },
    { zeit: '18:30', titel: 'Laufrad-Check',         emoji: '🎡', beschreibung: 'Laufrad reinigen und sicherstellen, dass es leise läuft.' },
    { zeit: '19:00', titel: 'Buddelparadies',        emoji: '⛏️', beschreibung: 'Tiefen Einstreubereich anbieten (mind. 30cm) zum Wühlen.' },
    { zeit: '19:30', titel: 'Erkundungsbox',         emoji: '📦', beschreibung: 'Sichere Schachtel mit Verstecken zum Erkunden aufstellen.' },
    { zeit: '20:00', titel: 'Frischfutter',          emoji: '🌽', beschreibung: 'Kleines Stück Gurke, Karotte oder Apfel anbieten.' },
    { zeit: '20:30', titel: 'Beobachtungszeit',      emoji: '👀', beschreibung: 'Ruhig beim Hamster sitzen und sein Verhalten beobachten.' },
  ],

  vogel: [
    { zeit: '08:00', titel: 'Morgen-Freiflug',       emoji: '🕊️', beschreibung: 'Vögel brauchen täglichen Freiflug – alle Fenster schließen!' },
    { zeit: '09:30', titel: 'Frisches Obst',         emoji: '🍎', beschreibung: 'Apfel, Beeren oder Birne – abwechslungsreicher Speiseplan.' },
    { zeit: '11:00', titel: 'Trick-Training',        emoji: '🎓', beschreibung: 'Vögel sind intelligent – Schritt auf Finger, Klingeln lernen.' },
    { zeit: '14:00', titel: 'Badespaß',              emoji: '🛁', beschreibung: 'Flache Schüssel mit Wasser – viele Vögel lieben Baden!' },
    { zeit: '16:00', titel: 'Neues Spielzeug',       emoji: '🎈', beschreibung: 'Abwechslung im Käfig mit neuem Spiegel oder Glocke.' },
    { zeit: '18:00', titel: 'Ruhige Musik',          emoji: '🎵', beschreibung: 'Ruhige Melodien spielen – viele Vögel singen mit!' },
  ],

  fisch: [
    { zeit: '09:00', titel: 'Wasserwerte messen',    emoji: '🧪', beschreibung: 'pH-Wert, Ammoniak und Nitrit kontrollieren – wichtig!' },
    { zeit: '10:00', titel: 'Algenpflege',           emoji: '🌿', beschreibung: 'Scheiben mit Algenmagnet reinigen für bessere Sicht.' },
    { zeit: '11:00', titel: 'Teilwasserwechsel',     emoji: '💧', beschreibung: '25-30% des Wassers wechseln – für saubere Umgebung.' },
    { zeit: '14:00', titel: 'Dekorations-Upgrade',  emoji: '🪨', beschreibung: 'Neuen Stein oder neue Pflanze hinzufügen – Abwechslung!' },
    { zeit: '16:00', titel: 'Fütterungszeit',        emoji: '🐟', beschreibung: 'Lebend- oder Frostfutter als besondere Abwechslung.' },
  ],

  schildkroete: [
    { zeit: '10:00', titel: 'Sonnen-Session',        emoji: '☀️', beschreibung: 'Schildkröten brauchen UV-Licht – UV-Lampe oder draußen sonnen.' },
    { zeit: '11:00', titel: 'Auslauf-Zeit',          emoji: '🐢', beschreibung: 'Im Garten oder in einer gesicherten Box frei erkunden lassen.' },
    { zeit: '13:00', titel: 'Frisches Gemüse',       emoji: '🥗', beschreibung: 'Löwenzahn, Paprika, Zucchini – abwechslungsreich füttern.' },
    { zeit: '15:00', titel: 'Badestunde',            emoji: '🛁', beschreibung: 'Flaches lauwarmes Bad für 20 Minuten – wichtig für Hydration!' },
    { zeit: '17:00', titel: 'Gehege-Pflege',         emoji: '🌱', beschreibung: 'Substrate reinigen und frisches Moos oder Substrate hinzufügen.' },
  ],
};

// ════════════════════════════════════════
// SNACK-IDEEN je nach Marke (Templates)
// ════════════════════════════════════════
const snackIdeen = [
  'Lieblingssnack als Belohnung nach dem Training',
  'Leckerli bei der Schnüffelübung verstecken',
  'Snack als Motivation beim Tricks üben',
  'Kleiner Snack zur Belohnung nach dem Spaziergang',
  'Snack-Rätsel: in einer Muffin-Form verstecken',
];

// ════════════════════════════════════════
// FUNKTION: Tier-Emoji aktualisieren
// (wird beim Wechsel der Tierart aufgerufen)
// ════════════════════════════════════════
function tierEmojiAktualisieren() {
  const emojis = {
    hund: '🐶', katze: '🐱', kaninchen: '🐰',
    hamster: '🐹', vogel: '🐦', fisch: '🐠', schildkroete: '🐢'
  };
  const tierArt = document.getElementById('tier-art').value;
  // Emoji im Select-Label aktualisieren würde komplexer werden,
  // daher nur im Plan verwenden
}

// ════════════════════════════════════════
// FUNKTION: Array mischen (gleich wie in weather.js)
// ════════════════════════════════════════
function arrayMischen(array) {
  const kopie = [...array]; // Kopie erstellen (Original nicht verändern)
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [kopie[i], kopie[j]] = [kopie[j], kopie[i]]; // Tauschen
  }
  return kopie;
}

// ════════════════════════════════════════
// FUNKTION: Wochenendplan erstellen
// ════════════════════════════════════════
function planErstellen() {
  // Eingaben auslesen
  const tierArt    = document.getElementById('tier-art').value;
  const tierName   = document.getElementById('tier-name').value.trim() || 'dein Tier';
  const snackMarke = document.getElementById('snack-marke').value.trim();
  const spielMarke = document.getElementById('spielzeug-marke').value.trim();
  const futterMarke= document.getElementById('futter-marke').value.trim();
  const vorlieben  = document.getElementById('vorlieben').value.trim();

  // Aktivitäten für diese Tierart holen
  const alleAktivitaeten = aktivitaetenDB[tierArt] || aktivitaetenDB['hund'];

  // Aktivitäten mischen und für Samstag + Sonntag aufteilen
  const gemischt = arrayMischen(alleAktivitaeten);

  // Plan-Objekt erstellen
  aktuellerPlan = {
    tierArt,
    tierName,
    snackMarke,
    spielMarke,
    futterMarke,
    vorlieben,
    samstag: gemischt.slice(0, 4),  // Erste 4 Aktivitäten
    sonntag: gemischt.slice(4, 8),  // Nächste 4 Aktivitäten
  };

  // Plan anzeigen
  planAnzeigen(aktuellerPlan);

  // "Neu mischen" Button anzeigen
  document.getElementById('mischen-btn').style.display = 'inline-flex';
}

// ════════════════════════════════════════
// FUNKTION: Plan neu mischen
// ════════════════════════════════════════
function planNeuMischen() {
  if (!aktuellerPlan) return;

  // Alle Aktivitäten für diese Tierart neu mischen
  const alleAktivitaeten = aktivitaetenDB[aktuellerPlan.tierArt];
  const gemischt = arrayMischen(alleAktivitaeten);

  aktuellerPlan.samstag = gemischt.slice(0, 4);
  aktuellerPlan.sonntag = gemischt.slice(4, 8);

  planAnzeigen(aktuellerPlan);
}

// ════════════════════════════════════════
// FUNKTION: Plan im DOM anzeigen
// ════════════════════════════════════════
function planAnzeigen(plan) {
  const bereich = document.getElementById('plan-bereich');

  // Tier-Emoji bestimmen
  const tierEmojis = {
    hund: '🐶', katze: '🐱', kaninchen: '🐰',
    hamster: '🐹', vogel: '🐦', fisch: '🐠', schildkroete: '🐢'
  };
  const tierEmoji = tierEmojis[plan.tierArt] || '🐾';

  // Zufällige Snack-Idee mit der Marke kombinieren
  const snackTipp = plan.snackMarke
    ? `${arrayMischen(snackIdeen)[0].replace('Lieblingssnack', plan.snackMarke)}`
    : arrayMischen(snackIdeen)[0];

  // HTML für Samstag und Sonntag generieren
  const samstagHTML = tagesplanHTML(plan.samstag, plan, snackTipp);
  const sonntagHTML = tagesplanHTML(plan.sonntag, plan, snackTipp);

  // Gesamten Plan ins DOM einfügen
  bereich.innerHTML = `
    <!-- Plan-Kopf -->
    <div class="karte karte-lila animiert-oben" style="text-align: center; margin-bottom: 1.5rem;">
      <div style="font-size: 3rem; margin-bottom: 0.5rem;">${tierEmoji}</div>
      <h2 style="font-family: 'Fredoka One', cursive; font-size: 2rem; margin-bottom: 0.3rem;">
        Wochenendplan für ${plan.tierName}!
      </h2>
      <p style="color: #888;">Ein zufällig gemischter Plan für ein unvergessliches Wochenende 🎉</p>

      <!-- Marken-Info wenn vorhanden -->
      ${plan.snackMarke || plan.spielMarke || plan.futterMarke ? `
        <div style="display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; margin-top: 1rem;">
          ${plan.snackMarke  ? `<span class="badge badge-orange">🍖 ${plan.snackMarke}</span>` : ''}
          ${plan.spielMarke  ? `<span class="badge badge-blau">🎾 ${plan.spielMarke}</span>` : ''}
          ${plan.futterMarke ? `<span class="badge badge-gruen">🥣 ${plan.futterMarke}</span>` : ''}
          ${plan.vorlieben   ? `<span class="badge badge-pink">💛 ${plan.vorlieben}</span>` : ''}
        </div>
      ` : ''}
    </div>

    <!-- 2-Spalten Layout für Samstag & Sonntag -->
    <div class="grid-2">

      <!-- SAMSTAG -->
      <div>
        <h2 style="font-family: 'Fredoka One', cursive; font-size: 1.6rem; margin-bottom: 1rem; color: var(--orange);">
          🟠 Samstag
        </h2>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${samstagHTML}
        </div>
      </div>

      <!-- SONNTAG -->
      <div>
        <h2 style="font-family: 'Fredoka One', cursive; font-size: 1.6rem; margin-bottom: 1rem; color: var(--lila);">
          🟣 Sonntag
        </h2>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${sonntagHTML}
        </div>
      </div>

    </div>

    <!-- Tipp des Tages -->
    <div class="karte karte-gelb animiert" style="margin-top: 1.5rem; display: flex; align-items: flex-start; gap: 1rem;">
      <div style="font-size: 2rem;">💡</div>
      <div>
        <div style="font-weight: 800; margin-bottom: 0.3rem;">Snack-Tipp der Woche</div>
        <div style="color: #666;">${snackTipp}</div>
      </div>
    </div>
  `;
}

// ════════════════════════════════════════
// FUNKTION: HTML für einen Tagesplan
// ════════════════════════════════════════
function tagesplanHTML(aktivitaeten, plan, snackTipp) {
  // Mit map() jede Aktivität in HTML umwandeln
  return aktivitaeten.map((akt, index) => {
    // Manchmal Marken einbauen wenn vorhanden
    let beschreibung = akt.beschreibung;
    if (index === 1 && plan.spielMarke) {
      beschreibung += ` Verwende dabei ${plan.spielMarke}!`;
    }
    if (index === 2 && plan.snackMarke) {
      beschreibung += ` Als Belohnung gibt es ${plan.snackMarke}!`;
    }

    return `
      <div class="karte animiert" style="animation-delay: ${index * 0.1}s; display: flex; gap: 1rem; align-items: flex-start;">
        <!-- Zeitanzeige -->
        <div style="
          background: linear-gradient(135deg, var(--gelb), var(--orange));
          color: white;
          padding: 0.4rem 0.7rem;
          border-radius: 8px;
          font-weight: 800;
          font-size: 0.85rem;
          white-space: nowrap;
          min-width: 58px;
          text-align: center;
        ">${akt.zeit}</div>

        <!-- Aktivität-Info -->
        <div style="flex: 1;">
          <div style="font-weight: 800; display: flex; align-items: center; gap: 0.4rem;">
            ${akt.emoji} ${akt.titel}
          </div>
          <div style="color: #888; font-size: 0.9rem; margin-top: 0.2rem;">${beschreibung}</div>
        </div>
      </div>
    `;
  }).join(''); // Array zu einem HTML-String zusammenfügen
}