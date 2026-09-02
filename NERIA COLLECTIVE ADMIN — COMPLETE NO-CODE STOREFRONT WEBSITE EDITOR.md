# NERIA COLLECTIVE ADMIN — COMPLETE NO-CODE STOREFRONT WEBSITE EDITOR

## CORE OBJECTIVE

Upgrade the existing **Neria Collective Admin Dashboard** by adding a powerful new module called:

# Website Editor

The Website Editor must allow the Neria Collective administrator to manage, customize, edit and publish almost the entire customer-facing Neria Collective website without opening the codebase.

The admin should be able to change:

- Website text
- Headlines
- Descriptions
- Images
- Hero banners
- Promotional banners
- Buttons
- Button text
- Button destination links
- Emojis
- Bunny illustrations
- Icons
- Colors
- Background colors
- Typography settings
- Section ordering
- Section visibility
- Products appearing in homepage sections
- Collections
- Categories
- Announcement bar
- Navigation links
- Footer content
- Social media links
- Contact information
- Newsletter content
- Campaign sections
- Promotional popups
- Featured products
- Best sellers
- New arrivals
- Homepage content
- About page content
- FAQ content
- Shipping information
- Size guide
- SEO information

The administrator must NOT need to understand HTML, CSS, JavaScript, React, Next.js or programming.

The experience should feel similar to a lightweight combination of:

Shopify Theme Editor

Webflow Editor

Framer CMS

WordPress Gutenberg

Canva

but designed specifically for **Neria Collective**.

Do not build a generic page builder.

The editor must understand the existing Neria design system.

---

# MAIN ADMIN NAVIGATION ADDITION

Add a major navigation item to the existing admin sidebar:

**Website**

Use an appropriate website/storefront icon.

Expanding Website should show:

Overview

Live Editor

Pages

Homepage

Navigation

Announcements

Popups

Collections

Media Library

Brand Settings

Theme Settings

SEO

Footer

Publish History

Redirects

Advanced

---

# 1. WEBSITE OVERVIEW

Create:

Admin Dashboard → Website → Overview

This should provide a quick overview of the current storefront.

Display:

Website Status

LIVE

Last Published

Last Edited

Current Theme

Neria Default Theme

Published By

Storefront URL

Device preview shortcuts

Desktop

Tablet

Mobile

Quick Actions:

EDIT WEBSITE

VIEW LIVE WEBSITE

MANAGE HOMEPAGE

UPLOAD MEDIA

EDIT NAVIGATION

CREATE ANNOUNCEMENT

Buttons must route correctly.

---

# 2. LIVE VISUAL WEBSITE EDITOR

This is the most important feature.

Route:

/admin/website/editor

Create a visual editor where the actual Neria storefront is displayed inside the dashboard.

Layout:

LEFT SIDEBAR

CENTER WEBSITE PREVIEW

RIGHT PROPERTY PANEL

TOP TOOLBAR

The administrator should feel like they are editing the real website visually.

---

# TOP EDITOR TOOLBAR

Create a sticky toolbar containing:

Neria Logo

Page Selector

Device Selector

Undo

Redo

Preview

Save Draft

Publish

Exit Editor

---

# PAGE SELECTOR

Allow admin to switch between pages.

Dropdown:

Homepage

Shop

New Arrivals

Collections

About

Contact

FAQ

Shipping & Returns

Size Guide

Login

Signup

Cart

Wishlist

Product Page Template

Collection Page Template

Order Confirmation

Other configured pages

---

# DEVICE PREVIEW

Buttons:

Desktop

Tablet

Mobile

When Desktop is selected:

Show desktop storefront.

Tablet:

Show tablet preview.

Mobile:

Show realistic mobile dimensions.

Do not simply shrink everything.

Use responsive breakpoints.

---

# CENTER LIVE PREVIEW

Display the Neria storefront.

When the admin hovers over editable content, highlight it subtly.

For example:

Hero Section

