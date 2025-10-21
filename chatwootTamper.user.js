// ==UserScript==
// @name         Chatwoot TamperScript
// @namespace    http://tampermonkey.net/
// @version      2.28
// @description  Email Breite & Title & Zitate/Signaturen/Notizen wegklappen & Dashboard als Sidebar
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

/* Logo-Bild verkleinern */
img[src*="frankenschaum.de/bilder/intern/shoplogo"] {
  max-width: 6rem !important;
  height: auto !important;
}

/* Dashboard App Sidebar */
.dashboard-app-sidebar {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 600px;
  background: white;
  border-left: 1px solid #e0e0e0;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: -2px 0 8px rgba(0,0,0,0.1);
}

.dashboard-app-sidebar iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* Hauptbereich anpassen wenn Sidebar aktiv - Tab Container auf calc() */
body.has-dashboard-sidebar [role="main"],
body.has-dashboard-sidebar main,
body.has-dashboard-sidebar .view-box,
body.has-dashboard-sidebar .conversations-view {
  width: calc(100% - 400px) !important;
  max-width: calc(100% - 400px) !important;
}

/* Message Container behält volle Breite innerhalb seines Parents */
body.has-dashboard-sidebar .conversation-wrap,
body.has-dashboard-sidebar .messages-wrap,
body.has-dashboard-sidebar .bubble,
body.has-dashboard-sidebar .wrap {
  max-width: 100% !important;
  width: 100% !important;
  margin-right: 0 !important;
}

/* Reply Box Breite anpassen */
.reply-box {
  max-width: calc(100% - 60px) !important;
}

/* Banner Breite anpassen */
.banner.woot-banner {
  max-width: calc(100% - 60px) !important;
}

/* Contact Sidebar Toggle Button positionieren */
.flex.flex-col.justify-center.items-center.absolute.top-36.xl\\:top-24.ltr\\:right-2.rtl\\:left-2.bg-n-solid-2.border.border-n-weak.rounded-full.gap-2.p-1 {
  z-index: 999999 !important;
  right: 3rem !important;
  top: 3rem !important;
}

