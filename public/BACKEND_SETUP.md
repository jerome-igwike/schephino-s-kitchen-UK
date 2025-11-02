# Backend Setup Guide - Schephino's Kitchen

## Overview
This guide covers setting up the production-ready backend for Schephino's Kitchen, including Supabase authentication, PostgreSQL database, Stripe payments, and email notifications.

## Prerequisites
- Node.js 20+
- PostgreSQL database (Supabase recommended)
- Stripe account
- SendGrid account
- Environment variables configured

## 🚀 Quick Start

### 1. Environment Configuration
Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string (from Supabase or Neon)
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_KEY` - Supabase anon key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `SENDGRID_API_KEY` - SendGrid API key

### 2. Database Setup

#### Create Database
If using Supabase:
1. Create a new project at https://supabase.com
2. Copy the connection string from Settings → Database
3. Set `DATABASE_URL` in your `.env` file

#### Run Migrations
```bash
# Push schema to database
npm run db:push

# Or manually run the migration SQL
psql $DATABASE_URL < migrations/001_initial_schema.sql
```

#### Seed Data
```bash
# Load mock menu items
npm run db:seed
```

### 3. Stripe Setup

#### Configure Stripe
1. Create account at https://stripe.com
2. Get API keys from Dashboard → Developers → API keys
3. Set `STRIPE_SECRET_KEY` in `.env`

#### Set up Webhooks
1. Go to Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/stripe/webhook`
3. Select events: `checkout.session.completed`, `payment_intent.payment_failed`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET` in `.env`

#### Test Webhook Locally
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:5000/api/stripe/webhook
```

### 4. Email Setup (SendGrid)

#### Configure SendGrid
1. Create account at https://sendgrid.com
2. Create API key at Settings → API Keys
3. Verify sender identity (email/domain)
4. Set `SENDGRID_API_KEY` and `FROM_EMAIL` in `.env`

### 5. Supabase Authentication

#### Enable Authentication
1. In Supabase Dashboard, go to Authentication → Providers
2. Enable Email provider (or desired providers)
3. Configure email templates in Authentication → Templates

#### Set up Row Level Security (RLS)
The migration file includes RLS policies. Key policies:
- Public read access for menu items
- Admin-only write access for menu items
- Users can view their own orders
- Admins can view/update all orders

#### Create Admin User
```sql
-- In Supabase SQL Editor
-- First, create the user in the Auth dashboard
-- Then add them to admin_users table:

INSERT INTO admin_users (user_id, permissions)
VALUES (
  'user-id-from-auth',
  ARRAY['orders:read', 'orders:update', 'menu:read', 'menu:write']
);
```

## 📦 API Endpoints

### Public Endpoints

#### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get single menu item

#### Orders
- `POST /api/orders` - Create order (guest checkout)
- `GET /api/orders/track/:trackingId` - Track order by tracking ID

#### Stripe
- `POST /api/stripe/create-checkout-session` - Create Stripe checkout
- `POST /api/stripe/webhook` - Stripe webhook handler

### Admin Endpoints (require authentication)

#### Menu Management
- `POST /api/admin/menu` - Create menu item
- `PATCH /api/admin/menu/:id` - Update menu item
- `DELETE /api/admin/menu/:id` - Delete menu item
- `GET /api/admin/menu/export` - Export menu as CSV
- `POST /api/admin/import/menu` - Import menu from CSV

#### Order Management
- `GET /api/admin/orders` - Get all orders
- `PATCH /api/admin/orders/:id` - Update order status
- `GET /api/admin/orders/export` - Export orders as CSV
- `GET /api/admin/orders/:id/payment-intent` - Get payment intent for refund
- `POST /api/admin/dispatch` - Mark order as dispatched to UBA Eats
- `DELETE /api/admin/orders/:id/anonymize` - Anonymize order (GDPR)

## 🔐 Authentication Flow

### Admin Authentication
1. Client sends request with `Authorization: Bearer <token>` header
2. Middleware validates token with Supabase
3. Check if user has admin role
4. Allow/deny access

### Guest Checkout
No authentication required for:
- Browsing menu
- Creating orders
- Tracking orders

## 🎯 Key Features

### 1. Tracking ID Generation
- Format: `SK-YYYYMMDD-NNNN`
- Sequential, date-based tracking IDs
- Thread-safe using database sequence
- Example: `SK-20251031-0001`