New Arrivals

Shop By Category

Featured Collection

Neria Girl

Best Sellers

Journal

Newsletter

Instagram

Footer

When hovering a section:

Show small floating controls:

EDIT

MOVE

DUPLICATE

HIDE

DELETE

The selected section should receive a subtle blue outline.

Do not place permanent editing controls on the actual customer-facing storefront.

These controls exist only inside admin mode.

---

# INLINE TEXT EDITING

The administrator must be able to click text directly inside the website preview.

Example:

Click:

Soft looks. Loud presence.

Immediately allow editing.

Admin types:

Your wardrobe deserves better.

The preview updates instantly.

No code required.

Support:

Heading

Paragraph

Caption

Button Text

Product Label

Promotional Text

Emoji

---

# RIGHT PROPERTY PANEL

When an element is clicked, display contextual editing controls.

Example:

If the admin selects a heading:

CONTENT

Text:
[ Soft looks. Loud presence. ]

Emoji:
[ ♡ ]

STYLE

Font

Font Size

Font Weight

Text Alignment

Text Color

Letter Spacing

Line Height

Visibility

Desktop

Tablet

Mobile

Advanced

Reset to Default

---

# 3. EMOJI MANAGER

The user specifically wants to change emojis and similar decorative elements.

Create a built-in:

Emoji & Symbols Picker

When editing text, buttons or decorative elements, allow administrator to insert emojis.

Categories:

Hearts

Fashion

Celebration

Nature

Stars

Arrows

Faces

Animals

Bunny-related

Symbols

Frequently Used

Examples:

♡
♥
✨
🎀
🐰
🤍
🩵
🛍️
⭐
🌸
💌
☁️

Admin should also be able to:

Search emoji

Remove emoji

Replace emoji

Reposition emoji

Change emoji size

Hide emoji

---

# 4. NERIA BUNNY MANAGER

Because the bunny is part of Neria's identity, create a special brand asset feature.

Admin → Website → Brand Assets → Bunny

Create a Bunny Library.

Available bunny variants:

Default Bunny

Happy Bunny

Shopping Bunny

Sleeping Bunny

Love Bunny

Celebration Bunny

Empty Cart Bunny

Wishlist Bunny

Newsletter Bunny

Thank You Bunny

Seasonal Bunny

Admin can choose which bunny appears in specific areas.

Example:

Empty Cart Bunny:
[ Select Bunny ]

Order Confirmation:
[ Celebration Bunny ]

Newsletter:
[ Love Bunny ]

Homepage:
[ Default Bunny ]

Admin can upload additional bunny illustrations.

Support:

PNG

SVG

WebP

GIF where appropriate

---

# 5. SECTION EDITOR

Every homepage section should be editable independently.

Admin should see:

Homepage Sections

01 Hero

02 New Arrivals

03 Shop Categories

04 Featured Collection

05 Neria Girl

06 Best Sellers

07 Neria Journal

08 Bunny Moment

09 Seen In Neria

10 Newsletter

Each section has:

Edit

Show / Hide

Duplicate

Reorder

Schedule

Reset

---

# DRAG-AND-DROP SECTION ORDERING

Allow administrator to reorder homepage sections.

Example:

Hero

Featured Collection

New Arrivals

Best Sellers

Neria Girl

Newsletter

Drag sections vertically.

The website updates accordingly after publishing.

---

# 6. HERO SECTION EDITOR

Selecting Hero should expose:

CONTENT

Small Label

Main Heading

Description

Primary Button Text

Primary Button Link

Secondary Button Text

Secondary Button Link

Media

Desktop Image

Mobile Image

Optional Background Video

Overlay

Overlay Opacity

Text Position

Left

Center

Right

Vertical Position

Top

Center

Bottom

Color

Heading Color

Description Color

Button Color

Button Text Color

Animation

None

Fade

Slide

Slow Zoom

Admin can replace the hero image using the Media Library.

---

