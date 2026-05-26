import { Octokit } from '@octokit/rest';
import { Product } from '@/types/product';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const owner = process.env.GITHUB_OWNER!;
const repo = process.env.GITHUB_REPO!;
const branch = process.env.GITHUB_BRANCH || 'main';

const PRODUCTS_PATH = 'data/products.json';
const IMAGES_DIR = 'public/images';

async function getFileSha(path: string): Promise<string | undefined> {
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path, ref: branch });
    if ('sha' in data) return data.sha;
    return undefined;
  } catch {
    return undefined;
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: PRODUCTS_PATH,
      ref: branch,
    });
    if ('content' in data) {
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      return JSON.parse(content) as Product[];
    }
    return [];
  } catch {
    return [];
  }
}

export async function saveProducts(products: Product[]): Promise<void> {
  const sha = await getFileSha(PRODUCTS_PATH);
  const content = Buffer.from(JSON.stringify(products, null, 2)).toString('base64');

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: PRODUCTS_PATH,
    message: `Update products - ${new Date().toISOString()}`,
    content,
    sha,
    branch,
  });
}

export async function uploadImage(filename: string, base64Data: string): Promise<string> {
  const path = `${IMAGES_DIR}/${filename}`;
  const sha = await getFileSha(path);

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message: `Upload image: ${filename}`,
    content: base64Data,
    sha,
    branch,
  });

  return `public/images/${filename}`;
}

export async function deleteImage(filename: string): Promise<void> {
  const path = `${IMAGES_DIR}/${filename}`;
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path, ref: branch });
    if ('sha' in data) {
      await octokit.repos.deleteFile({
        owner,
        repo,
        path,
        message: `Delete image: ${filename}`,
        sha: data.sha,
        branch,
      });
    }
  } catch {
    // Image doesn't exist, ignore
  }
}
