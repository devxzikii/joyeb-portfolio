'use client';

import { projects } from '@/config/Projects';
import { ExternalLink, Github } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';

function getCategory(project: (typeof projects)[number]): string {
  return project.technologies.length > 1
    ? `${project.technologies[0]?.name} / ${project.technologies[1]?.name}`
    : (project.technologies[0]?.name ?? 'Web Project');
}

export default function ProjectList() {
  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => {
        const category = getCategory(project);

        return (
          <motion.article
            key={project.title}
            className="group relative overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] transition-all duration-300"
            whileHover={{
              y: -8,
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px #4ADE80',
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <div className="absolute top-5 left-5 z-10 rounded-md bg-[#0D0D0D]/80 px-3 py-1 backdrop-blur-sm">
              <span className="font-mono text-xs text-white/40">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>

            <div className="relative h-55 overflow-hidden rounded-t-2xl bg-[#0D0D0D]">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#1A1A1A]/20" />
            </div>

            <div className="space-y-4 p-5">
              <div className="inline-flex items-center rounded-full border border-[#4ADE80]/20 bg-[#4ADE80]/10 px-3 py-1">
                <span className="text-xs text-[#4ADE80]">{category}</span>
              </div>

              <h3 className="text-xl font-semibold tracking-tight text-white">
                {project.title}
              </h3>

              <p className="line-clamp-2 text-sm leading-relaxed text-white/60">
                {project.description}
              </p>

              <div className="h-px bg-[#2A2A2A]" />

              <div className="flex gap-3">
                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm text-white transition-all duration-200 hover:border-white/30 hover:bg-white/5"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Live Site</span>
                  </a>
                ) : null}

                {project.github ? (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm text-white transition-all duration-200 hover:border-white/30 hover:bg-white/5"
                  >
                    <Github className="h-4 w-4" />
                    <span>GitHub</span>
                  </a>
                ) : null}
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
