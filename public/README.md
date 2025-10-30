# Schephino's Kitchen - Luxury Fine Dining PWA

A mobile-first Progressive Web App for luxury restaurant ordering with an exceptional user experience inspired by Airbnb, Toast POS, and Resy.

## 🌟 Features

### Customer Features
- **Browse Menu** - Explore seasonal dishes with advanced filters (category, price, dietary)
- **Real-time Search** - Instant search across menu items
- **Shopping Cart** - Persistent cart with localStorage
- **Guest Checkout** - Quick multi-step checkout form
- **Order Tracking** - Real-time order status with tracking IDs
- **Order History** - View past orders (when authenticated)
- **PWA Support** - Install as native app on iOS/Android

### Admin Features
- **Order Management** - View and update order statuses
- **Menu CRUD** - Create, read, update, delete menu items
- **CSV Import/Export** - Bulk menu management (UI ready, backend TODO)
- **Dashboard Analytics** - Quick stats on orders

## 🎨 Design System

### Brand Colors
- **Deep Navy**: `#081427` (HSL: 217 83% 8%) - Headers, navigation
- **Warm Gold**: `#D4AF37` (HSL: 45 75% 52%) - CTAs, highlights, luxury accents
- **Soft Cream**: `#F6F2EC` (HSL: 30 25% 96%) - Main background

### Typography
- **Headings**: Playfair Display (Serif) - Elegant, fine dining heritage
- **Body**: Inter (Sans-serif) - Modern, clean, professional

### Key UX Patterns
- **60fps Animations** - GPU-accelerated transforms only
- **Bottom Navigation** - Thumb-reachable on mobile
- **Swipe Gestures** - Modal dismissal, carousel navigation
- **iOS Safe Areas** - Full support for notch and home indicator
- **Sticky Header** - With backdrop blur on scroll

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm 10+

### Installation

```bash
# Install dependencies (automatic via Replit)
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5000`

### Environment Variables

```env
# Session secret (auto-generated on Replit)
SESSION_SECRET=your-secret-key

# TODO: Stripe integration
NEXT_PUBLIC_STRIPE_PK=pk_test_...

# TODO: Supabase authentication
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── layout/   # Header, BottomNav
│   │   │   └── ui/       # shadcn components, MenuItemCard, MenuItemModal
│   │   ├── pages/        # Page components (Home, Menu, Cart, etc.)
│   │   ├── lib/          # Utilities, CartContext, QueryClient
│   │   └── index.css     # Tailwind + custom styles
│   └── index.html        # PWA meta tags, fonts
├── server/               # Express backend
│   ├── routes.ts        # API endpoints
│   ├── storage.ts       # In-memory storage (IStorage interface)
│   └── index.ts         # Server setup
├── shared/              # Shared types and schemas
│   └── schema.ts        # Drizzle schemas, Zod validation
├── data/                # Mock data
│   └── mock-menu.json   # Sample menu items
├── public/              # Static assets
│   ├── manifest.json    # PWA manifest
│   └── service-worker.js # Service worker (basic)
└── attached_assets/     # Generated images
    └── generated_images/ # AI-generated food photography
```

## 🛠 Technology Stack

### Frontend
- **React 18** - UI library
- **Wouter** - Lightweight routing
- **TanStack Query v5** - Server state management
- **Framer Motion** - Animations
- **Shadcn UI** - Component library
- **Tailwind CSS** - Styling
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Express** - Web framework
- **TypeScript** - Type safety
- **Drizzle ORM** - Database schema (ready for PostgreSQL)
- **Zod** - Runtime validation
- **In-Memory Storage** - Development (production ready for DB migration)

### Build Tools
- **Vite** - Fast build tool
- **TSX** - TypeScript execution
- **PostCSS** - CSS processing

## 📱 PWA Configuration

