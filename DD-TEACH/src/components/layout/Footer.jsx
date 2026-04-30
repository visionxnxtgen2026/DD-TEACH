import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Mail, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-blue-600 text-white mt-16">
      
      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">

        {/* 🧠 BRAND */}
        <div>
          <div className="flex items-center gap-2 text-xl font-bold">
            <BookOpen size={24} />
            <span>DD Teach</span>
          </div>

          <p className="mt-3 text-blue-100 text-sm leading-relaxed">
            Learn Smart. Achieve More. <br />
            Tamil Nadu State Board Learning Platform.
          </p>
        </div>

        {/* 🔗 QUICK LINKS */}
        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>

          <ul className="space-y-2 text-blue-100 text-sm">
            <li>
              <Link to="/" className="hover:text-white transition">
                Home
              </Link>
            </li>

            <li>
              <Link to="/standards" className="hover:text-white transition">
                Standards
              </Link>
            </li>

            <li>
              <Link to="/standard/9th" className="hover:text-white transition">
                Subjects
              </Link>
            </li>
          </ul>
        </div>

        {/* 📞 CONTACT */}
        <div>
          <h3 className="font-semibold mb-3">Contact</h3>

          <div className="flex items-center gap-2 text-blue-100 text-sm">
            <Mail size={16} />
            <a
              href="mailto:support@ddteach.com"
              className="hover:text-white"
            >
              support@ddteach.com
            </a>
          </div>

          <div className="flex items-center gap-2 text-blue-100 text-sm mt-2">
            <Globe size={16} />
            <a
              href="https://github.com/ddteach"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              github.com/ddteach
            </a>
          </div>
        </div>

      </div>

      {/* 🔻 BOTTOM */}
      <div className="border-t border-blue-500 text-center py-4 text-sm text-blue-200">
        © {new Date().getFullYear()} DD Teach. All rights reserved.
      </div>
    </footer>
  );
}