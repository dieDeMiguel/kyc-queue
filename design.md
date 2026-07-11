# KYC Operations Design System

## Direction

The interface is an operational workbench: cool-white paper surfaces, dark neutral ink, a compact blue focus accent, square work areas, and rounded badges only for categorical state.

- Geist Sans is the primary interface face; Geist Mono is reserved for identifiers.
- Borders and surface shifts carry hierarchy; shadows are not used.
- Interactive controls have a 44px minimum height and visible focus outlines.
- The queue becomes linked applicant cards below the desktop-table breakpoint.
- The checked-in `tokens.css` file is the source of truth.

## Portable exports

### CSS custom properties

```css
:root {
  --color-paper: oklch(100% 0.004 255);
  --color-paper-2: oklch(98% 0.006 255);
  --color-paper-3: oklch(95% 0.008 255);
  --color-ink: oklch(18% 0.016 255);
  --color-ink-2: oklch(32% 0.018 255);
  --color-muted: oklch(42% 0.018 255);
  --color-neutral: oklch(55% 0.016 255);
  --color-rule: oklch(90% 0.009 255);
  --color-rule-2: oklch(78% 0.012 255);
  --color-accent: oklch(55% 0.22 258);
  --color-accent-ink: oklch(100% 0.004 255);
  --color-focus: oklch(55% 0.22 258);

  --font-display: "Geist", ui-sans-serif, system-ui, sans-serif;
  --font-body: "Geist", ui-sans-serif, system-ui, sans-serif;
  --font-outlier: "Geist Mono", ui-monospace, monospace;

  --space-3xs: 0.25rem;
  --space-2xs: 0.5rem;
  --space-xs: 0.75rem;
  --space-sm: 1rem;
  --space-md: 1.5rem;
  --space-lg: 2rem;
  --space-xl: 3rem;
  --space-2xl: 4rem;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-md: 1rem;
  --text-lg: 1.25rem;
  --text-xl: 1.5rem;
  --text-2xl: 2rem;
  --text-display: 2.5rem;

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-micro: 120ms;
  --dur-short: 220ms;
  --dur-long: 420ms;

  --rule-hair: 1px;
  --rule-fine: 1px;
  --radius-card: 0;
  --radius-pill: 999px;
  --radius-input: 0;
  --shadow-card: none;
}
```

### Tailwind v4

```css
@theme inline {
  --color-paper: var(--kyc-paper);
  --color-paper-2: var(--kyc-paper-2);
  --color-paper-3: var(--kyc-paper-3);
  --color-ink: var(--kyc-ink);
  --color-ink-2: var(--kyc-ink-2);
  --color-muted: var(--kyc-muted);
  --color-neutral: var(--kyc-neutral);
  --color-rule: var(--kyc-rule);
  --color-rule-2: var(--kyc-rule-2);
  --color-accent: var(--kyc-accent);
  --color-focus: var(--kyc-focus);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

### DTCG tokens.json

```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "color": {
    "paper": { "$value": "oklch(100% 0.004 255)", "$type": "color" },
    "paper-2": { "$value": "oklch(98% 0.006 255)", "$type": "color" },
    "paper-3": { "$value": "oklch(95% 0.008 255)", "$type": "color" },
    "ink": { "$value": "oklch(18% 0.016 255)", "$type": "color" },
    "ink-2": { "$value": "oklch(32% 0.018 255)", "$type": "color" },
    "muted": { "$value": "oklch(42% 0.018 255)", "$type": "color" },
    "rule": { "$value": "oklch(90% 0.009 255)", "$type": "color" },
    "rule-2": { "$value": "oklch(78% 0.012 255)", "$type": "color" },
    "accent": { "$value": "oklch(55% 0.22 258)", "$type": "color" },
    "focus": { "$value": "oklch(55% 0.22 258)", "$type": "color" }
  },
  "font": {
    "display": { "$value": "Geist, ui-sans-serif, system-ui, sans-serif", "$type": "fontFamily" },
    "body": { "$value": "Geist, ui-sans-serif, system-ui, sans-serif", "$type": "fontFamily" },
    "outlier": { "$value": "Geist Mono, ui-monospace, monospace", "$type": "fontFamily" }
  },
  "space": {
    "3xs": { "$value": "0.25rem", "$type": "dimension" },
    "2xs": { "$value": "0.5rem", "$type": "dimension" },
    "xs": { "$value": "0.75rem", "$type": "dimension" },
    "sm": { "$value": "1rem", "$type": "dimension" },
    "md": { "$value": "1.5rem", "$type": "dimension" },
    "lg": { "$value": "2rem", "$type": "dimension" },
    "xl": { "$value": "3rem", "$type": "dimension" },
    "2xl": { "$value": "4rem", "$type": "dimension" }
  },
  "duration": {
    "micro": { "$value": "120ms", "$type": "duration" },
    "short": { "$value": "220ms", "$type": "duration" },
    "long": { "$value": "420ms", "$type": "duration" }
  }
}
```

### shadcn/ui variables

```css
:root {
  --background: 100% 0.004 255;
  --foreground: 18% 0.016 255;
  --card: 100% 0.004 255;
  --card-foreground: 18% 0.016 255;
  --popover: 100% 0.004 255;
  --popover-foreground: 18% 0.016 255;
  --primary: 55% 0.22 258;
  --primary-foreground: 100% 0.004 255;
  --secondary: 95% 0.008 255;
  --secondary-foreground: 32% 0.018 255;
  --muted: 90% 0.009 255;
  --muted-foreground: 42% 0.018 255;
  --accent: 55% 0.22 258;
  --accent-foreground: 100% 0.004 255;
  --destructive: 56% 0.2 25;
  --destructive-foreground: 100% 0.004 255;
  --border: 90% 0.009 255;
  --input: 78% 0.012 255;
  --ring: 55% 0.22 258;
  --radius: 0;
}
```
