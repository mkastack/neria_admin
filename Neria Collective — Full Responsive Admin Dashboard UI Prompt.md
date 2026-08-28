# NERIA COLLECTIVE — COMPLETE ADMIN DASHBOARD UI

Design and build the complete **responsive frontend UI** for the **Neria Collective Admin Dashboard**.

This is the internal management system for the Neria Collective fashion e-commerce brand.

The admin dashboard must feel:

- Premium
- Feminine
- Modern
- Clean
- Professional
- Fast
- Organized
- Soft
- Visually rich
- Easy to navigate
- Highly responsive

The dashboard should visually belong to the same Neria brand world as the storefront, but it must NOT feel like a childish bunny website.

The admin should feel like:

**modern commerce software × premium fashion operations dashboard × soft feminine Neria branding.**

This phase is:

# UI ONLY

Do NOT build a backend.

Do NOT connect a real database.

Do NOT implement real payment processing.

Do NOT implement real authentication.

Use high-quality realistic mock data.

All buttons, tabs, filters, drawers, dropdowns, search fields, modal windows, charts, pagination, tables, toggles and navigation elements should be interactively functional on the frontend.

---

# 1. TECHNOLOGY

Build using:

- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts or another lightweight React chart library
- Lucide React
- Reusable component architecture
- Responsive design
- Mock local JSON/data objects
- Client-side state for interactions

Use modern Next.js App Router structure.

No backend.

No database.

No APIs.

No Supabase.

No Prisma.

No Firebase.

No server-side payment integration.

---

# 2. CORE ADMIN DESIGN SYSTEM

Use Neria's brand identity carefully.

## Main Accent Pink

`#FF4FA3`

Use for:

- Primary buttons
- Active sidebar item
- Important chart highlights
- selected states
- active filters
- notification badges
- confirmation actions

---

## Soft Pink

`#FFD8EA`

Use for:

- secondary card backgrounds
- hover states
- badges
- section accents

---

## Blush Surface

`#FFF4F8`

Use as:

- page backgrounds
- subtle panels

---

## Powder Blue

`#CBE7FA`

Use for:

- alternate analytics cards
- information states
- selected secondary filters

---

## Navy

`#263550`

Use for:

- primary typography
- sidebar text
- headings
- charts where stronger contrast is needed

---

## Cream

`#FFFAF5`

Use selectively.

---

## White

`#FFFFFF`

Main card surface.

---

## Neutral Gray System

Use a proper hierarchy:

`#F8F8FA`

`#F2F3F5`

`#DDE1E7`

`#98A0AE`

`#667085`

`#344054`

`#101828`

Do not make everything pink.

---

# 3. TYPOGRAPHY

Use a professional sans-serif interface font.

Recommended:

- Inter
- Manrope
- Geist
- DM Sans

Do not use the decorative storefront font for dashboard body text.

Optional:

Use the Neria serif/display font only for occasional greeting banners.

Example:

**Good morning, Neria ♡**

Everything operational should remain highly readable.

---

# 4. DASHBOARD STRUCTURE

Desktop layout:

Left:

Collapsible Sidebar.

Top:

Global Header.

Center:

Main Content Area.

Optional right-side drawer:

Activity/details panels.

The dashboard should support:

expanded sidebar

collapsed icon sidebar

mobile drawer navigation

tablet navigation adaptation.

---

# 5. SIDEBAR

Create a premium vertical navigation sidebar.

Top:

Neria Collective logo.

Below:

Main navigation.

Navigation groups:

## OVERVIEW

Dashboard

Live Store

---

## COMMERCE

Orders

Products

Collections

Inventory

Customers

Discounts

Gift Cards

---

## OPERATIONS

Payments

Transactions

Refunds

Shipping

Delivery

Returns

---

## MARKETING

Campaigns

Promotions

Banners

Reviews

Neria Girls

Newsletter

---

## CONTENT

Homepage

Store Sections

Media Library

Pages

Navigation

---

## BUSINESS

Analytics

Reports

Finance

---

## ADMINISTRATION

Staff

Roles & Permissions

Activity Logs

Notifications

Settings

---

Sidebar footer:

Admin profile.

Name

Role

Small avatar.

Quick settings icon.

Logout button.

---

# 6. ACTIVE SIDEBAR STYLE

Active route should use:

soft pink background.

Pink icon.

Dark navy text.

Tiny pink vertical bar.

