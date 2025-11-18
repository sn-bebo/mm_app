# 🚀 Deployment Guide - Travel Companion App

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the recommended platform as it's created by the Next.js team and offers the best integration.

#### Steps:

1. **Push to GitHub**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   \`\`\`

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Configure:
     - Framework Preset: Next.js
     - Build Command: `npm run build`
     - Output Directory: `.next`
   - Click "Deploy"

3. **Environment Variables** (if needed)
   - Add any required environment variables in Vercel dashboard
   - No special env vars needed for this app

4. **Custom Domain** (optional)
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

#### Vercel Benefits:
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic builds on git push
- ✅ Preview deployments for PRs
- ✅ Edge functions support
- ✅ Zero configuration needed

### Option 2: Netlify

1. **Push to GitHub** (same as above)

2. **Deploy to Netlify**
   - Visit [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select your repository
   - Configure:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Click "Deploy"

3. **Add netlify.toml** (optional)
   \`\`\`toml
   [build]
     command = "npm run build"
     publish = ".next"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   \`\`\`

### Option 3: Self-Hosted (VPS/Cloud)

#### Requirements:
- Node.js 18+
- PM2 (process manager)
- Nginx (reverse proxy)

#### Steps:

1. **Server Setup**
   \`\`\`bash
   # Install Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   \`\`\`

2. **Deploy Application**
   \`\`\`bash
   # Clone repository
   git clone <your-repo-url>
   cd MM_App
   
   # Install dependencies
   npm install
   
   # Build application
   npm run build
   
   # Start with PM2
   pm2 start npm --name "travel-app" -- start
   pm2 save
   pm2 startup
   \`\`\`

3. **Nginx Configuration**
   \`\`\`nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   \`\`\`

4. **SSL with Let's Encrypt**
   \`\`\`bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   \`\`\`

### Option 4: Docker Deployment

1. **Create Dockerfile**
   \`\`\`dockerfile
   FROM node:18-alpine AS deps
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build
   
   FROM node:18-alpine AS runner
   WORKDIR /app
   ENV NODE_ENV production
   
   COPY --from=builder /app/public ./public
   COPY --from=builder /app/.next/standalone ./
   COPY --from=builder /app/.next/static ./.next/static
   
   EXPOSE 3000
   ENV PORT 3000
   
   CMD ["node", "server.js"]
   \`\`\`

2. **Build and Run**
   \`\`\`bash
   docker build -t travel-app .
   docker run -p 3000:3000 travel-app
   \`\`\`

## PWA Testing

### Testing PWA Features

1. **Build for Production**
   \`\`\`bash
   npm run build
   npm start
   \`\`\`
   PWA features are disabled in development mode.

2. **Test Install Prompt**
   - Open in Chrome/Edge on desktop or mobile
   - Look for install icon in address bar
   - Or wait for the bottom banner prompt

3. **Test Offline Mode**
   - Install the app
   - Turn off internet connection
   - App should still work with cached data

4. **Test Service Worker Updates**
   - Make a code change
   - Build and deploy
   - App should show update notification
   - Click to reload and get new version

### Mobile Testing

#### Android (Chrome)
1. Open app URL in Chrome
2. Tap menu (⋮) → "Install app"
3. Confirm installation
4. App appears on home screen
5. Opens in fullscreen (standalone mode)

#### iOS (Safari)
1. Open app URL in Safari
2. Tap Share button (square with arrow)
3. Scroll and tap "Add to Home Screen"
4. Confirm and name the app
5. App appears on home screen

## Performance Optimization

### Before Deployment

1. **Optimize Images**
   - Use WebP format where possible
   - Use Next.js Image component
   - Set proper sizes and quality

2. **Code Splitting**
   - Already implemented with Next.js automatic code splitting
   - Dynamic imports for heavy components

3. **Bundle Analysis**
   \`\`\`bash
   npm install -D @next/bundle-analyzer
   \`\`\`
   
   Add to next.config.js:
   \`\`\`javascript
   const withBundleAnalyzer = require('@next/bundle-analyzer')({
     enabled: process.env.ANALYZE === 'true',
   })
   
   module.exports = withBundleAnalyzer(withPWA(nextConfig))
   \`\`\`
   
   Run: \`ANALYZE=true npm run build\`

4. **Lighthouse Audit**
   - Run in Chrome DevTools
   - Aim for 90+ scores in all categories
   - Fix any flagged issues

## Post-Deployment Checklist

- [ ] PWA installs correctly on mobile
- [ ] Offline mode works
- [ ] Service worker updates automatically
- [ ] Dark mode persists across sessions
- [ ] All CRUD operations work
- [ ] Drag and drop functions
- [ ] Excel data imports correctly
- [ ] Lighthouse scores > 90
- [ ] Tested on iOS Safari
- [ ] Tested on Android Chrome
- [ ] Custom domain configured (if applicable)
- [ ] Analytics setup (if needed)

## Monitoring & Analytics

### Optional Additions

1. **Vercel Analytics**
   \`\`\`bash
   npm install @vercel/analytics
   \`\`\`
   
   Add to layout.tsx:
   \`\`\`tsx
   import { Analytics } from '@vercel/analytics/react'
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     )
   }
   \`\`\`

2. **Google Analytics**
   - Create GA4 property
   - Add tracking ID to app
   - Track page views and custom events

## Troubleshooting

### Common Issues

**Service Worker Not Updating**
- Clear browser cache
- Unregister old service worker in DevTools
- Do a hard refresh (Cmd+Shift+R / Ctrl+Shift+F5)

**PWA Not Installable**
- Ensure HTTPS is enabled
- Check manifest.json is accessible
- Verify icons load correctly
- Check service worker is registered

**Offline Mode Not Working**
- Must build for production
- Service workers don't work in dev mode
- Check Network tab for caching strategies

**Performance Issues**
- Enable gzip compression in server
- Use CDN for static assets
- Optimize database queries
- Implement pagination for large datasets

## Backup & Recovery

### Backup Strategy

1. **Code Backup**
   - Use git for version control
   - Push to GitHub/GitLab regularly
   - Tag releases

2. **Data Backup**
   - User data is in browser IndexedDB
   - Consider implementing export feature
   - Allow users to download their data

3. **Server Backup**
   - Automated daily backups
   - Store Excel file separately
   - Keep multiple restore points

## Updating the App

### Rolling Out Updates

1. Make changes in development
2. Test locally
3. Commit to git
4. Push to repository
5. Vercel/Netlify auto-deploys
6. Service worker prompts users to update
7. Users click "Update" to get new version

### Breaking Changes

If database schema changes:
1. Increment version in lib/db.ts
2. Add migration logic
3. Test upgrade path
4. Document changes in CHANGELOG

## Support

For deployment issues:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Netlify: [docs.netlify.com](https://docs.netlify.com)
- Next.js: [nextjs.org/docs](https://nextjs.org/docs)
