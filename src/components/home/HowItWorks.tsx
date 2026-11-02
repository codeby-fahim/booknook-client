
import Link from "next/link";
import {
  BookPlus,
  BookOpen,
  RotateCcw,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: BookPlus,
    title: "Add a Book",
    description:
      "Add your favorite books to BookNook and build a growing collection for everyone to explore.",
  },
  {
    number: "02",
    icon: BookOpen,
    title: "Borrow a Book",
    description:
      "Discover interesting books and borrow the ones you love for a few days to enjoy reading.",
  },
  {
    number: "03",
    icon: RotateCcw,
    title: "Return a Book",
    description:
      "Finished reading? Simply return your borrowed book so someone else can enjoy it too.",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-[#FAF8F3] px-4 py-16 sm:px-6 md:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-[#E8A85C]/15 px-4 py-2 text-sm font-semibold text-[#173F35]">
            Simple Process
          </span>

          <h2 className="text-3xl font-bold tracking-tight text-[#173F35] sm:text-4xl">
            How BookNook Works
          </h2>

          <p className="mt-4 text-base leading-7 text-[#727C75]">
            Enjoy a simple way to manage your reading journey.
            Just follow three easy steps to discover, borrow,
            and return your favorite books.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="group relative rounded-2xl border border-[#E7E5DF] bg-white p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#173F35]/30 hover:shadow-xl sm:p-8"
              >
                {/* Number */}
                <span className="absolute right-7 top-7 text-3xl font-bold text-[#E7E5DF] transition-colors group-hover:text-[#E8A85C]">
                  {step.number}
                </span>

                {/* Icon */}
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#173F35]/10 text-[#173F35] transition-colors duration-300 group-hover:bg-[#173F35] group-hover:text-white">
                  <Icon size={27} strokeWidth={1.8} />
                </div>

                <h3 className="mb-3 text-xl font-bold text-[#173F35]">
                  {step.title}
                </h3>

                <p className="text-sm leading-7 text-[#727C75]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 rounded-lg bg-[#173F35] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#102F28]"
          >
            Explore Books
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;






