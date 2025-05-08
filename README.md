# My Favorite Repos App

## Project Description

This is a single-page web application built with React (Frontend) and Node.js/Express (Backend) that allows users to:

1.  **Sign Up & Login:** Create an account and log in using a local username/password system (credentials stored in browser's local storage for this demo).
2.  **Connect GitHub Account:** Securely connect their GitHub account using the OAuth 2.0 Authorization Code flow with PKCE.
3.  **View Repositories:** List all repositories owned by the connected GitHub user.
4.  **Manage App-Specific Favorites:** Mark repositories from their list as "favorite" within the application. These favorites are specific to this app and persisted locally. _(Search/Filter functionality to be added)_.

The project uses a monorepo structure with separate `frontend` and `backend` directories.

## Technology Stack

- **Frontend:** React, TypeScript, Vite, React Router, Zustand, Tailwind CSS, Heroicons
- **Backend:** Node.js, Express, Axios, CORS, Dotenv
- **Authentication:** Local Storage (for app login), GitHub OAuth 2.0 with PKCE (for GitHub API access)

## Project Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd my-fav-repos-app-root # Or your repository's root folder name
```

### 2. GitHub OAuth App Setup

To connect to GitHub and fetch repository data, you need to register a GitHub OAuth App:

1.  Go to your GitHub profile settings: [https://github.com/settings/profile](https://github.com/settings/profile)
2.  Navigate to **Developer settings** (bottom of the left sidebar).
3.  Click on **OAuth Apps** on the left.
4.  Click the **"New OAuth App"** button.
5.  Fill in the form:
    - **Application name:** Choose a name (e.g., "My Fav Repos App - Dev").
    - **Homepage URL:** Use your frontend development server URL (e.g., `http://localhost:5173`).
    - **Application description:** Optional (e.g., "App to view and favorite GitHub repos").
    - **Authorization callback URL:** This is crucial. It must match _exactly_ what the application expects. For the default development setup, use: `http://localhost:5173/auth/github/callback`
6.  Click **"Register application"**.
7.  On the next page, you will see your **Client ID**. Keep this page open or copy the Client ID.
8.  Generate a **Client Secret** by clicking the "Generate a new client secret" button. **Copy this secret immediately and store it securely.** You typically won't be able to see it again.

### 3. Environment Variables Setup

You need to create `.env` files for both the frontend and backend to store configuration and credentials.

**a) Backend Environment (`backend/.env`)**

Create a file named `.env` inside the `backend/` directory (`backend/.env`). Add the following content, replacing placeholders with your actual values from the GitHub OAuth App you just created:

```ini
# backend/.env
PORT=3001
GITHUB_CLIENT_ID="YOUR_GITHUB_CLIENT_ID"         # Paste Client ID from GitHub OAuth App settings
GITHUB_CLIENT_SECRET="YOUR_GITHUB_CLIENT_SECRET" # Paste Client Secret from GitHub OAuth App settings
GITHUB_REDIRECT_URI="http://localhost:5173/auth/github/callback" # Should match GitHub App callback URL
FRONTEND_URL="http://localhost:5173"          # Your React app's development URL
```

**IMPORTANT:** Ensure `backend/.env` is listed in your root `.gitignore` file to prevent committing secrets.

**b) Frontend Environment (`frontend/.env`)**

Create a file named `.env` inside the `frontend/` directory (`frontend/.env`). Add the following content, replacing the Client ID placeholder:

```ini
# frontend/.env
VITE_GITHUB_CLIENT_ID="YOUR_GITHUB_CLIENT_ID"         # Paste Client ID from GitHub OAuth App settings
VITE_GITHUB_REDIRECT_URI="http://localhost:5173/auth/github/callback"
VITE_GITHUB_SCOPES="read:user repo public_repo user:email" # Permissions the app requests
```

**Note:** Variables exposed to the Vite frontend _must_ be prefixed with `VITE_`.

### 4. Install Dependencies

You need to install dependencies for both the frontend and backend separately.

```bash
# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 5. Run the Application

Use the combined script from the root directory to start both frontend and backend servers concurrently:

```bash
# From the project root directory (my-fav-repos-app-root/)
npm run dev
```

This command will:

- Start the backend server (likely on `http://localhost:3001`).
- Start the frontend development server (likely on `http://localhost:5173`).
- Open the frontend application in your default browser.

You should see output from both servers interleaved in your terminal. To stop both, press `Ctrl+C`.

## Usage

1.  Open the application in your browser (`http://localhost:5173`).
2.  Sign up for a local account or log in if you already have one.
3.  Navigate to the "Repositories" page.
4.  Click "Connect to GitHub" and authorize the application on the GitHub page you are redirected to.
5.  You should be redirected back to the Repositories page, now displaying your owned GitHub repositories.
6.  Click the star icon next to a repository in the "My Other Repositories" list to mark it as an app-specific favorite. It will move to the "My Favorite Repositories" list. Click the star again to unfavorite it.
