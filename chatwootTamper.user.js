// ==UserScript==
// @name         Chatwoot TamperScript
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Email Breite & Title
// @author       Andreas Hemmerich
// @match        https://hallo.frankenschaum.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=frankenschaum.de
// @updateURL    https://github.com/Schaumstoffe-Wegerich/tamper/raw/master/chatwootTamper.user.js
// @downloadURL  https://github.com/Schaumstoffe-Wegerich/tamper/raw/master/chatwootTamper.user.js
// @grant        GM_addStyle
// ==/UserScript==

console.log('tamper aktiviert');

GM_addStyle(`
.conversation-panel > li .wrap {
 max-width: 100% !important;
}
[role="listitem"] {
    background: var(--g-50);
}
`);

function styleListItems() {
    // Suche alle Elemente mit role="listitem"
    const listItems = document.querySelectorAll('[role="listitem"]');
    
    listItems.forEach(item => {
        // Prüfe, ob ein Element mit der Klasse "target-element" als Nachkomme existiert
        if (item.querySelector('div div div div span')) {
            // Füge dem listitem-Element eine spezielle Klasse hinzu, wenn das Ziel-Element gefunden wurde
            item.style.background = 'var(--r-100)';
        }
    });
}

// Rufe die Funktion nach dem Laden der Seite auf
window.onload = styleListItems;
