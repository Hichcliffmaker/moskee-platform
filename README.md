# Al-Madrasa Plattforms

Welcome to the **Al-Madrasa Moskee Platform**. A premium educational management system tailored for Mosques and Islamic Schools.

![Status](https://img.shields.io/badge/Status-MVP%20Ready-gold)
![Tech](https://img.shields.io/badge/Built%20With-Next.js-black)

## 📖 Overview

Al-Madrasa provides a digital environment similar to regular school systems (like Magister) but optimized for the specific needs of Quranic education and Mosque management.

### Features

#### 🎓 Education
- **Student Management**: Full profiles with contact info, groups, and status.
- **Class Management**: Orgazination of groups, teachers, and classrooms.
- **Gradebook**: Track progress for Hifz, Tajweed, Fiqh, and more.
- **Attendance**: Quick check-in system for lessons.
- **Homework & Agenda**: Assignment tracking and event calendar.

#### 🕌 Mosque
- **Prayer Times**: Real-time calculation (Aladhan API) + manual offsets.
- **Announcements**: Digital notice board for the community.

#### 👥 Portals
- **Admin Dashboard**: Central control hub.
- **Parent Portal**: Dedicated view for parents to track child progress.

## 🎨 Design

The application features a custom-built **Premium Theme**:
- **Primary Colors**: Deep Emerald Green (`#0a1f18`) & Gold (`#d4af37`).
- **Typography**: 'Outfit' (Modern, clean sans-serif).
- **Interface**: Glassmorphism effects, calming aesthetics, and responsive layout.

## 🚀 Getting Started

This project is built with **Next.js 15**.

### Prerequisites
- Node.js 18+ placed.

### Installation

```bash
# Install dependencies
npm install
```

### Running Locally

```bash
# Start development server
npm run dev
```

Visit `http://localhost:3000` to access the application.

## 📂 Project Structure

```
app/
├── students/       # Student profiles & lists
├── groups/         # Class management
├── grades/         # Grade entry & overview
├── attendance/     # Presence checks
├── prayer-times/   # Salah times widget & page
├── homework/       # Assignment management
├── agenda/         # Events & holidays
├── settings/       # Admin configuration
├── parent-portal/  # Parent view
└── lib/data.ts     # Mock data source
```

## 🛡️ License

Private / Proprietary software for Al-Madrasa.
