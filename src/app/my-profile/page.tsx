"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  BookOpen,
  BookmarkPlus,
  CalendarDays,
  CheckCircle2,
  Loader2,
  LockKeyhole,
  LogOut,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const formatDate = (value?: string | Date | null) => {
  if (!value) return "Unknown";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Unknown";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const MyProfilePage = () => {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [isSigningOut, setIsSigningOut] = useState(false);

  const userInitial =
    user?.name?.trim()?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);

      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
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

  return (
    <section className="bg-[#FAF8F3] px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-4xl">
        {/* Heading */}
        <div className="mb-8 text-center sm:text-left">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#173F35]/10 text-[#173F35] sm:mx-0">
            <UserRound size={28} />
          </div>

          <h1 className="text-3xl font-bold text-[#173F35] sm:text-4xl">
            My Profile
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#727C75] sm:mx-0 sm:text-base">
            View the details of your BookNook account.
          </p>
        </div>

        {isPending ? (
          <ProfileSkeleton />
        ) : !user ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-[#E7E5DF] bg-white p-6 text-center shadow-sm sm:p-10">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#173F35]/10 text-[#173F35]">
              <LockKeyhole size={22} />
            </div>

            <h2 className="text-xl font-bold text-[#173F35]">
              Sign in to view your profile
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#727C75]">
              Please sign in with your BookNook account to see your profile
              details.
            </p>

            <Link
              href="/sign-in?callbackUrl=/my-profile"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-[#173F35] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#102F28]"
            >
              Sign In
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[#E7E5DF] bg-white shadow-sm">
            {/* Cover */}
            <div className="h-28 bg-linear-to-r from-[#173F35] via-[#1F5145] to-[#2E6B5A] sm:h-32" />

            <div className="px-5 pb-6 sm:px-8 sm:pb-8">
              {/* Avatar + identity */}
              <div className="-mt-14 flex flex-col items-center gap-4 sm:-mt-16 sm:flex-row sm:items-start sm:gap-6">
                <Avatar className="size-24 border-4 border-white bg-[#173F35] shadow-lg sm:size-28">
                  <AvatarImage
                    referrerPolicy="no-referrer"
                    src={user.image ?? undefined}
                    alt={user.name ?? "User"}
                  />
                  <AvatarFallback className="bg-[#173F35] text-2xl font-semibold text-white">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 text-center sm:flex-1 sm:pt-20 sm:text-left">
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <h2 className="min-w-0 truncate text-2xl font-bold text-[#173F35]">
                      {user.name || "BookNook Reader"}
                    </h2>

                    {user.emailVerified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-800">
                        <CheckCircle2 size={12} />
                        Verified
                      </span>
                    )}
                  </div>

                  <p className="mt-1 flex items-center justify-center gap-1.5 truncate text-sm text-[#727C75] sm:justify-start">
                    <Mail size={14} className="shrink-0" />
                    <span className="min-w-0 truncate">{user.email}</span>
                  </p>
                </div>
              </div>

              {/* Account details */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <InfoTile
                  icon={<UserRound size={18} />}
                  label="Full Name"
                  value={user.name || "Not provided"}
                />

                <InfoTile
                  icon={<Mail size={18} />}
                  label="Email Address"
                  value={user.email}
                />

                <InfoTile
                  icon={<ShieldCheck size={18} />}
                  label="Email Status"
                  value={user.emailVerified ? "Verified" : "Not verified"}
                />

                <InfoTile
                  icon={<CalendarDays size={18} />}
                  label="Member Since"
                  value={formatDate(user.createdAt)}
                />
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-col gap-3 border-t border-[#E7E5DF] pt-6 sm:flex-row sm:items-center">
                <Link
                  href="/my-books"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#173F35] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#102F28] sm:w-auto"
                >
                  <BookOpen size={17} />
                  My Books
                </Link>

                <Link
                  href="/my-borrows"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#173F35] px-5 py-2.5 text-sm font-semibold text-[#173F35] transition hover:bg-[#173F35]/10 sm:w-auto"
                >
                  <BookmarkPlus size={17} />
                  My Borrows
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 sm:ml-auto sm:w-auto"
                >
                  {isSigningOut ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <LogOut size={17} />
                  )}
                  {isSigningOut ? "Signing out..." : "Sign Out"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const InfoTile = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3 rounded-xl border border-[#E7E5DF] bg-[#FAF8F3] p-4">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#173F35]/10 text-[#173F35]">
      {icon}
    </div>

    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#727C75]">
        {label}
      </p>
      <p className="mt-1 wrap-break-words text-sm font-semibold text-[#252D29]">
        {value}
      </p>
    </div>
  </div>
);

const ProfileSkeleton = () => (
  <div className="overflow-hidden rounded-2xl border border-[#E7E5DF] bg-white shadow-sm">
    <div className="h-28 animate-pulse bg-[#173F35]/10 sm:h-32" />

    <div className="px-5 pb-6 sm:px-8 sm:pb-8">
      <div className="-mt-14 flex flex-col items-center gap-4 sm:-mt-16 sm:flex-row sm:items-start sm:gap-6">
        <div className="size-24 animate-pulse rounded-full border-4 border-white bg-[#173F35]/10 sm:size-28" />
        <div className="w-full space-y-2 sm:flex-1 sm:pt-20">
          <div className="mx-auto h-6 w-2/3 animate-pulse rounded bg-[#173F35]/10 sm:mx-0" />
          <div className="mx-auto h-4 w-1/2 animate-pulse rounded bg-[#173F35]/10 sm:mx-0" />
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-20 animate-pulse rounded-xl bg-[#173F35]/10"
          />
        ))}
      </div>

      <div className="mt-8 flex items-center gap-2 text-sm text-[#727C75]">
        <Loader2 size={17} className="animate-spin text-[#173F35]" />
        Loading your profile...
      </div>
    </div>
  </div>
);

export default MyProfilePage;
