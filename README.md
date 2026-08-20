# Hafiza Binte Waheed — Quran Academy

A premium, animation-driven one-page marketing site for an online Hifz & Tajweed academy. Built with vanilla HTML/CSS/JS, a Three.js WebGL hero scene, and GSAP-powered scroll interactions — no framework, no build step.

🔗 **Live site:** [hafizabintewaheed.com](https://hafizabintewaheed.com)

![Status](https://img.shields.io/badge/status-live-brightgreen)
![No Build Step](https://img.shields.io/badge/build-none-blue)
![License](https://img.shields.io/badge/license-Proprietary-lightgrey)

---

## ✨ Features

- **3D animated hero** — a Three.js starfield, floating geometric rings, and a crescent moon, scroll-linked via GSAP ScrollTrigger and reactive to mouse movement
- **Buttery smooth scrolling** — powered by [Lenis](https://github.com/darkroomengineering/lenis)
- **Scroll-triggered reveals** — text split/char/word animations (SplitType), fade/pop/curtain reveals, animated stat counters
- **Horizontal-scroll course selector** — 4 pinned course cards (Kids' Tajweed, Female Tajweed, Group Hifz, Private 1:1 Hifz)
- **Infinite testimonials carousel** — touch/drag support, keyboard navigation, responsive card count (1–4 visible)
- **Interactive "Find My Course" quiz section**
- **Gallery** with curtain-reveal image transitions
- **Free resources section** linking to a Gumroad/store front
- **Newsletter signup** ("Qur'an Fridays") wired to Kit (ConvertKit)
- **Custom cursor, magnetic buttons, noise overlay, mobile hamburger menu** with animated overlay
- Fully responsive, `prefers-reduced-motion` support baked in

---

## 🛠️ Tech Stack

| Purpose | Library |
|---|---|
| 3D hero scene | [Three.js](https://threejs.org/) r134 |
| Scroll animations | [GSAP](https://gsap.com/) + ScrollTrigger |
| Smooth scroll | [Lenis](https://github.com/darkroomengineering/lenis) |
| Text splitting | [SplitType](https://github.com/lukePeavey/SplitType) |
| Icons | [Font Awesome](https://fontawesome.com/) 6.5 |
| Fonts | Domine, Noto Sans, Amiri (Google Fonts) |

All third-party libraries are loaded via CDN (`cdnjs`, `jsdelivr`) — there's no `package.json` or bundler involved.

---

## 📁 Project Structure

```
.
├── index.html              # Single-page markup — all sections live here
├── css/
│   ├── style.css           # Base styles, layout, design tokens (CSS custom properties)
│   └── animations.css      # Scroll-reveal, carousel, cursor & micro-interaction styles
├── js/
│   ├── three-scene.js      # WebGL hero scene (stars, rings, crescent, scroll-linked camera)
│   ├── animations.js       # GSAP ScrollTrigger reveals, Lenis init, cursor, counters
│   └── main.js             # Navbar, mobile menu, testimonials carousel, newsletter form
├── assets/
│   └── images/              # class1–4.png, Profile.JPEG (referenced with graceful onerror fallback)
└── automation/              # FastAPI webhook service — see "Backend Automation" below
    └── main.py               # (filename placeholder — update to match your actual script)
```

> **Note:** `assets/images/` is expected but not included in this repo snapshot — add your own images at the paths referenced in `index.html`, or the `img-fallback` class will silently degrade the layout.

---

## 🔁 Backend Automation (Enrollment + Newsletter)

Alongside the static frontend, a small **FastAPI** service handles two automated workflows, triggered by incoming webhooks (e.g. a Google Form submission via Apps Script / Zapier / Make pointed at this endpoint):

1. **Enrollment notifications** — when a student submits one of the course registration forms (Kids' Tajweed, Female Tajweed, Group Hifz, Private 1:1 Hifz), the service sends an **SMTP email** notification so enrollment is picked up immediately instead of relying on manually checking form responses.
2. **Newsletter sync** — when someone subscribes via the site's newsletter form (`handleNewsletterSubmit()` in `js/main.js`), the corresponding webhook payload is forwarded to the **Kit (ConvertKit) API** to add the subscriber to the "Qur'an Fridays" list.

### Suggested structure

```
automation/
├── main.py              # FastAPI app — webhook route(s), request validation
├── notifier.py          # SMTP email sending logic
├── newsletter.py        # Kit (ConvertKit) API client
├── requirements.txt     # fastapi, uvicorn, python-dotenv, requests, etc.
└── .env.example          # Template for required environment variables
```

### Environment variables

| Variable | Purpose |
|---|---|
| `SMTP_HOST` / `SMTP_PORT` | Outgoing mail server for enrollment notifications |
| `SMTP_USER` / `SMTP_PASSWORD` | SMTP auth credentials |
| `NOTIFY_TO_EMAIL` | Where enrollment alerts get sent (Hafiza's inbox) |
| `KIT_API_KEY` / `KIT_API_SECRET` | Kit (ConvertKit) API credentials |
| `KIT_FORM_ID` | Target Kit form/list ID for newsletter subscribers |
| `WEBHOOK_SECRET` | (Recommended) Shared secret to verify incoming webhook requests |

### Running locally

```bash
cd automation
pip install -r requirements.txt
cp .env.example .env   # fill in SMTP + Kit credentials
uvicorn main:app --reload --port 8001
```

### Wiring it up

- Point your Google Form (or a Zapier/Make/Apps Script relay watching the form's response sheet) at the deployed webhook URL, e.g. `POST https://your-domain.com/webhook/enroll`.
- Point the site's newsletter form submission (or a relay in front of Kit) at `POST https://your-domain.com/webhook/newsletter` — or skip the relay entirely and call the Kit API directly from `js/main.js` if you'd rather not run a backend for this part.

> ⚠️ **This section describes the intended architecture (FastAPI + SMTP + Kit API), not a specific file in this snapshot** — no Python script was included in the current upload. Once you add the actual automation code to the repo, swap the paths/filenames above to match, and fill in real endpoint routes, request/response payload shapes, and any retry/error-handling behavior the script implements.

---

## 🚀 Getting Started

No build tools, no `npm install`. Just serve the folder.

```bash
# Clone the repo
git clone https://github.com/<your-username>/hafiza-binte-waheed.git
cd hafiza-binte-waheed

# Serve locally (any static server works)
npx serve .
# or
python3 -m http.server 8000
```

Then open `http://localhost:8000` (or whichever port your server prints).

> Opening `index.html` directly via `file://` will work for most content, but some browsers block ES features or lazy-loaded assets under `file://` — a local server is recommended.

---

## ⚙️ Configuration

A few values are hardcoded in the JS and should be updated for your own deployment:

| What | File | Location |
|---|---|---|
| Newsletter signup endpoint | `js/main.js` | `subscribeUrl` in `handleNewsletterSubmit()` — currently points to a Kit (ConvertKit) form |
| Registration form links | `index.html` | Google Forms URLs on each course card / footer |
| Social links | `index.html` | Footer `.social-links` |
| Brand colors | `css/style.css` | `:root` CSS custom properties (`--pink-*`, `--gold`, `--beige-*`) |
| Canonical URL / SEO meta | `index.html` | `<head>` — `og:title`, `og:description`, `canonical` |

---

## 🌐 Browser Support

Targets evergreen browsers (Chrome, Safari, Firefox, Edge — current and previous major versions). Relies on WebGL for the hero scene; on unsupported browsers the `three-scene.js` script simply no-ops (`if (typeof THREE === 'undefined') return;`) and the rest of the page still functions.

---

## 📄 License

© 2025 Hafiza Binte Waheed. All rights reserved. This code is proprietary — please don't reuse the content, branding, or images without permission. Feel free to reference the animation/architecture patterns for your own learning.