# 7. NEW ARRIVALS EDITOR

Allow admin to control homepage New Arrivals.

Heading

Subtitle

Number of Products

Product Source:

Automatic

Manual

Collection

Automatic could pull products marked:

New Arrival

Manual allows admin to select products.

Admin can drag products into preferred order.

Example:

☰ Cloud Mini Dress

☰ Neria Blue Set

☰ Weekend Top

☰ Soft Girl Skirt

Options:

Show Price

Show Colour

Show Wishlist

Show Quick Add

Show New Badge

---

# 8. PRODUCT SECTION MANAGEMENT

For sections such as:

Best Sellers

New Arrivals

Recommended

Featured Products

Allow:

Manual Selection

Automatic Rules

Automatic Rules examples:

Newest Products

Most Purchased

Highest Rated

Featured

Collection

Category

Recently Added

Products should not need to be duplicated.

The website editor should reference the existing product database.

---

# 9. CATEGORY EDITOR

Admin can edit:

Category Image

Category Name

Category Link

Category Visibility

Category Order

Example:

Dresses

Tops

Sets

Bottoms

Accessories

Admin can:

Add Category

Edit

Delete

Hide

Reorder

---

# 10. FEATURED COLLECTION EDITOR

Fields:

Collection Label

Collection Name

Description

Image

Secondary Image

Button Text

Button Link

Background Color

Text Color

Layout

Available layout options:

Image Left

Image Right

Full Width

Editorial Split

---

# 11. NERIA GIRL SECTION

Allow editing:

Heading

Description

Images

Decorative Text

Handwritten Notes

Bunny Element

Button

Admin can upload up to several images.

Allow drag positioning within predetermined safe layout structures.

Do not allow uncontrolled absolute positioning that breaks responsiveness.

---

# 12. NERIA JOURNAL

Create CMS management for editorial articles.

Admin can:

Create Article

Edit Article

Upload Cover Image

Add Title

Add Excerpt

Add Body Content

Select Category

Add Author

Add Publish Date

Schedule Publication

Add SEO

Article Status:

Draft

Scheduled

Published

Archived

Homepage Journal section can select featured articles.

---

# 13. INSTAGRAM / SEEN IN NERIA

Allow admin to manage the section manually.

Admin can upload:

Customer Image

Caption

Instagram Link

Tagged Product

Customer Name

Admin can reorder gallery images.

Support optional future Instagram API integration.

---

# 14. NEWSLETTER SECTION EDITOR

Admin can change:

Heading

Description

Input Placeholder

Button Text

Success Message

Bunny Illustration

Background Color

Text Color

Example:

Heading:

Come into the Neria world.

Description:

New drops, little surprises and everything we're currently loving.

All editable.

---

# 15. ANNOUNCEMENT BAR MANAGER

Admin → Website → Announcements

Allow multiple announcements.

Example:

New pieces just landed ♡

Free delivery on selected orders

The Blue Hour collection is live 🩵

Fields:

Message

Emoji

Link

Text Color

Background Color

Start Date

End Date

Priority

Status

Admin can:

Create

Edit

Pause

Delete

Schedule

Reorder

Allow rotation if multiple announcements are active.

---

# 16. POPUP MANAGER

Create:

Website → Popups

Admin can create promotional popups without coding.

Popup Types:

Newsletter

Discount

New Collection

Important Message

Sale

Custom

Fields:

Title

Description

Image

Emoji

Bunny

Button Text

Button Link

Secondary Button

Promo Code

Background

Text Color

Schedule

Display Rules

Display Rules:

Every Visitor

New Visitors

Returning Customers

After X Seconds

After X% Scroll

Exit Intent Desktop

Specific Pages

Mobile Only

Desktop Only

Frequency:

Every Visit

Once Per Day

Once Per Week

Once Per User

---

# 17. NAVIGATION MANAGER

Admin → Website → Navigation

Allow editing main navigation.

Existing example:

