// ==UserScript==
// @name         Chatwoot Email Breite 100%
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  try to take over the world!
// @author       Andreas Hemmerich
// @match        https://hallo.frankenschaum.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=frankenschaum.de
// @updateURL    https://github.com/Schaumstoffe-Wegerich/tamper/raw/master/chatwootTamper.user.js
// @downloadURL  https://github.com/Schaumstoffe-Wegerich/tamper/raw/master/chatwootTamper.user.js
// @grant        GM_addStyle
// ==/UserScript==

console.log('tamper aktiviert');

document.title = "FrankenSchaum Support";

GM_addStyle(`
.conversation-panel > li .wrap {
 max-width: 100% !important;
}
`);
