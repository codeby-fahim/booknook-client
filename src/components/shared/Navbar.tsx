"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Menu, X } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Books", href: "/books" },
  { name: "Add Book", href: "/add-books" },
  { name: "My Books", href: "/my-books" },
  { name: "My Borrows", href: "/my-borrows" },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const userInitial =
    user?.name?.trim()?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

  // Close the open menu when the viewport crosses the desktop breakpoint.
  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");

    const handleChange = () => {
      if (desktopQuery.matches) {
        setMobileOpen(false);
      } else {
        setAccountOpen(false);
      }
    };

    desktopQuery.addEventListener("change", handleChange);

    return () => desktopQuery.removeEventListener("change", handleChange);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (pathname === href) return true;

    const hasNestedMatch = pathname.startsWith(`${href}/`);
    if (!hasNestedMatch) return false;

    // Don't highlight a parent route (e.g. /books) when a more specific
    // navigation item (e.g. /add-books) is the active one.
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

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);

      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            setMobileOpen(false);
            setAccountOpen(false);
            toast.success("Log out successful!");
            router.push("/sign-in");
            router.refresh();
          },
          onError: (context) => {
            toast.error(context.error.message || "Failed to log out.");
          },
        },
      });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  const userMenu = (
    <Popover open={accountOpen} onOpenChange={setAccountOpen}>
      <PopoverTrigger
        aria-label="Open account menu"
        className="rounded-full outline-none transition focus-visible:ring-2 focus-visible:ring-[#173F35]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF8F3]"
      >
        <Avatar size="lg" className="bg-[#173F35] text-white">
          <AvatarImage
            referrerPolicy="no-referrer"
            src={user?.image ?? undefined}
            alt={user?.name ?? "User"}
          />
          <AvatarFallback className="bg-[#173F35] text-sm font-semibold text-white">
            {userInitial}
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-64 border border-[#E7E5DF] bg-[#FAF8F3] p-3 text-[#252D29] shadow-xl"
      >
        <PopoverHeader className="gap-1">
          <Link href='/my-profile' className="mb-2 truncate text-sm font-bold text-[#173F35]"> My Profile</Link>
          <PopoverTitle className="truncate text-sm font-semibold text-[#173F35]">
            {user?.name}
          </PopoverTitle>
          <PopoverDescription className="truncate text-xs text-[#727C75]">
            {user?.email}
          </PopoverDescription>
        </PopoverHeader>

        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-[#173F35] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#102F28] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogOut size={16} />
          {isSigningOut ? "Signing out..." : "Sign Out"}
        </button>
      </PopoverContent>
    </Popover>
  );

  const guestActions = (
    <div className="flex items-center gap-2">
      <Link
        href="/sign-in"
        className="rounded-lg px-4 py-2 text-sm font-semibold text-[#173F35] transition-colors hover:bg-[#173F35]/10"
      >
        Login
      </Link>

      <Link
        href="/sign-up"
        className="rounded-lg bg-[#173F35] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#102F28]"
      >
        Register
      </Link>
    </div>
  );

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

        {/* Desktop Auth */}
        <div className="hidden items-center gap-3 lg:flex">
          {isPending ? (
            <span
              aria-hidden="true"
              className="h-10 w-10 animate-pulse rounded-full bg-[#173F35]/10"
            />
          ) : user ? (
            userMenu
          ) : (
            guestActions
          )}
        </div>

        {/* Mobile Menu (Popover) */}
        <Popover open={mobileOpen} onOpenChange={setMobileOpen}>
          <PopoverTrigger
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="rounded-lg p-2 text-[#173F35] transition-colors hover:bg-[#173F35]/10 lg:hidden"
          >
            {mobileOpen ? <X size={25} /> : <Menu size={25} />}
          </PopoverTrigger>

          <PopoverContent
            align="end"
            sideOffset={8}
            className="max-h-[calc(100dvh-6rem)] w-[calc(100vw-2rem)] max-w-sm overflow-y-auto border border-[#E7E5DF] bg-[#FAF8F3] p-4 text-[#252D29] shadow-xl lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={linkClass(link.href)}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-2 flex flex-col gap-3 border-t border-[#E7E5DF] pt-4">
              {isPending ? (
                <div
                  aria-hidden="true"
                  className="h-10 animate-pulse rounded-lg bg-[#173F35]/10"
                />
              ) : user ? (
                <>
                  <div className="flex items-center gap-3">
                    <Avatar className="bg-[#173F35] text-white">
                      <AvatarImage
                        referrerPolicy="no-referrer"
                        src={user.image ?? undefined}
                        alt={user.name ?? "User"}
                      />
                      <AvatarFallback className="bg-[#173F35] text-xs font-semibold text-white">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <Link href="/my-profile" className=" truncate text-sm font-bold text-[#173F35]">My Profile</Link>
                      <p className="truncate text-sm font-semibold text-[#173F35]">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-[#727C75]">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#173F35] px-4 py-2.5 text-sm font-semibold text-[#173F35] transition-colors hover:bg-[#173F35] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <LogOut size={17} />
                    {isSigningOut ? "Signing out..." : "Sign Out"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg border border-[#173F35] px-4 py-2.5 text-center text-sm font-semibold text-[#173F35] transition-colors hover:bg-[#173F35]/10"
                  >
                    Login
                  </Link>

                  <Link
                    href="/sign-up"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg bg-[#173F35] px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#102F28]"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </nav>
    </header>
  );
};

export default Navbar;
