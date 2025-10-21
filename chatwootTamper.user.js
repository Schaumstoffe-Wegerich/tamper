// ==UserScript==
// @name         Chatwoot TamperScript
// @namespace    http://tampermonkey.net/
// @version      2.02
// @description  Email Breite & Title & Zitate/Signaturen/Notizen wegklappen
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
.ProseMirror-woot-style {  max-height: 15vh;  min-height: 5rem;  overflow: auto;}

/* Styles für wegklappbare Zitate und Signaturen */
.email-collapse-wrapper {
  margin: 8px 0;
  border-left: 3px solid #e0e0e0;
  padding-left: 8px;
}
.email-collapse-button {
  background: #f5f5f5;
  border: 1px solid #ddd;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
  border-radius: 4px;
  color: #666;
  margin-bottom: 8px;
  display: inline-block;
}
.email-collapse-button:hover {
  background: #e8e8e8;
}
.email-collapse-content {
  overflow: hidden;
  transition: max-height 0.3s ease;
}
.email-collapse-content.collapsed {
  max-height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
}
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

// ===== NEUE FUNKTION: Zitate und Signaturen wegklappen =====

function createCollapsibleWrapper(elementsToWrap, label) {
    if (!elementsToWrap || elementsToWrap.length === 0) return null;

    const wrapper = document.createElement('div');
    wrapper.className = 'email-collapse-wrapper';

    const button = document.createElement('button');
    button.className = 'email-collapse-button';
    button.textContent = `▶ ${label}`;
    button.dataset.collapsed = 'true';

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'email-collapse-content collapsed';

    // Verschiebe alle Elemente in den contentWrapper
    elementsToWrap.forEach(el => {
        contentWrapper.appendChild(el.cloneNode(true));
    });

    button.addEventListener('click', () => {
        const isCollapsed = button.dataset.collapsed === 'true';
        if (isCollapsed) {
            contentWrapper.classList.remove('collapsed');
            contentWrapper.style.maxHeight = contentWrapper.scrollHeight + 'px';
            button.textContent = `▼ ${label}`;
            button.dataset.collapsed = 'false';
        } else {
            contentWrapper.style.maxHeight = '0';
            contentWrapper.classList.add('collapsed');
            button.textContent = `▶ ${label}`;
            button.dataset.collapsed = 'true';
        }
    });

    wrapper.appendChild(button);
    wrapper.appendChild(contentWrapper);
    wrapper.dataset._collapsible = 'true';

    return wrapper;
}

function findAndCollapseQuotesAndSignatures() {
    // Finde alle Nachrichten-Container
    const messages = document.querySelectorAll('div[id^="message"]');

    messages.forEach(messageDiv => {
        if (messageDiv.dataset._quotesProcessed) return;

        // Suche nach verschiedenen Strukturen für E-Mail-Inhalte
        const contentAreas = [
            ...messageDiv.querySelectorAll('.text-block-title'),
            ...messageDiv.querySelectorAll('p'),
            ...messageDiv.querySelectorAll('div')
        ];

        let i = 0;
        while (i < contentAreas.length) {
            const element = contentAreas[i];

            // Skip wenn bereits bearbeitet
            if (element.dataset._collapsible || element.closest('.email-collapse-wrapper')) {
                i++;
                continue;
            }

            const text = element.textContent || '';

            // Muster für zitierte E-Mails (häufigste deutsche und englische Varianten)
            const quotePatterns = [
                /^Am\s+\d{1,2}\.\d{1,2}\.\d{2,4}.*schrieb/i,
                /^On\s+.*\d{4}.*wrote:/i,
                /^Von:.*Gesendet:/i,
                /^From:.*Sent:/i,
                /^----.*Original.*Message.*----/i,
                /^_{5,}/,  // Lange Unterstriche
                /^={5,}/   // Lange Gleichheitszeichen
            ];

            const isQuoteStart = quotePatterns.some(pattern => pattern.test(text.trim()));

            if (isQuoteStart && element.parentNode) {
                // Sammle alle nachfolgenden Geschwister-Elemente
                const elementsToWrap = [element];
                let sibling = element.nextElementSibling;

                while (sibling) {
                    elementsToWrap.push(sibling);
                    sibling = sibling.nextElementSibling;
                }

                // Erstelle den Wrapper
                const wrapper = createCollapsibleWrapper(elementsToWrap, 'Zitierte E-Mail anzeigen');

                if (wrapper) {
                    // Füge den Wrapper vor dem ersten Element ein
                    element.parentNode.insertBefore(wrapper, element);

                    // Entferne die originalen Elemente
                    elementsToWrap.forEach(el => el.remove());

                    console.log('📧 Zitierte E-Mail gefunden und eingeklappt');
                }

                i += elementsToWrap.length;
                continue;
            }

            // Muster für Signaturen
            const signaturePatterns = [
                /^--\s*$/,
                /^Mit freundlichen Grüßen/i,
                /^Freundliche Grüße/i,
                /^Viele Grüße/i,
                /^Best regards/i,
                /^Kind regards/i,
                /^Regards/i,
                /^Grüße/i
            ];

            const isSignatureStart = signaturePatterns.some(pattern => pattern.test(text.trim()));

            if (isSignatureStart && element.parentNode) {
                // Sammle Signatur-Elemente (alle nachfolgenden Geschwister)
                const elementsToWrap = [element];
                let sibling = element.nextElementSibling;

                while (sibling) {
                    elementsToWrap.push(sibling);
                    sibling = sibling.nextElementSibling;
                }

                // Erstelle den Wrapper
                const wrapper = createCollapsibleWrapper(elementsToWrap, 'Signatur anzeigen');

                if (wrapper) {
                    // Füge den Wrapper vor dem ersten Element ein
                    element.parentNode.insertBefore(wrapper, element);

                    // Entferne die originalen Elemente
                    elementsToWrap.forEach(el => el.remove());

                    console.log('✍️ Signatur gefunden und eingeklappt');
                }

                i += elementsToWrap.length;
                continue;
            }

            i++;
        }

        messageDiv.dataset._quotesProcessed = 'true';
    });
}

