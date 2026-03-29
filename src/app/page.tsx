
import Container from '@/components/common/Container';
import About from '@/components/landing/About';
import Blog from '@/components/landing/Blog';
import Contact from '@/components/landing/Contact';
import GithubClient from '@/components/landing/GithubClient';
import Hero from '@/components/landing/Hero';
import MyWorkSection from '@/components/landing/MyWorkSection';
import { getPublishedBlogPosts } from '@/lib/blog';
import React from 'react';

export default function Page(): React.JSX.Element {
  const posts = getPublishedBlogPosts();

  return (
    <Container className="min-h-screen py-10 sm:py-12 md:py-16">
      <Hero />
      <MyWorkSection />
      <About />
      <GithubClient />
      <Blog posts={posts} />
      <Contact />
    </Container>
  );
}
