# Sorter

A dependency-free Chrome extension that sorts, groups, and ungroups tabs in the current window. Sorting and grouping use normalized hostnames. Pinned tabs stay at the front and are skipped when grouping. After grouping, domain groups are collapsed and leftover ungrouped tabs move to the end of the window.

## Load Locally

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this project directory.

Click the extension action and choose **Sort by domain**, **Group by domain**, or **Ungroup tabs**. The extension also registers `Alt+Shift+D` for sorting, `Alt+Shift+G` for grouping, and `Alt+Shift+U` for ungrouping. These can be changed at `chrome://extensions/shortcuts`.

Chrome tab group labels are text-only. The extension names groups from the domain without the extension, because Chrome does not expose a native tab group favicon or icon field.

## Project Files

- `manifest.json`: Manifest V3 extension metadata.
- `tabs.js`: Shared tab sorting and grouping logic.
- `popup.html`, `popup.css`, `popup.js`: Extension popup.
- `background.js`: Keyboard command handlers.
