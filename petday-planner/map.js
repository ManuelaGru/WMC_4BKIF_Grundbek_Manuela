// ════════════════════════════════════════
// map.js – Tierfreundliche Orte
// Verwendet:
//   - Leaflet.js (kostenlose Karten-Bibliothek)
//   - OpenStreetMap (kostenlose Kartendaten)
//   - Overpass API (kostenlose POI-Suche)
// ════════════════════════════════════════

// ── Globale Variablen für die Karte ──
let karte = null;         // Leaflet-Karten-Objekt
let markerGruppe = null;  // Gruppe aller Marker auf der Karte
let nutzerPosition = null; // GPS-Position des Users

// ════════════════════════════════════════
// FUNKTION: Karte initialisieren
// Wird aufgerufen wenn der Karten-Tab
// geöffnet wird
// ════════════════════════════════════════
function karteInitialisieren() {
  // Nur einmal initialisieren
  if (karte !== null) return;

  // Standard-Position: Wien (falls kein GPS)
  const startPos = [48.2082, 16.3738];

  // Leaflet-Karte erstellen
  // 'karte' = ID des HTML-Elements
  // center = Startposition [Breitengrad, Längengrad]
  // zoom = Zoom-Level (1=Welt, 18=Straße)
  karte = L.map('karte').setView(startPos, 13);

  // OpenStreetMap-Kacheln hinzufügen (das ist das eigentliche Kartenmaterial)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> Mitwirkende',
    maxZoom: 19,
  }).addTo(karte);

  // Marker-Gruppe erstellen (für späteres Löschen aller Marker)
  markerGruppe = L.layerGroup().addTo(karte);

  // GPS-Standort ermitteln
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        nutzerPosition = [position.coords.latitude, position.coords.longitude];

        // Karte auf Nutzer-Position zentrieren
        karte.setView(nutzerPosition, 14);

        // Nutzer-Marker mit eigenem Icon
        L.marker(nutzerPosition, {
          icon: L.divIcon({
            html: '<div style="font-size:1.8rem; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">📍</div>',
            className: '',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
          })
        })
        .addTo(karte)
        .bindPopup('<b>Mein Standort</b>')
        .openPopup();

        // Standardmäßig Hundeparks laden
        orteAnzeigen('park');
      },
      () => {
        // GPS abgelehnt → Hundeparks trotzdem laden (Wien als Standard)
        orteAnzeigen('park');
      }
    );
  } else {
    orteAnzeigen('park');
  }
}

