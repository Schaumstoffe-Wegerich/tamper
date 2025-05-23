// ==UserScript==
// @name         Chatwoot TamperScript
// @namespace    http://tampermonkey.net/
// @version      1.97
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
.conversation-panel > li .wrap, .wrap, .wrap .bubble {
 max-width: 100% !important;
 width: 95% !important;
}

[role="listitem"] {
    background: var(--g-50);
}
.max-h-\[400px\] {
  max-height:70vh !important;
}
.absolute.left-0.right-0.bottom-0.h-40.px-8.flex.items-end.bg-gradient-to-t.from-n-gray-3.via-n-gray-3.via-20\%.to-transparent { display: none;}
.ProseMirror-woot-style {  max-height: 30rem;  min-height: 5rem;  overflow: auto;}
`);
document.title = "FrankenSchaum Support";
document.addEventListener('DOMContentLoaded', function() {
        // Finde alle Elemente mit role="listitem"
        const listItems = document.querySelectorAll('[role="listitem"]');

        listItems.forEach(function(item) {
            // Prüfe, ob das Element ein Kind mit der Klasse .bg-red-50 hat
            if (item.querySelector('.bg-red-50')) {
                // Ändere den Hintergrund des listitem-Elements
                item.style.background = 'var(--s-100)';
            }
        });
    });

function scrollToLastMessage() {
    const messageElements = document.querySelectorAll('div[id^="message"]');
    const messages = [];

    messageElements.forEach(element => {
      const id = element.id;
      const match = id.match(/^message(\d+)$/);
      if (match) {
        const currentIdNum = parseInt(match[1], 10);
        messages.push({ id: currentIdNum, element: element });
      }
    });

    // Sort messages by ID in descending order
    messages.sort((a, b) => b.id - a.id);

    let targetElement = null;
    // Check if there are at least two messages to select the second to last
    if (messages.length >= 2) {
      targetElement = messages[1].element; // The second element is the second to last
    } else if (messages.length === 1) {
      targetElement = messages[0].element; // If only one, scroll to it
    }

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      console.log(`Scrolled to message: ${targetElement.id}`);
    } else {
      console.log('No message element found to scroll to.');
    }
}

function clickExpandButton() {
    // Selektiert den Button anhand der enthaltenen Textinhalte
    const buttons = Array.from(document.querySelectorAll('button.text-n-slate-12'))
        .filter(btn => btn.textContent.includes('E-Mail erweitern'));

    buttons.forEach(button => {
        if (!button.dataset._autoClicked) { // Verhindert mehrfaches Klicken
            button.click();
            button.dataset._autoClicked = "true";
            console.log('🔘 "E-Mail erweitern"-Button automatisch geklickt');
            setTimeout(scrollToLastMessage, 300);
        }
    });
}

// MutationObserver, um auf neue Buttons zu reagieren
const buttonObserver = new MutationObserver(() => {
    clickExpandButton();
});

buttonObserver.observe(document.body, {
    childList: true,
    subtree: true
});

// Auch initial prüfen
clickExpandButton();

function removeDuplicateSignature() {
    const editor = document.querySelector('.ProseMirror.ProseMirror-woot-style');
    if (!editor) return;

    const paragraphs = Array.from(editor.querySelectorAll('p'));
    const sepIndexes = paragraphs
        .map((p, i) => p.textContent.trim() === '--' ? i : -1)
        .filter(i => i !== -1);

    if (sepIndexes.length >= 2) {
        const [firstSep, secondSep] = sepIndexes;

        // Entferne alles zwischen erstem Trenner und dem zweiten
        for (let i = firstSep; i < secondSep; i++) {
            paragraphs[i].remove();
        }

        console.log(`✂️ Erste Signatur entfernt (zwischen Absatz ${firstSep} und ${secondSep})`);
    }
}

// Trigger bei DOM-Änderungen
const sigObserver = new MutationObserver(() => {
    removeDuplicateSignature();
});

sigObserver.observe(document.body, {
    childList: true,
    subtree: true
});

// Optional auch beim Laden
document.addEventListener('DOMContentLoaded', () => {
    removeDuplicateSignature();
});