No overly bright neon blocks.

Hover:

very soft blush background.

---

# 7. SIDEBAR COLLAPSE

Expanded:

approximately 260–280px.

Collapsed:

approximately 76–84px.

Collapsed view:

icons only.

Tooltips appear on hover.

Animate width smoothly.

Do NOT cause content layout jump.

---

# 8. MOBILE SIDEBAR

On mobile:

Sidebar becomes an overlay drawer.

Trigger from hamburger icon.

Use backdrop blur.

Drawer slides from left.

Include close button.

Keep navigation easy to tap.

---

# 9. TOP HEADER

Create a clean sticky top header.

Left:

Page title.

Optional breadcrumb.

Center:

Global search on larger screens.

Placeholder:

**Search orders, products, customers...**

Right:

Store Preview

Quick Add

Notifications

Help

Profile dropdown

---

# 10. QUICK ADD

Create a prominent:

**+ Add New**

button.

Clicking opens dropdown:

Add Product

Create Collection

Create Discount

Create Campaign

Add Staff

Add Banner

Use icons.

---

# 11. GLOBAL SEARCH

Search should support mock results.

When focused:

show search overlay/dropdown.

Result groups:

Products

Orders

Customers

Pages

Actions

Example:

Search:

"NER-2041"

show order.

Search:

"pink hoodie"

show matching products.

Keyboard highlight states should work visually.

---

# 12. NOTIFICATION CENTER

Click bell icon:

Open right dropdown/drawer.

Groups:

New Orders

Low Stock

Payment Issues

Reviews

Returns

Staff Activity

Each notification:

icon

title

short description

timestamp

unread state.

Include:

Mark all as read.

View all notifications.

---

# 13. ADMIN PROFILE MENU

Click avatar:

Profile

Preferences

Keyboard Shortcuts

Storefront

Logout

Use small, polished dropdown.

---

# 14. DASHBOARD HOME

Route:

`/admin`

Heading:

**Good morning, Neria ♡**

Subtext:

**Here's what's happening with your store today.**

Include date range selector.

Right:

Download Report

View Store

---

# 15. TOP KPI CARDS

Create premium analytics cards.

Cards:

Total Revenue

Orders

Customers

Conversion Rate

Average Order Value

Net Profit

Each card contains:

Metric

Percentage change

Comparison text

Mini sparkline

Relevant icon

Example:

Revenue:

`GH₵ 48,920`

`+12.8%`

vs previous period.

---

# 16. KPI CARD DESIGN

Use a mix of:

white

soft pink

powder blue

cream

Do not give every card the same color.

Use subtle borders.

Very light shadows.

Large numbers.

Clear hierarchy.

---

# 17. REVENUE ANALYTICS

Large chart card.

Title:

**Revenue Overview**

Filters:

7D

30D

90D

6M

1Y

Custom

Chart:

Revenue vs Orders.

Use line or area chart.

Include hover tooltip.

Show:

Revenue

Orders

Average Order Value.

---

# 18. SALES BY CATEGORY

Create donut chart.

Categories:

Dresses

Tops

Sets

Accessories

Hoodies

Other

Show:

percentage

revenue

quantity sold.

Use Neria palette.

---

# 19. TOP SELLING PRODUCTS

Card containing:

product thumbnail

product

SKU

units sold

revenue

stock

trend.

Top 5 products.

Link:

**View Products**

---

# 20. RECENT ORDERS

Large table/card.

Columns:

Order

Customer

Date

Items

Payment

Fulfillment

Total

Action.

Use badges:

Paid

Pending

Failed

Refunded

Fulfilled

Processing

Shipped

Delivered.

---

# 21. LIVE ACTIVITY

Card:

**Live Store Activity**

Show mock real-time style events.

Examples:

Someone from Accra added Pink Bunny Hoodie to cart.

Order #NER2048 completed.

Customer added item to wishlist.

Product went low stock.

Use subtle animated pulse for new events.

Frontend-only mock data.

---

# 22. ADMIN BUNNY TOUCH

Use Neria Bunny only in selective dashboard moments.

Examples:

Empty states.

Success screens.

No-data screens.

Setup hints.

Never place Bunny everywhere.

Dashboard should remain professional.

---

# 23. ORDERS PAGE

Route:

`/admin/orders`

Top:

Title

Order count

Export

Create Manual Order

Filters:

All

Unfulfilled

Processing

Shipped

Delivered

Cancelled

