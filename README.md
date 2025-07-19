# Codex
Here’s a more complete README for your Chrome extension:

---

# Codex

Codex is a Chrome extension that lets you copy, explain, and interact with code blocks on any webpage using AI.

## Features

- Copy code blocks from any website
- Get instant AI-powered explanations for code
- Interact with code using the Gemini API
- Simple popup interface

## Installation

1. Clone or download this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable "Developer mode" (top right).
4. Click "Load unpacked" and select this project folder.

## Permissions

- `storage`: To save extension settings
- `clipboardWrite`: To copy code to clipboard
- Host permission for `https://generativelanguage.googleapis.com/` (Gemini API)

## Usage

- Click the extension icon to open the popup.
- Select code on any page and use the extension to copy or get explanations.

## Development

- Main files: manifest.json, background.js, content.js, popup.html, popup.js, styles.css
- Icons are in the icons folder.

---

You can copy and paste this into your README.md. Let me know if you want to add more details!