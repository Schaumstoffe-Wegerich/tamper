// ==UserScript==
// @name         Chatwoot Email Breite 100%
// @namespace    http://tampermonkey.net/
// @version      2024-02-14
// @description  try to take over the world!
// @author       You
// @match        https://hallo.frankenschaum.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=frankenschaum.de
// @updateURL    chatwootTamper.user.js
// @downloadURL  chatwootTamper.user.js
// @grant        GM_addStyle
// ==/UserScript==

console.log('tamper aktiviert');

document.title = "FrankenSchaum Support";

GM_addStyle(`
.conversation-panel > li .wrap {
 max-width: 100% !important;
}
`);