Returned

Payment Issue

---

# 24. ORDER SEARCH + FILTERS

Search by:

Order ID

Customer

Phone

Email

Product

Filters:

Date

Status

Payment

Delivery

Amount

Channel

Use advanced filter drawer.

Allow clear all.

---

# 25. ORDERS TABLE

Columns:

Checkbox

Order ID

Customer

Date

Products

Payment

Fulfillment

Delivery

Total

Action.

Include:

bulk selection

bulk mark fulfilled

bulk export

bulk print.

Use sticky table header on desktop.

---

# 26. ORDER DETAIL PAGE

Route:

`/admin/orders/[id]`

Top:

Order ID

Status badge

Created timestamp

Actions dropdown.

Buttons:

Print

Refund

Cancel

Mark as Fulfilled

More

---

# 27. ORDER DETAIL LAYOUT

Desktop:

2-column layout.

Left ~70%.

Right ~30%.

Left:

Items

Timeline

Payment

Shipping

Notes

Right:

Customer

Delivery address

Contact

Fraud/risk placeholder

Order summary

Tags.

---

# 28. ORDER ITEMS CARD

Each item:

thumbnail

name

variant

size

quantity

unit price

total.

Show:

Subtotal

Discount

Delivery

Tax placeholder

Grand Total.

---

# 29. ORDER TIMELINE

Show timeline:

Order placed

Payment confirmed

Processing

Packed

Shipped

Delivered.

Each event:

icon

time

staff note.

Use pink progress line.

---

# 30. PRODUCTS PAGE

Route:

`/admin/products`

Top:

Products

Add Product

Import

Export.

Tabs:

All

Active

Draft

Archived

Out of Stock.

---

# 31. PRODUCTS TABLE/GRID SWITCHER

Allow toggle:

Table View

Grid View.

Table columns:

Product

Status

Inventory

Category

Price

Sales

Updated

Action.

Grid:

large image

name

price

stock

status

menu.

---

# 32. PRODUCT FILTERS

Category

Collection

Status

Stock

Price

Vendor placeholder

Created Date

Tags.

Search field.

---

# 33. ADD PRODUCT PAGE

Route:

`/admin/products/new`

Full detailed UI.

Sections:

Basic Information

Media

Pricing

Inventory

Variants

Category

Collections

SEO

Shipping

Status.

---

# 34. PRODUCT BASIC INFORMATION

Fields:

Product Name

Description

Short Description

Product Type

Brand

Tags.

Description editor toolbar visually functional.

---

# 35. PRODUCT MEDIA

Create drag/drop upload UI.

Large upload zone.

Thumbnail grid.

Allow:

reorder

delete

set primary

preview.

Mock-only interactions.

---

# 36. PRICING UI

Fields:

Price

Compare-at Price

Cost per Item

Margin

Profit.

Auto-calculate mock margin visually.

Example:

Price GH₵350

Cost GH₵180

Profit GH₵170

Margin 48.6%.

---

# 37. INVENTORY SECTION

Fields:

SKU

Barcode

Track Quantity toggle

Stock Quantity

Low Stock Alert

Allow Backorder toggle.

---

# 38. PRODUCT VARIANTS

Add variants:

Size

Color.

Example:

XS

S

M

L

XL

Colors:

Pink

Blue

Cream

Black.

Generate combination table.

Columns:

Variant

SKU

Price

Stock

Status.

---

# 39. PRODUCT STATUS

Sidebar card.

Options:

Draft

Active

Scheduled.

Scheduled fields:

Date

Time.

Publish button.

---

# 40. COLLECTIONS PAGE

Route:

`/admin/collections`

Cards/table.

Fields:

Collection

Products

Status

Updated

Sales.

Examples:

Bunny Love

Strawberry Girl

Soft Girl

Cozy Bunny

Girls' Night.

---

# 41. COLLECTION EDITOR

Fields:

Name

Description

Cover Image

Banner

Products

SEO

Visibility

Schedule.

Allow drag/drop product ordering.

---

# 42. INVENTORY PAGE

Route:

`/admin/inventory`

Show:

Total Units

Low Stock Products

Out of Stock

Inventory Value.

Table:

Product

Variant

SKU

Available

Reserved

Incoming

Updated.

---

# 43. LOW STOCK CENTER

Create dedicated section.

Use alert cards:

Critical

Low

Healthy.

Include restock buttons.

