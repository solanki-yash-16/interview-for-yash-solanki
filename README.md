# SpaceX Launch Dashboard

## Overview

The **SpaceX Launch Dashboard** is a React-based web application that displays information about SpaceX launches, fetched from the [SpaceX API](https://github.com/r-spacex/SpaceX-API/). Users can filter launches by date range and status (all, upcoming, successful, or failed), view detailed launch information in a modal, and explore related data such as rockets, launchpads, and payloads. The application is styled with Tailwind CSS and uses Vite as the build tool for fast development and optimized production builds.

## Features

- **Launch Table**: Displays a list of SpaceX launches with details like flight number, name, date, and status.
- **Date Range Picker**: Filter launches by preset date ranges (e.g., past week, past month) or a custom date range.
- **Status Filter**: Filter launches by status (all, upcoming, successful, or failed).
- **Launch Details Modal**: View detailed information about a selected launch, including rocket, launchpad, and payload data.
- **Responsive Design**: Optimized for both desktop and mobile devices using Tailwind CSS.
- **Loading and Error States**: Handles API loading states and errors gracefully with user-friendly feedback.

## Technologies Used

- **React**: Frontend library for building the user interface.
- **TypeScript**: Adds static typing for better code reliability and developer experience.
- **Vite**: Build tool for fast development and optimized production builds.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **date-fns**: Library for date manipulation and formatting.
- **Lucide React**: Icon library for UI components.
- **SpaceX API**: Provides launch, rocket, launchpad, and payload data.

## Project Structure
```
├── public/
├── src/
│    |── api/
│       │── axios.ts
│       │── spacex-api.ts
│   ├── assets/
│   │   └── Logo.png
│   ├── components/
│   │   │── DateRangePicker.tsx
│   │   ├── EmptyState.tsx 
│   │   ├── LaunchModal.tsx
│   │   ├── LaunchTable.tsx
│   │   ├── LoadingSpinner.tsx
│   │   │── StatusBadge.tsx
│   │   └── StatusFilter.tsx 
│   │── pages/
│       └── Dashboard.tsx
│   ├── types/
│   │   └── launch.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
│── env.example
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```


## 🚀 Installation & Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project name
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 🎯 Usage Guide

### Getting Started
1. **View Launches**: On load, the dashboard fetches and displays all SpaceX launches, sorted by date (newest first). By default, it shows all launches ("All Time").

2. **Filter by Date**: 
 - Use the DateRangePicker to select a preset range (e.g., "Past 6 Months", "All Time") or choose "Custom Range" to pick specific start and end dates.
 - The calendar interface allows intuitive date selection.

3. **Filter by Status**: Use the StatusFilter dropdown to filter launches by status: All, Upcoming, Successful, or Failed.

4. **View Launch Details**: Click on a launch in the table to open a modal with detailed information, including rocket, launchpad, and payload data.

5. **Handle Errors**: If the API fails, an error message is displayed with a "Try Again" button to retry fetching data.


## Configuration for Default "All Time" Filter
The application is configured to show all launches by default using the "All Time" date filter. This is implemented by:
  - Setting the initial dateRange state in App.tsx to { start: null, end: null, option: 'all-time' }.
  - Adding all-time to the DateFilterOption type in types/launch.ts.
  - Updating DateRangePicker.tsx to include all-time in dateOptions and handle it in getDateRangeForOption to return { start: null, end: null }.
  - Modifying the filteredLaunches logic in App.tsx to skip date filtering when option is all-time.

To revert to the original "Past 6 Months" default, update the dateRange state in App.tsx to { start: null, end: null, option: 'past-6-months' } and adjust the DateRangePicker props accordingly.