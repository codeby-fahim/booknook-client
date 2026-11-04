import Link from "next/link";
import { BookOpen, Home } from "lucide-react";

const NotFound = () => {
  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-[#FAF8F3] px-4 py-12">
      <div className="w-full max-w-lg text-center">

        <div className="relative mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-[#173F35]/10">
          <BookOpen size={48} className="text-[#173F35]" />
          <span className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#E8A85C] text-sm font-bold text-white">
            !
          </span>
        </div>

        <h1 className="text-7xl font-extrabold tracking-tight text-[#173F35] sm:text-8xl">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-bold text-[#252D29]">
          Page Not Found
        </h2>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#727C75] sm:text-base">
          Sorry! The page you are looking for does not exist
          or may have been moved.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#173F35] px-7 py-3.5 font-semibold text-white transition hover:bg-[#102F28]"
        >
          <Home size={19} />
          Back to Home
        </Link>

      </div>
    </section>
  );
};

export default NotFound;