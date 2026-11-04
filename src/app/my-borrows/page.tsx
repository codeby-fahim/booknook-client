"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { toast } from "sonner";

import {
  BookOpen,
  BookmarkPlus,
  CalendarDays,
  Loader2,
  LockKeyhole,
  RefreshCw,
  RotateCcw,
} from "lucide-react";

interface IBorrow {
  _id: string;
  bookId: string;
  userEmail: string;
  bookInfo: {
    title: string;
    author: string;
    image: string;
  };
  borrowedAt: string | Date;
  returnedAt: string | Date | null;
  status: "borrowed" | "returned";
}

const formatDate = (value?: string | Date | null) => {
  if (!value) return "Unknown";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Unknown";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const MyBorrowsPage = () => {
  const { data: session, isPending } = authClient.useSession();
  const signedInEmail = session?.user?.email;

  const [borrows, setBorrows] = useState<IBorrow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [returningId, setReturningId] = useState<string | null>(null);

  useEffect(() => {
    if (isPending || !signedInEmail) return;

    let cancelled = false;
    const controller = new AbortController();

    const load = async () => {
      try {
        const token = await getTokenFromClient();

        if (!token) {
          throw new Error("Your session has expired. Please sign in again.");
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/my-borrows/${encodeURIComponent(
            signedInEmail
          )}`,
          {
            method: "GET",
            headers: {
              authorization: `Bearer ${token}`,
            },
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const data = await res.json().catch(() => null);

        if (!res.ok || !data?.success) {
          throw new Error(
            data?.message || "Could not load your borrowed books right now."
          );
        }

        if (cancelled) return;

        setBorrows(Array.isArray(data.data) ? data.data : []);
        setError("");
      } catch (err) {
        if (cancelled || controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading your borrowed books."
        );
        setBorrows([]);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [isPending, signedInEmail, refreshKey]);

  const retry = () => {
    setIsLoading(true);
    setError("");
    setRefreshKey((key) => key + 1);
  };

  const handleReturn = async (borrow: IBorrow) => {
    if (!signedInEmail) return;

    try {
      setReturningId(borrow._id);

      const token = await getTokenFromClient();

      if (!token) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/my-borrows/${encodeURIComponent(
          signedInEmail
        )}/${borrow._id}`,
        {
          method: "PATCH",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Could not return this book.");
      }

      toast.success(data?.message || "Book returned successfully!");
      setBorrows((previous) =>
        previous.filter((item) => item._id !== borrow._id)
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong while returning the book."
      );
    } finally {
      setReturningId(null);
    }
  };

  return (
    <section className="bg-[#FAF8F3] px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#173F35]/10 text-[#173F35]">
              <BookmarkPlus size={28} />
            </div>

            <h1 className="text-3xl font-bold text-[#173F35] sm:text-4xl">
              My Borrows
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[#727C75] sm:text-base">
              All the books you have borrowed from the BookNook library.
            </p>
          </div>

          <Link
            href="/all-books"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#173F35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#102F28] hover:shadow-lg sm:shrink-0"
          >
            <BookOpen size={18} />
            Browse Books
          </Link>
        </div>

        {/* Session loading / signed out */}
        {isPending ? (
          <LoadingCard />
        ) : !signedInEmail ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-[#E7E5DF] bg-white p-6 text-center shadow-sm sm:p-10">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#173F35]/10 text-[#173F35]">
              <LockKeyhole size={22} />
            </div>

            <h2 className="text-xl font-bold text-[#173F35]">
              Sign in to see your borrowed books
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#727C75]">
              Please sign in with your BookNook account to manage the books you
              have borrowed.
            </p>

            <Link
              href="/sign-in?callbackUrl=/my-borrows"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-[#173F35] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#102F28]"
            >
              Sign In
            </Link>
          </div>
        ) : isLoading ? (
          <LoadingCard />
        ) : error ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-[#E7E5DF] bg-white p-6 text-center shadow-sm sm:p-10">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <RefreshCw size={22} />
            </div>

            <h2 className="text-lg font-bold text-[#173F35]">
              Could not load your borrowed books
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#727C75]">
              {error}
            </p>

            <button
              type="button"
              onClick={retry}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-[#173F35] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#102F28]"
            >
              <RefreshCw size={17} />
              Try Again
            </button>
          </div>
        ) : borrows.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-[#E7E5DF] bg-white p-6 text-center shadow-sm sm:p-10">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#173F35]/10 text-[#173F35]">
              <BookOpen size={22} />
            </div>

            <h2 className="text-xl font-bold text-[#173F35]">
              You haven&apos;t borrowed any books yet
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#727C75]">
              Browse the library and borrow a book to see it here.
            </p>

            <Link
              href="/all-books"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-[#173F35] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#102F28]"
            >
              <BookOpen size={18} />
              Browse Books
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-[#727C75]">
              You have borrowed{" "}
              <span className="font-semibold text-[#173F35]">
                {borrows.length}
              </span>{" "}
              {borrows.length === 1 ? "book" : "books"}.
            </p>

            <div className="overflow-hidden rounded-2xl border border-[#E7E5DF] bg-white shadow-sm">
              {/* Desktop table */}
              <table className="hidden w-full table-fixed md:table">
                <thead>
                  <tr className="border-b border-[#E7E5DF] bg-[#FAF8F3] text-left text-xs uppercase tracking-wide text-[#727C75]">
                    <th scope="col" className="w-[56%] px-6 py-4 font-semibold">
                      Book
                    </th>
                    <th scope="col" className="w-[22%] px-4 py-4 font-semibold">
                      Borrowed On
                    </th>
                    <th
                      scope="col"
                      className="w-[22%] px-6 py-4 text-right font-semibold"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {borrows.map((borrow) => (
                    <tr
                      key={borrow._id}
                      className="border-b border-[#E7E5DF] last:border-b-0 hover:bg-[#FAF8F3]"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <BookThumb borrow={borrow} size="md" />

                          <div className="min-w-0 flex-1">
                            <p
                              title={borrow.bookInfo?.title}
                              className="truncate text-sm font-bold text-[#173F35]"
                            >
                              {borrow.bookInfo?.title || "Untitled book"}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-[#727C75]">
                              {borrow.bookInfo?.author || "Unknown author"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#252D29]">
                          <CalendarDays size={14} className="text-[#727C75]" />
                          {formatDate(borrow.borrowedAt)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <ReturnButton
                            borrow={borrow}
                            onReturn={handleReturn}
                            isReturning={returningId === borrow._id}
                            disabled={returningId !== null}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile cards */}
              <ul className="divide-y divide-[#E7E5DF] md:hidden">
                {borrows.map((borrow) => (
                  <li key={borrow._id} className="p-4">
                    <div className="flex items-start gap-3">
                      <BookThumb borrow={borrow} size="sm" />

                      <div className="min-w-0 flex-1">
                        <p
                          title={borrow.bookInfo?.title}
                          className="line-clamp-2 text-sm font-bold leading-snug text-[#173F35]"
                        >
                          {borrow.bookInfo?.title || "Untitled book"}
                        </p>
                        <p className="mt-1 truncate text-xs text-[#727C75]">
                          {borrow.bookInfo?.author || "Unknown author"}
                        </p>

                        <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-[#727C75]">
                          <CalendarDays size={13} />
                          Borrowed {formatDate(borrow.borrowedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <ReturnButton
                        borrow={borrow}
                        onReturn={handleReturn}
                        isReturning={returningId === borrow._id}
                        disabled={returningId !== null}
                        fullWidth
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

const BookThumb = ({
  borrow,
  size,
}: {
  borrow: IBorrow;
  size: "sm" | "md";
}) => {
  const dimensions = size === "md" ? "h-16 w-12" : "h-20 w-14";

  return (
    <div
      className={`${dimensions} shrink-0 overflow-hidden rounded-md bg-[#FAF8F3]`}
    >
      {borrow.bookInfo?.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={borrow.bookInfo.image}
          alt={`${borrow.bookInfo.title} cover`}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[#173F35]/30">
          <BookOpen size={20} />
        </div>
      )}
    </div>
  );
};

type ReturnButtonProps = {
  borrow: IBorrow;
  onReturn: (borrow: IBorrow) => void;
  isReturning?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
};

const ReturnButton = ({
  borrow,
  onReturn,
  isReturning = false,
  disabled = false,
  fullWidth = false,
}: ReturnButtonProps) => (
  <button
    type="button"
    onClick={() => onReturn(borrow)}
    aria-label={`Return ${borrow.bookInfo?.title || "this book"}`}
    disabled={disabled || isReturning}
    className={`inline-flex items-center justify-center gap-1.5 rounded-md bg-[#173F35] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#102F28] disabled:cursor-not-allowed disabled:opacity-60 ${
      fullWidth ? "w-full" : ""
    }`}
  >
    {isReturning ? (
      <Loader2 size={13} className="animate-spin" />
    ) : (
      <RotateCcw size={13} />
    )}
    {isReturning ? "Returning..." : "Return Borrow"}
  </button>
);

const LoadingCard = () => (
  <div className="overflow-hidden rounded-2xl border border-[#E7E5DF] bg-white p-6 shadow-sm sm:p-8">
    <div className="mb-6 flex items-center gap-2 text-sm text-[#727C75]">
      <Loader2 size={17} className="animate-spin text-[#173F35]" />
      Loading your borrowed books...
    </div>

    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center gap-4">
          <div className="h-16 w-12 shrink-0 animate-pulse rounded-md bg-[#173F35]/10" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-5/12 animate-pulse rounded bg-[#173F35]/10" />
            <div className="h-3 w-3/12 animate-pulse rounded bg-[#173F35]/10" />
          </div>
          <div className="hidden h-8 w-28 animate-pulse rounded bg-[#173F35]/10 sm:block" />
        </div>
      ))}
    </div>
  </div>
);

export default MyBorrowsPage;
