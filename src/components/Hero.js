'use client'

import { ChevronDown } from 'lucide-react'
import { scrollToSection } from '@/lib/utils'
import { personalInfo } from '@/data/portfolio-data'

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative px-6 pt-20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            <span className="text-gradient">
              {personalInfo.name}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 animate-slide-up">
            {personalInfo.title}
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12 animate-slide-up animate-delay-200">
            <button
              onClick={() => scrollToSection('projects')}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              View My Work
            </button>
            <a
              href={personalInfo.resumeFile}
              download
              className="px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-full font-semibold hover:bg-purple-600 hover:text-white transition-all duration-300"
            >
              Download Resume
            </a>
          </div>
          <div className="animate-bounce">
            <ChevronDown className="w-8 h-8 text-gray-400 mx-auto" />
          </div>
        </div>
      </div>
    </section>
  )
}