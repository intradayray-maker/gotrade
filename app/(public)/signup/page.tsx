"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const pathname = usePathname();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // BACK TO TOP VISIBILITY HANDLER
  useEffect(() => {
    const btn = document.getElementById("backToTop");
    if (!btn) return;

    const handleScroll = () => {
      if (window.scrollY > 300) btn.style.display = "block";
      else btn.style.display = "none";
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#050509] text-white">

      <div className="mx-auto max-w-6xl px-6 py-20 space-y-16">



        {/* HEADER */}
        <header className="flex items-center justify-between py-2">

          <div className="flex items-center gap-3"></div>

          <nav className="flex items-center gap-6 text-sm text-white/60">

            {/* HOME ICON WITH ACTIVE HIGHLIGHT */}
            <Link
              href="/"
              className="group flex items-center transition relative"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`
                  h-4 w-4 transition
                  ${pathname === "/" 
                    ? "text-emerald-400 drop-shadow-[0_0_6px_rgba(0,255,180,0.6)]" 
                    : "text-white/60"}
                  group-hover:text-white
                  group-hover:-translate-y-[1px]
                `}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h4m6 0h4a1 1 0 001-1V10"
                />
              </svg>

              {pathname === "/" && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-emerald-400 rounded-full shadow-[0_0_6px_rgba(0,255,180,0.6)]"></span>
              )}
            </Link>

            <Link
              href="/how-it-works"
              className={`
                hover:text-white transition relative
                ${pathname === "/how-it-works" ? "text-emerald-400" : ""}
              `}
            >
              How it works
              {pathname === "/how-it-works" && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-emerald-400 rounded-full"></span>
              )}
            </Link>

            <Link
              href="/pricing"
              className={`
                hover:text-white transition relative
                ${pathname === "/pricing" ? "text-emerald-400" : ""}
              `}
            >
              Pricing
              {pathname === "/pricing" && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-emerald-400 rounded-full"></span>
              )}
            </Link>

            <Link
              href="/about"
              className={`
                hover:text-white transition relative
                ${pathname === "/about" ? "text-emerald-400" : ""}
              `}
            >
              About
              {pathname === "/about" && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-emerald-400 rounded-full"></span>
              )}
            </Link>

            <Link
              href="/login"
              className="
                rounded-[6px]
                px-5 py-1.5 text-sm font-semibold
                bg-[rgb(3,82,65)]
                text-[rgb(225,254,234)]
                border border-[rgb(3,82,65)]
                shadow-[0_0_18px_rgba(3,82,65,0.45)]
                transition duration-150
                hover:bg-[rgb(5,100,80)]
                hover:shadow-[0_0_28px_rgba(3,82,65,0.75)]
                hover:-translate-y-[1px]
                cursor-pointer
              "
            >
              Log in
            </Link>

          </nav>

        </header>





        {/* SIGNUP CONTENT */}
        <div className="max-w-md mx-auto space-y-8">

          <h1 className="text-3xl font-bold">Sign Up</h1>


          {/* REQUIREMENTS SECTION */}
          <section className="rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-white/70 space-y-3">
            <h3 className="text-base font-semibold text-white/80">
              Requirements to use this platform
            </h3>

            <ul className="space-y-2 text-white/60 text-sm">
              <li>
                • Must have an active{" "}
                <a
                  href="https://app.alpaca.markets/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-300 hover:text-emerald-200 underline underline-offset-2"
                >
                  Alpaca brokerage account
                </a>
              </li>
              <li>• Must meet Alpaca’s minimum deposit requirements</li>
              <li>• Must be a U.S. resident with a valid U.S. address</li>
              <li>• Must be 18 years or older</li>
              <li>• Trading involves risk, including the potential loss of capital</li>
            </ul>
          </section>


          {/* SIGNUP FORM */}
          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded bg-white/10 border border-white/20"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded bg-white/10 border border-white/20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500">{error}</p>}

            <button
              type="submit"
              className="w-full bg-white text-black py-3 rounded font-semibold"
            >
              Create Account
            </button>
          </form>


          {/* FOOTER LINKS */}
          <div className="text-center mt-4 text-white/60">
            Already have an account?{" "}
            <Link href="/login" className="text-white hover:underline">
              Log in
            </Link>
          </div>

        </div>

      </div>



      {/* BACK TO TOP BUTTON */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        id="backToTop"
        className="
          fixed bottom-6 right-6 z-50
          w-12 h-12
          flex items-center justify-center
          rounded-full
          bg-[rgb(3,82,65)]
          text-[rgb(225,254,234)]
          shadow-[0_0_18px_rgba(3,82,65,0.45)]
          transition duration-150
          hover:bg-[rgb(5,100,80)]
          hover:shadow-[0_0_28px_rgba(3,82,65,0.75)]
          hover:-translate-y-[2px]
          cursor-pointer
          hidden
        "
      >
        ↑
      </button>

    </main>
  );
}
