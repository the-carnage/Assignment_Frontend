# Assignment Workflow Portal - Frontend

This is the frontend for the Assignment Workflow Portal, built with React (Vite) and TailwindCSS.

## Features
- **Role-Based Dashboard**: A single login page redirects users to either the Teacher or Student dashboard based on their role.
- **Teacher Workflow**:
  - View all assignments with status filtering (All, Draft, Published, Completed) and pagination.
  - Create and edit assignments, managing their state through the lifecycle: Draft -> Published -> Completed.
  - Delete draft assignments.
  - View all student submissions for a specific assignment and mark them as reviewed.
- **Student Workflow**:
  - View only 'Published' assignments.
  - Visual indicators for Past Due assignments or Completed submissions.
  - Submit a text-based answer to an assignment (only once per assignment).
- **Responsive Design**: Styled with TailwindCSS to provide a clean and intuitive user experience.

## Tech Stack
- **React 18**: Built using Vite setup.
- **Redux Toolkit**: Used for global state management (Authentication/User state).
- **React Router v6**: Used for role-based protected routing.
- **TailwindCSS**: Used for utility-first styling.
- **Axios**: Used for API calls, featuring an interceptor to automatically attach JWT tokens.

## Prerequisites
- Node.js (v14 or higher)
- npm

## Setup & Running Locally

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Ensure Backend is Running**
   Ensure the backend repository is running on `http://localhost:5000` (this is the default URL expected by the frontend API utility).

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## Assumptions
- The frontend assumes the backend API is running locally on port 5000. This is configured in `src/utils/api.js`.
- The UI follows a clean, simple, layout matching modern dashboard paradigms.
