"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import type { IBook } from "@/lib/type/bookFormData";
import { toast } from "sonner";

import {
  ArrowLeft,
  BookOpen,
  BookmarkPlus,
  CalendarDays,
  Copy,
  Loader2,
  LockKeyhole,
  Mail,
  RefreshCw,
  UserRound,
} from "lucide-react";

const formatDate = (value?: string | Date) => {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const BookDetailContent = () => {
  const params = useParams<{ id: string }>();
  const bookId = typeof params?.id === "string" ? params.id : "";

  const { data: session, isPending } = authClient.useSession();
  const signedInEmail = session?.user?.email;

  const [book, setBook] = useState<IBook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (isPending || !signedInEmail || !bookId) return;

    let cancelled = false;
    const controller = new AbortController();

    const load = async () => {
      try {
        const token = await getTokenFromClient();

        if (!token) {
          throw new Error("Your session has expired. Please sign in again.");
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/all-books/${bookId}`,
          {
            method: "GET",
            headers: {
              authorization: `Bearer ${token}`,
            },
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!res.ok) {
          throw new Error(
            res.status === 401
              ? "Your session has expired. Please sign in again."
              : "Could not load this book right now."
          );
        }

        const data = await res.json();

        if (cancelled) return;

        setBook(data && typeof data === "object" ? (data as IBook) : null);
        setError("");
      } catch (err) {
        if (cancelled || controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading this book."
        );
        setBook(null);
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
  }, [isPending, signedInEmail, bookId, refreshKey]);

  const retry = () => {
    setIsLoading(true);
    setError("");
    setRefreshKey((key) => key + 1);
  };

  const handleBorrow = () => {
    toast.info("Borrowing will be available soon.");
  };

  const addedOn = formatDate(book?.createdAt);
  const available = Number(book?.availableCopies ?? 0);
  const total = Number(book?.totalCopies ?? 0);

  return (
    <section className="bg-[#FAF8F3] px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/all-books"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#173F35] transition hover:underline hover:underline-offset-4"
        >
          <ArrowLeft size={17} />
          Back to All Books
        </Link>

        {isPending ? (
          <DetailsSkeleton />
        ) : !signedInEmail ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-[#E7E5DF] bg-white p-6 text-center shadow-sm sm:p-10">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#173F35]/10 text-[#173F35]">
              <LockKeyhole size={22} />
            </div>

            <h1 className="text-xl font-bold text-[#173F35]">
              Sign in to view book details
            </h1>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#727C75]">
              The book collection is protected. Please sign in to continue.
            </p>

            <Link
              href={`/sign-in?callbackUrl=/all-books/${bookId}`}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-[#173F35] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#102F28]"
            >
              Sign In
            </Link>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#E7E5DF] bg-white p-16 shadow-sm">
            <Loader2 size={30} className="animate-spin text-[#173F35]" />
            <p className="text-sm text-[#727C75]">Loading book details...</p>
          </div>
        ) : error ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-[#E7E5DF] bg-white p-6 text-center shadow-sm sm:p-10">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <RefreshCw size={22} />
            </div>

            <h1 className="text-lg font-bold text-[#173F35]">
              Could not load this book
            </h1>

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
        ) : !book?._id ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-[#E7E5DF] bg-white p-6 text-center shadow-sm sm:p-10">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#173F35]/10 text-[#173F35]">
              <BookOpen size={22} />
            </div>

            <h1 className="text-xl font-bold text-[#173F35]">
              Book not found
            </h1>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#727C75]">
              This book may have been removed from the library.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[#E7E5DF] bg-white shadow-sm">
            <div className="grid gap-8 p-5 sm:p-8 md:grid-cols-[300px_1fr]">
              {/* Cover */}
              <div className="mx-auto w-full max-w-75">
                <div className="aspect-4/5 overflow-hidden rounded-xl bg-[#FAF8F3] shadow-md">
                  {book.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={book.image}
                      alt={`${book.title} cover`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#173F35]/30">
                      <BookOpen size={64} />
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#E8A85C] px-3 py-1 text-xs font-semibold text-[#252D29]">
                    {book.category}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      available > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {available > 0
                      ? `${available} available`
                      : "Out of stock"}
                  </span>
                </div>

                <h1 className="mt-4 text-2xl font-bold leading-tight text-[#173F35] sm:text-3xl">
                  {book.title}
                </h1>

                <p className="mt-2 flex items-center gap-2 text-sm font-medium text-[#727C75]">
                  <UserRound size={16} className="shrink-0" />
                  {book.author}
                </p>

                <div className="mt-5 border-t border-[#E7E5DF] pt-5">
                  <h2 className="text-sm font-bold uppercase tracking-wide text-[#173F35]">
                    Description
                  </h2>

                  <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#727C75]">
                    {book.description || "No description provided."}
                  </p>
                </div>

                <dl className="mt-6 grid gap-4 border-t border-[#E7E5DF] pt-5 sm:grid-cols-2">
                  <div>
                    <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-[#727C75]">
                      <Copy size={14} />
                      Total Copies
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-[#252D29]">
                      {total}
                    </dd>
                  </div>

                  <div>
                    <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-[#727C75]">
                      <Copy size={14} />
                      Available Copies
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-[#252D29]">
                      {available}
                    </dd>
                  </div>

                  <div>
                    <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-[#727C75]">
                      <CalendarDays size={14} />
                      Added On
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-[#252D29]">
                      {addedOn ?? "Unknown"}
                    </dd>
                  </div>

                  {book.addedBy?.name && (
                    <div>
                      <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-[#727C75]">
                        <UserRound size={14} />
                        Added By
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-[#252D29]">
                        {book.addedBy.name}
                      </dd>
                    </div>
                  )}

                  {book.addedBy?.email && (
                    <div className="sm:col-span-2">
                      <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-[#727C75]">
                        <Mail size={14} />
                        Contact
                      </dt>
                      <dd className="mt-1 break-all text-sm font-semibold text-[#252D29]">
                        {book.addedBy.email}
                      </dd>
                    </div>
                  )}
                </dl>

                <div className="mt-6 border-t border-[#E7E5DF] pt-6">
                  <button
                    type="button"
                    onClick={handleBorrow}
                    disabled={available === 0}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#173F35] px-6 py-3.5 font-semibold text-white transition hover:bg-[#102F28] hover:shadow-lg disabled:cursor-not-allowed disabled:bg-[#C9C6BD] disabled:text-[#727C75] disabled:hover:shadow-none sm:w-auto"
                  >
                    <BookmarkPlus size={19} />
                    {available === 0 ? "Out of Stock" : "Borrow The Book"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const DetailsSkeleton = () => (
  <div className="grid gap-8 rounded-2xl border border-[#E7E5DF] bg-white p-5 shadow-sm sm:p-8 md:grid-cols-[300px_1fr]">
    <div className="mx-auto aspect-4/5 w-full max-w-75 animate-pulse rounded-xl bg-[#173F35]/10" />

    <div className="space-y-4">
      <div className="h-5 w-24 animate-pulse rounded bg-[#173F35]/10" />
      <div className="h-9 w-3/4 animate-pulse rounded bg-[#173F35]/10" />
      <div className="h-4 w-1/3 animate-pulse rounded bg-[#173F35]/10" />
      <div className="h-4 w-full animate-pulse rounded bg-[#173F35]/10" />
      <div className="h-4 w-full animate-pulse rounded bg-[#173F35]/10" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-[#173F35]/10" />
      <div className="h-12 w-full animate-pulse rounded-lg bg-[#173F35]/10" />
    </div>
  </div>
);

const BookDetailPage = () => (
  <Suspense
    fallback={
      <section className="bg-[#FAF8F3] px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-5xl">
          <DetailsSkeleton />
        </div>
      </section>
    }
  >
    <BookDetailContent />
  </Suspense>
);

export default BookDetailPage;