/* Tab ausblenden */
[role="tab"]:has([href*="dashboard"]),
[role="tab"]:has-text("Bestellungen"),
button:has-text("Bestellungen") {
  display: none !important;
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

// ===== NEUE FUNKTION: Dashboard App als Sidebar =====

let currentConversationId = null;
let dashboardSidebar = null;
let dashboardIframeInSidebar = null;

function getCurrentConversationId() {
    // Versuche die Conversation ID aus der URL zu extrahieren
    const urlMatch = window.location.pathname.match(/\/conversations\/(\d+)/);
    if (urlMatch) {
        return urlMatch[1];
    }

    // Alternativ: Suche in einem data-Attribut oder anderen DOM-Element
    const conversationElement = document.querySelector('[data-conversation-id]');
    if (conversationElement) {
        return conversationElement.dataset.conversationId;
    }

    return null;
}

function reloadDashboardIframe() {
    if (!dashboardIframeInSidebar) return;

    console.log('🔄 Dashboard wird neu geladen für Conversation:', currentConversationId);

    // Triggere einen Tab-Wechsel um Chatwoot zu zwingen, Daten zu senden
    ensureDashboardTabIsActive();

    // Force reload des iframes für neue Conversation
    setTimeout(() => {
        const currentSrc = dashboardIframeInSidebar.src;
        // Füge einen Timestamp-Parameter hinzu um Cache zu umgehen
        const separator = currentSrc.includes('?') ? '&' : '?';
        dashboardIframeInSidebar.src = currentSrc.split('?')[0] + separator + '_reload=' + Date.now();
        console.log('🔄 Dashboard iframe reloaded');
    }, 300);
}

function ensureDashboardTabIsActive() {
    // Simuliere Klick auf den Dashboard Tab um sicherzustellen,
    // dass Chatwoot die Daten an das iframe sendet

    // Suche nach verschiedenen Tab-Selektoren
    const possibleSelectors = [
        '[role="tab"]',  // Standard ARIA tabs
        'li a',          // Chatwoot verwendet <li><a>
        '.flex-shrink-0 a',  // Spezifischer Chatwoot-Selektor
        'a[class*="cursor-pointer"]'  // Links mit cursor-pointer
    ];

    let foundTab = false;

    for (const selector of possibleSelectors) {
        const tabs = document.querySelectorAll(selector);

        tabs.forEach(tab => {
            const text = tab.textContent || '';
            if (text.trim() === 'Bestellungen' || text.includes('Dashboard')) {
                // Mache den Tab kurz sichtbar für den Klick (falls versteckt)
                const originalDisplay = tab.style.display;
                const parentOriginalDisplay = tab.parentElement?.style.display;

                tab.style.display = 'block';
                if (tab.parentElement) {
                    tab.parentElement.style.display = 'block';
                }

                // Klicke auf den Tab
                tab.click();
                foundTab = true;
                console.log('🔘 Dashboard Tab aktiviert:', text.trim(), '(Selektor:', selector, ')');

                // Verstecke ihn nach dem Klick wieder
                setTimeout(() => {
                    tab.style.display = originalDisplay || 'none';
                    if (tab.parentElement) {
                        tab.parentElement.style.display = parentOriginalDisplay || 'none';
                    }
                }, 100);
            }
        });

        if (foundTab) break;  // Stoppe wenn gefunden
    }

    if (!foundTab) {
        console.log('⚠️ Dashboard Tab nicht gefunden');
    }

    return foundTab;
}

function moveDashboardAppToSidebar() {
    // Suche nach dem Dashboard App iframe
    const dashboardIframe = document.querySelector('iframe[src*="cwa.intern.frankenschaum.de"]');

    if (!dashboardIframe) {
        return;
    }

    // Prüfe ob Sidebar bereits existiert und das iframe bereits darin ist
    if (dashboardSidebar && dashboardSidebar.contains(dashboardIframe)) {
        return;
    }

    // Verstecke den Tab/Tab-Content (aber nicht das iframe!)
    const tabContent = dashboardIframe.closest('[role="tabpanel"]') ||
                       dashboardIframe.closest('.dashboard-app-container');

    // Suche und verstecke den Tab-Button (aber nach dem Klick!)
    const possibleSelectors = ['[role="tab"]', 'li a', '.flex-shrink-0 a'];

    possibleSelectors.forEach(selector => {
        const tabs = document.querySelectorAll(selector);
        tabs.forEach(tab => {
            const text = tab.textContent || '';
            if (text.trim() === 'Bestellungen' || text.includes('Dashboard')) {
                if (tab.parentElement) {
                    tab.parentElement.style.display = 'none';
                }
                tab.style.display = 'none';
            }
        });
    });

    // Erstelle die Sidebar falls noch nicht vorhanden
    if (!dashboardSidebar) {
        dashboardSidebar = document.createElement('div');
        dashboardSidebar.className = 'dashboard-app-sidebar';
        document.body.appendChild(dashboardSidebar);
        document.body.classList.add('has-dashboard-sidebar');
    }

    // WICHTIG: Verschiebe das ORIGINALE iframe (nicht klonen!)
    // Das ist wichtig, damit Chatwoot-Events beim iframe ankommen
    dashboardSidebar.appendChild(dashboardIframe);
    dashboardIframeInSidebar = dashboardIframe;

    // Entferne lazy loading
    dashboardIframe.loading = 'eager';

    // Jetzt können wir den Tab-Content verstecken (iframe ist ja schon raus)
    if (tabContent) {
        tabContent.style.display = 'none';
    }

    console.log('📊 Dashboard App als Sidebar verschoben (Original iframe)');

    // Klicke auf den Nachrichten-Tab um den Content anzuzeigen
    setTimeout(() => {
        clickMessagesTab();
    }, 200);
}

function clickMessagesTab(retryCount = 0) {
    // Suche nach dem Nachrichten-Tab
    const possibleSelectors = [
        'a.flex.items-center',
        '[class*="cursor-pointer"]',
        'a',
        'button',
        '[role="tab"]'
    ];

    let found = false;

    for (const selector of possibleSelectors) {
        if (found) break;

        const tabs = document.querySelectorAll(selector);
        for (const tab of tabs) {
            const text = tab.textContent || '';
            if (text.trim() === 'Nachrichten' || text.includes('Nachrichten')) {
                tab.click();
                console.log('✅ Nachrichten-Tab geklickt (Versuch ' + (retryCount + 1) + ')');
                found = true;
                break;
            }
        }
    }

    // Retry falls nicht gefunden und noch unter 5 Versuchen
    if (!found && retryCount < 5) {
        setTimeout(() => {
            clickMessagesTab(retryCount + 1);
        }, 200);
    } else if (!found) {
        console.log('⚠️ Nachrichten-Tab nicht gefunden nach 5 Versuchen');
    }
}

function checkConversationChange() {
    const newConversationId = getCurrentConversationId();

    if (newConversationId && newConversationId !== currentConversationId) {
        console.log('🔄 Conversation geändert:', currentConversationId, '->', newConversationId);
        currentConversationId = newConversationId;

        // Aktiviere den Dashboard Tab damit Chatwoot Daten sendet
        setTimeout(() => {
            ensureDashboardTabIsActive();
            moveDashboardAppToSidebar();
        }, 100);

        // Klicke auf Nachrichten-Tab um Content anzuzeigen - mehrmals mit Verzögerung
        setTimeout(() => {
            clickMessagesTab();
        }, 400);

        setTimeout(() => {
            clickMessagesTab();
        }, 800);

        setTimeout(() => {
            clickMessagesTab();
        }, 1200);

        // Reload das Dashboard nach kurzer Verzögerung
        setTimeout(() => {
            reloadDashboardIframe();
        }, 600);
    }
}

// Observer für Dashboard App UND Conversation Changes
const dashboardObserver = new MutationObserver(() => {
    moveDashboardAppToSidebar();
    checkConversationChange();
});

dashboardObserver.observe(document.body, {
    childList: true,
    subtree: true
});

// Überwache auch URL-Änderungen
let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        console.log('🔗 URL geändert:', url);
        checkConversationChange();
    }
}).observe(document, {subtree: true, childList: true});

