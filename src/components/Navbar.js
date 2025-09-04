'use client'

import { useState } from 'react'
import { Menu, X, Download } from 'lucide-react'
import { NAVIGATION_ITEMS } from '@/lib/constants'
import { scrollToSection } from '@/lib/utils'
import { personalInfo } from '@/data/portfolio-data'

export default function Navbar({ scrollY, activeSection }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleNavClick = (item) => {
    scrollToSection(item)
    setIsMenuOpen(false)
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrollY > 50 ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-gradient">
            AM.
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {NAVIGATION_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className={`capitalize transition-all duration-300 hover:text-purple-600 ${
                  activeSection === item ? 'text-purple-600 font-semibold' : 'text-gray-700'
                }`}
              >
                {item}
              </button>
            ))}
            <a
              href={personalInfo.resumeFile}
              download
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-medium hover:scale-105 transition-transform"
            >
              <Download className="w-4 h-4" />
              Resume
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2">
            {NAVIGATION_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className="block w-full text-left py-2 px-4 rounded hover:bg-purple-100 capitalize"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}