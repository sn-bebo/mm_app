# ⚡ Quick Testing Guide

## Testing Dark Mode

1. **Open the app**: http://localhost:3000
2. **Click the moon icon** (🌙) in the header
3. **Verify**:
   - All colors switch to dark theme
   - Text remains readable
   - Buttons have proper contrast
   - Cards have dark backgrounds
4. **Refresh the page** - theme should persist
5. **Click sun icon** (☀️) to switch back

## Testing Core Features

### 1. Browse Cities
- Home page shows all cities with progress bars
- Click any city card to view items
- Category tabs (Places, Shopping, Food) show counts

### 2. Manage Items
- **Mark Complete**: Click the circle button (○ → ✓)
- **Rate**: Click stars (1-5)
- **Priority**: Click badge to cycle (Must ⭐ → Optional 💡 → None)
- **Notes**: Click "▼ Notes" → type → auto-saves in 1 second
- **Map**: Click "📍 Open Map" (only if location set)

### 3. Filter & Sort
- Click 🔍 button (bottom-right)
- **Search**: Type in search box
- **Sort by**: Name, Rating, Priority, or Manual
- **Filter by Priority**: All, Must, Optional
- **Filter by Status**: All, Pending, Completed
- Badge shows active filter count
- Click "Clear All" to reset

### 4. Drag & Drop
1. Open filter panel
2. Set sort to "Manual Order"
3. Touch/click and drag items to reorder
4. Works on mobile with touch
5. Order persists after refresh

### 5. Admin Panel
- Click ⚙️ in header
- **Add New Item**:
  - Select city (or create new)
  - Select category
  - Enter name, details, location
  - Set priority
  - Click "Add Item"
- **Edit Existing**:
  - Use search to find item
  - Click item in results
  - Modify fields
  - Click "Update Item"

## Testing Offline Mode

**Note**: PWA features only work in production build!

### Development Test (Limited)
\`\`\`bash
npm run dev
# Open http://localhost:3000
# Data loads from Excel → IndexedDB
# Close Excel file or disconnect - app still works
\`\`\`

### Production Test (Full PWA)
\`\`\`bash
npm run build
npm start
# Open http://localhost:3000
\`\`\`

1. **Install the App**:
   - Look for install icon in browser address bar
   - Or wait for install prompt banner
   - Click "Install"
   - App opens in standalone window

2. **Test Offline**:
   - Disconnect internet/wifi
   - App still loads and works
   - All CRUD operations function
   - Data persists in IndexedDB

3. **Test Updates**:
   - Make a code change
   - Build and restart: \`npm run build && npm start\`
   - Open installed app
   - Should see "Update Available" notification
   - Click "Update" to reload with new version

## Mobile Testing

### Android
1. Open Chrome on Android
2. Visit deployed URL (needs HTTPS)
3. Tap menu → "Install app"
4. App appears on home screen
5. Opens in fullscreen mode

### iOS
1. Open Safari on iPhone/iPad
2. Visit deployed URL
3. Tap Share → "Add to Home Screen"
4. App appears on home screen
5. Opens without Safari UI

## Performance Testing

### Lighthouse Audit
1. Open Chrome DevTools (F12)
2. Click "Lighthouse" tab
3. Select all categories
4. Click "Analyze page load"
5. **Target Scores**:
   - Performance: 90+
   - Accessibility: 95+
   - Best Practices: 95+
   - SEO: 90+
   - PWA: ✓ All checks passed

### Network Testing
1. DevTools → Network tab
2. Throttle to "Slow 3G"
3. Reload page
4. Should load under 5 seconds
5. Verify loading skeletons appear

## Data Testing

### Import from Excel
1. Place \`MM_data.xlsx\` in \`/data/\` folder
2. Ensure format:
   - Column A: City
   - Column B: Category (places/shopping/food)
   - Column C: Name
   - Column D: Details
   - Column E: Location (Google Maps URL)
3. Restart app
4. Data should import automatically
5. Check IndexedDB in DevTools → Application → IndexedDB

### Admin Operations
- ✅ Add new item
- ✅ Edit existing item
- ✅ Create new city
- ✅ Add subcategories
- ✅ Set map links
- ✅ All changes persist after refresh

## Browser Compatibility

### Desktop
- ✅ Chrome 90+ (recommended)
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Mobile
- ✅ Chrome Android 90+
- ✅ Safari iOS 14+
- ✅ Samsung Internet 14+
- ✅ Firefox Android 88+

## Common Test Scenarios

### Happy Path
1. Open app → see cities
2. Click city → see items
3. Toggle item status → saves
4. Add rating → persists
5. Write notes → auto-saves
6. Filter items → updates view
7. Drag to reorder → maintains order
8. Switch theme → preference saved

### Edge Cases
- Empty city (no items)
- Very long item names
- No location URL
- Subcategory with special characters
- 100+ items in one category
- Search with special characters
- Rapid filter changes

### Error Handling
- Excel file missing → error message
- Corrupt Excel → parsing error
- IndexedDB blocked → fallback message
- Network offline → offline indicator

## Quick Smoke Test (5 minutes)

1. ✅ App loads without errors
2. ✅ Dark mode toggles correctly
3. ✅ Can navigate between cities
4. ✅ Can mark item complete
5. ✅ Can add rating
6. ✅ Notes auto-save works
7. ✅ Filter panel opens
8. ✅ Search returns results
9. ✅ Admin panel accessible
10. ✅ Can add new item
11. ✅ Theme persists on refresh
12. ✅ No console errors

## Reporting Issues

If you find bugs:
1. Check browser console for errors (F12)
2. Note steps to reproduce
3. Include browser/device info
4. Screenshot if UI issue
5. Check if happens in incognito mode

## Next Steps After Testing

Once all tests pass:
1. ✅ Run production build
2. ✅ Test PWA install flow
3. ✅ Run Lighthouse audit
4. ✅ Deploy to Vercel/Netlify
5. ✅ Test on real mobile devices
6. ✅ Share with users for feedback

---

**Happy Testing! 🎉**

For issues or questions, refer to README.md and DEPLOYMENT.md
