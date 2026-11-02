
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import {
  UserRound,
  Mail,
  Image as ImageIcon,
  LockKeyhole,
  UserPlus,
 
  Loader2,
} from "lucide-react";
import { FaGoogle } from "react-icons/fa";

const SignUpPage = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const image = String(formData.get("image") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    // Password validation
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setPasswordError(
        "Password must contain at least one uppercase letter."
      );
      return;
    }

    if (!/[a-z]/.test(password)) {
      setPasswordError(
        "Password must contain at least one lowercase letter."
      );
      return;
    }

    setPasswordError("");

    try {
      setIsLoading(true);

      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        image,
      });

      if (error) {
        throw new Error(error.message || "Registration failed.");
      }

      toast.success("Registration successful! Please login.");

      router.push("/login");
      router.refresh();

    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      toast.error(message);

    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign In
  const handleGoogleSignUp = async () => {
    try {
      setIsGoogleLoading(true);

      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        throw new Error(error.message || "Google registration failed.");
      }

    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Google login failed.";

      toast.error(message);
      setIsGoogleLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#FAF8F3] px-4 py-12 sm:px-6">

      <div className="w-full max-w-lg">

        {/* Heading */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#173F35]/10 text-[#173F35]">
            <UserPlus size={28} />
          </div>

          <h1 className="text-3xl font-bold text-[#173F35] sm:text-4xl">
            Create an Account
          </h1>

          <p className="mt-3 text-sm leading-7 text-[#727C75] sm:text-base">
            Join BookNook and discover your next favorite book.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-[#E7E5DF] bg-white p-5 shadow-sm sm:p-8">

          <form onSubmit={handleSignUp} className="space-y-5">

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#252D29]"
              >
                <UserRound size={17} />
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                required
                autoComplete="name"
                className="w-full rounded-lg border border-[#E7E5DF] px-4 py-3 text-sm outline-none transition focus:border-[#173F35] focus:ring-2 focus:ring-[#173F35]/10"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#252D29]"
              >
                <Mail size={17} />
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-[#E7E5DF] px-4 py-3 text-sm outline-none transition focus:border-[#173F35] focus:ring-2 focus:ring-[#173F35]/10"
              />
            </div>

            {/* Photo URL */}
            <div>
              <label
                htmlFor="image"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#252D29]"
              >
                <ImageIcon size={17} />
                Profile Photo URL
              </label>

              <input
                id="image"
                name="image"
                type="url"
                placeholder="https://example.com/profile.jpg"
                required
                className="w-full rounded-lg border border-[#E7E5DF] px-4 py-3 text-sm outline-none transition focus:border-[#173F35] focus:ring-2 focus:ring-[#173F35]/10"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#252D29]"
              >
                <LockKeyhole size={17} />
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                required
                autoComplete="new-password"
                onChange={() => setPasswordError("")}
                className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition focus:ring-2 ${
                  passwordError
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                    : "border-[#E7E5DF] focus:border-[#173F35] focus:ring-[#173F35]/10"
                }`}
              />

              {passwordError && (
                <p className="mt-2 text-sm text-red-600">
                  {passwordError}
                </p>
              )}

              <p className="mt-2 text-xs leading-5 text-[#727C75]">
                Password must contain at least 6 characters, one uppercase
                letter and one lowercase letter.
              </p>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#173F35] px-6 py-3.5 font-semibold text-white transition hover:bg-[#102F28] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus size={19} />
                  Register
                </>
              )}
            </button>

          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#E7E5DF]" />
            <span className="text-xs text-[#727C75]">
              OR CONTINUE WITH
            </span>
            <div className="h-px flex-1 bg-[#E7E5DF]" />
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={isLoading || isGoogleLoading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#E7E5DF] px-6 py-3.5 font-semibold text-[#252D29] transition hover:bg-[#FAF8F3] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isGoogleLoading ? (
              <Loader2 size={19} className="animate-spin" />
            ) : (
              <FaGoogle size={20} />
            )}

            Continue with Google
          </button>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-[#727C75]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#173F35] underline-offset-4 hover:underline"
            >
              Login
            </Link>
          </p>

        </div>

        <p className="mt-5 text-center text-xs text-[#727C75]">
          By creating an account, you can explore and share books with BookNook.
        </p>

      </div>
    </section>
  );
};

export default SignUpPage;
