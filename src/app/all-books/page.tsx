"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import BooksCard from "@/components/books/BooksCard";
import type { IBook } from "@/lib/type/bookFormData";

import { BookOpen, LockKeyhole, RefreshCw } from "lucide-react";

const AllBooksPage = () => {
  const { data: session, isPending } = authClient.useSession();
  const signedInEmail = session?.user?.email;

  const [books, setBooks] = useState<IBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

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

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/all-books`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
          cache: "no-store",
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(
            res.status === 401
              ? "Your session has expired. Please sign in again."
              : "Could not load the books right now."
          );
        }

        const data = await res.json();

        if (cancelled) return;

        setBooks(Array.isArray(data) ? data : []);
        setError("");
      } catch (err) {
        if (cancelled || controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading the books."
        );
        setBooks([]);
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

  return (
    <section className="bg-[#FAF8F3] px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-10 text-center sm:text-left">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#173F35]/10 text-[#173F35] sm:mx-0">
            <BookOpen size={28} />
          </div>

          <h1 className="text-3xl font-bold text-[#173F35] sm:text-4xl">
            All Books
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#727C75] sm:mx-0 sm:text-base">
            Browse every book shared by the BookNook community.
          </p>
        </div>

        {/* Session loading / signed out */}
        {isPending ? (
          <LoadingGrid />
        ) : !signedInEmail ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-[#E7E5DF] bg-white p-6 text-center shadow-sm sm:p-10">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#173F35]/10 text-[#173F35]">
              <LockKeyhole size={22} />
            </div>

            <h2 className="text-xl font-bold text-[#173F35]">
              Sign in to browse books
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#727C75]">
              The book collection is protected. Please sign in with your
              BookNook account to view it.
            </p>

            <Link
              href="/sign-in?callbackUrl=/all-books"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-[#173F35] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#102F28]"
            >
              Sign In
            </Link>
          </div>
        ) : isLoading ? (
          <LoadingGrid />
        ) : error ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-[#E7E5DF] bg-white p-6 text-center shadow-sm sm:p-10">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <RefreshCw size={22} />
            </div>

            <h2 className="text-lg font-bold text-[#173F35]">
              Could not load books
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
        ) : books.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-[#E7E5DF] bg-white p-6 text-center shadow-sm sm:p-10">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#173F35]/10 text-[#173F35]">
              <BookOpen size={22} />
            </div>

            <h2 className="text-xl font-bold text-[#173F35]">No books yet</h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#727C75]">
              The library is empty. Be the first to add a book to BookNook.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-[#727C75]">
                Showing{" "}
                <span className="font-semibold text-[#173F35]">
                  {books.length}
                </span>{" "}
                {books.length === 1 ? "book" : "books"}
              </p>

              <button
                type="button"
                onClick={retry}
                className="inline-flex items-center gap-2 rounded-lg border border-[#E7E5DF] bg-white px-4 py-2 text-sm font-semibold text-[#252D29] transition hover:border-[#173F35] hover:text-[#173F35]"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((book, index) => (
                <BooksCard
                  key={book._id ?? `${book.title}-${index}`}
                  book={book}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

const LoadingGrid = () => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }).map((_, index) => (
      <div
        key={index}
        className="overflow-hidden rounded-2xl border border-[#E7E5DF] bg-white shadow-sm"
      >
        <div className="aspect-4/5 animate-pulse bg-[#173F35]/10" />

        <div className="space-y-3 p-5">
          <div className="h-5 w-4/5 animate-pulse rounded bg-[#173F35]/10" />
          <div className="h-4 w-2/5 animate-pulse rounded bg-[#173F35]/10" />
          <div className="h-4 w-full animate-pulse rounded bg-[#173F35]/10" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-[#173F35]/10" />
          <div className="h-10 w-full animate-pulse rounded bg-[#173F35]/10" />
        </div>
      </div>
    ))}
  </div>
);

export default AllBooksPage;
