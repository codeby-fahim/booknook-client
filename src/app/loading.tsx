import { LoaderCircle, BookOpen } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#FAF8F3]">
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#173F35]/10">
        <BookOpen size={30} className="text-[#173F35]" />
        <LoaderCircle
          size={64}
          className="absolute animate-spin text-[#E8A85C]"
        />
      </div>

      <div className="text-center">
        <h2 className="text-lg font-semibold text-[#173F35]">
          Loading BookNook...
        </h2>
        <p className="mt-1 text-sm text-[#727C75]">
          Please wait while we load your books.
        </p>
      </div>
    </div>
  );
};

export default Loading;