"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import type { IBook } from "@/lib/type/bookFormData";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  BookOpen,
  BookPlus,
  Loader2,
  LockKeyhole,
  Pencil,
  RefreshCw,
  Trash2,
} from "lucide-react";

const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"];

const inputClass =
  "w-full rounded-lg border border-[#E7E5DF] bg-white px-3.5 py-2.5 text-sm text-[#252D29] outline-none transition focus:border-[#173F35] focus:ring-2 focus:ring-[#173F35]/10 disabled:cursor-not-allowed disabled:bg-[#FAF8F3] disabled:text-[#727C75]";

const MyBooksPage = () => {
  const { data: session, isPending } = authClient.useSession();
  const signedInEmail = session?.user?.email;

  const [books, setBooks] = useState<IBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Edit dialog state
  const [editingBook, setEditingBook] = useState<IBook | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete dialog state
  const [bookToDelete, setBookToDelete] = useState<IBook | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingBook || !signedInEmail) return;

    const formData = new FormData(event.currentTarget);

    const title = String(formData.get("title") ?? "").trim();
    const author = String(formData.get("author") ?? "").trim();
    const category = String(formData.get("category") ?? "");
    const image = String(formData.get("image") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const totalCopies = Number(formData.get("totalCopies"));

    if (!Number.isInteger(totalCopies) || totalCopies < 1) {
      toast.error("Total copies must be a whole number of at least 1.");
      return;
    }

    // Keep the number of borrowed copies intact when the total changes.
    const previousTotal = Number(editingBook.totalCopies ?? 0);
    const previousAvailable = Number(editingBook.availableCopies ?? 0);
    const borrowedCopies = Math.max(previousTotal - previousAvailable, 0);
    const availableCopies = Math.max(totalCopies - borrowedCopies, 0);

    try {
      setIsUpdating(true);

      const token = await getTokenFromClient();

      if (!token) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/my-books/${encodeURIComponent(
          signedInEmail
        )}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bookId: editingBook._id,
            title,
            author,
            category,
            image,
            description,
            totalCopies,
            availableCopies,
          }),
        }
      );

      if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        throw new Error(
          errorBody?.msg || "Could not update the book. Please try again."
        );
      }

      setBooks((previous) =>
        previous.map((book) =>
          book._id === editingBook._id
            ? {
                ...book,
                title,
                author,
                category,
                image,
                description,
                totalCopies,
                availableCopies,
              }
            : book
        )
      );

      toast.success("Book updated successfully!");
      setEditingBook(null);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong while updating the book."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!bookToDelete || !signedInEmail) return;

    const bookId = bookToDelete._id;

    if (!bookId) {
      toast.error("This book could not be deleted. Missing book id.");
      return;
    }

    try {
      setDeletingId(bookId);

      const token = await getTokenFromClient();

      if (!token) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/my-books/${encodeURIComponent(
          signedInEmail
        )}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ bookId }),
        }
      );

      if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        throw new Error(
          errorBody?.msg || "Could not delete the book. Please try again."
        );
      }

      setBooks((previous) => previous.filter((book) => book._id !== bookId));
      setBookToDelete(null);

      toast.success("Book deleted successfully!");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong while deleting the book."
      );
    } finally {
      setDeletingId(null);
    }
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
                        <BookActions
                          book={book}
                          onEdit={setEditingBook}
                          onDelete={setBookToDelete}
                          isDeleting={deletingId === book._id}
                          disabled={isUpdating || deletingId !== null}
                        />
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
                      <BookActions
                        book={book}
                        onEdit={setEditingBook}
                        onDelete={setBookToDelete}
                        isDeleting={deletingId === book._id}
                        disabled={isUpdating || deletingId !== null}
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

      {/* Edit dialog */}
      {editingBook && (
        <AlertDialog
          open
          onOpenChange={(open) => {
            if (!open && !isUpdating) {
              setEditingBook(null);
            }
          }}
        >
          <AlertDialogContent className="sm:max-w-xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Edit book</AlertDialogTitle>
              <AlertDialogDescription>
                Update the details for &quot;{editingBook.title}&quot;. These
                changes are visible to everyone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <form
              key={editingBook._id}
              onSubmit={handleUpdate}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="edit-title"
                  className="mb-1.5 block text-sm font-semibold text-[#252D29]"
                >
                  Book Title
                </label>
                <input
                  id="edit-title"
                  name="title"
                  type="text"
                  required
                  maxLength={150}
                  defaultValue={editingBook.title}
                  className={inputClass}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="edit-author"
                    className="mb-1.5 block text-sm font-semibold text-[#252D29]"
                  >
                    Author Name
                  </label>
                  <input
                    id="edit-author"
                    name="author"
                    type="text"
                    required
                    maxLength={100}
                    defaultValue={editingBook.author}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-category"
                    className="mb-1.5 block text-sm font-semibold text-[#252D29]"
                  >
                    Category
                  </label>
                  <select
                    id="edit-category"
                    name="category"
                    required
                    defaultValue={editingBook.category}
                    className={`${inputClass} appearance-none`}
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="edit-totalCopies"
                    className="mb-1.5 block text-sm font-semibold text-[#252D29]"
                  >
                    Total Copies
                  </label>
                  <input
                    id="edit-totalCopies"
                    name="totalCopies"
                    type="number"
                    min={1}
                    max={999}
                    step={1}
                    required
                    defaultValue={Number(editingBook.totalCopies ?? 1)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-image"
                    className="mb-1.5 block text-sm font-semibold text-[#252D29]"
                  >
                    Book Image URL
                  </label>
                  <input
                    id="edit-image"
                    name="image"
                    type="url"
                    required
                    defaultValue={editingBook.image}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="edit-description"
                  className="mb-1.5 block text-sm font-semibold text-[#252D29]"
                >
                  Short Description
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  rows={4}
                  required
                  maxLength={500}
                  defaultValue={editingBook.description}
                  className={`${inputClass} resize-y`}
                />
              </div>

              <AlertDialogFooter className="pt-2">
                <AlertDialogCancel disabled={isUpdating}>
                  Cancel
                </AlertDialogCancel>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#173F35] px-4 text-sm font-semibold text-white transition hover:bg-[#102F28] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Pencil size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Delete dialog */}
      {bookToDelete && (
        <AlertDialog
          open
          onOpenChange={(open) => {
            if (!open && !deletingId) {
              setBookToDelete(null);
            }
          }}
        >
          <AlertDialogContent className="sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this book?</AlertDialogTitle>
              <AlertDialogDescription>
                &quot;{bookToDelete.title}&quot; will be permanently removed
                from the library. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={deletingId !== null}>
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={handleDelete}
                disabled={deletingId !== null}
                className="bg-red-600 hover:bg-red-700"
              >
                {deletingId !== null ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
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

type BookActionsProps = {
  book: IBook;
  onEdit: (book: IBook) => void;
  onDelete: (book: IBook) => void;
  isDeleting?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
};

const BookActions = ({
  book,
  onEdit,
  onDelete,
  isDeleting = false,
  disabled = false,
  fullWidth = false,
}: BookActionsProps) => (
  <div
    className={`flex items-center gap-2 ${
      fullWidth ? "w-full" : "justify-end"
    }`}
  >
    <button
      type="button"
      onClick={() => onEdit(book)}
      disabled={disabled || isDeleting}
      className={`inline-flex items-center justify-center gap-1.5 rounded-md bg-[#252D29] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#173F35] disabled:cursor-not-allowed disabled:opacity-60 ${
        fullWidth ? "flex-1" : ""
      }`}
    >
      <Pencil size={13} />
      Edit
    </button>

    <button
      type="button"
      onClick={() => onDelete(book)}
      disabled={disabled || isDeleting}
      className={`inline-flex items-center justify-center gap-1.5 rounded-md bg-red-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 ${
        fullWidth ? "flex-1" : ""
      }`}
    >
      {isDeleting ? (
        <Loader2 size={13} className="animate-spin" />
      ) : (
        <Trash2 size={13} />
      )}
      {isDeleting ? "Deleting..." : "Delete"}
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