Bunny empty state can appear if all stock is healthy.

Copy:

**Everything looks stocked ♡**

---

# 44. INVENTORY ADJUSTMENT MODAL

Fields:

Product

Variant

Current Quantity

Adjustment

Reason.

Reason:

Restock

Damage

Manual Correction

Return

Other.

Mock Save button.

---

# 45. CUSTOMERS PAGE

Route:

`/admin/customers`

Top cards:

Total Customers

New Customers

Returning Customers

VIP Customers

Average Spend.

---

# 46. CUSTOMER TABLE

Columns:

Customer

Email

Phone

Orders

Total Spent

Last Order

Segment

Action.

Segments:

New

Returning

VIP

At Risk.

---

# 47. CUSTOMER DETAIL PAGE

Sections:

Profile

Orders

Wishlist

Addresses

Notes

Tags

Customer Analytics.

Show:

Lifetime spend

Total orders

Average order

Last activity.

---

# 48. CUSTOMER NOTES

Allow admin to add mock notes.

Example:

**Prefers size M.**

Include author + timestamp.

---

# 49. DISCOUNTS PAGE

Route:

`/admin/discounts`

Top:

Create Discount.

Types:

Percentage

Fixed Amount

Free Shipping

Buy X Get Y

Collection Discount.

---

# 50. DISCOUNT FORM

Fields:

Code

Type

Value

Minimum Spend

Usage Limit

Customer Eligibility

Products

Collections

Start Date

End Date

Status.

Preview card:

**NERIA10 — 10% OFF**

---

# 51. GIFT CARDS

Route:

`/admin/gift-cards`

Cards:

Issued

Redeemed

Outstanding Balance.

List:

Code

Customer

Initial Value

Balance

Status

Created.

---

# 52. PAYMENTS PAGE

Route:

`/admin/payments`

Use frontend mock payment data.

Top metrics:

Gross Payments

Successful

Pending

Failed

Refunded.

Filters:

Payment Method

Status

Date

Amount.

---

# 53. PAYMENT METHODS

Visual mock methods:

MTN Mobile Money

Telecel Cash

Card

Bank Transfer

Cash placeholder.

Use proper neutral icons/illustrative placeholders.

Do not implement actual payment API.

---

# 54. TRANSACTIONS PAGE

Route:

`/admin/transactions`

Columns:

Transaction ID

Order

Customer

Method

Type

Amount

Fee

Net

Status

Date.

Type:

Charge

Refund

Adjustment.

---

# 55. TRANSACTION DETAILS DRAWER

Click row:

Right drawer opens.

Show:

Transaction

Customer

Order

Payment method

Timeline

Amounts

Reference

Status.

---

# 56. REFUNDS PAGE

Route:

`/admin/refunds`

Metrics:

Refunded Amount

Pending Refunds

Completed Refunds.

Table:

Refund ID

Order

Customer

Reason

Amount

Status

Date.

---

# 57. REFUND MODAL

Fields:

Refund Amount

Items

Reason

Restock Items toggle

Admin Note.

Buttons:

Cancel

Confirm Refund.

Frontend-only state.

---

# 58. SHIPPING PAGE

Route:

`/admin/shipping`

Top cards:

Orders to Ship

In Transit

Delivered

Delayed.

---

# 59. SHIPPING METHODS

Create cards:

Standard Delivery

Express Delivery

Pickup.

Each:

Price

Estimated days

Status

Edit.

---

# 60. SHIPPING ZONES

Table:

Zone

Regions

Rate

Estimated Time

Status.

Example:

Accra Central

Greater Accra Outer

Kumasi

Other Regions.

---

# 61. DELIVERY PAGE

Route:

`/admin/delivery`

If store uses delivery riders later, UI can accommodate.

Show:

Awaiting Assignment

Assigned

Picked Up

In Transit

Delivered.

---

# 62. DELIVERY MAP MOCKUP

Create visual map card.

No actual map API required.

Use placeholder interactive map-style UI.

Pins:

Orders

Riders

Delivery zones.

List on side.

---

# 63. RETURNS PAGE

Route:

`/admin/returns`

Status tabs:

Requested

Approved

In Transit

Received

Refunded

Rejected.

Table:

Return ID

Order

Customer

Items

Reason

Status

Date.

---

# 64. RETURN DETAIL

Show:

Customer reason

Images placeholder

Items

Return timeline

Refund amount

Admin notes

Actions:

Approve

