# EcoVision — Requirements

## 1. Functional Requirements

### 1.1 Carbon Footprint Assessment
- FR1.1 Users shall complete a multi-step carbon footprint assessment covering: transportation, diet, energy usage, and shopping habits.
- FR1.2 The system shall calculate a carbon score (0–100) and monthly footprint (kg CO₂).
- FR1.3 The system shall display a breakdown of the footprint by category.
- FR1.4 Assessment results shall persist across app restarts via AsyncStorage.
- FR1.5 Users shall be able to retake the assessment at any time.

### 1.2 Dashboard
- FR2.1 The home screen shall display the user's current eco score using an animated ring.
- FR2.2 The home screen shall show the user's carbon footprint value.
- FR2.3 The home screen shall display the active challenge and latest achievement.
- FR2.4 The home screen shall have buttons to start assessment and scan waste.
- FR2.5 The dashboard shall update when the user navigates back to it.

### 1.3 Waste Scanner
- FR3.1 Users shall be able to take a photo using the device camera.
- FR3.2 Users shall be able to pick an image from the device gallery.
- FR3.3 The system shall classify the waste object and return: object name, category, impact level, and disposal suggestion.
- FR3.4 Scan results shall be saved to a history list.
- FR3.5 The scanner shall display past scan results.

### 1.4 AI Coach
- FR4.1 Users shall receive personalized sustainability suggestions based on their eco score.
- FR4.2 Users shall see eco challenges with progress tracking.
- FR4.3 Users shall be able to mark challenges as complete.
- FR4.4 Completing a challenge shall award an achievement.
- FR4.5 Achievements shall be displayed on the coach screen and profile.

### 1.5 Carbon Reduction Simulator
- FR5.1 Users shall toggle improvement options (e.g., switch to bike, go vegetarian).
- FR5.2 The simulator shall show real-time projected footprint and score.
- FR5.3 A before/after comparison chart shall display the reduction.

### 1.6 User Profile
- FR6.1 Users shall see their total eco points, scan count, assessment count, and badge count.
- FR6.2 Users shall be able to set and edit their username.
- FR6.3 Users shall be able to clear all app data.
- FR6.4 Users shall see all unlocked achievements.

### 1.7 Backend API
- FR7.1 `POST /api/assessment` — Accept transport, food, energy, shopping. Return score, footprint, breakdown.
- FR7.2 `POST /api/scan` — Accept image upload. Return object, category, impact, suggestion.
- FR7.3 `POST /api/coach` — Accept score and category. Return suggestions list.

## 2. Non-Functional Requirements

### 2.1 Platform
- NFR1.1 Target platform: Android APK via Expo managed workflow.
- NFR1.2 Compatible with React Native 0.76+ and Expo SDK 52.

### 2.2 Performance
- NFR2.1 Assessment calculation shall complete in under 2 seconds.
- NFR2.2 The app shall launch and show the home screen within 5 seconds.
- NFR2.3 Mock fallback responses shall return within 1 second.

