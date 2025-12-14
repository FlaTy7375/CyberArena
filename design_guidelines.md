# CyberArena Gaming Club - Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern gaming platforms (Discord, Valorant website, Steam) with cyberpunk/tech aesthetics. Focus on bold typography, striking visuals, and immersive experience.

## Color Scheme
**Black/Purple Neon Theme** - More aligned with gaming/cyberpunk aesthetic:
- Primary: Deep purple (#7C3AED, #A855F7)
- Accent: Bright purple/magenta for CTAs and highlights
- Background: True black (#000000) and dark grays (#0A0A0A, #1A1A1A)
- Text: White (#FFFFFF) and light grays (#E5E5E5)
- Neon glow effects for interactive elements

## Typography
- **Headings**: Bold, geometric sans-serif (e.g., "Rajdhana", "Orbitron", "Space Grotesk") - uppercase for major headings
- **Body**: Clean, readable sans-serif (e.g., "Inter", "DM Sans")
- **Accents**: Monospace font for pricing/stats (e.g., "Roboto Mono")
- **Scale**: H1: 4xl-6xl, H2: 3xl-4xl, H3: 2xl-3xl, Body: base-lg

## Layout System
**Spacing**: Tailwind units of 4, 8, 12, 16, 24 (p-4, gap-8, py-12, etc.)
- Generous section padding: py-16 to py-24 on desktop, py-12 on mobile
- Max container width: max-w-7xl for content sections
- Full-width backgrounds with contained content

## Sections Structure (8 Sections)

### 1. Hero Section
- Full-viewport immersive hero (100vh)
- Large hero image: Dramatic gaming setup/arena interior with purple LED lighting, high-end gaming PCs
- Overlaid bold headline + CTA buttons with glassmorphism/blur effect
- Floating stats cards (e.g., "50+ Gaming PCs", "24/7 Access")

### 2. About Section
- Asymmetric 2-column layout (60/40 split)
- Image: Professional gaming arena photos
- Text with icon bullets highlighting key benefits
- Diagonal section divider for visual interest

### 3. Gaming Zones/Equipment
- Card grid showcasing different zones (3-column on desktop, stacked mobile)
- Each card: Image of gaming setup + specs overlay
- Hover effects with purple glow borders
- Images: High-end gaming rigs, VR stations, tournament area

### 4. Pricing/Tariffs
- 3-4 pricing tiers in cards with neon borders
- Popular plan highlighted with purple glow
- Include per-hour, daily, and monthly options
- Monospace font for prices

### 5. Tournaments & Events
- Horizontal scrolling carousel OR masonry grid
- Event cards with: Image thumbnail, date badge, prize pool, registration CTA
- Images: Esports tournaments, team competitions, game logos

### 6. PC Specifications
- Technical grid layout showing hardware specs
- Icon + stat pairs (GPU, CPU, RAM, Monitor specs)
- Clean, data-focused presentation with purple accent highlights

### 7. Gallery
- Masonry grid (Pinterest-style) OR 3-column grid with varied heights
- Lightbox functionality on click
- Images: Club interior, gaming sessions, tournament moments, equipment close-ups

### 8. Contact & Booking
- Split layout: Booking form (left) + Map/Info (right)
- Form with purple accent inputs and glow focus states
- Operating hours, address, social links

## Component Library

### Navigation
- Fixed header with transparent-to-solid transition on scroll
- Logo + horizontal menu (desktop), hamburger menu (mobile)
- Purple underline for active nav items

### Buttons
- Primary: Purple gradient with subtle glow
- Secondary: Outlined purple with hover fill
- Glassmorphism style for hero CTAs

### Cards
- Dark background (#1A1A1A) with subtle purple border
- Hover: Elevated shadow + purple glow effect
- Rounded corners (8-12px)

### Forms
- Dark inputs with purple focus border and glow
- Floating labels
- Custom purple checkboxes/radio buttons

### Footer
- 3-column layout: Logo/about, Quick links, Social/Contact
- Dark background with subtle purple accents
- Social icons with purple hover states

## Images
**Critical images needed**:
1. Hero: Panoramic gaming arena shot with dramatic purple LED lighting
2. About: Professional gaming setup, modern interior
3. Zone cards: Individual gaming stations (RTX-powered PCs, mechanical keyboards)
4. Events: Tournament action shots, teams competing
5. Gallery: 8-12 varied shots of club atmosphere, equipment, events

## Animations
**Minimal, purposeful animations**:
- Fade-in on scroll for section reveals
- Glow pulse on CTAs
- Smooth hover transitions (200-300ms)
- NO distracting particle effects or excessive motion

## Special Effects
- Subtle scanline texture overlay on sections
- Purple gradient overlays on images
- Neon glow borders on interactive elements
- Glassmorphism for floating UI elements

## Accessibility
- Maintain 4.5:1 contrast ratio despite dark theme
- Focus states with visible purple outlines
- Keyboard navigation support
- Alt text for all images

**Design Philosophy**: Bold, immersive, tech-forward aesthetic that communicates premium gaming experience while maintaining clarity and usability.