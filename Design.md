# Design Specification Document (Design.md) — ArgueScan

## 1. Design Philosophy & Absolute Constraints

ArgueScan features a high-contrast, text-centric, minimalist design system. It reads like an editorial essay page, utilizing ample white space, thin clean borders, and flat design layouts.

### 1.1 Structural Color Ban Constraint

* **CRITICAL POLICY:** Blue accents, tones, highlights, text links, and hover states are strictly prohibited from this design system ($0\%$ inclusion).
* **Core Contrast Base:** Focuses on pure monochromatic grays, warm charcoal, and raw eggshell tones to keep the focus entirely on text content.

---

## 2. Palettes & Mode Specifications

### 2.1 Light Mode Sheet (Editorial Cream)

Designed for clean reading environments under ambient or daylight setups.

* **Primary App Background:** `#FAF8F5` (Warm Alabaster / Fine Eggshell)
* **Secondary Container Layer:** `#FFFFFF` (Pure White Content Panels)
* **Primary Text Layer:** `#1A1A1A` (Deep Off-Black)
* **Secondary Text / Metadata:** `#6E6D6A` (Muted Granite Gray)
* **Structural Lines / Dividers:** `#E5E2DD` (Soft Clay Border Gray)
* **Active Interactable Hover States:** `#F0ECE3` (Slightly Deepened Cream Fill)

### 2.2 Dark Mode Sheet (Monolith Charcoal)

Designed for low-glare, dark browsing scenarios.

* **Primary App Background:** `#121212` (Pure Matte Obsidian)
* **Secondary Container Layer:** `#1E1E1E` (Raised Charcoal Surface)
* **Primary Text Layer:** `#EAEAEA` (Crisp Off-White)
* **Secondary Text / Metadata:** `#999999` (Mid-Tone Silver Gray)
* **Structural Lines / Dividers:** `#2D2D2D` (Deep Slate Border)
* **Active Interactable Hover States:** `#2A2A2A` (Raised Charcoal Highlight)

---

## 3. Fallacy In-Line Highlight Overlays

When a logical fallacy is matched, the background fill opacity must remain highly transparent ($12\%$ to $15\%$ alpha maximum) to ensure high text legibility without causing visual clutter.

### 3.1 Stylized Accent Fills (Shared Modes)

* **Ad Hominem (Personal Attack):**
* Background Tint: `rgba(235, 94, 85, 0.12)` (Soft Coral Red)
* Left Edge Border Accent: `3px solid #EB5E55`


* **Fear-Mongering (Appeal to Catastrophe):**
* Background Tint: `rgba(244, 162, 97, 0.12)` (Muted Warm Amber)
* Left Edge Border Accent: `3px solid #F4A261`


* **False Dilemma (Binary Choice Manipulation):**
* Background Tint: `rgba(214, 122, 111, 0.12)` (Dusty Terracotta)
* Left Edge Border Accent: `3px solid #D67A6F`


* **Strawman (Misrepresentation):**
* Background Tint: `rgba(138, 166, 131, 0.12)` (Desaturated Sage Green)
* Left Edge Border Accent: `3px solid #8AA683`



---

## 4. UI Component Layout Specifications

### 4.1 Extension Popup Panel Layout (`popup.html`)

The popup dimension footprint is locked to an exact profile size of **320px width** by **400px height** maximum to prevent browser viewport scaling anomalies.

```text
┌────────────────────────────────────────┐
│  ArgueScan                             │ <── Header Text (#1A1A1A / #EAEAEA)
├────────────────────────────────────────┤
│  STATUS                        [ O N ] │ <── Toggle Box: Flat Monochromatic
├────────────────────────────────────────┤
│  SENSITIVITY THRESHOLD                 │
│  [─────────────────●───────────────]   │ <── Flat Slider: Track (#E5E2DD / #2D2D2D)
│  Value: 55%                            │
├────────────────────────────────────────┤
│  RHETORIC COMPOSITION                  │
│  Objective Logic   █████████████  70%  │ <── Pure HTML/CSS Bar Charts
│  Ad Hominem        ███            15%  │     (Using Fallacy Accent Tints)
│  Fear-Mongering    ██             15%  │
└────────────────────────────────────────┘

```

### 4.2 Hover Tooltip Box Styles (`content.css`)

The tooltip window is injected directly adjacent to the hover target coordinates via absolute coordinate positioning.

```css
/* Shared Base Tooltip Style */
.as-hover-tooltip {
  position: absolute;
  z-index: 2147483647; /* Enforce global layout priority */
  max-width: 260px;
  padding: 10px 14px;
  border-radius: 4px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 11px;
  line-height: 1.4;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  transition: opacity 0.2s ease-in-out;
}

/* Light Mode Context Theme */
.as-light-theme .as-hover-tooltip {
  background-color: #FAF8F5;
  color: #1A1A1A;
  border: 1px solid #E5E2DD;
}

/* Dark Mode Context Theme */
.as-dark-theme .as-hover-tooltip {
  background-color: #1E1E1E;
  color: #EAEAEA;
  border: 1px solid #2D2D2D;
}

/* Sub-elements inside the tooltip */
.as-tooltip-title {
  font-weight: 600;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.as-tooltip-score {
  font-size: 10px;
  color: #6E6D6A; /* Light mode secondary grey fallback */
}
.as-dark-theme .as-tooltip-score {
  color: #999999; /* Dark mode secondary silver fallback */
}

```