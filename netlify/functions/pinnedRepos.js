// netlify/functions/pinnedRepos.js

exports.handler = async () => {
  const query = `
    query {
      user(login: "sid2364") {
        pinnedItems(first: 6, types: [REPOSITORY]) {
          edges {
            node {
              ... on Repository {
                name
                description
                url
                stargazerCount
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // We'll use an environment variable for your GitHub token
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'GitHub API request failed' })
      };
    }

    const data = await response.json();

    // Extract just the pinned repos
    const pinned = data.data.user.pinnedItems.edges.map(edge => edge.node);

    return {
      statusCode: 200,
      body: JSON.stringify(pinned) // return array of pinned repos
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};