// Observer für neue Nachrichten
const collapseObserver = new MutationObserver(() => {
    findAndCollapseQuotesAndSignatures();
});

collapseObserver.observe(document.body, {
    childList: true,
    subtree: true
});

// Initial ausführen
findAndCollapseQuotesAndSignatures();

// ===== NEUE FUNKTION: Interne Notizen wegklappen =====

function makeNoteCollapsible(noteElement) {
    if (noteElement.dataset._noteCollapsed) return; // Bereits bearbeitet

    // Finde den eigentlichen Content-Bereich der Notiz
    const noteContent = noteElement.querySelector('.bubble') ||
                        noteElement.querySelector('.text-content') ||
                        noteElement.querySelector('[class*="content"]') ||
                        noteElement;

    if (!noteContent) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'email-collapse-wrapper';
    wrapper.style.marginTop = '4px';

    const button = document.createElement('button');
    button.className = 'email-collapse-button';
    button.textContent = '▶ Notiz anzeigen';
    button.dataset.collapsed = 'true';

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'email-collapse-content collapsed';
    contentWrapper.style.maxHeight = '0';

    // Klone den Inhalt
    const originalContent = noteContent.cloneNode(true);
    contentWrapper.appendChild(originalContent);

    button.addEventListener('click', () => {
        const isCollapsed = button.dataset.collapsed === 'true';
        if (isCollapsed) {
            contentWrapper.classList.remove('collapsed');
            contentWrapper.style.maxHeight = contentWrapper.scrollHeight + 'px';
            button.textContent = '▼ Notiz ausblenden';
            button.dataset.collapsed = 'false';
        } else {
            contentWrapper.style.maxHeight = '0';
            contentWrapper.classList.add('collapsed');
            button.textContent = '▶ Notiz anzeigen';
            button.dataset.collapsed = 'true';
        }
    });

    wrapper.appendChild(button);
    wrapper.appendChild(contentWrapper);

    // Verstecke den originalen Inhalt
    noteContent.style.display = 'none';

    // Füge den Wrapper nach dem Notiz-Element ein
    if (noteElement.parentNode) {
        noteElement.appendChild(wrapper);
    }

    noteElement.dataset._noteCollapsed = 'true';
    console.log('📝 Interne Notiz eingeklappt');
}

function findAndCollapseNotes() {
    // Suche nach verschiedenen Selektoren für interne Notizen in Chatwoot
    const noteSelectors = [
        '.activity--note',
        '.note-wrap',
        '[class*="note"]',
        '[class*="activity"][class*="note"]',
        '.is-private',
        '[data-message-type="note"]',
        '.conversation-panel .wrap:has(.bg-yellow-50)',
        '.conversation-panel .wrap:has(.bg-amber-50)',
        '[role="listitem"]:has([class*="private"])',
        '[role="listitem"]:has([class*="note"])'
    ];

    noteSelectors.forEach(selector => {
        try {
            const notes = document.querySelectorAll(selector);
            notes.forEach(note => {
                // Prüfe, ob es wirklich eine Notiz ist (nicht eine normale Nachricht)
                if (!note.dataset._noteCollapsed) {
                    // Zusätzliche Validierung: Überspringe wenn es eine normale Nachricht ist
                    const hasIncomingOutgoing = note.classList.contains('incoming') ||
                                                note.classList.contains('outgoing');
                    if (!hasIncomingOutgoing) {
                        makeNoteCollapsible(note);
                    }
                }
            });
        } catch (e) {
            // Ignoriere ungültige Selektoren
        }
    });
}

// Observer für neue Notizen
const notesObserver = new MutationObserver(() => {
    findAndCollapseNotes();
});

notesObserver.observe(document.body, {
    childList: true,
    subtree: true
});

// Initial ausführen
findAndCollapseNotes();
