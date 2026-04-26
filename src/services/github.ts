import { config } from '../config/github';

export async function createPost(
slug: string,
content: string,
title: string)
: Promise<{success: boolean;error?: string;}> {
  try {
    const path = `${config.CONTENT_PATH}/${slug}/index.md`;
    const url = `https://api.github.com/repos/${config.GITHUB_OWNER}/${config.GITHUB_REPO}/contents/${path}`;

    // Base64 encode content (handling UTF-8)
    const encodedContent = btoa(unescape(encodeURIComponent(content)));

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${config.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Add post: ${title}`,
        content: encodedContent,
        branch: config.BRANCH
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create post');
    }

    return { success: true };
  } catch (error) {
    console.error('GitHub API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}