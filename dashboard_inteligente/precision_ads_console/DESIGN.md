---
name: Precision Ads Console
colors:
  surface: '#faf9fd'
  surface-dim: '#dbd9dd'
  surface-bright: '#faf9fd'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f7'
  surface-container: '#efedf1'
  surface-container-high: '#e9e7eb'
  surface-container-highest: '#e3e2e6'
  on-surface: '#1a1b1e'
  on-surface-variant: '#414754'
  inverse-surface: '#2f3033'
  inverse-on-surface: '#f1f0f4'
  outline: '#727785'
  outline-variant: '#c1c6d6'
  surface-tint: '#005bc0'
  primary: '#005bbf'
  on-primary: '#ffffff'
  primary-container: '#1a73e8'
  on-primary-container: '#ffffff'
  inverse-primary: '#adc7ff'
  secondary: '#006e2a'
  on-secondary: '#ffffff'
  secondary-container: '#8ffa9b'
  on-secondary-container: '#00752d'
  tertiary: '#805600'
  on-tertiary: '#ffffff'
  tertiary-container: '#a06d00'
  on-tertiary-container: '#0a0400'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc7ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#004493'
  secondary-fixed: '#8ffa9b'
  secondary-fixed-dim: '#73dc82'
  on-secondary-fixed: '#002108'
  on-secondary-fixed-variant: '#00531e'
  tertiary-fixed: '#ffddb0'
  tertiary-fixed-dim: '#ffba45'
  on-tertiary-fixed: '#281800'
  on-tertiary-fixed-variant: '#614000'
  background: '#faf9fd'
  on-background: '#1a1b1e'
  surface-variant: '#e3e2e6'
typography:
  headline-xl:
    fontFamily: Roboto Flex
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Roboto Flex
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.005em
  headline-lg-mobile:
    fontFamily: Roboto Flex
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
  headline-md:
    fontFamily: Roboto Flex
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
  headline-sm:
    fontFamily: Roboto Flex
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 22px
  body-lg:
    fontFamily: Roboto Flex
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Roboto Flex
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: Roboto Flex
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Roboto Flex
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Roboto Flex
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.015em
  label-sm:
    fontFamily: Roboto Flex
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
  metric-display:
    fontFamily: Roboto Flex
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.02em
  metric-table:
    fontFamily: Roboto Flex
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-dense: 0.5rem
  margin: 1.5rem
  margin-mobile: 0.75rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
  space-2xl: 2rem
---

## Brand & Style

The design system establishes a high-performance, enterprise-grade digital advertising management workspace. Drawing deeply from modern analytical productivity consoles, the aesthetic merges the utility of Google Material 3 with the dense, information-rich operational rigor demanded by media buyers, performance marketers, and growth agencies.

The core design movement is **Corporate / Modern Data Utility**: razor-sharp visual hygiene, purposeful contrast, high spatial economy, and instant legibility. The interface minimizes decorative friction in favor of scannable metrics, predictable spatial hierarchies, and rapid-fire workflows. The emotional response evoked is absolute control, fiscal precision, and algorithmic transparency—empowering operators to monitor thousands of metrics, orchestrate automated campaigns, and review AI-driven optimization scores with unerring confidence.

## Colors

The palette reproduces the definitive color taxonomy of enterprise ad infrastructure, where color serves strict semantic functions rather than purely decorative accents.

### Palette Roles & Application
- **Primary (`#1A73E8`)**: Google Blue anchors key actions, system selection states, active tab indicators, and progress bars. Hover states transition to `#1557D4`, while subtle interactive fills and active selection surfaces utilize light container blue (`#E8F0FE`).
- **Secondary / Success (`#1E8E3E`)**: Google Green communicates positive variance, qualified campaign status (`Qualificada`), high health indices, and profitable ROAS trends. Surfaces leverage `#E6F4EA` for tags and score highlights.
- **Tertiary / Warning (`#F9AB00`)**: Google Amber flags cautionary states, budget caps nearing depletion, pending asset reviews, and pacing bottlenecks. Subtle warning containers resolve to `#FEF7E0`.
- **Destructive / Error (`#D93025`)**: Google Red indicates rejected ads, exhausted budgets, conversion tracking failures, and paused-with-error statuses. Fill containers resolve to `#FCE8E6`.
- **Neutral Surface Foundations**:
  - Main App Canvas: `#F8F9FA`
  - Cards & Workspace Panels: `#FFFFFF`
  - Active/Hover Rows, Toolbars & Chip Backgrounds: `#F1F3F4`
  - Hairline Dividers & Data Table Borders: `#E8EAED`
