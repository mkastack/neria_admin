# IMPORTANT — UPGRADE EXISTING NERIA ADMIN DASHBOARD ONLY

The Neria Collective admin dashboard is already built.

DO NOT rebuild the admin dashboard from scratch.

DO NOT replace the existing dashboard UI.

DO NOT redesign working pages unless changes are necessary for this feature.

DO NOT remove existing:

- Authentication
- Admin roles
- Dashboard overview
- Product management
- Orders
- Customers
- Inventory
- Analytics
- Existing navigation
- Existing database connections
- Existing APIs
- Existing components

First analyze the current project architecture and reuse everything that already works.

This task is an **upgrade**.

The primary feature being added is:

**Website / Storefront Management**

Add it cleanly into the existing admin dashboard sidebar/navigation.

Example:

Dashboard  
Orders  
Products  
Customers  
Inventory  
Analytics  
Marketing  
**Website** ← NEW  
Settings  

Under Website add:

- Live Editor
- Homepage
- Pages
- Navigation
- Announcements
- Popups
- Media Library
- Brand Settings
- Theme
- Footer
- SEO
- Publish History

The purpose is to allow the administrator to control the existing Neria Collective customer website without coding.

Do not create another separate admin application.

Integrate this functionality directly into the current admin dashboard.

Reuse the current:

- Database
- Authentication
- User roles
- Design system
- Sidebar
- Header
- Form components
- Modal components
- Toast notifications
- API architecture
- State management
- Storage system

Extend them where necessary.

The existing storefront must also remain intact.

Refactor only the parts of the storefront that currently have hardcoded editable content so that the content can instead be controlled from the admin dashboard.

For example, if the homepage currently contains:

`Soft looks. Loud presence.`

Do not redesign the hero.

Instead, make that existing heading editable from:

Admin → Website → Homepage → Hero

The same principle applies to:

- Hero images
- Hero text
- Buttons
- Emojis
- Bunny graphics
- New Arrivals
- Best Sellers
- Featured collections
- Promotional banners
- Section visibility
- Section ordering
- Newsletter content
- Footer
- Social links
- Announcement bar
- Theme colors
- Website typography

Maintain the current Neria storefront design while making its content manageable.

## CRITICAL RULE

**Existing Admin Dashboard + Existing Storefront + New CMS Controls**

NOT:

**New Admin Dashboard + New Storefront**

Upgrade, integrate and extend the current project.