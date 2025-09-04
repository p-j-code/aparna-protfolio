'use client'

import { experience, education } from '@/data/portfolio-data'
import { Briefcase, GraduationCap } from 'lucide-react'

export default function Experience() {
  return (
    <section id="experience" className="py-20 px-6 bg-gradient-to-b from-transparent to-purple-50/30">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-4xl font-bold text-center mb-12 text-gradient">
          Experience & Education
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Experience */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-purple-600" />
              Work Experience
            </h3>
            {experience.map((job, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg mb-4 hover:shadow-xl transition-shadow">
                <h4 className="text-xl font-semibold text-gray-800">{job.position}</h4>
                <p className="text-purple-600 font-medium">{job.company}</p>
                <p className="text-sm text-gray-500 mb-3">{job.location} • {job.duration}</p>
                <ul className="space-y-2">
                  {job.responsibilities.slice(0, 3).map((resp, idx) => (
                    <li key={idx} className="text-gray-600 text-sm flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Education */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <GraduationCap className="w-6 h-6 text-pink-600" />
              Education
            </h3>
            {education.map((edu, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg mb-4 hover:shadow-xl transition-shadow">
                <h4 className="text-xl font-semibold text-gray-800">{edu.degree}</h4>
                <p className="text-pink-600 font-medium">{edu.institution}</p>
                <p className="text-sm text-gray-500">{edu.location}</p>
                {edu.focus && (
                  <p className="text-sm text-gray-600 mt-2 italic">Focus: {edu.focus}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}