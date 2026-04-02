# Wealthwolffs Global Hedged Solutions - PRD

## Original Problem Statement
Build a premium multi-page financial services website inspired by faralloncapital.com, greenhedgecapital.com, elliottmgmt.com, sorosfundmgmt.com, and twosigma.com. Features include scroll-down design, services dropdown, products, admin panel, Google OAuth, hidden pages, and contact form.

## Architecture
- **Frontend**: React 19 + Tailwind CSS + Shadcn UI
- **Backend**: FastAPI + MongoDB (Motor async)
- **Auth**: Emergent Google OAuth (session-based)
- **Database**: MongoDB (test_database)

## User Personas
1. **Visitors** - Browse services, solutions, media, submit enquiries
2. **Registered Users** - Login via Google OAuth, access profile
3. **Admin** - Manage users, enquiries, news, testimonials, hidden pages

## Core Requirements
- Landing page (Two Sigma inspired with "Financial Science" code-style text)
- Scroll-down main site with section anchors
- Header with dropdowns (About Us, Products)
- 9 financial solutions in scrollable carousel
- Products: WolffsInstaAlerts, WolffsInstaTrade
- Wolffs Academy (Coming Soon)
- Contact form with enquiry submission
- Google OAuth login/signup
- Admin panel (users, enquiries, news, testimonials, hidden pages)
- Footer with social media links

## What's Been Implemented (April 2, 2026)
- [x] Landing page with animated Science text scramble effect
- [x] Main site with all sections (About, Why, Founder, Careers, Media, Testimonials, Solutions, Partners, Contact)
- [x] Glassmorphism sticky header with dropdown navigation
- [x] Solutions horizontal carousel (9 services)
- [x] Products pages (WolffsInstaAlerts, WolffsInstaTrade)
- [x] Academy Coming Soon page
- [x] Contact form (POST /api/enquiries)
- [x] Google OAuth (Emergent Auth integration)
- [x] Admin dashboard (stats, users, enquiries, news, testimonials, hidden pages)
- [x] Hidden pages (UUID-based, admin creates, anyone with link views)
- [x] Footer with social media links
- [x] Seed data (admin user, sample testimonials, sample news)
- [x] Design: White bg, Blue #003B5C, Light Brown #C4A47C, IBM Plex fonts

## Prioritized Backlog
### P0 (Done)
- All core features implemented and tested

### P1
- KYC verification integration (3rd party API - user to specify provider)
- Custom domain mapping (wealthwolffs.com)
- Detailed founder profile with photo
- Social media actual URLs

### P2
- Blog/article CMS with rich text editor
- SEO optimization (meta tags, sitemap, structured data)
- Analytics integration
- Email notifications for new enquiries
- WolffsInstaAlerts & WolffsInstaTrade actual app links

## Next Tasks
1. User to provide specific content for each section (founder bio, partner logos, etc.)
2. KYC integration once provider is chosen
3. Connect actual social media URLs
4. Connect product CTA buttons to actual WolffsInstaAlerts/WolffsInstaTrade apps