Reject

Mark Received

Refund.

---

# 65. CAMPAIGNS PAGE

Route:

`/admin/campaigns`

Create marketing campaign manager.

Cards:

Active Campaigns

Scheduled

Completed

Revenue Attributed.

---

# 66. CAMPAIGN TYPES

Email

Banner

Homepage Collection

Promo

Social Placeholder.

Create campaign button.

---

# 67. CAMPAIGN BUILDER

Fields:

Campaign Name

Type

Audience

Start Date

End Date

Message

CTA

Featured Products

Discount.

Preview:

desktop/mobile campaign card.

---

# 68. PROMOTIONS PAGE

Route:

`/admin/promotions`

Create promotional content such as:

Homepage offers

Free shipping

Bundle deal

Flash sale

Limited drop.

Each promotion:

status

date

performance

edit.

---

# 69. BANNERS PAGE

Route:

`/admin/banners`

Manage storefront promotional banners.

Fields:

Title

Subtitle

Image

CTA Text

CTA Link

Position

Start

End

Active toggle.

Preview desktop/mobile.

---

# 70. REVIEWS PAGE

Route:

`/admin/reviews`

Top:

Average Rating

Total Reviews

Pending Moderation

Flagged.

---

# 71. REVIEWS TABLE

Columns:

Rating

Customer

Product

Review

Status

Date

Action.

Actions:

Approve

Hide

Feature

Reply.

---

# 72. REVIEW DETAIL DRAWER

Show:

Product

Customer

Rating

Review

Images

Admin response.

Use mock reply field.

---

# 73. NERIA GIRLS PAGE

Route:

`/admin/community`

This manages storefront community/UGC.

Cards:

Pending Posts

Approved

Featured

Reported.

---

# 74. COMMUNITY CONTENT

Show masonry/grid.

Content:

Customer outfit photo

Caption

Username

Products tagged

Status.

Actions:

Approve

Reject

Feature on Homepage.

---

# 75. NEWSLETTER PAGE

Route:

`/admin/newsletter`

Metrics:

Subscribers

New Subscribers

Unsubscribed

Campaign Open Rate mock.

---

# 76. NEWSLETTER SUBSCRIBERS

Table:

Email

Name

Joined

Source

Status.

Filters:

Active

Unsubscribed

VIP

New.

---

# 77. HOMEPAGE CONTENT MANAGER

Route:

`/admin/content/homepage`

This is very important.

Allow visual management of homepage UI sections.

---

# 78. HOMEPAGE SECTION LIST

Display draggable blocks:

Hero

Shop Your Pretty

New Arrivals

Bunny's Picks

Bow Obsessed

Strawberry Girl

Neria Girls

Newsletter.

Each block has:

Visibility toggle

Edit

Reorder drag handle

Preview.

---

# 79. HERO CONTENT EDITOR

Fields:

Desktop Image

Mobile Image

Heading

Subtitle

CTA 1

CTA 2

Alignment

Background Tone

Decorative Style

Schedule.

Show live preview.

---

# 80. SECTION CONTENT EDITOR

For each homepage section:

Heading

Subtitle

Collection

Products

Image

Theme

Background

Visibility.

---

# 81. MEDIA LIBRARY

Route:

`/admin/media`

Gallery layout.

Tabs:

All

Images

Videos

Logos

Product Media

Banners.

---

# 82. MEDIA CONTROLS

Upload

Search

Filter

Sort

Grid/List

Delete

Rename

Preview.

Mock storage only.

---

# 83. PAGES MANAGER

Route:

`/admin/pages`

Pages:

About

Contact

FAQ

Delivery

Returns

Size Guide

Privacy

Terms.

Table:

Page

Status

Updated

Author.

---

# 84. PAGE EDITOR

Rich text mock editor.

Fields:

Title

Slug

Content

SEO

Status.

Preview button.

---

# 85. NAVIGATION MANAGER

Route:

`/admin/navigation`

Menus:

Header

Footer

Mobile.

Allow drag reorder.

Nested links.

Add link modal.

Visibility.

---

# 86. ANALYTICS PAGE

Route:

`/admin/analytics`

Create a richer reporting dashboard.

Tabs:

Overview

Sales

Products

Customers

Marketing

Operations.

---

# 87. ANALYTICS OVERVIEW

Metrics:

Revenue

Orders

Profit

Conversion

Sessions mock

Average Order Value

Repeat Customer Rate.