Shop

New In

Collections

Admin can:

Add Link

Rename Link

Change URL

Add Dropdown

Add Mega Menu

Hide

Delete

Reorder

Use drag-and-drop.

Example:

SHOP
 ├ Dresses
 ├ Tops
 ├ Sets
 ├ Bottoms
 └ Accessories

Allow admin to assign campaign image to mega menu.

---

# 18. FOOTER EDITOR

Allow editing:

Brand Description

Footer Menus

Contact

Social Links

Payment Icons

Country

Currency

Copyright

Privacy Link

Terms Link

Instagram

TikTok

Pinterest

Admin can change footer column names.

---

# 19. MEDIA LIBRARY

Create:

Website → Media Library

This becomes the central place for website imagery.

Tabs:

All Media

Images

Videos

Icons

Bunnies

Product Images

Campaigns

Uploads

Allow:

Drag-and-drop upload

Multiple upload

Rename

Delete

Replace

Search

Filter

Folders

Copy URL

Image preview

Image dimensions

File size

Used On

Important:

Before deleting an image, show:

"This image is currently being used on 3 sections."

Prevent accidental broken images.

---

# 20. IMAGE EDITING

Basic image controls inside admin:

Crop

Rotate

Zoom

Aspect Ratio

Focal Point

Replace

Alt Text

Mobile Crop

Desktop Crop

Do not attempt to build Photoshop.

Keep this simple.

---

# 21. BRAND SETTINGS

Route:

Website → Brand Settings

Allow management of:

Primary Logo

Secondary Logo

Icon

Favicon

Bunny Logo

Brand Colors

Fonts

Social Handles

Default Branding

---

# 22. COLOR SYSTEM

Allow admin to change predefined brand tokens.

Primary Search Blue

Secondary Blue

Background

Surface

Text

Muted Text

Borders

Success

Warning

Sale

Button

Admin must use a color picker.

Also allow HEX input.

Example:

#A7D8F0

Changes update preview instantly.

IMPORTANT:

Use design tokens/CSS variables internally.

Do not directly hardcode colors throughout components.

Example:

--brand-primary

--brand-secondary

--background

--text-primary

--text-secondary

---

# 23. TYPOGRAPHY SETTINGS

Admin can select fonts for:

Display Headings

Body

Navigation

Buttons

Labels

Allow:

Font Family

Weight

Base Size

Heading Scale

Letter Spacing

Line Height

Limit available fonts to approved fonts so the administrator cannot accidentally ruin the brand appearance.

---

# 24. BUTTON STYLE SETTINGS

Allow administrator to control global buttons.

Settings:

Corner Radius

Background

Text Color

Border

Hover Style

Button Height

Button Font

Button Weight

Presets:

Minimal

Soft

Rounded

Square Fashion

Neria Default

---

# 25. PAGE MANAGER

Admin → Website → Pages

Table:

Page

Status

Last Edited

SEO

Actions

Pages:

Homepage

About

Contact

FAQ

Shipping & Returns

Size Guide

Custom Pages

Actions:

Edit

Preview

Duplicate

SEO

Hide

Delete

Do not allow deletion of required system pages without a warning.

---

# 26. SIMPLE CONTENT BLOCK BUILDER

For informational pages such as About, FAQ and Shipping, allow admin to add sections.

Available blocks:

Heading

Text

Image

Image + Text

Gallery

Video

Button

Divider

FAQ

Quote

Newsletter

Products

Collection

Spacer

Bunny Graphic

Do not turn this into a completely unrestricted website builder.

All blocks must use the Neria design system.

---

# 27. FAQ MANAGER

Admin can:

Add Question

Add Answer

Reorder

Hide

Delete

Group FAQs.

Categories:

Orders

Shipping

Returns

Payments

Products

Sizing

---

# 28. SIZE GUIDE MANAGER

Admin can change size tables.

Example:

Size
Bust
Waist
Hip

XS

