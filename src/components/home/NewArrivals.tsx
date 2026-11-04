"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import BooksCard from "@/components/books/BooksCard";
import type { IBook } from "@/lib/type/bookFormData";

import {
  ArrowRight,
  BookOpen,
  RefreshCw,
  Sparkles,
} from "lucide-react";

const NewArrivals = () => {
  // New arrivals are public so guests can browse them on the home page.
  const { data: session, isPending } = authClient.useSession();
  const signedInEmail = session?.user?.email;

  const [books, setBooks] = useState<IBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (isPending) return;

    let cancelled = false;
    const controller = new AbortController();

    const load = async () => {
      try {
        const token = signedInEmail ? await getTokenFromClient() : undefined;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/arrival-books`,
          {
            method: "GET",
            headers: token ? { authorization: `Bearer ${token}` } : undefined,
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!res.ok) {
          throw new Error("Could not load the new arrivals right now.");
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
            : "Something went wrong while loading the new arrivals."
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
    <section className="bg-white px-4 py-16 sm:px-6 md:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl text-center sm:text-left">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#E8A85C]/15 px-4 py-2 text-sm font-semibold text-[#173F35]">
              <Sparkles size={15} />
              Fresh on the Shelves
            </span>

            <h2 className="text-3xl font-bold tracking-tight text-[#173F35] sm:text-4xl">
              New Arrivals
            </h2>

            <p className="mt-4 text-base leading-7 text-[#727C75]">
              The latest books added to BookNook — discover something new to
              read today.
            </p>
          </div>

          <Link
            href="/all-books"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#173F35] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#102F28] hover:shadow-lg sm:shrink-0"
          >
            All Books
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* Session loading */}
        {isPending ? (
          <LoadingGrid />
        ) : isLoading ? (
          <LoadingGrid />
        ) : error ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-[#E7E5DF] bg-[#FAF8F3] p-6 text-center sm:p-10">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <RefreshCw size={22} />
            </div>

            <h3 className="text-lg font-bold text-[#173F35]">
              Could not load new arrivals
            </h3>

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
          <div className="mx-auto max-w-lg rounded-2xl border border-[#E7E5DF] bg-[#FAF8F3] p-6 text-center sm:p-10">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#173F35]/10 text-[#173F35]">
              <BookOpen size={22} />
            </div>

            <h3 className="text-lg font-bold text-[#173F35]">
              No new arrivals yet
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#727C75]">
              Recently added books will appear here. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book, index) => (
              <BooksCard
                key={book._id ?? `${book.title}-${index}`}
                book={book}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const LoadingGrid = () => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        className="overflow-hidden rounded-2xl border border-[#E7E5DF] bg-white shadow-sm"
      >
        <div className="aspect-[4/5] animate-pulse bg-[#173F35]/10" />

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

export default NewArrivals;
