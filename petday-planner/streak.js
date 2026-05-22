// ════════════════════════════════════════
// streak.js – Activity Streak Logik
// Speichert Aktivitäten in localStorage
// localStorage = Daten bleiben im Browser
//                gespeichert, auch nach
//                dem Schließen!
// ════════════════════════════════════════

// ════════════════════════════════════════
// FUNKTION: Streak-Anzeige initialisieren
// Wird beim Laden der Seite aufgerufen
// ════════════════════════════════════════
function streakInitialisieren() {
  streakAnzeigen();
  streakKalenderAnzeigen();
}

// ════════════════════════════════════════
// FUNKTION: Heutiges Datum als String
// Format: "2026-05-08"
// ════════════════════════════════════════
function heuteDatum() {
  return new Date().toISOString().split('T')[0]; // Nur Datum, ohne Uhrzeit
}

// ════════════════════════════════════════
// FUNKTION: Aktivität für heute eintragen
// ════════════════════════════════════════
function aktivitaetEintragen() {
  const heute = heuteDatum();

  // Bisherige Aktivitäten aus localStorage holen
  // JSON.parse wandelt den gespeicherten Text zurück in ein Array
  const aktivitaeten = JSON.parse(localStorage.getItem('petday_aktivitaeten') || '[]');

  // Prüfen ob heute schon eingetragen wurde
  if (aktivitaeten.includes(heute)) {
    // Kleines Feedback geben
    const btn = document.querySelector('[onclick="aktivitaetEintragen()"]');
    btn.textContent = '✅ Heute bereits eingetragen!';
    setTimeout(() => { btn.textContent = '✅ Ja, heute erledigt!'; }, 2000);
    return;
  }

  // Heutiges Datum zum Array hinzufügen
  aktivitaeten.push(heute);

  // Zurück in localStorage speichern
  // JSON.stringify wandelt das Array in Text um (localStorage speichert nur Text)
  localStorage.setItem('petday_aktivitaeten', JSON.stringify(aktivitaeten));

  // Anzeige aktualisieren
  streakAnzeigen();
  streakKalenderAnzeigen();

  // Erfolgsmeldung
  const btn = document.querySelector('[onclick="aktivitaetEintragen()"]');
  btn.textContent = '🎉 Super gemacht!';
  setTimeout(() => { btn.textContent = '✅ Ja, heute erledigt!'; }, 2000);
}

// ════════════════════════════════════════
// FUNKTION: Streak berechnen
// Zählt wie viele Tage in Folge aktiv
// ════════════════════════════════════════
function streakBerechnen() {
  const aktivitaeten = JSON.parse(localStorage.getItem('petday_aktivitaeten') || '[]');

  if (aktivitaeten.length === 0) return 0;

  // Array sortieren (neueste zuerst)
  const sortiert = [...aktivitaeten].sort().reverse();

  let streak = 0;
  let pruefDatum = new Date();

  // Rückwärts durch die Tage gehen und schauen ob jeder Tag dabei ist
  for (let i = 0; i < 365; i++) {
    const datumString = pruefDatum.toISOString().split('T')[0];

    if (sortiert.includes(datumString)) {
      streak++; // Tag dabei → Streak erhöhen
    } else if (i > 0) {
      break; // Lücke gefunden → aufhören
    }

    // Einen Tag zurückgehen
    pruefDatum.setDate(pruefDatum.getDate() - 1);
  }

  return streak;
}

// ════════════════════════════════════════
// FUNKTION: Streak-Anzeige aktualisieren
// ════════════════════════════════════════
function streakAnzeigen() {
  const streak = streakBerechnen();
  const aktivitaeten = JSON.parse(localStorage.getItem('petday_aktivitaeten') || '[]');

  // Streak-Zahl im DOM aktualisieren
  document.getElementById('streak-zahl').textContent = streak;

  // Letzter-Tag Text
  const letzterTagEl = document.getElementById('letzter-tag-text');
  const heute = heuteDatum();

  if (aktivitaeten.includes(heute)) {
    letzterTagEl.textContent = '🎉 Heute bereits eingetragen! Weiter so!';
    letzterTagEl.style.color = '#2d6a4f';
  } else if (aktivitaeten.length > 0) {
    const sortiert = [...aktivitaeten].sort().reverse();
    const letzterTag = new Date(sortiert[0]);
    letzterTagEl.textContent = `Letzter Eintrag: ${letzterTag.toLocaleDateString('de-AT', { weekday: 'long', day: 'numeric', month: 'long' })}`;
    letzterTagEl.style.color = '#888';
  } else {
    letzterTagEl.textContent = 'Noch keine Aktivität eingetragen.';
    letzterTagEl.style.color = '#888';
  }
}

// ════════════════════════════════════════
// FUNKTION: Streak-Kalender anzeigen
// Zeigt die letzten 14 Tage als Punkte
// ════════════════════════════════════════
function streakKalenderAnzeigen() {
  const kalender = document.getElementById('streak-kalender');
  const aktivitaeten = JSON.parse(localStorage.getItem('petday_aktivitaeten') || '[]');

  kalender.innerHTML = ''; // Leeren

  const tageNamen = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

  // Die letzten 14 Tage anzeigen
  for (let i = 13; i >= 0; i--) {
    const datum = new Date();
    datum.setDate(datum.getDate() - i);
    const datumString = datum.toISOString().split('T')[0];
    const tagName = tageNamen[datum.getDay()];
    const istAktiv = aktivitaeten.includes(datumString);
    const istHeute = i === 0;

    // Für jeden Tag ein Element erstellen (DOM-Manipulation)
    const tagEl = document.createElement('div');
    tagEl.style.cssText = `
      text-align: center;
      min-width: 45px;
    `;

    tagEl.innerHTML = `
      <div style="font-size: 0.7rem; color: #aaa; margin-bottom: 0.3rem;">${tagName}</div>
      <div style="
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.1rem;
        margin: 0 auto;
        border: ${istHeute ? '3px solid #FF6B35' : '2px solid transparent'};
        background: ${istAktiv ? 'linear-gradient(135deg, #FFD93D, #FF6B35)' : '#f0ede4'};
        box-shadow: ${istAktiv ? '0 2px 8px rgba(255,107,53,0.4)' : 'none'};
        transition: transform 0.2s;
        cursor: default;
      " title="${datum.toLocaleDateString('de-AT')}">
        ${istAktiv ? '🐾' : '·'}
      </div>
      <div style="font-size: 0.7rem; color: #aaa; margin-top: 0.3rem;">${datum.getDate()}.${datum.getMonth()+1}.</div>
    `;

    kalender.appendChild(tagEl);
  }
}

// ════════════════════════════════════════
// FUNKTION: Streak zurücksetzen
// ════════════════════════════════════════
function streakZuruecksetzen() {
  // Sicherheitsabfrage
  if (!confirm('Wirklich alle Streak-Daten löschen? Das kann nicht rückgängig gemacht werden!')) {
    return;
  }

  localStorage.removeItem('petday_aktivitaeten');
  streakAnzeigen();
  streakKalenderAnzeigen();
}

// ════════════════════════════════════════
// Beim Laden der Seite: Streak anzeigen
// ════════════════════════════════════════
// DOMContentLoaded = wird ausgeführt wenn
// die HTML-Seite fertig geladen ist
document.addEventListener('DOMContentLoaded', streakInitialisieren);