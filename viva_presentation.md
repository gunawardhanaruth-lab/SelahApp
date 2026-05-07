# Selah Application - Viva Presentation Content

## Slide 1: Title Slide
**Title:** Selah - A Spiritual Companion Web Application
**Subtitle:** Final Year Project
**Presenter Name:** [Your Name]
**Date:** [Date]

---

## Slide 2: Introduction & Problem Statement
**The Problem:**
*   In a fast-paced world, individuals often struggle to find immediate spiritual comfort tailored to their specific emotional state.
*   Searching for appropriate scripture or worship music manually can be time-consuming and disjointed.

**The Solution - "Selah":**
*   "Selah" is a web-based spiritual companion app.
*   It bridges the gap between emotions and faith by providing curated verses and music based on the user's current mood (e.g., Happy, Anxious, Sad).

---

## Slide 3: Technology Stack
**Backend:**
*   **Primary Runtime:** Node.js (Core Application Logic).
*   **Framework:** Express.js.
*   **Architecture:** 3-Tier Architecture.
*   **Authentication:** `bcryptjs` (Hashing), `express-session` (Session management).

**Frontend:**
*   **Languages:** HTML5, CSS3, Vanilla JavaScript.
*   **Design:** Custom responsive CSS (Flexbox/Grid), no heavy frameworks (moved away from Next.js for simplicity).

**Database:**
*   **System:** Supabase (Cloud PostgreSQL).
*   **Driver:** `@supabase/supabase-js` library.

**External APIs:**
*   **YouTube Data API:** Fetches relevant worship songs dynamically.
*   **Bible API:** Fetches live scripture text dynamically.

---

## Slide 4: System Architecture
*   **Client-Server Model:** The browser (Client) sends HTTP requests to the Node.js Server.
*   **RESTful API:** The server exposes endpoints like `/api/moods`, `/api/login`, and `/api/register`.
*   **Data Layer:** The server queries the Supabase database for structured data (Users, Moods, Verses).
*   **Proxy Pattern:** The server acts as a proxy for the YouTube API requests to secure the API Key.

---

## Slide 5: Cloud Deployment & Hosting
**Hosting the Application:**
*   **Backend & Frontend (Web Service):** Deployed on **Render** (a cloud application hosting platform).
    *   *Why Render?* It provides continuous deployment directly from our GitHub repository and easily runs our Node.js server.
*   **Database Hosting:** Hosted on **Supabase**.
    *   *Why Supabase?* It provides a fully managed, cloud-based PostgreSQL database. It allowed us to move away from a local database to a production-ready cloud environment.

---

## Slide 6: Key Features
1.  **Mood-Based Content:** Users select a mood, and the app retrieves specific database verses and YouTube videos.
2.  **Role-Based Access Control (RBAC):**
    *   **Guest:** Public access to home and mood selection.
    *   **Registered User:** Personalized experience (Login/Logout).
    *   **Admin:** Access to a guarded Admin Dashboard for content management.
3.  **Secure Authentication:**
    *   Hashed passwords (security best practice).
    *   Session-based login persistence.

---

## Slide 7: Database Design
**Core Tables:**
1.  **`users`**: Stores ID, Name, Email, Password (Hashed), and Role ('user' or 'admin').
2.  **`moods`**: Stores Mood Name, Emoji, and YouTube Search Keywords.
3.  **`verses`**: Stores Scripture Text and Reference, linked to `moods` via Foreign Key.

*Relationship:* One Mood has many Verses (1:N relationship).

---

## Slide 8: Code Flow 1 - System Start & DB Connection
**Before a user opens the app, the server runs:**
*   **Server Entry Point (`server.js`):** The heart of the backend.
    *   **Middleware (Lines 13-21):** Configures `cors` (frontend-backend talk), `body-parser` (reading JSON), and `express-session` (remembering logins).
    *   **Port Listening (Line 245):** `app.listen(PORT)` starts the server.
*   **Database Connection (`db.js`):** Connects to Supabase.
    *   Reads `SUPABASE_URL` and `SUPABASE_KEY` from the hidden `.env` file.
    *   Uses `createClient()` to connect and exports this for `server.js` to use.

---

## Slide 9: Code Flow 2 - Registration & Login
**How user authentication works:**
*   **The Frontend (`register.html` & `login.html`):** Uses JavaScript `fetch()` to send email and password to the backend.
*   **Backend Registration (`server.js` - Line 65):**
    *   *Security:* Uses `bcrypt.hash(password, 10)` to encrypt the password.
    *   *Storage:* Saves the user to Supabase `db.from('users').insert(...)`.
*   **Backend Login (`server.js` - Line 34):**
    *   Searches the `users` table. Uses `bcrypt.compare()` to verify the password.
    *   If correct, saves user info in `req.session` (server memory).

---

## Slide 10: Code Flow 3 - The Dashboard
**The Main Feature Flow (Clicking a Mood):**
*   **Step A (Frontend):** `loadDashboard()` runs in `dashboard.html`. Checks URL (`?mood=Peaceful`) and fetches `/api/moods/Peaceful`.
*   **Step B (Backend Verses - Line 118):**
    *   Finds mood in Supabase. Checks if user is logged in (`req.session`).
    *   If logged in, fetches scripture references from DB.
    *   *External API:* Loops through references and calls `bible-api.com` to get live verse text.
*   **Step C (Backend YouTube - Line 184):**
    *   Acts as a proxy `/api/youtube` to hide the API Key from the frontend.
    *   Adds random words (like 'live') to the search so videos change every time.
*   **Step D (Frontend Display):** Injects verses and uses the YouTube IFrame API (`renderVideos()`) to show videos, ensuring only one plays at a time.

---

## Slide 11: Application Demo
*(Placeholder for you to show the live app)*
*   **Step 1:** Show Home Page & Moods (Guest Access).
*   **Step 2:** Register a new user account.
*   **Step 3:** Login as User -> Show "Logout" button.
*   **Step 4:** Login as Admin -> Show "Admin Panel".
*   **Step 5:** Demonstrate data retrieval (Verses & YouTube Video) on a Mood Dashboard.

---

## Slide 12: Future Improvements
*   **User Preferences:** Allow users to save favorite verses.
*   **Journaling:** Add a feature for users to write reflections on specific moods.
*   **Mobile App:** Convert the responsive web app into a React Native mobile application.

---

## Slide 13: Conclusion & Q&A
*   **Summary:** Selah successfully demonstrates a full-stack web application with cloud database integration, external API usage, and secure user management.
*   **Thank You.**
