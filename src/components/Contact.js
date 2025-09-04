"use client";

import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  ExternalLink,
  Send,
} from "lucide-react";
import { personalInfo } from "@/data/portfolio-data";

export default function Contact() {
  return (
    <section
      id="contact"
      className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-t from-purple-50 to-transparent"
    >
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12 text-gradient">
          Let&apos;s Connect
        </h2>
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-5 sm:p-8 md:p-12">
          <p className="text-center text-sm sm:text-base md:text-lg text-gray-700 mb-6 md:mb-8 px-2">
            I&apos;m always excited to work on new projects and collaborate with
            creative minds. Let&apos;s create something amazing together!
          </p>

          {/* Mobile: Stack all items, Desktop: 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Email Card */}
            <a
              href={`mailto:${personalInfo.email}`}
              className="flex items-start sm:items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group"
            >
              <Mail className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 text-purple-600 group-hover:scale-110 transition-transform mt-0.5 sm:mt-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-500 mb-0.5">Email</p>
                <p className="text-gray-700 font-medium text-sm sm:text-base break-all sm:break-words">
                  {personalInfo.email}
                </p>
              </div>
            </a>

            {/* Phone Card */}
            <a
              href={`tel:${personalInfo.phone.replace(/[^0-9+]/g, "")}`}
              className="flex items-start sm:items-center gap-3 p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors group"
            >
              <Phone className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 text-pink-600 group-hover:scale-110 transition-transform mt-0.5 sm:mt-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-500 mb-0.5">Phone</p>
                <p className="text-gray-700 font-medium text-sm sm:text-base">
                  {personalInfo.phone}
                </p>
              </div>
            </a>

            {/* LinkedIn Card */}
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start sm:items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
            >
              <Linkedin className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 text-blue-600 group-hover:scale-110 transition-transform mt-0.5 sm:mt-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-500 mb-0.5">
                  LinkedIn
                </p>
                <p className="text-gray-700 font-medium text-sm sm:text-base">
                  Connect with me
                </p>
              </div>
            </a>

            {/* Location Card */}
            <div className="flex items-start sm:items-center gap-3 p-4 bg-green-50 rounded-xl">
              <MapPin className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 text-green-600 mt-0.5 sm:mt-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-500 mb-0.5">
                  Location
                </p>
                <p className="text-gray-700 font-medium text-sm sm:text-base">
                  {personalInfo.location}
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button - Responsive text and padding */}
          <div className="text-center">
            <a
              href={personalInfo.behance}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm sm:text-base font-semibold hover:scale-105 transition-all duration-300 shadow-lg sm:shadow-xl hover:shadow-2xl w-auto"
            >
              View Full Portfolio <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
