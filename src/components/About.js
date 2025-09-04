"use client";

import { about } from "@/data/portfolio-data";

export default function About() {
  return (
    <section id="about" className="py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl font-bold text-center mb-12 text-gradient">
          About Me
        </h2>
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 backdrop-blur-lg bg-opacity-90">
          {about.description.map((paragraph, index) => (
            <p
              key={index}
              className="text-lg text-gray-700 leading-relaxed mb-6"
            >
              {index === 1 && (
                <>
                  {
                    paragraph.split(
                      "Nataraj Colour Pencils series (10, 12, and 24 colours)"
                    )[0]
                  }
                  {
                    paragraph.split(
                      "Nataraj Colour Pencils series (10, 12, and 24 colours)"
                    )[1]
                  }
                </>
              )}
              {index !== 1 && paragraph}
            </p>
          ))}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {about.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
