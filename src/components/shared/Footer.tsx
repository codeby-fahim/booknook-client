// import Image from 'next/image';
// import React from 'react';

// const Footer = () => {
//   return (
//     <div>
//       <Image src='/booklogo.png' alt='logo' width={50} height={50} ></Image>
//     </div>
//   );
// };

// export default Footer;



import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  ArrowUpRight,
} from "lucide-react";

import { FaFacebook, FaGithub, FaLinkedin ,  } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#173F35] text-white">

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16 lg:px-8">

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">

          {/* Brand Information */}
          <div>
            <Link href="/" className="mb-5 inline-flex items-center gap-2">
              <Image
                src="/booklogo.png"
                alt="BookNook Logo"
                width={48}
                height={48}
                className="object-contain"
              />

              <span className="text-2xl font-bold tracking-tight">
                BookNook<span className="text-[#E8A85C]">.</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-gray-300">
              Your little corner of books. Discover new stories,
              borrow your favorite reads, and share the joy of reading.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              <Link
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-gray-300 transition-all hover:border-[#E8A85C] hover:bg-[#E8A85C] hover:text-[#173F35]"
              >
                <FaGithub size={19} />
              </Link>

              <Link
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-gray-300 transition-all hover:border-[#E8A85C] hover:bg-[#E8A85C] hover:text-[#173F35]"
              >
                
                <FaLinkedin size={19} />
              </Link>

              <Link
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-gray-300 transition-all hover:border-[#E8A85C] hover:bg-[#E8A85C] hover:text-[#173F35]"
              >
                <FaFacebook size={19} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <Link href="/" className="transition-colors hover:text-[#E8A85C]">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/books" className="transition-colors hover:text-[#E8A85C]">
                  All Books
                </Link>
              </li>
              <li>
                <Link href="/books/add" className="transition-colors hover:text-[#E8A85C]">
                  Add a Book
                </Link>
              </li>
              <li>
                <Link href="/my-books" className="transition-colors hover:text-[#E8A85C]">
                  My Books
                </Link>
              </li>
              <li>
                <Link href="/my-borrows" className="transition-colors hover:text-[#E8A85C]">
                  My Borrows
                </Link>
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Explore
            </h3>

            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <Link href="/about" className="transition-colors hover:text-[#E8A85C]">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="transition-colors hover:text-[#E8A85C]">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#why-choose-us" className="transition-colors hover:text-[#E8A85C]">
                  Why Choose Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-[#E8A85C]">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Get in Touch
            </h3>

            <p className="mb-4 text-sm leading-7 text-gray-300">
              Have a question or suggestion? We would love to hear from you.
            </p>

            <a
              href="mailto:hello@booknook.com"
              className="inline-flex items-center gap-2 text-sm text-gray-300 transition-colors hover:text-[#E8A85C]"
            >
              <Mail size={17} />
              hello@booknook.com
              <ArrowUpRight size={15} />
            </a>
          </div>

        </div>

        {/* Bottom Footer */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/20 pt-7 text-center sm:flex-row sm:text-left">

          <p className="text-sm text-gray-300">
            © {new Date().getFullYear()} BookNook. All rights reserved.
          </p>

          <p className="text-sm text-gray-300">
            Made with <span className="text-[#E8A85C]">♥</span> for book lovers.
          </p>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
