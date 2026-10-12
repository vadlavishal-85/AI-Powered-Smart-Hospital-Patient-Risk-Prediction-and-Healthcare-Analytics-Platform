# AI Patient Risk Assessment System - Frontend

A modern, scalable hospital-themed clinical intelligence user interface built with **React**, **Vite**, and **JavaScript**.

---

## 🏥 Architecture & Directory Structure

```text
frontend/
├── public/
│   └── images/              # Static clinical logos, icons, and hospital illustrations
├── src/
│   ├── assets/              # SVGs, web fonts, and bundled visual assets
│   ├── components/          # Modular, reusable UI components (Nav, Card, Badges, Modals)
│   ├── pages/               # Top-level page views
│   │   ├── LandingPage.jsx     # Hospital landing overview (Module 2)
│   │   ├── AssessmentPage.jsx  # Clinical parameter intake & evaluation form
│   │   ├── ResultsPage.jsx     # Patient risk stratification & score results
│   │   └── NotFoundPage.jsx    # 404 fallback page
│   ├── data/                # Static constants, assessment question schema, dictionaries
│   ├── services/            # API communication services (REST endpoints)
│   ├── utils/               # Helpers, formatting utilities, validation logic
│   ├── styles/              # Global styling tokens, clinical theme, and typography
│   │   └── index.css
│   ├── App.jsx              # Main application router / starter component
│   └── main.jsx             # React DOM entry point
├── index.html               # HTML5 entry with clinical meta tags and web fonts
├── package.json             # Project dependencies and operational scripts
├── vite.config.js           # Vite development and bundle configuration
└── README.md                # Project documentation
```

---

## 🛠️ Technology Stack

- **Framework**: React 19
- **Bundler & Dev Server**: Vite 6
- **Language**: JavaScript (ES Modules)
- **Styling**: Vanilla CSS with hospital design tokens (clinical blues, slates, and responsive cards)
- **Typography**: Google Fonts (Plus Jakarta Sans)

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (verified on Node v24+)
- **npm**: v9+ (verified on npm v11+)

### 2. Installation
Navigate into the `frontend` directory and install dependencies:
```bash
cd frontend
npm install
```

### 3. Development Server
Start the local Vite development server:
```bash
npm run dev
```

### 4. Production Build
Validate and build the production bundle:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

---

## 📋 Development Roadmap

- [x] **Module 1**: Clean, scalable folder structure & verified Vite starter screen.
- [ ] **Module 2**: Hospital-themed Landing Page design (`LandingPage.jsx`).
- [ ] **Module 3**: Patient Clinical Intake Assessment Form (`AssessmentPage.jsx`).
- [ ] **Module 4**: Model Integration & Risk Stratification Results (`ResultsPage.jsx`).
- [ ] **Module 5**: Polish, validation, and clinical theme enhancements.
