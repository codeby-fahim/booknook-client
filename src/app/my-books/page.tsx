"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import type { IBook } from "@/lib/type/bookFormData";
import { toast } from "sonner";

import {
  BookOpen,
  BookPlus,
  Loader2,
  LockKeyhole,
  Pencil,
  RefreshCw,
  Trash2,
} from "lucide-react";

const MyBooksPage = () => {
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

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/my-books/${encodeURIComponent(
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

        if (!res.ok) {
          throw new Error(
            res.status === 401
              ? "Your session has expired. Please sign in again."
              : "Could not load your books right now."
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
            : "Something went wrong while loading your books."
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
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#173F35]/10 text-[#173F35]">
              <BookOpen size={28} />
            </div>

            <h1 className="text-3xl font-bold text-[#173F35] sm:text-4xl">
              My Books
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[#727C75] sm:text-base">
              Manage the books you have added to the BookNook library.
            </p>
          </div>

          <Link
            href="/add-books"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#173F35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#102F28] hover:shadow-lg sm:shrink-0"
          >
            <BookPlus size={18} />
            Add a Book
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
              Sign in to see your books
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#727C75]">
              Your added books are private. Please sign in with your BookNook
              account to manage them.
            </p>

            <Link
              href="/sign-in?callbackUrl=/my-books"
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
              Could not load your books
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

            <h2 className="text-xl font-bold text-[#173F35]">
              You haven&apos;t added any books yet
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#727C75]">
              Share your first book with the BookNook community.
            </p>

            <Link
              href="/add-books"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-[#173F35] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#102F28]"
            >
              <BookPlus size={18} />
              Add a Book
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-[#727C75]">
              You have added{" "}
              <span className="font-semibold text-[#173F35]">
                {books.length}
              </span>{" "}
              {books.length === 1 ? "book" : "books"}.
            </p>

            <div className="overflow-hidden rounded-2xl border border-[#E7E5DF] bg-white shadow-sm">
              {/* Desktop table */}
              <table className="hidden w-full table-fixed md:table">
                <thead>
                  <tr className="border-b border-[#E7E5DF] bg-[#FAF8F3] text-left text-xs uppercase tracking-wide text-[#727C75]">
                    <th scope="col" className="w-[46%] px-6 py-4 font-semibold">
                      Book
                    </th>
                    <th scope="col" className="w-[20%] px-4 py-4 font-semibold">
                      Category
                    </th>
                    <th scope="col" className="w-[14%] px-4 py-4 font-semibold">
                      Copies
                    </th>
                    <th
                      scope="col"
                      className="w-[20%] px-6 py-4 text-right font-semibold"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {books.map((book, index) => (
                    <tr
                      key={book._id ?? `${book.title}-${index}`}
                      className="border-b border-[#E7E5DF] last:border-b-0 hover:bg-[#FAF8F3]"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <BookThumb book={book} size="md" />

                          <div className="min-w-0">
                            <p
                              title={book.title}
                              className="truncate text-sm font-bold text-[#173F35]"
                            >
                              {book.title}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-[#727C75]">
                              {book.author}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-block rounded-full bg-[#173F35]/10 px-3 py-1 text-xs font-semibold text-[#173F35]">
                          {book.category}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-sm font-medium text-[#252D29]">
                        {Number(book.totalCopies ?? 0)}
                      </td>

                      <td className="px-6 py-4">
                        <BookActions />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile cards */}
              <ul className="divide-y divide-[#E7E5DF] md:hidden">
                {books.map((book, index) => (
                  <li
                    key={book._id ?? `${book.title}-${index}`}
                    className="p-4"
                  >
                    <div className="flex items-start gap-3">
                      <BookThumb book={book} size="sm" />

                      <div className="min-w-0 flex-1">
                        <p
                          title={book.title}
                          className="line-clamp-2 text-sm font-bold leading-snug text-[#173F35]"
                        >
                          {book.title}
                        </p>
                        <p className="mt-1 truncate text-xs text-[#727C75]">
                          {book.author}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[#173F35]/10 px-2.5 py-1 text-[11px] font-semibold text-[#173F35]">
                            {book.category}
                          </span>
                          <span className="text-[11px] text-[#727C75]">
                            {Number(book.totalCopies ?? 0)}{" "}
                            {Number(book.totalCopies ?? 0) === 1
                              ? "copy"
                              : "copies"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <BookActions fullWidth />
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
  book,
  size,
}: {
  book: IBook;
  size: "sm" | "md";
}) => {
  const dimensions = size === "md" ? "h-16 w-12" : "h-20 w-14";

  return (
    <div
      className={`${dimensions} shrink-0 overflow-hidden rounded-md bg-[#FAF8F3]`}
    >
      {book.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={book.image}
          alt={`${book.title} cover`}
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

const BookActions = ({ fullWidth = false }: { fullWidth?: boolean }) => (
  <div
    className={`flex items-center gap-2 ${
      fullWidth ? "w-full" : "justify-end"
    }`}
  >
    <button
      type="button"
      onClick={() => toast.info("Editing books will be available soon.")}
      className={`inline-flex items-center justify-center gap-1.5 rounded-md bg-[#252D29] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#173F35] ${
        fullWidth ? "flex-1" : ""
      }`}
    >
      <Pencil size={13} />
      Edit
    </button>

    <button
      type="button"
      onClick={() => toast.info("Deleting books will be available soon.")}
      className={`inline-flex items-center justify-center gap-1.5 rounded-md bg-red-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-red-700 ${
        fullWidth ? "flex-1" : ""
      }`}
    >
      <Trash2 size={13} />
      Delete
    </button>
  </div>
);

const LoadingCard = () => (
  <div className="overflow-hidden rounded-2xl border border-[#E7E5DF] bg-white p-6 shadow-sm sm:p-8">
    <div className="mb-6 flex items-center gap-2 text-sm text-[#727C75]">
      <Loader2 size={17} className="animate-spin text-[#173F35]" />
      Loading your books...
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

export default MyBooksPage;
