# Form Auto-Filler Chrome Extension

A Chrome extension that automatically fills forms on web pages with your saved details.

## Your Pre-configured Details

- **Name:** adam robin
- **Address:** 3050 W yorkshire dr
- **City:** Phoenix
- **State:** AZ
- **ZIP:** 85085
- **Phone:** 6258529632

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the folder containing these extension files
5. The extension icon should appear in your toolbar

## Usage

1. Click the extension icon in your toolbar
2. Click "Fill Form on Current Page" to manually fill forms
3. Toggle "Auto-fill" ON to automatically fill forms when pages load

## How It Works

The extension tries to match your saved field names with form fields on the page by:
- Exact ID match
- Exact name attribute match
- Partial match with placeholder, name, id, or label text (case-insensitive)

## Notes

- Data is stored in Chrome's sync storage (syncs across devices if signed in)
- The extension works on all websites
- Make sure form fields have identifiable names, IDs, or placeholders for best results