S

M

L

XL

Allow different size guides for different product categories.

---

# 29. SEO MANAGER

Every page should expose:

SEO Title

Meta Description

URL Slug

Social Image

Index / No Index

Canonical URL where appropriate

Show Google-style preview.

Example:

Neria Collective | Women's Fashion

Preview description underneath.

---

# 30. LIVE SEO HEALTH

Show:

Missing Page Title

Missing Description

Missing Image Alt Text

Broken Links

Duplicate Titles

Missing Product Descriptions

Use simple:

Good

Needs Attention

Critical

Do not overwhelm a nontechnical admin.

---

# 31. LINK MANAGER

Buttons should not require manually typing complicated URLs.

Allow destination picker:

Product

Collection

Page

External URL

Email

Phone

Instagram

TikTok

Custom Link

Example:

Button:
Shop Now

Link To:
Collection

Select:
Blue Hour

---

# 32. VISIBILITY CONTROLS

Each section can have:

Visible Everywhere

Hide Desktop

Hide Tablet

Hide Mobile

Logged In Customers Only

Logged Out Visitors Only

Scheduled Visibility

Start Date

End Date

Useful for campaigns.

---

# 33. CAMPAIGN SCHEDULING

Admin should be able to schedule storefront content.

Example:

Christmas Campaign

Start:

December 1

End:

December 27

Automatically:

Show Christmas Hero

Show Popup

Activate Announcement

Feature Christmas Collection

Then automatically revert when campaign ends.

---

# 34. DRAFT SYSTEM

Changes must NOT immediately affect the live website.

States:

Draft

Published

Scheduled

Admin makes changes.

Click:

SAVE DRAFT

Then:

PREVIEW

Then:

PUBLISH

---

# 35. PREVIEW MODE

Preview unpublished changes before publishing.

Top banner:

YOU ARE VIEWING AN UNPUBLISHED PREVIEW

Buttons:

Back to Editor

Publish Changes

Desktop

Tablet

Mobile

Generate a temporary preview link if architecture supports it.

---

# 36. PUBLISHING

When Publish is clicked:

Show modal:

Publish Changes?

Summary:

Hero heading updated

Hero image changed

2 products added to Best Sellers

Announcement created

Newsletter copy updated

Buttons:

Cancel

Publish Now

After successful publishing:

✓ Website Published

---

# 37. VERSION HISTORY

Create:

Website → Publish History

Record:

Date

Time

Admin

Changes

Version

Example:

Version 28

Sep 2, 2026

Updated homepage hero + announcement

Actions:

View

Restore

Compare

Admin can restore previous website state.

---

# 38. UNDO AND REDO

Inside visual editor support:

Undo

Redo

Keyboard shortcuts:

Ctrl/Cmd + Z

Ctrl/Cmd + Shift + Z

---

# 39. AUTO SAVE

Automatically save editing state approximately every few seconds.

Display:

Saving...

then:

Saved

Do not force the administrator to constantly press save.

Auto-save should save a draft, NOT automatically publish.

---

# 40. PRODUCT CONTENT MANAGEMENT CONNECTION

The website editor must integrate with the existing product management system.

If admin changes:

Product Name

Product Image

Price

Stock

Color

Description

it should update anywhere that product appears.

Do NOT duplicate product records for homepage sections.

Reference product IDs.

---

# 41. COLLECTION MANAGEMENT CONNECTION

Collections should also be reusable.

Example:

Blue Hour

Summer Drop

Best Sellers

New In

When collection data changes, dependent website sections update automatically.

---

# 42. SALE CAMPAIGN CONTROL

Create easy sale controls.

Admin can select:

20% OFF

Selected Products

Selected Collection

Entire Store

Start Time

End Time

Sale Label:

SALE

20% OFF

LIMITED

Admin can customize badge emoji where appropriate.

---

# 43. GLOBAL WEBSITE SEARCH SETTINGS

Allow admin to configure:

