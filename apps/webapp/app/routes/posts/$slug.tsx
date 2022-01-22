import { LoaderFunction, useLoaderData } from 'remix';
import { getPost, Post } from '~/post';

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.slug) {
    throw new Error(`slug param does not exist`);
  }
  return getPost(params.slug);
};

export default function PostSlug() {
  const post: Post | string = useLoaderData();
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: typeof post === 'string' ? '' : post.html,
      }}
    ></div>
  );
}
