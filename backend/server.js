require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Endpoint to exchange GitHub code for an access token
app.post("/api/auth/github/exchange-token", async (req, res) => {
  const { code, code_verifier } = req.body;

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
    const params = new URLSearchParams();
    params.append("client_id", process.env.GITHUB_CLIENT_ID);
    params.append("client_secret", process.env.GITHUB_CLIENT_SECRET);
    params.append("code", code);
    params.append("redirect_uri", process.env.GITHUB_REDIRECT_URI);
    params.append("code_verifier", code_verifier);

    const githubResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      params,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.json({
      access_token: githubResponse.data.access_token,
      scope: githubResponse.data.scope,
      token_type: githubResponse.data.token_type,
    });
  } catch (error) {
    console.error("Error during GitHub token exchange:");
    if (error.response) {
      console.error("GitHub Error Data:", error.response.data);
      console.error("GitHub Error Status:", error.response.status);
      res.status(error.response.status || 500).json({
        error: "Failed to exchange GitHub token with GitHub API.",
        details: error.response.data,
      });
    } else if (error.request) {
      console.error("No response received from GitHub:", error.request);
      res
        .status(500)
        .json({ error: "No response from GitHub token endpoint." });
    } else {
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
