# WMC_4BKIF_Grundbek_Manuela

# 🐾 PetDay Planner – WMC Abschlussprojekt
**4BKIF | Grundbek Manuela | SS 2026**

Eine interaktive Webseite für Tierbesitzer, die Wetter, Tierinfos und Wochenendplanung kombiniert.

🔗 **[→ Zur Webseite](https://manuelagru.github.io/WMC_4BKIF_Grundbek_Manuela/petday-planner/)**

petday-planner öffnen mit:
https://manuelagru.github.io/WMC_4BKIF_Grundbek_Manuela/petday-planner/
---

## 💡 Die Idee

Viele Tierbesitzer fragen sich täglich: **"Was machen wir heute?"** – und das hängt stark vom Wetter ab. Die Idee war eine App zu bauen die Wetter, Tierinfos und Planung in einer Webseite kombiniert, damit Tierbesitzer schnell und einfach ihren Tag oder ihr Wochenende planen können.

---

## 📄 3 Seiten

| Seite | Inhalt |
|---|---|
| 🌤️ **Wetter & Aktivitäten** | Aktuelles Wetter per API + passende Aktivitäten je nach Temperatur |
| 📅 **Weekend Planner** | Tierart & Lieblingsmarken eingeben → zufälliger Wochenendplan |
| 📚 **Tier-Lexikon** | Rassen suchen, Favoriten speichern, tierfreundliche Orte auf der Karte |

---

## ✨ Gadgets

- 🌡️ °C/°F Toggle
- 🎨 Theme wechselt je nach Wetter
- 🔀 "Neu mischen" Button für den Wochenendplan
- 🏆 **Activity Streak** – zählt Aktivitäten mit localStorage
- 🗺️ **Tierfreundliche Orte** – Karte mit Leaflet.js + OpenStreetMap

---

## 🏗️ Projektstruktur

```
petday-planner/
├── index.html          → Seite 1: Wetter & Aktivitäten
├── planner.html        → Seite 2: Weekend Planner
├── encyclopedia.html   → Seite 3: Tier-Lexikon
├── style.css           → Globales Design für alle Seiten
├── weather.js          → Wetter-Logik + Open-Meteo API
├── planner.js          → Wochenendplan + Array-Shuffle
├── encyclopedia.js     → Rassen-Suche + Favoriten
├── streak.js           → Activity Streak (localStorage)
├── map.js              → Leaflet + OpenStreetMap + Overpass API
└── rassen-daten.json   → Datenbank für Tier-Rassen
```

---

## 🔑 Verwendete Technologien

| Technologie | Wo | Was es macht |
|---|---|---|
| `fetch` + `async/await` | weather.js, encyclopedia.js | Daten vom Internet holen |
| Arrays + `.filter()` `.map()` | weather.js, planner.js | Listen verarbeiten |
| `document.createElement()` | überall | Neue HTML-Elemente bauen |
| `appendChild()` | überall | Element in die Seite einfügen |
| `innerHTML = ''` | überall | Inhalt löschen |
| `localStorage` | streak.js, encyclopedia.js | Daten im Browser speichern |
| `JSON.stringify/parse` | streak.js, encyclopedia.js | Objekte speichern/laden |

---

## 🌐 Verwendete APIs

- **Open-Meteo** – Wetterdaten (kostenlos, kein Key)
- **Dog CEO API** – Hundebilder (kostenlos, kein Key)
- **Leaflet.js + OpenStreetMap** – Karte (kostenlos, kein Key)
- **Overpass API** – Tierfreundliche Orte suchen

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# 🃏 Lernmaterial Generator – WMC Projekt
**4BKIF | Grundbek Manuela | WS 2025**

Ein interaktiver Lernkarten-Generator mit KI-Unterstützung und Quiz-Modus.

🔗 **[→ Zur Webseite](https://manuelagru.github.io/WMC_4BKIF_Grundbek_Manuela/lernkarten.neu/)**

Lernkarten.neu öffnen mit:
https://manuelagru.github.io/WMC_4BKIF_Grundbek_Manuela/lernkarten.neu/
---

## 💡 Die Idee

Lernmaterial soll nicht langweilig sein. Die App ermöglicht es, aus eigenen PDFs oder vorgefertigten Themen automatisch Lernkarten zu erstellen – und diese dann im Quiz-Modus zu üben.

---

## ✨ Features

| Feature | Beschreibung |
|---|---|
| 📋 **JSON-Themen** | Vorgefertigte Themen auswählen (SQL, Java OOP, HTML & CSS) |
| 📄 **PDF hochladen** | Eigene PDF hochladen → KI erstellt daraus Lernkarten |
| ✏️ **JSON bearbeiten** | Eigene Fragen & Antworten selbst erstellen |
| 🃏 **Karteikarten** | Zufällige oder selbst gewählte Karten zum Lernen |
| 🎯 **Quiz-Modus** | Fragen beantworten mit Auswertung |
| 📊 **Übersicht** | Zeigt was man kann und was noch geübt werden muss |

---

## 📚 Vorgefertigte Themen

- 🗄️ **SQL Grundlagen** – SELECT, WHERE, JOIN, Aggregatfunktionen
- ☕ **Java OOP** – Klassen, Vererbung, Interfaces & abstrakte Klassen
- 🌐 **HTML & CSS** – Box-Model, Flexbox & mehr

---

## 🏗️ Technologien

- HTML, CSS, JavaScript
- KI-generierte Fragen aus PDF-Inhalt
- JSON als Datenformat für Lernkarten

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## 📁 Weitere Projekte

