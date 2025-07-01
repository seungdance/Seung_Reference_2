const { Octokit } = require("@octokit/rest");

exports.handler = async (event, context) => {
  console.log("---- Netlify CMS GitHub Auth ----");
  console.log("HTTP method:", event.httpMethod);

  // Always set CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Handle preflight CORS
  if (event.httpMethod === "OPTIONS") {
    console.log("CORS preflight (OPTIONS) handled");
    return {
      statusCode: 200,
      headers,
      body: "OK",
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    console.log("Rejected: Method Not Allowed");
    return {
      statusCode: 405,
      headers,
      body: "Method Not Allowed",
    };
  }

  console.log("Received POST request");
  try {
    console.log("Request body:", event.body);
    const { code } = JSON.parse(event.body);

    if (!code) {
      console.log("No authorization code provided in body");
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "No authorization code provided" }),
      };
    }

    // Exchange the authorization code for an access token
    console.log("Exchanging code for GitHub access token...");
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json();
    console.log("Token response:", tokenData);

    if (tokenData.error) {
      console.log("GitHub token exchange error:", tokenData.error_description || tokenData.error);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: tokenData.error_description || "GitHub authentication failed" }),
      };
    }

    // Get user information
    console.log("Creating Octokit instance, fetching user...");
    const octokit = new Octokit({
      auth: tokenData.access_token,
    });

    const { data: user } = await octokit.users.getAuthenticated();
    console.log("Authenticated GitHub user:", user.login);

    // Check if user has access to the repository
    const repo = process.env.GITHUB_REPO; // format: "username/repo-name"
    console.log("Repo from ENV:", repo);
    const [owner, repoName] = repo.split("/");

    try {
      console.log(`Checking repo access for: owner=${owner}, repo=${repoName}`);
      await octokit.repos.get({
        owner: owner,
        repo: repoName,
      });
      console.log("User has access to repo.");
    } catch (error) {
      console.log("Repo access denied:", error.message);
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: "Access denied to repository" }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        access_token: tokenData.access_token,
        user: user,
      }),
    };
  } catch (error) {
    console.error("Auth error (outer catch):", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