- **Text & Foreground Hierarchy**:
  - Primary text: `#202124` (optimal readability for dense tables and figures)
  - Secondary metadata & column headers: `#5F6368`
  - Disabled states, hints, and structural icons: `#80868B`

## Typography

Typography is calibrated for maximum tabular clarity and rapid vertical scanning. `Roboto Flex` is employed across display, body, and label roles to unify Google's systematic product vernacular while leveraging variable mechanical precision.

- **Tabular Figures**: All numerical metrics, currency values, ROAS percentages, and table cells must apply open-type tabular lining (`tnum`, `lnum`) to ensure uniform column stacking across financial records.
- **Micro-Hierarchy**: Primary metric readings utilize `metric-display` (24px/600) for instant identification in dashboard cards. Table row cells lean on `body-md` (13px/400) and `metric-table` (13px/500) to balance compact row heights (36px–40px) with fatigue-free readability during protracted sessions.
- **Section Headers & Overlines**: Navigation labels, table headers, and status flags operate via `label-md` and `label-sm` with slight positive tracking to ensure fast spatial orientation.

## Layout & Spacing

The layout model is anchored by a dense, structured multi-pane productivity canvas:

1. **Top Application Bar**: Fixed 56px height housing the platform identity, multi-tier account switcher (`GrowthOps AI - 948-231-4012`), global metric search, date range selector (`Últimos 30 dias`), and account utility controls.
2. **Dual-Tier Navigation Sidebar**:
   - *Primary Rail (Collapsed or Icon + Title, 64px–200px)*: High-level domains (Campanhas, Grupos de anúncios, Palavras-chave, Públicos-alvo, Automações IA, CRM, Concorrentes).
   - *Secondary Context Rail (Optional expand, 200px)*: Campaign hierarchy trees and sub-views.
3. **Main Operational Stage**:
   - **Scorecard Metric Carousel/Grid**: Fixed 5-column horizontal strip displaying key performance indicators (Cliques, Impressões, Custo médio, Conversões, Taxa de conv.) stacked directly above visualization sparklines.
   - **Secondary Sub-Navigation Tabs**: 44px height container with active 3px `#1A73E8` underline for context switching (Visão geral, Recomendações, Campanhas, Configurações).
   - **Data Dense Matrix Table**: Full-width fluid table with sticky headers, multi-select action bars, column customizers, and paginators.

### Breakpoints & Adaptability
- **Desktop Wide (≥1440px)**: Persistent dual navigation, 5-scorecard metrics strip, full 12+ column tabular view.
- **Desktop Compact (1024px–1439px)**: Primary navigation auto-collapses to an icon rail (64px); scorecard metrics adopt horizontal scroll with 5 snapping columns.
- **Tablet & Below (<1024px)**: Drawers replace persistent side rails; data tables enable horizontal swipe pinning the campaign name/checkbox column.

## Elevation & Depth

Visual hierarchy prioritizes crisp planar segregation through surface tint contrast and sharp 1px borders rather than heavy atmospheric drops.

- **Surface Layers**:
  - `Canvas`: `#F8F9FA` acts as the recessed working plane.
  - `Level 1 (Default Containers & Table Body)`: `#FFFFFF` surface with a continuous 1px `#E8EAED` border.
  - `Level 2 (Dropdowns, Account Switchers, Date Pickers)`: `#FFFFFF` elevation pairing a 1px `#DADCE0` outline with a precise ambient shadow: `0 1px 3px 0 rgba(60,64,67, 0.3), 0 4px 8px 3px rgba(60,64,67, 0.15)`.
  - `Level 3 (Modal Dialogs & Campaign Launchers)`: Centered elevated surface with `0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.2)`.
