# Schephino's Kitchen — Design Guidelines

## Design Approach
**Reference-Based Luxury Hospitality Experience**  
Drawing inspiration from high-end hospitality platforms (Airbnb for browsing flow, Toast POS for restaurant UX, Resy for reservations) combined with iOS native app polish. This is a mobile-first PWA that must feel like a native restaurant ordering app while remaining a website.

## Core Design Principles
- **Luxury & Warmth**: Tactile, inviting experience that reflects fine dining
- **Mobile-Native Feel**: Fullscreen, gesture-driven, 60fps smooth
- **Thumb-Reachable**: Bottom navigation, centered FABs, large tappable zones
- **Accessible Excellence**: WCAG AA with optimized font sizing and contrast

## Color System
**Primary Palette:**
- Deep Navy: `#081427` (primary brand, headers, text)
- Warm Gold: `#D4AF37` (accents, CTAs, highlights, luxury touch)
- Soft Cream: `#F6F2EC` (backgrounds, cards)
- Charcoal: `#1F2937` (secondary text, borders)

**Application:**
- Navy backgrounds for hero sections and header
- Gold for primary CTAs, active states, promotional badges
- Cream for card backgrounds and main content areas
- Use gold sparingly as accent color for maximum impact

## Typography System
**Font Families:**
- **Playfair Display**: All headings (H1-H6), hero titles, section headers
- **Inter**: Body text, UI elements, buttons, forms

**Hierarchy:**
- H1: 2.5rem (mobile) / 4rem (desktop), Playfair Display, navy
- H2: 2rem (mobile) / 3rem (desktop), Playfair Display
- H3: 1.5rem / 2rem, Playfair Display
- Body: 1rem / 1.125rem, Inter, line-height 1.6
- Button Text: 1rem, Inter, medium weight
- Captions: 0.875rem, Inter

## Layout & Spacing System
**Tailwind Spacing Units:**  
Use `4`, `6`, `8`, `12`, `16`, `20`, `24` for consistency

**Mobile-First Padding:**
- Section padding: `py-12` mobile, `py-20` desktop
- Card padding: `p-6` mobile, `p-8` desktop
- Component gaps: `gap-6` or `gap-8`
- Bottom navigation safe-area: `pb-safe` for iOS notch

**Container Strategy:**
- Max width: `max-w-7xl` for content sections
- Reading content: `max-w-3xl` for optimal legibility
- Full-bleed sections for hero and promotional areas

## Component Design

### Navigation
**Header (Sticky):**
- Fixed top position with blur backdrop on scroll
- Navy background with gold accent logo
- Mobile: Hamburger menu with gold active state
- Desktop: Horizontal navigation with gold underline on active

**Bottom Navigation (Mobile Primary):**
- Fixed bottom with safe-area-inset padding
- 4 items: Home, Menu, Orders, Account
- Gold active state with icon fill
- Large tap targets (min 48px height)

### Buttons & CTAs
**Primary CTA:**
- Gold background with navy text
- Large rounded corners (rounded-2xl)
- Generous padding: `px-8 py-4`
- Soft shadow for depth
- Min width 280px on mobile for thumb reach

**Secondary:**
- Navy outline with navy text
- Hover: Navy background with cream text

**FAB (Floating Action Button):**
- Centered bottom on key screens
- Gold background, 64px diameter
- Elevated shadow (shadow-2xl)
- "Order Now" or primary action

### Cards
**Menu Item Cards:**
- Cream background with subtle shadow
- Rounded corners (rounded-xl)
- Featured image full-width at top
- Gold price badge in top-right
- Dietary tags with soft color coding
- Tap area covers entire card

**Feature Cards:**
- Navy or cream backgrounds alternating
- Gold accent border on hover
- Icon + Title + Description layout
- Equal height grid for consistency

### Modals
**Full-Screen on Mobile:**
- Slide up from bottom with spring animation
- Dismiss via swipe-down gesture or close button
- Backdrop blur with 40% opacity
- Desktop: Centered max-width modal

