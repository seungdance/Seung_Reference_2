const { Octokit } = require("@octokit/rest");

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const { code } = JSON.parse(event.body);

    if (!code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No authorization code provided" }),
      };
    }

    // Exchange the authorization code for an access token
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

    if (tokenData.error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: tokenData.error_description || "GitHub authentication failed" }),
      };
    }

    // Get user information
    const octokit = new Octokit({
      auth: tokenData.access_token,
    });

    const { data: user } = await octokit.users.getAuthenticated();

    // Check if user has access to the repository
    const repo = process.env.GITHUB_REPO; // format: "username/repo-name"
    const [owner, repoName] = repo.split("/");

    try {
      await octokit.repos.get({
        owner: owner,
        repo: repoName,
      });
    } catch (error) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: "Access denied to repository" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        access_token: tokenData.access_token,
        user: user,
      }),
    };
  } catch (error) {
    console.error("Auth error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
