import { BlogFrontmatter, BlogPost, BlogPostPreview } from '@/types/blog';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

const blogDirectory = path.join(process.cwd(), 'src/data/blog');

function parseBlogFrontmatter(data: Record<string, unknown>): BlogFrontmatter | null {
  const title = typeof data.title === 'string' ? data.title : null;
  const description = typeof data.description === 'string' ? data.description : null;
  const date = typeof data.date === 'string' ? data.date : null;

  if (!title || !description || !date) {
    return null;
  }

  return {
    title,
    description,
    date,
    image: typeof data.image === 'string' ? data.image : undefined,
    tags: Array.isArray(data.tags)
      ? data.tags.filter((tag): tag is string => typeof tag === 'string')
      : undefined,
    tag: typeof data.tag === 'string' ? data.tag : undefined,
    readTime: typeof data.readTime === 'string' ? data.readTime : undefined,
    slug: typeof data.slug === 'string' ? data.slug : undefined,
    published: typeof data.published === 'boolean' ? data.published : undefined,
    isPublished:
      typeof data.isPublished === 'boolean' ? data.isPublished : undefined,
    author: typeof data.author === 'string' ? data.author : undefined,
    originalUrl:
      typeof data.originalUrl === 'string' ? data.originalUrl : undefined,
  };
}

function isBlogPostPublished(frontmatter: BlogFrontmatter): boolean {
  return frontmatter.published ?? frontmatter.isPublished ?? false;
}

function getBlogTags(frontmatter: BlogFrontmatter): string[] {
  if (Array.isArray(frontmatter.tags) && frontmatter.tags.length > 0) {
    return frontmatter.tags;
  }

  if (frontmatter.tag) {
    return [frontmatter.tag];
  }

  return [];
}

/**
 * Get all blog post files from the blog directory
 */
export function getBlogPostSlugs(): string[] {
  if (!fs.existsSync(blogDirectory)) {
    return [];
  }

  const files = fs.readdirSync(blogDirectory);
  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

/**
 * Get blog post by slug with full content
 */
export function getBlogPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(blogDirectory, `${slug}.mdx`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Validate frontmatter
    const frontmatter = parseBlogFrontmatter(data as Record<string, unknown>);
    if (!frontmatter) {
      throw new Error(`Invalid frontmatter in ${slug}.mdx`);
    }

    return {
      slug,
      frontmatter,
      content,
    };
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
}

/**
 * Get all blog posts with frontmatter only (for listing page)
 */
export function getAllBlogPosts(): BlogPostPreview[] {
  const slugs = getBlogPostSlugs();

  const posts = slugs
    .map((slug) => {
      const post = getBlogPostBySlug(slug);
      if (!post) return null;

      return {
        slug: post.slug,
        frontmatter: post.frontmatter,
      };
    })
    .filter((post): post is BlogPostPreview => post !== null)
    .sort((a, b) => {
      // Sort by date, newest first
      return (
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
      );
    });

  return posts;
}

/**
 * Get all published blog posts
 */
export function getPublishedBlogPosts(): BlogPostPreview[] {
  const allPosts = getAllBlogPosts();
  return allPosts.filter((post) => isBlogPostPublished(post.frontmatter));
}

/**
 * Get blog posts by tag
 */
export function getBlogPostsByTag(tag: string): BlogPostPreview[] {
  const publishedPosts = getPublishedBlogPosts();
  return publishedPosts.filter((post) =>
    getBlogTags(post.frontmatter).some(
      (postTag) => postTag.toLowerCase() === tag.toLowerCase(),
    ),
  );
}

/**
 * Get all unique tags from published posts
 */
export function getAllTags(): string[] {
  const publishedPosts = getPublishedBlogPosts();
  const tagsMap = new Map<string, string>();

  publishedPosts.forEach((post) => {
    getBlogTags(post.frontmatter).forEach((tag) => {
      const normalizedTag = tag.toLowerCase();
      if (!tagsMap.has(normalizedTag)) {
        tagsMap.set(normalizedTag, tag);
      }
    });
  });

  return Array.from(tagsMap.values()).sort((a, b) => a.localeCompare(b));
}

/**
 * Get related posts based on tags (excluding the current post)
 */
export async function getRelatedPosts(
  currentSlug: string,
  maxPosts = 3,
): Promise<BlogPostPreview[]> {
  const currentPost = await getBlogPostBySlug(currentSlug);
  if (!currentPost || !isBlogPostPublished(currentPost.frontmatter)) {
    return [];
  }

  const allPosts = getPublishedBlogPosts();
  const currentTags = getBlogTags(currentPost.frontmatter).map((tag) =>
    tag.toLowerCase(),
  );

  // Calculate relevance score based on shared tags
  const postsWithScore = allPosts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => {
      const sharedTags = getBlogTags(post.frontmatter).filter((tag) =>
        currentTags.includes(tag.toLowerCase()),
      );
      return {
        post,
        score: sharedTags.length,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return postsWithScore.slice(0, maxPosts).map((item) => item.post);
}
