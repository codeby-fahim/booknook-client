
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import {
  Mail,
  LockKeyhole,
  LogIn,
  Loader2,
  BookOpen,
} from "lucide-react";
import { FaGoogle } from "react-icons/fa";

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Login-এর পর কোথায় যাবে?
  const callbackURL = searchParams.get("callbackUrl") || "/";

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    try {
      setIsLoading(true);

      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL,
      });

      if (error) {
        throw new Error(error.message || "Login failed.");
      }

      toast.success("Login successful!");

      router.push(callbackURL);
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

  // Google Login
  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);

      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL,
      });

      if (error) {
        throw new Error(error.message || "Google login failed.");
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

      <div className="w-full max-w-md">

        {/* Heading */}
        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#173F35]/10 text-[#173F35]">
            <BookOpen size={28} />
          </div>

          <h1 className="text-3xl font-bold text-[#173F35] sm:text-4xl">
            Welcome Back!
          </h1>

          <p className="mt-3 text-sm leading-7 text-[#727C75] sm:text-base">
            Login to your BookNook account and continue exploring books.
          </p>

        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-[#E7E5DF] bg-white p-5 shadow-sm sm:p-8">

          <form onSubmit={handleLogin} className="space-y-5">

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
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-[#E7E5DF] px-4 py-3 text-sm outline-none transition focus:border-[#173F35] focus:ring-2 focus:ring-[#173F35]/10"
              />

              {/* Forgot Password */}
              <div className="mt-3 flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-[#173F35] underline-offset-4 transition hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#173F35] px-6 py-3.5 font-semibold text-white transition hover:bg-[#102F28] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn size={19} />
                  Login
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

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
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

          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-[#727C75]">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#173F35] underline-offset-4 hover:underline"
            >
              Register
            </Link>
          </p>

        </div>

        <p className="mt-5 text-center text-xs text-[#727C75]">
          Welcome to BookNook — Your little corner of books.
        </p>

      </div>

    </section>
  );
};

export default LoginPage;