### 2. Payment Flow
1. User adds items to cart
2. Proceeds to checkout
3. Backend creates order with tracking ID
4. Frontend redirects to Stripe Checkout
5. User completes payment
6. Stripe webhook updates order status to "paid"
7. Confirmation email sent automatically

### 3. Email Notifications
- Order confirmation on successful payment
- Branded email template with order details
- Includes tracking ID for customer reference
- Fallback to console if SendGrid not configured

### 4. Admin Dispatch Workflow
1. Admin views order in dashboard
2. Calls `/api/admin/dispatch` with UBA Eats reference
3. Order status updated to "handed_off"
4. Dispatch audit log created
5. Notification template generated for copy/paste

### 5. CSV Import/Export
**Import:**
- Upload CSV with menu items
- Validates each row
- Upserts (creates or updates) items
- Returns success/error report

**Export:**
- Menu items: All menu data as CSV
- Orders: Full order history as CSV

### 6. GDPR Compliance
- Anonymization endpoint for customer data
- Minimal data storage
- Audit logs for dispatch actions

## 🧪 Testing

### Unit Tests
```bash
npm run test:unit
```

Tests included:
- Tracking ID generator (format, sequencing)
- Email template generation
- Payment flow validation

### E2E Tests
```bash
npm run test:e2e
```

Should cover:
- Guest checkout flow
- Order tracking
- Admin order management
- Payment integration (with Stripe test mode)

## 🚀 Deployment

### Vercel Deployment
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Environment Variables in Vercel
Go to Project Settings → Environment Variables and add:
- All variables from `.env.example`
- Set `NODE_ENV=production`

### Webhook Configuration
After deployment, update Stripe webhook endpoint:
- URL: `https://your-vercel-domain.vercel.app/api/stripe/webhook`
- Add same events as before

### Database Connection
Ensure `DATABASE_URL` uses SSL for production:
```
postgresql://user:pass@host:5432/db?sslmode=require
```

## 📊 Database Schema

### Tables
- `users` - Customer and admin users
- `admin_users` - Admin permissions
- `menu_items` - Restaurant menu
- `orders` - Customer orders
- `order_items` - Normalized order items
- `payment_info` - Payment details
- `addresses` - Saved customer addresses
- `dispatch_audit` - Admin dispatch log
- `tracking_sequence` - Tracking ID generation

### Key Relationships
- `orders` → `order_items` (one-to-many)
- `orders` → `payment_info` (one-to-one)
- `users` → `admin_users` (one-to-one)
- `users` → `addresses` (one-to-many)

## 🔧 Troubleshooting

### Database Connection Issues
```bash
# Test connection
psql $DATABASE_URL -c "SELECT version();"

# Check schema
psql $DATABASE_URL -c "\dt"
```

### Stripe Webhook Not Working
- Verify webhook secret matches
- Check webhook endpoint is publicly accessible
- Review Stripe dashboard logs
- Use Stripe CLI for local testing

### Email Not Sending
- Verify SendGrid API key is correct
- Check sender email is verified in SendGrid
- Review SendGrid activity logs
- Check console for error messages

### Tracking ID Duplicates
- Ensure database sequence table exists
- Check for concurrent transaction issues
- Verify migration ran successfully

## 📝 Migration Checklist

When migrating from in-memory to database:

- [ ] Set `DATABASE_URL` environment variable
- [ ] Run database migration: `npm run db:push`
- [ ] Seed menu data: `npm run db:seed`
- [ ] Create admin user in Supabase Auth
- [ ] Add admin to `admin_users` table
- [ ] Configure RLS policies
- [ ] Test order creation flow
- [ ] Test tracking ID generation
- [ ] Verify email notifications
- [ ] Set up Stripe webhooks
- [ ] Test payment flow end-to-end

## 🎓 Development vs Production

### Development Mode
- In-memory storage (no database required)
- Console logging for emails
- Auth bypass for admin endpoints
- Stripe test mode

### Production Mode
- PostgreSQL database required
- SendGrid for emails
- Supabase authentication
- Stripe live mode
- HTTPS required for webhooks

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [SendGrid API Docs](https://docs.sendgrid.com)
- [Drizzle ORM Guide](https://orm.drizzle.team/docs/overview)

## 🆘 Support

For issues or questions:
1. Check logs: `npm run dev` (console output)
2. Review Stripe dashboard for payment issues
3. Check Supabase logs for database errors
4. Verify environment variables are set correctly

---

**Built with Production-Ready Backend** 🚀