Charts:

Revenue trend

Order trend

Conversion funnel

Customer growth

Sales by device

Sales by region.

---

# 88. SALES ANALYTICS

Charts:

Revenue by Day

Revenue by Category

Revenue by Collection

Revenue by Product

Revenue by Payment Method.

---

# 89. PRODUCT ANALYTICS

Show:

Best Sellers

Lowest Sellers

High Wishlist / Low Purchase

High Return Rate

Low Stock / High Demand.

---

# 90. CUSTOMER ANALYTICS

New vs Returning

Top Customers

Customer Lifetime Value mock

Retention mock

Location breakdown.

---

# 91. MARKETING ANALYTICS

Show:

Campaign Revenue

Discount Usage

Newsletter Growth

Top Promo Codes

Campaign conversion.

---

# 92. REPORTS PAGE

Route:

`/admin/reports`

Report cards:

Sales Report

Order Report

Product Report

Inventory Report

Customer Report

Payments Report

Refund Report.

---

# 93. REPORT BUILDER

Choose:

Report Type

Date Range

Filters

Columns.

Preview table.

Buttons:

Export CSV

Export PDF mock.

No actual backend export required unless frontend generated file is simple.

---

# 94. FINANCE PAGE

Route:

`/admin/finance`

Metrics:

Gross Revenue

Refunds

Discounts

Payment Fees mock

Net Revenue

Estimated Profit.

---

# 95. FINANCE CHARTS

Income vs Refunds.

Revenue vs Cost.

Payment method breakdown.

Use clear neutral financial styling.

---

# 96. STAFF PAGE

Route:

`/admin/staff`

Table:

Name

Email

Role

Last Active

Status

Created.

Buttons:

Invite Staff

Manage Roles.

---

# 97. STAFF INVITE MODAL

Fields:

Name

Email

Role

Permissions.

Mock Send Invite button.

---

# 98. ROLES & PERMISSIONS

Route:

`/admin/roles`

Create role cards.

Examples:

Super Admin

Store Manager

Order Manager

Inventory Manager

Marketing Manager

Customer Support

Finance Viewer.

---

# 99. PERMISSION MATRIX

Rows:

Dashboard

Orders

Products

Inventory

Customers

Finance

Marketing

Content

Staff

Settings.

Columns:

View

Create

Edit

Delete

Export.

Use switches/check boxes.

Frontend only.

---

# 100. ROLE DETAILS

Each role:

Role name

Description

Users assigned

Permissions

Edit.

---

# 101. ACTIVITY LOGS

Route:

`/admin/activity`

Table:

Staff Member

Action

Resource

Description

IP placeholder

Date

Time.

Filters:

Staff

Action

Date

Module.

---

# 102. NOTIFICATIONS PAGE

Route:

`/admin/notifications`

Tabs:

All

Orders

Inventory

Payments

Returns

System.

Allow:

Mark read

Delete

Filter.

---

# 103. SETTINGS

Route:

`/admin/settings`

Use tabbed layout.

Tabs:

General

Store

Payments

Shipping

Notifications

Branding

Checkout

Tax

Security

Preferences.

---

# 104. GENERAL SETTINGS

Fields:

Store Name

Support Email

Phone

Currency

Timezone

Country

Language.

---

# 105. BRANDING SETTINGS

Upload:

Logo

Icon

Favicon

Email Logo

Admin Logo.

Colors:

Primary Pink

Secondary Blue

Navy

Background.

Storefront preview card.

---

# 106. CHECKOUT SETTINGS

Toggles:

Guest Checkout

Require Phone

Enable Discount Codes

Enable Delivery Notes

Enable Order Notes.

Mock settings only.

---

# 107. NOTIFICATION SETTINGS

Toggles:

New Order

Payment Failed

Low Stock

Return Request

New Review

Daily Summary.

Channels:

Email

In Dashboard

SMS placeholder.

---

# 108. SECURITY SETTINGS UI

Create UI only.

Sections:

Change Password

2FA Toggle

Login Sessions

Device List

Security Alerts.

No actual security implementation.

---

# 109. ADMIN LOGIN PAGE

Route:

`/admin/login`

Create premium split-screen layout.

Left:

Neria soft branded illustration.

Right:

Login card.

Fields:

Email

Password

Remember Me

Forgot Password.

Button:

**Sign In**

Use subtle bunny illustration.

Keep mature and professional.

---

