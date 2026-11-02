
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Books", href: "/books" },
  { name: "Add Book", href: "/books/add" },
  { name: "My Books", href: "/my-books" },
  { name: "My Borrows", href: "/my-borrows" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (pathname === href) return true;

    const hasNestedMatch = pathname.startsWith(`${href}/`);
    if (!hasNestedMatch) return false;

    // Don't highlight a parent route (e.g. /books) when a more specific
    // navigation item (e.g. /books/add) is the active one.
    return !navLinks.some(
      (link) => link.href.startsWith(`${href}/`) && pathname.startsWith(link.href)
    );
  };

  const linkClass = (href: string) =>
    `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActive(href)
        ? "bg-[#173F35]/10 text-[#173F35]"
        : "text-[#252D29] hover:bg-[#173F35]/10 hover:text-[#173F35]"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-[#E7E5DF] bg-[#FAF8F3]/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/booklogo.png"
            alt="BookNook Logo"
            width={44}
            height={44}
            priority
            className="h-11 w-11 object-contain"
          />
          <span className="text-xl font-bold tracking-tight text-[#173F35]">
            BookNook<span className="text-[#E8A85C]">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClass(link.href)}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-[#173F35] transition-colors hover:bg-[#173F35]/10"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-[#173F35] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#102F28]"
          >
            Register
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          className="rounded-lg p-2 text-[#173F35] transition-colors hover:bg-[#173F35]/10 lg:hidden"
        >
          {isOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-[#E7E5DF] bg-[#FAF8F3] px-4 py-4 shadow-lg lg:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={linkClass(link.href)}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-[#E7E5DF] pt-4">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="rounded-lg border border-[#173F35] px-4 py-2.5 text-center text-sm font-semibold text-[#173F35] transition-colors hover:bg-[#173F35]/10"
            >
              Login
            </Link>

            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="rounded-lg bg-[#173F35] px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#102F28]"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
