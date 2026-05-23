# Hoahwa WIRO-layout MVP — Scaffold Contract

## Routes (MVP)

| Route | Page |
|-------|------|
| `/` | Homepage (10 sections) |
| `/audits` | Audit services |
| `/shopify-theme-builds` | Build services |
| `/growth-retainers` | Growth services |
| `/contact` | Contact |

## `navigation.ts` schema

- `pillars[]`: `{ id, label, href, children: { label, href }[] }`
- `secondaryLinks[]`: `{ label, href }`
- `headerLinks[]`: visible without menu open
- `footerCompany[]`, `footerServices[]`

## Design tokens

- Font: Inter (Google)
- `--hoahwa-bg`: #0c0c0c
- `--hoahwa-surface`: #141414
- `--hoahwa-accent`: #c8f542
- `--hoahwa-text`: #f5f5f5
- `--hoahwa-muted`: #a3a3a3
- Container: `max-w-7xl` (1280px)

## `data-testid` (control-ui)

- `site-header`, `menu-toggle`, `mega-menu`, `mega-menu-back`
- `mega-panel-audit|build|growth`
- `case-carousel`, `services-accordion`, `testimonials-marquee`
- `contact-form`
