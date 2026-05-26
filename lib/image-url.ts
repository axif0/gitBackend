export function getImageUrl(src: string): string {
  if (!src || src.startsWith('http')) return src || '';
  const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER || '';
  const repo = process.env.NEXT_PUBLIC_GITHUB_REPO || '';
  const branch = process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'main';
  if (owner && repo) return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${src}`;
  return src;
}
