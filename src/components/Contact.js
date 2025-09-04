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
      className="py-20 px-6 bg-gradient-to-t from-purple-50 to-transparent"
    >
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl font-bold text-center mb-12 text-gradient">
          Let&apos;s Connect
        </h2>
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <p className="text-center text-lg text-gray-700 mb-8">
            I&apos;m always excited to work on new projects and collaborate with
            creative minds. Let&apos;s create something amazing together!
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <a
              href={`mailto:${personalInfo.email}`}
              className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group"
            >
              <Mail className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-700 font-medium">
                  {personalInfo.email}
                </p>
              </div>
            </a>

            <a
              href={`tel:${personalInfo.phone.replace(/[^0-9+]/g, "")}`}
              className="flex items-center gap-4 p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors group"
            >
              <Phone className="w-6 h-6 text-pink-600 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-700 font-medium">
                  {personalInfo.phone}
                </p>
              </div>
            </a>

            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
            >
              <Linkedin className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-sm text-gray-500">LinkedIn</p>
                <p className="text-gray-700 font-medium">Connect with me</p>
              </div>
            </a>

            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
              <MapPin className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="text-gray-700 font-medium">
                  {personalInfo.location}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a
              href={personalInfo.behance}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              View Full Portfolio <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
