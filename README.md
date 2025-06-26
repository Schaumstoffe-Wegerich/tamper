# Chatwoot TamperScript

Ein UserScript für Tampermonkey/Greasemonkey, das die Chatwoot-Oberfläche von FrankenSchaum Support verbessert und zusätzliche Funktionen bietet.

## 🚀 Features

### 📐 Layout-Verbesserungen
- **Verbreiterte Nachrichten**: Nachrichten nutzen 95% der verfügbaren Breite für bessere Lesbarkeit
- **Optimierte Höhe**: Maximale Höhe von Chat-Elementen auf 70vh erhöht
- **Kompakterer Editor**: ProseMirror-Editor auf 15vh Höhe begrenzt mit Scroll-Funktion

### 🎨 Visuelle Anpassungen
- **Seitentitel**: Automatische Änderung zu "FrankenSchaum Support"
- **Farbkodierung**: Spezielle Hintergrundfarbe für Nachrichten mit `.bg-red-50` Klasse
- **Entfernung störender Elemente**: Gradient-Overlay am unteren Rand wird ausgeblendet

### 🤖 Automatisierte Funktionen
- **Auto-Expand**: Automatisches Klicken auf "E-Mail erweitern" Buttons
- **Smart Scrolling**: Automatisches Scrollen zur zweitletzen Nachricht nach dem Erweitern
- **Signatur-Bereinigung**: Automatisches Entfernen doppelter E-Mail-Signaturen

## 📦 Installation

### Voraussetzungen
- **Tampermonkey** (Chrome/Edge) oder **Greasemonkey** (Firefox)
- Zugriff auf `https://hallo.frankenschaum.de/*`

### Installationsschritte

1. **Browser-Extension installieren:**
   - [Tampermonkey für Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Tampermonkey für Firefox](https://addons.mozilla.org/de/firefox/addon/tampermonkey/)

2. **Script installieren:**
   ```
   https://github.com/Schaumstoffe-Wegerich/tamper/raw/master/chatwootTamper.user.js
   ```
   
   Klicken Sie auf den Link - Tampermonkey erkennt automatisch das UserScript und bietet die Installation an.

3. **Aktivierung bestätigen:**
   - Script in der Tampermonkey-Verwaltung aktivieren
   - Seite neu laden

## 🔧 Funktionsweise

### Layout-Optimierung
Das Script überschreibt CSS-Eigenschaften für:
- `.conversation-panel > li .wrap`
- `.bubble`
- `.max-h-[400px]`
- `.ProseMirror-woot-style`

### Automatische Aktionen
```javascript
// Auto-Expand für E-Mails
clickExpandButton() // Sucht nach "E-Mail erweitern" Buttons

// Intelligentes Scrolling
scrollToLastMessage() // Scrollt zur zweitletzen Nachricht

// Signatur-Bereinigung
removeDuplicateSignature() // Entfernt doppelte "--" Trenner
```

### Event-Listener
Das Script verwendet `MutationObserver` um auf DOM-Änderungen zu reagieren und neue Elemente automatisch zu verarbeiten.

## 🛠️ Anpassungen

### URL-Matching ändern
```javascript
// @match https://hallo.frankenschaum.de/*
```

### Styling anpassen
```javascript
GM_addStyle(`
  /* Ihre eigenen CSS-Regeln hier */
`);
```

### Neue Funktionen hinzufügen
Das Script ist modular aufgebaut - neue Funktionen können einfach hinzugefügt werden:

```javascript
function neueFeature() {
    // Ihre Logik hier
}

// Observer registrieren
const observer = new MutationObserver(() => {
    neueFeature();
});
```

## 📋 Changelog

### v1.99 (Aktuell)
- ✅ Automatisches E-Mail-Erweitern
- ✅ Signatur-Bereinigung
- ✅ Optimiertes Scrolling
- ✅ Layout-Verbesserungen

## 🐛 Problembehebung

### Script lädt nicht
- Browser-Cache leeren
- Tampermonkey neu starten
- Script-Berechtigungen prüfen

### Funktionen arbeiten nicht
- Konsole öffnen (F12) für Fehlermeldungen
- `console.log('tamper aktiviert')` sollte sichtbar sein

### Updates
Das Script aktualisiert sich automatisch über:
```
@updateURL https://github.com/Schaumstoffe-Wegerich/tamper/raw/master/chatwootTamper.user.js
```

## 📞 Support

Bei Problemen oder Verbesserungsvorschlägen:
- GitHub Issues verwenden
- Code direkt in Tampermonkey bearbeiten
- Konsolen-Logs für Debugging nutzen

## 📄 Lizenz

Dieses UserScript ist für den internen Gebrauch bei Schaumstoffe Wegerich entwickelt.

---

**Autor:** Andreas Hemmerich  
**Version:** 1.99  
**Namespace:** http://tampermonkey.net/