Popular Searches

Suggested Products

Trending Categories

Search Placeholder

Example:

Search Neria...

---

# 44. EMPTY STATE EDITOR

Allow admin to customize customer-facing empty states.

Examples:

Empty Cart

Empty Wishlist

No Search Results

No Orders

Admin can change:

Bunny

Heading

Description

Button

Emoji

Example:

Your bag feels a little lonely 🐰

---

# 45. ORDER CONFIRMATION CONTENT

Allow administrator to customize:

Heading

Message

Bunny

Emoji

Continue Shopping CTA

Support Message

Example:

She's yours. ♡

We're getting your Neria pieces ready.

---

# 46. SOCIAL LINKS MANAGER

Fields:

Instagram

TikTok

Pinterest

X

Facebook

YouTube

WhatsApp

Allow show/hide.

---

# 47. CONTACT DETAILS

Editable:

Email

Phone

WhatsApp

Location

Support Hours

All customer-facing pages should retrieve these values from centralized settings.

---

# 48. SITE-WIDE SEARCH AND EDIT

Inside Website Editor create:

Search Website Content

Admin can search:

"Soft looks"

Result:

Homepage → Hero → Heading

Click result to jump directly into editing.

---

# 49. QUICK EDIT MODE

Add a toggle:

QUICK EDIT

When active, admin clicks any text or image directly.

Examples:

Click image → Replace Image

Click text → Edit Text

Click button → Edit Button

Click emoji → Emoji Picker

Click product → Product Settings

Click section → Section Settings

This should make website management extremely intuitive.

---

# 50. SAFE EDITING SYSTEM

The administrator must not be able to accidentally destroy the website structure.

Therefore:

Do not allow arbitrary JavaScript.

Do not allow HTML injection.

Do not expose CSS source.

Do not expose system components.

Do not allow deletion of checkout functionality.

Use predefined components and safe configuration schemas.

---

# 51. ROLE PERMISSIONS

Not every admin should have publishing access.

Create permissions:

Website Viewer

Website Editor

Content Manager

Publisher

Super Admin

Example:

Content Manager:
Can edit content.

Publisher:
Can publish.

Super Admin:
Can edit global theme and restore versions.

---

# 52. ACTIVITY LOG

Track important website actions.

Example:

Ama changed homepage hero image.

Michael published storefront version 24.

Admin changed Search Blue from #XXXXXX to #XXXXXX.

Admin created September Promotion popup.

Record:

User

Action

Date

Time

Affected Page

---

# 53. TECHNICAL ARCHITECTURE

Do NOT store customer website content directly inside React components.

Create a centralized content system.

Possible database models:

SiteSettings

ThemeSettings

Page

PageSection

Navigation

NavigationItem

Announcement

Popup

MediaAsset

HomepageConfig

FooterConfig

SEOConfig

ContentRevision

Campaign

SocialLink

BrandAsset

Create structured JSON configuration where appropriate.

Example conceptual PageSection:

id

pageId

sectionType

position

enabled

content

style

responsiveSettings

publishedVersion

updatedAt

---

# 54. FRONTEND RENDERING

The Neria customer website should read its editable content from the database/configuration layer.

Instead of:

<h1>Soft looks. Loud presence.</h1>

Use content retrieved from the CMS configuration.

The storefront components remain coded and professionally designed.

The CONTENT inside them becomes configurable.

This gives the admin editing power while keeping the storefront stable.

---

# 55. DESIGN TOKEN ARCHITECTURE

Use CSS variables / theme tokens for editable branding.

For example:

--neria-primary

--neria-secondary

--neria-background

--neria-surface

--neria-text

--neria-muted

--neria-border

--neria-radius

--neria-heading-font

--neria-body-font

Changing Brand Settings should update these variables rather than modifying source files.

---

# 56. CACHE INVALIDATION

When website changes are published:

Save new published configuration.

Invalidate storefront caches.

Refresh affected pages.

