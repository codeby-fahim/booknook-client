
import {
  Search,
  BookmarkCheck,
  Library,
  RefreshCw,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Easy Book Discovery",
    description:
      "Explore a collection of books and easily find something interesting for your next reading adventure.",
  },
  {
    icon: BookmarkCheck,
    title: "Simple Borrowing",
    description:
      "Borrow your favorite books through a simple and convenient process without unnecessary hassle.",
  },
  {
    icon: Library,
    title: "Manage Your Books",
    description:
      "Keep track of the books you have added and manage your personal book collection in one place.",
  },
  {
    icon: RefreshCw,
    title: "Easy Book Returns",
    description:
      "Return borrowed books easily and make them available for other readers to enjoy.",
  },
];

const WhyChooseUs = () => {
  return (
    <section
      id="why-choose-us"
      className="scroll-mt-24 bg-white px-4 py-16 sm:px-6 md:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-[#E8A85C]/15 px-4 py-2 text-sm font-semibold text-[#173F35]">
            The BookNook Experience
          </span>

          <h2 className="text-3xl font-bold tracking-tight text-[#173F35] sm:text-4xl">
            Why Choose BookNook?
          </h2>

          <p className="mt-4 text-base leading-7 text-[#727C75]">
            More than just a library, BookNook makes discovering,
            borrowing, and managing books easier for every reader.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-[#E7E5DF] bg-[#FAF8F3] p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#173F35]/30 hover:bg-white hover:shadow-xl"
              >
                {/* Icon */}
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#173F35] text-white transition-all duration-300 group-hover:rotate-6 group-hover:bg-[#E8A85C] group-hover:text-[#173F35]">
                  <Icon size={26} strokeWidth={1.8} />
                </div>

                <h3 className="mb-3 text-lg font-bold text-[#173F35]">
                  {feature.title}
                </h3>

                <p className="text-sm leading-7 text-[#727C75]">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
