"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { toast } from "sonner";

import {
  BookOpen,
  BookPlus,
  ChevronDown,
  Copy,
  ImageIcon,
  Loader2,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";

const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"];

const inputClass =
  "w-full rounded-lg border border-[#E7E5DF] bg-white px-4 py-3 text-sm text-[#252D29] outline-none transition focus:border-[#173F35] focus:ring-2 focus:ring-[#173F35]/10 disabled:cursor-not-allowed disabled:bg-[#FAF8F3] disabled:text-[#727C75]";

const AddBookPage = () => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFailed, setImageFailed] = useState(false);
  const [descriptionLength, setDescriptionLength] = useState(0);

  const previewUrl = imageUrl.trim();
  const showPreview =
    !imageFailed && /^https?:\/\//i.test(previewUrl) && previewUrl.length > 8;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      toast.error("Please sign in to add a book.");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

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

    try {
      setIsSubmitting(true);

      const token = await getTokenFromClient();

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/add-books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title,
          author,
          category,
          image,
          description,
          totalCopies,
          availableCopies: totalCopies,
          addedBy: {
            name: user.name,
            email: user.email,
          },
          createdAt: new Date(),
        }),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        throw new Error(errorBody?.message || "Failed to add the book.");
      }

      toast.success("Book added successfully!");

      form.reset();
      setImageUrl("");
      setImageFailed(false);
      setDescriptionLength(0);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex justify-center bg-[#FAF8F3] px-4 py-10 sm:px-6 sm:py-14">
      <div className="w-full max-w-2xl">
        {/* Heading */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#173F35]/10 text-[#173F35]">
            <BookPlus size={28} />
          </div>

          <h1 className="text-3xl font-bold text-[#173F35] sm:text-4xl">
            Add a New Book
          </h1>

          <p className="mt-3 text-sm leading-7 text-[#727C75] sm:text-base">
            Share a book with the BookNook community.
          </p>
        </div>

        {/* Signed out / loading state */}
        {isPending ? (
          <div className="rounded-2xl border border-[#E7E5DF] bg-white p-6 shadow-sm sm:p-8">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  aria-hidden="true"
                  className="h-11 animate-pulse rounded-lg bg-[#173F35]/10"
                />
              ))}
            </div>
          </div>
        ) : !user ? (
          <div className="rounded-2xl border border-[#E7E5DF] bg-white p-6 text-center shadow-sm sm:p-10">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#173F35]/10 text-[#173F35]">
              <LockKeyhole size={22} />
            </div>

            <h2 className="text-xl font-bold text-[#173F35]">
              Please sign in first
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#727C75]">
              You need an account to add books to the library.
            </p>

            <Link
              href="/sign-in?callbackUrl=/add-books"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-[#173F35] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#102F28]"
            >
              Sign In
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-[#E7E5DF] bg-white p-5 shadow-sm sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#252D29]"
                >
                  <BookOpen size={17} />
                  Book Title
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Enter the book title"
                  required
                  maxLength={150}
                  className={inputClass}
                />
              </div>

              {/* Author */}
              <div>
                <label
                  htmlFor="author"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#252D29]"
                >
                  <UserRound size={17} />
                  Author Name
                </label>

                <input
                  id="author"
                  name="author"
                  type="text"
                  placeholder="Enter the author name"
                  required
                  maxLength={100}
                  className={inputClass}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#252D29]"
                  >
                    <BookPlus size={17} />
                    Category
                  </label>

                  <div className="relative">
                    <select
                      id="category"
                      name="category"
                      required
                      defaultValue=""
                      className={`${inputClass} appearance-none pr-10`}
                    >
                      <option value="" disabled>
                        Select a category
                      </option>
                      {CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={18}
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#727C75]"
                    />
                  </div>
                </div>

                {/* Total copies */}
                <div>
                  <label
                    htmlFor="totalCopies"
                    className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#252D29]"
                  >
                    <Copy size={17} />
                    Total Copies
                  </label>

                  <input
                    id="totalCopies"
                    name="totalCopies"
                    type="number"
                    min={1}
                    max={999}
                    step={1}
                    defaultValue={1}
                    required
                    placeholder="e.g. 5"
                    className={inputClass}
                  />

                  <p className="mt-1 text-xs text-[#727C75]">
                    How many copies are you adding?
                  </p>
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label
                  htmlFor="image"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#252D29]"
                >
                  <ImageIcon size={17} />
                  Book Image URL
                </label>

                <input
                  id="image"
                  name="image"
                  type="url"
                  placeholder="https://example.com/book-cover.jpg"
                  required
                  onChange={(event) => {
                    setImageUrl(event.target.value);
                    setImageFailed(false);
                  }}
                  className={inputClass}
                />

                <p className="mt-2 text-xs leading-5 text-[#727C75]">
                  Paste a direct link to the book cover image (imgbb,
                  postimages, etc.).
                </p>

                {showPreview && (
                  <div className="mt-3 h-40 w-28 overflow-hidden rounded-lg border border-[#E7E5DF] bg-[#FAF8F3]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Book cover preview"
                      loading="lazy"
                      onError={() => setImageFailed(true)}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#252D29]"
                >
                  <BookOpen size={17} />
                  Short Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  required
                  maxLength={500}
                  placeholder="Write a short description of the book..."
                  onChange={(event) =>
                    setDescriptionLength(event.target.value.length)
                  }
                  className={`${inputClass} resize-y`}
                />

                <p className="mt-1 text-right text-xs text-[#727C75]">
                  {descriptionLength}/500
                </p>
              </div>

              {/* User details */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="userName"
                    className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#252D29]"
                  >
                    <UserRound size={17} />
                    Your Name
                  </label>

                  <input
                    id="userName"
                    type="text"
                    value={user.name ?? ""}
                    readOnly
                    disabled
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="userEmail"
                    className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#252D29]"
                  >
                    <Mail size={17} />
                    Your Email
                  </label>

                  <input
                    id="userEmail"
                    type="email"
                    value={user.email ?? ""}
                    readOnly
                    disabled
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#173F35] px-6 py-3.5 font-semibold text-white transition hover:bg-[#102F28] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={19} className="animate-spin" />
                    Adding Book...
                  </>
                ) : (
                  <>
                    <BookPlus size={19} />
                    Add Book
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};

export default AddBookPage;