// Contact Sidebar Toggle - setze z-index wenn geklickt
let isDashboardSidebarHidden = false;

function setupContactSidebarToggle() {
    // Finde den Toggle-Button (mit user icon)
    const toggleButton = document.querySelector('button.\\!rounded-full .i-ph-user-bold');

    if (toggleButton && toggleButton.parentElement) {
        const button = toggleButton.parentElement;

        // Entferne alte Listener falls vorhanden
        button.removeEventListener('click', handleContactSidebarToggle);

        // Füge neuen Listener hinzu
        button.addEventListener('click', handleContactSidebarToggle);
        console.log('👤 Contact Sidebar Toggle Button gefunden und Listener hinzugefügt');
    }
}

function handleContactSidebarToggle() {
    setTimeout(() => {
        // Finde die Contact Sidebar
        const contactSidebar = document.querySelector('.bg-n-background.h-full.overflow-hidden.flex.flex-col.fixed.top-0.z-40');
        const dashboardSidebarElement = document.querySelector('.dashboard-app-sidebar');

        if (contactSidebar) {
            contactSidebar.style.zIndex = '9999999';
        }

        // Toggle Dashboard Sidebar Sichtbarkeit
        if (dashboardSidebarElement) {
            if (isDashboardSidebarHidden) {
                // Dashboard Sidebar war ausgeblendet -> wieder einblenden
                dashboardSidebarElement.style.display = 'block';
                isDashboardSidebarHidden = false;
                console.log('📱 Dashboard Sidebar eingeblendet');
            } else {
                // Dashboard Sidebar war sichtbar -> ausblenden
                dashboardSidebarElement.style.display = 'none';
                isDashboardSidebarHidden = true;
                console.log('📱 Dashboard Sidebar ausgeblendet');
            }
        }
    }, 100);
}

// Observer für Contact Toggle Button
const contactToggleObserver = new MutationObserver(() => {
    setupContactSidebarToggle();
});

contactToggleObserver.observe(document.body, {
    childList: true,
    subtree: true
});

// Initial ausführen
setupContactSidebarToggle();

// Initial ausführen - mehrfach versuchen bis Dashboard gefunden wird
let initAttempts = 0;
const maxInitAttempts = 10;

function initializeDashboard() {
    initAttempts++;

    // Klicke auf Dashboard Tab
    ensureDashboardTabIsActive();

    // Warte kurz und versuche dann das Dashboard zu verschieben
    setTimeout(() => {
        const iframe = document.querySelector('iframe[src*="cwa.intern.frankenschaum.de"]');

        if (iframe) {
            moveDashboardAppToSidebar();
            currentConversationId = getCurrentConversationId();
            console.log('✅ Dashboard erfolgreich initialisiert');
        } else if (initAttempts < maxInitAttempts) {
            console.log(`🔄 Dashboard noch nicht geladen, Versuch ${initAttempts}/${maxInitAttempts}`);
            setTimeout(initializeDashboard, 500);
        } else {
            console.log('⚠️ Dashboard konnte nicht gefunden werden');
        }
    }, 300);
}

// Starte Initialisierung nach 500ms
setTimeout(initializeDashboard, 500);
