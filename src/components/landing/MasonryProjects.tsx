'use client';

import { projects } from '@/config/Projects';
import { ExternalLink, Github } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

const featuredProjects = [projects[0], projects[1]].filter(
  (project): project is (typeof projects)[number] => Boolean(project),
);

function getCategory(project: (typeof projects)[number]): string {
  return project.technologies.length > 1
    ? `${project.technologies[0]?.name} / ${project.technologies[1]?.name}`
    : (project.technologies[0]?.name ?? 'Web Project');
}

export function ProjectsVerticalFeed() {
  return (
    <section
      id="projects"
      className="flex w-full flex-col items-center px-4 py-16 md:py-24"
    >
      <div className="flex w-full flex-col items-center">
        <div className="mb-10 flex flex-col items-center gap-1 text-center">
          <p className="text-muted-foreground text-sm">Featured</p>
          <h2 className="text-3xl font-bold md:text-4xl">My Work</h2>
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-col gap-5">
          {featuredProjects.map((project, index) => {
            const category = getCategory(project);
            return (
              <motion.div
                key={project.title}
                className="group relative overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] transition-all duration-300"
                whileHover={{
                  y: -8,
                  boxShadow:
                    '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px #4ADE80',
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={
                  index === 0
                    ? { duration: 0.4, delay: 0.3 }
                    : { duration: 0.4, delay: 0.4 }
                }
              >
                {/* Project number badge */}
                <div className="absolute top-5 left-5 z-10 rounded-md bg-[#0D0D0D]/80 px-3 py-1 backdrop-blur-sm">
                  <span className="font-mono text-xs text-white/40">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Image area */}
                <div className="relative h-55 overflow-hidden rounded-t-2xl bg-[#0D0D0D]">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="100vw"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#1A1A1A]/20" />
                </div>

                <div className="space-y-4 p-5">
                  {/* Category tag */}
                  <div className="inline-flex items-center rounded-full border border-[#4ADE80]/20 bg-[#4ADE80]/10 px-3 py-1">
                    <span className="text-xs text-[#4ADE80]">{category}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold tracking-tight text-white">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="line-clamp-2 text-sm leading-relaxed text-white/60">
                    {project.description}
                  </p>

                  {/* Divider */}
                  <div className="h-px bg-[#2A2A2A]" />

                  {/* Footer Buttons */}
                  <div className="flex gap-3">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm text-white transition-all duration-200 hover:border-white/30 hover:bg-white/5"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Live Site</span>
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm text-white transition-all duration-200 hover:border-white/30 hover:bg-white/5"
                      >
                        <Github className="h-4 w-4" />
                        <span>GitHub</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-4 flex justify-center">
          <Link
            href="/projects"
            className="text-muted-foreground flex items-center gap-1 text-sm transition-colors hover:text-white"
          >
            View All Projects
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function MasonryProjects() {
  return <ProjectsVerticalFeed />;
}