### Forms
**Input Fields:**
- Large touch targets (min 56px height)
- Cream background with navy border
- Gold focus ring (2px)
- Floating labels for space efficiency
- Inline validation with gold checkmarks

**Checkout Stepper:**
- Horizontal progress with gold active state
- Step numbers in gold circles
- Connected line shows progress
- Mobile: Simplified to current/total indicator

### Image Treatment
**Homepage Hero:**
- Full-width, high-quality chef/kitchen photograph
- Parallax scroll effect (subtle, 20% speed)
- Dark gradient overlay (navy to transparent) for text legibility
- Headline and CTA overlaid with blur background on buttons

**Menu Item Images:**
- Square aspect ratio (1:1) for consistency
- Subtle zoom on hover/tap
- Lazy loading with blur-up placeholder
- Gold "Seasonal" or "Featured" badge overlay

**Image Guidelines:**
- Hero: Professional chef in kitchen environment (warm lighting)
- Menu items: High-quality food photography with natural lighting
- About/Team: Authentic restaurant interior shots
- Use WebP format with fallbacks

## Animations & Interactions
**Framer Motion Usage (Minimal):**
- Page transitions: Subtle fade with 0.2s duration
- Modal entry: Spring slide-up from bottom
- Card hover: Scale 1.02 with 0.15s ease
- CTA pulse: Subtle scale animation on promotional items

**Gesture Support:**
- Pull-to-refresh on Menu page (visual indicator)
- Swipe-to-dismiss on modals
- Horizontal swipe on image galleries
- Long-press for additional options (admin)

**Performance Constraints:**
- Max 2 simultaneous animations
- Use `transform` and `opacity` only (GPU accelerated)
- Disable animations on low-power mode
- 60fps target on all interactions

## Page-Specific Layouts

### Homepage
- **Hero**: Fullscreen (90vh) with chef image, headline, CTA
- **Seasonal Promo**: Horizontal scroll carousel with gold frames
- **Features**: 3-column grid (desktop) with icons
- **Reservation CTA**: Full-width gold banner section
- **Footer**: Multi-column (desktop) with contact and social

### Menu Page
- **Category Tabs**: Sticky below header, horizontal scroll on mobile
- **Filters**: Collapsible drawer with price range, dietary tags
- **Search**: Prominent gold-bordered input
- **Grid**: 1 column mobile, 2-3 columns desktop
- **Item Modal**: Full details, add-to-cart, quantity selector

### Cart & Checkout
- **Cart Summary**: Sticky on scroll with item count badge
- **Guest Form**: Multi-step with progress indicator
- **Payment Section**: Stripe element placeholder with gold submit
- **Order Review**: Expandable sections for clarity

### Tracking Page
- **Input**: Large tracking ID field with gold search button
- **Timeline**: Vertical with gold progress line
- **Status Badges**: Color-coded with icons
- **Share Button**: Copy link and social share options

### Admin Dashboard
- **Sidebar**: Navy background with gold active states
- **Orders Table**: Sortable columns, status badges
- **CSV Import**: Drag-and-drop zone with gold border
- **Quick Actions**: FAB menu for common tasks

## PWA Specifications
- **Manifest**: Standalone display mode, navy background
- **Icons**: 192x192 and 512x512 with gold accent
- **Splash Screens**: Navy background with gold logo (iOS sizes)
- **Status Bar**: Navy with light content (iOS meta tag)
- **Theme Color**: Navy (#081427)

## Accessibility Standards
- Color contrast: Minimum 4.5:1 for text
- Focus indicators: 2px gold ring on all interactive elements
- Keyboard navigation: Full support with visible focus
- Screen reader: Semantic HTML with ARIA labels
- Touch targets: Minimum 48x48px on mobile
- Font scaling: Supports up to 200% without breaking layout

This design creates a premium, app-like restaurant ordering experience that feels at home on mobile while maintaining sophistication and accessibility.