### 2.3 Usability
- NFR3.1 All screens shall have a consistent green theme (#2E7D32 primary).
- NFR3.2 The app shall use card-based layouts with rounded corners and shadows.
- NFR3.3 Navigation shall use a bottom tab bar with emoji icons.
- NFR3.4 Pull-to-refresh shall be available on dashboard, coach, and scanner screens.

### 2.4 Storage
- NFR4.1 User data shall persist via AsyncStorage.
- NFR4.2 Storage keys shall use `ecovision_` prefix.
- NFR4.3 Scan history shall be capped at 50 entries.
- NFR4.4 Achievement history shall be capped at 100 entries.

### 2.5 Offline / Resilience
- NFR5.1 The app shall function without a backend by falling back to mock data.
- NFR5.2 API failures shall not crash the app; mock data shall be served instead.

## 3. Technical Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React Native (Expo SDK 52) |
| Language | TypeScript 5.3 |
| Navigation | React Navigation 7 (bottom tabs) |
| HTTP Client | Fetch API |
| Local Storage | AsyncStorage |
| Charts | react-native-chart-kit |
| Backend Framework | FastAPI (Python 3.14) |
| Object Detection | YOLOv8 Nano (placeholder) |
| AI Suggestions | Google Gemini (placeholder) |
| Build Target | Android APK |

## 4. Architecture

```
┌──────────────────────┐     ┌──────────────────────┐
│   Expo React Native  │     │    FastAPI Backend    │
│                      │     │                      │
│  ┌────────────────┐  │     │  ┌────────────────┐  │
│  │  Screens (6)   │  │     │  │  Routes (3)    │  │
│  │  Components(5) │  │     │  │  Models        │  │
│  │  Services (4)  │  │     │  │  AI Modules    │  │
│  │  Data (2)      │  │     │  │  (placeholder) │  │
│  └────────────────┘  │     │  └────────────────┘  │
│         │            │     │         │            │
│  AsyncStorage        │     │  YOLO/Gemini SDK      │
└──────────────────────┘     └──────────────────────┘
         │                            │
         └───────── HTTP ─────────────┘
```

## 5. Data Flow

```
Assessment Flow:
  User → AssessmentScreen → calculateFootprint() → AsyncStorage
                                                    → API → Backend
  HomeScreen ← getLastAssessment() ← AsyncStorage

Scan Flow:
  User → ScannerScreen → Camera/Gallery → postScan() → Backend
  Result → AsyncStorage → History list

Coach Flow:
  User → CoachScreen → getAdvice() → postCoach() → Backend
                                                  → Mock fallback
  Challenges ← AsyncStorage
  Achievements ← AsyncStorage
```

## 6. API Contracts

### POST /api/assessment
**Request:**
```json
{ "transport": "bike", "food": "mixed", "energy": 5, "shopping": "medium" }
```
**Response:**
```json
{ "score": 68, "footprint": 145, "breakdown": { "transport": 40, "food": 30, "energy": 20, "shopping": 10 } }
```

### POST /api/scan
**Request:** `multipart/form-data` with field `image`
**Response:**
```json
{ "object": "bottle", "category": "Plastic Waste", "impact": "Medium", "suggestion": "Recycle in plastic bin" }
```

### POST /api/coach
**Request:**
```json
{ "score": 68, "category": "Plastic Waste" }
```
**Response:**
```json
{ "suggestions": ["Use reusable bottles", "Recycle correctly", "Avoid bottled water"] }
```

## 7. File Structure

```
EcoVision/
├── App.tsx
├── package.json
├── app.json
├── tsconfig.json
├── babel.config.js
├── REQUIREMENTS.md
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── AssessmentScreen.tsx
│   │   ├── ScannerScreen.tsx
│   │   ├── CoachScreen.tsx
│   │   ├── SimulatorScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── components/
│   │   ├── CarbonCard.tsx
│   │   ├── EcoScore.tsx
│   │   ├── ChallengeCard.tsx
│   │   ├── AchievementCard.tsx
│   │   └── ChartCard.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── assessment.ts
│   │   ├── scanner.ts
│   │   └── coach.ts
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   ├── data/
│   │   ├── carbonFactors.ts
│   │   └── challenges.ts
│   └── utils/
│       └── (empty)
└── backend/
    ├── requirements.txt
    ├── main.py
    ├── routes/
    │   ├── assessment.py
    │   ├── scanner.py
    │   └── coach.py
    ├── models/
    │   └── carbon.py
    └── ai/
        ├── yolo.py
        └── gemini.py
```

## 8. Carbon Calculation

| Category | Options | Emission Factor |
|---|---|---|
| Transport | bike=0, public=20, car=50, plane=80 | kg CO₂/day |
| Food | vegan=10, vegetarian=20, mixed=40, meat-heavy=70 | kg CO₂/day |
| Energy | 0.5 per kWh × 30 days | kg CO₂/month |
| Shopping | minimal=10, low=25, medium=50, high=100 | kg CO₂/month |

**Score:** `100 - (totalFootprint / 300 × 100)`, clamped to 0–100.

## 9. Waste Categories

| Category | Color | Example Items |
|---|---|---|
| Plastic | #FF6B6B | Bottles, bags, containers |
| Paper | #4ECDC4 | Newspaper, cardboard, office paper |
| Glass | #45B7D1 | Jars, bottles |
| Metal | #96CEB4 | Cans, foil, scrap |
| Organic | #8BC34A | Food scraps, yard waste |
| E-Waste | #FF9800 | Phones, laptops, batteries |
| Textile | #9C27B0 | Clothing, fabric |
| Hazardous | #F44336 | Chemicals, paint, batteries |
| Mixed | #78909C | Multi-material items |

## 10. Definition of Done

- [x] Assessment flow works (4-step form → score → save)
- [x] Carbon score generated (0–100 scale)
- [x] Dashboard shows latest score and footprint
- [x] Camera scan can pick from gallery or camera
- [x] Waste category returned with impact and suggestion
- [x] AI coach returns recommendations based on score
- [x] Challenges visible with progress tracking
- [x] Achievements visible when challenges complete
- [x] Simulator shows projected reductions in real time
- [x] Profile shows stats and badges
- [x] Backend API responds to all 3 endpoints
- [x] App works standalone with mock data fallback
- [x] Pull-to-refresh on data screens
- [x] Consistent green theme across all screens