# 110. FORGOT PASSWORD

Route:

`/admin/forgot-password`

Field:

Email.

Success state.

Soft Neria branding.

---

# 111. RESPONSIVE DASHBOARD RULES

Every page must work at:

320px

360px

375px

390px

430px

768px

1024px

1280px

1440px

1920px.

---

# 112. TABLE RESPONSIVENESS

Desktop:

Full tables.

Tablet:

Hide low-priority columns.

Mobile:

Do NOT force huge horizontal tables everywhere.

Transform important table rows into stacked cards where appropriate.

For data-heavy pages:

Allow controlled horizontal scrolling.

Keep sticky first column if needed.

---

# 113. MOBILE ADMIN HOME

On mobile:

KPI cards become 2-column or horizontal scroll.

Charts stack vertically.

Recent Orders become compact cards.

Sidebar becomes drawer.

Header becomes simpler.

Search can open full-screen overlay.

---

# 114. MOBILE ACTION BAR

On creation/edit pages:

Primary actions should remain accessible.

Use sticky bottom action bar:

Save Draft

Publish.

Do not make users scroll to top to save.

---

# 115. MODALS

All modals must have:

Proper padding.

Close icon.

Responsive widths.

Mobile full-screen or bottom-sheet behavior where appropriate.

Smooth entrance.

Focus states.

---

# 116. DRAWERS

Use drawers for:

Quick Order Details

Transaction Details

Review Details

Filters

Notifications.

Desktop:

right-side drawer.

Mobile:

full-height bottom or full-screen sheet.

---

# 117. DROPDOWNS

Dropdowns should support:

Hover/click states.

Keyboard states visually.

Scroll if long.

Search if more than 10 items.

---

# 118. FORMS

Standard form system:

Label

Input

Helper text

Error state

Success state

Disabled state.

Use consistent:

height

radius

padding

focus ring.

---

# 119. TOAST NOTIFICATIONS

Create toast system.

Types:

Success

Error

Warning

Info.

Examples:

**Product saved successfully.**

**Order marked as fulfilled.**

**Discount created.**

Use subtle bunny icon only in rare celebratory success states.

---

# 120. EMPTY STATES

Every major page must have beautiful empty states.

Examples:

No Orders

No Products

No Reviews

No Campaigns

No Returns.

Use:

simple illustration

clear message

CTA.

Example:

**No orders yet.**

**When your Neria girls start shopping, they'll appear here.**

---

# 121. ERROR STATES

Create frontend mock error components.

Examples:

Failed to Load

Something Went Wrong

Payment Data Unavailable.

Use Retry button.

Keep UI calm.

---

# 122. LOADING STATES

Use skeleton loaders.

Cards:

skeleton cards.

Tables:

skeleton rows.

Charts:

skeleton graph blocks.

Do not show generic spinner on everything.

---

# 123. ADMIN LOADING MASCOT

For full-page transitions only:

small Neria Bunny holding clipboard.

Subtle blink animation.

Text:

**Getting things ready...**

Do not overuse.

---

# 124. PAGE TRANSITIONS

Use light Framer Motion page transition.

Opacity:

0 → 1.

TranslateY:

6–10px.

Duration:

180–280ms.

No dramatic animations.

---

# 125. SIDEBAR ANIMATION

Sidebar collapse should animate smoothly.

Icons remain aligned.

Labels fade out.

Main content resizes smoothly.

---

# 126. CHART ANIMATIONS

Charts animate once on load.

Lines draw.

Bars grow.

Donut fills.

No constant looping animations.

---

# 127. KPI ANIMATIONS

Numbers may count up gently on initial page load.

Keep duration under approximately 700ms.

Do not repeat on every small state update.

---

# 128. STATUS BADGES

Create consistent badges.

Examples:

Active

Draft

Paid

Pending

Failed

Delivered

Returned

Low Stock.

Use muted colors.

Avoid full neon backgrounds.

---

# 129. CONFIRMATION MODALS

For destructive actions:

Delete Product

Cancel Order

Remove Staff

Archive Collection.

Use clear:

Title

Description

Cancel

Confirm.

Do not use playful bunny graphics in destructive confirmations.

---

# 130. BULK ACTION SYSTEM

Tables should support row selection.

When rows selected:

show floating bulk-action toolbar.

Example:

3 selected.

Actions:

Export

Archive

Mark Active

Delete.

---

# 131. DATE PICKER

