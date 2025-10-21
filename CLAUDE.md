# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains a Tampermonkey/Greasemonkey UserScript that enhances the Chatwoot interface for FrankenSchaum Support. The script is a single-file JavaScript application (`chatwootTamper.user.js`) that runs in the browser and modifies the DOM and styles of `https://hallo.frankenschaum.de/*`.

## Architecture

### Single-File Structure
The entire application is contained in `chatwootTamper.user.js` with:
- **UserScript Metadata Block** (lines 1-12): Version, author, URLs, grants
- **CSS Injection** (lines 16-30): Uses `GM_addStyle` to override Chatwoot styles
- **DOM Manipulation Functions**: Three main functions that modify the page behavior
- **MutationObservers**: Two observers that watch for DOM changes and trigger automatic actions

### Core Functions

1. **`scrollToLastMessage()`** (lines 45-75)
   - Finds all `div[id^="message"]` elements
   - Sorts by numeric ID (descending)
   - Scrolls to the second-to-last message for optimal viewing position

2. **`clickExpandButton()`** (lines 77-90)
   - Auto-clicks buttons containing "E-Mail erweitern" text
   - Uses `dataset._autoClicked` flag to prevent duplicate clicks
   - Triggers `scrollToLastMessage()` after 300ms delay

3. **`removeDuplicateSignature()`** (lines 105-124)
   - Removes duplicate email signatures between two "--" separators
   - Targets the ProseMirror editor element
   - Removes all paragraphs between first and second "--" occurrence

### Event Handling Pattern

The script uses two `MutationObserver` instances:
- **buttonObserver** (lines 93-103): Watches for new "E-Mail erweitern" buttons
- **sigObserver** (lines 127-139): Watches for duplicate signatures in the editor

Both observe `document.body` with `{ childList: true, subtree: true }`.

## Development Commands

This repository has no build process, tests, or dependencies. The UserScript is deployed directly.

### Testing Changes
1. Edit `chatwootTamper.user.js`
2. Update version number in the metadata block (line 4)
3. Save the file
4. In Tampermonkey, either:
   - Reload the script manually, or
   - Tampermonkey will auto-update from the GitHub URL (line 9)
5. Refresh `https://hallo.frankenschaum.de/` in the browser
6. Check browser console for `tamper aktiviert` log message (line 14)

### Deployment
```bash
git add chatwootTamper.user.js
git commit -m "Update description"
git push origin master
```

Users will auto-update via the `@updateURL` and `@downloadURL` directives pointing to the raw GitHub URL.

## Important Conventions

### Version Numbers
- Update `@version` in metadata block (line 4) whenever making changes
- Current version follows format: `1.XX` (e.g., 1.99)

### CSS Selectors
The script targets specific Chatwoot elements:
- `.conversation-panel > li .wrap` - message containers
- `.bubble` - individual message bubbles
- `.max-h-\[400px\]` - Tailwind class (escaped brackets)
- `.ProseMirror-woot-style` - text editor
- `[role="listitem"]` - message list items
- `.bg-red-50` - special message highlighting

When adding new style overrides, use `!important` flags as the script needs to override Chatwoot's built-in styles.

### DOM Manipulation Safety
- Always check if elements exist before manipulating them
- Use flags (like `dataset._autoClicked`) to prevent infinite loops
- Use `setTimeout` with reasonable delays (300ms) when triggering actions after DOM changes

### Console Logging
Include emoji prefixes for visibility:
- `🔘` for button clicks
- `✂️` for content removal
- General status messages without emoji

## Metadata Requirements

The UserScript metadata block must include:
- `@name` - Display name in Tampermonkey
- `@namespace` - Unique identifier
- `@version` - Semantic version number
- `@match` - URL pattern where script runs
- `@updateURL` and `@downloadURL` - GitHub raw file URLs
- `@grant GM_addStyle` - Required permission for CSS injection
