import path from 'path';
import fs from 'fs/promises';
import parseFrontMatter from 'front-matter';
import { marked } from 'marked';

type PostFile = {
  title: string;
};

export interface Post extends PostFile {
  slug: string;
  html: string;
}

const postsPath = path.join(__dirname, '..', 'posts');

export async function getPost(slug: string): Promise<Post | string> {
  const filepath = path.join(postsPath, slug + '.md');
  try {
    const file = await fs.readFile(filepath);
    const { attributes, body } = parseFrontMatter<PostFile>(file.toString());
    const html = marked(body);
    return { slug, html, title: attributes.title };
  } catch (err) {
    return slug;
  }
}

export async function getPosts() {
  const dir = await fs.readdir(postsPath);
  return Promise.all(
    dir.map<Promise<Post>>(async (filename) => {
      const file = await fs.readFile(path.join(postsPath, filename));

      const { attributes, body } = parseFrontMatter<PostFile>(file.toString());
      const html = marked(body);

      return {
        html,
        slug: filename.replace(/\.md$/, ''),
        title: attributes.title,
      };
    })
  );
}
