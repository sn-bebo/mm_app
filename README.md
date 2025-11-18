# 🌍 Travel Companion App

A modern Progressive Web App (PWA) for managing your travel destinations, shopping spots, and food experiences. Built with Next.js, TypeScript, and IndexedDB for offline-first functionality.

## ✨ Features

### Core Functionality
- **City-based Organization**: Group travel items by city
- **Three Categories**: Places to Visit 🏛️, Shopping 🛍️, and Food Spots 🍽️
- **Status Tracking**: Mark items as visited/purchased/tasted
- **Star Ratings**: Rate experiences from 1-5 stars
- **Priority Levels**: Must-visit ⭐ or Optional 💡
- **Personal Notes**: Add private notes to each item (auto-saves)
- **Subcategories**: Flexible subcategory system for all categories

### Advanced Features
- **Smart Search**: Global search across all categories within a city
- **Filtering**: Filter by priority, status, or search query
- **Sorting**: Sort by name, rating, priority, or manual order
- **Drag & Drop**: Manually reorder items with touch support
- **Progress Tracking**: Visual progress bars for each city
- **Offline Support**: Full offline functionality with IndexedDB
- **Dark Mode**: System-aware theme toggle with persistence

### Admin Panel
- **Add Items**: Create new places/shops/restaurants
- **Edit Items**: Update all fields including map links
- **Create Cities**: Add new cities on the fly
- **Search & Edit**: Find and modify existing entries
- **Excel Import**: Bulk import from MM_data.xlsx

### PWA Features
- **Installable**: Add to home screen on mobile devices
- **Offline Caching**: Works without internet connection
- **Service Workers**: Background sync and updates
- **Update Notifications**: Automatic service worker update prompts

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd MM_App
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Place your data file:
- Copy your Excel file to \`/data/MM_data.xlsx\`
- The file should have columns: City, Category, Name, Details, Location

4. Run development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000)

### Production Build

\`\`\`bash
npm run build
npm start
\`\`\`

## 📱 Using the App

### First Time Setup
1. The app automatically loads data from \`/data/MM_data.xlsx\`
2. Data is stored in your browser's IndexedDB
3. Works offline after first load

### Managing Items
- **Toggle Status**: Click the circle button (○ → ✓)
- **Change Priority**: Click priority badge to cycle through options
- **Rate Item**: Click stars to rate (1-5)
- **Add Notes**: Click "▼ Notes" to expand and add personal notes
- **View Map**: Click "📍 Open Map" to view location

### Filtering & Sorting
1. Click the 🔍 button (bottom-right)
2. Use search, filters, and sorting options
3. Active filters show count badge
4. Click "Clear All" to reset

### Manual Reordering
1. Set sort to "Manual Order"
2. Touch and drag items to reorder
3. Order is saved automatically

### Admin Panel
1. Click ⚙️ in header to access admin mode
2. **Add Tab**: Create new items or cities
3. **Search Tab**: Find and edit existing items
4. All changes save to IndexedDB

## 🗂️ Data Format

Excel file should have these columns:
- **City**: City name (e.g., "Dubai", "Istanbul")
- **Category**: places | shopping | food
- **Name**: Item name
- **Details**: Description (optional)
- **Location**: Google Maps URL (optional)

Example:
| City | Category | Name | Details | Location |
|------|----------|------|---------|----------|
| Dubai | places | Burj Khalifa | Tallest building | https://maps.google.com/... |
| Dubai | shopping | Gold Souk | Traditional market | https://maps.google.com/... |

## 🎨 Theme Customization

The app supports light and dark modes:
- Click the 🌙/☀️ icon in header to toggle
- Preference saved to localStorage
- Respects system dark mode preference

## 📦 Tech Stack

- **Framework**: Next.js 14.2.33 (App Router)
- **Language**: TypeScript
- **Database**: Dexie.js (IndexedDB wrapper)
- **State**: Zustand
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Drag & Drop**: @dnd-kit
- **Excel**: xlsx (SheetJS)
- **PWA**: next-pwa + Workbox

## 🔧 Development

### File Structure
\`\`\`
MM_App/
├── app/
│   ├── page.tsx              # Home (city list)
│   ├── city/[city]/page.tsx  # City detail view
│   ├── admin/page.tsx        # Admin panel
│   ├── layout.tsx            # Root layout
│   ├── manifest.ts           # PWA manifest
│   └── globals.css           # Global styles
├── components/
│   ├── Header.tsx            # Header with theme toggle
│   ├── ItemCard.tsx          # Item display card
│   ├── FilterSortPanel.tsx   # Filter/sort panel
│   ├── DraggableItem.tsx     # Drag wrapper
│   ├── LoadingSkeleton.tsx   # Loading states
│   └── ...
├── lib/
│   ├── db.ts                 # Dexie database
│   └── excel-parser.ts       # Excel import logic
├── hooks/
│   ├── useItems.ts           # Data hooks
│   └── useTheme.ts           # Theme management
├── stores/
│   └── appStore.ts           # Zustand store
├── types/
│   └── index.ts              # TypeScript types
├── data/
│   └── MM_data.xlsx          # Source data
└── public/
    └── data/MM_data.xlsx     # Public copy
\`\`\`

### Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm start\` - Start production server
- \`npm run lint\` - Run ESLint

## 📱 Mobile Installation

### iOS
1. Open app in Safari
2. Tap Share button
3. Tap "Add to Home Screen"
4. Confirm installation

### Android
1. Open app in Chrome
2. Tap menu (⋮)
3. Tap "Install app" or "Add to Home screen"
4. Confirm installation

## 🐛 Troubleshooting

### Data not loading
- Check \`/data/MM_data.xlsx\` exists
- Verify Excel file format matches specification
- Open browser console for errors

### Offline not working
- Build for production (PWA disabled in dev)
- Service workers only work on HTTPS or localhost

### Dark mode not persisting
- Check browser localStorage is enabled
- Clear site data and refresh

## 📝 License

Private project - All rights reserved

## 🤝 Contributing

This is a private project. For issues or suggestions, contact the maintainer.

## 📞 Support

For questions or issues, please contact [your-email@example.com]
