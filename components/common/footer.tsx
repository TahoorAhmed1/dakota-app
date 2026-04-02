"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import logo from "@/assets/logo-black.png";

function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message ?? "You are subscribed.");
        setEmail("");
      } else {
        toast.error(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Newsletter signup error:", error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Social media icons with correct SVGs
  const socialLinks = [
    {
      name: "Facebook",
      href: "https://facebook.com/yourpage", // replace with actual URL
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      name: "Twitter",
      href: "https://twitter.com/yourpage", // replace with actual URL
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://instagram.com/yourpage", // replace with actual URL
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.311.975.975 1.249 2.242 1.311 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.336 2.633-1.311 3.608-.975.975-2.242 1.249-3.608 1.311-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.336-3.608-1.311-.975-.975-1.249-2.242-1.311-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.336-2.633 1.311-3.608.975-.975 2.242-1.249 3.608-1.311 1.266-.058 1.646-.07 4.85-.07zM12 7.378c-2.552 0-4.622 2.07-4.622 4.622S9.448 16.622 12 16.622s4.622-2.07 4.622-4.622S14.552 7.378 12 7.378zm0 7.5c-1.589 0-2.878-1.289-2.878-2.878S10.411 9.122 12 9.122s2.878 1.289 2.878 2.878-1.289 2.878-2.878 2.878zm4.832-7.928c0 .596-.483 1.079-1.079 1.079s-1.079-.483-1.079-1.079.483-1.079 1.079-1.079 1.079.483 1.079 1.079z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "https://youtube.com/yourpage", // replace with actual URL
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="Footerback relative bg-cover bg-center py-10 text-black sm:py-12">
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mt-10 flex flex-col items-center text-center sm:mt-20">
          <Image
            src={logo}
            alt="U Guide"
            className="mb-2 h-auto w-48 max-w-full sm:w-64"
            priority={false}
          />

          <div className="ml-2 flex items-center justify-between gap-4 sm:gap-6">
            {socialLinks.map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white transition-colors duration-300 hover:bg-[#8a5326]"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="my-7 border-t border-black/40" />

        <div className="grid gap-8 md:grid-cols-[1fr_1fr_1.24fr] md:gap-10 lg:gap-14.5">
          <div>
            <h3 className="mb-3.5 text-[20px] font-semibold leading-none tracking-[-0.02em] sm:text-[23px]">Contact</h3>
            <p className="text-[16px] leading-[1.8] tracking-[-0.02em] text-black/88 sm:text-[18px] sm:leading-[2.05]">
              021 Hollywood Boulevard, LA <br />
              customer@example.com <br />
              (021) 345-6789
            </p>
          </div>

          <div>
            <h3 className="mb-3.5 text-[20px] font-semibold leading-none tracking-[-0.02em] sm:text-[23px]">Services</h3>
            <ul className="space-y-0.5 text-[16px] leading-[1.65] tracking-[-0.02em] text-black/88 sm:text-[18px] sm:leading-[1.9]">
              <li>Availability</li>
              <li>Quote-Reserve</li>
              <li>UGUIDE Pheasant Outlook</li>
              <li>Day Use</li>
              <li>Rates</li>
              <li>Discounts</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3.5 text-[20px] font-semibold leading-none tracking-[-0.02em] sm:text-[23px]">Newsletters</h3>
            <p className="mb-4.5 text-[16px] leading-[1.55] tracking-[-0.02em] text-black/88 sm:text-[18px] sm:leading-[1.65]">
              Sign up your email and get news and updates
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex w-full max-w-87.5 flex-col gap-3 rounded-lg bg-white p-3 shadow-[0_1px_0_rgba(0,0,0,0.05)] sm:h-14.5 sm:flex-row sm:items-center sm:gap-0 sm:px-2.5 sm:py-2"
            >
              <input
                type="email"
                placeholder="Your email here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-w-0 flex-1 border-b border-black/55 px-0.5 pb-px text-[16px] tracking-[-0.02em] text-black placeholder:text-black/55 focus:border-black focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 sm:h-full sm:text-[18px]"
                disabled={isSubmitting}
                aria-label="Email address"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-10.5 shrink-0 items-center justify-center rounded-sm bg-black px-5 text-[13px] font-semibold tracking-[0.18em] text-white transition-colors duration-300 hover:bg-[#241206] disabled:cursor-not-allowed disabled:opacity-50 sm:ml-2.5 sm:text-[14px]"
              >
                {isSubmitting ? "SUBMITTING" : "SUBSCRIBE"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="relative z-10 mx-auto max-w-243.5 px-6 sm:px-10 lg:px-0">
        <div className="border-t border-black/40" />
      </div>
      <p className="relative z-10 pb-2.5 pt-4.5 text-center text-[15px] tracking-[-0.01em] text-black/85">
        © 2026 UGUIDE South Dakota Pheasant Hunting®
      </p>
    </footer>
  );
}

export default Footer;