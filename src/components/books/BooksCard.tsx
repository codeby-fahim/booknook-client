import Link from "next/link";

import type { IBook } from "@/lib/type/bookFormData";

import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Copy,
  UserRound,
} from "lucide-react";

const formatDate = (value?: string | Date) => {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const BooksCard = ({ book }: { book: IBook }) => {
  const addedOn = formatDate(book.createdAt);
  const available = Number(book.availableCopies ?? 0);
  const total = Number(book.totalCopies ?? 0);
  const isAvailable = available > 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E7E5DF] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Cover */}
      <div className="relative aspect-4/5 overflow-hidden bg-[#FAF8F3]">
        {book.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.image}
            alt={`${book.title} cover`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#173F35]/30">
            <BookOpen size={56} />
          </div>
        )}

        <span className="absolute top-3 left-3 rounded-full bg-[#E8A85C] px-3 py-1 text-xs font-semibold text-[#252D29] shadow-sm">
          {book.category}
        </span>

        <span
          className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
            isAvailable
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isAvailable ? `${available} available` : "Out of stock"}
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-5">
        <h2
          title={book.title}
          className="line-clamp-2 text-lg font-bold leading-snug text-[#173F35]"
        >
          {book.title}
        </h2>

        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-[#727C75]">
          <UserRound size={15} className="shrink-0" />
          <span className="line-clamp-1">{book.author}</span>
        </p>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#727C75]">
          {book.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#E7E5DF] pt-4 text-xs text-[#727C75]">
          <span className="inline-flex items-center gap-1.5">
            <Copy size={14} />
            {total} {total === 1 ? "copy" : "copies"} total
          </span>

          {addedOn && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={14} />
              {addedOn}
            </span>
          )}
        </div>

        <div className="mt-auto pt-5">
          <Link
            href={`/all-books/${book._id}`}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#173F35] px-4 py-2.5 text-sm font-semibold text-[#173F35] transition hover:bg-[#173F35] hover:text-white"
          >
            View Details
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BooksCard;
