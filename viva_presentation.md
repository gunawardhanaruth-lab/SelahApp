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
*   **Secondary Runtime:** PHP 8.0 (User Feedback Module).
*   **Framework:** Express.js (Node) + Native PHP.
*   **Architecture:** Hybrid "Sidecar" pattern (Node on port 3000, PHP on port 8000).
*   **Authentication:** `bcryptjs` (Hashing), `express-session` (Session management).

**Frontend:**
*   **Languages:** HTML5, CSS3, Vanilla JavaScript.
*   **Design:** Custom responsive CSS (Flexbox/Grid), no heavy frameworks (moved away from Next.js for simplicity).

**Database:**
*   **System:** MySQL (Relational Database).
*   **Driver:** `mysql2` library for Node.js.

**External APIs:**
*   **YouTube Data API:** Fetches relevant worship songs dynamically.

---

## Slide 4: System Architecture
*   **Client-Server Model:** The browser (Client) sends HTTP requests to the Node.js Server.
*   **RESTful API:** The server exposes endpoints like `/api/moods`, `/api/login`, and `/api/register`.
*   **Data Layer:** The server queries the MySQL database for structured data (Users, Moods, Verses).
*   **Proxy Pattern:** The server acts as a proxy for the YouTube API requests to secure the API Key.

---

## Slide 5: Key Features
1.  **Mood-Based Content:** Users select a mood, and the app retrieves specific database verses and YouTube videos.
2.  **Role-Based Access Control (RBAC):**
    *   **Guest:** Public access to home and mood selection.
    *   **Registered User:** Personalized experience (Login/Logout).
    *   **Admin:** Access to a guarded Admin Dashboard for content management.
3.  **Secure Authentication:**
    *   Hashed passwords (security best practice).
    *   Session-based login persistence.

---

## Slide 6: Database Design
**Core Tables:**
1.  **`users`**: Stores ID, Name, Email, Password (Hashed), and Role ('user' or 'admin').
2.  **`moods`**: Stores Mood Name, Emoji, and YouTube Search Keywords.
3.  **`verses`**: Stores Scripture Text and Reference, linked to `moods` via Foreign Key.

*Relationship:* One Mood has many Verses (1:N relationship).

---

## Slide 7: Implementation Highlights
**Migration to Node/Express:**
*   Initially explored Next.js but migrated to a pure Node/Express architecture for the Viva.
*   **Benefit:** Clear separation of concerns, easier to demonstrate core routing logic and database interactions during the presentation.

**Security:**
*   Implemented `bcrypt` comparison for login.
*   Protected routes (Middleware check for `req.session.role`).

---

## Slide 8: Application Demo
*(Placeholder for you to show the live app)*
*   **Step 1:** Show Home Page & Moods (Guest Access).
*   **Step 2:** Register a new user account.
*   **Step 3:** Login as User -> Show "Logout" button.
*   **Step 4:** Login as Admin -> Show "Admin Panel".
*   **Step 5:** Demonstrate data retrieval (Verses & YouTube Video) on a Mood Dashboard.

---

## Slide 9: Future Improvements
*   **User Preferences:** Allow users to save favorite verses.
*   **Journaling:** Add a feature for users to write reflections on specific moods.
*   **Mobile App:** Convert the responsive web app into a React Native mobile application.

---

## Slide 10: Conclusion & Q&A
*   **Summary:** Selah successfully demonstrates a full-stack web application with database integration, external API usage, and secure user management.
*   **Thank You.**
