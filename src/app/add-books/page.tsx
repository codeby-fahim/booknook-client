"use client";

import type { FormEvent } from "react";
import {
  BookPlus,
  Image as ImageIcon,
  Library,
  FileText,
} from "lucide-react";

import type { IBookFormData } from "@/lib/type/bookFormData";

const AddBooksPage = () => {
  const handleAddBook = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data: IBookFormData = {
      title: String(formData.get("title") ?? "").trim(),
      author: String(formData.get("author") ?? "").trim(),
      category: String(formData.get("category") ?? ""),
      image: String(formData.get("image") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      totalCopies: Number(formData.get("totalCopies") ?? 0),
    };

    // TODO: persist the book through the books API.
    console.log(data);
  };

  return (
    <section className="min-h-screen bg-[#FAF8F3] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">

        {/* Heading */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#173F35]/10 text-[#173F35]">
            <BookPlus size={28} />
          </div>

          <h1 className="text-3xl font-bold text-[#173F35] sm:text-4xl">
            Add a New Book
          </h1>

          <p className="mt-3 text-sm leading-7 text-[#727C75] sm:text-base">
            Share a new book with our library and let others discover it.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-[#E7E5DF] bg-white p-5 shadow-sm sm:p-8">

          <form onSubmit={handleAddBook} className="space-y-6">

            {/* Book Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-semibold text-[#252D29]"
              >
                Book Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                placeholder="Enter book title"
                required
                className="w-full rounded-lg border border-[#E7E5DF] bg-white px-4 py-3 text-sm text-[#252D29] outline-none transition focus:border-[#173F35] focus:ring-2 focus:ring-[#173F35]/10"
              />
            </div>

            {/* Author and Category */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

              <div>
                <label
                  htmlFor="author"
                  className="mb-2 block text-sm font-semibold text-[#252D29]"
                >
                  Author Name
                </label>

                <input
                  id="author"
                  name="author"
                  type="text"
                  placeholder="Enter author name"
                  required
                  className="w-full rounded-lg border border-[#E7E5DF] px-4 py-3 text-sm outline-none transition focus:border-[#173F35] focus:ring-2 focus:ring-[#173F35]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-semibold text-[#252D29]"
                >
                  Category
                </label>

                <select
                  id="category"
                  name="category"
                  required
                  defaultValue=""
                  className="w-full rounded-lg border border-[#E7E5DF] bg-white px-4 py-3 text-sm text-[#727C75] outline-none transition focus:border-[#173F35] focus:ring-2 focus:ring-[#173F35]/10"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  <option value="Science">Science</option>
                  <option value="Technology">Technology</option>
                  <option value="Programming">Programming</option>
                  <option value="Fiction">Fiction</option>
                  <option value="History">History</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
              </div>

            </div>

            {/* Image URL */}
            <div>
              <label
                htmlFor="image"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#252D29]"
              >
                <ImageIcon size={17} />
                Book Cover Image URL
              </label>

              <input
                id="image"
                name="image"
                type="url"
                placeholder="https://example.com/book.jpg"
                required
                className="w-full rounded-lg border border-[#E7E5DF] px-4 py-3 text-sm outline-none transition focus:border-[#173F35] focus:ring-2 focus:ring-[#173F35]/10"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#252D29]"
              >
                <FileText size={17} />
                Book Description
              </label>

              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Write a short description about this book..."
                required
                className="w-full resize-y rounded-lg border border-[#E7E5DF] px-4 py-3 text-sm outline-none transition focus:border-[#173F35] focus:ring-2 focus:ring-[#173F35]/10"
              />
            </div>

            {/* Total Copies */}
            <div>
              <label
                htmlFor="totalCopies"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#252D29]"
              >
                <Library size={17} />
                Total Copies
              </label>

              <input
                id="totalCopies"
                name="totalCopies"
                type="number"
                min={1}
                placeholder="Enter total copies"
                required
                className="w-full rounded-lg border border-[#E7E5DF] px-4 py-3 text-sm outline-none transition focus:border-[#173F35] focus:ring-2 focus:ring-[#173F35]/10"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#173F35] px-6 py-3.5 font-semibold text-white transition hover:bg-[#102F28] hover:shadow-lg"
            >
              <BookPlus size={19} />
              Add Book to Library
            </button>

          </form>
        </div>

        <p className="mt-5 text-center text-xs text-[#727C75]">
          Please provide accurate information about your book.
        </p>

      </div>
    </section>
  );
};

export default AddBooksPage;
