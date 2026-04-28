# Sorter

A dependency-free Chrome extension that sorts and groups unpinned tabs in the current window by normalized hostname. Pinned tabs stay at the front and are skipped when grouping.

## Load Locally

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this project directory.

Click the extension action and choose **Sort by domain** or **Group by domain**. The extension also registers `Alt+Shift+D` for sorting and `Alt+Shift+G` for grouping. Both can be changed at `chrome://extensions/shortcuts`.

## Project Files

- `manifest.json`: Manifest V3 extension metadata.
- `tabs.js`: Shared tab sorting and grouping logic.
- `popup.html`, `popup.css`, `popup.js`: Extension popup.
- `background.js`: Keyboard command handlers.
