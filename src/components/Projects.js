'use client'

import { useState } from 'react'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { projects } from '@/data/portfolio-data'

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null)

  return (
    <section id="projects" className="py-20 px-6 bg-gradient-to-b from-transparent to-purple-50/50">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl font-bold text-center mb-12 text-gradient">
          Featured Work
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {projects.filter(p => p.featured).map((project, index) => (
            <div
              key={project.id}
              className="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:scale-105 transition-all duration-500 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`h-48 bg-gradient-to-r ${project.color} opacity-90`} />
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-semibold text-purple-600">{project.category}</span>
                  <span className="text-sm text-gray-500">{project.stats}</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                <button 
                  onClick={() => setSelectedProject(project)}
                  className="flex items-center text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                >
                  View Details <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setSelectedProject(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className={`h-32 bg-gradient-to-r ${selectedProject.color} relative`}>
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 text-white hover:scale-110 transition-transform"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-3xl font-bold mb-4">{selectedProject.title}</h3>
              <p className="text-gray-600 mb-6">{selectedProject.longDescription}</p>
              <div className="flex flex-wrap gap-2">
                {selectedProject.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}