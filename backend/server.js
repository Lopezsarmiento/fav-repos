require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const axios = require("axios"); // Make sure axios is installed: npm install axios
const cors = require("cors"); // Make sure cors is installed: npm install cors

const app = express();
const port = process.env.PORT || 3001;

// Middleware
// Ensure FRONTEND_URL in .env is correct (e.g., http://localhost:5173)
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json()); // To parse JSON request bodies from your frontend

// Endpoint to exchange GitHub code for an access token
app.post("/api/auth/github/exchange-token", async (req, res) => {
  const { code, code_verifier } = req.body; // Code & verifier from frontend

  // Validate inputs
  if (!code) {
    return res
      .status(400)
      .json({ error: "Authorization code is missing from request body." });
  }
  if (!code_verifier) {
    return res
      .status(400)
      .json({ error: "Code verifier is missing from request body." });
  }
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    console.error("GitHub Client ID or Secret is not configured in .env");
    return res.status(500).json({ error: "Server configuration error." });
  }

  try {
    // Prepare data for GitHub token exchange (x-www-form-urlencoded)
    const params = new URLSearchParams();
    params.append("client_id", process.env.GITHUB_CLIENT_ID);
    params.append("client_secret", process.env.GITHUB_CLIENT_SECRET);
    params.append("code", code);
    params.append("redirect_uri", process.env.GITHUB_REDIRECT_URI); // GitHub may validate this
    params.append("code_verifier", code_verifier); // Required for PKCE

    const githubResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      params, // axios will send this as x-www-form-urlencoded if Content-Type is set
      {
        headers: {
          Accept: "application/json", // Crucial: Ask GitHub for a JSON response
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Forward relevant parts of GitHub's response to your frontend
    // GitHub responds with: access_token, token_type, scope
    res.json({
      access_token: githubResponse.data.access_token,
      scope: githubResponse.data.scope,
      token_type: githubResponse.data.token_type,
    });
  } catch (error) {
    console.error("Error during GitHub token exchange:");
    if (error.response) {
      // Error response from GitHub
      console.error("GitHub Error Data:", error.response.data);
      console.error("GitHub Error Status:", error.response.status);
      res.status(error.response.status || 500).json({
        error: "Failed to exchange GitHub token with GitHub API.",
        details: error.response.data,
      });
    } else if (error.request) {
      // Request was made but no response received from GitHub
      console.error("No response received from GitHub:", error.request);
      res
        .status(500)
        .json({ error: "No response from GitHub token endpoint." });
    } else {
      // Other errors (e.g., setting up the request)
      console.error("Error Message:", error.message);
      res.status(500).json({
        error: "Internal server error setting up GitHub token request.",
      });
    }
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