Create polished date picker.

Preset ranges:

Today

Yesterday

Last 7 Days

Last 30 Days

This Month

Last Month

Custom.

---

# 132. FILTER CHIPS

Active filters appear under toolbar.

Example:

Status: Paid ×

Date: Last 30 Days ×

Country: Ghana ×

Clear All.

---

# 133. PAGINATION

Use:

Previous

Page numbers

Next.

Allow page size:

10

25

50

100.

---

# 134. BREADCRUMBS

Use breadcrumbs for deeper pages.

Example:

Products / Pink Bunny Hoodie.

Keep subtle.

---

# 135. ADMIN HELP CENTER UI

Create optional help drawer.

Sections:

Quick Guides

Keyboard Shortcuts

Contact Support placeholder

Documentation placeholder.

---

# 136. STORE PREVIEW

Button:

**View Store**

Open storefront in new tab/mock link.

Content editing pages should also include:

Preview.

---

# 137. DARK MODE

Do NOT prioritize dark mode unless explicitly requested.

Default admin should remain:

light

soft

clean

feminine.

Build system cleanly enough that dark mode could be added later.

---

# 138. ACCESSIBILITY

Support:

Keyboard navigation

Focus states

ARIA-compatible components

Proper labels

Color contrast

Touch targets

Reduced motion.

---

# 139. PERFORMANCE

Do not load heavy animations.

Avoid huge unoptimized images.

Lazy-load charts if necessary.

Avoid dozens of simultaneous effects.

---

# 140. REUSABLE COMPONENTS

Build reusable components including:

`AdminSidebar`

`AdminHeader`

`Breadcrumbs`

`PageHeader`

`StatCard`

`ChartCard`

`DataTable`

`StatusBadge`

`FilterBar`

`DateRangePicker`

`SearchBox`

`Pagination`

`EmptyState`

`LoadingSkeleton`

`Toast`

`Modal`

`Drawer`

`ConfirmDialog`

`Dropdown`

`Tabs`

`FormField`

`Switch`

`Checkbox`

`FileUploader`

`ProductSelector`

`CustomerSelector`

`OrderTimeline`

`ActivityFeed`

`NotificationPanel`

`QuickAddMenu`

---

# 141. REQUIRED ADMIN ROUTES

Create at least:

`/admin/login`

`/admin`

`/admin/orders`

`/admin/orders/[id]`

`/admin/products`

`/admin/products/new`

`/admin/products/[id]`

`/admin/collections`

`/admin/collections/[id]`

`/admin/inventory`

`/admin/customers`

`/admin/customers/[id]`

`/admin/discounts`

`/admin/gift-cards`

`/admin/payments`

`/admin/transactions`

`/admin/refunds`

`/admin/shipping`

`/admin/delivery`

`/admin/returns`

`/admin/campaigns`

`/admin/promotions`

`/admin/banners`

`/admin/reviews`

`/admin/community`

`/admin/newsletter`

`/admin/content/homepage`

`/admin/media`

`/admin/pages`

`/admin/navigation`

`/admin/analytics`

`/admin/reports`

`/admin/finance`

`/admin/staff`

`/admin/roles`

`/admin/activity`

`/admin/notifications`

`/admin/settings`

---

# 142. FINAL UI QUALITY RULE

This must NOT look like:

a generic admin template

a Bootstrap dashboard

a plain SaaS starter

an AI-generated dashboard

a basic CRUD panel.

The UI should feel custom-designed specifically for Neria Collective.

Use:

excellent spacing

clear information hierarchy

high-quality typography

modern charts

clean data tables

soft Neria color accents

professional fashion-brand identity

subtle microinteractions

responsive behavior

useful empty states

polished modal/drawer behavior.

The result should feel like a dashboard that could genuinely run a serious fashion e-commerce business.

---

# FINAL TARGET

The storefront should feel:

**cute, dreamy and extremely girly.**

The admin should feel:

**organized, powerful, elegant and unmistakably Neria.**

The bunny/teddy identity should appear strategically, especially in:

- empty states
- success states
- loading screens
- setup hints

but the core operational interface should stay highly professional.

Build the entire admin UI with realistic mock data and functional frontend interactions only.

NO BACKEND.
NO DATABASE.
NO REAL PAYMENT LOGIC.
NO AUTHENTICATION LOGIC.
NO API INTEGRATION.

Every screen should be responsive and visually complete before backend integration begins.