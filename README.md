# EcoVision

A full-stack mobile app for environmental sustainability tracking. Built with **React Native (Expo)** and a **FastAPI** backend.

## Features

- **Carbon Footprint Assessment** — Calculate your environmental impact across transport, food, energy, and shopping
- **AI Waste Scanner** — Upload images for waste classification and recycling guidance (via Expo Camera / Image Picker)
- **Sustainability Coach** — AI-powered tips and personalised action plan
- **Challenges & Achievements** — Gamified sustainability challenges with tracking
- **Charts & Analytics** — Visual progress tracking with `react-native-chart-kit`

## Architecture

```
┌─────────────────┐     ┌──────────────────────┐
│  Expo / React    │     │  FastAPI Backend      │
│  Native App      │────►│  ← assessment         │
│  (iOS + Android) │     │  ← scanner (AI)       │
│                  │     │  ← coach (AI)         │
└─────────────────┘     └──────────────────────┘
```

### Frontend
- **React Native** via Expo SDK 52
- **Navigation:** `@react-navigation/native-stack` + bottom tabs
- **Charts:** `react-native-chart-kit` + `react-native-svg`
- **Camera:** `expo-camera` + `expo-image-picker`

### Backend
- **FastAPI** — Python async REST API
- **Endpoints:**
  - `POST /api/assessment` — Carbon footprint calculation
  - `POST /api/scanner/classify` — AI waste classification via image
  - `POST /api/coach/advice` — Personalised sustainability tips

## Setup

### Backend
```bash
cd EcoVision/backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd EcoVision
npm install
expo start
```

Scan the QR code with Expo Go, or press `a` for Android / `i` for iOS simulator.

## Requirements

See [`REQUIREMENTS.md`](EcoVision/REQUIREMENTS.md) for detailed prerequisites and version compatibility.