- **Low-Contrast Separation**:
  - In scorecard strips and table cells, spatial boundaries are delineated strictly with vertical borders in `#E8EAED` without drop shadows, keeping data density crisp and preventing visual blurring.

## Shapes

The design system maintains a pragmatic, low-radius curvature model (`roundedness: 1`), conveying enterprise discipline and optimizing available screen pixels for high information density.

- **Default Radius (`0.25rem` / 4px)**: Buttons, text input boxes, dropdown selectors, recommendation alerts, table cell tags, and scorecard outline borders.
- **Medium Structural Radius (`0.5rem` / 8px)**: Floating utility sheets, dialog containers, and AI recommendation insight cards.
- **Full Radius (Pill / 9999px)**: Reserved strictly for data status badges (`Qualificada`, `Em escala`, `Pausada`), account avatars, and filter chips.

## Components

### 1. Primary & Action Buttons
- **`+ Nova campanha`**: Blue fill `#1A73E8`, white text `#FFFFFF`, height 36px, horizontal padding 16px, radius 4px. Icon `+` preceding label. Hover fill `#1557D4`. Active fill `#174EA6`.
- **Secondary Outlined Button**: 1px `#DADCE0` border, white background, `#1A73E8` text. Hover background `#F8FAFD`.
- **Dense Table Action Button**: Height 28px, text-only or light icon, hover background `#F1F3F4`.

### 2. Scorecard Metric Tiles
- Horizontal modular card row.
- **Card Anatomy**: Total width auto-distributed; 12px 16px padding; 1px `#E8EAED` outer boundary.
- Top label in `label-sm` (`#5F6368`), main metric in `metric-display` (`#202124`), secondary trend percentage with inline sparkline indicator (upward green `#1E8E3E`, downward red `#D93025`).
- Selected card state exhibits a top active border indicator (3px solid `#1A73E8`) with subtle container background `#F8FAFD`.

### 3. Status Pills
- **Pill Geometry**: Height 22px, padding 2px 8px, border-radius 9999px, typography `label-sm`.
- **Qualificada / Ativa**: `#E6F4EA` fill, `#137333` label, 6px green solid circle dot prefix.
- **Em escala**: `#E8F0FE` fill, `#1A73E8` label, lightning/sparkle micro-icon prefix.
- **Pausada**: `#F1F3F4` fill, `#5F6368` label, pause micro-icon prefix.
- **Reprovada / Erro**: `#FCE8E6` fill, `#C5221F` label, alert icon prefix.

### 4. AI Recommendation Card
- **Surface**: Subtle linear boundary with gradient accent (`#1A73E8` to `#4285F4` top border 2px), `#FFFFFF` fill, radius 8px, padding 16px.
- **Score Badge**: Circular or pill progress marker showing optimization score (e.g., `94.2%`) in bold green `#1E8E3E`.
- **Actions**: Direct inline "Aplicar tudo" primary button and "Ver recomendações" text button.

### 5. Data Tables
- **Header Row**: Height 40px, background `#F8F9FA`, bottom border 1px `#E8EAED`, text `label-md` (`#5F6368`), sort arrows visible on hover/active.
- **Data Rows**: Height 44px (dense mode 36px), border-bottom 1px `#E8EAED`, hover background `#F8FAFD`.
- **Sticky Column**: Checkbox selection and Campaign Name remain fixed during horizontal table scroll.

### 6. Inputs & Selectors
- **Account Switcher & Search Bar**: Integrated into the header; flat `#F1F3F4` resting background, 36px height, radius 4px. Focus transitions to `#FFFFFF` with 1px `#1A73E8` outline and subtle floating panel.
- **Date Range Picker**: Displays calendar icon, dynamic label `Últimos 30 dias`, dropdown chevron. Border 1px `#DADCE0`, height 32px, text `#3C4043`.
- **Checkboxes**: 18px square, `#5F6368` border unchecked; `#1A73E8` fill with sharp white checkmark when checked.