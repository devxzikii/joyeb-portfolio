declare module 'gray-matter' {
  export interface GrayMatterFile {
    data: unknown;
    content: string;
    excerpt?: string;
  }

  export default function matter(
    input: string,
    options?: Record<string, unknown>,
  ): GrayMatterFile;
}
