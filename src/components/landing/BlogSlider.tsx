'use client';

import { useState } from 'react';
import { animate, motion, useMotionValue } from 'motion/react';
import { Link } from 'next-view-transitions';

import type { BlogPostPreview } from '@/types/blog';

const CARD_WIDTH = 320;
const GAP = 24;
const STEP = CARD_WIDTH + GAP;

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function BlogSlider({ posts }: { posts: BlogPostPreview[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const x = useMotionValue(0);

  const atStart = currentIndex === 0;
  const atEnd = currentIndex >= posts.length - 1;

  function handlePrev() {
    if (atStart) return;
    const next = currentIndex - 1;
    setCurrentIndex(next);
    animate(x, -next * STEP, { type: 'spring', bounce: 0.1 });
  }

  function handleNext() {
    if (atEnd) return;
    const next = currentIndex + 1;
    setCurrentIndex(next);
    animate(x, -next * STEP, { type: 'spring', bounce: 0.1 });
  }

  return (
    <section id="blogs" className="py-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-secondary text-sm">Featured</p>
          <h2 className="text-2xl font-bold">Blogs</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={atStart}
            aria-label="Previous"
            className={`w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors duration-150 ${atStart ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 12L6 8l4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={handleNext}
            disabled={atEnd}
            aria-label="Next"
            className={`w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors duration-150 ${atEnd ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <motion.div style={{ x }} className="flex flex-row gap-6">
          {posts.map((post, index) => {
            const { frontmatter, slug } = post;
            const tag = frontmatter.tags?.[0] ?? frontmatter.tag ?? 'Blog';
            const num = String(index + 1).padStart(2, '0');

            return (
              <Link key={slug} href={`/blog/${slug}`} className="block shrink-0 w-[320px] h-[260px]">
                <div className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6">
                  <span className="pointer-events-none absolute right-4 top-2 select-none text-6xl font-bold leading-none text-muted-foreground/10">
                    {num}
                  </span>

                  <div className="flex flex-col gap-2 z-10">
                    <span className="w-fit rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
                      {tag}
                    </span>
                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
                      {frontmatter.title}
                    </h3>
                    <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                      {frontmatter.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span>{formatDate(frontmatter.date)}</span>
                      {frontmatter.readTime && (
                        <>
                          <span>·</span>
                          <span>{frontmatter.readTime}</span>
                        </>
                      )}
                    </div>
                    <span className="shrink-0 text-xs font-medium text-foreground/70">
                      Read →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </motion.div>

        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-linear-to-l from-background to-transparent" />
      </div>
    </section>
  );
}
