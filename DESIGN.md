---
name: CareerOS
description: Unified learning-to-hiring talent pipeline ecosystem.
colors:
  primary: "#4F46E5"
  accent-emerald: "#10B981"
  neutral-bg: "#F8FAFC"
  neutral-card: "#FFFFFF"
  neutral-border: "#E2E8F0"
  neutral-text-dark: "#0F172A"
  neutral-text-muted: "#64748B"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 800
    lineHeight: 1.2
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "#4338CA"
  button-secondary:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.neutral-text-dark}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  card-default:
    backgroundColor: "{colors.neutral-card}"
    rounded: "{rounded.xl}"
    padding: "24px"
---

# Design System: CareerOS

## 1. Overview

**Creative North Star: "The Verified Ledger"**

The visual language of CareerOS reflects precision, cryptographic proof, and absolute clarity. The entire layout operates as a clean, high-contrast, structured ledger where verified talent achievements are catalogued and matched directly with recruiter criteria. Depth is minimized to focus the user's attention on tabular relationships and progress indicators. 

This system explicitly rejects the generic visual styles defined in PRODUCT.md:
*   No decorative purple-to-indigo gradients.
*   No side-accent borders on cards.
*   No bouncy or soft web animations.
*   No low-contrast text overlays on colored panels.

**Key Characteristics:**
*   Accented Indigo (#4F46E5) and Emerald (#10B981) key colors against a clean, flat paper surface.
*   High informational density with clear tabular card structures.
*   Restrained animations and transitions, responding strictly to user interactions.

## 2. Colors

The color palette is restrained and characterful, relying on deep functional contrast rather than colorful decoration.

### Primary
*   **Deep Indigo** (#4F46E5): Used for main interactive elements, primary button states, and active page states.

### Secondary
*   **Vibrant Emerald** (#10B981): Represents verification status, unlocks, and successful certifications.

### Neutral
*   **Slate Dark** (#0F172A): Primary readable text.
*   **Slate Muted** (#64748B): Subtitles, helper text, and secondary details.
*   **Slate Border** (#E2E8F0): Outlines for input fields, grid panels, and cards.
*   **Slate Paper** (#F8FAFC): Page backgrounds.
*   **Card White** (#FFFFFF): Container backgrounds.

**The Accented Rarity Rule.** Functional accents (Indigo and Emerald) are used on less than 10% of any given screen. Their scarcity ensures instant readability and visual focus.

## 3. Typography

**Display Font:** Inter (with system-ui fallbacks)
**Body Font:** Inter (with system-ui fallbacks)

The typeface pairing is unified under Inter to establish a developer-centric, precise look. Font variations are achieved strictly through font-weight and line-height scale values.

### Hierarchy
*   **Display** (font-weight 800, size 24px, line-height 1.2): Used for primary headers and dashboard greetings.
*   **Headline** (font-weight 700, size 18px, line-height 1.3): Used for card titles and workspace groups.
*   **Title** (font-weight 600, size 14px, line-height 1.4): Used for subheadings and active item highlights.
*   **Body** (font-weight 400, size 14px, line-height 1.5): Standard reading text. Max line length is restricted to 70ch.
*   **Label** (font-weight 650, size 11px, letter-spacing 0.05em, uppercase): Used for tags, micro-badges, and category headers.

## 4. Elevation

The depth system is Flat-By-Default. Surfaces rely on precise borders and light background shading to establish grouping, rather than layered drop shadows.

### Shadow Vocabulary
*   **Modals & Dropdowns** (box-shadow: `0 4px 20px rgba(15, 23, 42, 0.06)`): Subtle ambient shadow used only when elements overlay the main grid context.

**The Flat-By-Default Rule.** Cards and panels sit flat on the slate paper background with a border-slate-200 boundary. Hover states change background fill or border color, never shadow elevation.

## 5. Components

### Buttons
*   **Shape:** Medium corners (8px radius).
*   **Primary:** Indigo fill (#4F46E5) with white text and compact padding.
*   **Hover / Focus:** Shift to indigo-700 (#4338CA) with a subtle outline focus ring.

### Chips
*   **Style:** Very thin border (1px) with solid text and light background fill (e.g. `bg-emerald-50 text-emerald-700 border-emerald-100`).
*   **State:** Verified badges are emerald; action tags are indigo.

### Cards / Containers
*   **Corner Style:** Rounded-xl (16px radius).
*   **Background:** White fill (#FFFFFF).
*   **Border:** Solid outline (1px, `#E2E8F0`).
*   **Internal Padding:** Standard spacing (24px padding).

### Inputs / Fields
*   **Style:** Slate outline border with rounded-md corners (8px radius) and neutral slate-900 typography.
*   **Focus:** Border shifts to deep indigo with no glowing glow effects.

## 6. Do's and Don'ts

### Do:
*   **Do** write high-contrast labels on colored tags (e.g. text-emerald-700 on bg-emerald-50).
*   **Do** separate unrelated blocks using standard borders (#E2E8F0).
*   **Do** keep line-heights snug on displays (1.2) and roomy on body copy (1.5).

### Don't:
*   **Don't** use purple-to-indigo gradients (`from-purple-500`) for headers or components.
*   **Don't** apply vertical left-border accents (`border-l-2`) on cards to indicate state.
*   **Don't** use decorative bounce animations (`animate-bounce`) on static indicators.
*   **Don't** overlay light gray text on light colored backgrounds (e.g., text-slate-500 on bg-amber-50).
