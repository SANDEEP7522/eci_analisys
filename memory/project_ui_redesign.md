---
name: UI Redesign — Futuristic Dark Mode 2026
description: Complete visual overhaul to ultra-modern glassmorphic dark UI with neon saffron accents, aurora background, and Framer Motion animations
type: project
---

Complete UI redesign applied (2026-03-19) to match futuristic election analytics aesthetic.

**Why:** User requested ultra-modern 2025-2026 design trends — glassmorphism, neon saffron-orange accents (BJP/NDA), tricolor palette, aurora background, and cinematic micro-animations.

**How to apply:** When making future UI changes, maintain this design system:
- Dark background: `#03040d` (ultra deep space)
- Accent color: `#ff6b00` (neon saffron orange) — replaces old teal `#00d4c8`
- INDIA bloc color: `#4f8eff` (electric blue)
- Glass cards: `.glass-card` CSS class (backdrop-blur-24px, white/4% bg, neon orange border on hover)
- Aurora blobs: `.aurora-1`, `.aurora-2`, `.aurora-3` CSS classes in globals.css
- Grid background: `.bg-grid` CSS class
- All cards use `GlassCard` or `NeonStatCard` components (not old `DCard`/`StatCard`)
- Key states use `TiltCard` for 3D perspective tilt on hover (Framer Motion useMotionValue/useTransform/useSpring)
- Coalition race uses inline `CoalitionRaceWidget` with spring-animated bars
- Numbers use `AnimCounter` component (IntersectionObserver + requestAnimationFrame ease-out)
- Navbar: frosted glass with `rgba(3,4,13,0.82)` + `backdrop-filter: blur(28px)`, live clock `LiveClock` component