### Manifest
- **Display Mode**: Standalone (fullscreen app experience)
- **Theme Color**: Deep Navy (#081427)
- **Icons**: 192x192 and 512x512
- **Orientation**: Portrait

### Service Worker
Basic offline support for essential pages:
- Homepage (/)
- Menu (/menu)
- Track Order (/track)
- Account (/account)

**TODO**: Implement Workbox for advanced caching strategies

## 🔌 API Endpoints

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get single menu item
- `POST /api/admin/menu` - Create menu item (admin)
- `POST /api/admin/menu/bulk` - Bulk create from CSV (admin)
- `PATCH /api/admin/menu/:id` - Update menu item (admin)
- `DELETE /api/admin/menu/:id` - Delete menu item (admin)
- `GET /api/admin/menu/export` - Export menu as CSV (admin)

### Orders
- `POST /api/orders` - Create order (guest checkout)
- `GET /api/orders` - Get all orders
- `GET /api/orders/track/:trackingId` - Track order by ID
- `GET /api/admin/orders` - Get all orders (admin)
- `PATCH /api/admin/orders/:id` - Update order status (admin)

### Authentication (Stubs)
- `GET /api/auth/user` - Get current user (TODO: Supabase)
- `POST /api/auth/register` - Register user (TODO: Supabase)

## 🧪 Testing

### Manual Testing Checklist

#### Mobile UX
- [ ] Bottom navigation thumb-reachable
- [ ] All buttons minimum 44px touch targets
- [ ] Swipe-to-dismiss works on modals
- [ ] Pull-to-refresh works on menu page (TODO)
- [ ] iOS safe areas respected (notch, home indicator)
- [ ] Animations run at 60fps on mid-range devices

#### User Flows
- [ ] Browse menu → Add to cart → Checkout → Confirmation
- [ ] Search menu items by name/description
- [ ] Filter by category, price range, dietary tags
- [ ] Track order with generated tracking ID
- [ ] View order history (after auth)

#### Admin Flows
- [ ] Login with demo password (`admin`)
- [ ] View all orders in dashboard
- [ ] Update order status
- [ ] Export menu as CSV
- [ ] Import menu from CSV (UI ready, backend TODO)

#### Accessibility
- [ ] Keyboard navigation works throughout
- [ ] Focus indicators visible (gold ring)
- [ ] Screen reader announces all interactive elements
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Images have descriptive alt text

#### PWA
- [ ] Can be installed on iOS/Android
- [ ] Works offline for cached pages
- [ ] Manifest loads correctly
- [ ] Icons display in app switcher
- [ ] Status bar styled correctly

## 🎯 Future Enhancements

### Phase 2: Authentication & Payments
- [ ] Supabase Magic Link authentication
- [ ] Stripe payment integration
- [ ] User profiles and preferences
- [ ] Saved addresses for faster checkout
- [ ] Order history with auth filtering

### Phase 3: Advanced Features
- [ ] Real-time order updates (WebSockets)
- [ ] Push notifications for order status
- [ ] Favorites/Saved items
- [ ] Ratings and reviews
- [ ] Loyalty program integration
- [ ] Table reservations
- [ ] Multiple delivery addresses

### Phase 4: Admin Enhancements
- [ ] CSV import with validation
- [ ] Bulk order operations
- [ ] Revenue analytics dashboard
- [ ] Customer insights
- [ ] Menu scheduling (seasonal)
- [ ] Inventory management

### Phase 5: Performance & SEO
- [ ] Workbox service worker with advanced caching
- [ ] Image optimization (WebP with fallbacks)
- [ ] Code splitting per route
- [ ] Server-side rendering for SEO
- [ ] Structured data for rich snippets

## 📊 Database Migration Plan

Currently using in-memory storage. To migrate to PostgreSQL:

1. **Update Environment**:
   ```bash
   # Replit provides DATABASE_URL automatically
   ```

2. **Run Migrations**:
   ```bash
   npm run db:push  # Push schema to database
   ```

3. **Update Storage**:
   - Replace `MemStorage` with `DbStorage` in `server/storage.ts`
   - Implement IStorage interface using Drizzle queries

4. **Seed Data**:
   ```bash
   npm run db:seed  # Load mock-menu.json
   ```

## 🎨 Design Guidelines

Comprehensive design documentation available in `design_guidelines.md`:
- Brand identity and color usage
- Typography system and hierarchy
- Component specifications
- Animation and interaction patterns
- Accessibility standards
- PWA requirements

## 👨‍💻 Development

### Adding a New Page

1. Create component in `client/src/pages/`
2. Register route in `client/src/App.tsx`
3. Add navigation link in Header/BottomNav
4. Update PWA service worker if cacheable

### Adding a New API Endpoint

1. Define schema in `shared/schema.ts` (if needed)
2. Add storage methods in `server/storage.ts` (IStorage interface)
3. Implement route handler in `server/routes.ts`
4. Use in frontend with TanStack Query

### Styling Guidelines

- **DO**: Use shadcn components (Button, Card, Badge)
- **DO**: Use `hover-elevate` and `active-elevate-2` for interactions
- **DON'T**: Manually specify hover:bg-* on buttons
- **DON'T**: Create custom card components (use shadcn Card)
- **DO**: Follow spacing system (4, 6, 8, 12, 16, 24)
- **DO**: Ensure minimum 44px touch targets on mobile

## 📄 License

Proprietary - Schephino's Kitchen © 2024

## 🙏 Credits

- **Design Inspiration**: Airbnb, Toast POS, Resy
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Playfair Display, Inter)
- **AI Images**: Generated for demo purposes

---

**Built with ❤️ for exceptional dining experiences**