// ════════════════════════════════════════
// FUNKTION: Orte anzeigen
// Typ: 'park', 'tierarzt', 'zoohandlung'
// ════════════════════════════════════════
async function orteAnzeigen(typ) {
  if (!karte) {
    karteInitialisieren();
    return;
  }

  // Alle Button-Farben zurücksetzen
  ['park', 'tierarzt', 'zoo'].forEach(t => {
    const btn = document.getElementById(`btn-${t}`);
    if (btn) {
      btn.className = 'btn btn-grau';
    }
  });

  // Aktiven Button hervorheben
  const aktivBtn = {
    park: document.getElementById('btn-park'),
    tierarzt: document.getElementById('btn-tierarzt'),
    zoohandlung: document.getElementById('btn-zoo'),
  }[typ];

  if (aktivBtn) {
    aktivBtn.className = `btn ${typ === 'park' ? 'btn-gruen' : typ === 'tierarzt' ? 'btn-pink' : 'btn-blau'}`;
  }

  // Alle bisherigen Marker löschen
  markerGruppe.clearLayers();

  // Suchposition: Nutzer-Position oder Wien
  const pos = nutzerPosition || [48.2082, 16.3738];
  const radius = 3000; // 3km Radius

  // Overpass API Query (sucht in OpenStreetMap nach bestimmten Orten)
  // Overpass QL = spezielle Abfragesprache für OpenStreetMap
  const queries = {
    park: `
      [out:json][timeout:25];
      (
        node["leisure"="dog_park"](around:${radius},${pos[0]},${pos[1]});
        node["leisure"="park"](around:${radius},${pos[0]},${pos[1]});
        node["leisure"="playground"](around:${radius},${pos[0]},${pos[1]});
      );
      out body 20;
    `,
    tierarzt: `
      [out:json][timeout:25];
      (
        node["amenity"="veterinary"](around:${radius},${pos[0]},${pos[1]});
      );
      out body 20;
    `,
    zoohandlung: `
      [out:json][timeout:25];
      (
        node["shop"="pet"](around:${radius},${pos[0]},${pos[1]});
        node["shop"="agrarian"](around:${radius},${pos[0]},${pos[1]});
      );
      out body 20;
    `,
  };

  const query = queries[typ];

  // Lade-Text auf der Karte
  const ladeOverlay = document.createElement('div');
  ladeOverlay.id = 'karte-lade';
  ladeOverlay.style.cssText = `
    position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
    background: white; padding: 1rem 2rem; border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2); z-index: 1000;
    font-weight: 700; font-family: 'Nunito', sans-serif;
  `;
  ladeOverlay.textContent = 'Orte werden gesucht...';
  document.getElementById('karte').appendChild(ladeOverlay);

  try {
    // Overpass API anfragen
    const antwort = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
    });

    const daten = await antwort.json();
    const orte = daten.elements; // Array aller gefundenen Orte

    // Lade-Overlay entfernen
    ladeOverlay.remove();

    if (orte.length === 0) {
      // Placeholder-Marker wenn nichts gefunden
      zeigeBeispielMarker(typ, pos);
      return;
    }

    // Emoji und Farbe je nach Typ
    const markerConfig = {
      park:        { emoji: '🌳', farbe: '#95D5B2' },
      tierarzt:    { emoji: '🏥', farbe: '#FF6B9D' },
      zoohandlung: { emoji: '🐾', farbe: '#4ECDC4' },
    };
    const config = markerConfig[typ];

    // Für jeden gefundenen Ort einen Marker auf der Karte erstellen
    orte.forEach(ort => {
      if (!ort.lat || !ort.lon) return; // Nur Orte mit Koordinaten

      // Name des Ortes (oder Standard-Text)
      const name = ort.tags?.name || ort.tags?.['name:de'] || typZuName(typ);

      // Custom Emoji-Marker erstellen
      const marker = L.marker([ort.lat, ort.lon], {
        icon: L.divIcon({
          html: `
            <div style="
              background: ${config.farbe};
              border-radius: 50%;
              width: 36px; height: 36px;
              display: flex; align-items: center; justify-content: center;
              font-size: 1.2rem;
              box-shadow: 0 2px 8px rgba(0,0,0,0.25);
              border: 3px solid white;
            ">${config.emoji}</div>
          `,
          className: '',
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        })
      });

      // Popup mit Informationen
      const adresse = [
        ort.tags?.['addr:street'],
        ort.tags?.['addr:housenumber'],
        ort.tags?.['addr:city'],
      ].filter(Boolean).join(' ') || 'Adresse nicht verfügbar';

      marker.bindPopup(`
        <div style="font-family: 'Nunito', sans-serif; min-width: 160px;">
          <div style="font-weight: 800; font-size: 1rem; margin-bottom: 0.3rem;">${config.emoji} ${name}</div>
          <div style="color: #888; font-size: 0.85rem;">${adresse}</div>
          ${ort.tags?.opening_hours ? `<div style="margin-top: 0.3rem; font-size: 0.85rem;">🕐 ${ort.tags.opening_hours}</div>` : ''}
          ${ort.tags?.phone ? `<div style="font-size: 0.85rem;">📞 ${ort.tags.phone}</div>` : ''}
        </div>
      `);

      // Marker zur Gruppe hinzufügen (DOM der Karte)
      markerGruppe.addLayer(marker);
    });

    // Karte auf alle Marker ausrichten
    if (markerGruppe.getLayers().length > 0) {
      const bounds = markerGruppe.getBounds();
      karte.fitBounds(bounds, { padding: [50, 50] });
    }

  } catch (fehler) {
    console.error('Overpass API Fehler:', fehler);
    ladeOverlay.remove();
    // Beispiel-Marker als Fallback
    zeigeBeispielMarker(typ, pos);
  }
}

// ════════════════════════════════════════
// FUNKTION: Beispiel-Marker als Fallback
// (wenn API nichts findet oder Fehler)
// ════════════════════════════════════════
function zeigeBeispielMarker(typ, pos) {
  const config = {
    park:        { emoji: '🌳', name: 'Park (Beispiel)', farbe: '#95D5B2' },
    tierarzt:    { emoji: '🏥', name: 'Tierarzt (Beispiel)', farbe: '#FF6B9D' },
    zoohandlung: { emoji: '🐾', name: 'Zoohandlung (Beispiel)', farbe: '#4ECDC4' },
  }[typ];

  // Leicht verschobene Beispiel-Marker
  const offsets = [[0.003, 0.005], [-0.004, 0.002], [0.001, -0.006]];
  offsets.forEach(([dlat, dlon]) => {
    const marker = L.marker([pos[0]+dlat, pos[1]+dlon], {
      icon: L.divIcon({
        html: `<div style="background:${config.farbe}; border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; font-size:1.2rem; box-shadow:0 2px 8px rgba(0,0,0,0.25); border:3px solid white;">${config.emoji}</div>`,
        className: '', iconSize: [36, 36], iconAnchor: [18, 18],
      })
    }).bindPopup(`<b>${config.emoji} ${config.name}</b><br><span style="color:#888; font-size:0.85rem;">Keine echten Daten verfügbar</span>`);
    markerGruppe.addLayer(marker);
  });
}

// ════════════════════════════════════════
// HILFSFUNKTION: Typ → Anzeige-Name
// ════════════════════════════════════════
function typZuName(typ) {
  const namen = {
    park: 'Park / Grünfläche',
    tierarzt: 'Tierarzt',
    zoohandlung: 'Zoohandlung',
  };
  return namen[typ] || 'Ort';
}