Do not require redeploying the entire Vercel application just because the administrator changed text or an image.

Changes should appear shortly after publishing.

---

# 57. IMAGE STORAGE

Use proper cloud storage such as the storage service already integrated into the project.

Store image references in the CMS database.

Do not store base64 images directly in database content records.

---

# 58. RESPONSIVE SAFEGUARDS

Admin customization must never destroy mobile responsiveness.

Do not allow arbitrary pixel positioning.

Use controlled options.

Example:

Text Position:

Left

Center

Right

rather than entering:

left: 347px;

Section Width:

Full

Standard

Narrow

rather than arbitrary widths.

This protects the Neria design.

---

# 59. EDITOR UI DESIGN

The admin website editor itself must look premium and professional.

Use:

Clean neutral admin surfaces

White / subtle grey workspace

Search Blue as active accent

Clear borders

Compact controls

Proper spacing

Professional property panels

Avoid huge cards.

Avoid excessive gradients.

Avoid playful bunny decorations throughout the admin interface.

The customer-facing brand can be cute.

The ADMIN should feel like professional commerce software.

---

# 60. MOBILE ADMIN

The normal admin dashboard should remain responsive.

However, advanced drag-and-drop website editing should display:

"For the best editing experience, use desktop."

Mobile admin can still:

Change text

Upload hero

Change announcements

Edit products

Publish

Manage colors

Enable/disable sections

---

# 61. UNSAVED CHANGE PROTECTION

If admin attempts to leave with unsaved draft modifications:

Display:

You have unsaved changes.

Discard Changes

Continue Editing

Save Draft

---

# 62. RESET OPTIONS

For every section:

Reset Section to Default

For theme:

Reset Theme

For whole storefront:

Restore Previous Version

Never immediately reset.

Require confirmation.

---

# 63. COMMAND / ACTION SEARCH

Add an admin command search.

Example:

Search:

"hero"

Results:

Edit Homepage Hero

Upload Hero Image

Hero SEO

Search:

"announcement"

Results:

Create Announcement

Manage Announcements

Useful as the CMS becomes larger.

---

# 64. CONTENT VALIDATION

Before publishing, automatically check:

Missing required images

Buttons without destinations

Empty headings

Invalid links

Sections without products

Missing mobile hero

Missing product images

Show warning:

3 items need attention.

Admin can still publish noncritical changes.

---

# 65. FINAL WEBSITE EDITOR EXPERIENCE

The complete workflow should feel like:

Admin logs in.

Clicks:

Website → Live Editor

The real Neria homepage appears inside the editor.

Admin clicks:

"Soft looks. Loud presence."

Changes it to:

"Made for your softest era. 🩵"

Clicks the hero image.

Uploads a new campaign image.

Clicks:

New Arrivals.

Chooses four new products.

Clicks the bunny.

Changes it to another bunny illustration.

Clicks Search Blue.

Changes the brand shade.

Switches to Mobile Preview.

Checks the website.

Clicks:

SAVE DRAFT.

Clicks:

PREVIEW.

Then:

PUBLISH.

The customer storefront updates without anyone opening VS Code or editing source code.

THAT is the experience this feature must deliver.

---

# CRITICAL IMPLEMENTATION RULE

Do not make the Neria storefront itself a fully uncontrolled drag-and-drop website builder.

The professional components and layouts should remain coded.

The administrator controls:

CONTENT

MEDIA

ORDER

VISIBILITY

COLORS

TYPOGRAPHY

BUTTONS

PRODUCT SOURCES

COLLECTION SOURCES

BUNNY ASSETS

EMOJIS

CAMPAIGNS

ANNOUNCEMENTS

SEO

and predefined layout variants.

This protects the visual quality and prevents the website from starting to look amateur.

The goal is:

**A professional coded Neria storefront controlled by a powerful no-code CMS.**

The administrator should feel that she controls her entire online store without needing a developer for everyday content changes.