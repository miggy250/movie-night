import React from 'react';
import { Mail, Phone, Film, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Ink+Free&display=swap"
        rel="stylesheet"
      />
      <footer className="bg-black border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Branding */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg">
              <Film className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold italic bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent" style={{ fontFamily: 'Ink Free, cursive' }}>
                themovienightscorps
              </h3>
              <p className="text-gray-500 text-sm italic" style={{ fontFamily: 'Ink Free, cursive' }}>
                Powered by inganjicorps
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <a
              href="mailto:miguelinganji@gmail.com"
              className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors group"
            >
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-red-600/20 transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-sm">miguelinganji@gmail.com</span>
            </a>
            
            <a
              href="tel:+250795166720"
              className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors group"
            >
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-red-600/20 transition-colors">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-sm">+250 795 166 720</span>
            </a>

            <a
              href="https://www.instagram.com/themovienightscorps/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors group"
            >
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-red-600/20 transition-colors">
                <Instagram className="w-5 h-5" />
              </div>
              <span className="text-sm">@themovienightscorps</span>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-gray-600 text-sm italic">
            © {new Date().getFullYear()} themovienightscorps. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
    </>
  );
}
